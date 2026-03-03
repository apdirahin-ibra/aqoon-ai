import { query } from "./_generated/server";
import { requireAdmin, requireAuth, requireTutor } from "./helpers";

// ─── Student dashboard stats ──────────────────────────────────────────────────
export const studentStats = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const activeEnrollments = enrollments.filter((e) => e.status === "active");
    const completedEnrollments = enrollments.filter(
      (e) => e.status === "completed",
    );

    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const quizAttempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + a.score, 0) /
              quizAttempts.length,
          )
        : 0;

    return {
      enrolledCourses: activeEnrollments.length,
      completedCourses: completedEnrollments.length,
      certificates: certificates.length,
      avgQuizScore,
      totalQuizAttempts: quizAttempts.length,
    };
  },
});

// ─── Tutor dashboard stats ───────────────────────────────────────────────────
export const tutorStats = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireTutor(ctx);

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
      .collect();

    const courseIds = courses.map((c) => c._id);

    let totalEnrollments = 0;
    let totalRevenue = 0;
    let totalReviews = 0;
    let totalRating = 0;

    for (const courseId of courseIds) {
      const enrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      totalEnrollments += enrollments.length;

      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      totalReviews += reviews.length;
      totalRating += reviews.reduce((sum, r) => sum + r.rating, 0);
    }

    const payouts = await ctx.db
      .query("payouts")
      .withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
      .collect();

    totalRevenue = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amountCents, 0);

    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.isPublished).length,
      totalEnrollments,
      totalRevenueCents: totalRevenue,
      avgRating:
        totalReviews > 0
          ? Math.round((totalRating / totalReviews) * 10) / 10
          : 0,
      totalReviews,
    };
  },
});

// ─── Admin dashboard stats ───────────────────────────────────────────────────
export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const payments = await ctx.db.query("payments").collect();

    const successfulPayments = payments.filter((p) => p.status === "succeeded");
    const totalRevenue = successfulPayments.reduce(
      (sum, p) => sum + p.amountCents,
      0,
    );

    return {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.role === "student").length,
      totalTutors: users.filter((u) => u.role === "tutor").length,
      totalAdmins: users.filter((u) => u.role === "admin").length,
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.isPublished).length,
      totalEnrollments: enrollments.length,
      totalRevenueCents: totalRevenue,
      totalPayments: payments.length,
    };
  },
});

// ─── Admin analytics – top courses & tutors ─────────────────────────────────
export const adminAnalytics = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const courses = await ctx.db.query("courses").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const reviews = await ctx.db.query("reviews").collect();

    // Top courses by enrollment
    const courseEnrollments = new Map<string, number>();
    for (const e of enrollments) {
      courseEnrollments.set(
        e.courseId,
        (courseEnrollments.get(e.courseId) ?? 0) + 1,
      );
    }

    // Course ratings
    const courseRatings = new Map<string, number[]>();
    for (const r of reviews) {
      const existing = courseRatings.get(r.courseId) ?? [];
      existing.push(r.rating);
      courseRatings.set(r.courseId, existing);
    }

    const topCourses = await Promise.all(
      courses
        .map((c) => ({
          courseId: c._id,
          title: c.title,
          tutorId: c.tutorId,
          enrollments: courseEnrollments.get(c._id) ?? 0,
          ratings: courseRatings.get(c._id) ?? [],
        }))
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, 10)
        .map(async (c) => {
          const tutor = await ctx.db.get(c.tutorId);
          return {
            courseId: c.courseId,
            title: c.title,
            tutorName: tutor?.name ?? "Unknown",
            enrollments: c.enrollments,
            avgRating:
              c.ratings.length > 0
                ? Math.round(
                    (c.ratings.reduce((s, r) => s + r, 0) / c.ratings.length) *
                      10,
                  ) / 10
                : 0,
          };
        }),
    );

    // Top tutors by students
    const tutorStudents = new Map<string, Set<string>>();
    const tutorCourses = new Map<string, number>();

    for (const course of courses) {
      tutorCourses.set(
        course.tutorId,
        (tutorCourses.get(course.tutorId) ?? 0) + 1,
      );
      const ce = enrollments.filter((e) => e.courseId === course._id);
      for (const e of ce) {
        if (!tutorStudents.has(course.tutorId)) {
          tutorStudents.set(course.tutorId, new Set());
        }
        tutorStudents.get(course.tutorId)!.add(e.userId);
      }
    }

    const tutorIds = [...tutorStudents.keys()];
    const topTutors = await Promise.all(
      tutorIds
        .map((id) => ({
          tutorId: id,
          totalStudents: tutorStudents.get(id)?.size ?? 0,
          courseCount: tutorCourses.get(id) ?? 0,
        }))
        .sort((a, b) => b.totalStudents - a.totalStudents)
        .slice(0, 10)
        .map(async (t) => {
          const tutor = await ctx.db.get(t.tutorId as any);
          return {
            tutorId: t.tutorId,
            name: (tutor as any)?.name ?? "Unknown",
            totalStudents: t.totalStudents,
            courseCount: t.courseCount,
          };
        }),
    );

    return { topCourses, topTutors };
  },
});

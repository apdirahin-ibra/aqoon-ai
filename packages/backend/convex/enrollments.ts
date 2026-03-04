import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireStudent } from "./helpers";

// ─── Enroll in a course ───────────────────────────────────────────────────────
export const enroll = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const { user } = await requireStudent(ctx);
    if (!user) throw new Error("User profile not found");

    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found");
    if (!course.isPublished) throw new Error("Course is not published");

    // Check if already enrolled
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId),
      )
      .unique();

    if (existing) {
      if (existing.status === "dropped") {
        // Re-enroll
        await ctx.db.patch(existing._id, {
          status: "active",
          enrolledAt: Date.now(),
          completedAt: undefined,
        });
        return existing._id;
      }
      throw new Error("Already enrolled in this course");
    }

    // Premium courses require payment verification
    if (course.isPremium) {
      const payment = await ctx.db
        .query("payments")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      const validPayment = payment.find(
        (p) => p.courseId === args.courseId && p.status === "succeeded",
      );

      if (!validPayment) {
        throw new Error(
          "Payment required. Please purchase this course before enrolling.",
        );
      }
    }

    const enrollmentId = await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId: args.courseId,
      enrolledAt: Date.now(),
      status: "active",
    });

    // Log audit event
    await ctx.scheduler.runAfter(0, internal.auditLogs.log, {
      userId: user._id,
      userName: user.name ?? "Unknown",
      action: "Enrolled in course",
      details: `Enrolled in "${course.title}"`,
      category: "course",
    });

    // Notify tutor about new enrollment
    if (course.tutorId) {
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        userId: course.tutorId,
        type: "course",
        title: "New Student Enrolled",
        message: `${user.name ?? "A student"} enrolled in "${course.title}"`,
        link: "/tutor/students",
      });
    }

    return enrollmentId;
  },
});

// ─── Check enrollment status ──────────────────────────────────────────────────
export const check = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) return { enrolled: false };

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", args.courseId),
      )
      .unique();

    if (!enrollment || enrollment.status === "dropped") {
      return { enrolled: false };
    }

    return { enrolled: true, status: enrollment.status };
  },
});

// ─── List my enrollments with progress (batched — no N+1) ────────────────────
export const myEnrollments = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuth(ctx);
    if (!user) return [];

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const active = enrollments.filter((e) => e.status !== "dropped");
    if (active.length === 0) return [];

    // Batch: fetch ALL lessonProgress for this user once
    const allProgress = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedLessonIds = new Set(
      allProgress.filter((p) => p.completed).map((p) => p.lessonId),
    );

    const enriched = await Promise.all(
      active.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        if (!course) return null;

        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();

        // Sort by orderIndex so first lesson is at index 0
        lessons.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        const firstLessonId = lessons[0]?._id ?? null;

        const completedForCourse = lessons.filter((l) =>
          completedLessonIds.has(l._id),
        ).length;

        const progress =
          lessons.length > 0
            ? Math.round((completedForCourse / lessons.length) * 100)
            : 0;

        const tutor = await ctx.db.get(course.tutorId);

        return {
          ...enrollment,
          course: {
            ...course,
            tutorName: tutor?.name ?? "Unknown",
          },
          progress,
          lessonCount: lessons.length,
          completedLessonCount: completedForCourse,
          firstLessonId,
        };
      }),
    );

    return enriched.filter(Boolean);
  },
});

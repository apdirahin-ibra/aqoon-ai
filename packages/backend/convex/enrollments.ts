import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Enroll in a course ───────────────────────────────────────────────────────
export const enroll = mutation({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
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
                (p) =>
                    p.courseId === args.courseId && p.status === "succeeded",
            );

            if (!validPayment) {
                throw new Error(
                    "Payment required. Please purchase this course before enrolling.",
                );
            }
        }

        return await ctx.db.insert("enrollments", {
            userId: user._id,
            courseId: args.courseId,
            enrolledAt: Date.now(),
            status: "active",
        });
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

// ─── List my enrollments with progress ────────────────────────────────────────
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

        const enriched = await Promise.all(
            active.map(async (enrollment) => {
                const course = await ctx.db.get(enrollment.courseId);
                if (!course) return null;

                // Calculate progress
                const lessons = await ctx.db
                    .query("lessons")
                    .withIndex("by_course", (q) => q.eq("courseId", course._id))
                    .collect();

                const completedLessons = await ctx.db
                    .query("lessonProgress")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .collect();

                const completedForCourse = completedLessons.filter(
                    (p) =>
                        p.completed &&
                        lessons.some((l) => l._id === p.lessonId),
                );

                const progress =
                    lessons.length > 0
                        ? Math.round((completedForCourse.length / lessons.length) * 100)
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
                    completedLessonCount: completedForCourse.length,
                };
            }),
        );

        return enriched.filter(Boolean);
    },
});

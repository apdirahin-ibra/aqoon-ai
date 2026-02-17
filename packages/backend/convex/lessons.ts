import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalAuth, requireAuth } from "./helpers";

// ─── List lessons for a course ────────────────────────────────────────────────
export const listByCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course_order", (q) => q.eq("courseId", args.courseId))
            .collect();

        // Sort by orderIndex
        lessons.sort((a, b) => a.orderIndex - b.orderIndex);

        // Check if user is enrolled for completion status
        const auth = await optionalAuth(ctx);
        let completionMap: Record<string, boolean> = {};

        if (auth) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", auth.email))
                .unique();

            if (user) {
                const progress = await ctx.db
                    .query("lessonProgress")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .collect();

                for (const p of progress) {
                    completionMap[p.lessonId] = p.completed;
                }
            }
        }

        return lessons.map((lesson) => ({
            _id: lesson._id,
            title: lesson.title,
            orderIndex: lesson.orderIndex,
            durationMinutes: lesson.durationMinutes,
            isPreview: lesson.isPreview,
            completed: completionMap[lesson._id] ?? false,
        }));
    },
});

// ─── Get lesson content (auth-gated) ──────────────────────────────────────────
export const get = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const lesson = await ctx.db.get(args.lessonId);
        if (!lesson) return null;

        // Preview lessons are always accessible
        if (lesson.isPreview) {
            return lesson;
        }

        // Otherwise, require authentication
        const auth = await optionalAuth(ctx);
        if (!auth) {
            return {
                ...lesson,
                content: "",
                accessDenied: true,
                reason: "Authentication required",
            };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", auth.email))
            .unique();

        if (!user) {
            return {
                ...lesson,
                content: "",
                accessDenied: true,
                reason: "User profile not found",
            };
        }

        // Admin and course tutor always have access
        const course = await ctx.db.get(lesson.courseId);
        if (
            user.role === "admin" ||
            (course && course.tutorId === user._id)
        ) {
            return lesson;
        }

        // Check enrollment
        const enrollment = await ctx.db
            .query("enrollments")
            .withIndex("by_user_course", (q) =>
                q.eq("userId", user._id).eq("courseId", lesson.courseId),
            )
            .unique();

        if (!enrollment || enrollment.status === "dropped") {
            return {
                ...lesson,
                content: "",
                accessDenied: true,
                reason: "Enrollment required",
            };
        }

        return lesson;
    },
});

// ─── Create lesson ────────────────────────────────────────────────────────────
export const create = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.string(),
        content: v.string(),
        orderIndex: v.number(),
        durationMinutes: v.optional(v.number()),
        isPreview: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const course = await ctx.db.get(args.courseId);
        if (!course) throw new Error("Course not found");

        // Owner or admin
        if (user.role !== "admin" && course.tutorId !== user._id) {
            throw new Error("Access denied");
        }

        return await ctx.db.insert("lessons", {
            courseId: args.courseId,
            title: args.title,
            content: args.content,
            orderIndex: args.orderIndex,
            durationMinutes: args.durationMinutes,
            isPreview: args.isPreview ?? false,
        });
    },
});

// ─── Update lesson ────────────────────────────────────────────────────────────
export const update = mutation({
    args: {
        lessonId: v.id("lessons"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        orderIndex: v.optional(v.number()),
        durationMinutes: v.optional(v.number()),
        isPreview: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const lesson = await ctx.db.get(args.lessonId);
        if (!lesson) throw new Error("Lesson not found");

        const course = await ctx.db.get(lesson.courseId);
        if (!course) throw new Error("Course not found");

        if (user.role !== "admin" && course.tutorId !== user._id) {
            throw new Error("Access denied");
        }

        const { lessonId, ...updates } = args;
        await ctx.db.patch(lessonId, updates);
        return lessonId;
    },
});

// ─── Delete lesson ────────────────────────────────────────────────────────────
export const remove = mutation({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const lesson = await ctx.db.get(args.lessonId);
        if (!lesson) throw new Error("Lesson not found");

        const course = await ctx.db.get(lesson.courseId);
        if (!course) throw new Error("Course not found");

        if (user.role !== "admin" && course.tutorId !== user._id) {
            throw new Error("Access denied");
        }

        await ctx.db.delete(args.lessonId);
        return args.lessonId;
    },
});

// ─── Reorder lessons ──────────────────────────────────────────────────────────
export const reorder = mutation({
    args: {
        courseId: v.id("courses"),
        lessonIds: v.array(v.id("lessons")),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const course = await ctx.db.get(args.courseId);
        if (!course) throw new Error("Course not found");

        if (user.role !== "admin" && course.tutorId !== user._id) {
            throw new Error("Access denied");
        }

        // Update each lesson's orderIndex
        for (let i = 0; i < args.lessonIds.length; i++) {
            await ctx.db.patch(args.lessonIds[i], { orderIndex: i });
        }

        return true;
    },
});

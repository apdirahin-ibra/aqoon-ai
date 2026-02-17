import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Mark lesson complete ─────────────────────────────────────────────────────
export const markComplete = mutation({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        // Check if progress record exists
        const existing = await ctx.db
            .query("lessonProgress")
            .withIndex("by_user_lesson", (q) =>
                q.eq("userId", user._id).eq("lessonId", args.lessonId),
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                completed: true,
                completedAt: Date.now(),
            });
            return existing._id;
        }

        return await ctx.db.insert("lessonProgress", {
            userId: user._id,
            lessonId: args.lessonId,
            completed: true,
            completedAt: Date.now(),
        });
    },
});

// ─── Toggle lesson completion ─────────────────────────────────────────────────
export const toggleComplete = mutation({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const existing = await ctx.db
            .query("lessonProgress")
            .withIndex("by_user_lesson", (q) =>
                q.eq("userId", user._id).eq("lessonId", args.lessonId),
            )
            .unique();

        if (existing) {
            const newCompleted = !existing.completed;
            await ctx.db.patch(existing._id, {
                completed: newCompleted,
                completedAt: newCompleted ? Date.now() : undefined,
            });
            return { completed: newCompleted };
        }

        await ctx.db.insert("lessonProgress", {
            userId: user._id,
            lessonId: args.lessonId,
            completed: true,
            completedAt: Date.now(),
        });
        return { completed: true };
    },
});

// ─── Get course progress percentage ───────────────────────────────────────────
export const getCourseProgress = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) return { progress: 0, completed: 0, total: 0 };

        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();

        if (lessons.length === 0) {
            return { progress: 0, completed: 0, total: 0 };
        }

        const progressRecords = await ctx.db
            .query("lessonProgress")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const completedCount = progressRecords.filter(
            (p) =>
                p.completed && lessons.some((l) => l._id === p.lessonId),
        ).length;

        return {
            progress: Math.round((completedCount / lessons.length) * 100),
            completed: completedCount,
            total: lessons.length,
        };
    },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireAdmin } from "./helpers";

// ─── Create review ────────────────────────────────────────────────────────────
export const create = mutation({
    args: {
        courseId: v.id("courses"),
        rating: v.number(),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        if (args.rating < 1 || args.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        // Verify enrollment
        const enrollment = await ctx.db
            .query("enrollments")
            .withIndex("by_user_course", (q) =>
                q.eq("userId", user._id).eq("courseId", args.courseId),
            )
            .unique();

        if (!enrollment || enrollment.status === "dropped") {
            throw new Error("You must be enrolled to leave a review");
        }

        // Check for existing review
        const existing = await ctx.db
            .query("reviews")
            .withIndex("by_user_course", (q) =>
                q.eq("userId", user._id).eq("courseId", args.courseId),
            )
            .unique();

        if (existing) {
            throw new Error("You have already reviewed this course");
        }

        return await ctx.db.insert("reviews", {
            userId: user._id,
            courseId: args.courseId,
            rating: args.rating,
            comment: args.comment,
            createdAt: Date.now(),
        });
    },
});

// ─── List reviews for a course ────────────────────────────────────────────────
export const listByCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();

        const enriched = await Promise.all(
            reviews.map(async (review) => {
                const user = await ctx.db.get(review.userId);
                return {
                    ...review,
                    userName: user?.name ?? "Anonymous",
                    userImage: user?.image,
                };
            }),
        );

        return enriched.sort((a, b) => b.createdAt - a.createdAt);
    },
});

// ─── Delete review (own or admin) ─────────────────────────────────────────────
export const remove = mutation({
    args: { reviewId: v.id("reviews") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const review = await ctx.db.get(args.reviewId);
        if (!review) throw new Error("Review not found");

        if (user.role !== "admin" && review.userId !== user._id) {
            throw new Error("Access denied");
        }

        await ctx.db.delete(args.reviewId);
        return args.reviewId;
    },
});

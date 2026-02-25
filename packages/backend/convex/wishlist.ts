import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Toggle wishlist ──────────────────────────────────────────────────────────
export const toggle = mutation({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const existing = await ctx.db
			.query("wishlist")
			.withIndex("by_user_course", (q) =>
				q.eq("userId", user._id).eq("courseId", args.courseId),
			)
			.unique();

		if (existing) {
			await ctx.db.delete(existing._id);
			return { wishlisted: false };
		}

		await ctx.db.insert("wishlist", {
			userId: user._id,
			courseId: args.courseId,
			addedAt: Date.now(),
		});
		return { wishlisted: true };
	},
});

// ─── List user's wishlist ─────────────────────────────────────────────────────
export const list = query({
	args: {},
	handler: async (ctx) => {
		const { user } = await requireAuth(ctx);
		if (!user) return [];

		const items = await ctx.db
			.query("wishlist")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();

		const enriched = await Promise.all(
			items.map(async (item) => {
				const course = await ctx.db.get(item.courseId);
				if (!course) return null;

				const tutor = await ctx.db.get(course.tutorId);
				return {
					...item,
					course: {
						...course,
						tutorName: tutor?.name ?? "Unknown",
					},
				};
			}),
		);

		return enriched.filter(Boolean);
	},
});

// ─── Check if course is in wishlist ───────────────────────────────────────────
export const check = query({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) return { wishlisted: false };

		const existing = await ctx.db
			.query("wishlist")
			.withIndex("by_user_course", (q) =>
				q.eq("userId", user._id).eq("courseId", args.courseId),
			)
			.unique();

		return { wishlisted: !!existing };
	},
});

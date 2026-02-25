import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
	optionalAuth,
	requireAdmin,
	requireAuth,
	requireTutor,
} from "./helpers";

// ─── List published courses (public) ──────────────────────────────────────────
export const listPublic = query({
	args: {
		category: v.optional(v.string()),
		level: v.optional(v.string()),
		search: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		let coursesQuery;

		if (args.category) {
			coursesQuery = ctx.db
				.query("courses")
				.withIndex("by_category", (q) => q.eq("category", args.category!));
		} else {
			coursesQuery = ctx.db
				.query("courses")
				.withIndex("by_published", (q) => q.eq("isPublished", true));
		}

		const courses = await coursesQuery.collect();

		// Filter to published only (if queried by category, need to re-check)
		let filtered = courses.filter((c) => c.isPublished);

		// Apply level filter
		if (args.level) {
			filtered = filtered.filter((c) => c.level === args.level);
		}

		// Apply search filter
		if (args.search) {
			const searchLower = args.search.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(searchLower) ||
					c.description?.toLowerCase().includes(searchLower),
			);
		}

		// Enrich with tutor info and stats
		const enriched = await Promise.all(
			filtered.map(async (course) => {
				const tutor = await ctx.db.get(course.tutorId);
				const enrollments = await ctx.db
					.query("enrollments")
					.withIndex("by_course", (q) => q.eq("courseId", course._id))
					.collect();
				const reviews = await ctx.db
					.query("reviews")
					.withIndex("by_course", (q) => q.eq("courseId", course._id))
					.collect();
				const avgRating =
					reviews.length > 0
						? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
						: 0;

				return {
					...course,
					tutorName: tutor?.name ?? "Unknown",
					tutorImage: tutor?.image,
					enrollmentCount: enrollments.length,
					avgRating,
					reviewCount: reviews.length,
				};
			}),
		);

		return enriched;
	},
});

// ─── Get course detail ────────────────────────────────────────────────────────
export const get = query({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const course = await ctx.db.get(args.courseId);
		if (!course) return null;

		// If not published, only tutor or admin can see it
		if (!course.isPublished) {
			const auth = await optionalAuth(ctx);
			if (!auth) return null;

			const user = await ctx.db
				.query("users")
				.withIndex("by_email", (q) => q.eq("email", auth.email))
				.unique();

			if (!user) return null;
			if (user.role !== "admin" && user._id !== course.tutorId) return null;
		}

		// Enrich with related data
		const tutor = await ctx.db.get(course.tutorId);
		const lessons = await ctx.db
			.query("lessons")
			.withIndex("by_course", (q) => q.eq("courseId", course._id))
			.collect();
		const enrollments = await ctx.db
			.query("enrollments")
			.withIndex("by_course", (q) => q.eq("courseId", course._id))
			.collect();
		const reviews = await ctx.db
			.query("reviews")
			.withIndex("by_course", (q) => q.eq("courseId", course._id))
			.collect();

		const avgRating =
			reviews.length > 0
				? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
				: 0;

		return {
			...course,
			tutorName: tutor?.name ?? "Unknown",
			tutorImage: tutor?.image,
			lessonCount: lessons.length,
			enrollmentCount: enrollments.length,
			avgRating,
			reviewCount: reviews.length,
			totalDuration: lessons.reduce(
				(sum, l) => sum + (l.durationMinutes ?? 0),
				0,
			),
		};
	},
});

// ─── List tutor's own courses ─────────────────────────────────────────────────
export const listByTutor = query({
	args: {},
	handler: async (ctx) => {
		const { user } = await requireTutor(ctx);

		const courses = await ctx.db
			.query("courses")
			.withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
			.collect();

		const enriched = await Promise.all(
			courses.map(async (course) => {
				const enrollments = await ctx.db
					.query("enrollments")
					.withIndex("by_course", (q) => q.eq("courseId", course._id))
					.collect();
				const reviews = await ctx.db
					.query("reviews")
					.withIndex("by_course", (q) => q.eq("courseId", course._id))
					.collect();
				const avgRating =
					reviews.length > 0
						? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
						: 0;

				return {
					...course,
					enrollmentCount: enrollments.length,
					avgRating,
					reviewCount: reviews.length,
				};
			}),
		);

		return enriched;
	},
});

// ─── Create course ────────────────────────────────────────────────────────────
export const create = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		category: v.string(),
		level: v.string(),
		isPremium: v.boolean(),
		priceCents: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { user } = await requireTutor(ctx);

		const now = Date.now();
		return await ctx.db.insert("courses", {
			...args,
			tutorId: user._id,
			isPublished: false,
			createdAt: now,
			updatedAt: now,
		});
	},
});

// ─── Update course ────────────────────────────────────────────────────────────
export const update = mutation({
	args: {
		courseId: v.id("courses"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		category: v.optional(v.string()),
		level: v.optional(v.string()),
		isPremium: v.optional(v.boolean()),
		priceCents: v.optional(v.number()),
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

		const { courseId, ...updates } = args;
		await ctx.db.patch(courseId, {
			...updates,
			updatedAt: Date.now(),
		});
		return courseId;
	},
});

// ─── Delete course (admin only) ───────────────────────────────────────────────
export const remove = mutation({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const course = await ctx.db.get(args.courseId);
		if (!course) throw new Error("Course not found");

		await ctx.db.delete(args.courseId);
		return args.courseId;
	},
});

// ─── Publish course ───────────────────────────────────────────────────────────
export const publish = mutation({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const course = await ctx.db.get(args.courseId);
		if (!course) throw new Error("Course not found");

		if (user.role !== "admin" && course.tutorId !== user._id) {
			throw new Error("Access denied");
		}

		await ctx.db.patch(args.courseId, {
			isPublished: true,
			updatedAt: Date.now(),
		});
		return args.courseId;
	},
});

// ─── Unpublish course ─────────────────────────────────────────────────────────
export const unpublish = mutation({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const course = await ctx.db.get(args.courseId);
		if (!course) throw new Error("Course not found");

		if (user.role !== "admin" && course.tutorId !== user._id) {
			throw new Error("Access denied");
		}

		await ctx.db.patch(args.courseId, {
			isPublished: false,
			updatedAt: Date.now(),
		});
		return args.courseId;
	},
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Generate upload URL (auth-gated) ─────────────────────────────────────────
export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		return await ctx.storage.generateUploadUrl();
	},
});

// ─── Resolve storageId to URL ─────────────────────────────────────────────────
export const getFileUrl = query({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, args) => {
		return await ctx.storage.getUrl(args.storageId);
	},
});

// ─── Save profile image ──────────────────────────────────────────────────────
export const saveProfileImage = mutation({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const url = await ctx.storage.getUrl(args.storageId);
		if (!url) throw new Error("Failed to get file URL");

		await ctx.db.patch(user._id, { image: url, updatedAt: Date.now() });
		return url;
	},
});

// ─── Save course thumbnail ───────────────────────────────────────────────────
export const saveCourseThumbnail = mutation({
	args: {
		storageId: v.id("_storage"),
		courseId: v.id("courses"),
	},
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const course = await ctx.db.get(args.courseId);
		if (!course) throw new Error("Course not found");
		if (course.tutorId !== user._id) throw new Error("Not your course");

		const url = await ctx.storage.getUrl(args.storageId);
		if (!url) throw new Error("Failed to get file URL");

		await ctx.db.patch(args.courseId, {
			thumbnailUrl: url,
			updatedAt: Date.now(),
		});
		return url;
	},
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { enrichUser, requireAuth } from "./helpers";

// ─── Create forum post ────────────────────────────────────────────────────────
export const createPost = mutation({
	args: {
		courseId: v.id("courses"),
		title: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		return await ctx.db.insert("forumPosts", {
			courseId: args.courseId,
			userId: user._id,
			title: args.title,
			content: args.content,
			createdAt: Date.now(),
		});
	},
});

// ─── Create reply ─────────────────────────────────────────────────────────────
export const createReply = mutation({
	args: {
		postId: v.id("forumPosts"),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		const post = await ctx.db.get(args.postId);
		if (!post) throw new Error("Post not found");

		return await ctx.db.insert("forumReplies", {
			postId: args.postId,
			userId: user._id,
			content: args.content,
			createdAt: Date.now(),
		});
	},
});

// ─── List posts for a course (batched — no N+1) ──────────────────────────────
export const listPosts = query({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		const posts = await ctx.db
			.query("forumPosts")
			.withIndex("by_course", (q) => q.eq("courseId", args.courseId))
			.collect();

		if (posts.length === 0) return [];

		// Batch: fetch all replies for the entire course at once
		const allReplies = await ctx.db
			.query("forumReplies")
			.filter((q) =>
				q.or(
					...posts.map((p) => q.eq(q.field("postId"), p._id)),
				),
			)
			.collect();

		// Group replies by postId
		const repliesByPost = new Map<string, number>();
		for (const reply of allReplies) {
			repliesByPost.set(
				reply.postId,
				(repliesByPost.get(reply.postId) ?? 0) + 1,
			);
		}

		// Batch: unique user IDs, then enrich in one pass
		const userIds = [...new Set(posts.map((p) => p.userId))];
		const userMap = new Map<string, { name: string; image?: string }>();
		for (const uid of userIds) {
			userMap.set(uid, await enrichUser(ctx, uid));
		}

		const enriched = posts.map((post) => {
			const user = userMap.get(post.userId) ?? {
				name: "Anonymous",
				image: undefined,
			};
			return {
				...post,
				userName: user.name,
				userImage: user.image,
				replyCount: repliesByPost.get(post._id) ?? 0,
			};
		});

		return enriched.sort((a, b) => b.createdAt - a.createdAt);
	},
});

// ─── Get single post with all replies ─────────────────────────────────────────
export const getPost = query({
	args: { postId: v.id("forumPosts") },
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);
		if (!post) return null;

		const author = await enrichUser(ctx, post.userId);
		const replies = await ctx.db
			.query("forumReplies")
			.withIndex("by_post", (q) => q.eq("postId", post._id))
			.collect();

		// Batch user lookups for replies
		const replyUserIds = [...new Set(replies.map((r) => r.userId))];
		const replyUserMap = new Map<string, { name: string; image?: string }>();
		for (const uid of replyUserIds) {
			replyUserMap.set(uid, await enrichUser(ctx, uid));
		}

		const enrichedReplies = replies.map((reply) => {
			const user = replyUserMap.get(reply.userId) ?? {
				name: "Anonymous",
				image: undefined,
			};
			return {
				...reply,
				userName: user.name,
				userImage: user.image,
			};
		});

		return {
			...post,
			userName: author.name,
			userImage: author.image,
			replies: enrichedReplies.sort((a, b) => a.createdAt - b.createdAt),
		};
	},
});

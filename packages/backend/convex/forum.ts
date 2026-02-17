import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

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

// ─── List posts for a course ──────────────────────────────────────────────────
export const listPosts = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const posts = await ctx.db
            .query("forumPosts")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();

        const enriched = await Promise.all(
            posts.map(async (post) => {
                const user = await ctx.db.get(post.userId);
                const replies = await ctx.db
                    .query("forumReplies")
                    .withIndex("by_post", (q) => q.eq("postId", post._id))
                    .collect();

                return {
                    ...post,
                    userName: user?.name ?? "Anonymous",
                    userImage: user?.image,
                    replyCount: replies.length,
                };
            }),
        );

        return enriched.sort((a, b) => b.createdAt - a.createdAt);
    },
});

// ─── Get single post with all replies ─────────────────────────────────────────
export const getPost = query({
    args: { postId: v.id("forumPosts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) return null;

        const author = await ctx.db.get(post.userId);
        const replies = await ctx.db
            .query("forumReplies")
            .withIndex("by_post", (q) => q.eq("postId", post._id))
            .collect();

        const enrichedReplies = await Promise.all(
            replies.map(async (reply) => {
                const user = await ctx.db.get(reply.userId);
                return {
                    ...reply,
                    userName: user?.name ?? "Anonymous",
                    userImage: user?.image,
                };
            }),
        );

        return {
            ...post,
            userName: author?.name ?? "Anonymous",
            userImage: author?.image,
            replies: enrichedReplies.sort((a, b) => a.createdAt - b.createdAt),
        };
    },
});

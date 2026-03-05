import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { optionalAuth, requireAuth } from "./helpers";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

// ─── Helper: enrich user with role ────────────────────────────────────────────
async function enrichUserWithRole(ctx: QueryCtx, userId: Id<"users">) {
  const user = (await ctx.db.get(userId)) as Doc<"users"> | null;
  return {
    name: user?.name ?? "Anonymous",
    image: user?.image,
    role: user?.role ?? "student",
  };
}

// ─── Helper: check if user can access forum (enrolled OR course tutor) ────────
async function canAccessForum(
  ctx: QueryCtx,
  userId: Id<"users">,
  courseId: Id<"courses">,
): Promise<boolean> {
  const course = await ctx.db.get(courseId);
  if (!course) return false;
  if (course.tutorId === userId) return true;

  const enrollment = await ctx.db
    .query("enrollments")
    .withIndex("by_user_course", (q) =>
      q.eq("userId", userId).eq("courseId", courseId),
    )
    .unique();

  return !!enrollment && enrollment.status !== "dropped";
}

// ─── Create forum post ────────────────────────────────────────────────────────
export const createPost = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(),
    postType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const hasAccess = await canAccessForum(ctx, user._id, args.courseId);
    if (!hasAccess)
      throw new Error("You must be enrolled in this course to post");

    // Only tutors can post announcements
    const postType = args.postType ?? "discussion";
    if (postType === "announcement" && user.role !== "tutor") {
      throw new Error("Only tutors can create announcements");
    }

    const postId = await ctx.db.insert("forumPosts", {
      courseId: args.courseId,
      userId: user._id,
      title: args.title,
      content: args.content,
      postType,
      isPinned: false,
      isResolved: false,
      upvoteCount: 0,
      viewCount: 0,
      createdAt: Date.now(),
    });

    // Notify the course tutor when a student posts
    const course = await ctx.db.get(args.courseId);
    if (course && course.tutorId && course.tutorId !== user._id) {
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        userId: course.tutorId,
        type: "course",
        title: "New Forum Post",
        message: `${user.name ?? "A student"} posted "${args.title}" in "${course.title}"`,
        link: `/tutor/courses/${args.courseId}/forum`,
      });
    }

    return postId;
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

    const hasAccess = await canAccessForum(ctx, user._id, post.courseId);
    if (!hasAccess)
      throw new Error("You must be enrolled in this course to reply");

    const replyId = await ctx.db.insert("forumReplies", {
      postId: args.postId,
      userId: user._id,
      content: args.content,
      createdAt: Date.now(),
    });

    // Notify post author when someone replies
    if (post.userId !== user._id) {
      const course = await ctx.db.get(post.courseId);
      const roleBadge = user.role === "tutor" ? " (Tutor)" : "";
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        userId: post.userId,
        type: "course",
        title: `New Reply${roleBadge}`,
        message: `${user.name ?? "Someone"}${roleBadge} replied to "${post.title}" in "${course?.title ?? "a course"}"`,
        link: `/student/courses/${post.courseId}/forum`,
      });
    }

    return replyId;
  },
});

// ─── Toggle upvote ────────────────────────────────────────────────────────────
export const toggleUpvote = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const hasAccess = await canAccessForum(ctx, user._id, post.courseId);
    if (!hasAccess) throw new Error("Access denied");

    // Check if already upvoted
    const existing = await ctx.db
      .query("forumUpvotes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", args.postId).eq("userId", user._id),
      )
      .unique();

    if (existing) {
      // Remove upvote
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, {
        upvoteCount: Math.max(0, (post.upvoteCount ?? 0) - 1),
      });
      return { action: "removed" };
    }

    // Add upvote
    await ctx.db.insert("forumUpvotes", {
      postId: args.postId,
      userId: user._id,
      createdAt: Date.now(),
    });
    await ctx.db.patch(args.postId, {
      upvoteCount: (post.upvoteCount ?? 0) + 1,
    });
    return { action: "added" };
  },
});

// ─── Toggle pin (tutor only) ──────────────────────────────────────────────────
export const togglePin = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Only course tutor can pin
    const course = await ctx.db.get(post.courseId);
    if (!course || course.tutorId !== user._id) {
      throw new Error("Only the course tutor can pin posts");
    }

    await ctx.db.patch(args.postId, {
      isPinned: !post.isPinned,
    });
    return { isPinned: !post.isPinned };
  },
});

// ─── Toggle resolved (post author or tutor) ──────────────────────────────────
export const toggleResolved = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Only post author or course tutor can resolve
    const course = await ctx.db.get(post.courseId);
    const isTutor = course && course.tutorId === user._id;
    const isAuthor = post.userId === user._id;

    if (!isTutor && !isAuthor) {
      throw new Error("Only the post author or tutor can resolve");
    }

    await ctx.db.patch(args.postId, {
      isResolved: !post.isResolved,
    });
    return { isResolved: !post.isResolved };
  },
});

// ─── Increment view count ─────────────────────────────────────────────────────
export const incrementViewCount = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return;
    await ctx.db.patch(args.postId, {
      viewCount: (post.viewCount ?? 0) + 1,
    });
  },
});

// ─── List posts for a course ──────────────────────────────────────────────────
export const listPosts = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const authUser = await optionalAuth(ctx);
    if (!authUser) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();
    if (!user) return [];

    const hasAccess = await canAccessForum(ctx, user._id, args.courseId);
    if (!hasAccess) return [];

    const posts = await ctx.db
      .query("forumPosts")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    if (posts.length === 0) return [];

    // Batch replies
    const allReplies = await ctx.db
      .query("forumReplies")
      .filter((q) => q.or(...posts.map((p) => q.eq(q.field("postId"), p._id))))
      .collect();

    const repliesByPost = new Map<string, number>();
    for (const reply of allReplies) {
      repliesByPost.set(
        reply.postId,
        (repliesByPost.get(reply.postId) ?? 0) + 1,
      );
    }

    // Check which posts the current user has upvoted
    const userUpvotes = await ctx.db
      .query("forumUpvotes")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.or(...posts.map((p) => q.eq(q.field("postId"), p._id))),
        ),
      )
      .collect();

    const upvotedPostIds = new Set(userUpvotes.map((u) => u.postId));

    // Enrich users
    const userIds = [...new Set(posts.map((p) => p.userId))];
    const userMap = new Map<
      string,
      { name: string; image?: string; role: string }
    >();
    for (const uid of userIds) {
      userMap.set(uid, await enrichUserWithRole(ctx, uid));
    }

    const enriched = posts.map((post) => {
      const u = userMap.get(post.userId) ?? {
        name: "Anonymous",
        image: undefined,
        role: "student",
      };
      return {
        ...post,
        userName: u.name,
        userImage: u.image,
        userRole: u.role,
        replyCount: repliesByPost.get(post._id) ?? 0,
        hasUpvoted: upvotedPostIds.has(post._id),
        postType: post.postType ?? "discussion",
        isPinned: post.isPinned ?? false,
        isResolved: post.isResolved ?? false,
        upvoteCount: post.upvoteCount ?? 0,
        viewCount: post.viewCount ?? 0,
      };
    });

    // Sort: pinned first, then by creation date desc
    return enriched.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// ─── Get single post with all replies ─────────────────────────────────────────
export const getPost = query({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const authUser = await optionalAuth(ctx);
    if (!authUser) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();
    if (!user) return null;

    const hasAccess = await canAccessForum(ctx, user._id, post.courseId);
    if (!hasAccess) return null;

    const author = await enrichUserWithRole(ctx, post.userId);
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .collect();

    // Check if current user upvoted
    const upvote = await ctx.db
      .query("forumUpvotes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", post._id).eq("userId", user._id),
      )
      .unique();

    // Enrich replies
    const replyUserIds = [...new Set(replies.map((r) => r.userId))];
    const replyUserMap = new Map<
      string,
      { name: string; image?: string; role: string }
    >();
    for (const uid of replyUserIds) {
      replyUserMap.set(uid, await enrichUserWithRole(ctx, uid));
    }

    // Check if current user is the tutor for this course
    const course = await ctx.db.get(post.courseId);
    const isTutor = course?.tutorId === user._id;
    const isAuthor = post.userId === user._id;

    const enrichedReplies = replies.map((reply) => {
      const u = replyUserMap.get(reply.userId) ?? {
        name: "Anonymous",
        image: undefined,
        role: "student",
      };
      return {
        ...reply,
        userName: u.name,
        userImage: u.image,
        userRole: u.role,
      };
    });

    return {
      ...post,
      userName: author.name,
      userImage: author.image,
      userRole: author.role,
      postType: post.postType ?? "discussion",
      isPinned: post.isPinned ?? false,
      isResolved: post.isResolved ?? false,
      upvoteCount: post.upvoteCount ?? 0,
      viewCount: post.viewCount ?? 0,
      hasUpvoted: !!upvote,
      isTutor,
      isAuthor,
      replies: enrichedReplies.sort((a, b) => a.createdAt - b.createdAt),
    };
  },
});

// ─── List all forum activity across a tutor's courses ─────────────────────────
export const listTutorForumActivity = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuth(ctx);
    if (!user) return [];

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_tutor", (q) => q.eq("tutorId", user._id))
      .collect();

    if (courses.length === 0) return [];

    const allPosts: Array<Doc<"forumPosts"> & { courseTitle: string }> = [];
    for (const course of courses) {
      const posts = await ctx.db
        .query("forumPosts")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect();

      for (const post of posts) {
        allPosts.push({ ...post, courseTitle: course.title });
      }
    }

    if (allPosts.length === 0) return [];

    // Batch replies
    const allReplies = await ctx.db
      .query("forumReplies")
      .filter((q) =>
        q.or(...allPosts.map((p) => q.eq(q.field("postId"), p._id))),
      )
      .collect();

    const repliesByPost = new Map<string, number>();
    for (const reply of allReplies) {
      repliesByPost.set(
        reply.postId,
        (repliesByPost.get(reply.postId) ?? 0) + 1,
      );
    }

    // Enrich users
    const userIds = [...new Set(allPosts.map((p) => p.userId))];
    const userMap = new Map<
      string,
      { name: string; image?: string; role: string }
    >();
    for (const uid of userIds) {
      userMap.set(uid, await enrichUserWithRole(ctx, uid));
    }

    const enriched = allPosts.map((post) => {
      const u = userMap.get(post.userId) ?? {
        name: "Anonymous",
        image: undefined,
        role: "student",
      };
      return {
        ...post,
        userName: u.name,
        userImage: u.image,
        userRole: u.role,
        replyCount: repliesByPost.get(post._id) ?? 0,
        postType: post.postType ?? "discussion",
        isPinned: post.isPinned ?? false,
        isResolved: post.isResolved ?? false,
        upvoteCount: post.upvoteCount ?? 0,
        viewCount: post.viewCount ?? 0,
      };
    });

    return enriched.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

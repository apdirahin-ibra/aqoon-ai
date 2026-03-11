import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { optionalAuth, requireAuth } from "./helpers";

// ─── Role-based messaging rules ───────────────────────────────────────────────
// Student → tutors of enrolled courses only
// Tutor   → students enrolled in their courses + admins
// Admin   → anyone
async function canMessage(
  ctx: QueryCtx,
  sender: { _id: Id<"users">; role: string },
  receiver: { _id: Id<"users">; role: string },
): Promise<boolean> {
  // Admin can message anyone
  if (sender.role === "admin") return true;

  if (sender.role === "student") {
    // Students can only message tutors of courses they are enrolled in
    if (receiver.role !== "tutor") return false;

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", sender._id))
      .collect();
    const enrolledCourseIds = new Set(
      enrollments.filter((e) => e.status === "active").map((e) => e.courseId),
    );
    if (enrolledCourseIds.size === 0) return false;

    const tutorCourses = await ctx.db
      .query("courses")
      .withIndex("by_tutor", (q) => q.eq("tutorId", receiver._id))
      .collect();

    return tutorCourses.some((c) => enrolledCourseIds.has(c._id));
  }

  if (sender.role === "tutor") {
    // Tutors can message admins
    if (receiver.role === "admin") return true;

    // Tutors can message students enrolled in their courses
    if (receiver.role !== "student") return false;

    const tutorCourses = await ctx.db
      .query("courses")
      .withIndex("by_tutor", (q) => q.eq("tutorId", sender._id))
      .collect();
    const courseIds = tutorCourses.map((c) => c._id);

    for (const courseId of courseIds) {
      const enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course", (q) =>
          q.eq("userId", receiver._id).eq("courseId", courseId),
        )
        .unique();
      if (enrollment && enrollment.status === "active") return true;
    }
    return false;
  }

  return false;
}

// ─── Unread message count (for sidebar badge) ────────────────────────────────
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await optionalAuth(ctx);
    if (!authUser) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();
    if (!user) return 0;

    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    return received.filter((msg) => !msg.isRead).length;
  },
});

// ─── Send message ─────────────────────────────────────────────────────────────
export const send = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    if (user._id === args.receiverId) {
      throw new Error("Cannot send message to yourself");
    }

    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) throw new Error("Recipient not found");

    // Role-based messaging restriction
    const allowed = await canMessage(ctx, user, receiver);
    if (!allowed) {
      throw new Error(
        "You are not allowed to message this user. Students can only message their course tutors, and tutors can only message their students or admins.",
      );
    }

    return await ctx.db.insert("messages", {
      senderId: user._id,
      receiverId: args.receiverId,
      content: args.content,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// ─── List conversations ──────────────────────────────────────────────────────
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuth(ctx);
    if (!user) return [];

    // Get all messages where user is sender or receiver
    const sent = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();
    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    const allMessages = [...sent, ...received];

    // Group by conversation partner
    const conversationMap = new Map<
      string,
      {
        partnerId: Id<"users">;
        lastMessage: (typeof allMessages)[0];
        unreadCount: number;
      }
    >();

    for (const msg of allMessages) {
      const partnerId: Id<"users"> =
        msg.senderId === user._id ? msg.receiverId : msg.senderId;
      const partnerKey = partnerId as string;

      const existing = conversationMap.get(partnerKey);
      const isUnread = msg.receiverId === user._id && !msg.isRead;

      if (!existing || msg.createdAt > existing.lastMessage.createdAt) {
        conversationMap.set(partnerKey, {
          partnerId,
          lastMessage: msg,
          unreadCount: (existing?.unreadCount ?? 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unreadCount++;
      }
    }

    // Enrich with user info
    const conversations = await Promise.all(
      Array.from(conversationMap.values()).map(async (conv) => {
        const partner = await ctx.db.get(conv.partnerId);
        return {
          partnerId: conv.partnerId,
          partnerName: partner?.name ?? "Unknown",
          partnerImage: partner?.image,
          lastMessage: conv.lastMessage.content,
          lastMessageAt: conv.lastMessage.createdAt,
          unreadCount: conv.unreadCount,
        };
      }),
    );

    return conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

// ─── Get thread with a specific user ──────────────────────────────────────────
export const getThread = query({
  args: { partnerId: v.id("users") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) return [];

    const sent = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();
    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    const thread = [...sent, ...received].filter(
      (msg) =>
        (msg.senderId === user._id && msg.receiverId === args.partnerId) ||
        (msg.senderId === args.partnerId && msg.receiverId === user._id),
    );

    return thread.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// ─── Mark messages as read ────────────────────────────────────────────────────
export const markRead = mutation({
  args: { partnerId: v.id("users") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) throw new Error("User profile not found");

    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    const unread = received.filter(
      (msg) => msg.senderId === args.partnerId && !msg.isRead,
    );

    for (const msg of unread) {
      await ctx.db.patch(msg._id, { isRead: true });
    }

    return { markedRead: unread.length };
  },
});

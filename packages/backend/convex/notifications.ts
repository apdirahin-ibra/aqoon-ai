import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Create notification (internal) ───────────────────────────────────────────
export const create = internalMutation({
    args: {
        userId: v.id("users"),
        type: v.string(),
        title: v.string(),
        message: v.string(),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notifications", {
            userId: args.userId,
            type: args.type,
            title: args.title,
            message: args.message,
            isRead: false,
            link: args.link,
            createdAt: Date.now(),
        });
    },
});

// ─── List user's notifications ────────────────────────────────────────────────
export const list = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAuth(ctx);
        if (!user) return [];

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return notifications.sort((a, b) => b.createdAt - a.createdAt);
    },
});

// ─── Mark single notification as read ─────────────────────────────────────────
export const markRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const notification = await ctx.db.get(args.notificationId);
        if (!notification) throw new Error("Notification not found");

        if (notification.userId !== user._id) {
            throw new Error("Access denied");
        }

        await ctx.db.patch(args.notificationId, { isRead: true });
        return args.notificationId;
    },
});

// ─── Mark all notifications as read ───────────────────────────────────────────
export const markAllRead = mutation({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const unreadNotifications = unread.filter((n) => !n.isRead);

        for (const n of unreadNotifications) {
            await ctx.db.patch(n._id, { isRead: true });
        }

        return { markedRead: unreadNotifications.length };
    },
});

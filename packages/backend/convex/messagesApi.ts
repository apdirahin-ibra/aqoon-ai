import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

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

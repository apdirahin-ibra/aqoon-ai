import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

// ─── List audit logs (admin only) ─────────────────────────────────────────────
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		const logs = await ctx.db.query("auditLogs").order("desc").take(200);
		return logs;
	},
});

// ─── Log an audit event (internal — called from other mutations) ──────────────
export const log = internalMutation({
	args: {
		userName: v.string(),
		action: v.string(),
		details: v.string(),
		category: v.union(
			v.literal("auth"),
			v.literal("course"),
			v.literal("user"),
			v.literal("payment"),
			v.literal("system"),
		),
		userId: v.optional(v.id("users")),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("auditLogs", {
			userId: args.userId,
			userName: args.userName,
			action: args.action,
			details: args.details,
			category: args.category,
			createdAt: Date.now(),
		});
	},
});

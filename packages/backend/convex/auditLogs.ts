import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

// ─── List audit logs ──────────────────────────────────────────────────────────
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		const logs = await ctx.db.query("auditLogs").order("desc").take(200);
		return logs;
	},
});

// ─── Log an audit event (internal helper, called from other mutations) ────────
export const log = mutation({
	args: {
		userName: v.string(),
		action: v.string(),
		details: v.string(),
		category: v.string(),
		userId: v.optional(v.id("users")),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

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

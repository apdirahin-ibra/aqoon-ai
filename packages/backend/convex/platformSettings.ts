import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

// ─── Get a single platform setting ────────────────────────────────────────────
export const get = query({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const setting = await ctx.db
			.query("platformSettings")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();
		if (!setting) return null;
		return { key: setting.key, value: JSON.parse(setting.value) };
	},
});

// ─── Get all platform settings ────────────────────────────────────────────────
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const settings = await ctx.db.query("platformSettings").collect();
		return settings.map((s) => ({
			key: s.key,
			value: JSON.parse(s.value),
			updatedAt: s.updatedAt,
		}));
	},
});

// ─── Upsert a platform setting (admin only) ──────────────────────────────────
export const set = mutation({
	args: {
		key: v.string(),
		value: v.string(), // JSON-encoded value
	},
	handler: async (ctx, args) => {
		const { user } = await requireAdmin(ctx);
		if (!user) throw new Error("Admin user not found");

		const existing = await ctx.db
			.query("platformSettings")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				value: args.value,
				updatedAt: Date.now(),
				updatedBy: user._id,
			});
			return existing._id;
		}

		return await ctx.db.insert("platformSettings", {
			key: args.key,
			value: args.value,
			updatedAt: Date.now(),
			updatedBy: user._id,
		});
	},
});

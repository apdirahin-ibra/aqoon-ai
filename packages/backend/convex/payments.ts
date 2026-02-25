import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAuth } from "./helpers";

// ─── Record payment ──────────────────────────────────────────────────────────
export const recordPayment = mutation({
	args: {
		courseId: v.id("courses"),
		amountCents: v.number(),
		stripePaymentId: v.string(),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const { user } = await requireAuth(ctx);
		if (!user) throw new Error("User profile not found");

		return await ctx.db.insert("payments", {
			userId: user._id,
			courseId: args.courseId,
			amountCents: args.amountCents,
			stripePaymentId: args.stripePaymentId,
			status: args.status,
			createdAt: Date.now(),
		});
	},
});

// ─── List my payments ─────────────────────────────────────────────────────────
export const myPayments = query({
	args: {},
	handler: async (ctx) => {
		const { user } = await requireAuth(ctx);
		if (!user) return [];

		const payments = await ctx.db
			.query("payments")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();

		const enriched = await Promise.all(
			payments.map(async (payment) => {
				const course = await ctx.db.get(payment.courseId);
				return {
					...payment,
					courseTitle: course?.title ?? "Unknown Course",
				};
			}),
		);

		return enriched.sort((a, b) => b.createdAt - a.createdAt);
	},
});

// ─── Admin: list all payments ─────────────────────────────────────────────────
export const listAll = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db.query("payments").collect();
	},
});

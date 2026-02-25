import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAuth } from "./helpers";

// ─── Issue certificate ────────────────────────────────────────────────────────
export const issue = mutation({
	args: {
		userId: v.id("users"),
		courseId: v.id("courses"),
		certificateUrl: v.string(),
	},
	handler: async (ctx, args) => {
		// Generate unique verification code
		const code = `AQOON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

		return await ctx.db.insert("certificates", {
			userId: args.userId,
			courseId: args.courseId,
			issuedAt: Date.now(),
			certificateUrl: args.certificateUrl,
			code,
		});
	},
});

// ─── List my certificates ─────────────────────────────────────────────────────
export const myCertificates = query({
	args: {},
	handler: async (ctx) => {
		const { user } = await requireAuth(ctx);
		if (!user) return [];

		const certs = await ctx.db
			.query("certificates")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();

		const enriched = await Promise.all(
			certs.map(async (cert) => {
				const course = await ctx.db.get(cert.courseId);
				return {
					...cert,
					courseTitle: course?.title ?? "Unknown Course",
				};
			}),
		);

		return enriched.sort((a, b) => b.issuedAt - a.issuedAt);
	},
});

// ─── Verify certificate by code ───────────────────────────────────────────────
export const verify = query({
	args: { code: v.string() },
	handler: async (ctx, args) => {
		const cert = await ctx.db
			.query("certificates")
			.withIndex("by_code", (q) => q.eq("code", args.code))
			.unique();

		if (!cert) return { valid: false };

		const user = await ctx.db.get(cert.userId);
		const course = await ctx.db.get(cert.courseId);

		return {
			valid: true,
			userName: user?.name ?? "Unknown",
			courseTitle: course?.title ?? "Unknown Course",
			issuedAt: cert.issuedAt,
		};
	},
});

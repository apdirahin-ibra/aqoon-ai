import { v } from "convex/values";
import { query } from "./_generated/server";

// ─── List resources for a course ──────────────────────────────────────────────
export const listByCourse = query({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("resources")
			.withIndex("by_course", (q) => q.eq("courseId", args.courseId))
			.collect();
	},
});

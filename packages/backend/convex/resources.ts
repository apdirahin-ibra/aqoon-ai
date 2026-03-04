import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireTutor } from "./helpers";

// ─── List resources for a course (requires authentication) ────────────────────
export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    return await ctx.db
      .query("resources")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

// ─── Add resource to a course (tutor only) ────────────────────────────────────
export const create = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    fileUrl: v.string(),
    fileType: v.union(
      v.literal("document"),
      v.literal("code"),
      v.literal("image"),
      v.literal("video"),
    ),
    description: v.optional(v.string()),
    fileSizeBytes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireTutor(ctx);
    if (!user) throw new Error("User profile not found");

    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found");
    if (course.tutorId !== user._id) throw new Error("Not your course");

    const resourceId = await ctx.db.insert("resources", {
      courseId: args.courseId,
      title: args.title,
      fileUrl: args.fileUrl,
      fileType: args.fileType,
      description: args.description,
      fileSizeBytes: args.fileSizeBytes,
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.scheduler.runAfter(0, internal.auditLogs.log, {
      userId: user._id,
      userName: user.name ?? "Tutor",
      action: "Uploaded resource",
      details: `Added "${args.title}" to "${course.title}"`,
      category: "course",
    });

    return resourceId;
  },
});

// ─── Delete resource (tutor only) ─────────────────────────────────────────────
export const remove = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const { user } = await requireTutor(ctx);
    if (!user) throw new Error("User profile not found");

    const resource = await ctx.db.get(args.resourceId);
    if (!resource) throw new Error("Resource not found");

    const course = await ctx.db.get(resource.courseId);
    if (!course || course.tutorId !== user._id) {
      throw new Error("Not your resource");
    }

    await ctx.db.delete(args.resourceId);
    return args.resourceId;
  },
});

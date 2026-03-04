import { v } from "convex/values";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireStudent } from "./helpers";

// ─── Mark lesson complete ─────────────────────────────────────────────────────
export const markComplete = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const { user } = await requireStudent(ctx);
    if (!user) throw new Error("User profile not found");

    // Check if progress record exists
    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: true,
        completedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("lessonProgress", {
      userId: user._id,
      lessonId: args.lessonId,
      completed: true,
      completedAt: Date.now(),
    });
  },
});

// ─── Check and auto-issue certificate on 100% completion ─────────────────────
const checkAndIssueCertificate = async (
  ctx: any,
  userId: any,
  lessonId: any,
  userName: string,
) => {
  // Find the course for this lesson
  const lesson = await ctx.db.get(lessonId);
  if (!lesson) return;

  const courseId = lesson.courseId;
  const course = await ctx.db.get(courseId);
  if (!course) return;

  // Get all lessons for the course
  const allLessons = await ctx.db
    .query("lessons")
    .withIndex("by_course", (q: any) => q.eq("courseId", courseId))
    .collect();

  if (allLessons.length === 0) return;

  // Get all progress for this user
  const progressRecords = await ctx.db
    .query("lessonProgress")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .collect();

  const completedLessonIds = new Set(
    progressRecords.filter((p: any) => p.completed).map((p: any) => p.lessonId),
  );

  const allComplete = allLessons.every((l: any) =>
    completedLessonIds.has(l._id),
  );

  if (!allComplete) return;

  // Check if certificate already issued
  const existingCert = await ctx.db
    .query("certificates")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .collect();

  const alreadyIssued = existingCert.some((c: any) => c.courseId === courseId);

  if (alreadyIssued) return;

  // Issue certificate
  const code = `AQOON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  await ctx.db.insert("certificates", {
    userId,
    courseId,
    issuedAt: Date.now(),
    certificateUrl: "",
    code,
  });

  // Notify student
  await ctx.scheduler.runAfter(0, internal.notifications.create, {
    userId,
    type: "achievement",
    title: "Certificate Earned! 🎉",
    message: `Congratulations! You completed "${course.title}" and earned a certificate.`,
    link: "/student/certificates",
  });

  // Audit log
  await ctx.scheduler.runAfter(0, internal.auditLogs.log, {
    userId,
    userName,
    action: "Earned certificate",
    details: `Completed all lessons in "${course.title}"`,
    category: "course",
  });
};

// ─── Toggle lesson completion ─────────────────────────────────────────────────
export const toggleComplete = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const { user } = await requireStudent(ctx);
    if (!user) throw new Error("User profile not found");

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId),
      )
      .unique();

    if (existing) {
      const newCompleted = !existing.completed;
      await ctx.db.patch(existing._id, {
        completed: newCompleted,
        completedAt: newCompleted ? Date.now() : undefined,
      });

      if (newCompleted) {
        await checkAndIssueCertificate(
          ctx,
          user._id,
          args.lessonId,
          user.name ?? "Student",
        );
      }

      return { completed: newCompleted };
    }

    await ctx.db.insert("lessonProgress", {
      userId: user._id,
      lessonId: args.lessonId,
      completed: true,
      completedAt: Date.now(),
    });

    await checkAndIssueCertificate(
      ctx,
      user._id,
      args.lessonId,
      user.name ?? "Student",
    );

    return { completed: true };
  },
});

// ─── Get course progress percentage ───────────────────────────────────────────
export const getCourseProgress = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);
    if (!user) return { progress: 0, completed: 0, total: 0 };

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    if (lessons.length === 0) {
      return { progress: 0, completed: 0, total: 0 };
    }

    const progressRecords = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedCount = progressRecords.filter(
      (p) => p.completed && lessons.some((l) => l._id === p.lessonId),
    ).length;

    return {
      progress: Math.round((completedCount / lessons.length) * 100),
      completed: completedCount,
      total: lessons.length,
    };
  },
});

// ─── Get lessons with their progress for roadmap ──────────────────────────────
export const getLessonsWithProgress = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const { user } = await requireAuth(ctx);

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course_order", (q) => q.eq("courseId", args.courseId))
      .collect();

    if (!user) {
      return lessons.map((l) => ({ ...l, completed: false }));
    }

    const progressRecords = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedLessonIds = new Set(
      progressRecords.filter((p) => p.completed).map((p) => p.lessonId),
    );

    return lessons.map((l) => ({
      ...l,
      completed: completedLessonIds.has(l._id),
    }));
  },
});

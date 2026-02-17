import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

// ─── Get quiz by lesson ───────────────────────────────────────────────────────
export const getByLesson = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("quizzes")
            .withIndex("by_lesson", (q) => q.eq("lessonId", args.lessonId))
            .unique();
    },
});

// ─── Submit quiz answers ──────────────────────────────────────────────────────
export const submit = mutation({
    args: {
        quizId: v.id("quizzes"),
        answers: v.array(v.number()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) throw new Error("User profile not found");

        const quiz = await ctx.db.get(args.quizId);
        if (!quiz) throw new Error("Quiz not found");

        if (args.answers.length !== quiz.questions.length) {
            throw new Error(
                `Expected ${quiz.questions.length} answers, got ${args.answers.length}`,
            );
        }

        // Grade
        let correctCount = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
            if (args.answers[i] === quiz.questions[i].correctOptionIndex) {
                correctCount++;
            }
        }

        const score = Math.round((correctCount / quiz.questions.length) * 100);

        const attemptId = await ctx.db.insert("quizAttempts", {
            quizId: args.quizId,
            userId: user._id,
            answers: args.answers,
            score,
            completedAt: Date.now(),
        });

        return {
            attemptId,
            score,
            correctCount,
            totalQuestions: quiz.questions.length,
        };
    },
});

// ─── Get user's quiz attempts ─────────────────────────────────────────────────
export const getAttempts = query({
    args: { quizId: v.id("quizzes") },
    handler: async (ctx, args) => {
        const { user } = await requireAuth(ctx);
        if (!user) return [];

        const attempts = await ctx.db
            .query("quizAttempts")
            .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
            .collect();

        // Filter to current user's attempts only
        return attempts
            .filter((a) => a.userId === user._id)
            .sort((a, b) => b.completedAt - a.completedAt);
    },
});

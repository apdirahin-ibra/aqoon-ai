"use node";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Output, generateText } from "ai";
import { v } from "convex/values";
import { z } from "zod";
import { action } from "./_generated/server";

/**
 * Lazily create the OpenRouter provider using env vars.
 * OPENROUTER_API_KEY and OPENROUTER_MODEL must be set in Convex dashboard.
 */
const getModel = () => {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) throw new Error("OPENROUTER_API_KEY env variable is not set");

	const modelId = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash";

	const openrouter = createOpenRouter({ apiKey });
	return openrouter(modelId);
};

// ─── Study Plan ──────────────────────────────────────────────────────────────

const studyPlanSchema = z.object({
	weeks: z.array(
		z.object({
			week: z.number().describe("Week number starting from 1"),
			focus: z.string().describe("Main topic/focus area for this week"),
			tasks: z
				.array(z.string())
				.describe("3-5 specific tasks to complete this week"),
			milestone: z
				.string()
				.describe("A concrete milestone to reach by end of week"),
		}),
	),
	tips: z
		.array(z.string())
		.describe("3-5 general study tips tailored to the learner"),
});

export type StudyPlan = z.infer<typeof studyPlanSchema>;

export const generateStudyPlan = action({
	args: {
		goal: v.string(),
		category: v.string(),
		level: v.string(),
		weeklyHours: v.number(),
		durationWeeks: v.number(),
	},
	handler: async (_ctx, args) => {
		try {
			const model = getModel();

			const { output } = await generateText({
				model,
				output: Output.object({ schema: studyPlanSchema }),
				prompt: `Create a personalized study plan for a student with the following details:
- Learning goal: ${args.goal || "General learning"}
- Category: ${args.category}
- Current level: ${args.level}
- Available time: ${args.weeklyHours} hours per week
- Plan duration: ${args.durationWeeks} weeks

Generate exactly ${args.durationWeeks} weeks of structured learning content.
Each week should have 3-5 specific, actionable tasks and a clear milestone.
The difficulty should progress from ${args.level} level upward.
Include 3-5 practical study tips tailored to this category and level.`,
			});

			if (!output) {
				throw new Error("AI returned an empty response");
			}

			return output;
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown error";
			console.error("AI study plan generation failed:", message);

			// Re-throw env errors as-is so users know to configure
			if (message.includes("OPENROUTER_API_KEY")) {
				throw error;
			}

			throw new Error(
				"Failed to generate your study plan. Please try again later.",
			);
		}
	},
});

// ─── Skill Assessment ────────────────────────────────────────────────────────

const assessmentResultSchema = z.object({
	level: z
		.enum(["beginner", "intermediate", "advanced"])
		.describe("Overall skill level"),
	score: z.number().min(0).max(100).describe("Proficiency score out of 100"),
	strengths: z
		.array(z.string())
		.describe("3-4 specific strengths based on answers"),
	weaknesses: z
		.array(z.string())
		.describe("2-3 areas that need improvement"),
	recommendations: z
		.array(z.string())
		.describe("3-5 actionable course/topic recommendations"),
});

export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export const assessSkills = action({
	args: {
		category: v.string(),
		questions: v.array(v.string()),
		answers: v.array(v.string()),
	},
	handler: async (_ctx, args) => {
		try {
			const model = getModel();

			const qaPairs = args.questions
				.map((q, i) => `Q: ${q}\nA: ${args.answers[i] ?? "No answer"}`)
				.join("\n\n");

			const { output } = await generateText({
				model,
				output: Output.object({ schema: assessmentResultSchema }),
				prompt: `You are an expert skill assessor for the "${args.category}" domain.

A student completed a skill assessment. Based on their answers below, evaluate their skill level accurately.

${qaPairs}

Analyze each answer to determine:
1. Their overall level (beginner/intermediate/advanced)
2. A score from 0-100 reflecting their proficiency
3. Specific strengths they demonstrated
4. Areas where they need improvement
5. Actionable recommendations for courses or topics to study next

Be honest and constructive in your assessment.`,
			});

			if (!output) {
				throw new Error("AI returned an empty response");
			}

			return output;
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown error";
			console.error("AI skill assessment failed:", message);

			if (message.includes("OPENROUTER_API_KEY")) {
				throw error;
			}

			throw new Error(
				"Failed to assess your skills. Please try again later.",
			);
		}
	},
});

"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
	ArrowRight,
	BookOpen,
	CheckCircle,
	Loader2,
	RotateCcw,
	Sparkles,
	Target,
	TrendingUp,
	Trophy,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResultsPage({
	params,
}: {
	params: Promise<{ attemptId: string }>;
}) {
	const { attemptId: attemptIdStr } = use(params);
	const attemptId = attemptIdStr as Id<"quizAttempts">;

	const attempt = useQuery(api.quizzes.getAttempt, { attemptId });
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [loadingFeedback, setLoadingFeedback] = useState(false);

	const generateAIFeedback = () => {
		setLoadingFeedback(true);
		// TODO: wire to AI action
		setTimeout(() => {
			setAiFeedback(
				"Great job! You have a solid understanding of the material. Focus on reviewing the questions you got wrong to improve further.",
			);
			setLoadingFeedback(false);
		}, 2000);
	};

	if (attempt === undefined) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
			</div>
		);
	}

	if (attempt === null) {
		return (
			<div className="container py-8">
				<div className="mx-auto max-w-2xl text-center">
					<Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
					<h1 className="mb-1 font-bold text-xl">Result Not Found</h1>
					<p className="text-muted-foreground text-sm">
						This quiz attempt could not be found.
					</p>
				</div>
			</div>
		);
	}

	const questions = attempt.quiz.questions;
	const answers = attempt.answers;
	const correctCount = questions.filter(
		(q, i) => answers[i] === q.correctOptionIndex,
	).length;
	const scoreLevel =
		attempt.score >= 80
			? "excellent"
			: attempt.score >= 60
				? "good"
				: "needs_work";

	const courseId = attempt.quiz.lesson?.course?._id;
	const lessonId = attempt.quiz.lessonId;

	return (
		<div className="container py-8">
			<div className="mb-5">
				<div className="mb-1 flex items-center gap-1.5 text-muted-foreground text-xs">
					{attempt.quiz.lesson?.course && (
						<>
							<span>{attempt.quiz.lesson.course.title}</span>
							<span>/</span>
						</>
					)}
					{attempt.quiz.lesson && <span>{attempt.quiz.lesson.title}</span>}
				</div>
				<h1 className="font-bold font-display text-2xl">
					{attempt.quiz.title} — Results
				</h1>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					{/* Score Card */}
					<Card
						className={`overflow-hidden rounded-2xl border-2 shadow-sm ${
							scoreLevel === "excellent"
								? "border-success/30 bg-linear-to-br from-success/5 to-transparent"
								: scoreLevel === "good"
									? "border-primary/30 bg-linear-to-br from-primary/5 to-transparent"
									: "border-warning/30 bg-linear-to-br from-warning/5 to-transparent"
						}`}
					>
						<CardContent className="pt-4 pb-4">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<div className="mb-1 flex items-center gap-2">
										<Trophy
											className={`h-6 w-6 ${
												scoreLevel === "excellent"
													? "text-success"
													: scoreLevel === "good"
														? "text-primary"
														: "text-warning"
											}`}
										/>
										<span className="font-bold text-3xl">{attempt.score}%</span>
									</div>
									<p className="text-muted-foreground text-xs">
										{correctCount} of {questions.length} correct
									</p>
								</div>
								<Badge
									variant={scoreLevel === "excellent" ? "default" : "secondary"}
									className="text-xs"
								>
									{scoreLevel === "excellent"
										? "Excellent!"
										: scoreLevel === "good"
											? "Good Job!"
											: "Keep Practicing"}
								</Badge>
							</div>
							<Progress value={attempt.score} className="h-2" />
						</CardContent>
					</Card>

					{/* Question Breakdown */}
					<Card className="rounded-2xl shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-base">
								<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
									<Target className="h-4 w-4 text-primary" />
								</div>
								Question Breakdown
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{questions.map((question, idx) => {
								const userAnswer = answers[idx];
								const isCorrect = userAnswer === question.correctOptionIndex;

								return (
									<div
										key={idx}
										className={`rounded-xl border p-3 ${
											isCorrect
												? "border-success/20 bg-success/5"
												: "border-destructive/20 bg-destructive/5"
										}`}
									>
										<div className="flex items-start gap-2">
											{isCorrect ? (
												<CheckCircle className="mt-0.5 h-4 w-4 text-success" />
											) : (
												<XCircle className="mt-0.5 h-4 w-4 text-destructive" />
											)}
											<div className="flex-1">
												<p className="mb-1 font-medium text-xs">
													Q{idx + 1}: {question.question}
												</p>
												<p className="text-[10px] text-muted-foreground">
													Your answer:{" "}
													<span
														className={
															isCorrect ? "text-success" : "text-destructive"
														}
													>
														{question.options[userAnswer] ?? "No answer"}
													</span>
												</p>
												{!isCorrect && (
													<p className="mt-0.5 text-[10px] text-success">
														Correct:{" "}
														{question.options[question.correctOptionIndex]}
													</p>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					<Card className="rounded-2xl shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-base">
								<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
									<Sparkles className="h-4 w-4 text-primary" />
								</div>
								AI Feedback
							</CardTitle>
						</CardHeader>
						<CardContent>
							{aiFeedback ? (
								<p className="whitespace-pre-wrap text-sm">{aiFeedback}</p>
							) : (
								<div className="py-3 text-center">
									<p className="mb-3 text-muted-foreground text-xs">
										Get personalized feedback from AI
									</p>
									<Button
										size="sm"
										className="rounded-xl"
										onClick={generateAIFeedback}
										disabled={loadingFeedback}
									>
										{loadingFeedback ? (
											<Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
										) : (
											<Sparkles className="mr-1 h-3.5 w-3.5" />
										)}
										Get Feedback
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="rounded-2xl shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2 text-base">
								<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
									<TrendingUp className="h-4 w-4 text-primary" />
								</div>
								Next Steps
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{courseId && lessonId && (
								<>
									<Button
										asChild
										variant="outline"
										size="sm"
										className="w-full rounded-xl text-xs"
									>
										<Link href={`/student/learn/${courseId}/${lessonId}/quiz`}>
											<RotateCcw className="mr-1 h-3 w-3" />
											Retry Quiz
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										size="sm"
										className="w-full rounded-xl text-xs"
									>
										<Link href={`/student/learn/${courseId}/${lessonId}`}>
											<BookOpen className="mr-1 h-3 w-3" />
											Review Lesson
										</Link>
									</Button>
									<Button
										asChild
										size="sm"
										className="w-full rounded-xl text-xs"
									>
										<Link href={`/courses/${courseId}`}>
											Continue Course
											<ArrowRight className="ml-1 h-3 w-3" />
										</Link>
									</Button>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

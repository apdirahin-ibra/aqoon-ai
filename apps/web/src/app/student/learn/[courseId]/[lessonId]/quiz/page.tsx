"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	HelpCircle,
	Loader2,
	RotateCcw,
	Trophy,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export default function QuizPage({
	params,
}: {
	params: Promise<{ courseId: string; lessonId: string }>;
}) {
	const { courseId: courseIdStr, lessonId: lessonIdStr } = use(params);
	const courseId = courseIdStr as Id<"courses">;
	const lessonId = lessonIdStr as Id<"lessons">;

	const quiz = useQuery(api.quizzes.getByLesson, { lessonId });
	const submitQuiz = useMutation(api.quizzes.submit);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [submitted, setSubmitted] = useState(false);
	const [result, setResult] = useState<{
		score: number;
		correctCount: number;
		totalQuestions: number;
	} | null>(null);

	const handleAnswer = (questionIndex: number, answerIndex: number) => {
		if (submitted) return;
		setAnswers({ ...answers, [questionIndex]: answerIndex });
	};

	const handleSubmit = async () => {
		if (!quiz) return;

		const orderedAnswers: number[] = [];
		for (let i = 0; i < quiz.questions.length; i++) {
			orderedAnswers.push(answers[i] ?? -1);
		}

		try {
			const res = await submitQuiz({
				quizId: quiz._id,
				answers: orderedAnswers,
			});
			setResult({
				score: res.score,
				correctCount: res.correctCount,
				totalQuestions: res.totalQuestions,
			});
			setSubmitted(true);
		} catch (err) {
			console.error("Failed to submit quiz:", err);
		}
	};

	const handleRetry = () => {
		setAnswers({});
		setSubmitted(false);
		setResult(null);
		setCurrentQuestionIndex(0);
	};

	if (quiz === undefined) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
			</div>
		);
	}

	if (quiz === null) {
		return (
			<div className="container py-8">
				<div className="mx-auto max-w-2xl text-center">
					<HelpCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
					<h1 className="mb-1 font-bold text-xl">No Quiz Available</h1>
					<p className="mb-4 text-muted-foreground text-sm">
						There is no quiz for this lesson yet.
					</p>
					<Button asChild variant="outline" size="sm" className="rounded-xl">
						<Link href={`/student/learn/${courseId}/${lessonId}`}>
							<ArrowLeft className="mr-1 h-3.5 w-3.5" />
							Back to Lesson
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const questions = quiz.questions;
	const currentQuestion = questions[currentQuestionIndex];
	const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

	// Results view
	if (submitted && result !== null) {
		const passed = result.score >= 70;

		return (
			<div className="container py-8">
				<div className="mx-auto max-w-2xl">
					<Card className="rounded-2xl text-center shadow-sm">
						<CardContent className="pt-8 pb-6">
							<div
								className={cn(
									"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
									passed
										? "bg-linear-to-br from-success/20 to-success/5"
										: "bg-linear-to-br from-destructive/20 to-destructive/5",
								)}
							>
								{passed ? (
									<Trophy className="h-8 w-8 text-success" />
								) : (
									<XCircle className="h-8 w-8 text-destructive" />
								)}
							</div>

							<h1 className="mb-1 font-bold font-display text-2xl">
								{passed ? "Congratulations!" : "Keep Practicing!"}
							</h1>
							<p className="mb-4 text-muted-foreground text-sm">
								{passed
									? "You have successfully passed the quiz."
									: "You need 70% to pass. Review and try again."}
							</p>

							<div
								className={cn(
									"mb-1 bg-clip-text font-bold text-4xl text-transparent",
									passed
										? "bg-linear-to-r from-success to-success/60"
										: "bg-linear-to-r from-destructive to-destructive/60",
								)}
							>
								{result.score}%
							</div>
							<p className="mb-5 text-muted-foreground text-xs">
								{result.correctCount} of {result.totalQuestions} correct
							</p>

							<div className="flex items-center justify-center gap-3">
								<Button
									variant="outline"
									size="sm"
									className="rounded-xl"
									onClick={handleRetry}
								>
									<RotateCcw className="mr-1 h-3.5 w-3.5" />
									Retry
								</Button>
								<Button asChild size="sm" className="rounded-xl">
									<Link href={`/student/learn/${courseId}/${lessonId}`}>
										Back to Lesson
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Review Answers */}
					<div className="mt-4 space-y-2">
						<h2 className="font-semibold text-sm">Review Your Answers</h2>
						{questions.map((question, index) => {
							const userAnswer = answers[index];
							const isCorrect = userAnswer === question.correctOptionIndex;

							return (
								<Card key={index} className="rounded-xl shadow-sm">
									<CardContent className="p-3">
										<div className="flex items-start gap-2">
											<div
												className={cn(
													"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
													isCorrect ? "bg-success/10" : "bg-destructive/10",
												)}
											>
												{isCorrect ? (
													<CheckCircle2 className="h-3 w-3 text-success" />
												) : (
													<XCircle className="h-3 w-3 text-destructive" />
												)}
											</div>
											<div className="flex-1">
												<p className="mb-1 font-medium text-xs">
													{index + 1}. {question.question}
												</p>
												<div className="space-y-0.5 text-xs">
													{question.options.map((option, optIndex) => (
														<div
															key={optIndex}
															className={cn(
																"rounded-lg p-1.5",
																optIndex === question.correctOptionIndex &&
																	"bg-success/10 text-success",
																optIndex === userAnswer &&
																	optIndex !== question.correctOptionIndex &&
																	"bg-destructive/10 text-destructive",
															)}
														>
															{option}
															{optIndex === question.correctOptionIndex && " ✓"}
															{optIndex === userAnswer &&
																optIndex !== question.correctOptionIndex &&
																" (Your answer)"}
														</div>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	// Quiz view
	return (
		<div className="container py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-5">
					<Link
						href={`/student/learn/${courseId}/${lessonId}`}
						className="mb-3 inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
					>
						<ArrowLeft className="mr-1 h-3 w-3" />
						Back to Lesson
					</Link>
					<h1 className="font-bold font-display text-2xl">{quiz.title}</h1>
				</div>

				{/* Progress */}
				<div className="mb-5">
					<div className="mb-1.5 flex items-center justify-between text-xs">
						<span className="text-muted-foreground">
							Question {currentQuestionIndex + 1} of {questions.length}
						</span>
						<span className="font-medium">{Math.round(progressPercent)}%</span>
					</div>
					<Progress value={progressPercent} className="h-1.5" />
				</div>

				{/* Question Card */}
				{currentQuestion && (
					<Card className="mb-5 rounded-2xl shadow-sm">
						<CardHeader className="pb-3">
							<div className="flex items-start gap-2">
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-primary/5">
									<HelpCircle className="h-4 w-4 text-primary" />
								</div>
								<CardTitle className="text-base">
									{currentQuestion.question}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<RadioGroup
								value={answers[currentQuestionIndex]?.toString()}
								onValueChange={(value) =>
									handleAnswer(currentQuestionIndex, Number.parseInt(value, 10))
								}
							>
								{currentQuestion.options.map((option, index) => (
									<div
										key={index}
										className={cn(
											"flex cursor-pointer items-center space-x-2.5 rounded-xl border p-2.5 text-sm transition-colors",
											answers[currentQuestionIndex] === index
												? "border-primary bg-primary/5"
												: "hover:border-primary/50",
										)}
										onClick={() => handleAnswer(currentQuestionIndex, index)}
										onKeyDown={() => {}}
										role="button"
										tabIndex={0}
									>
										<RadioGroupItem
											value={index.toString()}
											id={`option-${index}`}
										/>
										<Label
											htmlFor={`option-${index}`}
											className="flex-1 cursor-pointer text-sm"
										>
											{option}
										</Label>
									</div>
								))}
							</RadioGroup>
						</CardContent>
					</Card>
				)}

				{/* Navigation */}
				<div className="flex items-center justify-between">
					<Button
						variant="outline"
						size="sm"
						className="rounded-xl"
						onClick={() => setCurrentQuestionIndex((i) => i - 1)}
						disabled={currentQuestionIndex === 0}
					>
						<ArrowLeft className="mr-1 h-3.5 w-3.5" />
						Previous
					</Button>

					{currentQuestionIndex < questions.length - 1 ? (
						<Button
							size="sm"
							className="rounded-xl"
							onClick={() => setCurrentQuestionIndex((i) => i + 1)}
							disabled={answers[currentQuestionIndex] === undefined}
						>
							Next
							<ArrowRight className="ml-1 h-3.5 w-3.5" />
						</Button>
					) : (
						<Button
							size="sm"
							className="rounded-xl"
							onClick={handleSubmit}
							disabled={Object.keys(answers).length !== questions.length}
						>
							Submit Quiz
							<CheckCircle2 className="ml-1 h-3.5 w-3.5" />
						</Button>
					)}
				</div>

				{/* Question dots */}
				<div className="mt-5 flex items-center justify-center gap-1.5">
					{questions.map((_, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setCurrentQuestionIndex(index)}
							className={cn(
								"h-2.5 w-2.5 rounded-full transition-colors",
								index === currentQuestionIndex
									? "bg-primary"
									: answers[index] !== undefined
										? "bg-primary/50"
										: "bg-muted",
							)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

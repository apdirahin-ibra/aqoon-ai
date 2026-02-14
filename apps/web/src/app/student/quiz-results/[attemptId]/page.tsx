"use client";

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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
	question: string;
	options: string[];
	correctAnswer: number;
}

interface QuizAttempt {
	id: string;
	score: number;
	answers: Record<string, number>;
	quiz: {
		id: string;
		title: string;
		questions: Question[];
		lesson: {
			id: string;
			title: string;
			course: {
				id: string;
				title: string;
			};
		};
	};
}

const mockAttempt: QuizAttempt = {
	id: "1",
	score: 75,
	answers: { 0: 1, 1: 1, 2: 2, 3: 3 },
	quiz: {
		id: "q1",
		title: "Python Basics Quiz",
		questions: [
			{
				question: "What is the correct way to create a variable in Python?",
				options: ["var x = 5", "x = 5", "let x = 5", "int x = 5"],
				correctAnswer: 1,
			},
			{
				question: "Which data type is used to store text in Python?",
				options: ["int", "str", "char", "text"],
				correctAnswer: 1,
			},
			{
				question: "What is the output of print(2 + 3)?",
				options: ["5", "23", "2 + 3", "Error"],
				correctAnswer: 0,
			},
			{
				question: "Which keyword is used to define a function in Python?",
				options: ["function", "def", "func", "define"],
				correctAnswer: 1,
			},
		],
		lesson: {
			id: "l1",
			title: "Python Basics",
			course: {
				id: "c1",
				title: "Introduction to Python Programming",
			},
		},
	},
};

export default function QuizResultsPage() {
	const [attempt] = useState<QuizAttempt | null>(mockAttempt);
	const [loading] = useState(false);
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [loadingFeedback, setLoadingFeedback] = useState(false);

	const generateAIFeedback = () => {
		setLoadingFeedback(true);
		setTimeout(() => {
			setAiFeedback(
				"Great job! You have a solid understanding of Python basics. Focus on practicing more with functions and data types to improve further.",
			);
			setLoadingFeedback(false);
		}, 2000);
	};

	if (loading || !attempt) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const questions = attempt.quiz.questions;
	const answers = attempt.answers;
	const correctCount = Math.round((attempt.score / 100) * questions.length);
	const scoreLevel =
		attempt.score >= 80
			? "excellent"
			: attempt.score >= 60
				? "good"
				: "needs_work";

	return (
		<div className="container py-8">
			<div className="mb-8">
				<div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
					<span>{attempt.quiz.lesson.course.title}</span>
					<span>/</span>
					<span>{attempt.quiz.lesson.title}</span>
				</div>
				<h1 className="font-bold font-display text-3xl">
					{attempt.quiz.title} - Results
				</h1>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<Card
						className={`border-2 ${
							scoreLevel === "excellent"
								? "border-green-500 bg-green-500/5"
								: scoreLevel === "good"
									? "border-primary bg-primary/5"
									: "border-yellow-500 bg-yellow-500/5"
						}`}
					>
						<CardContent className="pt-6">
							<div className="mb-6 flex items-center justify-between">
								<div>
									<div className="mb-2 flex items-center gap-3">
										<Trophy
											className={`h-8 w-8 ${
												scoreLevel === "excellent"
													? "text-green-500"
													: scoreLevel === "good"
														? "text-primary"
														: "text-yellow-500"
											}`}
										/>
										<span className="font-bold text-4xl">{attempt.score}%</span>
									</div>
									<p className="text-muted-foreground">
										{correctCount} of {questions.length} correct
									</p>
								</div>
								<Badge
									variant={scoreLevel === "excellent" ? "default" : "secondary"}
									className="px-4 py-2 text-lg"
								>
									{scoreLevel === "excellent"
										? "Excellent!"
										: scoreLevel === "good"
											? "Good Job!"
											: "Keep Practicing"}
								</Badge>
							</div>
							<Progress value={attempt.score} className="h-3" />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="h-5 w-5" />
								Question Breakdown
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{questions.map((question, idx) => {
								const userAnswer = answers[idx];
								const isCorrect = userAnswer === question.correctAnswer;

								return (
									<div
										key={idx}
										className={`rounded-lg border p-4 ${
											isCorrect
												? "border-green-500/30 bg-green-500/5"
												: "border-red-500/30 bg-red-500/5"
										}`}
									>
										<div className="flex items-start gap-3">
											{isCorrect ? (
												<CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
											) : (
												<XCircle className="mt-0.5 h-5 w-5 text-red-500" />
											)}
											<div className="flex-1">
												<p className="mb-2 font-medium">
													Q{idx + 1}: {question.question}
												</p>
												<p className="text-muted-foreground text-sm">
													Your answer:{" "}
													<span
														className={
															isCorrect ? "text-green-500" : "text-red-500"
														}
													>
														{question.options[userAnswer]}
													</span>
												</p>
												{!isCorrect && (
													<p className="mt-1 text-green-500 text-sm">
														Correct: {question.options[question.correctAnswer]}
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

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-primary" />
								AI Feedback
							</CardTitle>
						</CardHeader>
						<CardContent>
							{aiFeedback ? (
								<p className="whitespace-pre-wrap">{aiFeedback}</p>
							) : (
								<div className="py-4 text-center">
									<p className="mb-4 text-muted-foreground">
										Get personalized feedback from AI
									</p>
									<Button
										onClick={generateAIFeedback}
										disabled={loadingFeedback}
									>
										{loadingFeedback ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Sparkles className="mr-2 h-4 w-4" />
										)}
										Get AI Feedback
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Next Steps
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" className="w-full">
								<RotateCcw className="mr-2 h-4 w-4" />
								Retry Quiz
							</Button>
							<Button variant="outline" className="w-full">
								<BookOpen className="mr-2 h-4 w-4" />
								Review Lesson
							</Button>
							<Button className="w-full">
								Continue Course
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

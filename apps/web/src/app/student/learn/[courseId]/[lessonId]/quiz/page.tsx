"use client";

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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Question {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
}

interface Quiz {
	id: string;
	title: string;
	questions: Question[];
	lessonId: string;
}

const mockQuiz: Quiz = {
	id: "1",
	title: "Python Basics Quiz",
	questions: [
		{
			id: "q1",
			question: "What is the correct way to create a variable in Python?",
			options: ["var x = 5", "x = 5", "let x = 5", "int x = 5"],
			correctAnswer: 1,
		},
		{
			id: "q2",
			question: "Which data type is used to store text in Python?",
			options: ["int", "str", "char", "text"],
			correctAnswer: 1,
		},
		{
			id: "q3",
			question: "What is the output of print(2 + 3)?",
			options: ["5", "23", "2 + 3", "Error"],
			correctAnswer: 0,
		},
		{
			id: "q4",
			question: "Which keyword is used to define a function in Python?",
			options: ["function", "def", "func", "define"],
			correctAnswer: 1,
		},
	],
	lessonId: "1",
};

export default function QuizPage() {
	const [quiz] = useState<Quiz | null>(mockQuiz);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState<number | null>(null);

	const handleAnswer = (questionId: string, answerIndex: number) => {
		if (submitted) return;
		setAnswers({ ...answers, [questionId]: answerIndex });
	};

	const handleSubmit = () => {
		if (!quiz) return;

		let correct = 0;
		quiz.questions.forEach((q) => {
			if (answers[q.id] === q.correctAnswer) {
				correct++;
			}
		});

		const finalScore = Math.round((correct / quiz.questions.length) * 100);
		setScore(finalScore);
		setSubmitted(true);
	};

	const handleRetry = () => {
		setAnswers({});
		setSubmitted(false);
		setScore(null);
		setCurrentQuestionIndex(0);
	};

	const currentQuestion = quiz?.questions[currentQuestionIndex];
	const progressPercent = quiz
		? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
		: 0;

	if (!quiz) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// Results view
	if (submitted && score !== null) {
		const passed = score >= 70;

		return (
			<div className="flex min-h-screen flex-col bg-background">
				<main className="container flex-1 py-12">
					<div className="mx-auto max-w-2xl">
						<Card className="text-center">
							<CardContent className="pt-12 pb-8">
								<div
									className={cn(
										"mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full",
										passed ? "bg-green-500/10" : "bg-red-500/10",
									)}
								>
									{passed ? (
										<Trophy className="h-12 w-12 text-green-500" />
									) : (
										<XCircle className="h-12 w-12 text-red-500" />
									)}
								</div>

								<h1 className="mb-2 font-bold font-display text-3xl">
									{passed ? "Congratulations!" : "Keep Practicing!"}
								</h1>
								<p className="mb-6 text-muted-foreground">
									{passed
										? "You have successfully passed the quiz."
										: "You need 70% to pass. Review the material and try again."}
								</p>

								<div
									className="mb-2 font-bold text-6xl"
									style={{
										color: passed ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)",
									}}
								>
									{score}%
								</div>
								<p className="mb-8 text-muted-foreground text-sm">
									{
										quiz.questions.filter(
											(q) => answers[q.id] === q.correctAnswer,
										).length
									}{" "}
									of {quiz.questions.length} correct
								</p>

								<div className="flex items-center justify-center gap-4">
									<Button variant="outline" onClick={handleRetry}>
										<RotateCcw className="mr-2 h-4 w-4" />
										Retry Quiz
									</Button>
									<Button>Back to Lesson</Button>
								</div>
							</CardContent>
						</Card>

						{/* Review Answers */}
						<div className="mt-8 space-y-4">
							<h2 className="font-semibold text-lg">Review Your Answers</h2>
							{quiz.questions.map((question, index) => {
								const userAnswer = answers[question.id];
								const isCorrect = userAnswer === question.correctAnswer;

								return (
									<Card key={question.id}>
										<CardContent className="pt-4">
											<div className="flex items-start gap-3">
												<div
													className={cn(
														"mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
														isCorrect ? "bg-green-500/10" : "bg-red-500/10",
													)}
												>
													{isCorrect ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<XCircle className="h-4 w-4 text-red-500" />
													)}
												</div>
												<div className="flex-1">
													<p className="mb-2 font-medium">
														{index + 1}. {question.question}
													</p>
													<div className="space-y-1 text-sm">
														{question.options.map((option, optIndex) => (
															<div
																key={optIndex}
																className={cn(
																	"rounded p-2",
																	optIndex === question.correctAnswer &&
																		"bg-green-500/10 text-green-500",
																	optIndex === userAnswer &&
																		optIndex !== question.correctAnswer &&
																		"bg-red-500/10 text-red-500",
																)}
															>
																{option}
																{optIndex === question.correctAnswer && " ✓"}
																{optIndex === userAnswer &&
																	optIndex !== question.correctAnswer &&
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
				</main>
			</div>
		);
	}

	// Quiz view
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<main className="container flex-1 py-8">
				<div className="mx-auto max-w-3xl">
					<div className="mb-8">
						<div className="mb-4 inline-flex items-center text-muted-foreground text-sm">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Lesson
						</div>
						<h1 className="font-bold font-display text-3xl">{quiz.title}</h1>
					</div>

					{/* Progress */}
					<div className="mb-8">
						<div className="mb-2 flex items-center justify-between text-sm">
							<span className="text-muted-foreground">
								Question {currentQuestionIndex + 1} of {quiz.questions.length}
							</span>
							<span className="font-medium">
								{Math.round(progressPercent)}%
							</span>
						</div>
						<Progress value={progressPercent} className="h-2" />
					</div>

					{/* Question Card */}
					{currentQuestion && (
						<Card className="mb-8">
							<CardHeader>
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
										<HelpCircle className="h-4 w-4 text-primary" />
									</div>
									<CardTitle className="text-xl">
										{currentQuestion.question}
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<RadioGroup
									value={answers[currentQuestion.id]?.toString()}
									onValueChange={(value) =>
										handleAnswer(currentQuestion.id, Number.parseInt(value))
									}
								>
									{currentQuestion.options.map((option, index) => (
										<div
											key={index}
											className={cn(
												"flex cursor-pointer items-center space-x-3 rounded-lg border border-border p-4 transition-colors",
												answers[currentQuestion.id] === index
													? "border-primary bg-primary/5"
													: "hover:border-primary/50",
											)}
											onClick={() => handleAnswer(currentQuestion.id, index)}
										>
											<RadioGroupItem
												value={index.toString()}
												id={`option-${index}`}
											/>
											<Label
												htmlFor={`option-${index}`}
												className="flex-1 cursor-pointer"
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
							onClick={() => setCurrentQuestionIndex((i) => i - 1)}
							disabled={currentQuestionIndex === 0}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Previous
						</Button>

						{currentQuestionIndex < quiz.questions.length - 1 ? (
							<Button
								onClick={() => setCurrentQuestionIndex((i) => i + 1)}
								disabled={answers[currentQuestion?.id || ""] === undefined}
							>
								Next
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={Object.keys(answers).length !== quiz.questions.length}
							>
								Submit Quiz
								<CheckCircle2 className="ml-2 h-4 w-4" />
							</Button>
						)}
					</div>

					{/* Question dots */}
					<div className="mt-8 flex items-center justify-center gap-2">
						{quiz.questions.map((q, index) => (
							<button
								key={q.id}
								onClick={() => setCurrentQuestionIndex(index)}
								className={cn(
									"h-3 w-3 rounded-full transition-colors",
									index === currentQuestionIndex
										? "bg-primary"
										: answers[q.id] !== undefined
											? "bg-primary/50"
											: "bg-muted",
								)}
							/>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}

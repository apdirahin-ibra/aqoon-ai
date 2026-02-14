"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	BookOpen,
	CheckCircle,
	Loader2,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ASSESSMENT_QUESTIONS: Record<
	string,
	{ question: string; options: string[] }[]
> = {
	coding: [
		{
			question:
				"How familiar are you with programming concepts like variables, loops, and functions?",
			options: [
				"Never heard of them",
				"Know the basics",
				"Use them regularly",
				"Expert level",
			],
		},
		{
			question: "Have you built a complete project from scratch?",
			options: [
				"Never",
				"One small project",
				"Several projects",
				"Many complex projects",
			],
		},
		{
			question: "How comfortable are you with debugging code?",
			options: [
				"Very uncomfortable",
				"Need lots of help",
				"Can usually figure it out",
				"Debug complex issues easily",
			],
		},
		{
			question: "Experience with version control (Git)?",
			options: [
				"Never used it",
				"Basic commits",
				"Branching and merging",
				"Advanced workflows",
			],
		},
		{
			question: "How do you approach learning new technologies?",
			options: [
				"Follow tutorials step by step",
				"Mix tutorials with experimentation",
				"Read docs and build projects",
				"Dive into source code",
			],
		},
	],
	languages: [
		{
			question: "Can you understand basic greetings and introductions?",
			options: ["Not at all", "A few words", "Basic conversations", "Fluently"],
		},
		{
			question: "How is your reading comprehension?",
			options: [
				"Cannot read",
				"Simple texts with help",
				"Most texts with dictionary",
				"Native-level",
			],
		},
		{
			question: "Can you hold a conversation?",
			options: [
				"Cannot speak",
				"Simple phrases",
				"Daily conversations",
				"Complex discussions",
			],
		},
	],
	art: [
		{
			question: "How comfortable are you with basic drawing?",
			options: [
				"Never drawn",
				"Struggle with basics",
				"Can draw simple things",
				"Draw complex subjects",
			],
		},
		{
			question: "Understanding of color theory?",
			options: [
				"No knowledge",
				"Basic color wheel",
				"Understand harmonies",
				"Expert application",
			],
		},
		{
			question: "Experience with digital tools?",
			options: [
				"Never used",
				"Basic familiarity",
				"Regular user",
				"Advanced techniques",
			],
		},
	],
};

interface AssessmentResult {
	level: string;
	score: number;
	strengths: string[];
	weaknesses: string[];
	recommendations: string[];
}

const categories = [
	{
		id: "coding",
		name: "Coding",
		icon: "💻",
		description: "Programming and software development",
	},
	{
		id: "languages",
		name: "Languages",
		icon: "🌍",
		description: "Foreign language proficiency",
	},
	{
		id: "art",
		name: "Art & Design",
		icon: "🎨",
		description: "Visual arts and design skills",
	},
];

const mockResult: AssessmentResult = {
	level: "intermediate",
	score: 65,
	strengths: [
		"Good understanding of basics",
		"Can debug simple issues",
		"Familiar with version control",
	],
	weaknesses: [
		"Need more practice with advanced concepts",
		"Should work on complex projects",
	],
	recommendations: [
		"Take the React course",
		"Build more projects",
		"Practice debugging daily",
	],
};

export default function SkillAssessmentPage() {
	const [category, setCategory] = useState<string | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<AssessmentResult | null>(null);

	const questions = category ? ASSESSMENT_QUESTIONS[category] || [] : [];
	const progress =
		questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

	const handleAnswer = (value: string) => {
		setAnswers({ ...answers, [currentQuestion]: Number.parseInt(value) });
	};

	const submitAssessment = () => {
		setLoading(true);
		setTimeout(() => {
			setResult(mockResult);
			setLoading(false);
		}, 2000);
	};

	if (result) {
		return (
			<div className="container py-8">
				<div className="mx-auto max-w-2xl">
					<Card className="border-2 border-primary">
						<CardHeader className="text-center">
							<Badge
								className="mx-auto mb-4 w-fit"
								variant={result.level === "advanced" ? "default" : "secondary"}
							>
								{result.level.charAt(0).toUpperCase() + result.level.slice(1)}{" "}
								Level
							</Badge>
							<CardTitle className="text-3xl">Assessment Complete!</CardTitle>
							<CardDescription>
								Here&apos;s your {category} skill analysis
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center">
								<div className="mb-2 font-bold text-5xl text-primary">
									{result.score}%
								</div>
								<p className="text-muted-foreground">Proficiency Score</p>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center gap-2 text-sm">
											<CheckCircle className="h-4 w-4 text-green-500" />
											Strengths
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-1 text-sm">
											{result.strengths.map((s, i) => (
												<li key={i} className="text-muted-foreground">
													• {s}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center gap-2 text-sm">
											<AlertCircle className="h-4 w-4 text-yellow-500" />
											Areas to Improve
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-1 text-sm">
											{result.weaknesses.map((w, i) => (
												<li key={i} className="text-muted-foreground">
													• {w}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-sm">
										<TrendingUp className="h-4 w-4 text-primary" />
										Recommendations
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm">
										{result.recommendations.map((r, i) => (
											<li key={i} className="flex items-start gap-2">
												<span className="font-bold text-primary">{i + 1}.</span>
												<span className="text-muted-foreground">{r}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>

							<div className="flex gap-4">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => {
										setCategory(null);
										setResult(null);
									}}
								>
									Retake Assessment
								</Button>
								<Button className="flex-1">
									<BookOpen className="mr-2 h-4 w-4" />
									Browse Courses
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!category) {
		return (
			<div className="container py-8">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold font-display text-3xl">
						Skill Assessment
					</h1>
					<p className="mx-auto max-w-xl text-muted-foreground">
						Take a quick assessment to discover your current skill level and get
						personalized course recommendations.
					</p>
				</div>

				<div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
					{categories.map((cat) => (
						<Card
							key={cat.id}
							className="cursor-pointer transition-colors hover:border-primary"
							onClick={() => setCategory(cat.id)}
						>
							<CardContent className="pt-6 text-center">
								<div className="mb-4 text-4xl">{cat.icon}</div>
								<h3 className="mb-2 font-semibold">{cat.name}</h3>
								<p className="text-muted-foreground text-sm">
									{cat.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-6">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-muted-foreground text-sm">
							Question {currentQuestion + 1} of {questions.length}
						</span>
						<Badge
							variant="outline"
							className="cursor-pointer"
							onClick={() => setCategory(null)}
						>
							Change Category
						</Badge>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>{questions[currentQuestion]?.question}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<RadioGroup
							value={answers[currentQuestion]?.toString()}
							onValueChange={handleAnswer}
						>
							{questions[currentQuestion]?.options.map((option, idx) => (
								<div
									key={idx}
									className="flex items-center space-x-3 rounded-lg border p-3 hover:border-primary"
								>
									<RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
									<Label
										htmlFor={`option-${idx}`}
										className="flex-1 cursor-pointer"
									>
										{option}
									</Label>
								</div>
							))}
						</RadioGroup>

						<div className="flex justify-between">
							<Button
								variant="outline"
								onClick={() => setCurrentQuestion((i) => i - 1)}
								disabled={currentQuestion === 0}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Previous
							</Button>

							{currentQuestion < questions.length - 1 ? (
								<Button
									onClick={() => setCurrentQuestion((i) => i + 1)}
									disabled={answers[currentQuestion] === undefined}
								>
									Next
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							) : (
								<Button
									onClick={submitAssessment}
									disabled={loading || answers[currentQuestion] === undefined}
								>
									{loading ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Sparkles className="mr-2 h-4 w-4" />
									)}
									Get Results
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

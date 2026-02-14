"use client";

import {
	BookOpen,
	Calendar,
	CheckCircle,
	Lightbulb,
	Loader2,
	Save,
	Sparkles,
	Target,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface StudyPlan {
	weeks: {
		week: number;
		focus: string;
		tasks: string[];
		milestone: string;
	}[];
	tips: string[];
}

const mockPlan: StudyPlan = {
	weeks: [
		{
			week: 1,
			focus: "Python Basics",
			tasks: [
				"Install Python and set up development environment",
				"Learn variables, data types, and basic operators",
				"Write your first Python program",
			],
			milestone: "Write a program that calculates basic arithmetic",
		},
		{
			week: 2,
			focus: "Control Flow",
			tasks: [
				"Understand if, elif, else statements",
				"Learn about loops (for and while)",
				"Practice conditional logic",
			],
			milestone: "Build a simple calculator program",
		},
		{
			week: 3,
			focus: "Functions",
			tasks: [
				"Learn function definition and calling",
				"Understand parameters and return values",
				"Practice with built-in functions",
			],
			milestone: "Create a function library for common tasks",
		},
		{
			week: 4,
			focus: "Data Structures",
			tasks: [
				"Learn lists, tuples, and dictionaries",
				"Understand when to use each data structure",
				"Practice manipulation and iteration",
			],
			milestone: "Build a contact book application",
		},
	],
	tips: [
		"Practice coding daily, even if just for 30 minutes",
		"Work on small projects to reinforce learning",
		"Don't be afraid to make mistakes - they're part of learning!",
	],
};

export default function StudyPlanPage() {
	const [goal, setGoal] = useState("");
	const [category, setCategory] = useState("coding");
	const [level, setLevel] = useState("beginner");
	const [weeklyHours, setWeeklyHours] = useState([5]);
	const [duration, setDuration] = useState("4");
	const [loading, setLoading] = useState(false);
	const [plan, setPlan] = useState<StudyPlan | null>(mockPlan);

	const generatePlan = () => {
		setLoading(true);
		setTimeout(() => {
			setPlan(mockPlan);
			setLoading(false);
		}, 2000);
	};

	const savePlan = () => {
		alert("Plan saved!");
	};

	return (
		<div className="container py-8">
			<div className="mb-8 text-center">
				<h1 className="mb-2 font-bold font-display text-3xl">
					AI Study Plan Generator
				</h1>
				<p className="mx-auto max-w-2xl text-muted-foreground">
					Tell us your learning goals and we&apos;ll create a personalized study
					plan tailored to your schedule and skill level.
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Input Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Your Learning Goals
						</CardTitle>
						<CardDescription>
							Customize your study plan parameters
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="goal">What do you want to learn?</Label>
							<Input
								id="goal"
								placeholder="e.g., Build full-stack web applications with React and Node.js"
								value={goal}
								onChange={(e) => setGoal(e.target.value)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Category</Label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="coding">Coding</SelectItem>
										<SelectItem value="languages">Languages</SelectItem>
										<SelectItem value="art">Art & Design</SelectItem>
										<SelectItem value="business">Business</SelectItem>
										<SelectItem value="music">Music</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Current Level</Label>
								<Select value={level} onValueChange={setLevel}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="beginner">Beginner</SelectItem>
										<SelectItem value="intermediate">Intermediate</SelectItem>
										<SelectItem value="advanced">Advanced</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label>Weekly Time Commitment</Label>
								<span className="font-medium text-sm">
									{weeklyHours[0]} hours/week
								</span>
							</div>
							<Slider
								value={weeklyHours}
								onValueChange={setWeeklyHours}
								min={1}
								max={40}
								step={1}
							/>
							<div className="flex justify-between text-muted-foreground text-xs">
								<span>1 hour</span>
								<span>40 hours</span>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Plan Duration</Label>
							<Select value={duration} onValueChange={setDuration}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2">2 weeks</SelectItem>
									<SelectItem value="4">4 weeks</SelectItem>
									<SelectItem value="8">8 weeks</SelectItem>
									<SelectItem value="12">12 weeks</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={generatePlan}
							disabled={loading}
							className="w-full"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Generating Plan...
								</>
							) : (
								<>
									<Sparkles className="mr-2 h-4 w-4" />
									Generate Study Plan
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Generated Plan */}
				<div className="space-y-6">
					{plan ? (
						<>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Calendar className="h-5 w-5" />
											Your Study Plan
										</CardTitle>
										<Button onClick={savePlan} size="sm">
											<Save className="mr-2 h-4 w-4" />
											Save Plan
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{plan.weeks.map((week) => (
										<div
											key={week.week}
											className="border-primary border-l-2 pl-4"
										>
											<div className="mb-2 flex items-center gap-2">
												<Badge variant="secondary">Week {week.week}</Badge>
												<span className="font-semibold">{week.focus}</span>
											</div>
											<ul className="mb-2 space-y-1">
												{week.tasks.map((task, idx) => (
													<li
														key={idx}
														className="flex items-start gap-2 text-muted-foreground text-sm"
													>
														<CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
														{task}
													</li>
												))}
											</ul>
											<div className="flex items-center gap-2 text-sm">
												<Target className="h-4 w-4 text-primary" />
												<span className="font-medium text-primary">
													Milestone:
												</span>
												<span>{week.milestone}</span>
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{plan.tips && plan.tips.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Lightbulb className="h-5 w-5 text-yellow-500" />
											Study Tips
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{plan.tips.map((tip, idx) => (
												<li
													key={idx}
													className="flex items-start gap-2 text-sm"
												>
													<span className="font-bold text-primary">
														{idx + 1}.
													</span>
													{tip}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							)}
						</>
					) : (
						<Card className="flex h-full items-center justify-center">
							<CardContent className="py-12 text-center">
								<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
								<h3 className="mb-2 font-semibold">No plan generated yet</h3>
								<p className="text-muted-foreground text-sm">
									Fill in your learning goals and click generate to create your
									personalized study plan.
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

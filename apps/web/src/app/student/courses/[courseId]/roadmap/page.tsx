"use client";

import { CheckCircle, Lock, Map, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Milestone {
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	isLocked: boolean;
	lessons: { id: string; title: string; duration: number }[];
}

const mockRoadmap: Milestone[] = [
	{
		id: "1",
		title: "Getting Started",
		description: "Learn the basics of Python",
		isCompleted: true,
		isLocked: false,
		lessons: [
			{ id: "l1", title: "Introduction", duration: 15 },
			{ id: "l2", title: "Setting Up", duration: 10 },
		],
	},
	{
		id: "2",
		title: "Variables & Data Types",
		description: "Core Python concepts",
		isCompleted: true,
		isLocked: false,
		lessons: [
			{ id: "l3", title: "Variables", duration: 20 },
			{ id: "l4", title: "Strings", duration: 25 },
			{ id: "l5", title: "Numbers", duration: 15 },
		],
	},
	{
		id: "3",
		title: "Control Flow",
		description: "Logic and decision making",
		isCompleted: false,
		isLocked: false,
		lessons: [
			{ id: "l6", title: "If Statements", duration: 20 },
			{ id: "l7", title: "Loops", duration: 25 },
			{ id: "l8", title: "Functions", duration: 30 },
		],
	},
	{
		id: "4",
		title: "Advanced Concepts",
		description: "Professional Python skills",
		isCompleted: false,
		isLocked: true,
		lessons: [
			{ id: "l9", title: "OOP Basics", duration: 35 },
			{ id: "l10", title: "Modules", duration: 20 },
		],
	},
];

export default function CourseRoadmapPage() {
	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">Course Roadmap</h1>
				<p className="text-muted-foreground">Track your learning journey</p>
			</div>

			<div className="relative">
				<div className="absolute top-0 bottom-0 left-8 w-0.5 bg-muted" />

				<div className="space-y-8">
					{mockRoadmap.map((milestone, index) => (
						<div key={milestone.id} className="relative flex gap-6">
							<div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-background">
								{milestone.isCompleted ? (
									<CheckCircle className="h-8 w-8 text-green-500" />
								) : milestone.isLocked ? (
									<Lock className="h-6 w-6 text-muted-foreground" />
								) : (
									<span className="font-bold text-lg">{index + 1}</span>
								)}
							</div>

							<Card className="flex-1">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-xl">
												{milestone.title}
											</CardTitle>
											<p className="mt-1 text-muted-foreground text-sm">
												{milestone.description}
											</p>
										</div>
										{milestone.isCompleted && (
											<Badge variant="default" className="bg-green-500">
												Completed
											</Badge>
										)}
										{milestone.isLocked && !milestone.isCompleted && (
											<Badge variant="secondary">Locked</Badge>
										)}
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{milestone.lessons.map((lesson) => (
											<div
												key={lesson.id}
												className={`flex items-center justify-between rounded-lg border p-3 ${
													milestone.isLocked ? "opacity-50" : ""
												}`}
											>
												<div className="flex items-center gap-3">
													{milestone.isLocked ? (
														<Lock className="h-4 w-4 text-muted-foreground" />
													) : (
														<Play className="h-4 w-4 text-primary" />
													)}
													<span
														className={
															milestone.isLocked ? "text-muted-foreground" : ""
														}
													>
														{lesson.title}
													</span>
												</div>
												<span className="text-muted-foreground text-sm">
													{lesson.duration} min
												</span>
											</div>
										))}
									</div>
									{!milestone.isLocked && !milestone.isCompleted && (
										<Button className="mt-4 w-full">Start Module</Button>
									)}
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

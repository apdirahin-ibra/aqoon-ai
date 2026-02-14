"use client";

import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	CheckCircle2,
	ChevronLeft,
	Circle,
	Clock,
	Loader2,
	Play,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Lesson {
	id: string;
	title: string;
	content: string | null;
	durationMinutes: number | null;
	orderIndex: number;
	isPreview: boolean;
}

interface Course {
	id: string;
	title: string;
}

const mockCourse: Course = {
	id: "1",
	title: "Introduction to Python Programming",
};

const mockLessons: Lesson[] = [
	{
		id: "1",
		title: "Introduction to Python",
		content:
			"Welcome to Python! In this lesson, we'll cover the basics of Python programming...",
		durationMinutes: 15,
		orderIndex: 0,
		isPreview: true,
	},
	{
		id: "2",
		title: "Variables and Data Types",
		content:
			"Learn about variables, strings, numbers, and other data types in Python...",
		durationMinutes: 20,
		orderIndex: 1,
		isPreview: false,
	},
	{
		id: "3",
		title: "Control Flow",
		content: "Understanding if statements, loops, and conditional logic...",
		durationMinutes: 25,
		orderIndex: 2,
		isPreview: false,
	},
	{
		id: "4",
		title: "Functions",
		content: "Learn how to define and call functions in Python...",
		durationMinutes: 30,
		orderIndex: 3,
		isPreview: false,
	},
];

export default function LessonViewerPage({
	params,
}: {
	params: Promise<{ courseId: string; lessonId: string }>;
}) {
	const [resolvedParams] = useState<{ courseId: string; lessonId: string }>({
		courseId: "1",
		lessonId: "1",
	});
	const [course] = useState<Course | null>(mockCourse);
	const [lessons] = useState<Lesson[]>(mockLessons);
	const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
		mockLessons[0],
	);
	const [completedLessons, setCompletedLessons] = useState<Set<string>>(
		new Set(),
	);
	const [loading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const toggleLessonComplete = async (lessonId: string) => {
		const isCompleted = completedLessons.has(lessonId);

		if (isCompleted) {
			setCompletedLessons((prev) => {
				const next = new Set(prev);
				next.delete(lessonId);
				return next;
			});
		} else {
			setCompletedLessons((prev) => new Set([...prev, lessonId]));
		}
	};

	const navigateToLesson = (lesson: Lesson) => {
		setCurrentLesson(lesson);
	};

	const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
	const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
	const nextLesson =
		currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
	const progressPercent =
		lessons.length > 0 ? (completedLessons.size / lessons.length) * 100 : 0;

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<div className="flex flex-1">
				{/* Sidebar */}
				<aside
					className={cn(
						"flex flex-col border-r bg-card transition-all duration-300",
						sidebarOpen ? "w-80" : "w-0 overflow-hidden",
					)}
				>
					<div className="border-b p-4">
						<div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
							<ChevronLeft className="h-4 w-4" />
							<span>Back to Course</span>
						</div>
						<h2 className="mt-2 line-clamp-2 font-semibold">{course?.title}</h2>
						<div className="mt-3">
							<div className="mb-1 flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Progress</span>
								<span className="font-medium">
									{Math.round(progressPercent)}%
								</span>
							</div>
							<Progress value={progressPercent} className="h-2" />
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-2">
						{lessons.map((lesson, index) => {
							const isCompleted = completedLessons.has(lesson.id);
							const isCurrent = lesson.id === currentLesson?.id;

							return (
								<button
									key={lesson.id}
									onClick={() => navigateToLesson(lesson)}
									className={cn(
										"flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
										isCurrent
											? "border border-primary/20 bg-primary/10"
											: "hover:bg-muted/50",
									)}
								>
									<div className="mt-0.5">
										{isCompleted ? (
											<CheckCircle2 className="h-5 w-5 text-green-500" />
										) : isCurrent ? (
											<Play className="h-5 w-5 text-primary" />
										) : (
											<Circle className="h-5 w-5 text-muted-foreground" />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p
											className={cn(
												"line-clamp-2 font-medium text-sm",
												isCurrent && "text-primary",
											)}
										>
											{index + 1}. {lesson.title}
										</p>
										{lesson.durationMinutes && (
											<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
												<Clock className="h-3 w-3" />
												{lesson.durationMinutes} min
											</p>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</aside>

				{/* Toggle Button */}
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-r-lg border bg-card p-2 shadow-sm transition-colors hover:bg-muted"
					style={{ left: sidebarOpen ? "318px" : "0" }}
				>
					<ChevronLeft
						className={cn(
							"h-4 w-4 transition-transform",
							!sidebarOpen && "rotate-180",
						)}
					/>
				</button>

				{/* Main Content */}
				<main className="flex-1 overflow-y-auto">
					{currentLesson ? (
						<div className="mx-auto max-w-4xl p-8">
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="mb-1 text-muted-foreground text-sm">
										Lesson {currentIndex + 1} of {lessons.length}
									</p>
									<h1 className="font-bold font-display text-3xl">
										{currentLesson.title}
									</h1>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox
										id="complete"
										checked={completedLessons.has(currentLesson.id)}
										onCheckedChange={() =>
											toggleLessonComplete(currentLesson.id)
										}
									/>
									<label htmlFor="complete" className="cursor-pointer text-sm">
										Mark as complete
									</label>
								</div>
							</div>

							{currentLesson.durationMinutes && (
								<div className="mb-8 flex items-center gap-2 text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span>{currentLesson.durationMinutes} minutes</span>
								</div>
							)}

							<Card>
								<CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6">
									{currentLesson.content ? (
										<div>{currentLesson.content}</div>
									) : (
										<div className="py-12 text-center text-muted-foreground">
											<BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
											<p>No content available for this lesson yet.</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Navigation */}
							<div className="mt-8 flex items-center justify-between">
								{prevLesson ? (
									<Button
										variant="outline"
										onClick={() => navigateToLesson(prevLesson)}
									>
										<ArrowLeft className="mr-2 h-4 w-4" />
										Previous: {prevLesson.title}
									</Button>
								) : (
									<div />
								)}

								{nextLesson ? (
									<Button onClick={() => navigateToLesson(nextLesson)}>
										Next: {nextLesson.title}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								) : (
									<Button>
										Finish Course
										<CheckCircle2 className="ml-2 h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					) : (
						<div className="flex h-full items-center justify-center text-muted-foreground">
							<div className="text-center">
								<BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
								<p>No lessons available</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

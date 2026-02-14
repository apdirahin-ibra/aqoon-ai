"use client";

import { BookOpen, CheckCircle2, Clock, Loader2, Play } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

interface EnrolledCourse {
	id: string;
	courseId: string;
	enrolledAt: string;
	completedAt: string | null;
	course: {
		id: string;
		title: string;
		description: string | null;
		thumbnailUrl: string | null;
		level: string;
		category: string;
	};
	progress: number;
	totalLessons: number;
	completedLessons: number;
}

const mockEnrollments: EnrolledCourse[] = [
	{
		id: "1",
		courseId: "1",
		enrolledAt: "2024-01-15",
		completedAt: null,
		course: {
			id: "1",
			title: "Introduction to Python Programming",
			description: "Learn Python from scratch",
			thumbnailUrl: null,
			level: "beginner",
			category: "coding",
		},
		progress: 65,
		totalLessons: 20,
		completedLessons: 13,
	},
	{
		id: "2",
		courseId: "2",
		enrolledAt: "2024-01-20",
		completedAt: null,
		course: {
			id: "2",
			title: "Web Development with React",
			description: "Build modern web applications",
			thumbnailUrl: null,
			level: "intermediate",
			category: "coding",
		},
		progress: 30,
		totalLessons: 25,
		completedLessons: 8,
	},
];

export default function MyCoursesPage() {
	const [enrollments] = useState<EnrolledCourse[]>(mockEnrollments);
	const [loading] = useState(false);

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">My Courses</h1>
				<p className="text-muted-foreground">
					Continue learning from where you left off
				</p>
			</div>

			{enrollments.length === 0 ? (
				<Card className="py-12 text-center">
					<CardContent>
						<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">No courses yet</h3>
						<p className="mb-4 text-muted-foreground">
							Start your learning journey by enrolling in a course
						</p>
						<Button>Browse Courses</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{enrollments.map((enrollment) => (
						<Card
							key={enrollment.id}
							className="overflow-hidden transition-shadow hover:shadow-lg"
						>
							<div className="relative aspect-video bg-muted">
								{enrollment.course.thumbnailUrl ? (
									<img
										src={enrollment.course.thumbnailUrl}
										alt={enrollment.course.title}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<BookOpen className="h-12 w-12 text-muted-foreground" />
									</div>
								)}
								{enrollment.completedAt && (
									<div className="absolute top-2 right-2">
										<Badge className="bg-green-500 text-green-foreground">
											<CheckCircle2 className="mr-1 h-3 w-3" />
											Completed
										</Badge>
									</div>
								)}
							</div>
							<CardHeader className="pb-2">
								<div className="mb-2 flex items-center gap-2">
									<Badge variant="outline" className="capitalize">
										{enrollment.course.level}
									</Badge>
									<Badge variant="secondary" className="capitalize">
										{enrollment.course.category}
									</Badge>
								</div>
								<CardTitle className="line-clamp-2">
									{enrollment.course.title}
								</CardTitle>
								<CardDescription className="line-clamp-2">
									{enrollment.course.description || "No description available"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Progress</span>
											<span className="font-medium">
												{enrollment.progress}%
											</span>
										</div>
										<Progress value={enrollment.progress} className="h-2" />
										<div className="flex items-center gap-1 text-muted-foreground text-xs">
											<Clock className="h-3 w-3" />
											{enrollment.completedLessons} of {enrollment.totalLessons}{" "}
											lessons completed
										</div>
									</div>
									<Button className="w-full">
										<Play className="mr-2 h-4 w-4" />
										{enrollment.progress === 0
											? "Start Learning"
											: "Continue Learning"}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

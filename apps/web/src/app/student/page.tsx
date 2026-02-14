"use client";

import { ArrowRight, BookOpen, Clock, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Enrollment {
	id: string;
	enrolledAt: string;
	course: {
		id: string;
		title: string;
		description: string | null;
		thumbnailUrl: string | null;
		category: string;
		level: string;
		isPremium: boolean;
		priceCents: number | null;
	};
	progress: number;
}

const mockEnrollments: Enrollment[] = [
	{
		id: "1",
		enrolledAt: "2024-01-15",
		course: {
			id: "1",
			title: "Introduction to Python Programming",
			description: "Learn Python from scratch",
			thumbnailUrl: null,
			category: "coding",
			level: "beginner",
			isPremium: false,
			priceCents: 0,
		},
		progress: 65,
	},
	{
		id: "2",
		enrolledAt: "2024-01-20",
		course: {
			id: "2",
			title: "Web Development with React",
			description: "Build modern web apps",
			thumbnailUrl: null,
			category: "coding",
			level: "intermediate",
			isPremium: true,
			priceCents: 4999,
		},
		progress: 30,
	},
];

export default function StudentDashboardPage() {
	const [enrollments] = useState<Enrollment[]>(mockEnrollments);
	const [loading] = useState(false);

	const stats = {
		coursesEnrolled: enrollments.length,
		coursesCompleted: enrollments.filter((e) => e.progress === 100).length,
		totalHours: enrollments.length * 5,
	};

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container px-4 py-8 lg:px-6">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-2xl md:text-3xl">
					My Learning
				</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Track your progress and continue where you left off
				</p>
			</div>

			{/* Stats Cards */}
			<div className="mb-10 grid gap-6 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
								<BookOpen className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="font-bold text-2xl">{stats.coursesEnrolled}</p>
								<p className="text-muted-foreground text-sm">
									Courses Enrolled
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
								<Trophy className="h-6 w-6 text-green-500" />
							</div>
							<div>
								<p className="font-bold text-2xl">{stats.coursesCompleted}</p>
								<p className="text-muted-foreground text-sm">Completed</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
								<Clock className="h-6 w-6 text-accent" />
							</div>
							<div>
								<p className="font-bold text-2xl">{stats.totalHours}h</p>
								<p className="text-muted-foreground text-sm">Learning Time</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Current Courses */}
			<div className="mb-10">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="font-display font-semibold text-xl">
						Continue Learning
					</h2>
					<Button asChild variant="ghost" size="sm">
						<Link href="/courses">
							Browse More
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>

				{enrollments.length > 0 ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{enrollments.map((enrollment) => (
							<Link
								key={enrollment.id}
								href={`/student/learn/${enrollment.course.id}/1`}
								className="block"
							>
								<Card className="transition-shadow hover:shadow-lg">
									<div className="relative aspect-video overflow-hidden rounded-t-lg">
										{enrollment.course.thumbnailUrl ? (
											<img
												src={enrollment.course.thumbnailUrl}
												alt={enrollment.course.title}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
												<BookOpen className="h-12 w-12 text-primary/40" />
											</div>
										)}
									</div>
									<CardContent className="p-4">
										<h3 className="mb-2 line-clamp-1 font-semibold">
											{enrollment.course.title}
										</h3>
										<Progress value={enrollment.progress} className="h-2" />
										<p className="mt-1 text-right text-muted-foreground text-xs">
											{enrollment.progress}%
										</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<Card>
						<CardContent className="py-12 text-center">
							<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold">No courses yet</h3>
							<p className="mb-4 text-muted-foreground">
								Start your learning journey by enrolling in a course
							</p>
							<Button asChild>
								<Link href="/courses">Browse Courses</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

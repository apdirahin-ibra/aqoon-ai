"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	Clock,
	FolderOpen,
	Lock,
	Map,
	MessageSquare,
	Play,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
	"Web Development": "bg-blue-500/10 text-blue-500",
	"Data Science": "bg-green-500/10 text-green-500",
	"Backend Development": "bg-purple-500/10 text-purple-500",
	coding: "bg-blue-500/10 text-blue-500",
	languages: "bg-green-500/10 text-green-500",
	art: "bg-purple-500/10 text-purple-500",
	business: "bg-orange-500/10 text-orange-500",
	music: "bg-pink-500/10 text-pink-500",
};

export default function CourseDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const courseId = id as Id<"courses">;

	const course = useQuery(api.courses.get, { courseId });
	const lessons = useQuery(api.lessons.listByCourse, { courseId });

	// enrollments.check requires auth — if the user is not logged in,
	// the server-side requireAuth throws and useQuery returns undefined.
	const enrollmentStatus = useQuery(api.enrollments.check, { courseId });
	const isEnrolled = enrollmentStatus?.enrolled ?? false;
	const enroll = useMutation(api.enrollments.enroll);

	const formatPrice = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);
	};

	if (course === undefined) {
		return (
			<div className="flex min-h-screen flex-col bg-background">
				<div className="bg-primary py-12 text-primary-foreground">
					<div className="container">
						<Skeleton className="mb-4 h-8 w-32 bg-white/20" />
						<div className="grid gap-8 lg:grid-cols-3">
							<div className="space-y-4 lg:col-span-2">
								<Skeleton className="h-6 w-40 bg-white/20" />
								<Skeleton className="h-10 w-full bg-white/20" />
								<Skeleton className="h-20 w-full bg-white/20" />
							</div>
							<Skeleton className="h-64 rounded-xl bg-white/20" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (course === null) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h2 className="mb-2 font-bold text-xl">Course Not Found</h2>
					<p className="mb-4 text-muted-foreground">
						This course doesn&apos;t exist or has been removed.
					</p>
					<Button asChild>
						<Link href="/courses">Browse Courses</Link>
					</Button>
				</div>
			</div>
		);
	}

	const totalDuration = course.totalDuration ?? 0;
	const lessonsList = lessons ?? [];
	const firstLessonId = lessonsList.length > 0 ? lessonsList[0]._id : null;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Course Header */}
			<div className="bg-primary py-12 text-primary-foreground">
				<div className="container">
					<div className="mb-4 flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="text-primary-foreground hover:bg-white/10"
							asChild
						>
							<Link href="/courses">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Courses
							</Link>
						</Button>
					</div>

					<div className="grid gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<div className="mb-4 flex items-center gap-2">
								<span
									className={cn(
										"rounded-full px-2.5 py-1 font-medium text-xs capitalize",
										categoryStyles[course.category] ||
											"bg-muted text-muted-foreground",
									)}
								>
									{course.category}
								</span>
								<span className="text-sm capitalize opacity-80">
									{course.level}
								</span>
							</div>

							<h1 className="mb-4 font-bold font-display text-3xl md:text-4xl">
								{course.title}
							</h1>

							{course.description && (
								<p className="mb-6 text-lg opacity-90">{course.description}</p>
							)}

							<div className="flex flex-wrap items-center gap-6 text-sm opacity-80">
								<span className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									{course.lessonCount} lessons
								</span>
								<span className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									{totalDuration} min
								</span>
								<span className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									{course.enrollmentCount} enrolled
								</span>
								{course.avgRating > 0 && (
									<span className="flex items-center gap-2">
										<Star className="h-4 w-4 fill-current" />
										{course.avgRating.toFixed(1)} ({course.reviewCount} reviews)
									</span>
								)}
								{course.tutorName && (
									<span className="flex items-center gap-2">
										By {course.tutorName}
									</span>
								)}
							</div>
						</div>

						<div className="lg:col-span-1">
							<Card className="shadow-xl">
								<CardContent className="p-6">
									{course.thumbnailUrl ? (
										<img
											src={course.thumbnailUrl}
											alt={course.title}
											className="mb-4 aspect-video w-full rounded-lg object-cover"
										/>
									) : (
										<div className="mb-4 flex aspect-video w-full items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-accent/20">
											<BookOpen className="h-12 w-12 text-primary/40" />
										</div>
									)}

									{isEnrolled ? (
										<>
											<Progress value={0} className="mb-4" />
											<p className="mb-3 text-center text-muted-foreground text-sm">
												0% completed
											</p>
											<Button className="mb-3 w-full rounded-xl" asChild>
												<Link
													href={
														firstLessonId
															? `/student/learn/${courseId}/${firstLessonId}`
															: `/courses/${courseId}`
													}
												>
													Start Learning
												</Link>
											</Button>

											{/* Quick Access Links */}
											<div className="grid grid-cols-3 gap-2">
												<Button
													variant="outline"
													size="sm"
													className="h-auto flex-col rounded-xl py-2"
													asChild
												>
													<Link href={`/student/courses/${courseId}/forum`}>
														<MessageSquare className="mb-1 h-4 w-4" />
														<span className="text-xs">Forum</span>
													</Link>
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="h-auto flex-col rounded-xl py-2"
													asChild
												>
													<Link href={`/student/courses/${courseId}/resources`}>
														<FolderOpen className="mb-1 h-4 w-4" />
														<span className="text-xs">Resources</span>
													</Link>
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="h-auto flex-col rounded-xl py-2"
													asChild
												>
													<Link href={`/student/courses/${courseId}/roadmap`}>
														<Map className="mb-1 h-4 w-4" />
														<span className="text-xs">Roadmap</span>
													</Link>
												</Button>
											</div>
										</>
									) : (
										<>
											<div className="mb-4 text-center">
												{course.isPremium && course.priceCents ? (
													<>
														<p className="font-bold text-3xl text-foreground">
															{formatPrice(course.priceCents)}
														</p>
														<div className="mt-1 flex items-center justify-center gap-1 text-yellow-500">
															<Star className="h-4 w-4 fill-current" />
															<span className="font-medium text-sm">
																Premium Course
															</span>
														</div>
													</>
												) : (
													<p className="font-bold text-3xl text-green-500">
														Free
													</p>
												)}
											</div>

											<Button
												className="w-full"
												onClick={async () => {
													try {
														await enroll({ courseId });
													} catch (err: unknown) {
														// If user is not logged in, redirect to sign-in
														const message =
															err instanceof Error ? err.message : "";
														if (
															message.includes("authentication") ||
															message.includes("Not authenticated")
														) {
															window.location.href = "/auth/sign-in";
														}
													}
												}}
											>
												{course.isPremium ? "Purchase Course" : "Enroll Now"}
											</Button>
										</>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className="container py-12">
				<h2 className="mb-6 font-bold font-display text-2xl">Course Content</h2>

				{lessons === undefined ? (
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={`lesson-skel-${i}`}
								className="h-16 w-full rounded-xl"
							/>
						))}
					</div>
				) : lessonsList.length > 0 ? (
					<div className="space-y-3">
						{lessonsList.map((lesson, index) => {
							const canAccess = isEnrolled || lesson.isPreview;

							return (
								<div
									key={lesson._id}
									className={cn(
										"flex items-center gap-4 rounded-xl border p-4 transition-colors",
										canAccess
											? "cursor-pointer border-border hover:border-primary/30"
											: "border-border/50 opacity-60",
									)}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
										{lesson.completed ? (
											<CheckCircle2 className="h-5 w-5 text-green-500" />
										) : canAccess ? (
											<Play className="h-5 w-5 text-primary" />
										) : (
											<Lock className="h-5 w-5 text-muted-foreground" />
										)}
									</div>

									<div className="flex-1">
										<h3 className="font-medium">
											{index + 1}. {lesson.title}
										</h3>
										<p className="text-muted-foreground text-sm">
											{lesson.durationMinutes || 10} min
											{lesson.isPreview && !isEnrolled && (
												<Badge variant="outline" className="ml-2 text-xs">
													Preview
												</Badge>
											)}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<Card>
						<CardContent className="py-12 text-center">
							<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground">
								No lessons available yet. Check back soon!
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

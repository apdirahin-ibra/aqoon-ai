"use client";

import {
	BookOpen,
	Edit,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	Star,
	Trash,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const courses = [
	{
		id: "1",
		title: "Introduction to Python Programming",
		students: 245,
		rating: 4.9,
		lessons: 24,
		status: "published" as const,
		completionRate: 78,
		revenue: "$4,200",
		thumbnail: "🐍",
	},
	{
		id: "2",
		title: "Web Development with React",
		students: 189,
		rating: 4.7,
		lessons: 32,
		status: "published" as const,
		completionRate: 65,
		revenue: "$3,600",
		thumbnail: "⚛️",
	},
	{
		id: "3",
		title: "Advanced JavaScript Patterns",
		students: 92,
		rating: 4.8,
		lessons: 18,
		status: "draft" as const,
		completionRate: 0,
		revenue: "$2,100",
		thumbnail: "📦",
	},
	{
		id: "4",
		title: "Data Science Fundamentals",
		students: 0,
		rating: 0,
		lessons: 8,
		status: "draft" as const,
		completionRate: 0,
		revenue: "$0",
		thumbnail: "📊",
	},
];

export default function TutorCoursesPage() {
	const [search, setSearch] = useState("");

	const filtered = courses.filter((c) =>
		c.title.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="container py-8">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">My Courses</h1>
					<p className="text-muted-foreground leading-relaxed">
						Manage and track your published courses
					</p>
				</div>
				<Button
					asChild
					className="rounded-xl px-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
				>
					<Link href={"/tutor/courses/editor"}>
						<Plus className="mr-2 h-4 w-4" />
						Create Course
					</Link>
				</Button>
			</div>

			{/* Search */}
			<div className="relative mb-6 max-w-sm">
				<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search courses..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Course Grid */}
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{filtered.map((course, index) => (
					<div
						key={course.id}
						className="group animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg"
						style={{ animationDelay: `${index * 0.1}s` }}
					>
						{/* Thumbnail area */}
						<div className="flex h-32 items-center justify-center bg-linear-to-br from-muted to-muted/50">
							<span className="text-5xl">{course.thumbnail}</span>
						</div>

						<div className="p-5">
							<div className="mb-3 flex items-start justify-between gap-2">
								<h3 className="font-semibold leading-tight transition-colors group-hover:text-primary">
									{course.title}
								</h3>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
											<MoreHorizontal className="h-4 w-4" />
										</span>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Eye className="mr-2 h-4 w-4" />
											Preview
										</DropdownMenuItem>
										<DropdownMenuItem className="text-destructive">
											<Trash className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className="mb-3 flex items-center gap-3">
								<Badge
									variant={
										course.status === "published" ? "default" : "secondary"
									}
								>
									{course.status}
								</Badge>
								<span className="text-muted-foreground text-xs">
									{course.lessons} lessons
								</span>
							</div>

							<div className="mb-4 flex items-center gap-4 text-muted-foreground text-sm">
								<span className="flex items-center gap-1">
									<Users className="h-3.5 w-3.5" />
									{course.students}
								</span>
								{course.rating > 0 && (
									<span className="flex items-center gap-1">
										<Star className="h-3.5 w-3.5 text-warning" />
										{course.rating}
									</span>
								)}
								<span className="ml-auto font-medium text-foreground">
									{course.revenue}
								</span>
							</div>

							{course.status === "published" && (
								<div>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span className="text-muted-foreground">
											Avg. Completion
										</span>
										<span className="font-medium">
											{course.completionRate}%
										</span>
									</div>
									<Progress value={course.completionRate} className="h-1.5" />
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{filtered.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-muted to-muted/50">
						<BookOpen className="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 className="mb-1 font-semibold">No courses found</h3>
					<p className="text-muted-foreground text-sm">
						Try adjusting your search or create a new course
					</p>
				</div>
			)}
		</div>
	);
}

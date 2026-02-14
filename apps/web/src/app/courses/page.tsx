"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Course {
	id: string;
	title: string;
	description: string | null;
	thumbnailUrl: string | null;
	category: string;
	level: string;
	isPremium: boolean;
	priceCents: number | null;
	lessonsCount: number;
	enrollmentsCount: number;
}

const mockCourses: Course[] = [
	{
		id: "1",
		title: "Introduction to Python Programming",
		description: "Learn Python from scratch with hands-on projects",
		thumbnailUrl: null,
		category: "coding",
		level: "beginner",
		isPremium: false,
		priceCents: 0,
		lessonsCount: 25,
		enrollmentsCount: 120,
	},
	{
		id: "2",
		title: "Web Development with React",
		description: "Build modern web applications with React and Next.js",
		thumbnailUrl: null,
		category: "coding",
		level: "intermediate",
		isPremium: true,
		priceCents: 4999,
		lessonsCount: 40,
		enrollmentsCount: 85,
	},
	{
		id: "3",
		title: "Data Science Fundamentals",
		description: "Master data analysis, visualization, and machine learning",
		thumbnailUrl: null,
		category: "coding",
		level: "advanced",
		isPremium: true,
		priceCents: 7999,
		lessonsCount: 60,
		enrollmentsCount: 45,
	},
	{
		id: "4",
		title: "Business English Communication",
		description: "Improve your professional English skills",
		thumbnailUrl: null,
		category: "languages",
		level: "intermediate",
		isPremium: false,
		priceCents: 0,
		lessonsCount: 20,
		enrollmentsCount: 200,
	},
	{
		id: "5",
		title: "Digital Art & Illustration",
		description: "Learn digital painting and illustration techniques",
		thumbnailUrl: null,
		category: "art",
		level: "beginner",
		isPremium: false,
		priceCents: 0,
		lessonsCount: 15,
		enrollmentsCount: 150,
	},
	{
		id: "6",
		title: "Music Production Masterclass",
		description: "Create professional music from scratch",
		thumbnailUrl: null,
		category: "music",
		level: "advanced",
		isPremium: true,
		priceCents: 9999,
		lessonsCount: 50,
		enrollmentsCount: 30,
	},
];

const categories = [
	{ value: "all", label: "All Categories" },
	{ value: "coding", label: "Coding" },
	{ value: "languages", label: "Languages" },
	{ value: "art", label: "Art & Design" },
	{ value: "business", label: "Business" },
	{ value: "music", label: "Music" },
];

const levels = [
	{ value: "all", label: "All Levels" },
	{ value: "beginner", label: "Beginner" },
	{ value: "intermediate", label: "Intermediate" },
	{ value: "advanced", label: "Advanced" },
];

export default function CoursesPage() {
	const [courses] = useState<Course[]>(mockCourses);
	const [loading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [level, setLevel] = useState("all");

	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			searchQuery === "" ||
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = category === "all" || course.category === category;
		const matchesLevel = level === "all" || course.level === level;
		return matchesSearch && matchesCategory && matchesLevel;
	});

	return (
		<div className="container flex-1 py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">Browse Courses</h1>
				<p className="text-muted-foreground">
					Discover courses to master new skills
				</p>
			</div>

			{/* Filters */}
			<div className="mb-8 flex flex-col gap-4 md:flex-row">
				<div className="relative flex-1">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search courses..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Select value={category} onValueChange={setCategory}>
					<SelectTrigger className="w-full md:w-48">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((cat) => (
							<SelectItem key={cat.value} value={cat.value}>
								{cat.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={level} onValueChange={setLevel}>
					<SelectTrigger className="w-full md:w-48">
						<SelectValue placeholder="Level" />
					</SelectTrigger>
					<SelectContent>
						{levels.map((lvl) => (
							<SelectItem key={lvl.value} value={lvl.value}>
								{lvl.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Course Grid */}
			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				</div>
			) : filteredCourses.length > 0 ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredCourses.map((course) => (
						<CourseCard
							key={course.id}
							id={course.id}
							title={course.title}
							description={course.description || undefined}
							thumbnailUrl={course.thumbnailUrl || undefined}
							category={course.category}
							level={course.level}
							isPremium={course.isPremium}
							priceCents={course.priceCents || undefined}
							lessonsCount={course.lessonsCount}
							enrollmentsCount={course.enrollmentsCount}
						/>
					))}
				</div>
			) : (
				<div className="py-20 text-center">
					<p className="mb-4 text-muted-foreground">
						No courses found. Try adjusting your filters.
					</p>
					<Button
						variant="outline"
						onClick={() => {
							setCategory("all");
							setLevel("all");
							setSearchQuery("");
						}}
					>
						Clear Filters
					</Button>
				</div>
			)}
		</div>
	);
}

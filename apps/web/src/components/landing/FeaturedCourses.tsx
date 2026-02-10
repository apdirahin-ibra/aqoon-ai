"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Mock data for featured courses
const mockCourses = [
	{
		id: "1",
		title: "Mastering Next.js 14 with AI",
		description:
			"Learn to build high-performance, AI-integrated web applications with the latest Next.js features.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800",
		category: "coding",
		level: "Intermediate",
		isPremium: true,
		priceCents: 4999,
		lessonsCount: 24,
		enrollmentsCount: 1250,
	},
	{
		id: "2",
		title: "Spanish for Beginners",
		description:
			"Start your language journey with conversational Spanish and AI-driven pronunciation guides.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
		category: "languages",
		level: "Beginner",
		isPremium: false,
		priceCents: 0,
		lessonsCount: 18,
		enrollmentsCount: 850,
	},
	{
		id: "3",
		title: "Digital Art Mastery",
		description:
			"Unlock your creativity with advanced digital painting techniques and AI art workflows.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800",
		category: "art",
		level: "Advanced",
		isPremium: true,
		priceCents: 5999,
		lessonsCount: 32,
		enrollmentsCount: 1100,
	},
	{
		id: "4",
		title: "Business Strategy with AI",
		description:
			"Leverage AI to develop competitive business models and data-driven marketing strategies.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
		category: "business",
		level: "Intermediate",
		isPremium: true,
		priceCents: 7999,
		lessonsCount: 20,
		enrollmentsCount: 940,
	},
	{
		id: "5",
		title: "Music Production 101",
		description:
			"Learn the fundamentals of music theory, sound design, and AI-assisted mixing.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
		category: "music",
		level: "Beginner",
		isPremium: false,
		priceCents: 0,
		lessonsCount: 15,
		enrollmentsCount: 620,
	},
];

export function FeaturedCourses() {
	return (
		<section className="overflow-hidden bg-muted/30 py-24">
			<div className="container mx-auto px-4">
				<div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl text-left">
						<span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-semibold text-primary text-sm">
							Popular Courses
						</span>
						<h2 className="mb-4 font-bold font-display text-4xl md:text-5xl">
							Start Learning{" "}
							<span className="bg-linear-to-r from-accent to-warning bg-clip-text text-transparent">
								Today
							</span>
						</h2>
						<p className="text-lg text-muted-foreground">
							Join thousands of learners already mastering new skills with our
							expert-crafted courses.
						</p>
					</div>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="group mt-6 lg:mt-0"
					>
						<Link href={"/courses" as any}>
							View All Courses
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</div>

				<div className="px-12">
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4">
							{mockCourses.map((course) => (
								<CarouselItem
									key={course.id}
									className="pl-4 md:basis-1/2 lg:basis-1/3"
								>
									<CourseCard
										id={course.id}
										title={course.title}
										description={course.description}
										thumbnailUrl={course.thumbnailUrl}
										category={course.category}
										level={course.level}
										isPremium={course.isPremium}
										priceCents={course.priceCents}
										lessonsCount={course.lessonsCount}
										enrollmentsCount={course.enrollmentsCount}
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</div>
		</section>
	);
}

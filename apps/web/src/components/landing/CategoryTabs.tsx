"use client";

import {
	ArrowRight,
	Briefcase,
	Code,
	Languages,
	Music,
	Palette,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
	{
		id: "coding",
		label: "Coding",
		icon: Code,
		color: "text-category-coding",
		bgColor: "bg-category-coding/10",
		description:
			"Master programming languages and frameworks from Python to React.",
		courses: [
			{ title: "Python for Beginners", level: "Beginner", students: "12.5k" },
			{ title: "JavaScript Mastery", level: "Intermediate", students: "8.2k" },
			{
				title: "Data Science with Python",
				level: "Advanced",
				students: "5.1k",
			},
		],
	},
	{
		id: "languages",
		label: "Languages",
		icon: Languages,
		color: "text-category-languages",
		bgColor: "bg-category-languages/10",
		description:
			"Learn new languages with conversational practice and AI tutors.",
		courses: [
			{ title: "Spanish for Travelers", level: "Beginner", students: "9.8k" },
			{ title: "French Conversation", level: "Intermediate", students: "6.3k" },
			{ title: "Japanese Essentials", level: "Beginner", students: "4.7k" },
		],
	},
	{
		id: "art",
		label: "Art & Design",
		icon: Palette,
		color: "text-category-art",
		bgColor: "bg-category-art/10",
		description:
			"Express your creativity through digital art, illustration, and design.",
		courses: [
			{ title: "Digital Illustration", level: "Beginner", students: "7.2k" },
			{ title: "UI/UX Design Basics", level: "Intermediate", students: "5.6k" },
			{ title: "Photoshop Mastery", level: "Advanced", students: "3.9k" },
		],
	},
	{
		id: "business",
		label: "Business",
		icon: Briefcase,
		color: "text-category-business",
		bgColor: "bg-category-business/10",
		description: "Develop essential business skills for the modern workplace.",
		courses: [
			{ title: "Project Management", level: "Intermediate", students: "8.1k" },
			{ title: "Digital Marketing", level: "Beginner", students: "6.9k" },
			{ title: "Leadership Fundamentals", level: "Advanced", students: "4.2k" },
		],
	},
	{
		id: "music",
		label: "Music",
		icon: Music,
		color: "text-category-music",
		bgColor: "bg-category-music/10",
		description: "Learn instruments, music theory, and production techniques.",
		courses: [
			{ title: "Guitar for Beginners", level: "Beginner", students: "11.3k" },
			{ title: "Music Production", level: "Intermediate", students: "5.8k" },
			{ title: "Piano Essentials", level: "Beginner", students: "7.4k" },
		],
	},
];

export function CategoryTabs() {
	const [activeTab, setActiveTab] = useState("coding");
	const category = categories.find((c) => c.id === activeTab) || categories[0];

	return (
		<section className="bg-background py-24">
			<div className="container">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<span className="mb-4 inline-block rounded-full bg-success/10 px-4 py-1.5 font-semibold text-sm text-success">
						Explore Categories
					</span>
					<h2 className="mb-5 font-bold font-display text-4xl md:text-5xl">
						Find Your{" "}
						<span className="bg-gradient-to-r from-category-coding via-category-languages to-category-art bg-clip-text text-transparent">
							Perfect Path
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Choose from a wide range of skills and start your learning journey
						today.
					</p>
				</div>

				{/* Custom Tabs Navigation (Strictly horizontal pills to fix vertical pillars issue) */}
				<div className="mb-10 flex h-auto flex-wrap justify-center gap-2">
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => setActiveTab(cat.id)}
							className={cn(
								"inline-flex items-center justify-center rounded-full border px-6 py-3 font-medium text-sm transition-all duration-300",
								activeTab === cat.id
									? "border-primary bg-primary text-primary-foreground shadow-sm"
									: "border-border bg-background text-foreground hover:bg-muted",
							)}
						>
							<cat.icon className="mr-2 h-4 w-4" />
							{cat.label}
						</button>
					))}
				</div>

				{/* Tab Content Area */}
				<div key={category.id} className="animate-fade-in">
					<div className="grid items-center gap-8 lg:grid-cols-2">
						{/* Left Column: Description & Course List */}
						<div className="order-2 lg:order-1">
							<div
								className={cn(
									"mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm",
									category.bgColor,
									category.color,
								)}
							>
								<category.icon className="h-4 w-4" />
								{category.label}
							</div>
							<h3 className="mb-4 font-bold font-display text-3xl">
								{category.description}
							</h3>
							<div className="mb-8 space-y-4">
								{category.courses.map((course, index) => (
									<div
										key={course.title}
										className="flex animate-fade-in-up items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<div>
											<h4 className="font-semibold">{course.title}</h4>
											<span className="text-muted-foreground text-sm">
												{course.level}
											</span>
										</div>
										<span className="text-muted-foreground text-sm">
											{course.students} students
										</span>
									</div>
								))}
							</div>
							<Button asChild size="lg" className="group">
								<Link href={`/courses?category=${category.id}`}>
									Explore {category.label} Courses
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>

						{/* Right Column: Summary Visual Card */}
						<div className="order-1 lg:order-2">
							<div className="relative">
								<div
									className={cn(
										"absolute inset-0 rounded-3xl opacity-50 blur-3xl",
										category.bgColor,
									)}
								/>
								<div className="relative rounded-3xl border border-border bg-gradient-to-br from-card to-muted p-8">
									<div className="mb-6 flex items-center gap-4">
										<div
											className={cn(
												"flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm",
												category.bgColor,
											)}
										>
											<category.icon
												className={cn("h-8 w-8", category.color)}
											/>
										</div>
										<div>
											<div className="font-bold text-2xl tracking-tight">
												{category.courses.length}+
											</div>
											<div className="text-muted-foreground text-sm">
												Courses Available
											</div>
										</div>
									</div>

									{/* Correctly centered 2x2 grid items */}
									<div className="grid grid-cols-2 gap-4">
										{[
											{ label: "AI-Powered", sub: "Learning Path" },
											{ label: "Live", sub: "Support" },
											{ label: "Projects", sub: "Hands-on" },
											{ label: "Certificate", sub: "On Completion" },
										].map((item) => (
											<div
												key={item.label}
												className="rounded-xl border border-border/10 bg-background/50 p-4 text-center shadow-sm"
											>
												<div className="mb-1 font-bold text-foreground text-xl leading-none">
													{item.label}
												</div>
												<div className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
													{item.sub}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

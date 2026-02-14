"use client";

import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
	return (
		<section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden bg-hero">
			{/* Animated gradient background layers */}
			<div className="absolute inset-0 bg-hero opacity-100" />
			<div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30" />

			{/* Decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-accent/20 blur-3xl" />
				<div
					className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-category-languages/20 blur-3xl"
					style={{ animationDelay: "1s" }}
				/>
				<div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
			</div>

			{/* Floating shapes */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div
					className="absolute top-20 left-[15%] h-4 w-4 animate-bounce rounded-full bg-accent"
					style={{ animationDuration: "3s" }}
				/>
				<div
					className="absolute top-32 right-[20%] h-3 w-3 animate-bounce rounded-full bg-warning"
					style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
				/>
				<div
					className="absolute bottom-32 left-[25%] h-5 w-5 animate-bounce rounded-full bg-success"
					style={{ animationDuration: "2.8s", animationDelay: "1s" }}
				/>
				<div
					className="absolute right-[15%] bottom-40 h-4 w-4 animate-bounce rounded-full bg-category-art"
					style={{ animationDuration: "3.2s", animationDelay: "0.3s" }}
				/>
			</div>

			<div className="container relative z-10 py-20 text-center">
				<div className="mx-auto max-w-4xl animate-fade-in-up">
					{/* Badge */}
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-md">
						<Sparkles className="h-4 w-4 text-accent" />
						<span className="font-medium">AI-Powered Learning Revolution</span>
						<span className="ml-2 flex items-center gap-1 border-white/20 border-l pl-2">
							<Star className="h-3.5 w-3.5 fill-warning text-warning" />
							<span>4.9/5 from 10k+ students</span>
						</span>
					</div>

					{/* Main heading */}
					<h1 className="mb-8 font-display font-extrabold text-5xl text-white leading-tight tracking-tight md:text-6xl lg:text-7xl lg:leading-none">
						Transform Your Skills with{" "}
						<span className="relative mt-2 inline-block sm:mt-0">
							<span className="bg-linear-to-r from-accent via-warning to-accent bg-clip-text text-transparent italic">
								AI-Powered
							</span>
							<svg
								className="absolute -bottom-2 left-0 w-full"
								viewBox="0 0 300 12"
								fill="none"
							>
								<path
									d="M2 10C50 4 150 2 298 8"
									stroke="hsl(15 85% 60%)"
									strokeWidth="3"
									strokeLinecap="round"
								/>
							</svg>
						</span>{" "}
						Learning
					</h1>

					{/* Subheading */}
					<p className="mx-auto mb-10 max-w-2xl text-white/80 text-xl leading-relaxed md:text-2xl">
						Master coding, languages, art, and more through personalized AI
						tutors that adapt to your unique learning style.
					</p>

					{/* CTA Buttons */}
					<div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
						<Button asChild size="lg" className="btn-hero h-14 px-10 text-lg">
							<Link href={"/auth?tab=signup" as any}>
								Start Learning Free
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							className="btn-hero-outline group h-14 px-10 text-lg"
						>
							<Link href={"/courses" as any} className="flex items-center">
								<Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
								Watch Demo
							</Link>
						</Button>
					</div>

					{/* Stats */}
					<div className="flex flex-wrap justify-center gap-8 md:gap-16">
						{[
							{ value: "50K+", label: "Active Learners" },
							{ value: "200+", label: "Expert Courses" },
							{ value: "95%", label: "Success Rate" },
							{ value: "24/7", label: "AI Support" },
						].map((stat, index) => (
							<div
								key={stat.label}
								className="animate-fade-in-up text-center"
								style={{ animationDelay: `${0.2 + index * 0.1}s` }}
							>
								<div className="mb-1 font-bold text-3xl text-white md:text-4xl">
									{stat.value}
								</div>
								<div className="text-sm text-white/60">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom wave */}
			<div className="absolute right-0 bottom-0 left-0">
				<svg viewBox="0 0 1440 120" fill="none" className="w-full">
					<path
						d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
						fill="hsl(var(--background))"
					/>
				</svg>
			</div>
		</section>
	);
}

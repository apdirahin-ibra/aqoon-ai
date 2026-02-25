"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const benefits = [
	"Unlimited access to free courses",
	"AI-powered personalized learning",
	"Track your progress in real-time",
	"Join our learning community",
];

export function CTASection() {
	return (
		<section className="relative overflow-hidden py-24">
			{/* Background */}
			<div className="absolute inset-0 bg-linear-to-br from-primary via-primary/95 to-category-coding" />

			{/* Decorative circles */}
			<div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
			<div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-category-languages/10 blur-3xl" />

			{/* Pattern overlay */}
			<div className="absolute inset-0 opacity-5">
				<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="dots"
							x="0"
							y="0"
							width="40"
							height="40"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="2" cy="2" r="2" fill="white" />
						</pattern>
					</defs>
					<rect fill="url(#dots)" width="100%" height="100%" />
				</svg>
			</div>

			<div className="container relative z-10 px-4">
				<div className="mx-auto max-w-4xl text-center">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
						<Sparkles className="h-4 w-4 text-accent" />
						<span>Start Your Journey Today</span>
					</div>

					<h2 className="mb-6 font-bold font-display text-4xl text-white leading-tight md:text-5xl lg:text-6xl">
						Ready to Transform Your{" "}
						<span className="bg-linear-to-r from-accent via-warning to-accent bg-clip-text text-transparent">
							Future?
						</span>
					</h2>

					<p className="mx-auto mb-10 max-w-2xl text-white/80 text-xl">
						Join thousands of learners who are already mastering new skills with
						our AI-powered platform. Start for free, upgrade anytime.
					</p>

					<div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							asChild
							size="lg"
							className="btn-hero h-14 animate-pulse-glow px-12 text-lg"
						>
							<Link href={"/auth?tab=signup"}>
								Get Started Free
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							className="btn-hero-outline h-14 px-12 text-lg"
						>
							<Link href={"/courses"}>Explore Courses</Link>
						</Button>
					</div>

					<div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
						{benefits.map((benefit) => (
							<div
								key={benefit}
								className="flex items-center gap-2 text-white/80"
							>
								<CheckCircle2 className="h-5 w-5 text-success" />
								<span className="text-sm">{benefit}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

"use client";

import { BookOpen, Brain, Shield, Trophy, Users, Zap } from "lucide-react";

const features = [
	{
		icon: Brain,
		title: "AI-Powered Learning",
		description:
			"Smart recommendations and personalized feedback based on your performance.",
		color: "bg-linear-to-br from-accent to-accent/70",
	},
	{
		icon: BookOpen,
		title: "Expert-Crafted Courses",
		description:
			"Learn from industry professionals with structured, engaging content.",
		color: "bg-linear-to-br from-category-coding to-category-coding/70",
	},
	{
		icon: Zap,
		title: "Interactive Quizzes",
		description: "AI-generated assessments that adapt to your knowledge level.",
		color: "bg-linear-to-br from-warning to-warning/70",
	},
	{
		icon: Users,
		title: "Community Learning",
		description: "Connect with fellow learners and share your progress.",
		color: "bg-linear-to-br from-category-languages to-category-languages/70",
	},
	{
		icon: Trophy,
		title: "Track Progress",
		description: "Earn badges, certificates, and see your growth in real-time.",
		color: "bg-linear-to-br from-success to-success/70",
	},
	{
		icon: Shield,
		title: "Lifetime Access",
		description:
			"Learn at your own pace with unlimited access to enrolled courses.",
		color: "bg-linear-to-br from-category-art to-category-art/70",
	},
];

export function FeaturesGrid() {
	return (
		<section className="bg-background py-24">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-16 max-w-3xl text-center">
					<span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 font-semibold text-accent text-sm">
						Why Aqoon AI?
					</span>
					<h2 className="mb-5 font-bold font-display text-4xl md:text-5xl">
						Everything You Need to{" "}
						<span className="bg-linear-to-r from-primary to-category-coding bg-clip-text text-transparent">
							Succeed
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Our platform combines cutting-edge AI technology with proven
						learning methodologies to accelerate your skill development.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<div
							key={feature.title}
							className="group relative animate-fade-in-up overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:border-transparent hover:shadow-xl"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Hover gradient overlay */}
							<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

							<div className="relative z-10">
								<div
									className={`h-14 w-14 ${feature.color} mb-6 flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
								>
									<feature.icon className="h-7 w-7 text-white" />
								</div>
								<h3 className="mb-3 font-bold font-display text-xl transition-colors group-hover:text-primary">
									{feature.title}
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

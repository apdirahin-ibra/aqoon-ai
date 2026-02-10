"use client";

import { motion } from "framer-motion";
import {
	Bot,
	GraduationCap,
	LayoutDashboard,
	Sparkles,
	Trophy,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
	{
		icon: Bot,
		title: "AI Personal Tutor",
		description:
			"24/7 guidance from an intelligent tutor that understands your learning pace and style.",
		color: "text-blue-500",
		badges: ["GPT-4o", "Interactive"],
	},
	{
		icon: Zap,
		title: "Adaptive Learning Paths",
		description:
			"Curriculum that evolves with you. Skip what you know, focus on what matters.",
		color: "text-amber-500",
		badges: ["Dynamic", "Smart"],
	},
	{
		icon: Trophy,
		title: "Gamified Progress",
		description:
			"Earn XP, badges, and compete on leaderboards to stay motivated.",
		color: "text-purple-500",
		badges: ["Leaderboards", "XP System"],
	},
	{
		icon: GraduationCap,
		title: "Verified Certificates",
		description:
			"Get recognized for your achievements with blockchain-verified completion certificates.",
		color: "text-green-500",
		badges: ["Shareable", "Verified"],
	},
	{
		icon: LayoutDashboard,
		title: "Instructor Dashboard",
		description:
			"Powerful analytics for tutors to track student performance and revenue.",
		color: "text-rose-500",
		badges: ["Analytics", "Payouts"],
	},
	{
		icon: Sparkles,
		title: "Interactive Quizzes",
		description:
			"Test your knowledge with AI-generated quizzes that adapt to your skill level.",
		color: "text-indigo-500",
		badges: ["Real-time", "Feedback"],
	},
];

export function Features() {
	return (
		<section className="container space-y-12 px-4 py-24 md:px-6">
			<div className="mx-auto max-w-3xl space-y-4 text-center">
				<h2 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
					Everything you need to <span className="text-primary">excel</span>
				</h2>
				<p className="text-muted-foreground md:text-xl">
					We combine cutting-edge AI with proven educational methods to deliver
					the most effective learning experience.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{features.map((feature, index) => (
					<motion.div
						key={feature.title}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						viewport={{ once: true }}
					>
						<Card className="card-course h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/50">
							<CardHeader>
								<div
									className={`mb-4 w-fit rounded-lg border border-border bg-background p-2 ${feature.color}`}
								>
									<feature.icon className="h-6 w-6" />
								</div>
								<CardTitle className="text-xl">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">{feature.description}</p>
								<div className="flex flex-wrap gap-2">
									{feature.badges.map((badge) => (
										<Badge
											key={badge}
											variant="secondary"
											className="bg-secondary/50 font-normal text-xs"
										>
											{badge}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}

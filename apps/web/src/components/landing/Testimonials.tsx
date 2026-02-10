"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Software Developer",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
		content:
			"The AI-powered quizzes completely changed how I learn. Getting instant, personalized feedback helps me understand concepts much faster.",
		rating: 5,
		course: "JavaScript Mastery",
	},
	{
		name: "Marcus Johnson",
		role: "Product Designer",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
		content:
			"I went from zero coding knowledge to building my first app in just 3 months. The structured learning path made all the difference.",
		rating: 5,
		course: "Python for Beginners",
	},
	{
		name: "Elena Rodriguez",
		role: "Marketing Manager",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
		content:
			"Finally mastered Spanish! The AI tutor adapts to my schedule and learning pace. It feels like having a personal language teacher.",
		rating: 5,
		course: "Spanish for Travelers",
	},
];

export function Testimonials() {
	return (
		<section className="overflow-hidden bg-muted/30 py-24">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-16 max-w-3xl text-center">
					<span className="mb-4 inline-block rounded-full bg-warning/10 px-4 py-1.5 font-semibold text-sm text-warning">
						Success Stories
					</span>
					<h2 className="mb-5 font-bold font-display text-4xl md:text-5xl">
						Loved by{" "}
						<span className="bg-linear-to-r from-warning to-accent bg-clip-text text-transparent">
							Thousands
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Join our community of successful learners who transformed their
						careers.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<div
							key={testimonial.name}
							className="group relative animate-fade-in-up"
							style={{ animationDelay: `${index * 0.15}s` }}
						>
							<div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent/20 to-primary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

							<div className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-accent/30">
								<Quote className="mb-4 h-10 w-10 text-accent/20" />

								<p className="mb-6 flex-1 text-foreground/80 leading-relaxed">
									&ldquo;{testimonial.content}&rdquo;
								</p>

								<div className="mb-4 flex items-center gap-1">
									{Array.from({ length: testimonial.rating }).map((_, i) => (
										<Star
											key={i}
											className="h-4 w-4 fill-warning text-warning"
										/>
									))}
								</div>

								<div className="flex items-center gap-4">
									<img
										src={testimonial.avatar}
										alt={testimonial.name}
										className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
									/>
									<div>
										<div className="font-semibold">{testimonial.name}</div>
										<div className="text-muted-foreground text-sm">
											{testimonial.role}
										</div>
									</div>
								</div>

								<div className="mt-4 border-border border-t pt-4 text-left">
									<span className="text-muted-foreground text-xs">
										Completed:{" "}
									</span>
									<span className="font-medium text-primary text-xs">
										{testimonial.course}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Stats bar */}
				<div className="mt-16 rounded-3xl bg-linear-to-r from-primary via-primary/90 to-category-coding px-10 py-8">
					<div className="grid grid-cols-2 gap-8 text-center text-white md:grid-cols-4">
						{[
							{ value: "98%", label: "Satisfaction Rate" },
							{ value: "50K+", label: "Course Completions" },
							{ value: "4.9/5", label: "Average Rating" },
							{ value: "30+", label: "Countries Reached" },
						].map((stat) => (
							<div key={stat.label}>
								<div className="mb-1 font-bold text-3xl md:text-4xl">
									{stat.value}
								</div>
								<div className="text-sm text-white/70">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

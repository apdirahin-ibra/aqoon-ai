"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
			{/* Background Gradients */}
			<div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
			<div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 opacity-50 blur-[100px]" />
			<div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] bg-accent/20 opacity-40 blur-[80px]" />

			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center space-y-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-sm backdrop-blur-sm"
					>
						<Sparkles className="mr-2 h-4 w-4" />
						<span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent italic">
							AI-Powered Personal Learning
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mx-auto max-w-4xl font-bold text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
					>
						Master Any Skill with{" "}
						<span className="relative inline-block text-primary">
							Aqoon AI
							<svg
								className="absolute -bottom-1 left-0 h-3 w-full text-accent opacity-30"
								viewBox="0 0 100 20"
								preserveAspectRatio="none"
							>
								<path
									d="M0 10 Q50 20 100 10"
									stroke="currentColor"
									strokeWidth="8"
									fill="none"
								/>
							</svg>
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mx-auto max-w-[700px] text-muted-foreground leading-relaxed md:text-xl lg:text-2xl"
					>
						Your intelligent tutor that adapts to your learning style. Generate
						custom courses, track progress, and earn certificates.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="flex min-w-[300px] flex-col justify-center gap-4 sm:flex-row"
					>
						<Button
							size="lg"
							className="btn-hero h-12 rounded-full px-8 text-lg shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
						>
							Start Learning Free
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="h-12 rounded-full border-primary/20 px-8 text-lg hover:bg-primary/5"
						>
							Explore Courses
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

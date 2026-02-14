"use client";

import { BookOpen, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="relative overflow-hidden border-border border-t bg-muted/5">
			<div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

			<div className="container px-4 py-20">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
					<div className="space-y-6 lg:col-span-2">
						<Link href={"/" as any} className="group flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
								<BookOpen className="h-6 w-6 text-primary-foreground" />
							</div>
							<span className="font-bold font-display text-2xl tracking-tight">
								Aqoon AI
							</span>
						</Link>
						<p className="max-w-xs font-medium text-base text-muted-foreground leading-relaxed">
							Empowering the next generation of learners with AI-driven
							personalization and expert-crafted content.
						</p>
						<div className="flex items-center gap-4">
							{[
								{ icon: Twitter, href: "#" },
								{ icon: Github, href: "#" },
								{ icon: Linkedin, href: "#" },
								{ icon: Instagram, href: "#" },
							].map((social, i) => (
								<Link
									key={i}
									href={social.href as any}
									className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:text-primary"
								>
									<social.icon className="h-5 w-5" />
								</Link>
							))}
						</div>
					</div>

					<div>
						<h3 className="mb-6 font-bold text-lg">Learn</h3>
						<ul className="space-y-4 font-medium text-muted-foreground text-sm">
							<li>
								<Link
									href={"/courses" as any}
									className="transition-colors hover:text-primary"
								>
									All Courses
								</Link>
							</li>
							<li>
								<Link
									href={"/courses?category=coding" as any}
									className="transition-colors hover:text-primary"
								>
									Coding
								</Link>
							</li>
							<li>
								<Link
									href="/courses?category=languages"
									className="transition-colors hover:text-primary"
								>
									Languages
								</Link>
							</li>
							<li>
								<Link
									href="/courses?category=art"
									className="transition-colors hover:text-primary"
								>
									Art & Design
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-6 font-bold text-lg">Platform</h3>
						<ul className="space-y-4 font-medium text-muted-foreground text-sm">
							<li>
								<Link
									href="/auth"
									className="transition-colors hover:text-primary"
								>
									Sign In
								</Link>
							</li>
							<li>
								<Link
									href="/auth?tab=signup"
									className="transition-colors hover:text-primary"
								>
									Create Account
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard"
									className="transition-colors hover:text-primary"
								>
									My Learning
								</Link>
							</li>
							<li>
								<Link
									href={"/pricing" as any}
									className="transition-colors hover:text-primary"
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-6 font-bold text-lg">Support</h3>
						<ul className="space-y-4 font-medium text-muted-foreground text-sm">
							<li>
								<Link
									href={"/about" as any}
									className="transition-colors hover:text-primary"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href={"/contact" as any}
									className="transition-colors hover:text-primary"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href={"/faq" as any}
									className="transition-colors hover:text-primary"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href={"/privacy" as any}
									className="transition-colors hover:text-primary"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-20 flex flex-col items-center justify-between gap-4 border-border border-t pt-8 md:flex-row">
					<p className="font-medium text-muted-foreground text-sm">
						© {new Date().getFullYear()} Aqoon AI. All rights reserved.
					</p>
					<div className="flex items-center gap-8 font-medium text-muted-foreground text-sm">
						<Link href="#" className="transition-colors hover:text-primary">
							Terms of Service
						</Link>
						<Link href="#" className="transition-colors hover:text-primary">
							Privacy Policy
						</Link>
						<Link href="#" className="transition-colors hover:text-primary">
							Cookie Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

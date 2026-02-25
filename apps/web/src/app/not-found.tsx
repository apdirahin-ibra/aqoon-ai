import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
			{/* Subtle gradient background */}
			<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
			<div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
			<div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

			<div className="relative z-10 text-center">
				<div className="mx-auto mb-8 flex h-32 w-32 animate-fade-in-up items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 ring-4 ring-primary/10">
					<span className="font-bold font-display text-6xl text-primary">
						404
					</span>
				</div>
				<h1
					className="mb-3 animate-fade-in-up font-bold font-display text-3xl sm:text-4xl"
					style={{ animationDelay: "0.1s" }}
				>
					Page Not Found
				</h1>
				<p
					className="mx-auto mb-10 max-w-md animate-fade-in-up text-muted-foreground leading-relaxed"
					style={{ animationDelay: "0.2s" }}
				>
					Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
					moved. Let&apos;s get you back on track.
				</p>
				<div
					className="flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row"
					style={{ animationDelay: "0.3s" }}
				>
					<Button
						asChild
						className="rounded-xl px-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
					>
						<Link href="/">
							<Home className="mr-2 h-4 w-4" />
							Go Home
						</Link>
					</Button>
					<Button
						variant="outline"
						asChild
						className="rounded-xl px-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
					>
						<Link href="/courses">
							<BookOpen className="mr-2 h-4 w-4" />
							Browse Courses
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

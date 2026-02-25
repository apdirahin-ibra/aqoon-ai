import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// If already authenticated, redirect away from sign-in/sign-up pages
	if (await isAuthenticated()) {
		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-hero p-4">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-flex items-center gap-2 text-white">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
							<BookOpen className="h-6 w-6 text-white" />
						</div>
						<span className="font-bold font-display text-2xl">Aqoon AI</span>
					</Link>
				</div>

				{children}

				<p className="mt-6 text-center text-sm text-white/70">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</div>
	);
}

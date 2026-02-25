"use client";

import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const [isLoading, setIsLoading] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const [emailSent, setEmailSent] = React.useState(false);

	async function onSubmit(event: React.FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setEmailSent(true);
			toast.success("Password reset email sent!");
		} catch (_error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn(className)} {...props}>
			<Card className="border-0 shadow-xl">
				<CardHeader>
					<CardTitle className="text-2xl">
						{emailSent ? "Check your email" : "Forgot password"}
					</CardTitle>
					<CardDescription>
						{emailSent
							? "We've sent a password reset link to your email address."
							: "Enter your email address and we'll send you a reset link."}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{emailSent ? (
						<div className="space-y-4">
							<div className="flex items-center justify-center rounded-lg bg-muted p-4">
								<Mail className="h-8 w-8 text-primary" />
							</div>
							<p className="text-center text-muted-foreground text-sm">
								Didn&apos;t receive the email? Check your spam folder, or{" "}
								<button
									type="button"
									onClick={() => setEmailSent(false)}
									className="text-primary hover:underline"
								>
									try again
								</button>
								.
							</p>

							<Button asChild className="w-full" variant="outline">
								<Link href="/signin">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to sign in
								</Link>
							</Button>
						</div>
					) : (
						<form onSubmit={onSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
									required
								/>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Send reset link
							</Button>

							<Button asChild className="w-full" variant="outline">
								<Link href="/signin">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to sign in
								</Link>
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

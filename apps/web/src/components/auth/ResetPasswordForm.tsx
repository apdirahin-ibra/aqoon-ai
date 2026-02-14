"use client";

import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function ResetPasswordForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [isLoading, setIsLoading] = React.useState(false);
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [isReset, setIsReset] = React.useState(false);

	async function onSubmit(event: React.FormEvent) {
		event.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await authClient.resetPassword({
				newPassword: password,
				token: token || "",
			});

			if (error) {
				toast.error(error.message || "Failed to reset password");
			} else {
				setIsReset(true);
				toast.success("Password reset successfully!");
			}
		} catch (_error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	if (!token) {
		return (
			<div className={cn(className)} {...props}>
				<Card className="border-0 shadow-xl">
					<CardHeader>
						<CardTitle className="text-2xl">Invalid link</CardTitle>
						<CardDescription>
							This password reset link is invalid or has expired.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full" variant="outline">
							<Link href="/forgot-password">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Request a new reset link
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn(className)} {...props}>
			<Card className="border-0 shadow-xl">
				<CardHeader>
					<CardTitle className="text-2xl">
						{isReset ? "Password reset" : "Reset your password"}
					</CardTitle>
					<CardDescription>
						{isReset
							? "Your password has been successfully updated."
							: "Enter your new password below."}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{isReset ? (
						<div className="space-y-4">
							<div className="flex items-center justify-center rounded-lg bg-muted p-4">
								<CheckCircle className="h-8 w-8 text-green-500" />
							</div>

							<Button asChild className="w-full">
								<Link href="/signin">Continue to sign in</Link>
							</Button>
						</div>
					) : (
						<form onSubmit={onSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									disabled={isLoading}
									required
								/>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Reset password
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

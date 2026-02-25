"use client";

import { Mail, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function VerifyEmailContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "your email";
	const [resent, setResent] = useState(false);

	const handleResend = () => {
		setResent(true);
		setTimeout(() => setResent(false), 3000);
	};

	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader className="text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<Mail className="h-8 w-8 text-primary" />
				</div>
				<CardTitle className="text-2xl">Check Your Email</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 text-center">
				<p className="text-muted-foreground">
					We&apos;ve sent a verification link to{" "}
					<span className="font-medium text-foreground">{email}</span>. Click
					the link in the email to verify your account.
				</p>
				<p className="text-muted-foreground text-sm">
					Didn&apos;t receive the email? Check your spam folder or click below
					to resend.
				</p>
				<Button
					variant="outline"
					className="w-full"
					onClick={handleResend}
					disabled={resent}
				>
					<RefreshCw
						className={`mr-2 h-4 w-4 ${resent ? "animate-spin" : ""}`}
					/>
					{resent ? "Email Sent!" : "Resend Verification Email"}
				</Button>
			</CardContent>
		</Card>
	);
}

export default function VerifyEmailPage() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center p-4">
			<Suspense
				fallback={
					<div className="text-center text-muted-foreground">Loading...</div>
				}
			>
				<VerifyEmailContent />
			</Suspense>
		</div>
	);
}

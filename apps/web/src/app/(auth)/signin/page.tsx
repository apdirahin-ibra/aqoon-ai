import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
	title: "Sign In - Aqoon AI",
	description: "Sign in to your account to continue learning.",
};

export default function SignInPage() {
	return <AuthForm type="signin" />;
}

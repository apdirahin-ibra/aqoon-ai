import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
	title: "Sign Up - Aqoon AI",
	description: "Create an account to start your learning journey.",
};

export default function SignUpPage() {
	return <AuthForm type="signup" />;
}

"use client";

import { env } from "@aqoon-ai/env/web";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";

import { authClient } from "@/lib/auth-client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function Providers({
	children,
	initialToken,
}: {
	children: React.ReactNode;
	initialToken?: string | null;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			storageKey="aqoon-theme-v2"
			disableTransitionOnChange
		>
			<ConvexBetterAuthProvider
				client={convex}
				authClient={authClient}
				initialToken={initialToken}
			>
				{children}
			</ConvexBetterAuthProvider>
			<Toaster richColors />
		</ThemeProvider>
	);
}

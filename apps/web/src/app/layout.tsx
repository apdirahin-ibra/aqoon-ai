import type { Metadata } from "next";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import "../index.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Providers from "@/components/providers";
import { getToken } from "@/lib/auth-server";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
	weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta",
	display: "swap",
	weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Aqoon AI | Skill Learning Hub",
	description: "Personalized AI-Assisted Learning Platform",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const token = await getToken();
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${plusJakartaSans.variable} bg-background font-sans text-foreground antialiased`}
			>
				<Providers initialToken={token}>{children}</Providers>
			</body>
		</html>
	);
}

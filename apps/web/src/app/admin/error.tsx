"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Admin section error:", error);
	}, [error]);

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
			<h2 className="font-semibold text-xl">Something went wrong</h2>
			<p className="text-muted-foreground text-sm">
				{error.message || "An unexpected error occurred."}
			</p>
			<Button onClick={reset} variant="outline">
				Try again
			</Button>
		</div>
	);
}

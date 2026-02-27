"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Shared error boundary component for all route sections.
 */
export default function SectionError({
  error,
  reset,
  section = "This",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  section?: string;
}) {
  useEffect(() => {
    console.error(`${section} section error:`, error);
  }, [error, section]);

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

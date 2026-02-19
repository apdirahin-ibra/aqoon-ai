"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";

export default function DashboardRedirect() {
  const router = useRouter();
  const user = useQuery(api.users.current);

  useEffect(() => {
    // user is undefined while loading, null if not authenticated
    if (user === undefined) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    switch (user.role) {
      case "tutor":
        router.replace("/tutor");
        break;
      case "admin":
        router.replace("/admin");
        break;
      default:
        router.replace("/student");
        break;
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}

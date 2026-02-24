import { redirect } from "next/navigation";
import {
  isAuthenticated,
  fetchAuthQuery,
  fetchAuthMutation,
} from "@/lib/auth-server";
import { api } from "@aqoon-ai/backend/convex/_generated/api";

/**
 * Server-side role-based redirect.
 * Runs entirely on the server — no client-side race conditions.
 */
export default async function DashboardRedirectPage() {
  // Check session cookie (server-side, immediate)
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/signin");
  }

  // Get app user (with role)
  let user = await fetchAuthQuery(api.users.current);

  // If no app user yet, sync from Better Auth user
  if (!user) {
    try {
      const authUser = await fetchAuthQuery(api.auth.getCurrentUser);
      if (authUser) {
        await fetchAuthMutation(api.users.syncFromAuth, {
          email: authUser.email,
          name: authUser.name || authUser.email.split("@")[0],
          image: authUser.image ?? undefined,
        });
        user = await fetchAuthQuery(api.users.current);
      }
    } catch {
      // If sync fails, default to student
    }
  }

  // Redirect based on role
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "tutor") redirect("/tutor");
  redirect("/student");
}

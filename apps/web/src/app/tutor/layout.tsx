import { redirect } from "next/navigation";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { DashboardShell } from "@/components/dashboard-shell";
import { TutorSidebar } from "@/components/tutor-sidebar";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";

const roleRedirects: Record<string, string> = {
  student: "/student",
  admin: "/admin",
};

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/signin");
  }

  try {
    const user = await fetchAuthQuery(api.users.current);
    if (user?.role && user.role !== "tutor") {
      redirect(roleRedirects[user.role] ?? "/student");
    }
  } catch {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientAuthBoundary>
        <DashboardShell sidebar={<TutorSidebar />}>{children}</DashboardShell>
      </ClientAuthBoundary>
    </div>
  );
}

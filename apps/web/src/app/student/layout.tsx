import { redirect } from "next/navigation";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentSidebar } from "@/components/student-sidebar";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";

const roleRedirects: Record<string, string> = {
  tutor: "/tutor",
  admin: "/admin",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/signin");
  }

  try {
    const user = await fetchAuthQuery(api.users.current);
    if (user?.role && user.role !== "student") {
      redirect(roleRedirects[user.role] ?? "/student");
    }
  } catch {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientAuthBoundary>
        <DashboardShell sidebar={<StudentSidebar />}>{children}</DashboardShell>
      </ClientAuthBoundary>
    </div>
  );
}

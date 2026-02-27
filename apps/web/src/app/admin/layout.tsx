import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { api } from "@aqoon-ai/backend/convex/_generated/api";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/signin");
  }

  // Verify the user actually has the admin role (same query as dashboard)
  try {
    const user = await fetchAuthQuery(api.users.current);
    if (user?.role !== "admin") {
      redirect("/student");
    }
  } catch {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientAuthBoundary>
        <DashboardShell sidebar={<AdminSidebar />}>{children}</DashboardShell>
      </ClientAuthBoundary>
    </div>
  );
}

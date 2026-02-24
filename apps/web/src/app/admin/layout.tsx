import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
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

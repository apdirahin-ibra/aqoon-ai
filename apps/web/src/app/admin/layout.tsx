import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardShell } from "@/components/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardShell sidebar={<AdminSidebar />}>{children}</DashboardShell>
    </div>
  );
}

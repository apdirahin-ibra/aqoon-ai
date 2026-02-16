import { AdminSidebar } from "@/components/admin-sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardShell } from "@/components/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardShell sidebar={<AdminSidebar />}>{children}</DashboardShell>
    </div>
  );
}

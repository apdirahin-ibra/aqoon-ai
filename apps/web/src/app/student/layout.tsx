import { DashboardShell } from "@/components/dashboard-shell";
import { StudentSidebar } from "@/components/student-sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardShell sidebar={<StudentSidebar />}>{children}</DashboardShell>
    </div>
  );
}

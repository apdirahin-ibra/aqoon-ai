import { Header } from "@/components/layout/Header";
import { DashboardShell } from "@/components/dashboard-shell";
import { TutorSidebar } from "@/components/tutor-sidebar";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardShell sidebar={<TutorSidebar />}>{children}</DashboardShell>
    </div>
  );
}

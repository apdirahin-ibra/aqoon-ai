import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { DashboardShell } from "@/components/dashboard-shell";
import { TutorSidebar } from "@/components/tutor-sidebar";

export default async function TutorLayout({
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
        <DashboardShell sidebar={<TutorSidebar />}>{children}</DashboardShell>
      </ClientAuthBoundary>
    </div>
  );
}

import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentSidebar } from "@/components/student-sidebar";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { isAuthenticated } from "@/lib/auth-server";

export default async function StudentLayout({
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
				<DashboardShell sidebar={<StudentSidebar />}>{children}</DashboardShell>
			</ClientAuthBoundary>
		</div>
	);
}

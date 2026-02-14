import { Header } from "@/components/layout/Header";
import { StudentSidebar } from "@/components/student-sidebar";

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="flex">
				<StudentSidebar />
				<main className="flex-1 px-4 pt-4 pb-8 lg:pl-72">{children}</main>
			</div>
		</div>
	);
}

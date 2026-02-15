import { Header } from "@/components/layout/Header";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 px-4 pt-4 pb-8 lg:pl-72">{children}</main>
            </div>
        </div>
    );
}

import { Header } from "@/components/layout/Header";
import { TutorSidebar } from "@/components/tutor-sidebar";

export default function TutorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <TutorSidebar />
                <main className="flex-1 px-4 pt-4 pb-8 lg:pl-72">{children}</main>
            </div>
        </div>
    );
}

"use client";

import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	FileText,
	LayoutDashboard,
	Shield,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/sidebar-context";
import { SidebarUserMenu } from "@/components/sidebar-user-menu";
import { cn } from "@/lib/utils";

interface MenuItem {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const adminMenuItems: MenuItem[] = [
	{ title: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ title: "Courses", href: "/admin/courses", icon: BookOpen },
	{ title: "Users", href: "/admin/users", icon: Users },
	{ title: "Audit Log", href: "/admin/audit-log", icon: FileText },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { isCollapsed, toggle } = useSidebar();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	useEffect(() => {
		setIsMobileOpen(false);
	}, []);

	useEffect(() => {
		if (isMobileOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileOpen]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsMobileOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
		<>
			<div className="border-b p-4">
				<Link
					href="/admin"
					className={cn(
						"flex items-center gap-3",
						(isCollapsed || isMobile) && "justify-center",
					)}
					onClick={() => isMobile && setIsMobileOpen(false)}
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 shadow-sm">
						<Shield className="h-6 w-6 text-white" strokeWidth={2.5} />
					</div>
					{!(isCollapsed || isMobile) && (
						<span className="font-bold font-display text-xl tracking-tight">
							Admin
						</span>
					)}
					{isMobile && (
						<span className="font-bold font-display text-xl tracking-tight lg:hidden">
							Admin
						</span>
					)}
				</Link>
			</div>

			<nav className="flex-1 overflow-y-auto p-3">
				<div className="space-y-1">
					{adminMenuItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200",
									(isCollapsed || isMobile) && "justify-center px-2",
									isActive
										? "bg-red-600/10 font-bold text-red-600"
										: "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
								title={item.title}
								onClick={() => isMobile && setIsMobileOpen(false)}
							>
								<item.icon
									className={cn(
										"shrink-0",
										isCollapsed || isMobile ? "h-6 w-6" : "h-5 w-5",
									)}
									strokeWidth={isActive ? 2.5 : 2}
								/>
								{!(isCollapsed || isMobile) && (
									<span className="tracking-wide">{item.title}</span>
								)}
							</Link>
						);
					})}
				</div>
			</nav>

			{/* User Menu */}
			<SidebarUserMenu
				isCollapsed={isCollapsed}
				isMobile={isMobile}
				profileHref="/admin"
				settingsHref="/admin"
			/>

			{/* Collapse Button - Bottom (desktop only) */}
			{!isMobile && (
				<div className="border-t p-3">
					<button
						onClick={() => toggle()}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-3 font-semibold text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground",
							isCollapsed && "justify-center px-2",
						)}
						title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{isCollapsed ? (
							<ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2.5} />
						) : (
							<>
								<ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2.5} />
								<span>Collapse</span>
							</>
						)}
					</button>
				</div>
			)}
		</>
	);

	return (
		<>
			<button
				onClick={() => setIsMobileOpen(true)}
				className="fixed top-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-md lg:hidden"
				aria-label="Open admin menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="4" x2="20" y1="12" y2="12" />
					<line x1="4" x2="20" y1="6" y2="6" />
					<line x1="4" x2="20" y1="18" y2="18" />
				</svg>
			</button>

			<aside
				className={cn(
					"fixed top-0 left-0 z-40 hidden h-screen flex-col border-r bg-card shadow-lg transition-all duration-300 lg:flex",
					isCollapsed ? "w-20" : "w-72",
				)}
			>
				<SidebarContent />
			</aside>

			{isMobileOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 lg:hidden"
					onClick={() => setIsMobileOpen(false)}
				/>
			)}

			<aside
				className={cn(
					"fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r bg-card shadow-xl transition-transform duration-300 lg:hidden",
					isMobileOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<button
					onClick={() => setIsMobileOpen(false)}
					className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
					aria-label="Close menu"
				>
					<X className="h-5 w-5" />
				</button>
				<SidebarContent isMobile />
			</aside>
		</>
	);
}

"use client";

import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

const adminMenuItems: SidebarMenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Audit Log", href: "/admin/audit-log", icon: FileText },
];

export function AdminSidebar() {
  return (
    <DashboardSidebar
      items={adminMenuItems}
      accentColor="red-600"
      logoIcon={Shield}
      logoText="Admin"
      logoBgColor="bg-red-600"
      homeHref="/admin"
      profileHref="/student/profile"
    />
  );
}

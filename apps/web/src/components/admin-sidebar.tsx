"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  LayoutDashboard,
  PieChart,
  Shield,
  Users,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

const adminMenuItems: SidebarMenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Reports", href: "/admin/reports", icon: PieChart },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
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
      profileHref="/admin/profile"
    />
  );
}

"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Shield,
  Users,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

export function AdminSidebar() {
  const unreadCount = useQuery(api.notifications.unreadCount) ?? 0;
  const unreadMessages = useQuery(api.messagesApi.unreadCount) ?? 0;

  const adminMenuItems: SidebarMenuItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "Reports", href: "/admin/reports", icon: PieChart },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
      badge: unreadCount,
    },
    { title: "Audit Log", href: "/admin/audit-log", icon: FileText },
  ];

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

"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  DollarSign,
  LayoutDashboard,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

const tutorMenuItems: SidebarMenuItem[] = [
  { title: "Dashboard", href: "/tutor", icon: LayoutDashboard },
  { title: "My Courses", href: "/tutor/courses", icon: BookOpen },
  { title: "Students", href: "/tutor/students", icon: Users },
  { title: "Reviews", href: "/tutor/reviews", icon: Star },
  { title: "Analytics", href: "/tutor/analytics", icon: BarChart3 },
  { title: "Earnings", href: "/tutor/earnings", icon: DollarSign },
  { title: "Messages", href: "/tutor/messages", icon: MessageSquare },
  { title: "Notifications", href: "/tutor/notifications", icon: Bell },
];

export function TutorSidebar() {
  return (
    <DashboardSidebar
      items={tutorMenuItems}
      accentColor="emerald-600"
      logoIcon={BookOpen}
      logoText="Tutor"
      logoBgColor="bg-emerald-600"
      homeHref="/tutor"
      profileHref="/tutor/profile"
    />
  );
}

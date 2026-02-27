"use client";

import {
  BarChart3,
  BookOpen,
  DollarSign,
  LayoutDashboard,
  PenSquare,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

const tutorMenuItems: SidebarMenuItem[] = [
  { title: "Dashboard", href: "/tutor", icon: LayoutDashboard },
  { title: "My Courses", href: "/tutor/courses", icon: BookOpen },
  { title: "Course Editor", href: "/tutor/courses/editor", icon: PenSquare },
  { title: "Analytics", href: "/tutor/analytics", icon: BarChart3 },
  { title: "Earnings", href: "/tutor/earnings", icon: DollarSign },
];

export function TutorSidebar() {
  return (
    <DashboardSidebar
      items={tutorMenuItems}
      accentColor="emerald-600"
      logoIcon={PenSquare}
      logoText="Tutor"
      logoBgColor="bg-emerald-600"
      homeHref="/tutor"
      profileHref="/tutor/profile"
    />
  );
}

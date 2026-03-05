"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  Bell,
  BookOpen,
  DollarSign,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

export function TutorSidebar() {
  const unreadCount = useQuery(api.notifications.unreadCount) ?? 0;
  const unreadMessages = useQuery(api.messagesApi.unreadCount) ?? 0;

  const tutorMenuItems: SidebarMenuItem[] = [
    { title: "Dashboard", href: "/tutor", icon: LayoutDashboard },
    { title: "My Courses", href: "/tutor/courses", icon: BookOpen },
    { title: "Students", href: "/tutor/students", icon: Users },
    { title: "Reviews", href: "/tutor/reviews", icon: Star },
    { title: "Forum", href: "/tutor/forum", icon: MessageCircle },
    { title: "Analytics", href: "/tutor/analytics", icon: BarChart3 },
    { title: "Earnings", href: "/tutor/earnings", icon: DollarSign },
    {
      title: "Messages",
      href: "/tutor/messages",
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      title: "Notifications",
      href: "/tutor/notifications",
      icon: Bell,
      badge: unreadCount,
    },
  ];

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

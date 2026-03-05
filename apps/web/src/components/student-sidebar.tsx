"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  Heart,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import {
  DashboardSidebar,
  type SidebarMenuItem,
} from "@/components/dashboard-sidebar";

export function StudentSidebar() {
  const unreadCount = useQuery(api.notifications.unreadCount) ?? 0;
  const unreadMessages = useQuery(api.messagesApi.unreadCount) ?? 0;

  const studentMenuItems: SidebarMenuItem[] = [
    { title: "Dashboard", href: "/student", icon: LayoutDashboard },
    { title: "My Courses", href: "/student/my-courses", icon: BookOpen },
    { title: "Wishlist", href: "/student/wishlist", icon: Heart },
    { title: "Certificates", href: "/student/certificates", icon: Award },
    { title: "Study Plan", href: "/student/study-plan", icon: Calendar },
    {
      title: "Messages",
      href: "/student/messages",
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      title: "Notifications",
      href: "/student/notifications",
      icon: Bell,
      badge: unreadCount,
    },
  ];

  return (
    <DashboardSidebar
      items={studentMenuItems}
      accentColor="primary"
      logoIcon={BookOpen}
      logoText="Aqoon AI"
      logoBgColor="bg-primary"
      homeHref="/student"
      profileHref="/student/profile"
    />
  );
}

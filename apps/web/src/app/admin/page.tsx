"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const stats = useQuery(api.dashboard.adminStats);

  const isLoading = stats === undefined;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-linear-to-br from-category-coding to-category-coding/70",
    },
    {
      title: "Total Courses",
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      color: "bg-linear-to-br from-success to-success/70",
    },
    {
      title: "Enrollments",
      value: stats?.totalEnrollments ?? 0,
      icon: GraduationCap,
      color: "bg-linear-to-br from-category-languages to-category-languages/70",
    },
    {
      title: "Revenue",
      value: `$${((stats?.totalRevenueCents ?? 0) / 100).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-linear-to-br from-warning to-warning/70",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold font-display text-3xl">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Overview of your platform&apos;s performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`stat-skel-${i}`} className="h-28 rounded-2xl" />
            ))
          : statCards.map((stat, index) => (
              <div
                key={stat.title}
                className="group animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.title}
                    </p>
                    <p className="mt-1 font-bold font-display text-3xl">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Breakdown */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b p-6">
            <h2 className="font-bold font-display text-lg">
              Platform Breakdown
            </h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={`break-skel-${i}`} className="h-10 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="font-medium">Students</span>
                  </div>
                  <span className="font-bold text-lg">
                    {stats?.totalStudents ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                      <GraduationCap className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="font-medium">Tutors</span>
                  </div>
                  <span className="font-bold text-lg">
                    {stats?.totalTutors ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="font-medium">Admins</span>
                  </div>
                  <span className="font-bold text-lg">
                    {stats?.totalAdmins ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="font-medium">Published Courses</span>
                  </div>
                  <span className="font-bold text-lg">
                    {stats?.publishedCourses ?? 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b p-6">
            <h2 className="font-bold font-display text-lg">Quick Stats</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={`qs-skel-${i}`} className="h-10 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <span className="text-muted-foreground">Total Payments</span>
                  <span className="font-bold">{stats?.totalPayments ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <span className="text-muted-foreground">
                    Published / Total
                  </span>
                  <span className="font-bold">
                    {stats?.publishedCourses ?? 0} / {stats?.totalCourses ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <span className="text-muted-foreground">
                    Avg Revenue / Course
                  </span>
                  <span className="font-bold">
                    $
                    {stats && stats.totalCourses > 0
                      ? Math.round(
                          stats.totalRevenueCents / stats.totalCourses / 100,
                        )
                      : 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

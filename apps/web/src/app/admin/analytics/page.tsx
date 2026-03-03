"use client";

import { formatCurrency } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsPage() {
  const stats = useQuery(api.dashboard.adminStats);
  const analytics = useQuery(api.dashboard.adminAnalytics);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-3xl">
          Platform Analytics
        </h1>
        <p className="text-muted-foreground">
          Monitor platform performance and growth
        </p>
      </div>

      {/* Overview Stats */}
      {stats === undefined ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`stat-${i}`} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "from-blue-500/20 to-blue-500/5",
              iconColor: "text-blue-600",
            },
            {
              title: "Total Courses",
              value: stats.totalCourses,
              icon: BookOpen,
              color: "from-emerald-500/20 to-emerald-500/5",
              iconColor: "text-emerald-600",
            },
            {
              title: "Enrollments",
              value: stats.totalEnrollments,
              icon: TrendingUp,
              color: "from-purple-500/20 to-purple-500/5",
              iconColor: "text-purple-600",
            },
            {
              title: "Revenue",
              value: formatCurrency(stats.totalRevenueCents),
              icon: DollarSign,
              color: "from-amber-500/20 to-amber-500/5",
              iconColor: "text-amber-600",
            },
          ].map((stat, i) => (
            <Card
              key={stat.title}
              className="fade-in slide-in-from-bottom-4 animate-in rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: "backwards",
              }}
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${stat.color}`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-bold text-xl">{stat.value}</p>
                    <p className="text-muted-foreground text-xs">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Breakdown */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  role: "Students",
                  count: stats.totalStudents,
                  color: "bg-blue-500",
                },
                {
                  role: "Tutors",
                  count: stats.totalTutors,
                  color: "bg-emerald-500",
                },
                {
                  role: "Admins",
                  count: stats.totalAdmins,
                  color: "bg-red-500",
                },
              ].map((item) => (
                <div key={item.role} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.role}</span>
                    <span className="font-medium">
                      {item.count} (
                      {stats.totalUsers > 0
                        ? Math.round((item.count / stats.totalUsers) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{
                        width: `${stats.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Course Breakdown */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                  <p className="font-bold text-2xl text-emerald-600">
                    {stats.publishedCourses}
                  </p>
                  <p className="text-muted-foreground text-xs">Published</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-4 text-center">
                  <p className="font-bold text-2xl text-amber-600">
                    {stats.totalCourses - stats.publishedCourses}
                  </p>
                  <p className="text-muted-foreground text-xs">Draft</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Publish Rate</span>
                  <span className="font-medium">
                    {stats.totalCourses > 0
                      ? Math.round(
                          (stats.publishedCourses / stats.totalCourses) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    stats.totalCourses > 0
                      ? (stats.publishedCourses / stats.totalCourses) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Courses */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Courses by Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCourses.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topCourses.map((course, index) => (
                    <div
                      key={course.courseId}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {course.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          by {course.tutorName}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {course.enrollments} enrolled
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground text-sm">
                  No courses with enrollments yet
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Top Tutors */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Tutors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topTutors.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topTutors.map((tutor, index) => (
                    <div
                      key={tutor.tutorId}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {tutor.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {tutor.courseCount} courses
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {tutor.totalStudents} students
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground text-sm">
                  No tutors with students yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading skeleton for analytics */}
      {analytics === undefined && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={`anal-${i}`} className="h-64 rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { BookOpen, DollarSign, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorDashboardPage() {
  const stats = useQuery(api.dashboard.tutorStats);
  const courses = useQuery(api.courses.listByTutor);

  const statCards = [
    {
      title: "My Courses",
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      color: "bg-linear-to-br from-success to-success/70",
    },
    {
      title: "Total Students",
      value: stats?.totalEnrollments ?? 0,
      icon: Users,
      color: "bg-linear-to-br from-category-coding to-category-coding/70",
    },
    {
      title: "Avg. Rating",
      value: stats?.avgRating ?? 0,
      icon: Star,
      color: "bg-linear-to-br from-warning to-warning/70",
    },
    {
      title: "Total Earnings",
      value: `$${((stats?.totalRevenueCents ?? 0) / 100).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-linear-to-br from-category-languages to-category-languages/70",
    },
  ];

  const isLoading = stats === undefined || courses === undefined;

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">
            Tutor Dashboard
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Welcome back! Here&apos;s your teaching overview.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl px-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Link href="/tutor/courses/new">Create New Course</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`stat-skel-${i}`} className="h-24 rounded-2xl" />
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

      {/* My Courses */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="font-bold font-display text-lg">My Courses</h2>
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link href="/tutor/courses">View All</Link>
          </Button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`course-skel-${i}`}
                  className="h-20 rounded-2xl"
                />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-border p-5 transition-all duration-300 hover:border-transparent hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold transition-colors group-hover:text-primary">
                        {course.title}
                      </h3>
                      <Badge
                        variant={course.isPublished ? "default" : "secondary"}
                      >
                        {course.isPublished ? "published" : "draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.enrollmentCount ?? 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-warning" />
                        {course.avgRating ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />$
                        {(
                          (course.totalRevenueCents ?? 0) / 100
                        ).toLocaleString()}
                      </span>
                    </div>
                    {course.isPublished && (
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Completion Rate
                          </span>
                          <span className="font-medium">
                            {course.completionRate ?? 0}%
                          </span>
                        </div>
                        <Progress
                          value={course.completionRate ?? 0}
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    asChild
                  >
                    <Link href={`/tutor/courses/${course._id}`}>
                      Edit Course
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <BookOpen className="mx-auto mb-3 h-10 w-10" />
              <p className="font-medium">No courses yet</p>
              <p className="mt-1 text-sm">
                Create your first course to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

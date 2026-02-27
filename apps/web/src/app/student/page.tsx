"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowRight, BookOpen, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardPage() {
  const stats = useQuery(api.dashboard.studentStats);
  const enrollments = useQuery(api.enrollments.myEnrollments);

  const statCards = [
    {
      title: "Courses Enrolled",
      value: stats?.enrolledCourses ?? 0,
      icon: BookOpen,
      color: "bg-linear-to-br from-primary/20 to-primary/5",
    },
    {
      title: "Completed",
      value: stats?.completedCourses ?? 0,
      icon: Trophy,
      color: "bg-linear-to-br from-success/20 to-success/5",
    },
    {
      title: "Avg Quiz Score",
      value: stats ? `${stats.avgQuizScore}%` : "0%",
      icon: Clock,
      color: "bg-linear-to-br from-warning/20 to-warning/5",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-2xl">My Learning</h1>
        <p className="text-muted-foreground text-sm">
          Track your progress and continue where you left off
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats === undefined
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`stat-skel-${i}`} className="h-20 rounded-2xl" />
            ))
          : statCards.map((stat, i) => (
              <Card
                key={stat.title}
                className="fade-in slide-in-from-bottom-4 animate-in rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <stat.icon className="h-5 w-5 text-foreground/80" />
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

      {/* Current Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">
            Continue Learning
          </h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs"
          >
            <Link href="/courses">
              Browse More
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {enrollments === undefined ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`enroll-skel-${i}`} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment, i) => {
              if (!enrollment) return null;
              return (
                <Link
                  key={enrollment._id}
                  href={`/student/learn/${enrollment.courseId}`}
                  className="fade-in slide-in-from-bottom-4 block animate-in"
                  style={{
                    animationDelay: `${(i + 3) * 100}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <Card className="overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-video overflow-hidden">
                      {enrollment.course.thumbnailUrl ? (
                        <img
                          src={enrollment.course.thumbnailUrl}
                          alt={enrollment.course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                          <BookOpen className="h-10 w-10 text-primary/40" />
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2 text-xs capitalize"
                        variant="secondary"
                      >
                        {enrollment.course.level}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="mb-2 line-clamp-1 font-semibold text-sm">
                        {enrollment.course.title}
                      </h3>
                      <Progress value={enrollment.progress} className="h-1.5" />
                      <p className="mt-1 text-right text-muted-foreground text-xs">
                        {enrollment.progress}% complete
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="py-10 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 font-semibold text-sm">No courses yet</h3>
              <p className="mb-3 text-muted-foreground text-xs">
                Start your learning journey by enrolling in a course
              </p>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

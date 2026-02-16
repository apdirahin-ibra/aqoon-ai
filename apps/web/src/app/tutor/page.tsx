"use client";

import { BookOpen, DollarSign, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "My Courses",
    value: "8",
    icon: BookOpen,
    color: "bg-linear-to-br from-success to-success/70",
  },
  {
    title: "Total Students",
    value: "1,247",
    icon: Users,
    color: "bg-linear-to-br from-category-coding to-category-coding/70",
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    icon: Star,
    color: "bg-linear-to-br from-warning to-warning/70",
  },
  {
    title: "Total Earnings",
    value: "$12,480",
    icon: DollarSign,
    color: "bg-linear-to-br from-category-languages to-category-languages/70",
  },
];

const myCourses = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    students: 245,
    rating: 4.9,
    revenue: "$4,200",
    status: "published",
    completionRate: 78,
  },
  {
    id: "2",
    title: "Web Development with React",
    students: 189,
    rating: 4.7,
    revenue: "$3,600",
    status: "published",
    completionRate: 65,
  },
  {
    id: "3",
    title: "Advanced JavaScript Patterns",
    students: 92,
    rating: 4.8,
    revenue: "$2,100",
    status: "draft",
    completionRate: 0,
  },
];

export default function TutorDashboardPage() {
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
          <Link href={"/tutor/courses/editor" as any}>Create New Course</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
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
            <Link href={"/tutor/courses" as any}>View All</Link>
          </Button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col gap-4 rounded-2xl border border-border p-5 transition-all duration-300 hover:border-transparent hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold transition-colors group-hover:text-primary">
                      {course.title}
                    </h3>
                    <Badge
                      variant={
                        course.status === "published" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.students} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-warning" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {course.revenue}
                    </span>
                  </div>
                  {course.status === "published" && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Avg. Completion
                        </span>
                        <span className="font-medium">
                          {course.completionRate}%
                        </span>
                      </div>
                      <Progress
                        value={course.completionRate}
                        className="h-1.5"
                      />
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Edit Course
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

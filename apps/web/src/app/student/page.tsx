"use client";

import { ArrowRight, BookOpen, Clock, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Enrollment {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string;
    level: string;
    isPremium: boolean;
    priceCents: number | null;
  };
  progress: number;
}

const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    enrolledAt: "2024-01-15",
    course: {
      id: "1",
      title: "Introduction to Python Programming",
      description: "Learn Python from scratch",
      thumbnailUrl: null,
      category: "coding",
      level: "beginner",
      isPremium: false,
      priceCents: 0,
    },
    progress: 65,
  },
  {
    id: "2",
    enrolledAt: "2024-01-20",
    course: {
      id: "2",
      title: "Web Development with React",
      description: "Build modern web apps",
      thumbnailUrl: null,
      category: "coding",
      level: "intermediate",
      isPremium: true,
      priceCents: 4999,
    },
    progress: 30,
  },
];

export default function StudentDashboardPage() {
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);
  const [loading] = useState(false);

  const stats = [
    {
      title: "Courses Enrolled",
      value: enrollments.length,
      icon: BookOpen,
      color: "bg-linear-to-br from-primary/20 to-primary/5",
    },
    {
      title: "Completed",
      value: enrollments.filter((e) => e.progress === 100).length,
      icon: Trophy,
      color: "bg-linear-to-br from-success/20 to-success/5",
    },
    {
      title: "Learning Time",
      value: `${enrollments.length * 5}h`,
      icon: Clock,
      color: "bg-linear-to-br from-warning/20 to-warning/5",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        {stats.map((stat, i) => (
          <Card
            key={stat.title}
            className="rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
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
                  <p className="text-muted-foreground text-xs">{stat.title}</p>
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

        {enrollments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment, i) => (
              <Link
                key={enrollment.id}
                href={`/student/learn/${enrollment.course.id}/1`}
                className="block animate-in fade-in slide-in-from-bottom-4"
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
            ))}
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

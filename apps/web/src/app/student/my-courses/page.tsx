"use client";

import { BookOpen, Clock, Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    totalLessons: number;
  };
  progress: number;
  completedLessons: number;
}

const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    enrolledAt: "2024-01-15",
    course: {
      id: "1",
      title: "Introduction to Python Programming",
      description: "Learn Python from scratch with hands-on projects",
      thumbnailUrl: null,
      category: "coding",
      level: "beginner",
      isPremium: false,
      priceCents: 0,
      totalLessons: 20,
    },
    progress: 65,
    completedLessons: 13,
  },
  {
    id: "2",
    enrolledAt: "2024-01-20",
    course: {
      id: "2",
      title: "Web Development with React",
      description: "Build modern web applications with React",
      thumbnailUrl: null,
      category: "coding",
      level: "intermediate",
      isPremium: true,
      priceCents: 4999,
      totalLessons: 30,
    },
    progress: 30,
    completedLessons: 9,
  },
  {
    id: "3",
    enrolledAt: "2024-02-01",
    course: {
      id: "3",
      title: "Advanced JavaScript Patterns",
      description: "Master advanced JS concepts and design patterns",
      thumbnailUrl: null,
      category: "coding",
      level: "advanced",
      isPremium: true,
      priceCents: 5999,
      totalLessons: 25,
    },
    progress: 100,
    completedLessons: 25,
  },
];

export default function MyCoursesPage() {
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = enrollments.filter((e) =>
    e.course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-bold font-display text-2xl">My Courses</h1>
          <p className="text-muted-foreground text-sm">
            {enrollments.length} courses enrolled
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="rounded-xl pl-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((enrollment, i) => (
            <Link
              key={enrollment.id}
              href={`/student/learn/${enrollment.course.id}/1`}
              className="block animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${i * 100}ms`,
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
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {enrollment.course.level}
                    </Badge>
                    {enrollment.progress === 100 && (
                      <Badge className="bg-success text-success-foreground text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="mb-1 line-clamp-1 font-semibold text-sm">
                    {enrollment.course.title}
                  </h3>
                  <p className="mb-2 line-clamp-1 text-muted-foreground text-xs">
                    {enrollment.course.description}
                  </p>
                  <Progress
                    value={enrollment.progress}
                    className="mb-1 h-1.5"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {enrollment.completedLessons}/
                      {enrollment.course.totalLessons} lessons
                    </span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="py-10 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 font-semibold text-sm">No courses found</h3>
            <p className="mb-3 text-muted-foreground text-xs">
              Try a different search term or browse courses
            </p>
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

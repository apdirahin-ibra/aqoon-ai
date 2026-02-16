"use client";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderOpen,
  Loader2,
  Lock,
  Map,
  MessageSquare,
  Play,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string;
  level: string;
  isPremium: boolean;
  priceCents: number | null;
  tutorName: string | null;
}

interface Lesson {
  id: string;
  title: string;
  orderIndex: number;
  durationMinutes: number | null;
  isPreview: boolean;
}

const mockCourse: Course = {
  id: "1",
  title: "Introduction to Python Programming",
  description:
    "Learn Python from scratch with hands-on projects. This comprehensive course covers everything from basic syntax to advanced concepts like object-oriented programming.",
  thumbnailUrl: null,
  category: "coding",
  level: "beginner",
  isPremium: false,
  priceCents: 0,
  tutorName: "John Smith",
};

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Introduction to Python",
    orderIndex: 0,
    durationMinutes: 15,
    isPreview: true,
  },
  {
    id: "2",
    title: "Variables and Data Types",
    orderIndex: 1,
    durationMinutes: 20,
    isPreview: true,
  },
  {
    id: "3",
    title: "Control Flow",
    orderIndex: 2,
    durationMinutes: 25,
    isPreview: false,
  },
  {
    id: "4",
    title: "Functions",
    orderIndex: 3,
    durationMinutes: 30,
    isPreview: false,
  },
  {
    id: "5",
    title: "Lists and Tuples",
    orderIndex: 4,
    durationMinutes: 25,
    isPreview: false,
  },
  {
    id: "6",
    title: "Dictionaries and Sets",
    orderIndex: 5,
    durationMinutes: 20,
    isPreview: false,
  },
  {
    id: "7",
    title: "Object-Oriented Programming",
    orderIndex: 6,
    durationMinutes: 35,
    isPreview: false,
  },
  {
    id: "8",
    title: "File Handling",
    orderIndex: 7,
    durationMinutes: 20,
    isPreview: false,
  },
];

const categoryStyles: Record<string, string> = {
  coding: "bg-blue-500/10 text-blue-500",
  languages: "bg-green-500/10 text-green-500",
  art: "bg-purple-500/10 text-purple-500",
  business: "bg-orange-500/10 text-orange-500",
  music: "bg-pink-500/10 text-pink-500",
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course] = useState<Course | null>(mockCourse);
  const [lessons] = useState<Lesson[]>(mockLessons);
  const [loading] = useState(false);
  const [isEnrolled] = useState(true);
  const [enrolledCount] = useState(120);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const totalDuration = lessons.reduce(
    (sum, l) => sum + (l.durationMinutes || 0),
    0,
  );

  if (loading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Course Header */}
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={cn(
                    "r2.5 px- py-1 font-mediumounded-full text-xs capitalize",
                    categoryStyles[course.category] ||
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {course.category}
                </span>
                <span className="text-sm capitalize opacity-80">
                  {course.level}
                </span>
              </div>

              <h1 className="mb-4 font-bold font-display text-3xl md:text-4xl">
                {course.title}
              </h1>

              {course.description && (
                <p className="mb-6 text-lg opacity-90">{course.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm opacity-80">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {lessons.length} lessons
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {totalDuration} min
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {enrolledCount} enrolled
                </span>
                {course.tutorName && (
                  <span className="flex items-center gap-2">
                    By {course.tutorName}
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-xl">
                <CardContent className="p-6">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-accent/20">
                      <BookOpen className="h-12 w-12 text-primary/40" />
                    </div>
                  )}

                  {isEnrolled ? (
                    <>
                      <Progress value={0} className="mb-4" />
                      <p className="mb-3 text-center text-muted-foreground text-sm">
                        0% completed
                      </p>
                      <Button className="mb-3 w-full rounded-xl" asChild>
                        <Link href={`/student/learn/${course.id}/1`}>
                          Start Learning
                        </Link>
                      </Button>

                      {/* Quick Access Links */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto flex-col rounded-xl py-2"
                          asChild
                        >
                          <Link href={`/student/courses/${course.id}/forum`}>
                            <MessageSquare className="mb-1 h-4 w-4" />
                            <span className="text-xs">Forum</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto flex-col rounded-xl py-2"
                          asChild
                        >
                          <Link
                            href={`/student/courses/${course.id}/resources`}
                          >
                            <FolderOpen className="mb-1 h-4 w-4" />
                            <span className="text-xs">Resources</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto flex-col rounded-xl py-2"
                          asChild
                        >
                          <Link href={`/student/courses/${course.id}/roadmap`}>
                            <Map className="mb-1 h-4 w-4" />
                            <span className="text-xs">Roadmap</span>
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 text-center">
                        {course.isPremium && course.priceCents ? (
                          <>
                            <p className="font-bold text-3xl text-foreground">
                              {formatPrice(course.priceCents)}
                            </p>
                            <div className="mt-1 flex items-center justify-center gap-1 text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-medium text-sm">
                                Premium Course
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="font-bold text-3xl text-green-500">
                            Free
                          </p>
                        )}
                      </div>

                      <Button className="w-full">
                        {course.isPremium ? "Purchase Course" : "Enroll Now"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-12">
        <h2 className="mb-6 font-bold font-display text-2xl">Course Content</h2>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const canAccess = isEnrolled || lesson.isPreview;

            return (
              <div
                key={lesson.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                  canAccess
                    ? "cursor-pointer border-border hover:border-primary/30"
                    : "border-border/50 opacity-60",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {canAccess ? (
                    <Play className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">
                    {index + 1}. {lesson.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {lesson.durationMinutes || 10} min
                    {lesson.isPreview && !isEnrolled && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Preview
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {lessons.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                No lessons available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

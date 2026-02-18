"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  Loader2,
  Play,
} from "lucide-react";
import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function LessonViewerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId: courseIdStr, lessonId: lessonIdStr } = use(params);
  const courseId = courseIdStr as Id<"courses">;
  const lessonId = lessonIdStr as Id<"lessons">;

  const course = useQuery(api.courses.get, { courseId });
  const lessons = useQuery(api.lessons.listByCourse, { courseId });
  const currentLesson = useQuery(api.lessons.get, { lessonId });
  const courseProgress = useQuery(api.progress.getCourseProgress, { courseId });
  const toggleComplete = useMutation(api.progress.toggleComplete);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lessonsList = lessons ?? [];
  const currentIndex = lessonsList.findIndex((l) => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? lessonsList[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessonsList.length - 1
      ? lessonsList[currentIndex + 1]
      : null;
  const progressPercent = courseProgress?.progress ?? 0;

  // Check if current lesson is completed from the lessons list
  const isCurrentCompleted =
    lessonsList.find((l) => l._id === lessonId)?.completed ?? false;

  if (course === undefined || lessons === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-0 z-40 flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col border-r bg-card transition-all duration-300",
            sidebarOpen ? "w-80" : "w-0 overflow-hidden",
          )}
        >
          <div className="border-b p-4">
            <Link
              href="/student/my-courses"
              className="mb-2 flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Course</span>
            </Link>
            <h2 className="mt-2 line-clamp-2 font-semibold">{course?.title}</h2>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {lessonsList.map((lesson, index) => {
              const isCurrent = lesson._id === lessonId;

              return (
                <Link
                  key={lesson._id}
                  href={`/student/learn/${courseId}/${lesson._id}`}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                    isCurrent
                      ? "border border-primary/20 bg-primary/10"
                      : "hover:bg-muted/50",
                  )}
                >
                  <div className="mt-0.5">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isCurrent ? (
                      <Play className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "line-clamp-2 font-medium text-sm",
                        isCurrent && "text-primary",
                      )}
                    >
                      {index + 1}. {lesson.title}
                    </p>
                    {lesson.durationMinutes && (
                      <p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMinutes} min
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-r-lg border bg-card p-2 shadow-sm transition-colors hover:bg-muted"
          style={{ left: sidebarOpen ? "318px" : "0" }}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              !sidebarOpen && "rotate-180",
            )}
          />
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="mx-auto max-w-4xl p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="mb-1 text-muted-foreground text-sm">
                    Lesson {currentIndex + 1} of {lessonsList.length}
                  </p>
                  <h1 className="font-bold font-display text-3xl">
                    {currentLesson.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="complete"
                    checked={isCurrentCompleted}
                    onCheckedChange={async () => {
                      await toggleComplete({ lessonId });
                    }}
                  />
                  <label htmlFor="complete" className="cursor-pointer text-sm">
                    Mark as complete
                  </label>
                </div>
              </div>

              {currentLesson.durationMinutes && (
                <div className="mb-8 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{currentLesson.durationMinutes} minutes</span>
                </div>
              )}

              <Card>
                <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6">
                  {currentLesson.content ? (
                    <div>{currentLesson.content}</div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No content available for this lesson yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {prevLesson ? (
                  <Button variant="outline" asChild>
                    <Link href={`/student/learn/${courseId}/${prevLesson._id}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous: {prevLesson.title}
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Button asChild>
                    <Link href={`/student/learn/${courseId}/${nextLesson._id}`}>
                      Next: {nextLesson.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={`/courses/${courseId}`}>
                      Finish Course
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No lessons available</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

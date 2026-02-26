"use client";

import {
  ArrowRight,
  CheckCircle,
  Circle,
  Lock,
  Play,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LESSONS_PER_MODULE = 4;

export default function CourseRoadmapPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;

  const lessonsWithProgress = useQuery(api.progress.getLessonsWithProgress, {
    courseId,
  });

  if (lessonsWithProgress === undefined) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-8 h-16 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Group lessons into modules (groups of LESSONS_PER_MODULE)
  const modules: { name: string; lessons: typeof lessonsWithProgress }[] = [];
  for (let i = 0; i < lessonsWithProgress.length; i += LESSONS_PER_MODULE) {
    modules.push({
      name: `Module ${modules.length + 1}`,
      lessons: lessonsWithProgress.slice(i, i + LESSONS_PER_MODULE),
    });
  }

  const completedCount = lessonsWithProgress.filter((l) => l.completed).length;
  const totalLessons = lessonsWithProgress.length;
  const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${courseId}`}
          className="mb-2 block text-muted-foreground text-sm hover:text-foreground"
        >
          ← Back to Course
        </Link>
        <h1 className="mb-2 font-bold font-display text-3xl">Course Roadmap</h1>
        <p className="text-muted-foreground">Your learning roadmap</p>
      </div>

      {/* Progress Overview Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-muted-foreground text-sm">
                {Math.round(progress)}% complete — {completedCount}/
                {totalLessons} lessons
              </p>
            </div>
            {progress === 100 && (
              <Badge className="bg-success text-success-foreground">
                <Trophy className="mr-1 h-4 w-4" />
                Completed!
              </Badge>
            )}
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {totalLessons === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No lessons yet</h3>
            <p className="text-muted-foreground">
              This course doesn&apos;t have any lessons yet
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Roadmap Timeline */
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-border" />

          <div className="space-y-8">
            {modules.map((module, moduleIdx) => {
              const moduleCompleted = module.lessons.every((l) => l.completed);
              const moduleProgress =
                (module.lessons.filter((l) => l.completed).length /
                  module.lessons.length) *
                100;

              return (
                <div key={moduleIdx} className="relative pl-20">
                  {/* Module Node */}
                  <div
                    className={`absolute left-4 flex h-8 w-8 items-center justify-center rounded-full ${
                      moduleCompleted
                        ? "bg-success text-success-foreground"
                        : moduleProgress > 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {moduleCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-bold text-sm">{moduleIdx + 1}</span>
                    )}
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Badge
                          variant={moduleCompleted ? "default" : "secondary"}
                        >
                          {module.lessons.filter((l) => l.completed).length}/
                          {module.lessons.length}
                        </Badge>
                      </div>
                      <Progress value={moduleProgress} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIdx) => {
                          const isLocked =
                            !lesson.completed &&
                            lessonIdx > 0 &&
                            !module.lessons[lessonIdx - 1].completed;

                          return (
                            <div
                              key={lesson._id}
                              className={`flex items-center gap-3 rounded-lg p-3 ${
                                lesson.completed
                                  ? "bg-success/10"
                                  : isLocked
                                    ? "bg-muted/50 opacity-60"
                                    : "bg-muted/30 hover:bg-muted/50"
                              } transition-colors`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : isLocked ? (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Circle className="h-5 w-5 text-primary" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                {lesson.durationMinutes && (
                                  <p className="text-muted-foreground text-xs">
                                    {lesson.durationMinutes} min
                                  </p>
                                )}
                              </div>
                              {!isLocked && !lesson.completed && (
                                <Button asChild size="sm" variant="ghost">
                                  <Link
                                    href={`/student/learn/${courseId}/${lesson._id}`}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {/* Completion Node */}
            <div className="relative pl-20">
              <div
                className={`absolute left-4 flex h-8 w-8 items-center justify-center rounded-full ${
                  progress === 100
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Trophy className="h-5 w-5" />
              </div>
              <Card className={progress === 100 ? "border-success" : ""}>
                <CardContent className="py-6 text-center">
                  {progress === 100 ? (
                    <>
                      <h3 className="mb-2 font-semibold text-success">
                        🎉 Course Completed!
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Congratulations! You&apos;ve completed all lessons.
                      </p>
                      <Button asChild>
                        <Link href="/student/certificates">
                          View Certificate
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="mb-2 font-semibold text-muted-foreground">
                        Course Completion
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Complete all lessons to earn your certificate
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

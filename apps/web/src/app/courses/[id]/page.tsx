"use client";

import { formatCurrency, formatRelativeTime } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderOpen,
  Lock,
  Map,
  MessageSquare,
  Play,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  "Web Development": "bg-blue-500/10 text-blue-500",
  "Data Science": "bg-green-500/10 text-green-500",
  "Backend Development": "bg-purple-500/10 text-purple-500",
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
  const { id } = use(params);
  const courseId = id as Id<"courses">;

  const course = useQuery(api.courses.get, { courseId });
  const lessons = useQuery(api.lessons.listByCourse, { courseId });
  const reviews = useQuery(api.reviews.listByCourse, { courseId });

  // enrollments.check requires auth — if not logged in, returns undefined
  const enrollmentStatus = useQuery(api.enrollments.check, { courseId });
  const isEnrolled = enrollmentStatus?.enrolled ?? false;
  const enroll = useMutation(api.enrollments.enroll);

  // Progress — only fetch if enrolled
  const progressData = useQuery(
    api.progress.getCourseProgress,
    isEnrolled ? { courseId } : "skip",
  );

  // Review form state
  const createReview = useMutation(api.reviews.create);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = async () => {
    if (!reviewRating) return;
    setIsSubmittingReview(true);
    try {
      await createReview({
        courseId,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (course === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="bg-primary py-12 text-primary-foreground">
          <div className="container">
            <Skeleton className="mb-4 h-8 w-32 bg-white/20" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Skeleton className="h-6 w-40 bg-white/20" />
                <Skeleton className="h-10 w-full bg-white/20" />
                <Skeleton className="h-20 w-full bg-white/20" />
              </div>
              <Skeleton className="h-64 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-xl">Course Not Found</h2>
          <p className="mb-4 text-muted-foreground">
            This course doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalDuration = course.totalDuration ?? 0;
  const lessonsList = lessons ?? [];
  const firstLessonId = lessonsList.length > 0 ? lessonsList[0]._id : null;
  const courseProgress = progressData?.progress ?? 0;
  const reviewsList = reviews ?? [];

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
              asChild
            >
              <Link href="/courses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 font-medium text-xs capitalize",
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
                  {course.lessonCount} lessons
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {totalDuration} min
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {course.enrollmentCount} enrolled
                </span>
                {course.avgRating > 0 && (
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current" />
                    {course.avgRating.toFixed(1)} ({course.reviewCount} reviews)
                  </span>
                )}
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
                      <Progress value={courseProgress} className="mb-4" />
                      <p className="mb-3 text-center text-muted-foreground text-sm">
                        {courseProgress}% completed
                      </p>
                      <Button className="mb-3 w-full rounded-xl" asChild>
                        <Link
                          href={
                            firstLessonId
                              ? `/student/learn/${courseId}/${firstLessonId}`
                              : `/courses/${courseId}`
                          }
                        >
                          {courseProgress > 0
                            ? "Continue Learning"
                            : "Start Learning"}
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
                          <Link href={`/student/courses/${courseId}/forum`}>
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
                          <Link href={`/student/courses/${courseId}/resources`}>
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
                          <Link href={`/student/courses/${courseId}/roadmap`}>
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
                              {formatCurrency(course.priceCents)}
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

                      <Button
                        className="w-full"
                        onClick={async () => {
                          try {
                            await enroll({ courseId });
                            toast.success("Successfully enrolled! 🎉");
                          } catch (err: unknown) {
                            const message =
                              err instanceof Error ? err.message : "";
                            if (
                              message.includes("authentication") ||
                              message.includes("Not authenticated")
                            ) {
                              window.location.href = "/signin";
                            } else if (message.includes("Payment required")) {
                              toast.error(
                                "This is a premium course. Payment integration coming soon!",
                              );
                            } else {
                              toast.error(message || "Failed to enroll");
                            }
                          }
                        }}
                      >
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

        {lessons === undefined ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`lesson-skel-${i}`}
                className="h-16 w-full rounded-xl"
              />
            ))}
          </div>
        ) : lessonsList.length > 0 ? (
          <div className="space-y-3">
            {lessonsList.map((lesson, index) => {
              const canAccess = isEnrolled || lesson.isPreview;

              const content = (
                <div
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                    canAccess
                      ? "cursor-pointer border-border hover:border-primary/30 hover:bg-muted/30"
                      : "border-border/50 opacity-60",
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : canAccess ? (
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

              if (canAccess) {
                return (
                  <Link
                    key={lesson._id}
                    href={`/student/learn/${courseId}/${lesson._id}`}
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={lesson._id}>{content}</div>;
            })}
          </div>
        ) : (
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

      {/* Reviews Section */}
      <div className="border-t bg-muted/30">
        <div className="container py-12">
          <h2 className="mb-6 font-bold font-display text-2xl">
            Reviews ({reviewsList.length})
          </h2>

          {/* Write Review Form — only for enrolled students */}
          {isEnrolled && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Write a Review</h3>
                <div className="mb-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} stars`}
                      className="transition-transform hover:scale-110"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(star)}
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          (hoverRating || reviewRating) >= star
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-muted-foreground text-sm">
                    {reviewRating}/5
                  </span>
                </div>
                <Textarea
                  placeholder="Share your experience with this course... (optional)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="mb-4"
                />
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="rounded-xl"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Review List */}
          {reviewsList.length > 0 ? (
            <div className="space-y-4">
              {reviewsList.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                          {(review.userName ?? "A").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">
                          {review.userName}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                    <div className="mb-2 flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={`star-${review._id}-${i}`}
                          className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No reviews yet.{" "}
              {isEnrolled
                ? "Be the first to leave one!"
                : "Enroll to leave a review."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

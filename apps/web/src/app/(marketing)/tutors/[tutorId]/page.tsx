"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "convex/react";
import { BookOpen, Star, Users } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorProfilePage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { tutorId } = use(params);
  const tutor = useQuery(api.users.getTutorProfile, {
    tutorId: tutorId as Id<"users">,
  });

  if (tutor === undefined) {
    return (
      <div className="container py-12">
        <div className="mb-8 flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (tutor === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-xl">Tutor Not Found</h2>
          <p className="mb-4 text-muted-foreground">
            This tutor profile doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-primary to-primary/80 py-16 text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 font-bold text-3xl">
              {tutor.image ? (
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                tutor.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="mb-2 font-bold font-display text-3xl">
                {tutor.name}
              </h1>
              {tutor.bio && <p className="max-w-2xl opacity-90">{tutor.bio}</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-4 text-center">
              <p className="font-bold text-2xl">{tutor.totalCourses}</p>
              <p className="text-sm opacity-80">Courses</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center">
              <p className="font-bold text-2xl">{tutor.totalStudents}</p>
              <p className="text-sm opacity-80">Students</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center">
              <p className="font-bold text-2xl">
                {tutor.avgRating > 0 ? tutor.avgRating.toFixed(1) : "—"}
              </p>
              <p className="text-sm opacity-80">Avg Rating</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center">
              <p className="font-bold text-2xl">{tutor.totalReviews}</p>
              <p className="text-sm opacity-80">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {/* Specialties */}
        {tutor.specialties.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-bold font-display text-xl">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {tutor.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        <h2 className="mb-6 font-bold font-display text-xl">
          Courses ({tutor.courses.length})
        </h2>

        {tutor.courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutor.courses.map((course) => (
              <Link key={course._id} href={`/courses/${course._id}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-0">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="aspect-video w-full rounded-t-xl object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-t-xl bg-linear-to-br from-primary/10 to-accent/10">
                        <BookOpen className="h-10 w-10 text-primary/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 font-semibold">
                        {course.title}
                      </h3>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                        <Badge variant="outline" className="capitalize text-xs">
                          {course.level}
                        </Badge>
                        <span>{course.lessonCount} lessons</span>
                        <span>{course.studentCount} students</span>
                      </div>
                      {course.rating > 0 && (
                        <div className="mb-2 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium text-sm">
                            {course.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            ({course.reviewCount})
                          </span>
                        </div>
                      )}
                      <p className="font-semibold text-primary">
                        {course.isPremium && course.priceCents
                          ? formatCurrency(course.priceCents)
                          : "Free"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No courses published yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

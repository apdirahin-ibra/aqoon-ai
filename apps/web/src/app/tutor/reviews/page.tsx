"use client";

import { formatDate } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Search, Star } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorReviewsPage() {
  const reviews = useQuery(api.reviews.tutorReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Stats
  const totalReviews = reviews?.length ?? 0;
  const avgRating =
    totalReviews > 0
      ? Math.round(
          (reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10,
        ) / 10
      : 0;

  // Star distribution
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => r.rating === star).length ?? 0,
  }));

  // Unique courses for filter
  const courseNames = reviews
    ? [...new Set(reviews.map((r) => r.courseTitle))]
    : [];

  const filtered = reviews?.filter((r) => {
    const matchesSearch =
      !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || r.rating === Number(ratingFilter);
    const matchesCourse =
      courseFilter === "all" || r.courseTitle === courseFilter;
    return matchesSearch && matchesRating && matchesCourse;
  });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-3xl">
          Student Reviews
        </h1>
        <p className="text-muted-foreground">
          See what students say about your courses
        </p>
      </div>

      {/* Rating Overview */}
      {reviews && (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Average */}
          <Card>
            <CardContent className="flex items-center gap-6 pt-6 pb-6">
              <div className="text-center">
                <p className="font-bold text-5xl tracking-tight">{avgRating}</p>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`avg-star-${i}`}
                      className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  {totalReviews} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {starCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-6 text-right text-muted-foreground text-xs">
                      {star}★
                    </span>
                    <Progress
                      value={
                        totalReviews > 0 ? (count / totalReviews) * 100 : 0
                      }
                      className="h-2 flex-1"
                    />
                    <span className="w-6 text-muted-foreground text-xs">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 pt-6 pb-6">
              <div className="text-center">
                <p className="font-bold text-2xl">{totalReviews}</p>
                <p className="text-muted-foreground text-xs">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl">{starCounts[0].count}</p>
                <p className="text-muted-foreground text-xs">5-Star Reviews</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl">{courseNames.length}</p>
                <p className="text-muted-foreground text-xs">
                  Courses Reviewed
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl">
                  {totalReviews > 0
                    ? Math.round(
                        (starCounts
                          .filter((s) => s.star >= 4)
                          .reduce((sum, s) => sum + s.count, 0) /
                          totalReviews) *
                          100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-muted-foreground text-xs">Positive (4-5★)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r} Star{r > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews === undefined ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((review) => (
            <Card key={review._id}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(review.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">
                          {review.studentName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {review.courseTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5">
                          {Array.from({
                            length: 5,
                          }).map((_, i) => (
                            <Star
                              key={`r-${review._id}-${i}`}
                              className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                          {formatDate(review._creationTime)}
                        </p>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold text-sm">No reviews yet</h3>
            <p className="mt-1 text-muted-foreground text-xs">
              Reviews will appear here when students review your courses
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

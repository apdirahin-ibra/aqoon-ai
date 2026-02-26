"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorAnalyticsPage() {
  const stats = useQuery(api.dashboard.tutorStats);
  const courses = useQuery(api.courses.listByTutor);

  const isLoading = stats === undefined || courses === undefined;

  const totalStudents =
    courses?.reduce((sum, c) => sum + c.enrollmentCount, 0) ?? 0;
  const totalRevenue =
    courses?.reduce((sum, c) => sum + (c.totalRevenueCents ?? 0), 0) ?? 0;
  const avgRating = stats?.avgRating ?? 0;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold font-display text-3xl">Analytics</h1>
        <p className="text-muted-foreground">
          Understand how your courses are performing
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`stat-skel-${i}`} className="h-20 rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Students
                    </p>
                    <p className="font-bold text-2xl">{totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Revenue
                    </p>
                    <p className="font-bold text-2xl">
                      ${(totalRevenue / 100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Avg. Rating</p>
                    <p className="font-bold text-2xl">{avgRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Courses
                    </p>
                    <p className="font-bold text-2xl">
                      {stats?.totalCourses ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Earnings by Course */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Earnings by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={`earn-skel-${i}`} className="h-10 rounded" />
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="flex h-48 items-end justify-between gap-3">
                {courses.slice(0, 6).map((course) => {
                  const maxRevenue = Math.max(
                    ...courses.map((c) => c.totalRevenueCents ?? 0),
                    1,
                  );
                  const height =
                    ((course.totalRevenueCents ?? 0) / maxRevenue) * 140;
                  return (
                    <div
                      key={course._id}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <span className="font-medium text-xs">
                        $
                        {(
                          (course.totalRevenueCents ?? 0) / 100
                        ).toLocaleString()}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-emerald-500/80 transition-all hover:bg-emerald-500"
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                      <span
                        className="max-w-[80px] truncate text-muted-foreground text-xs"
                        title={course.title}
                      >
                        {course.title.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No course data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Students by Course */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Students by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={`student-skel-${i}`}
                    className="h-10 rounded"
                  />
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => {
                  const maxStudents = Math.max(
                    ...courses.map((c) => c.enrollmentCount),
                    1,
                  );
                  return (
                    <div key={course._id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="max-w-[200px] truncate font-medium">
                          {course.title}
                        </span>
                        <span className="text-muted-foreground">
                          {course.enrollmentCount}
                        </span>
                      </div>
                      <Progress
                        value={(course.enrollmentCount / maxStudents) * 100}
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No course data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={`perf-skel-${i}`} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((course) => (
                <div key={course._id} className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">{course.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium">{course.enrollmentCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completion</p>
                      <p className="font-medium">
                        {course.completionRate ?? 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="flex items-center gap-1 font-medium">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {course.avgRating}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="flex items-center gap-1 font-medium text-green-500">
                        <TrendingUp className="h-3 w-3" />$
                        {(
                          (course.totalRevenueCents ?? 0) / 100
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground text-sm">
              No courses yet. Create your first course to see performance data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

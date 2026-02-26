"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowUpRight, Clock, CreditCard, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const barColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
];

export default function TutorEarningsPage() {
  const stats = useQuery(api.dashboard.tutorStats);
  const courses = useQuery(api.courses.listByTutor);

  const isLoading = stats === undefined || courses === undefined;

  const totalRevenueCents = stats?.totalRevenueCents ?? 0;

  // Sort courses by revenue descending for the breakdown
  const coursesByRevenue = [...(courses ?? [])].sort(
    (a, b) => (b.totalRevenueCents ?? 0) - (a.totalRevenueCents ?? 0),
  );

  const totalCourseRevenue = coursesByRevenue.reduce(
    (sum, c) => sum + (c.totalRevenueCents ?? 0),
    0,
  );

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">Earnings</h1>
          <p className="text-muted-foreground">
            Track your income and payout history
          </p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`bal-skel-${i}`} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Revenue
                    </p>
                    <p className="mt-1 font-bold text-3xl text-emerald-500">
                      ${(totalRevenueCents / 100).toLocaleString()}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">
                        {stats?.totalCourses ?? 0} courses
                      </span>
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <DollarSign className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Students
                    </p>
                    <p className="mt-1 font-bold text-3xl">
                      {stats?.totalEnrollments ?? 0}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span className="text-muted-foreground">
                        Across all courses
                      </span>
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Average Rating
                    </p>
                    <p className="mt-1 font-bold text-3xl">
                      {stats?.avgRating ?? 0}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">
                        {stats?.totalReviews ?? 0} reviews
                      </span>
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Earnings by Course */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Course</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={`earn-skel-${i}`} className="h-12 rounded" />
                ))}
              </div>
            ) : coursesByRevenue.length > 0 ? (
              <div className="space-y-4">
                {coursesByRevenue.map((course, i) => {
                  const percentage =
                    totalCourseRevenue > 0
                      ? Math.round(
                          ((course.totalRevenueCents ?? 0) /
                            totalCourseRevenue) *
                            100,
                        )
                      : 0;
                  return (
                    <div key={course._id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="max-w-[220px] truncate font-medium">
                          {course.title}
                        </span>
                        <span className="font-semibold">
                          $
                          {(
                            (course.totalRevenueCents ?? 0) / 100
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {course.enrollmentCount} students · {percentage}% of
                        total
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No earnings data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Course Revenue Table */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={`table-skel-${i}`} className="h-10 rounded" />
                ))}
              </div>
            ) : coursesByRevenue.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursesByRevenue.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="max-w-[180px] truncate font-medium text-sm">
                        {course.title}
                      </TableCell>
                      <TableCell className="text-sm">
                        {course.enrollmentCount}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className="text-green-500">
                          $
                          {(
                            (course.totalRevenueCents ?? 0) / 100
                          ).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No revenue data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

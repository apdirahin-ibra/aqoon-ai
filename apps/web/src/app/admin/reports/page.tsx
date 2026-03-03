"use client";

import { formatCurrency } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BookOpen,
  DollarSign,
  Download,
  FileText,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export default function AdminReportsPage() {
  const stats = useQuery(api.dashboard.adminStats);
  const analytics = useQuery(api.dashboard.adminAnalytics);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-3xl">
          Platform Reports
        </h1>
        <p className="text-muted-foreground">
          Summary reports and insights across the platform
        </p>
      </div>

      {/* Revenue Report */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats === undefined ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                <p className="font-bold text-2xl text-emerald-600">
                  {formatCurrency(stats.totalRevenueCents)}
                </p>
                <p className="text-muted-foreground text-xs">Total Revenue</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-4 text-center">
                <p className="font-bold text-2xl text-blue-600">
                  {stats.totalPayments}
                </p>
                <p className="text-muted-foreground text-xs">
                  Total Transactions
                </p>
              </div>
              <div className="rounded-xl bg-purple-500/10 p-4 text-center">
                <p className="font-bold text-2xl text-purple-600">
                  {stats.totalPayments > 0
                    ? formatCurrency(
                        Math.round(
                          stats.totalRevenueCents / stats.totalPayments,
                        ),
                      )
                    : "$0.00"}
                </p>
                <p className="text-muted-foreground text-xs">Avg Transaction</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats === undefined ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Users</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalUsers}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Students</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalStudents}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tutors</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalTutors}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Admins</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalAdmins}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Student-to-Tutor Ratio</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalTutors > 0
                        ? `${Math.round(stats.totalStudents / stats.totalTutors)}:1`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Course Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats === undefined ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Courses</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalCourses}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Published</TableCell>
                    <TableCell className="text-right font-medium">
                      <Badge variant="default">{stats.publishedCourses}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Draft</TableCell>
                    <TableCell className="text-right font-medium">
                      <Badge variant="secondary">
                        {stats.totalCourses - stats.publishedCourses}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Enrollments</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalEnrollments}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Avg Enrollments/Course</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats.totalCourses > 0
                        ? Math.round(
                            stats.totalEnrollments / stats.totalCourses,
                          )
                        : 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Courses Table */}
        {analytics && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Course Performance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCourses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead className="text-right">Enrollments</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.topCourses.map((course, i) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {course.tutorName}
                        </TableCell>
                        <TableCell className="text-right">
                          {course.enrollments}
                        </TableCell>
                        <TableCell className="text-right">
                          {course.avgRating > 0 ? (
                            <div className="flex items-center justify-end gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {course.avgRating.toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-muted-foreground text-sm">
                  No course data available yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {analytics === undefined && (
        <div className="mt-6">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      )}
    </div>
  );
}

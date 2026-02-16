"use client";

import {
  BarChart3,
  BookOpen,
  DollarSign,
  Eye,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const courseMetrics = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    students: 245,
    completionRate: 78,
    avgRating: 4.9,
    revenue: 4200,
    views: 1850,
    enrollmentTrend: "+12%",
  },
  {
    id: "2",
    title: "Web Development with React",
    students: 189,
    completionRate: 65,
    avgRating: 4.7,
    revenue: 3600,
    views: 1420,
    enrollmentTrend: "+8%",
  },
  {
    id: "3",
    title: "Advanced JavaScript Patterns",
    students: 92,
    completionRate: 42,
    avgRating: 4.8,
    revenue: 2100,
    views: 980,
    enrollmentTrend: "+15%",
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    students: 156,
    completionRate: 58,
    avgRating: 4.6,
    revenue: 2880,
    views: 1200,
    enrollmentTrend: "+5%",
  },
];

const monthlyEarnings = [
  { month: "Sep", amount: 1200 },
  { month: "Oct", amount: 1800 },
  { month: "Nov", amount: 1500 },
  { month: "Dec", amount: 2100 },
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 2700 },
];

const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount));

export default function TutorAnalyticsPage() {
  const totalStudents = courseMetrics.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = courseMetrics.reduce((sum, c) => sum + c.revenue, 0);
  const avgRating = (
    courseMetrics.reduce((sum, c) => sum + c.avgRating, 0) /
    courseMetrics.length
  ).toFixed(1);
  const totalViews = courseMetrics.reduce((sum, c) => sum + c.views, 0);

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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
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
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="font-bold text-2xl">
                  ${totalRevenue.toLocaleString()}
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
                <Eye className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Views</p>
                <p className="font-bold text-2xl">
                  {totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-3">
              {monthlyEarnings.map((m) => (
                <div
                  key={m.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="font-medium text-xs">${m.amount}</span>
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80 transition-all hover:bg-emerald-500"
                    style={{
                      height: `${(m.amount / maxEarning) * 140}px`,
                    }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {m.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment by Course */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Students by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseMetrics.map((course) => (
                <div key={course.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="max-w-[200px] truncate font-medium">
                      {course.title}
                    </span>
                    <span className="text-muted-foreground">
                      {course.students}
                    </span>
                  </div>
                  <Progress
                    value={
                      (course.students /
                        Math.max(...courseMetrics.map((c) => c.students))) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {courseMetrics.map((course) => (
              <div key={course.id} className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">{course.title}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-medium">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completion</p>
                    <p className="font-medium">{course.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="flex items-center gap-1 font-medium">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {course.avgRating}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <p className="flex items-center gap-1 font-medium text-green-500">
                      <TrendingUp className="h-3 w-3" />
                      {course.enrollmentTrend}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
    BarChart3,
    BookOpen,
    Loader2,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CourseAnalytic {
    id: string;
    title: string;
    enrollments: number;
    completionRate: number;
    avgRating: number;
    revenue: number;
}

const mockAnalytics: CourseAnalytic[] = [
    {
        id: "1",
        title: "Introduction to Python Programming",
        enrollments: 145,
        completionRate: 72,
        avgRating: 4.8,
        revenue: 0,
    },
    {
        id: "2",
        title: "Advanced Web Development with React",
        enrollments: 89,
        completionRate: 58,
        avgRating: 4.6,
        revenue: 7110,
    },
    {
        id: "3",
        title: "Data Science Fundamentals",
        enrollments: 0,
        completionRate: 0,
        avgRating: 0,
        revenue: 0,
    },
];

const weeklyData = [
    { day: "Mon", enrollments: 5 },
    { day: "Tue", enrollments: 8 },
    { day: "Wed", enrollments: 3 },
    { day: "Thu", enrollments: 12 },
    { day: "Fri", enrollments: 7 },
    { day: "Sat", enrollments: 15 },
    { day: "Sun", enrollments: 10 },
];

export default function TutorAnalyticsPage() {
    const [analytics] = useState<CourseAnalytic[]>(mockAnalytics);
    const [loading] = useState(false);

    const totalEnrollments = analytics.reduce((s, c) => s + c.enrollments, 0);
    const avgCompletion =
        analytics.filter((c) => c.enrollments > 0).length > 0
            ? Math.round(
                analytics
                    .filter((c) => c.enrollments > 0)
                    .reduce((s, c) => s + c.completionRate, 0) /
                analytics.filter((c) => c.enrollments > 0).length,
            )
            : 0;
    const totalRevenue = analytics.reduce((s, c) => s + c.revenue, 0);
    const maxEnrollments = Math.max(...weeklyData.map((d) => d.enrollments));

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="mb-2 font-bold font-display text-3xl">Analytics</h1>
                <p className="text-muted-foreground">
                    Track your course performance and student engagement
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-10 grid gap-6 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{totalEnrollments}</p>
                                <p className="text-muted-foreground text-sm">
                                    Total Enrollments
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{avgCompletion}%</p>
                                <p className="text-muted-foreground text-sm">
                                    Avg Completion Rate
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                                <BarChart3 className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    {analytics.filter((c) => c.enrollments > 0).length}
                                </p>
                                <p className="text-muted-foreground text-sm">Active Courses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    ${(totalRevenue / 100).toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Enrollments - Simple bar chart */}
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Weekly Enrollments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[200px] items-end gap-4">
                        {weeklyData.map((d) => (
                            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                                <span className="font-medium text-muted-foreground text-xs">
                                    {d.enrollments}
                                </span>
                                <div
                                    className="w-full rounded-t-md bg-primary/80 transition-all"
                                    style={{
                                        height: `${(d.enrollments / maxEnrollments) * 100}%`,
                                        minHeight: "4px",
                                    }}
                                />
                                <span className="text-muted-foreground text-xs">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Course Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.map((course) => (
                            <div
                                key={course.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex-1">
                                    <h3 className="mb-1 font-semibold">{course.title}</h3>
                                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                        <span>{course.enrollments} students</span>
                                        <span>{course.completionRate}% completion</span>
                                        {course.avgRating > 0 && (
                                            <span>⭐ {course.avgRating}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    {course.revenue > 0 ? (
                                        <p className="font-bold text-green-600">
                                            ${(course.revenue / 100).toLocaleString()}
                                        </p>
                                    ) : (
                                        <Badge variant="secondary">Free</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

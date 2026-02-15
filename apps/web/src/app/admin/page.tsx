"use client";

import {
    BookOpen,
    DollarSign,
    GraduationCap,
    Loader2,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Stats {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
}

const weeklyData = [
    { day: "Mon", enrollments: 12 },
    { day: "Tue", enrollments: 19 },
    { day: "Wed", enrollments: 15 },
    { day: "Thu", enrollments: 22 },
    { day: "Fri", enrollments: 18 },
    { day: "Sat", enrollments: 25 },
    { day: "Sun", enrollments: 20 },
];

export default function AdminDashboardPage() {
    const [stats] = useState<Stats>({
        totalUsers: 1248,
        totalCourses: 45,
        totalEnrollments: 3892,
        totalRevenue: 12750000,
    });
    const [loading] = useState(false);

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
                <h1 className="mb-2 font-bold font-display text-3xl">
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Platform overview and analytics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-10 grid gap-6 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    {stats.totalUsers.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">Total Users</p>
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
                                <p className="font-bold text-2xl">{stats.totalCourses}</p>
                                <p className="text-muted-foreground text-sm">Courses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                                <GraduationCap className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    {stats.totalEnrollments.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">Enrollments</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                                <DollarSign className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">
                                    ${(stats.totalRevenue / 100).toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-sm">Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Enrollments Chart */}
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Weekly Enrollments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[250px] items-end gap-4">
                        {weeklyData.map((d) => (
                            <div
                                key={d.day}
                                className="flex flex-1 flex-col items-center gap-2"
                            >
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

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-muted-foreground">
                            Manage user accounts, roles, and permissions
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">
                                    {Math.round(stats.totalUsers * 0.7)} active
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-muted-foreground">
                                    {Math.round(stats.totalUsers * 0.3)} inactive
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Course Moderation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-muted-foreground">
                            Review and approve course submissions
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">
                                    {Math.round(stats.totalCourses * 0.8)} published
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-muted-foreground">
                                    {Math.round(stats.totalCourses * 0.2)} pending review
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

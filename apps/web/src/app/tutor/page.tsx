"use client";

import {
    BookOpen,
    Edit,
    Eye,
    Loader2,
    Plus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Course {
    id: string;
    title: string;
    category: string;
    isPublished: boolean;
    isPremium: boolean;
    createdAt: string;
    enrollmentsCount: number;
}

const mockCourses: Course[] = [
    {
        id: "1",
        title: "Introduction to Python Programming",
        category: "coding",
        isPublished: true,
        isPremium: false,
        createdAt: "2024-01-10",
        enrollmentsCount: 145,
    },
    {
        id: "2",
        title: "Advanced Web Development with React",
        category: "coding",
        isPublished: true,
        isPremium: true,
        createdAt: "2024-01-20",
        enrollmentsCount: 89,
    },
    {
        id: "3",
        title: "Data Science Fundamentals",
        category: "coding",
        isPublished: false,
        isPremium: true,
        createdAt: "2024-02-01",
        enrollmentsCount: 0,
    },
];

export default function TutorDashboardPage() {
    const [courses] = useState<Course[]>(mockCourses);
    const [loading] = useState(false);

    const stats = {
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.isPublished).length,
        totalStudents: courses.reduce((sum, c) => sum + c.enrollmentsCount, 0),
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-2 font-bold font-display text-3xl">
                        Tutor Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your courses and track student progress
                    </p>
                </div>
                <Button asChild>
                    <Link href="/tutor/courses/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="mb-10 grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{stats.totalCourses}</p>
                                <p className="text-muted-foreground text-sm">Total Courses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                                <Eye className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{stats.publishedCourses}</p>
                                <p className="text-muted-foreground text-sm">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-bold text-2xl">{stats.totalStudents}</p>
                                <p className="text-muted-foreground text-sm">Total Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Courses List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    {courses.length > 0 ? (
                        <div className="space-y-4">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
                                >
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="font-semibold">{course.title}</h3>
                                            {course.isPublished ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-green-500/10 text-green-600"
                                                >
                                                    Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                            {course.isPremium && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-500/10 text-amber-600"
                                                >
                                                    Premium
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {course.enrollmentsCount} students enrolled
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/tutor/courses/${course.id}`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/courses/${course.id}`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">No courses yet</h3>
                            <p className="mb-4 text-muted-foreground">
                                Create your first course to start teaching
                            </p>
                            <Button asChild>
                                <Link href="/tutor/courses/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Course
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

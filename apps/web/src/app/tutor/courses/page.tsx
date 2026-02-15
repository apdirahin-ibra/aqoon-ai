"use client";

import {
    BookOpen,
    Edit,
    Eye,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Course {
    id: string;
    title: string;
    description: string | null;
    category: string;
    level: string;
    isPublished: boolean;
    isPremium: boolean;
    priceCents: number;
    createdAt: string;
    enrollmentsCount: number;
    lessonsCount: number;
}

const mockCourses: Course[] = [
    {
        id: "1",
        title: "Introduction to Python Programming",
        description: "Learn Python from scratch with hands-on exercises",
        category: "coding",
        level: "beginner",
        isPublished: true,
        isPremium: false,
        priceCents: 0,
        createdAt: "2024-01-10",
        enrollmentsCount: 145,
        lessonsCount: 20,
    },
    {
        id: "2",
        title: "Advanced Web Development with React",
        description: "Build modern web applications with React and TypeScript",
        category: "coding",
        level: "intermediate",
        isPublished: true,
        isPremium: true,
        priceCents: 7999,
        createdAt: "2024-01-20",
        enrollmentsCount: 89,
        lessonsCount: 25,
    },
    {
        id: "3",
        title: "Data Science Fundamentals",
        description: "Master the basics of data analysis and visualization",
        category: "coding",
        level: "beginner",
        isPublished: false,
        isPremium: true,
        priceCents: 5999,
        createdAt: "2024-02-01",
        enrollmentsCount: 0,
        lessonsCount: 8,
    },
    {
        id: "4",
        title: "UI/UX Design Principles",
        description: "Learn design thinking and create beautiful interfaces",
        category: "art",
        level: "beginner",
        isPublished: true,
        isPremium: false,
        priceCents: 0,
        createdAt: "2024-02-10",
        enrollmentsCount: 62,
        lessonsCount: 15,
    },
];

export default function TutorCoursesPage() {
    const [courses] = useState<Course[]>(mockCourses);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "published" && course.isPublished) ||
            (statusFilter === "draft" && !course.isPublished);
        return matchesSearch && matchesStatus;
    });

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(cents / 100);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

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
                    <h1 className="mb-2 font-bold font-display text-3xl">My Courses</h1>
                    <p className="text-muted-foreground">
                        Manage and organize all your courses
                    </p>
                </div>
                <Button asChild>
                    <Link href="/tutor/courses/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="overflow-hidden transition-shadow hover:shadow-lg"
                        >
                            <div className="relative flex aspect-video items-center justify-center bg-muted">
                                <BookOpen className="h-12 w-12 text-muted-foreground" />
                                <div className="absolute top-2 right-2 flex gap-1.5">
                                    {course.isPublished ? (
                                        <Badge className="bg-green-500/10 text-green-600">
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Draft</Badge>
                                    )}
                                    {course.isPremium && (
                                        <Badge className="bg-amber-500/10 text-amber-600">
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="line-clamp-1 text-lg">
                                    {course.title}
                                </CardTitle>
                                <p className="line-clamp-2 text-muted-foreground text-sm">
                                    {course.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center gap-4 text-muted-foreground text-sm">
                                    <span>{course.lessonsCount} lessons</span>
                                    <span>{course.enrollmentsCount} students</span>
                                    {course.isPremium && (
                                        <span className="font-medium text-foreground">
                                            {formatPrice(course.priceCents)}
                                        </span>
                                    )}
                                </div>
                                <div className="mb-3 text-muted-foreground text-xs">
                                    Created {formatDate(course.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href={`/tutor/courses/${course.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={`/courses/${course.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 font-semibold text-lg">No courses found</h3>
                        <p className="mb-4 text-muted-foreground">
                            {search
                                ? "Try adjusting your search or filters"
                                : "Create your first course to start teaching"}
                        </p>
                        <Button asChild>
                            <Link href="/tutor/courses/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Course
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

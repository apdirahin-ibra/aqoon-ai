"use client";

import {
    BookOpen,
    Eye,
    EyeOff,
    Loader2,
    MoreHorizontal,
    Search,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AdminCourse {
    id: string;
    title: string;
    tutorName: string;
    category: string;
    level: string;
    isPublished: boolean;
    isPremium: boolean;
    priceCents: number;
    enrollmentsCount: number;
    createdAt: string;
}

const mockCourses: AdminCourse[] = [
    {
        id: "1",
        title: "Introduction to Python Programming",
        tutorName: "Sarah Johnson",
        category: "coding",
        level: "beginner",
        isPublished: true,
        isPremium: false,
        priceCents: 0,
        enrollmentsCount: 145,
        createdAt: "2024-01-10",
    },
    {
        id: "2",
        title: "Advanced Web Development with React",
        tutorName: "Sarah Johnson",
        category: "coding",
        level: "intermediate",
        isPublished: true,
        isPremium: true,
        priceCents: 7999,
        enrollmentsCount: 89,
        createdAt: "2024-01-20",
    },
    {
        id: "3",
        title: "Data Science Fundamentals",
        tutorName: "Michael Chen",
        category: "coding",
        level: "beginner",
        isPublished: false,
        isPremium: true,
        priceCents: 5999,
        enrollmentsCount: 0,
        createdAt: "2024-02-01",
    },
    {
        id: "4",
        title: "UI/UX Design Principles",
        tutorName: "Michael Chen",
        category: "art",
        level: "beginner",
        isPublished: true,
        isPremium: false,
        priceCents: 0,
        enrollmentsCount: 62,
        createdAt: "2024-02-10",
    },
    {
        id: "5",
        title: "Business English Masterclass",
        tutorName: "Emily Rodriguez",
        category: "languages",
        level: "intermediate",
        isPublished: true,
        isPremium: true,
        priceCents: 4999,
        enrollmentsCount: 37,
        createdAt: "2024-02-15",
    },
];

export default function AdminCoursesPage() {
    const [courses] = useState<AdminCourse[]>(mockCourses);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.tutorName.toLowerCase().includes(search.toLowerCase());
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
            <div className="mb-8">
                <h1 className="mb-2 font-bold font-display text-3xl">
                    Course Management
                </h1>
                <p className="text-muted-foreground">
                    Review, approve, and manage all platform courses
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or tutor..."
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

            {/* Courses Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Tutor
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Students
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 font-medium text-muted-foreground text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {course.category}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {course.level}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{course.tutorName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {course.isPublished ? (
                                                    <Badge className="bg-green-500/10 text-green-600">
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        Published
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <EyeOff className="mr-1 h-3 w-3" />
                                                        Draft
                                                    </Badge>
                                                )}
                                                {course.isPremium && (
                                                    <Badge className="bg-amber-500/10 text-amber-600">
                                                        Premium
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {course.isPremium
                                                ? formatPrice(course.priceCents)
                                                : "Free"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {course.enrollmentsCount}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">
                                            {formatDate(course.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">No courses found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

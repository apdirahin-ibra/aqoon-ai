"use client";

import {
    ArrowLeft,
    GripVertical,
    Loader2,
    Plus,
    Save,
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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Lesson {
    id: string;
    title: string;
    content: string;
    durationMinutes: number;
    isPreview: boolean;
    orderIndex: number;
}

interface CourseData {
    title: string;
    description: string;
    category: string;
    level: string;
    isPremium: boolean;
    isPublished: boolean;
    priceCents: number;
    thumbnailUrl: string;
}

const mockLessons: Lesson[] = [
    {
        id: "l1",
        title: "Getting Started with Python",
        content: "In this lesson, we will set up Python and write our first program...",
        durationMinutes: 20,
        isPreview: true,
        orderIndex: 0,
    },
    {
        id: "l2",
        title: "Variables and Data Types",
        content: "Learn about strings, numbers, booleans and how to work with them...",
        durationMinutes: 25,
        isPreview: false,
        orderIndex: 1,
    },
    {
        id: "l3",
        title: "Control Flow: If Statements and Loops",
        content: "Master conditional logic and iteration in Python...",
        durationMinutes: 30,
        isPreview: false,
        orderIndex: 2,
    },
];

export default function EditCoursePage() {
    const [saving, setSaving] = useState(false);
    const [courseData, setCourseData] = useState<CourseData>({
        title: "Introduction to Python Programming",
        description:
            "Learn Python from scratch with hands-on exercises and real-world projects. This course covers everything from basic syntax to advanced concepts.",
        category: "coding",
        level: "beginner",
        isPremium: false,
        isPublished: true,
        priceCents: 0,
        thumbnailUrl: "",
    });
    const [lessons, setLessons] = useState<Lesson[]>(mockLessons);

    const addLesson = () => {
        const newLesson: Lesson = {
            id: `temp-${Date.now()}`,
            title: "",
            content: "",
            durationMinutes: 15,
            isPreview: false,
            orderIndex: lessons.length,
        };
        setLessons([...lessons, newLesson]);
    };

    const updateLesson = (index: number, updates: Partial<Lesson>) => {
        setLessons(lessons.map((l, i) => (i === index ? { ...l, ...updates } : l)));
    };

    const removeLesson = (index: number) => {
        setLessons(
            lessons
                .filter((_, i) => i !== index)
                .map((l, i) => ({ ...l, orderIndex: i })),
        );
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);
    };

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(cents / 100);

    return (
        <div className="container py-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/tutor">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="mb-1 font-bold font-display text-3xl">
                            Edit Course
                        </h1>
                        <p className="text-muted-foreground">
                            Update your course details and lessons
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={courseData.isPublished ? "default" : "secondary"}>
                        {courseData.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                    id="title"
                                    value={courseData.title}
                                    onChange={(e) =>
                                        setCourseData({ ...courseData, title: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={5}
                                    value={courseData.description}
                                    onChange={(e) =>
                                        setCourseData({ ...courseData, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={courseData.category}
                                        onValueChange={(v) =>
                                            setCourseData({ ...courseData, category: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="coding">Coding</SelectItem>
                                            <SelectItem value="languages">Languages</SelectItem>
                                            <SelectItem value="art">Art & Design</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="music">Music</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <Select
                                        value={courseData.level}
                                        onValueChange={(v) =>
                                            setCourseData({ ...courseData, level: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Lessons ({lessons.length})</CardTitle>
                            <Button onClick={addLesson} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Lesson
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {lessons.length > 0 ? (
                                <div className="space-y-4">
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="mb-3 flex items-center gap-3">
                                                <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                                                <span className="font-medium text-muted-foreground text-sm">
                                                    Lesson {index + 1}
                                                </span>
                                                <div className="flex-1" />
                                                <div className="flex items-center gap-2">
                                                    <Label
                                                        htmlFor={`preview-${index}`}
                                                        className="text-xs"
                                                    >
                                                        Preview
                                                    </Label>
                                                    <Switch
                                                        id={`preview-${index}`}
                                                        checked={lesson.isPreview}
                                                        onCheckedChange={(v) =>
                                                            updateLesson(index, { isPreview: v })
                                                        }
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeLesson(index)}
                                                    className="h-8 w-8 text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="Lesson title"
                                                    value={lesson.title}
                                                    onChange={(e) =>
                                                        updateLesson(index, { title: e.target.value })
                                                    }
                                                />
                                                <Textarea
                                                    placeholder="Lesson content (supports Markdown)"
                                                    rows={3}
                                                    value={lesson.content}
                                                    onChange={(e) =>
                                                        updateLesson(index, { content: e.target.value })
                                                    }
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs">Duration (min)</Label>
                                                    <Input
                                                        type="number"
                                                        className="w-24"
                                                        min={1}
                                                        value={lesson.durationMinutes}
                                                        onChange={(e) =>
                                                            updateLesson(index, {
                                                                durationMinutes:
                                                                    parseInt(e.target.value) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p className="mb-2">No lessons yet</p>
                                    <Button onClick={addLesson} variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Lesson
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="published">Published</Label>
                                <Switch
                                    id="published"
                                    checked={courseData.isPublished}
                                    onCheckedChange={(v) =>
                                        setCourseData({ ...courseData, isPublished: v })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="premium">Premium Course</Label>
                                <Switch
                                    id="premium"
                                    checked={courseData.isPremium}
                                    onCheckedChange={(v) =>
                                        setCourseData({ ...courseData, isPremium: v })
                                    }
                                />
                            </div>

                            {courseData.isPremium && (
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={courseData.priceCents / 100}
                                        onChange={(e) =>
                                            setCourseData({
                                                ...courseData,
                                                priceCents: Math.round(
                                                    parseFloat(e.target.value || "0") * 100,
                                                ),
                                            })
                                        }
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        Current price: {formatPrice(courseData.priceCents)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                <Input
                                    id="thumbnail"
                                    placeholder="https://example.com/image.jpg"
                                    value={courseData.thumbnailUrl}
                                    onChange={(e) =>
                                        setCourseData({
                                            ...courseData,
                                            thumbnailUrl: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            {courseData.thumbnailUrl && (
                                <div className="overflow-hidden rounded-lg border">
                                    <img
                                        src={courseData.thumbnailUrl}
                                        alt="Course thumbnail"
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

"use client";

import { formatCurrency } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import {
  ArrowLeft,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface LocalLesson {
  /** DB id or temp-* for new lessons */
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
  isPreview: boolean;
  orderIndex: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;

  const course = useQuery(api.courses.get, { courseId });
  const dbLessons = useQuery(api.lessons.listByCourse, { courseId });

  const updateCourse = useMutation(api.courses.update);
  const publishCourse = useMutation(api.courses.publish);
  const unpublishCourse = useMutation(api.courses.unpublish);
  const createLesson = useMutation(api.lessons.create);
  const updateLesson = useMutation(api.lessons.update);
  const removeLesson = useMutation(api.lessons.remove);

  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Local state for editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("coding");
  const [level, setLevel] = useState("beginner");
  const [isPremium, setIsPremium] = useState(false);
  const [priceCents, setPriceCents] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [lessons, setLessons] = useState<LocalLesson[]>([]);

  // Initialize from DB data once
  useEffect(() => {
    if (course && dbLessons && !initialized) {
      setTitle(course.title);
      setDescription(course.description ?? "");
      setCategory(course.category);
      setLevel(course.level);
      setIsPremium(course.isPremium ?? false);
      setPriceCents(course.priceCents ?? 0);
      setThumbnailUrl(course.thumbnailUrl ?? "");
      setLessons(
        dbLessons.map((l) => ({
          id: l._id,
          title: l.title,
          content: "", // content not returned by listByCourse
          durationMinutes: l.durationMinutes ?? 15,
          isPreview: l.isPreview ?? false,
          orderIndex: l.orderIndex,
        })),
      );
      setInitialized(true);
    }
  }, [course, dbLessons, initialized]);

  const handleAddLesson = () => {
    const newLesson: LocalLesson = {
      id: `temp-${Date.now()}`,
      title: "",
      content: "",
      durationMinutes: 15,
      isPreview: false,
      orderIndex: lessons.filter((l) => !l.isDeleted).length,
      isNew: true,
    };
    setLessons([...lessons, newLesson]);
  };

  const handleUpdateLesson = (index: number, updates: Partial<LocalLesson>) => {
    setLessons(lessons.map((l, i) => (i === index ? { ...l, ...updates } : l)));
  };

  const handleRemoveLesson = (index: number) => {
    const lesson = lessons[index];
    if (lesson.isNew) {
      // New lesson — just remove from state
      const updated = lessons
        .filter((_, i) => i !== index)
        .map((l, i) => ({ ...l, orderIndex: i }));
      setLessons(updated);
    } else {
      // Existing lesson — mark for deletion
      setLessons(
        lessons.map((l, i) => (i === index ? { ...l, isDeleted: true } : l)),
      );
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Course title is required");
      return;
    }
    setSaving(true);
    try {
      // 1. Update course metadata
      await updateCourse({
        courseId,
        title,
        description: description || undefined,
        category,
        level,
        isPremium,
        priceCents: isPremium ? priceCents : undefined,
        thumbnailUrl: thumbnailUrl || undefined,
      });

      // 2. Process lessons
      const activeLessons = lessons.filter((l) => !l.isDeleted);

      for (const lesson of lessons) {
        if (lesson.isDeleted && !lesson.isNew) {
          // Delete existing lessons
          await removeLesson({
            lessonId: lesson.id as Id<"lessons">,
          });
        } else if (lesson.isNew && !lesson.isDeleted) {
          // Create new lessons
          if (lesson.title.trim()) {
            await createLesson({
              courseId,
              title: lesson.title,
              content: lesson.content || "",
              orderIndex: lesson.orderIndex,
              durationMinutes: lesson.durationMinutes || undefined,
              isPreview: lesson.isPreview,
            });
          }
        } else if (!lesson.isNew && !lesson.isDeleted) {
          // Update existing lessons
          await updateLesson({
            lessonId: lesson.id as Id<"lessons">,
            title: lesson.title,
            orderIndex: lesson.orderIndex,
            durationMinutes: lesson.durationMinutes || undefined,
            isPreview: lesson.isPreview,
          });
        }
      }

      toast.success("Course saved successfully!");
      // Re-initialize to get fresh data
      setInitialized(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save course",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (course?.isPublished) {
        await unpublishCourse({ courseId });
        toast.success("Course unpublished");
      } else {
        await publishCourse({ courseId });
        toast.success("Course published!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    }
  };

  // Loading state
  if (course === undefined || dbLessons === undefined) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-8 h-4 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  const activeLessons = lessons.filter((l) => !l.isDeleted);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/tutor/courses">
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
          <Button variant="outline" size="sm" onClick={handleTogglePublish}>
            {course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Badge variant={course.isPublished ? "default" : "secondary"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Course
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
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
                  placeholder="e.g., Introduction to Python Programming"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
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
                  <Select value={level} onValueChange={setLevel}>
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

          {/* Lessons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lessons ({activeLessons.length})</CardTitle>
              <Button onClick={handleAddLesson} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </CardHeader>
            <CardContent>
              {activeLessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map(
                    (lesson, index) =>
                      !lesson.isDeleted && (
                        <div
                          key={lesson.id}
                          className="rounded-lg border border-border p-4"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                            <span className="font-medium text-muted-foreground text-sm">
                              Lesson {lesson.orderIndex + 1}
                              {lesson.isNew && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  New
                                </Badge>
                              )}
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
                                  handleUpdateLesson(index, {
                                    isPreview: v,
                                  })
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleRemoveLesson(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <Input
                              placeholder="Lesson title"
                              value={lesson.title}
                              onChange={(e) =>
                                handleUpdateLesson(index, {
                                  title: e.target.value,
                                })
                              }
                            />
                            {lesson.isNew && (
                              <Textarea
                                placeholder="Lesson content..."
                                rows={3}
                                value={lesson.content}
                                onChange={(e) =>
                                  handleUpdateLesson(index, {
                                    content: e.target.value,
                                  })
                                }
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Duration (min)</Label>
                              <Input
                                type="number"
                                className="w-24"
                                value={lesson.durationMinutes}
                                onChange={(e) =>
                                  handleUpdateLesson(index, {
                                    durationMinutes:
                                      Number(e.target.value) || 15,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  <Plus className="mx-auto mb-3 h-10 w-10" />
                  <p className="font-medium">No lessons yet</p>
                  <p className="mt-1 text-sm">
                    Add your first lesson to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Premium Course</Label>
                <Switch checked={isPremium} onCheckedChange={setIsPremium} />
              </div>
              {isPremium && (
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={priceCents / 100}
                    onChange={(e) =>
                      setPriceCents(Math.round(Number(e.target.value) * 100))
                    }
                    min={0}
                    step={0.01}
                  />
                  <p className="text-muted-foreground text-xs">
                    {formatCurrency(priceCents)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lessons</span>
                <span className="font-medium">{activeLessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium capitalize">{level}</span>
              </div>
              {isPremium && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    {formatCurrency(priceCents)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { GripVertical, ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration: string;
}

const initialLessons: Lesson[] = [
  {
    id: "1",
    title: "Welcome & Course Overview",
    type: "video",
    duration: "5 min",
  },
  {
    id: "2",
    title: "Getting Started with the Environment",
    type: "video",
    duration: "12 min",
  },
  {
    id: "3",
    title: "Core Concepts & Fundamentals",
    type: "text",
    duration: "8 min read",
  },
  {
    id: "4",
    title: "Chapter 1 Quiz",
    type: "quiz",
    duration: "10 questions",
  },
];

export default function CourseEditorPage() {
  const [title, setTitle] = useState("Introduction to Python Programming");
  const [description, setDescription] = useState(
    "Learn Python programming from scratch. This course covers fundamentals, data structures, functions, OOP, and practical projects.",
  );
  const [category, setCategory] = useState("coding");
  const [level, setLevel] = useState("beginner");
  const [price, setPrice] = useState("29.99");
  const [isPublished, setIsPublished] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "New Lesson",
      type: "video",
      duration: "0 min",
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const removeLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLesson = (id: string, field: keyof Lesson, value: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const lessonTypeColors: Record<string, string> = {
    video: "bg-blue-500/10 text-blue-500",
    text: "bg-green-500/10 text-green-500",
    quiz: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">
            Course Editor
          </h1>
          <p className="text-muted-foreground">
            Create or edit your course content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Preview</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="inline-flex h-auto w-auto rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="details"
            className="rounded-lg px-6 py-2.5 text-base"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="rounded-lg px-4 py-2 text-base"
          >
            Lessons
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-lg px-4 py-2 text-sm"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter course title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your course..."
                  rows={5}
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
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
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

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground text-sm">
                      Click to upload thumbnail
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lessons ({lessons.length})</CardTitle>
                <Button onClick={addLesson} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-xs">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <Input
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(lesson.id, "title", e.target.value)
                        }
                        className="border-0 p-0 font-medium shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Badge className={lessonTypeColors[lesson.type] || ""}>
                      {lesson.type}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {lesson.duration}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive"
                      onClick={() => removeLesson(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No lessons yet. Click &quot;Add Lesson&quot; to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <p className="text-muted-foreground text-xs">
                  Set to 0 for a free course
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Publish Course</Label>
                  <p className="text-muted-foreground text-sm">
                    Make this course visible to students
                  </p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Discussions</Label>
                  <p className="text-muted-foreground text-sm">
                    Allow students to discuss in the course forum
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Certificate on Completion</Label>
                  <p className="text-muted-foreground text-sm">
                    Issue certificates when students complete the course
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

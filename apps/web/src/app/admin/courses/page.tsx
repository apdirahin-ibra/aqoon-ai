"use client";

import {
  BookOpen,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
  tutor: string;
  category: string;
  level: string;
  students: number;
  isPublished: boolean;
  createdAt: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    tutor: "Ahmed Hassan",
    category: "coding",
    level: "beginner",
    students: 245,
    isPublished: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Web Development with React",
    tutor: "Sara Ali",
    category: "coding",
    level: "intermediate",
    students: 189,
    isPublished: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Advanced JavaScript Patterns",
    tutor: "Mohamed Yusuf",
    category: "coding",
    level: "advanced",
    students: 92,
    isPublished: false,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    title: "Spanish for Beginners",
    tutor: "Fatima Omar",
    category: "languages",
    level: "beginner",
    students: 310,
    isPublished: true,
    createdAt: "2024-01-10",
  },
  {
    id: "5",
    title: "Digital Art & Illustration",
    tutor: "Ibrahim Nur",
    category: "art",
    level: "beginner",
    students: 156,
    isPublished: true,
    createdAt: "2024-02-05",
  },
  {
    id: "6",
    title: "Business Strategy Fundamentals",
    tutor: "Khadija Abdi",
    category: "business",
    level: "intermediate",
    students: 78,
    isPublished: false,
    createdAt: "2024-02-10",
  },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const togglePublish = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, isPublished: !c.isPublished } : c,
      ),
    );
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">
            Manage Courses
          </h1>
          <p className="text-muted-foreground">
            {courses.length} courses total
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="languages">Languages</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.tutor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{course.level}</TableCell>
                  <TableCell className="text-right">
                    {course.students}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => togglePublish(course.id)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

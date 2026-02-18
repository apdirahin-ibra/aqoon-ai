"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Web Development", label: "Web Development" },
  { value: "Data Science", label: "Data Science" },
  { value: "Backend Development", label: "Backend Development" },
];

const levels = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const courses = useQuery(api.courses.listPublic, {
    category: category === "all" ? undefined : category,
    level: level === "all" ? undefined : level,
    search: searchQuery || undefined,
  });

  return (
    <div className="container flex-1 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold font-display text-3xl">Browse Courses</h1>
        <p className="text-muted-foreground">
          Discover courses to master new skills
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {courses === undefined ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex flex-col overflow-hidden rounded-xl border"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description || undefined}
              thumbnailUrl={course.thumbnailUrl || undefined}
              category={course.category}
              level={course.level}
              isPremium={course.isPremium}
              priceCents={course.priceCents || undefined}
              lessonsCount={course.enrollmentCount}
              enrollmentsCount={course.enrollmentCount}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="mb-4 text-muted-foreground">
            No courses found. Try adjusting your filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setCategory("all");
              setLevel("all");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

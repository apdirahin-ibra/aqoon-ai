"use client";

import { cn, formatDate, getInitials } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Download, Search, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TutorStudentsPage() {
  const students = useQuery(api.courses.tutorStudents);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  // Get unique courses for filter
  const courseNames = students
    ? [...new Set(students.map((s) => s.courseTitle))]
    : [];

  const filtered = students?.filter((s) => {
    const matchesSearch =
      !search ||
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || s.courseTitle === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-3xl">My Students</h1>
        <p className="text-muted-foreground">
          Track student progress across your courses
        </p>
      </div>

      {/* Stats */}
      {students && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-xl">{students.length}</p>
                  <p className="text-muted-foreground text-xs">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-xl">
                    {students.filter((s) => s.progress >= 100).length}
                  </p>
                  <p className="text-muted-foreground text-xs">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-warning/20 to-warning/5">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-bold text-xl">
                    {Math.round(
                      students.reduce((sum, s) => sum + s.progress, 0) /
                        (students.length || 1),
                    )}
                    %
                  </p>
                  <p className="text-muted-foreground text-xs">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          {students === undefined ? (
            <div className="space-y-2 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`skel-${i}`} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student, i) => (
                  <TableRow
                    key={`${student.studentId}-${student.courseTitle}-${i}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(student.studentName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {student.studentName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {student.studentEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.courseTitle}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.progress}
                          className="h-2 w-20"
                        />
                        <span className="text-muted-foreground text-xs">
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(student.enrolledAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.progress >= 100
                            ? "default"
                            : student.progress > 0
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {student.progress >= 100
                          ? "Completed"
                          : student.progress > 0
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold text-sm">No students found</h3>
              <p className="mt-1 text-muted-foreground text-xs">
                Students will appear here when they enroll in your courses
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

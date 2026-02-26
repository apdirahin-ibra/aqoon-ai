"use client";

import { redirect } from "next/navigation";

// The course editor is now at /tutor/courses/new (for new courses)
// or /tutor/courses/[courseId] (for editing existing courses)
export default function CourseEditorPage() {
  redirect("/tutor/courses/new");
}

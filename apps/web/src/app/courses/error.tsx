"use client";

import SectionError from "@/components/section-error";

export default function CoursesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SectionError {...props} section="Courses" />;
}

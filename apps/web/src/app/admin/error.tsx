"use client";

import SectionError from "@/components/section-error";

export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SectionError {...props} section="Admin" />;
}

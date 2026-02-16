"use client";

import { useEffect, type ReactNode } from "react";
import { useSidebar } from "@/components/sidebar-context";

export default function LearnLayout({ children }: { children: ReactNode }) {
  const { setIsSidebarHidden } = useSidebar();

  useEffect(() => {
    setIsSidebarHidden(true);
    return () => setIsSidebarHidden(false);
  }, [setIsSidebarHidden]);

  return <>{children}</>;
}

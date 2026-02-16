"use client";

import type { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/components/sidebar-context";
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: ReactNode }) {
  const { isCollapsed, isSidebarHidden } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 px-4 pt-4 pb-8 transition-all duration-300",
        isSidebarHidden ? "lg:pl-4" : isCollapsed ? "lg:pl-24" : "lg:pl-72",
      )}
    >
      {children}
    </main>
  );
}

function DashboardSidebar({ sidebar }: { sidebar: ReactNode }) {
  const { isSidebarHidden } = useSidebar();

  if (isSidebarHidden) return null;

  return <>{sidebar}</>;
}

export function DashboardShell({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar sidebar={sidebar} />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}

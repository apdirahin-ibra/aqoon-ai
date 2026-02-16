"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  isSidebarHidden: boolean;
  setIsSidebarHidden: (hidden: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggle: () => {},
  isSidebarHidden: false,
  setIsSidebarHidden: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggle: () => setIsCollapsed((prev) => !prev),
        isSidebarHidden,
        setIsSidebarHidden,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

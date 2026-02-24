"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SidebarUserMenuProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  profileHref?: string;
  settingsHref?: string;
}

export function SidebarUserMenu({
  isCollapsed = false,
  isMobile = false,
  profileHref = "/student/profile",
  settingsHref = "/student/profile",
}: SidebarUserMenuProps) {
  const router = useRouter();
  const user = useQuery(api.users.current);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/signin");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const compact = isCollapsed || isMobile;

  return (
    <div className="border-t p-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5 text-left transition-all hover:border-border hover:bg-muted/60 focus:outline-none",
            compact &&
              "justify-center rounded-lg border-0 bg-transparent px-2 hover:bg-muted",
          )}
        >
          <Avatar size="lg" className="shrink-0 ring-2 ring-primary/20">
            {user?.image && <AvatarImage src={user.image} />}
            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-primary text-sm">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-semibold text-foreground text-[13px] leading-tight">
                  {user?.name || "Loading..."}
                </span>
                <span className="truncate text-muted-foreground text-[11px] leading-tight">
                  {user?.email || ""}
                </span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={compact ? "right" : "top"}
          align="start"
          sideOffset={8}
          className="w-60 rounded-xl border border-border/80 bg-card p-1.5 shadow-xl"
        >
          {/* User info header */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-3">
            <Avatar size="default" className="shrink-0 ring-2 ring-primary/20">
              {user?.image && <AvatarImage src={user.image} />}
              <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-primary text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-semibold text-foreground text-[13px] leading-tight">
                {user?.name || "User"}
              </span>
              <span className="truncate text-muted-foreground text-[11px] leading-tight">
                {user?.email || ""}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium"
              onSelect={() => router.push(profileHref as any)}
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium"
              onSelect={() => router.push(settingsHref as any)}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium"
            onSelect={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

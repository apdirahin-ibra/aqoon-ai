"use client";

import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const isAuthPage = pathname?.startsWith("/auth");
  if (isAuthPage) return null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const getDashboardRoute = () => {
    return "/student";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold font-display text-foreground text-xl">
            Aqoon AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {isPending ? (
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-2.5 py-1.5">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="hidden flex-col gap-1 sm:flex">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1.5 transition-all hover:border-border hover:bg-muted/60 focus:outline-none">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-primary text-sm">
                  {session.user.name?.charAt(0).toUpperCase() ||
                    session.user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden font-medium text-foreground text-[13px] sm:inline-block">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-60 rounded-xl border border-border/80 bg-card p-1.5 shadow-xl"
            >
              {/* User info header */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-3">
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 font-bold text-primary text-xs">
                    {session.user.name?.charAt(0).toUpperCase() ||
                      session.user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-semibold text-foreground text-[13px] leading-tight">
                    {session.user.name || "User"}
                  </span>
                  <span className="truncate text-muted-foreground text-[11px] leading-tight">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                onClick={() => router.push(getDashboardRoute() as any)}
                className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/student/profile" as any)}
                className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium cursor-pointer"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href={"/signin" as any}>Sign In</Link>
            </Button>
            <Button asChild className="rounded-full px-6">
              <Link href={"/signup" as any}>Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

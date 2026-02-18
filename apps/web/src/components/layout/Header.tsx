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
            href={"/pricing" as any}
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href={"/about" as any}
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href={"/contact" as any}
            className="font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {!isPending && session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary text-sm">
                  {session.user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => router.push(getDashboardRoute() as any)}
                className="cursor-pointer"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/profile" as any)}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
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

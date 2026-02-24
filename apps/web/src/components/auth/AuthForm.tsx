"use client";

import { BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signin" | "signup";
}

export function AuthForm({ className, type, ...props }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");

  const isSignIn = type === "signin";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: () => {
              toast.success("Welcome back!");
              router.push("/dashboard");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Sign in failed");
            },
          },
        );
      } else {
        await authClient.signUp.email(
          {
            email,
            password,
            name: fullName,
          },
          {
            onSuccess: () => {
              toast.success("Account created successfully!");
              router.push("/dashboard");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Sign up failed");
            },
          },
        );
      }
    } catch (_error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Google sign in failed");
          setGoogleLoading(false);
        },
      },
    );
  };

  return (
    <div className={cn(className)} {...props}>
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          {/* Tab-like navigation matching lovable's TabsList */}
          <div className="grid w-full grid-cols-2 rounded-lg bg-muted p-1">
            <Link
              href={"/signin" as any}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm ring-offset-background transition-all",
                isSignIn
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign In
            </Link>
            <Link
              href={"/signup" as any}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm ring-offset-background transition-all",
                !isSignIn
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign Up
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className="mb-2 text-2xl">
            {isSignIn ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription className="mb-6">
            {isSignIn
              ? "Sign in to continue your learning journey"
              : "Start your learning journey today"}
          </CardDescription>

          <form onSubmit={onSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`${type}-email`}>Email</Label>
              <Input
                id={`${type}-email`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-password`}>Password</Label>
              <Input
                id={`${type}-password`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {isSignIn && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>

            <div className="relative my-4">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground text-xs">
                or continue with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

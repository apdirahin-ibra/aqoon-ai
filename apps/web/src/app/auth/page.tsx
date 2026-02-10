"use client";

import { BookOpen, Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Sign in failed");
          setLoading(false);
        },
      },
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signUp.email(
      {
        email,
        password,
        name: fullName,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Sign up failed");
          setLoading(false);
        },
      },
    );
  };

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
    <div className="flex min-h-screen items-center justify-center p-6 bg-hero">
      <div className="w-full max-w-[460px]">
        {/* Branding Logo */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white transition-transform hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg border border-white/10">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold font-display text-2xl tracking-tighter">
              Aqoon AI
            </span>
          </Link>
        </div>

        {/* Auth Card - Made more compact for 1:1 match */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/30 border border-white/20 p-8 md:p-10">
          {/* Custom Tabs List */}
          <div className="mb-8">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("signin")}
                className={cn(
                  "flex-1 h-full rounded-lg text-sm font-bold transition-all duration-200",
                  activeTab === "signin"
                    ? "bg-white text-[#1e293b] shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={cn(
                  "flex-1 h-full rounded-lg text-sm font-bold transition-all duration-200",
                  activeTab === "signup"
                    ? "bg-white text-[#1e293b] shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            {activeTab === "signin" ? (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1e293b]">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground font-medium text-sm">
                    Sign in to continue your learning journey
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signin-email"
                      className="text-sm font-semibold text-[#1e293b]/80 ml-1"
                    >
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/10 transition-shadow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <Label
                        htmlFor="signin-password"
                        className="text-sm font-semibold text-[#1e293b]/80"
                      >
                        Password
                      </Label>
                      <Link
                        href={"/forgot-password" as any}
                        className="text-primary text-xs font-semibold hover:underline decoration-primary/30 underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/10 transition-shadow"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-bold bg-[#1e293b] hover:bg-[#334155] text-white rounded-xl shadow-md mt-2"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1e293b]">
                    Create account
                  </h1>
                  <p className="text-muted-foreground font-medium text-sm">
                    Start your learning journey today
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-name"
                      className="text-sm font-semibold text-[#1e293b]/80 ml-1"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/10 transition-shadow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-email"
                      className="text-sm font-semibold text-[#1e293b]/80 ml-1"
                    >
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/10 transition-shadow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-password"
                      className="text-sm font-semibold text-[#1e293b]/80 ml-1"
                    >
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 bg-white border-gray-200 rounded-xl focus:ring-primary/10 transition-shadow"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-bold bg-[#1e293b] hover:bg-[#334155] text-white rounded-xl shadow-md mt-2"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </form>
              </div>
            )}

            {/* Separator Section */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground/60">
                <span className="bg-white px-4">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 hover:bg-gray-50 border-gray-200 rounded-xl font-bold text-sm transition-all shadow-sm"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              Google
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <p className="mt-10 text-center text-xs font-medium text-white/60 tracking-wide">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-white hover:underline decoration-white/30 underline-offset-4 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-white hover:underline decoration-white/30 underline-offset-4 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-hero flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

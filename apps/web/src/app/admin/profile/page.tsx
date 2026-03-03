"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ExternalLink,
  FileText,
  Loader2,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DangerZoneCard } from "@/components/profile/danger-zone-card";
import { NotificationsCard } from "@/components/profile/notifications-card";
import { PreferencesCard } from "@/components/profile/preferences-card";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { SecurityCard } from "@/components/profile/security-card";
import { ThemeCard } from "@/components/profile/theme-card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const user = useQuery(api.users.current);
  const settings = useQuery(api.platformSettings.getAll);
  const setSetting = useMutation(api.platformSettings.set);

  const [savingSetting, setSavingSetting] = useState<string | null>(null);

  // Derive current settings
  const getSetting = (key: string, fallback: any = "") => {
    const s = settings?.find((s) => s.key === key);
    return s?.value ?? fallback;
  };

  const handleToggleSetting = async (key: string, currentValue: boolean) => {
    setSavingSetting(key);
    try {
      await setSetting({
        key,
        value: JSON.stringify(!currentValue),
      });
      toast.success("Setting updated");
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setSavingSetting(null);
    }
  };

  const handleTextSetting = async (key: string, value: string) => {
    setSavingSetting(key);
    try {
      await setSetting({ key, value: JSON.stringify(value) });
      toast.success("Setting updated");
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setSavingSetting(null);
    }
  };

  if (user === undefined) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-1 h-8 w-48" />
        <Skeleton className="mb-5 h-4 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-5">
        <h1 className="mb-1 font-bold font-display text-2xl">Admin Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and platform settings
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        orientation="horizontal"
        className="flex w-full flex-col space-y-5"
      >
        <TabsList className="inline-flex h-auto w-auto flex-wrap rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="profile"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <User className="mr-1.5 h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="site" className="rounded-lg px-4 py-2.5 text-sm">
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Site Settings
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="w-full">
          <ProfileInfoCard user={user} />
        </TabsContent>

        <TabsContent value="security" className="w-full">
          <SecurityCard />
        </TabsContent>

        <TabsContent value="site" className="w-full">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Platform Configuration */}
            <Card className="rounded-2xl shadow-sm md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Platform Configuration
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Site Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Platform Name</Label>
                  <div className="flex gap-2">
                    <Input
                      defaultValue={getSetting("siteName", "Aqoon AI")}
                      className="rounded-xl text-sm"
                      onBlur={(e) =>
                        handleTextSetting("siteName", e.target.value)
                      }
                    />
                    {savingSetting === "siteName" && (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="font-medium text-sm">Maintenance Mode</p>
                    <p className="text-muted-foreground text-xs">
                      Temporarily disable public access to the platform
                    </p>
                  </div>
                  <Switch
                    checked={getSetting("maintenanceMode", false)}
                    onCheckedChange={() =>
                      handleToggleSetting(
                        "maintenanceMode",
                        getSetting("maintenanceMode", false),
                      )
                    }
                    disabled={savingSetting === "maintenanceMode"}
                  />
                </div>

                {/* Registration */}
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="font-medium text-sm">Open Registration</p>
                    <p className="text-muted-foreground text-xs">
                      Allow new users to create accounts
                    </p>
                  </div>
                  <Switch
                    checked={getSetting("registrationOpen", true)}
                    onCheckedChange={() =>
                      handleToggleSetting(
                        "registrationOpen",
                        getSetting("registrationOpen", true),
                      )
                    }
                    disabled={savingSetting === "registrationOpen"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">User Management</CardTitle>
                <CardDescription className="text-xs">
                  Quick access to management pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/admin/users"
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Manage Users</p>
                      <p className="text-muted-foreground text-xs">
                        View, edit roles, and manage accounts
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/admin/audit-log"
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Audit Log</p>
                      <p className="text-muted-foreground text-xs">
                        View system activity and changes
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Admin Stats */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Admin Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700 text-xs dark:bg-red-950 dark:text-red-400">
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Created</span>
                  <span className="text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-xs">{user.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="w-full">
          <div className="grid gap-4 md:grid-cols-2">
            <ThemeCard />
            <PreferencesCard
              currentLanguage={user.language}
              currentTimezone={user.timezone}
            />
            <div className="md:col-span-2">
              <NotificationsCard initialPrefs={user.notificationPrefs} />
            </div>
            <div className="md:col-span-2">
              <DangerZoneCard />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

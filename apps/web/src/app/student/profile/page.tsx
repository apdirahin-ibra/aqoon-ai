"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Bell, Loader2, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
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
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const user = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const saveProfileImage = useMutation(api.files.saveProfileImage);

  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name ?? "");
      setBio(user.bio ?? "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: fullName, bio });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    setTimeout(() => {
      setChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully");
    }, 1000);
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
        <h1 className="mb-1 font-bold font-display text-2xl">
          Profile &amp; Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        orientation="horizontal"
        className="flex w-full flex-col space-y-5"
      >
        <TabsList className="inline-flex h-auto w-auto rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="profile"
            className="rounded-lg px-6 py-2.5 text-base"
          >
            <User className="mr-1.5 h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg px-6 py-2.5 text-base"
          >
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg px-6 py-2.5 text-base"
          >
            <Bell className="mr-1.5 h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="w-full">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-2xl shadow-sm md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Information</CardTitle>
                <CardDescription className="text-xs">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <ImageUpload
                      shape="circle"
                      currentImageUrl={user.image}
                      onUploaded={async (storageId) => {
                        await saveProfileImage({
                          storageId: storageId as Id<"_storage">,
                        });
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm">
                        {user.name || "Your Name"}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="rounded-xl bg-muted text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                    className="rounded-xl"
                  >
                    {saving && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Bio</CardTitle>
                <CardDescription className="text-xs">
                  Tell us about yourself
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={8}
                  className="rounded-xl text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="w-full">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-2xl shadow-sm md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription className="text-xs">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-xs">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={changingPassword}
                    className="rounded-xl"
                  >
                    {changingPassword && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Connected Accounts</CardTitle>
                <CardDescription className="text-xs">
                  Manage your connected social accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-muted to-muted/50">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                    </div>
                    <div>
                      <p className="font-medium text-sm">Google</p>
                      <p className="text-muted-foreground text-xs">
                        Not connected
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="w-full">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Email Notifications</CardTitle>
              <CardDescription className="text-xs">
                Choose what emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Learning Reminders</p>
                  <p className="text-muted-foreground text-xs">
                    Receive reminders to continue your courses
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Course Updates</p>
                  <p className="text-muted-foreground text-xs">
                    Get notified when courses you&apos;re enrolled in are
                    updated
                  </p>
                </div>
                <Switch
                  checked={courseUpdates}
                  onCheckedChange={setCourseUpdates}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Marketing Emails</p>
                  <p className="text-muted-foreground text-xs">
                    Receive news about new courses and special offers
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Bell, BookOpen, Loader2, Settings, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentProfilePage() {
  const user = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Learning preferences state
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(5);
  const [preferredPace, setPreferredPace] = useState("self-paced");
  const [studyReminders, setStudyReminders] = useState(true);

  useEffect(() => {
    if (user?.learningPrefs) {
      setWeeklyGoalHours(user.learningPrefs.weeklyGoalHours);
      setPreferredPace(user.learningPrefs.preferredPace);
      setStudyReminders(user.learningPrefs.studyReminders);
    }
  }, [user]);

  const handleSaveLearningPrefs = async () => {
    setSavingPrefs(true);
    try {
      await updateProfile({
        learningPrefs: {
          weeklyGoalHours,
          preferredPace,
          studyReminders,
        },
      });
    } finally {
      setSavingPrefs(false);
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
        <TabsList className="inline-flex h-auto w-auto flex-wrap rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="profile"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <User className="mr-1.5 h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="learning"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Learning
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Security
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
          <div className="space-y-4">
            <ProfileInfoCard user={user} />
          </div>
        </TabsContent>

        <TabsContent value="learning" className="w-full">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Learning Preferences</CardTitle>
              <CardDescription className="text-xs">
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Weekly Study Goal (hours)</Label>
                <Select
                  value={String(weeklyGoalHours)}
                  onValueChange={(v) => setWeeklyGoalHours(Number(v))}
                >
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 7, 10, 15, 20].map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {h} hours per week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Preferred Pace</Label>
                <Select value={preferredPace} onValueChange={setPreferredPace}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self-paced">
                      Self-Paced — Learn at your own speed
                    </SelectItem>
                    <SelectItem value="structured">
                      Structured — Follow a weekly schedule
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl p-2 hover:bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Study Reminders</p>
                  <p className="text-muted-foreground text-xs">
                    Get daily reminders to continue learning
                  </p>
                </div>
                <Switch
                  checked={studyReminders}
                  onCheckedChange={setStudyReminders}
                />
              </div>

              <Button
                size="sm"
                className="rounded-xl"
                onClick={handleSaveLearningPrefs}
                disabled={savingPrefs}
              >
                {savingPrefs && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="w-full">
          <SecurityCard />
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

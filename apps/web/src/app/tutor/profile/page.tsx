"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useConvex, useMutation, useQuery } from "convex/react";
import {
  DollarSign,
  Loader2,
  PenSquare,
  Save,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function TutorProfilePage() {
  const user = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const updatePayoutInfo = useMutation(api.users.updatePayoutInfo);
  const convex = useConvex();

  const [saving, setSaving] = useState(false);
  const [specialties, setSpecialties] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Payout state
  const [bankName, setBankName] = useState("");
  const [accountLast4, setAccountLast4] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    if (user) {
      setSpecialties(user.specialties?.join(", ") ?? "");
      setAvatarUrl(user.image ?? "");
      if (user.payoutInfo) {
        setBankName(user.payoutInfo.bankName);
        setAccountLast4(user.payoutInfo.accountLast4);
        setPayoutMethod(user.payoutInfo.payoutMethod);
      }
    }
  }, [user]);

  const handleSaveTeaching = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile({
        specialties: specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: avatarUrl || undefined,
      });
      toast.success("Teaching profile saved");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async () => {
    if (!bankName || !accountLast4) {
      toast.error("Please fill in all payout fields");
      return;
    }
    setSavingPayout(true);
    try {
      await updatePayoutInfo({
        bankName,
        accountLast4,
        payoutMethod,
      });
      toast.success("Payout information saved");
    } finally {
      setSavingPayout(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
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
          Tutor Profile & Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your teaching profile and account settings
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
            value="teaching"
            className="rounded-lg px-4 py-2.5 text-sm"
          >
            <PenSquare className="mr-1.5 h-3.5 w-3.5" />
            Teaching
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
          <ProfileInfoCard user={user} />
        </TabsContent>

        <TabsContent value="teaching" className="w-full">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {/* Specialties */}
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Teaching Expertise
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Your specialties visible to students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Specialties</Label>
                    <Input
                      value={specialties}
                      onChange={(e) => setSpecialties(e.target.value)}
                      placeholder="e.g., Python, Machine Learning, Data Science"
                      className="rounded-xl text-sm"
                    />
                    <p className="text-muted-foreground text-xs">
                      Comma-separated list of your expertise areas
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={handleSaveTeaching}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Save Teaching Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-4 w-4" />
                    Payout Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    How you receive your course earnings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Payout Method</Label>
                    <Select
                      value={payoutMethod}
                      onValueChange={setPayoutMethod}
                    >
                      <SelectTrigger className="rounded-xl text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      {payoutMethod === "paypal" ? "PayPal Email" : "Bank Name"}
                    </Label>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder={
                        payoutMethod === "paypal"
                          ? "your@email.com"
                          : "Bank name"
                      }
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      {payoutMethod === "paypal"
                        ? "Confirmed"
                        : "Last 4 digits of account"}
                    </Label>
                    <Input
                      value={accountLast4}
                      onChange={(e) => setAccountLast4(e.target.value)}
                      placeholder={payoutMethod === "paypal" ? "Yes" : "1234"}
                      maxLength={4}
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={handleSavePayout}
                    disabled={savingPayout}
                  >
                    {savingPayout && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Save Payout Info
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile Preview */}
            <Card className="h-fit rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg">
                    {user.name || "Your Name"}
                  </h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {specialties || "Your specialties"}
                  </p>
                  <p className="mt-3 text-sm">
                    {user.bio
                      ? user.bio.slice(0, 100) +
                        (user.bio.length > 100 ? "..." : "")
                      : "Your bio will appear here"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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

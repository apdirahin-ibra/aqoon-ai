"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useConvex, useMutation, useQuery } from "convex/react";
import { Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function TutorProfilePage() {
  const user = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);
  const convex = useConvex();

  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Populate form when user data arrives
  useEffect(() => {
    if (user) {
      setDisplayName(user.name ?? "");
      setBio(user.bio ?? "");
      setSpecialties(user.specialties?.join(", ") ?? "");
      setAvatarUrl(user.image ?? "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile({
        name: displayName,
        bio,
        specialties: specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: avatarUrl || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const isLoading = user === undefined;

  if (isLoading) {
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

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">
            Tutor Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your public profile visible to students
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Profile
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about yourself..."
                />
                <p className="text-muted-foreground text-xs">
                  {bio.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="e.g., Python, Machine Learning, Data Science"
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated list of your expertise areas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImageUrl={avatarUrl}
                shape="circle"
                onUploaded={async (storageId) => {
                  const url = await convex.query(api.files.getFileUrl, {
                    storageId: storageId as Id<"_storage">,
                  });
                  if (url) {
                    setAvatarUrl(url);
                    await updateProfile({ image: url });
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
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
                  {displayName || "Your Name"}
                </h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  {specialties || "Your specialties"}
                </p>
                <p className="mt-3 text-sm">
                  {bio
                    ? bio.slice(0, 100) + (bio.length > 100 ? "..." : "")
                    : "Your bio will appear here"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

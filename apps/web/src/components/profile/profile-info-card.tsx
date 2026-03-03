"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface ProfileInfoCardProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    bio?: string | null;
  };
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const saveProfileImage = useMutation(api.files.saveProfileImage);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: fullName, bio });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Profile Information</CardTitle>
        <CardDescription className="text-xs">
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
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
              <p className="text-muted-foreground text-xs">{user.email}</p>
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

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="rounded-xl"
          >
            {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface NotificationsCardProps {
  initialPrefs?: {
    emailNotifications: boolean;
    courseUpdates: boolean;
    marketingEmails: boolean;
  };
}

const defaultPrefs = {
  emailNotifications: true,
  courseUpdates: true,
  marketingEmails: false,
};

export function NotificationsCard({
  initialPrefs = defaultPrefs,
}: NotificationsCardProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState(initialPrefs);

  const handleToggle = async (key: keyof typeof prefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    setSaving(true);
    try {
      await updateProfile({ notificationPrefs: updated });
    } finally {
      setSaving(false);
    }
  };

  const items = [
    {
      key: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive important account notifications via email",
    },
    {
      key: "courseUpdates" as const,
      label: "Course Updates",
      description: "Get notified when courses you're enrolled in are updated",
    },
    {
      key: "marketingEmails" as const,
      label: "Marketing Emails",
      description: "Receive news about new courses and special offers",
    },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Email Notifications
          {saving && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          Choose what emails you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted/30"
          >
            <div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-muted-foreground text-xs">
                {item.description}
              </p>
            </div>
            <Switch
              checked={prefs[item.key]}
              onCheckedChange={(v) => handleToggle(item.key, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

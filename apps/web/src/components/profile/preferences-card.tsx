"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";
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

const languages = [
  { value: "en", label: "English" },
  { value: "so", label: "Soomaali" },
  { value: "ar", label: "العربية" },
];

const timezones = [
  { value: "Africa/Mogadishu", label: "East Africa (EAT)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
];

interface PreferencesCardProps {
  currentLanguage?: string;
  currentTimezone?: string;
}

export function PreferencesCard({
  currentLanguage = "en",
  currentTimezone = "Africa/Mogadishu",
}: PreferencesCardProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState(currentLanguage);
  const [timezone, setTimezone] = useState(currentTimezone);

  const handleLanguageChange = async (value: string) => {
    setLanguage(value);
    setSaving(true);
    try {
      await updateProfile({ language: value });
    } finally {
      setSaving(false);
    }
  };

  const handleTimezoneChange = async (value: string) => {
    setTimezone(value);
    setSaving(true);
    try {
      await updateProfile({ timezone: value });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4" />
          Language & Region
          {saving && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          Set your preferred language and timezone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Timezone</Label>
          <Select value={timezone} onValueChange={handleTimezoneChange}>
            <SelectTrigger className="rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

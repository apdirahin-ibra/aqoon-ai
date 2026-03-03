"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeCard() {
  const { theme, setTheme } = useTheme();
  const updateProfile = useMutation(api.users.updateProfile);
  const [saving, setSaving] = useState(false);

  const handleThemeChange = async (value: string) => {
    setTheme(value);
    setSaving(true);
    try {
      await updateProfile({ theme: value });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Theme Preference
          {saving && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          Choose your preferred appearance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleThemeChange(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                theme === value
                  ? "border-primary bg-primary/5"
                  : "border-border",
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  theme === value ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "font-medium text-xs",
                  theme === value ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

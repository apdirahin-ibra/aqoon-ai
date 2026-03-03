"use client";

import { Loader2, Monitor, Shield, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function SecurityCard() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingSession, setRevokingSession] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const result = await authClient.listSessions();
      if (result.data) {
        setSessions(result.data);
      }
    } catch {
      // Sessions API may not be available
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      toast.success("Password changed successfully");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    setToggling2FA(true);
    try {
      if (twoFactorEnabled) {
        await authClient.twoFactor.disable({
          password: currentPassword || "required",
        });
        setTwoFactorEnabled(false);
        toast.success("Two-factor authentication disabled");
      } else {
        const result = await authClient.twoFactor.enable({
          password: currentPassword || "required",
        });
        if (result.data) {
          setTwoFactorEnabled(true);
          toast.success("Two-factor authentication enabled");
        }
      }
    } catch {
      toast.error("Enter your current password first to toggle 2FA");
    } finally {
      setToggling2FA(false);
    }
  };

  const handleRevokeSession = async (token: string) => {
    setRevokingSession(token);
    try {
      await authClient.revokeSession({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success("Session revoked");
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingSession(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Password Change */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription className="text-xs">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl text-sm"
              />
            </div>
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

      {/* 2FA + Connected Accounts */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Security Settings</CardTitle>
          <CardDescription className="text-xs">
            Manage two-factor authentication and connected accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-muted-foreground text-xs">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={toggling2FA}
            />
          </div>

          {/* Google Connected Account */}
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
                <p className="text-muted-foreground text-xs">Not connected</p>
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

      {/* Active Sessions */}
      <Card className="rounded-2xl shadow-sm md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription className="text-xs">
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground text-sm">
              No active sessions found
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.token || session.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    {session.userAgent?.includes("Mobile") ? (
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {session.userAgent
                          ? session.userAgent.slice(0, 40)
                          : "Unknown Device"}
                        {session.isCurrent && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {session.ipAddress || "Unknown IP"} ·{" "}
                        {session.createdAt
                          ? new Date(session.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => handleRevokeSession(session.token)}
                      disabled={revokingSession === session.token}
                    >
                      {revokingSession === session.token ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Revoke"
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

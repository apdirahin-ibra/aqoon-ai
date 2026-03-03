"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function DangerZoneCard() {
  const deleteAccount = useMutation(api.users.deleteAccount);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      // Sign out after account deletion
      await authClient.signOut();
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-destructive/30 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-xs">
          Irreversible actions — proceed with caution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div>
            <p className="font-medium text-sm">Delete Account</p>
            <p className="text-muted-foreground text-xs">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="shrink-0 rounded-lg"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account, all your courses, enrollments, progress, and all
                  other associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2 py-2">
                <p className="font-medium text-sm">
                  Type{" "}
                  <span className="font-mono text-destructive">DELETE</span> to
                  confirm:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="rounded-xl"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

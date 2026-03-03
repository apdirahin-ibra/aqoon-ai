"use client";

import { formatRelativeTime } from "@/lib/utils";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Award,
  BookOpen,
  Check,
  CheckCheck,
  DollarSign,
  Info,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig: Record<
  string,
  { icon: typeof BookOpen; gradient: string; color: string }
> = {
  course: {
    icon: BookOpen,
    gradient: "bg-linear-to-br from-emerald-500/20 to-emerald-500/5",
    color: "text-emerald-600",
  },
  enrollment: {
    icon: Users,
    gradient: "bg-linear-to-br from-primary/20 to-primary/5",
    color: "text-primary",
  },
  review: {
    icon: Star,
    gradient: "bg-linear-to-br from-warning/20 to-warning/5",
    color: "text-warning",
  },
  earning: {
    icon: DollarSign,
    gradient: "bg-linear-to-br from-success/20 to-success/5",
    color: "text-success",
  },
  achievement: {
    icon: Award,
    gradient: "bg-linear-to-br from-warning/20 to-warning/5",
    color: "text-warning",
  },
  message: {
    icon: MessageSquare,
    gradient: "bg-linear-to-br from-primary/20 to-primary/5",
    color: "text-primary",
  },
  system: {
    icon: Info,
    gradient: "bg-linear-to-br from-muted-foreground/20 to-muted-foreground/5",
    color: "text-muted-foreground",
  },
};

export default function TutorNotificationsPage() {
  const notifications = useQuery(api.notifications.list);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-bold font-display text-3xl">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated on your teaching activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead({})}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read ({unreadCount})
          </Button>
        )}
      </div>

      {notifications === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`notif-skel-${i}`} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const config = typeConfig[notif.type] ?? typeConfig.system;
            const Icon = config.icon;
            return (
              <Card
                key={notif._id}
                className={`transition-all ${!notif.isRead ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}
              >
                <CardContent className="flex items-start gap-4 pt-5 pb-5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.gradient}`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="mt-0.5 text-muted-foreground text-xs">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {formatRelativeTime(notif._creationTime)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() =>
                        markRead({
                          notificationId: notif._id,
                        })
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Info className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold text-sm">No notifications yet</h3>
            <p className="mt-1 text-muted-foreground text-xs">
              New enrollments, reviews, and updates will show here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

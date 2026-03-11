"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Info,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDetailDialog } from "@/components/notification-detail-dialog";
import { formatRelativeTime } from "@/lib/utils";

const typeConfig: Record<
  string,
  { icon: typeof BookOpen; gradient: string; color: string }
> = {
  course: {
    icon: BookOpen,
    gradient: "bg-linear-to-br from-primary/20 to-primary/5",
    color: "text-primary",
  },
  achievement: {
    icon: Award,
    gradient: "bg-linear-to-br from-warning/20 to-warning/5",
    color: "text-warning",
  },
  message: {
    icon: MessageSquare,
    gradient: "bg-linear-to-br from-success/20 to-success/5",
    color: "text-success",
  },
  system: {
    icon: Info,
    gradient: "bg-linear-to-br from-muted-foreground/20 to-muted-foreground/5",
    color: "text-muted-foreground",
  },
};

interface Notification {
  _id: Id<"notifications">;
  title: string;
  message: string;
  type: string;
  createdAt: number;
  isRead: boolean;
}

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  if (notifications === undefined) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-1 h-8 w-40" />
        <Skeleton className="mb-5 h-4 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={`notif-skel-${i}`}
              className="h-16 w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markRead({ notificationId: notification._id });
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-bold font-display text-2xl">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead({})}
            className="rounded-xl text-xs"
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="divide-y p-0">
            {notifications.map((notification, i) => {
              const config = typeConfig[notification.type] ?? typeConfig.system;
              const Icon = config.icon;
              return (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`fade-in slide-in-from-bottom-2 flex w-full animate-in items-start gap-3 p-3 text-left transition-colors hover:bg-muted/30 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  style={{
                    animationDelay: `${i * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.gradient}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"}`}
                        >
                          {notification.title}
                        </p>
                        <p className="line-clamp-1 text-muted-foreground text-xs">
                          {notification.message}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                      title="Unread"
                    />
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="py-10 text-center">
            <CheckCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 font-semibold text-sm">No notifications</h3>
            <p className="text-muted-foreground text-xs">
              You're all caught up!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification detail modal */}
      <NotificationDetailDialog
        notification={selectedNotification}
        open={selectedNotification !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null);
        }}
        onMarkRead={
          selectedNotification && !selectedNotification.isRead
            ? () => markRead({ notificationId: selectedNotification._id })
            : undefined
        }
      />
    </div>
  );
}

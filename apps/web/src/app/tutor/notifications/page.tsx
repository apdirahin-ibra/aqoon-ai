"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
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

interface Notification {
	_id: Id<"notifications">;
	_creationTime: number;
	title: string;
	message: string;
	type: string;
	createdAt: number;
	isRead: boolean;
}

export default function TutorNotificationsPage() {
	const notifications = useQuery(api.notifications.list);
	const markRead = useMutation(api.notifications.markRead);
	const markAllRead = useMutation(api.notifications.markAllRead);
	const [selectedNotification, setSelectedNotification] =
		useState<Notification | null>(null);

	const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

	const handleNotificationClick = (notification: Notification) => {
		setSelectedNotification(notification);
		if (!notification.isRead) {
			markRead({ notificationId: notification._id });
		}
	};

	return (
		<div className="container py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="mb-1 font-bold font-display text-2xl">
						Notifications
					</h1>
					<p className="text-muted-foreground text-sm">
						{unreadCount > 0
							? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
							: "Stay updated on your teaching activity"}
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
				<Card className="rounded-2xl shadow-sm">
					<CardContent className="divide-y p-0">
						{notifications.map((notif, i) => {
							const config = typeConfig[notif.type] ?? typeConfig.system;
							const Icon = config.icon;
							return (
								<button
									key={notif._id}
									type="button"
									onClick={() => handleNotificationClick(notif)}
									className={`fade-in slide-in-from-bottom-2 flex w-full animate-in items-start gap-3 p-3 text-left transition-colors hover:bg-muted/30 ${
										!notif.isRead ? "bg-emerald-500/5" : ""
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
													className={`text-sm ${!notif.isRead ? "font-semibold" : "font-medium"}`}
												>
													{notif.title}
												</p>
												<p className="line-clamp-1 text-muted-foreground text-xs">
													{notif.message}
												</p>
											</div>
											<span className="shrink-0 text-[10px] text-muted-foreground">
												{formatRelativeTime(notif._creationTime)}
											</span>
										</div>
									</div>
									{!notif.isRead && (
										<div
											className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
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
					<CardContent className="py-12 text-center">
						<Info className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
						<h3 className="font-semibold text-sm">No notifications yet</h3>
						<p className="mt-1 text-muted-foreground text-xs">
							New enrollments, reviews, and updates will show here
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

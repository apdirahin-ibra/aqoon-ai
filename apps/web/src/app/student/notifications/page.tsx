"use client";

import {
	Award,
	BookOpen,
	Check,
	CheckCheck,
	Info,
	Loader2,
	MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
	id: string;
	type: "course" | "achievement" | "message" | "system";
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "course",
		title: "New lesson available",
		message: "A new lesson has been added to 'Introduction to Python'",
		timestamp: "2024-02-10T10:00:00Z",
		read: false,
	},
	{
		id: "2",
		type: "achievement",
		title: "Certificate earned!",
		message: "You've completed 'Advanced JavaScript Patterns'",
		timestamp: "2024-02-09T14:30:00Z",
		read: false,
	},
	{
		id: "3",
		type: "message",
		title: "New message from tutor",
		message: "Dr. Smith replied to your question about React hooks",
		timestamp: "2024-02-08T09:15:00Z",
		read: true,
	},
	{
		id: "4",
		type: "system",
		title: "Account verified",
		message: "Your email has been successfully verified",
		timestamp: "2024-02-07T16:00:00Z",
		read: true,
	},
];

const typeConfig = {
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

export default function NotificationsPage() {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [loading] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	const formatTime = (date: string) => {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	};

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

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
						onClick={markAllAsRead}
						className="rounded-xl text-xs"
					>
						<CheckCheck className="mr-1 h-3.5 w-3.5" />
						Mark all read
					</Button>
				)}
			</div>

			<Card className="rounded-2xl shadow-sm">
				<CardContent className="divide-y p-0">
					{notifications.map((notification, i) => {
						const config = typeConfig[notification.type];
						const Icon = config.icon;
						return (
							<div
								key={notification.id}
								className={`fade-in slide-in-from-bottom-2 flex animate-in items-start gap-3 p-3 transition-colors hover:bg-muted/30 ${
									!notification.read ? "bg-primary/5" : ""
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
												className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}
											>
												{notification.title}
											</p>
											<p className="text-muted-foreground text-xs">
												{notification.message}
											</p>
										</div>
										<span className="shrink-0 text-[10px] text-muted-foreground">
											{formatTime(notification.timestamp)}
										</span>
									</div>
								</div>
								{!notification.read && (
									<button
										type="button"
										onClick={() => markAsRead(notification.id)}
										className="mt-1 shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										title="Mark as read"
									>
										<Check className="h-3.5 w-3.5" />
									</button>
								)}
							</div>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}

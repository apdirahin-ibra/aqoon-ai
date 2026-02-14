"use client";

import {
	AlertCircle,
	Bell,
	BookOpen,
	Check,
	CheckCheck,
	DollarSign,
	Loader2,
	MessageCircle,
	Trophy,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
	id: string;
	type: "course" | "achievement" | "message" | "payment" | "alert";
	title: string;
	message: string;
	link: string | null;
	isRead: boolean;
	createdAt: string;
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "course",
		title: "New lesson available",
		message: "Python Basics: Lesson 5 - Functions is now live!",
		link: "/student/learn/1/5",
		isRead: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
	},
	{
		id: "2",
		type: "achievement",
		title: "Achievement unlocked!",
		message: "You've completed 5 lessons in a row. Keep it up!",
		link: "/student/certificates",
		isRead: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
	},
	{
		id: "3",
		type: "message",
		title: "New message from Sarah",
		message: "Thanks for the help with my question!",
		link: "/student/messages",
		isRead: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
	},
	{
		id: "4",
		type: "payment",
		title: "Payment successful",
		message: "Your payment for Web Development course was processed.",
		link: "/student/my-courses",
		isRead: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
	},
	{
		id: "5",
		type: "alert",
		title: "Course ending soon",
		message: "React Mastery course ends in 3 days. Complete it now!",
		link: "/student/learn/2/1",
		isRead: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
	},
];

export default function NotificationsPage() {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [loading] = useState(false);

	const getIcon = (type: Notification["type"]) => {
		switch (type) {
			case "course":
				return <BookOpen className="h-5 w-5 text-primary" />;
			case "achievement":
				return <Trophy className="h-5 w-5 text-yellow-500" />;
			case "message":
				return <MessageCircle className="h-5 w-5 text-green-500" />;
			case "payment":
				return <DollarSign className="h-5 w-5 text-green-500" />;
			case "alert":
				return <AlertCircle className="h-5 w-5 text-red-500" />;
			default:
				return <Bell className="h-5 w-5 text-muted-foreground" />;
		}
	};

	const formatTime = (date: string) => {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return d.toLocaleDateString();
	};

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">
						Notifications
					</h1>
					<p className="text-muted-foreground">
						{unreadCount > 0
							? `${unreadCount} unread notifications`
							: "All caught up!"}
					</p>
				</div>
				{unreadCount > 0 && (
					<Button variant="outline" onClick={markAllAsRead}>
						<CheckCheck className="mr-2 h-4 w-4" />
						Mark all as read
					</Button>
				)}
			</div>

			<Card>
				<CardContent className="p-0">
					{notifications.length > 0 ? (
						<div className="divide-y">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
										!notification.isRead ? "bg-primary/5" : ""
									}`}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
										{getIcon(notification.type)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center gap-2">
											<p
												className={`font-medium ${
													!notification.isRead ? "" : "text-muted-foreground"
												}`}
											>
												{notification.title}
											</p>
											{!notification.isRead && (
												<div className="h-2 w-2 rounded-full bg-primary" />
											)}
										</div>
										<p className="line-clamp-2 text-muted-foreground text-sm">
											{notification.message}
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											{formatTime(notification.createdAt)}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{notification.link && (
											<Button asChild variant="ghost" size="sm">
												<a href={notification.link}>View</a>
											</Button>
										)}
										{!notification.isRead && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => markAsRead(notification.id)}
											>
												<Check className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<Bell className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-xl">No notifications</h3>
							<p className="text-muted-foreground">
								You're all caught up! New notifications will appear here.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

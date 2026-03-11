"use client";

import {
	Award,
	BookOpen,
	Info,
	MessageSquare,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatRelativeTime } from "@/lib/utils";

interface NotificationDetailDialogProps {
	notification: {
		title: string;
		message: string;
		type: string;
		createdAt: number;
		isRead: boolean;
	} | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onMarkRead?: () => void;
}

const typeConfig: Record<
	string,
	{ icon: typeof BookOpen; gradient: string; color: string; label: string }
> = {
	course: {
		icon: BookOpen,
		gradient: "bg-linear-to-br from-primary/20 to-primary/5",
		color: "text-primary",
		label: "Course Update",
	},
	achievement: {
		icon: Award,
		gradient: "bg-linear-to-br from-warning/20 to-warning/5",
		color: "text-warning",
		label: "Achievement",
	},
	message: {
		icon: MessageSquare,
		gradient: "bg-linear-to-br from-success/20 to-success/5",
		color: "text-success",
		label: "Message",
	},
	system: {
		icon: Info,
		gradient: "bg-linear-to-br from-muted-foreground/20 to-muted-foreground/5",
		color: "text-muted-foreground",
		label: "System",
	},
	forum: {
		icon: MessageSquare,
		gradient: "bg-linear-to-br from-blue-500/20 to-blue-500/5",
		color: "text-blue-600",
		label: "Forum",
	},
};

export function NotificationDetailDialog({
	notification,
	open,
	onOpenChange,
	onMarkRead,
}: NotificationDetailDialogProps) {
	if (!notification) return null;

	const config = typeConfig[notification.type] ?? typeConfig.system;
	const Icon = config.icon;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md rounded-2xl sm:rounded-2xl">
				<DialogHeader className="pb-0">
					<div className="flex items-start gap-3">
						<div
							className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.gradient}`}
						>
							<Icon className={`h-5 w-5 ${config.color}`} />
						</div>
						<div className="min-w-0 flex-1">
							<DialogTitle className="text-base leading-snug">
								{notification.title}
							</DialogTitle>
							<div className="mt-1 flex items-center gap-2">
								<span
									className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${config.gradient} ${config.color}`}
								>
									{config.label}
								</span>
								<span className="text-muted-foreground text-[11px]">
									{formatRelativeTime(notification.createdAt)}
								</span>
							</div>
						</div>
					</div>
				</DialogHeader>

				<div className="mt-2 rounded-xl bg-muted/30 p-4">
					<p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
						{notification.message}
					</p>
				</div>

				<div className="flex items-center justify-end gap-2 pt-1">
					{!notification.isRead && onMarkRead && (
						<Button
							variant="outline"
							size="sm"
							className="rounded-xl text-xs"
							onClick={() => {
								onMarkRead();
								onOpenChange(false);
							}}
						>
							Mark as read
						</Button>
					)}
					<Button
						size="sm"
						className="rounded-xl text-xs"
						onClick={() => onOpenChange(false)}
					>
						Dismiss
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

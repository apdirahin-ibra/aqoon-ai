"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MessageSquare, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
	const currentUser = useQuery(api.users.current);
	const conversations = useQuery(api.messagesApi.listConversations);
	const sendMessage = useMutation(api.messagesApi.send);
	const markAsRead = useMutation(api.messagesApi.markRead);

	const [selectedPartnerId, setSelectedPartnerId] =
		useState<Id<"users"> | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [newMessage, setNewMessage] = useState("");

	const thread = useQuery(
		api.messagesApi.getThread,
		selectedPartnerId ? { partnerId: selectedPartnerId } : "skip",
	);

	useEffect(() => {
		if (selectedPartnerId) {
			markAsRead({ partnerId: selectedPartnerId });
		}
	}, [selectedPartnerId, markAsRead]);

	const formatTime = (timestamp: number) => {
		const diff = Date.now() - timestamp;
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours < 1) return "Just now";
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 7) return `${days}d ago`;
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((w) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	const handleSend = async () => {
		if (!newMessage.trim() || !selectedPartnerId) return;
		await sendMessage({
			receiverId: selectedPartnerId,
			content: newMessage.trim(),
		});
		setNewMessage("");
	};

	if (conversations === undefined || currentUser === undefined) {
		return (
			<div className="container py-8">
				<Skeleton className="mb-1 h-8 w-32" />
				<Skeleton className="mb-5 h-4 w-56" />
				<div className="grid h-[400px] gap-4 lg:grid-cols-[280px_1fr]">
					<Skeleton className="rounded-2xl" />
					<Skeleton className="rounded-2xl" />
				</div>
			</div>
		);
	}

	const filtered = conversations.filter((c) =>
		c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const selectedConversation = conversations.find(
		(c) => c.partnerId === selectedPartnerId,
	);

	return (
		<div className="container py-8">
			<div className="mb-5">
				<h1 className="mb-1 font-bold font-display text-2xl">Messages</h1>
				<p className="text-muted-foreground text-sm">
					Stay connected with tutors and classmates
				</p>
			</div>

			<div className="grid h-[calc(100vh-220px)] min-h-[400px] gap-4 lg:grid-cols-[280px_1fr]">
				<Card className="flex flex-col overflow-hidden rounded-2xl shadow-sm">
					<div className="border-b p-2">
						<div className="relative">
							<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search..."
								className="h-8 rounded-lg pl-8 text-xs"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto">
						{filtered.length > 0 ? (
							filtered.map((conv) => (
								<button
									key={conv.partnerId}
									type="button"
									onClick={() => setSelectedPartnerId(conv.partnerId)}
									className={cn(
										"flex w-full items-center gap-2.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
										selectedPartnerId === conv.partnerId && "bg-primary/5",
									)}
								>
									<Avatar className="h-8 w-8 shrink-0">
										<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs">
											{getInitials(conv.partnerName)}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between">
											<span className="truncate font-medium text-xs">
												{conv.partnerName}
											</span>
											<span className="shrink-0 text-[10px] text-muted-foreground">
												{formatTime(conv.lastMessageAt)}
											</span>
										</div>
										<p className="truncate text-[11px] text-muted-foreground">
											{conv.lastMessage}
										</p>
									</div>
									{conv.unreadCount > 0 && (
										<span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-[9px] text-primary-foreground">
											{conv.unreadCount}
										</span>
									)}
								</button>
							))
						) : (
							<div className="flex flex-col items-center justify-center p-6 text-center">
								<MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
								<p className="text-muted-foreground text-xs">
									No conversations yet
								</p>
							</div>
						)}
					</div>
				</Card>

				<Card className="flex flex-col overflow-hidden rounded-2xl shadow-sm">
					{selectedConversation && thread ? (
						<>
							<div className="flex items-center gap-2.5 border-b px-4 py-2.5">
								<Avatar className="h-7 w-7">
									<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs">
										{getInitials(selectedConversation.partnerName)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium text-sm">
										{selectedConversation.partnerName}
									</p>
								</div>
							</div>

							<div className="flex-1 space-y-3 overflow-y-auto p-4">
								{thread.map((msg) => {
									const isMe = currentUser && msg.senderId === currentUser._id;
									return (
										<div
											key={msg._id}
											className={cn(
												"flex",
												isMe ? "justify-end" : "justify-start",
											)}
										>
											<div
												className={cn(
													"max-w-[75%] rounded-2xl px-3 py-2 text-xs",
													isMe
														? "bg-linear-to-br from-primary to-primary/90 text-primary-foreground"
														: "bg-muted",
												)}
											>
												<p>{msg.content}</p>
												<p
													className={cn(
														"mt-1 text-[9px]",
														isMe
															? "text-primary-foreground/70"
															: "text-muted-foreground",
													)}
												>
													{formatTime(msg.createdAt)}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="border-t p-2.5">
								<form
									onSubmit={(e) => {
										e.preventDefault();
										handleSend();
									}}
									className="flex gap-2"
								>
									<Input
										placeholder="Type a message..."
										className="h-8 rounded-xl text-xs"
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
									/>
									<Button
										type="submit"
										size="sm"
										className="h-8 rounded-xl px-3"
									>
										<Send className="h-3.5 w-3.5" />
									</Button>
								</form>
							</div>
						</>
					) : (
						<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
							Select a conversation
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}

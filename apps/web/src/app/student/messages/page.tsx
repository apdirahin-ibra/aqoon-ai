"use client";

import { Loader2, Search, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Conversation {
	id: string;
	name: string;
	lastMessage: string;
	timestamp: string;
	unread: number;
	avatar: string;
}

interface Message {
	id: string;
	content: string;
	sender: "me" | "other";
	timestamp: string;
}

const mockConversations: Conversation[] = [
	{
		id: "1",
		name: "Dr. Sarah Smith",
		lastMessage: "Great question about React hooks!",
		timestamp: "10:30 AM",
		unread: 2,
		avatar: "SS",
	},
	{
		id: "2",
		name: "Prof. Ahmed Ali",
		lastMessage: "The assignment is due Friday",
		timestamp: "Yesterday",
		unread: 0,
		avatar: "AA",
	},
	{
		id: "3",
		name: "Study Group",
		lastMessage: "Who's joining the session?",
		timestamp: "Mon",
		unread: 5,
		avatar: "SG",
	},
];

const mockMessages: Message[] = [
	{
		id: "1",
		content:
			"Hi Dr. Smith, I have a question about the useEffect cleanup function",
		sender: "me",
		timestamp: "10:25 AM",
	},
	{
		id: "2",
		content:
			"Great question about React hooks! The cleanup function runs when the component unmounts or before the effect runs again.",
		sender: "other",
		timestamp: "10:30 AM",
	},
	{
		id: "3",
		content: "That makes sense! So it's similar to componentWillUnmount?",
		sender: "me",
		timestamp: "10:32 AM",
	},
];

export default function MessagesPage() {
	const [conversations] = useState<Conversation[]>(mockConversations);
	const [messages] = useState<Message[]>(mockMessages);
	const [selectedConversation, setSelectedConversation] = useState<
		string | null
	>("1");
	const [searchQuery, setSearchQuery] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const [loading] = useState(false);

	const filtered = conversations.filter((c) =>
		c.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const selectedPerson = conversations.find(
		(c) => c.id === selectedConversation,
	);

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mb-5">
				<h1 className="mb-1 font-bold font-display text-2xl">Messages</h1>
				<p className="text-muted-foreground text-sm">
					Stay connected with tutors and classmates
				</p>
			</div>

			<div className="grid h-[calc(100vh-220px)] min-h-[400px] gap-4 lg:grid-cols-[280px_1fr]">
				{/* Conversation List */}
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
						{filtered.map((conv) => (
							<button
								key={conv.id}
								type="button"
								onClick={() => setSelectedConversation(conv.id)}
								className={cn(
									"flex w-full items-center gap-2.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
									selectedConversation === conv.id && "bg-primary/5",
								)}
							>
								<Avatar className="h-8 w-8 shrink-0">
									<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs">
										{conv.avatar}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between">
										<span className="truncate font-medium text-xs">
											{conv.name}
										</span>
										<span className="shrink-0 text-[10px] text-muted-foreground">
											{conv.timestamp}
										</span>
									</div>
									<p className="truncate text-[11px] text-muted-foreground">
										{conv.lastMessage}
									</p>
								</div>
								{conv.unread > 0 && (
									<span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-[9px] text-primary-foreground">
										{conv.unread}
									</span>
								)}
							</button>
						))}
					</div>
				</Card>

				{/* Chat Area */}
				<Card className="flex flex-col overflow-hidden rounded-2xl shadow-sm">
					{selectedPerson ? (
						<>
							<div className="flex items-center gap-2.5 border-b px-4 py-2.5">
								<Avatar className="h-7 w-7">
									<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs">
										{selectedPerson.avatar}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium text-sm">{selectedPerson.name}</p>
									<p className="text-[10px] text-muted-foreground">Online</p>
								</div>
							</div>

							<div className="flex-1 space-y-3 overflow-y-auto p-4">
								{messages.map((msg) => (
									<div
										key={msg.id}
										className={cn(
											"flex",
											msg.sender === "me" ? "justify-end" : "justify-start",
										)}
									>
										<div
											className={cn(
												"max-w-[75%] rounded-2xl px-3 py-2 text-xs",
												msg.sender === "me"
													? "bg-linear-to-br from-primary to-primary/90 text-primary-foreground"
													: "bg-muted",
											)}
										>
											<p>{msg.content}</p>
											<p
												className={cn(
													"mt-1 text-[9px]",
													msg.sender === "me"
														? "text-primary-foreground/70"
														: "text-muted-foreground",
												)}
											>
												{msg.timestamp}
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="border-t p-2.5">
								<div className="flex gap-2">
									<Input
										placeholder="Type a message..."
										className="h-8 rounded-xl text-xs"
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
									/>
									<Button size="sm" className="h-8 rounded-xl px-3">
										<Send className="h-3.5 w-3.5" />
									</Button>
								</div>
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

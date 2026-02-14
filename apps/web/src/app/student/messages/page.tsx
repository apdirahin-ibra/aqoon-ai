"use client";

import { MessageSquare, Search, Send, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: string;
	isOwn: boolean;
}

interface Conversation {
	id: string;
	userId: string;
	userName: string;
	lastMessage: string;
	timestamp: string;
	unreadCount: number;
	messages: Message[];
}

const mockConversations: Conversation[] = [
	{
		id: "1",
		userId: "u1",
		userName: "John Smith",
		lastMessage: "Thanks for the help!",
		timestamp: "2 hours ago",
		unreadCount: 2,
		messages: [
			{
				id: "m1",
				senderId: "u1",
				senderName: "John Smith",
				content: "Hi, I have a question about the lesson",
				timestamp: "3 hours ago",
				isOwn: false,
			},
			{
				id: "m2",
				senderId: "me",
				senderName: "Me",
				content: "Sure, what would you like to know?",
				timestamp: "3 hours ago",
				isOwn: true,
			},
			{
				id: "m3",
				senderId: "u1",
				senderName: "John Smith",
				content: "Thanks for the help!",
				timestamp: "2 hours ago",
				isOwn: false,
			},
		],
	},
	{
		id: "2",
		userId: "u2",
		userName: "Sarah Johnson",
		lastMessage: "See you in the next lesson!",
		timestamp: "Yesterday",
		unreadCount: 0,
		messages: [
			{
				id: "m4",
				senderId: "u2",
				senderName: "Sarah Johnson",
				content: "Great course!",
				timestamp: "Yesterday",
				isOwn: false,
			},
			{
				id: "m5",
				senderId: "me",
				senderName: "Me",
				content: "Agreed! Love the content",
				timestamp: "Yesterday",
				isOwn: true,
			},
			{
				id: "m6",
				senderId: "u2",
				senderName: "Sarah Johnson",
				content: "See you in the next lesson!",
				timestamp: "Yesterday",
				isOwn: false,
			},
		],
	},
];

export default function MessagesPage() {
	const [conversations] = useState<Conversation[]>(mockConversations);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(mockConversations[0]);
	const [newMessage, setNewMessage] = useState("");

	const sendMessage = () => {
		if (newMessage.trim()) {
			setNewMessage("");
		}
	};

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">Messages</h1>
				<p className="text-muted-foreground">
					Chat with other students and tutors
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<Card>
						<CardHeader className="pb-3">
							<div className="relative">
								<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search conversations..."
									className="pl-10"
								/>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							{conversations.map((conv) => (
								<button
									key={conv.id}
									onClick={() => setSelectedConversation(conv)}
									className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted ${
										selectedConversation?.id === conv.id ? "bg-muted" : ""
									}`}
								>
									<div className="relative">
										<Avatar>
											<AvatarFallback>{conv.userName.charAt(0)}</AvatarFallback>
										</Avatar>
										{conv.unreadCount > 0 && (
											<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
												{conv.unreadCount}
											</span>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between">
											<p className="truncate font-medium">{conv.userName}</p>
											<span className="text-muted-foreground text-xs">
												{conv.timestamp}
											</span>
										</div>
										<p className="truncate text-muted-foreground text-sm">
											{conv.lastMessage}
										</p>
									</div>
								</button>
							))}
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-2">
					<Card className="flex h-[600px] flex-col">
						{selectedConversation ? (
							<>
								<CardHeader className="border-b">
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback>
												{selectedConversation.userName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<CardTitle>{selectedConversation.userName}</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="flex-1 space-y-4 overflow-y-auto">
									{selectedConversation.messages.map((message) => (
										<div
											key={message.id}
											className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
										>
											<div
												className={`max-w-[70%] rounded-lg p-3 ${
													message.isOwn
														? "bg-primary text-primary-foreground"
														: "bg-muted"
												}`}
											>
												<p>{message.content}</p>
												<p
													className={`mt-1 text-xs ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
												>
													{message.timestamp}
												</p>
											</div>
										</div>
									))}
								</CardContent>
								<div className="border-t p-4">
									<div className="flex gap-2">
										<Input
											placeholder="Type a message..."
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											onKeyDown={(e) => e.key === "Enter" && sendMessage()}
										/>
										<Button onClick={sendMessage}>
											<Send className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</>
						) : (
							<CardContent className="flex h-full items-center justify-center">
								<div className="text-center">
									<MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
									<p className="text-muted-foreground">
										Select a conversation to start chatting
									</p>
								</div>
							</CardContent>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}

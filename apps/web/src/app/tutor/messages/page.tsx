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
import { cn, formatRelativeTime } from "@/lib/utils";

export default function TutorMessagesPage() {
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedPartnerId) return;
    try {
      await sendMessage({
        receiverId: selectedPartnerId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch {
      // Error handled by Convex
    }
  };

  const filteredConversations = conversations?.filter(
    (c) =>
      !searchQuery ||
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-1 font-bold font-display text-3xl">Messages</h1>
        <p className="text-muted-foreground">Communicate with your students</p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-3" style={{ height: "600px" }}>
          {/* Conversation List */}
          <div className="border-r border-border">
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div
              className="overflow-y-auto"
              style={{ height: "calc(600px - 56px)" }}
            >
              {conversations === undefined ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton
                      key={`conv-skel-${i}`}
                      className="h-16 w-full rounded-lg"
                    />
                  ))}
                </div>
              ) : filteredConversations && filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    type="button"
                    key={conv.partnerId}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border/50 p-3 text-left transition-colors hover:bg-muted/50",
                      selectedPartnerId === conv.partnerId && "bg-muted/80",
                    )}
                    onClick={() =>
                      setSelectedPartnerId(conv.partnerId as Id<"users">)
                    }
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">
                        {getInitials(conv.partnerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {conv.partnerName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-muted-foreground text-xs">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 font-medium text-white text-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">
                    No conversations yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thread */}
          <div className="flex flex-col md:col-span-2">
            {selectedPartnerId && thread ? (
              <>
                <div
                  className="flex-1 space-y-3 overflow-y-auto p-4"
                  style={{
                    height: "calc(600px - 56px)",
                  }}
                >
                  {thread.map((msg) => (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex",
                        msg.senderId === currentUser?._id
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          msg.senderId === currentUser?._id
                            ? "bg-emerald-600 text-white"
                            : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={cn(
                            "mt-1 text-[10px]",
                            msg.senderId === currentUser?._id
                              ? "text-white/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatRelativeTime(msg._creationTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-border p-3">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="font-medium text-sm">Select a conversation</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Choose a student to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

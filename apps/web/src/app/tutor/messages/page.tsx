"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";

export default function TutorMessagesPage() {
  const currentUser = useQuery(api.users.current);
  const conversations = useQuery(api.messagesApi.listConversations);
  const sendMessage = useMutation(api.messagesApi.send);
  const markAsRead = useMutation(api.messagesApi.markRead);

  const [selectedPartnerId, setSelectedPartnerId] =
    useState<Id<"users"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const thread = useQuery(
    api.messagesApi.getThread,
    selectedPartnerId ? { partnerId: selectedPartnerId } : "skip",
  );

  const searchResults = useQuery(
    api.users.searchUsers,
    showNewConvo && userSearch.length >= 2 ? { search: userSearch } : "skip",
  );

  useEffect(() => {
    if (selectedPartnerId) {
      markAsRead({ partnerId: selectedPartnerId });
    }
  }, [selectedPartnerId, markAsRead]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedPartnerId) return;
    await sendMessage({
      receiverId: selectedPartnerId,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  const handleStartConversation = (userId: Id<"users">) => {
    setSelectedPartnerId(userId);
    setShowNewConvo(false);
    setUserSearch("");
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

  return (
    <div className="container py-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-bold font-display text-2xl">Messages</h1>
          <p className="text-muted-foreground text-sm">
            Communicate with your students
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-xl"
          onClick={() => setShowNewConvo(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* New Conversation Dialog */}
      {showNewConvo && (
        <Card className="mb-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Start New Conversation</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNewConvo(false);
                setUserSearch("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8 text-sm"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              autoFocus
            />
          </div>
          {searchResults && searchResults.length > 0 && (
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-1">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
                  onClick={() => handleStartConversation(user._id)}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs capitalize">
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {searchResults &&
            searchResults.length === 0 &&
            userSearch.length >= 2 && (
              <p className="mt-2 text-center text-muted-foreground text-sm">
                No users found
              </p>
            )}
        </Card>
      )}

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
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-muted-foreground text-xs">
                  No conversations yet
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 text-xs"
                  onClick={() => setShowNewConvo(true)}
                >
                  Start a new one
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Thread */}
        <Card className="flex flex-col overflow-hidden rounded-2xl shadow-sm">
          {selectedPartnerId ? (
            <>
              <div className="border-b px-4 py-3">
                <h3 className="font-semibold text-sm">
                  {conversations.find((c) => c.partnerId === selectedPartnerId)
                    ?.partnerName ?? "Conversation"}
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
                {(thread ?? []).map((msg) => {
                  const isMe = msg.senderId === currentUser?._id;
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
                          "max-w-[75%] rounded-2xl px-3 py-1.5 text-sm",
                          isMe
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md bg-muted",
                        )}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={cn(
                            "mt-0.5 text-[10px]",
                            isMe
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatRelativeTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t p-3">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="rounded-xl text-sm"
                />
                <Button
                  size="icon"
                  className="rounded-xl"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground text-sm">
                Select a conversation
              </p>
              <p className="text-muted-foreground text-xs">
                or start a new one
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

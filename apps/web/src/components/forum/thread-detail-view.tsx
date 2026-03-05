"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronUp,
  Loader2,
  MessageCircle,
  Pin,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { PostType } from "./forum-post-card";
import { formatRelativeTime } from "@/lib/utils";

const postTypeConfig: Record<PostType, { label: string; className: string }> = {
  question: {
    label: "Question",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  discussion: {
    label: "Discussion",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  bug: {
    label: "Bug",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  help_wanted: {
    label: "Help Wanted",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  announcement: {
    label: "Announcement",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

interface Reply {
  _id: string;
  content: string;
  userName: string;
  userImage?: string;
  userRole: string;
  createdAt: number;
}

interface ThreadDetailViewProps {
  post: {
    _id: string;
    title: string;
    content: string;
    userName: string;
    userImage?: string;
    userRole: string;
    createdAt: number;
    postType: PostType;
    isPinned: boolean;
    isResolved: boolean;
    upvoteCount: number;
    viewCount: number;
    hasUpvoted: boolean;
    isTutor: boolean;
    isAuthor: boolean;
  };
  replies: Reply[];
  onBack: () => void;
  onSubmitReply: (content: string) => Promise<void>;
  onUpvote: () => void;
  onTogglePin?: () => void;
  onToggleResolved?: () => void;
  isSubmitting: boolean;
}

export function ThreadDetailView({
  post,
  replies,
  onBack,
  onSubmitReply,
  onUpvote,
  onTogglePin,
  onToggleResolved,
  isSubmitting,
}: ThreadDetailViewProps) {
  const [replyContent, setReplyContent] = useState("");
  const MAX_REPLY_LENGTH = 10000;

  const trimmedReply = replyContent.trim();
  const replyError = trimmedReply.length > MAX_REPLY_LENGTH;
  const isValid = trimmedReply.length > 0 && !replyError;

  const handleSubmit = async () => {
    if (isValid) {
      await onSubmitReply(trimmedReply);
      setReplyContent("");
    }
  };

  const config = postTypeConfig[post.postType] ?? postTypeConfig.discussion;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Button>

      {/* Main Post */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Voting */}
            <div className="flex min-w-[50px] flex-col items-center gap-1">
              <button
                type="button"
                className={`rounded p-2 transition-colors hover:bg-muted ${post.hasUpvoted ? "text-primary" : ""}`}
                onClick={onUpvote}
                aria-label={post.hasUpvoted ? "Remove upvote" : "Upvote"}
              >
                <ChevronUp
                  className={`h-6 w-6 ${post.hasUpvoted ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                />
              </button>
              <span className="font-bold text-lg">{post.upvoteCount}</span>
            </div>

            <div className="flex-1">
              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {post.isPinned && (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    <Pin className="mr-1 h-3 w-3" />
                    Pinned
                  </Badge>
                )}
                <Badge className={config.className} variant="secondary">
                  {config.label}
                </Badge>
                {post.isResolved && (
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Resolved
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-3 font-bold text-2xl">{post.title}</h1>

              {/* Author Info */}
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.userImage || undefined} />
                  <AvatarFallback>
                    {post.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{post.userName}</p>
                    {post.userRole === "tutor" && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                        Tutor
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Tutor Actions */}
              {(post.isTutor || post.isAuthor) && (
                <div className="mt-4 flex gap-2 border-t pt-4">
                  {post.isTutor && (
                    <Button variant="outline" size="sm" onClick={onTogglePin}>
                      <Pin className="mr-1 h-3 w-3" />
                      {post.isPinned ? "Unpin" : "Pin"}
                    </Button>
                  )}
                  {(post.isTutor || post.isAuthor) &&
                    post.postType === "question" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleResolved}
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {post.isResolved ? "Unresolve" : "Mark Resolved"}
                      </Button>
                    )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Replies ({replies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            {replies.map((reply) => (
              <div
                key={reply._id}
                className="flex gap-3 rounded-lg bg-muted/50 p-4"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reply.userImage || undefined} />
                  <AvatarFallback className="text-xs">
                    {reply.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-medium text-sm">{reply.userName}</p>
                    {reply.userRole === "tutor" && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                        Tutor
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {formatRelativeTime(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{reply.content}</p>
                </div>
              </div>
            ))}

            {replies.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No replies yet. Be the first to respond!</p>
              </div>
            )}
          </div>

          {/* Reply Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Your Reply</span>
              <span
                className={`text-xs ${replyError ? "text-destructive" : "text-muted-foreground"}`}
              >
                {trimmedReply.length}/{MAX_REPLY_LENGTH}
              </span>
            </div>
            <div className="flex gap-3">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className={`flex-1 ${replyError ? "border-destructive" : ""}`}
                maxLength={MAX_REPLY_LENGTH + 500}
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                size="icon"
                className="h-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {replyError && (
              <p className="text-destructive text-xs">
                Reply must be {MAX_REPLY_LENGTH} characters or less
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { ChevronUp, Eye, MessageCircle, Pin, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

export type PostType =
  | "question"
  | "discussion"
  | "bug"
  | "help_wanted"
  | "announcement";

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

interface ForumPostCardProps {
  title: string;
  content: string;
  postType?: PostType;
  isPinned?: boolean;
  isResolved?: boolean;
  authorName: string;
  authorAvatar?: string | null;
  authorRole?: string;
  createdAt: number;
  repliesCount: number;
  viewCount?: number;
  voteCount?: number;
  hasUpvoted?: boolean;
  onClick: () => void;
  onUpvote?: (e: React.MouseEvent) => void;
}

export function ForumPostCard({
  title,
  content,
  postType = "discussion",
  isPinned,
  isResolved,
  authorName,
  authorAvatar,
  authorRole,
  createdAt,
  repliesCount,
  viewCount = 0,
  voteCount = 0,
  hasUpvoted = false,
  onClick,
  onUpvote,
}: ForumPostCardProps) {
  const config = postTypeConfig[postType] ?? postTypeConfig.discussion;

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md",
        isPinned && "border-amber-300 bg-amber-50/50 dark:bg-amber-900/10",
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open thread: ${title}`}
    >
      <div className="flex gap-4">
        {/* Voting Section */}
        <div className="flex min-w-[40px] flex-col items-center gap-1">
          <button
            type="button"
            className={cn(
              "rounded p-1 transition-colors hover:bg-muted",
              hasUpvoted && "text-primary",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.(e);
            }}
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
          >
            <ChevronUp
              className={cn(
                "h-5 w-5",
                hasUpvoted
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            />
          </button>
          <span
            className={cn(
              "font-semibold text-sm",
              voteCount > 0 ? "text-primary" : "text-muted-foreground",
            )}
          >
            {voteCount}
          </span>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1">
          {/* Badges Row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {isPinned && (
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
            {isResolved && (
              <Badge
                variant="outline"
                className="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Resolved
              </Badge>
            )}
            <span className="text-muted-foreground text-xs">
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-1 font-semibold text-foreground">
            {title}
          </h3>

          {/* Content Preview */}
          <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
            {content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorAvatar || undefined} />
                <AvatarFallback className="text-xs">
                  {authorName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">
                {authorName}
              </span>
              {authorRole === "tutor" && (
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                  Tutor
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {repliesCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {viewCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

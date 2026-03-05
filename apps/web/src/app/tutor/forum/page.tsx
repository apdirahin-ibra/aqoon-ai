"use client";

import { ArrowRight, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ForumPostCard } from "@/components/forum/forum-post-card";
import type { PostType } from "@/components/forum/forum-post-card";
import { formatRelativeTime } from "@/lib/utils";

export default function TutorForumHubPage() {
  const posts = useQuery(api.forum.listTutorForumActivity);
  const toggleUpvote = useMutation(api.forum.toggleUpvote);
  const [search, setSearch] = useState("");

  const handleUpvote = async (postId: Id<"forumPosts">) => {
    try {
      await toggleUpvote({ postId });
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
    }
  };

  if (posts === undefined) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="mb-6 h-4 w-64" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.courseTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPosts = posts.length;
  const totalReplies = posts.reduce((sum, p) => sum + p.replyCount, 0);
  const uniqueCourses = new Set(posts.map((p) => p.courseId)).size;
  const unanswered = posts.filter((p) => p.replyCount === 0).length;

  return (
    <div className="container py-8">
      {/* Header — gradient banner */}
      <div className="mb-8 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold font-display text-2xl">Forum Activity</h1>
            <p className="text-sm text-white/80">
              All discussions across your courses
            </p>
          </div>
        </div>

        {/* Inline stats */}
        <div className="mt-5 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <p className="font-bold text-xl">{totalPosts}</p>
            <p className="text-[11px] text-white/70">Threads</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <p className="font-bold text-xl">{totalReplies}</p>
            <p className="text-[11px] text-white/70">Replies</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <p className="font-bold text-xl">{uniqueCourses}</p>
            <p className="text-[11px] text-white/70">Courses</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <p className="font-bold text-xl">{unanswered}</p>
            <p className="text-[11px] text-white/70">Unanswered</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search threads or courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts using shared ForumPostCard */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id} className="relative">
              {/* Course badge overlay */}
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                  {post.courseTitle}
                </Badge>
              </div>
              <Link href={`/tutor/courses/${post.courseId}/forum`}>
                <ForumPostCard
                  title={post.title}
                  content={post.content}
                  postType={(post.postType ?? "discussion") as PostType}
                  isPinned={post.isPinned}
                  isResolved={post.isResolved}
                  authorName={post.userName}
                  authorAvatar={post.userImage}
                  authorRole={post.userRole}
                  createdAt={post.createdAt}
                  repliesCount={post.replyCount}
                  viewCount={post.viewCount}
                  voteCount={post.upvoteCount}
                  onClick={() => {}}
                  onUpvote={() => handleUpvote(post._id)}
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <MessageSquare className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="mb-1 font-semibold">No discussions yet</h3>
            <p className="text-muted-foreground text-sm">
              Forum posts from your courses will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

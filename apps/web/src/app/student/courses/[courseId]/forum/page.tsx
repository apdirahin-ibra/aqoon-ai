"use client";

import {
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/utils";

export default function CourseForumPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;

  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<Id<"forumPosts"> | null>(
    null,
  );
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const posts = useQuery(api.forum.listPosts, { courseId });
  const selectedPost = useQuery(
    api.forum.getPost,
    selectedPostId ? { postId: selectedPostId } : "skip",
  );
  const createPost = useMutation(api.forum.createPost);
  const createReply = useMutation(api.forum.createReply);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost({
        courseId,
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !selectedPostId) return;
    setIsSubmitting(true);
    try {
      await createReply({
        postId: selectedPostId,
        content: replyContent.trim(),
      });
      setReplyContent("");
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (posts === undefined) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-20 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()),
  );

  // If a post is selected, show the detail view
  if (selectedPostId && selectedPost) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setSelectedPostId(null)}
            className="mb-4 text-muted-foreground text-sm hover:text-foreground"
          >
            ← Back to Forum
          </button>

          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {selectedPost.userImage ? (
                    <img
                      src={selectedPost.userImage}
                      alt={selectedPost.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold text-primary text-sm">
                      {selectedPost.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {selectedPost.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {selectedPost.userName} ·{" "}
                    {formatRelativeTime(selectedPost.createdAt)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 whitespace-pre-wrap text-foreground/80">
                {selectedPost.content}
              </p>

              {/* Replies */}
              <div className="border-t pt-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-4 w-4" />
                  {selectedPost.replies.length} Replies
                </h3>

                <div className="space-y-4">
                  {selectedPost.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="rounded-lg border bg-muted/30 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {reply.userImage ? (
                            <img
                              src={reply.userImage}
                              alt={reply.userName}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="font-semibold text-primary text-xs">
                              {reply.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-sm">
                          {reply.userName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatRelativeTime(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply form */}
                <div className="mt-6 flex gap-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${courseId}`}
          className="mb-2 block text-muted-foreground text-sm hover:text-foreground"
        >
          ← Back to Course
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold font-display text-3xl">
              Course Forum
            </h1>
            <p className="text-muted-foreground">
              Discuss topics with fellow learners
            </p>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Create Post Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreatePost}
                disabled={
                  !newTitle.trim() || !newContent.trim() || isSubmitting
                }
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="font-bold text-2xl">{posts.length}</p>
              <p className="text-muted-foreground text-xs">Discussions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <MessageCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-bold text-2xl">
                {posts.reduce((sum, p) => sum + p.replyCount, 0)}
              </p>
              <p className="text-muted-foreground text-xs">Replies</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-bold text-2xl">
                {new Set(posts.map((p) => p.userId)).size}
              </p>
              <p className="text-muted-foreground text-xs">Contributors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card
              key={post._id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedPostId(post._id)}
              role="button"
              tabIndex={0}
              aria-label={`Open discussion: ${post.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedPostId(post._id);
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {post.userImage ? (
                      <img
                        src={post.userImage}
                        alt={post.userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-primary text-sm">
                        {post.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {post.content}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
                      <span>{post.userName}</span>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.replyCount} replies
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-xl">No discussions yet</h3>
              <p className="mb-4 text-muted-foreground">
                Be the first to start a discussion!
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Start a Discussion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

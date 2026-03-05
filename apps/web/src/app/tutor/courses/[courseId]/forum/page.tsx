"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ForumPostCard } from "@/components/forum/forum-post-card";
import {
  ForumFilters,
  type ForumTab,
  type PostTag,
} from "@/components/forum/forum-filters";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { NewThreadDialog } from "@/components/forum/new-thread-dialog";
import { ThreadDetailView } from "@/components/forum/thread-detail-view";
import type { PostType } from "@/components/forum/forum-post-card";

export default function TutorCourseForumPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<PostTag>("all");
  const [activeTab, setActiveTab] = useState<ForumTab>("latest");
  const [selectedPostId, setSelectedPostId] = useState<Id<"forumPosts"> | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const posts = useQuery(api.forum.listPosts, { courseId });
  const selectedPost = useQuery(
    api.forum.getPost,
    selectedPostId ? { postId: selectedPostId } : "skip",
  );

  const createPost = useMutation(api.forum.createPost);
  const createReply = useMutation(api.forum.createReply);
  const toggleUpvote = useMutation(api.forum.toggleUpvote);
  const togglePin = useMutation(api.forum.togglePin);
  const toggleResolved = useMutation(api.forum.toggleResolved);
  const incrementView = useMutation(api.forum.incrementViewCount);

  useEffect(() => {
    if (selectedPostId) {
      incrementView({ postId: selectedPostId });
    }
  }, [selectedPostId, incrementView]);

  const handleCreatePost = async (
    title: string,
    content: string,
    postType: PostType,
  ) => {
    setIsSubmitting(true);
    try {
      await createPost({ courseId, title, content, postType });
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (content: string) => {
    if (!selectedPostId) return;
    setIsSubmitting(true);
    try {
      await createReply({ postId: selectedPostId, content });
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Skeleton className="mb-2 h-4 w-48" />
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-6 h-4 w-80" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Thread detail view
  if (selectedPostId && selectedPost) {
    return (
      <div className="container py-8">
        <ThreadDetailView
          post={{
            ...selectedPost,
            postType: (selectedPost.postType ?? "discussion") as PostType,
          }}
          replies={selectedPost.replies}
          onBack={() => setSelectedPostId(null)}
          onSubmitReply={handleSubmitReply}
          onUpvote={() => handleUpvote(selectedPostId)}
          onTogglePin={
            selectedPost.isTutor
              ? () => togglePin({ postId: selectedPostId })
              : undefined
          }
          onToggleResolved={
            selectedPost.isTutor || selectedPost.isAuthor
              ? () => toggleResolved({ postId: selectedPostId })
              : undefined
          }
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Filter + sort
  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !post.title.toLowerCase().includes(q) &&
        !post.content.toLowerCase().includes(q)
      )
        return false;
    }
    if (selectedTag !== "all" && post.postType !== selectedTag) return false;
    if (activeTab === "unanswered" && post.replyCount > 0) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (activeTab === "top") {
      return (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0);
    }
    return b.createdAt - a.createdAt;
  });

  const totalReplies = posts.reduce((sum, p) => sum + p.replyCount, 0);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/tutor">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/tutor/courses">My Courses</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/tutor/courses/${courseId}`}>Edit Course</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Forum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 font-bold font-display text-3xl">Course Forum</h1>
          <p className="text-muted-foreground">
            Engage with your students and moderate discussions.
          </p>
        </div>
        <NewThreadDialog
          onSubmit={handleCreatePost}
          isSubmitting={isSubmitting}
          isTutor
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Posts Column */}
        <div className="space-y-6 lg:col-span-2">
          <ForumFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {sortedPosts.length > 0 ? (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <ForumPostCard
                  key={post._id}
                  title={post.title}
                  content={post.content}
                  postType={post.postType as PostType}
                  isPinned={post.isPinned}
                  isResolved={post.isResolved}
                  authorName={post.userName}
                  authorAvatar={post.userImage}
                  authorRole={post.userRole}
                  createdAt={post.createdAt}
                  repliesCount={post.replyCount}
                  viewCount={post.viewCount}
                  voteCount={post.upvoteCount}
                  hasUpvoted={post.hasUpvoted}
                  onClick={() => setSelectedPostId(post._id)}
                  onUpvote={() => handleUpvote(post._id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card py-16 text-center">
              <MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-xl">No discussions yet</h3>
              <p className="mb-4 text-muted-foreground">
                Start a discussion to engage with your students!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <ForumSidebar
            courseId={courseId}
            totalThreads={posts.length}
            totalReplies={totalReplies}
          />
        </div>
      </div>
    </div>
  );
}

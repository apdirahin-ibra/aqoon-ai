"use client";

import { MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ForumPostCard } from "@/components/forum/forum-post-card";
import { ForumFilters, type ForumTab, type PostTag } from "@/components/forum/forum-filters";
import { ThreadDetailView } from "@/components/forum/thread-detail-view";
import type { PostType } from "@/components/forum/forum-post-card";

export default function TutorForumHubPage() {
	const posts = useQuery(api.forum.listTutorForumActivity);
	const toggleUpvote = useMutation(api.forum.toggleUpvote);
	const togglePin = useMutation(api.forum.togglePin);
	const toggleResolved = useMutation(api.forum.toggleResolved);
	const createReply = useMutation(api.forum.createReply);
	const incrementView = useMutation(api.forum.incrementViewCount);

	const [search, setSearch] = useState("");
	const [selectedTag, setSelectedTag] = useState<PostTag>("all");
	const [activeTab, setActiveTab] = useState<ForumTab>("latest");
	const [selectedPostId, setSelectedPostId] = useState<Id<"forumPosts"> | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedPost = useQuery(
		api.forum.getPost,
		selectedPostId ? { postId: selectedPostId } : "skip",
	);

	useEffect(() => {
		if (selectedPostId) {
			incrementView({ postId: selectedPostId });
		}
	}, [selectedPostId, incrementView]);

	const handleUpvote = async (postId: Id<"forumPosts">) => {
		try {
			await toggleUpvote({ postId });
		} catch (error) {
			console.error("Failed to toggle upvote:", error);
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

	// Thread detail view
	if (selectedPostId && selectedPost) {
		const hubPost = posts.find((p) => p._id === selectedPostId);
		return (
			<div className="container py-8">
				{hubPost && (
					<Badge variant="secondary" className="mb-4">
						{hubPost.courseTitle}
					</Badge>
				)}
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
	const filteredPosts = posts.filter((p) => {
		if (search) {
			const q = search.toLowerCase();
			if (
				!p.title.toLowerCase().includes(q) &&
				!p.courseTitle.toLowerCase().includes(q) &&
				!p.content.toLowerCase().includes(q)
			)
				return false;
		}
		if (selectedTag !== "all" && p.postType !== selectedTag) return false;
		if (activeTab === "unanswered" && p.replyCount > 0) return false;
		return true;
	});

	const sortedPosts = [...filteredPosts].sort((a, b) => {
		if (a.isPinned && !b.isPinned) return -1;
		if (!a.isPinned && b.isPinned) return 1;
		if (activeTab === "top") return (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0);
		return b.createdAt - a.createdAt;
	});

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
						<h1 className="font-bold font-display text-2xl">
							Forum Activity
						</h1>
						<p className="text-sm text-white/80">
							All discussions across your courses
						</p>
					</div>
				</div>

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

			{/* Filters — search + tag + tabs */}
			<div className="mb-6">
				<ForumFilters
					searchQuery={search}
					onSearchChange={setSearch}
					selectedTag={selectedTag}
					onTagChange={setSelectedTag}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
			</div>

			{/* Posts */}
			<div className="space-y-4">
				{sortedPosts.length > 0 ? (
					sortedPosts.map((post) => (
						<div key={post._id} className="relative">
							<div className="absolute top-2 right-2 z-10">
								<Badge
									variant="secondary"
									className="px-2 py-0.5 text-[10px]"
								>
									{post.courseTitle}
								</Badge>
							</div>
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
								onClick={() => setSelectedPostId(post._id)}
								onUpvote={() => handleUpvote(post._id)}
							/>
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
							<MessageSquare className="h-8 w-8 text-emerald-500" />
						</div>
						<h3 className="mb-1 font-semibold">
							No discussions found
						</h3>
						<p className="text-muted-foreground text-sm">
							{search || selectedTag !== "all"
								? "Try adjusting your filters"
								: "Forum posts from your courses will appear here"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import {
	ArrowRight,
	Bot,
	Bug,
	ChevronUp,
	HelpCircle,
	Megaphone,
	MessageCircle,
	MessageSquare,
	Search,
	Send,
	Star,
	ThumbsUp,
	TrendingUp,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PostType = "question" | "discussion" | "bug" | "help_wanted";
type ForumTab = "latest" | "top" | "unanswered" | "my_posts";

interface Reply {
	id: string;
	content: string;
	authorName: string;
	authorAvatar: string | null;
	createdAt: string;
}

interface ForumPost {
	id: string;
	title: string;
	content: string;
	authorName: string;
	authorAvatar: string | null;
	createdAt: string;
	repliesCount: number;
	views: number;
	votes: number;
	postType: PostType;
	isPinned: boolean;
	isAiAnswered: boolean;
}

const mockReplies: Record<string, Reply[]> = {
	"1": [
		{
			id: "r1",
			content:
				"Great question! I usually wrap my async calls in a try-catch block and then use a custom error handler to log it and show a user-friendly message.",
			authorName: "Sarah Johnson",
			authorAvatar: null,
			createdAt: "2024-01-15T11:00:00Z",
		},
		{
			id: "r2",
			content:
				"Don't forget to handle the case where the promise might reject with something that isn't an Error object. It's rare but it happens!",
			authorName: "Mike Brown",
			authorAvatar: null,
			createdAt: "2024-01-15T12:30:00Z",
		},
	],
	"2": [
		{
			id: "r3",
			content:
				"The official React docs (beta) are actually amazing for learning hooks now. They have great interactive examples.",
			authorName: "Emily Davis",
			authorAvatar: null,
			createdAt: "2024-01-14T16:00:00Z",
		},
	],
};

const mockPosts: ForumPost[] = [
	{
		id: "1",
		title: "How do I handle async/await errors properly?",
		content:
			"I'm having trouble understanding the best practices for error handling in async functions...",
		authorName: "John Smith",
		authorAvatar: null,
		createdAt: "2024-01-15T10:30:00Z",
		repliesCount: 2,
		views: 120,
		votes: 12,
		postType: "question",
		isPinned: false,
		isAiAnswered: true,
	},
	{
		id: "2",
		title: "Best resources for learning React hooks",
		content:
			"Looking for recommendations on tutorials or courses to deepen my understanding of hooks...",
		authorName: "Sarah Johnson",
		authorAvatar: null,
		createdAt: "2024-01-14T15:20:00Z",
		repliesCount: 1,
		views: 200,
		votes: 25,
		postType: "discussion",
		isPinned: true,
		isAiAnswered: false,
	},
	{
		id: "3",
		title: "Bug in lesson 5: Code example not working",
		content:
			"The code example in the video throws an error when I try to run it...",
		authorName: "Mike Brown",
		authorAvatar: null,
		createdAt: "2024-01-13T09:00:00Z",
		repliesCount: 0,
		views: 45,
		votes: 8,
		postType: "bug",
		isPinned: false,
		isAiAnswered: true,
	},
	{
		id: "4",
		title: "Need help with TypeScript generics",
		content:
			"Could someone explain how generics work in TypeScript? I'm struggling to understand...",
		authorName: "Emily Davis",
		authorAvatar: null,
		createdAt: "2024-01-12T14:45:00Z",
		repliesCount: 0,
		views: 30,
		votes: 5,
		postType: "help_wanted",
		isPinned: false,
		isAiAnswered: false,
	},
];

const postTypeConfig: Record<
	PostType,
	{ label: string; icon: React.ElementType; gradient: string; color: string }
> = {
	question: {
		label: "Question",
		icon: HelpCircle,
		gradient: "bg-linear-to-br from-blue-500/20 to-blue-500/5",
		color: "text-blue-500",
	},
	discussion: {
		label: "Discussion",
		icon: MessageSquare,
		gradient: "bg-linear-to-br from-success/20 to-success/5",
		color: "text-success",
	},
	bug: {
		label: "Bug",
		icon: Bug,
		gradient: "bg-linear-to-br from-destructive/20 to-destructive/5",
		color: "text-destructive",
	},
	help_wanted: {
		label: "Help Wanted",
		icon: HelpCircle,
		gradient: "bg-linear-to-br from-warning/20 to-warning/5",
		color: "text-warning",
	},
};

const badgeColors = {
	Gold: "text-amber-500",
	Silver: "text-slate-400",
	Bronze: "text-orange-600",
};

const mockContributors = [
	{
		id: "1",
		name: "Top Student",
		points: 520,
		badge: "Gold" as const,
		rank: 1,
	},
	{
		id: "2",
		name: "Helper Pro",
		points: 380,
		badge: "Silver" as const,
		rank: 2,
	},
	{
		id: "3",
		name: "Active Learner",
		points: 290,
		badge: "Bronze" as const,
		rank: 3,
	},
];

export default function CourseForumPage() {
	const params = useParams();
	const courseId = params.courseId as string;
	const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<ForumTab>("latest");
	const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
	const [isCreatingPost, setIsCreatingPost] = useState(false);
	const [newPostTitle, setNewPostTitle] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [newPostType, setNewPostType] = useState<PostType>("question");
	const [replyContent, setReplyContent] = useState("");

	const filteredPosts = posts.filter((post) => {
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			if (
				!post.title.toLowerCase().includes(query) &&
				!post.content.toLowerCase().includes(query)
			) {
				return false;
			}
		}
		if (activeTab === "unanswered" && post.repliesCount > 0) return false;
		return true;
	});

	const sortedPosts = [...filteredPosts].sort((a, b) => {
		if (activeTab === "top") return b.votes - a.votes;
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const formatTime = (date: string) => {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		if (days === 0) return "Today";
		if (days === 1) return "Yesterday";
		if (days < 7) return `${days}d ago`;
		return d.toLocaleDateString();
	};

	const createPost = () => {
		if (!newPostTitle.trim() || !newPostContent.trim()) return;

		const newPost: ForumPost = {
			id: Date.now().toString(),
			title: newPostTitle,
			content: newPostContent,
			authorName: "You",
			authorAvatar: null,
			createdAt: new Date().toISOString(),
			repliesCount: 0,
			views: 0,
			votes: 0,
			postType: newPostType,
			isPinned: false,
			isAiAnswered: false,
		};

		setPosts([newPost, ...posts]);
		setIsCreatingPost(false);
		setNewPostTitle("");
		setNewPostContent("");
	};

	const handleSubmitReply = () => {
		if (!replyContent.trim()) return;
		setReplyContent("");
	};

	// Post Detail View
	if (selectedPost) {
		const postReplies = mockReplies[selectedPost.id] || [];

		return (
			<div className="container py-8">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setSelectedPost(null)}
					className="mb-4"
				>
					← Back to Forum
				</Button>

				<div className="space-y-6">
					<Card>
						<CardContent className="pt-6">
							<div className="flex gap-6">
								<div className="flex flex-col items-center gap-2 pt-1">
									<button className="rounded-lg p-1 transition-colors hover:bg-muted">
										<ChevronUp className="h-6 w-6 text-muted-foreground hover:text-primary" />
									</button>
									<span className="font-bold text-lg">
										{selectedPost.votes}
									</span>
									<button className="rotate-180 rounded-lg p-1 transition-colors hover:bg-muted">
										<ChevronUp className="h-6 w-6 text-muted-foreground hover:text-destructive" />
									</button>
								</div>

								<div className="flex-1">
									<div className="mb-4 flex flex-wrap items-center gap-2">
										<Badge variant="secondary">
											{postTypeConfig[selectedPost.postType].label}
										</Badge>
										{selectedPost.isPinned && (
											<Badge
												variant="outline"
												className="border-amber-500/50 bg-amber-500/10 text-amber-500"
											>
												Pinned
											</Badge>
										)}
										{selectedPost.isAiAnswered && (
											<Badge className="bg-success text-success-foreground">
												AI Answered
											</Badge>
										)}
									</div>

									<h1 className="mb-4 font-bold font-display text-2xl lg:text-3xl">
										{selectedPost.title}
									</h1>

									<div className="mb-6 flex items-center gap-3">
										<Avatar className="h-10 w-10">
											<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-sm">
												{selectedPost.authorName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">{selectedPost.authorName}</p>
											<p className="text-muted-foreground text-xs">
												{formatTime(selectedPost.createdAt)}
											</p>
										</div>
									</div>

									<div className="prose prose-sm dark:prose-invert mb-8 max-w-none text-muted-foreground italic">
										<p className="whitespace-pre-line leading-relaxed">
											{selectedPost.content}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<MessageCircle className="h-5 w-5" />
								Replies ({postReplies.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{postReplies.map((reply) => (
									<div
										key={reply.id}
										className="flex gap-4 rounded-2xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
									>
										<Avatar className="h-8 w-8 shrink-0">
											<AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/5 text-xs">
												{reply.authorName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="mb-1 flex items-center gap-2">
												<p className="font-medium text-sm">
													{reply.authorName}
												</p>
												<span className="text-muted-foreground text-xs">
													{formatTime(reply.createdAt)}
												</span>
											</div>
											<p className="text-muted-foreground text-sm leading-relaxed">
												{reply.content}
											</p>
										</div>
									</div>
								))}

								{postReplies.length === 0 && (
									<div className="py-12 text-center">
										<MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
										<p className="text-muted-foreground">No replies yet.</p>
									</div>
								)}

								<div className="mt-8 border-t pt-6">
									<div className="mb-4 flex items-center justify-between">
										<h4 className="font-medium text-sm">Post a Reply</h4>
										<span className="text-muted-foreground text-xs">
											{replyContent.length} characters
										</span>
									</div>
									<div className="flex gap-4">
										<Textarea
											placeholder="Share your thoughts..."
											value={replyContent}
											onChange={(e) => setReplyContent(e.target.value)}
											className="min-h-[100px] rounded-2xl bg-muted/20"
										/>
										<Button
											onClick={handleSubmitReply}
											disabled={!replyContent.trim()}
											className="h-auto rounded-2xl px-6"
										>
											<Send className="mr-2 h-4 w-4" />
											Reply
										</Button>
									</div>
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
			{/* Breadcrumb */}
			<div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
				<Link href="/student" className="hover:text-foreground">
					Dashboard
				</Link>
				<span>/</span>
				<Link href={`/courses/${courseId}`} className="hover:text-foreground">
					Course
				</Link>
				<span>/</span>
				<span className="text-foreground">Discussion Forum</span>
			</div>

			{/* Header */}
			<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">
						Course Discussion Forum
					</h1>
					<p className="text-muted-foreground">
						Connect with peers, ask questions, and share your knowledge.
					</p>
				</div>
				<Button onClick={() => setIsCreatingPost(true)}>
					<MessageSquare className="mr-2 h-4 w-4" />
					New Thread
				</Button>
			</div>

			{/* Create Post Form */}
			{isCreatingPost && (
				<Card className="mb-6">
					<CardContent className="p-6">
						<h2 className="mb-4 font-semibold text-lg">Create New Thread</h2>
						<div className="space-y-4">
							<div>
								<label className="mb-1.5 block font-medium text-sm">
									Title
								</label>
								<Input
									placeholder="Enter your question or topic..."
									value={newPostTitle}
									onChange={(e) => setNewPostTitle(e.target.value)}
								/>
							</div>
							<div>
								<label className="mb-1.5 block font-medium text-sm">Type</label>
								<div className="flex gap-2">
									{(Object.keys(postTypeConfig) as PostType[]).map((type) => (
										<Button
											key={type}
											variant={newPostType === type ? "default" : "outline"}
											size="sm"
											onClick={() => setNewPostType(type)}
										>
											{postTypeConfig[type].label}
										</Button>
									))}
								</div>
							</div>
							<div>
								<label className="mb-1.5 block font-medium text-sm">
									Content
								</label>
								<textarea
									className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									placeholder="Describe your question or topic..."
									value={newPostContent}
									onChange={(e) => setNewPostContent(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<Button onClick={createPost}>Create Thread</Button>
								<Button
									variant="outline"
									onClick={() => setIsCreatingPost(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<div className="relative">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search discussions..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex gap-2">
						{(
							[
								["latest", "Latest"],
								["top", "Top"],
								["unanswered", "Unanswered"],
							] as [ForumTab, string][]
						).map(([tab, label]) => (
							<Button
								key={tab}
								variant={activeTab === tab ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab(tab)}
							>
								{tab === "top" && <TrendingUp className="mr-1.5 h-3.5 w-3.5" />}
								{label}
							</Button>
						))}
					</div>

					{sortedPosts.length > 0 ? (
						<>
							<div className="space-y-4">
								{sortedPosts.map((post, _i) => {
									const config = postTypeConfig[post.postType];
									return (
										<Card
											key={post.id}
											className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => setSelectedPost(post)}
										>
											<CardContent className="p-4">
												<div className="flex items-start gap-3">
													<Avatar className="h-9 w-9 shrink-0">
														<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-xs">
															{post.authorName.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0 flex-1">
														<div className="mb-1.5 flex items-center gap-2">
															<Badge variant="outline" className="text-xs">
																{config.label}
															</Badge>
															{post.isPinned && (
																<span className="font-medium text-primary text-xs">
																	Pinned
																</span>
															)}
															{post.isAiAnswered && (
																<Badge className="bg-success text-success-foreground text-xs">
																	AI
																</Badge>
															)}
														</div>
														<h3 className="mb-1 line-clamp-1 font-semibold">
															{post.title}
														</h3>
														<p className="mb-2 line-clamp-1 text-muted-foreground text-sm">
															{post.content}
														</p>
														<div className="flex items-center gap-4 text-muted-foreground text-xs">
															<span>{post.authorName}</span>
															<span>{formatTime(post.createdAt)}</span>
															<span>{post.views} views</span>
															<span>{post.repliesCount} replies</span>
															<span className="flex items-center gap-1">
																<ThumbsUp className="h-3 w-3" />
																{post.votes}
															</span>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
							<div className="text-center">
								<Button variant="outline">Load more threads</Button>
							</div>
						</>
					) : (
						<Card>
							<CardContent className="py-16 text-center">
								<MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
								<h3 className="mb-2 font-semibold text-xl">
									No discussions yet
								</h3>
								<p className="text-muted-foreground">
									Be the first to start a discussion!
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				<div className="hidden space-y-4 lg:block">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-base">
								<Megaphone className="h-4 w-4 text-primary" />
								Course Announcements
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1">
								<span className="font-medium text-primary text-xs">TODAY</span>
								<h4 className="font-medium text-sm">Welcome to the Forum!</h4>
								<p className="text-muted-foreground text-xs">
									Feel free to ask questions and help your peers.
								</p>
							</div>
							<Button variant="link" className="h-auto p-0 text-sm" asChild>
								<Link href={`/courses/${courseId}`}>
									View all <ArrowRight className="ml-1 h-3 w-3" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-base">
								<Trophy className="h-4 w-4 text-amber-500" />
								Top Contributors
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{mockContributors.map((contributor) => (
								<div
									key={contributor.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<div className="relative">
											<Avatar className="h-8 w-8">
												<AvatarFallback className="text-xs">
													{contributor.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
												{contributor.rank}
											</span>
										</div>
										<div>
											<p className="font-medium text-sm">{contributor.name}</p>
											<p className="text-muted-foreground text-xs">
												{contributor.points} pts • {contributor.badge} Tutor
											</p>
										</div>
									</div>
									<Star
										className={`h-4 w-4 ${badgeColors[contributor.badge]}`}
									/>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-primary/90 to-primary text-primary-foreground">
						<CardContent className="pt-6">
							<div className="mb-2 flex items-center gap-2">
								<Bot className="h-5 w-5" />
								<h3 className="font-semibold">Stuck on a problem?</h3>
							</div>
							<p className="mb-4 text-sm opacity-90">
								Our AI Tutor is available 24/7 to help guide you.
							</p>
							<Button variant="secondary" className="w-full" asChild>
								<Link href={`/student/learn/${courseId}/1`}>Ask AI Tutor</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

"use client";

import {
	Bug,
	HelpCircle,
	MessageCircle,
	MessageSquare,
	Search,
	ThumbsUp,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PostType = "question" | "discussion" | "bug" | "help_wanted";
type ForumTab = "latest" | "top" | "unanswered" | "my_posts";

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

const mockPosts: ForumPost[] = [
	{
		id: "1",
		title: "How do I handle async/await errors properly?",
		content:
			"I'm having trouble understanding the best practices for error handling in async functions...",
		authorName: "John Smith",
		authorAvatar: null,
		createdAt: "2024-01-15T10:30:00Z",
		repliesCount: 5,
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
		repliesCount: 8,
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
		repliesCount: 3,
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
	{ label: string; icon: React.ElementType; color: string }
> = {
	question: { label: "Question", icon: HelpCircle, color: "bg-blue-500" },
	discussion: {
		label: "Discussion",
		icon: MessageSquare,
		color: "bg-green-500",
	},
	bug: { label: "Bug", icon: Bug, color: "bg-red-500" },
	help_wanted: {
		label: "Help Wanted",
		icon: HelpCircle,
		color: "bg-yellow-500",
	},
};

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

	if (selectedPost) {
		return (
			<div className="container py-8">
				<Button
					variant="ghost"
					onClick={() => setSelectedPost(null)}
					className="mb-4"
				>
					← Back to Forum
				</Button>
				<Card>
					<CardContent className="p-6">
						<div className="mb-4 flex items-center gap-2">
							<Badge variant="secondary">
								{postTypeConfig[selectedPost.postType].label}
							</Badge>
							{selectedPost.isAiAnswered && (
								<Badge className="bg-green-500">AI Answered</Badge>
							)}
						</div>
						<h1 className="mb-4 font-bold font-display text-2xl">
							{selectedPost.title}
						</h1>
						<div className="mb-6 flex items-center gap-3">
							<Avatar>
								<AvatarFallback>
									{selectedPost.authorName.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{selectedPost.authorName}</p>
								<p className="text-muted-foreground text-sm">
									{formatTime(selectedPost.createdAt)}
								</p>
							</div>
						</div>
						<p className="whitespace-pre-line text-muted-foreground">
							{selectedPost.content}
						</p>
						<div className="mt-6 flex gap-4 border-t pt-4">
							<Button variant="outline" size="sm">
								<ThumbsUp className="mr-2 h-4 w-4" />
								{selectedPost.votes}
							</Button>
							<Button variant="outline" size="sm">
								<MessageCircle className="mr-2 h-4 w-4" />
								{selectedPost.repliesCount} Replies
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
				<Link href="/student" className="hover:text-foreground">
					Dashboard
				</Link>
				<span>/</span>
				<Link href={`/courses/${courseId}`} className="hover:text-foreground">
					Course
				</Link>
				<span>/</span>
				<span>Forum</span>
			</div>

			<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="mb-2 font-bold font-display text-3xl">
						Course Discussion Forum
					</h1>
					<p className="text-muted-foreground">
						Connect with peers, ask questions, and share knowledge
					</p>
				</div>
				<Button onClick={() => setIsCreatingPost(true)}>
					<MessageSquare className="mr-2 h-4 w-4" />
					New Thread
				</Button>
			</div>

			{isCreatingPost && (
				<Card className="mb-6">
					<CardContent className="p-6">
						<h2 className="mb-4 font-semibold text-xl">Create New Thread</h2>
						<div className="space-y-4">
							<div>
								<label className="mb-2 block font-medium text-sm">Title</label>
								<Input
									placeholder="Enter your question or topic..."
									value={newPostTitle}
									onChange={(e) => setNewPostTitle(e.target.value)}
								/>
							</div>
							<div>
								<label className="mb-2 block font-medium text-sm">Type</label>
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
								<label className="mb-2 block font-medium text-sm">
									Content
								</label>
								<textarea
									className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Describe your question or topic in detail..."
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

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search discussions..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="mb-6 flex gap-2">
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
						{tab === "top" && <TrendingUp className="mr-2 h-4 w-4" />}
						{label}
					</Button>
				))}
			</div>

			{sortedPosts.length > 0 ? (
				<div className="space-y-4">
					{sortedPosts.map((post) => (
						<Card
							key={post.id}
							className="cursor-pointer transition-shadow hover:shadow-md"
							onClick={() => setSelectedPost(post)}
						>
							<CardContent className="p-4">
								<div className="flex items-start gap-4">
									<Avatar>
										<AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="outline" className="text-xs">
												{postTypeConfig[post.postType].label}
											</Badge>
											{post.isPinned && (
												<span className="font-medium text-primary text-xs">
													Pinned
												</span>
											)}
											{post.isAiAnswered && (
												<Badge className="bg-green-500 text-xs">
													AI Answered
												</Badge>
											)}
										</div>
										<h3 className="mb-1 font-semibold">{post.title}</h3>
										<p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
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
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-16 text-center">
						<MessageSquare className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-xl">No discussions yet</h3>
						<p className="text-muted-foreground">
							Be the first to start a discussion in this course!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

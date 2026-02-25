"use client";

import { BookOpen, Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WishlistItem {
	id: string;
	course: {
		id: string;
		title: string;
		description: string;
		level: string;
		category: string;
		price: string;
		thumbnailUrl: string | null;
	};
}

const mockWishlist: WishlistItem[] = [
	{
		id: "1",
		course: {
			id: "10",
			title: "Machine Learning Fundamentals",
			description: "Learn the basics of ML algorithms and techniques",
			level: "intermediate",
			category: "AI",
			price: "$49.99",
			thumbnailUrl: null,
		},
	},
	{
		id: "2",
		course: {
			id: "11",
			title: "iOS Development with Swift",
			description: "Build beautiful iOS apps from scratch",
			level: "beginner",
			category: "Mobile",
			price: "$39.99",
			thumbnailUrl: null,
		},
	},
	{
		id: "3",
		course: {
			id: "12",
			title: "Cloud Architecture on AWS",
			description: "Design scalable cloud infrastructure",
			level: "advanced",
			category: "DevOps",
			price: "$59.99",
			thumbnailUrl: null,
		},
	},
];

export default function WishlistPage() {
	const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);
	const [loading] = useState(false);

	const removeItem = (id: string) => {
		setWishlist(wishlist.filter((item) => item.id !== id));
	};

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="mb-5">
				<h1 className="mb-1 font-bold font-display text-2xl">My Wishlist</h1>
				<p className="text-muted-foreground text-sm">
					{wishlist.length} saved course{wishlist.length !== 1 ? "s" : ""}
				</p>
			</div>

			{wishlist.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{wishlist.map((item, i) => (
						<Card
							key={item.id}
							className="group fade-in slide-in-from-bottom-4 animate-in overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
							style={{
								animationDelay: `${i * 100}ms`,
								animationFillMode: "backwards",
							}}
						>
							<div className="relative aspect-video overflow-hidden">
								{item.course.thumbnailUrl ? (
									<img
										src={item.course.thumbnailUrl}
										alt={item.course.title}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/15 to-accent/15">
										<BookOpen className="h-10 w-10 text-primary/40" />
									</div>
								)}
								<div className="absolute top-2 left-2 flex gap-1.5">
									<Badge variant="secondary" className="text-xs capitalize">
										{item.course.level}
									</Badge>
									<Badge
										variant="outline"
										className="bg-background/80 text-xs backdrop-blur-sm"
									>
										{item.course.category}
									</Badge>
								</div>
								<button
									type="button"
									onClick={() => removeItem(item.id)}
									className="absolute top-2 right-2 rounded-lg bg-background/80 p-1.5 text-destructive opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
									title="Remove from wishlist"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</div>
							<CardContent className="p-3">
								<h3 className="mb-1 line-clamp-1 font-semibold text-sm">
									{item.course.title}
								</h3>
								<p className="mb-2 line-clamp-2 text-muted-foreground text-xs">
									{item.course.description}
								</p>
								<div className="flex items-center justify-between">
									<span className="font-bold text-sm">{item.course.price}</span>
									<Button size="sm" className="h-7 rounded-lg text-xs">
										<ShoppingCart className="mr-1 h-3 w-3" />
										Enroll
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card className="rounded-2xl">
					<CardContent className="py-10 text-center">
						<Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
						<h3 className="mb-1 font-semibold text-sm">Wishlist is empty</h3>
						<p className="mb-3 text-muted-foreground text-xs">
							Save courses you're interested in for later
						</p>
						<Button asChild size="sm" className="rounded-xl">
							<Link href="/courses">Browse Courses</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

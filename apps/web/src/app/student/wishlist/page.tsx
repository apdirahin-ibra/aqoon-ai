"use client";

import { Heart, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WishlistCourse {
	id: string;
	courseId: string;
	addedAt: string;
	course: {
		id: string;
		title: string;
		description: string | null;
		thumbnailUrl: string | null;
		category: string;
		level: string;
		isPremium: boolean;
		priceCents: number | null;
	};
}

const mockWishlist: WishlistCourse[] = [
	{
		id: "1",
		courseId: "1",
		addedAt: "2024-01-15",
		course: {
			id: "1",
			title: "Machine Learning Fundamentals",
			description: "Master the basics of ML with Python",
			thumbnailUrl: null,
			category: "coding",
			level: "intermediate",
			isPremium: true,
			priceCents: 7999,
		},
	},
	{
		id: "2",
		courseId: "2",
		addedAt: "2024-01-18",
		course: {
			id: "2",
			title: "Advanced JavaScript Patterns",
			description: "Deep dive into advanced JS concepts",
			thumbnailUrl: null,
			category: "coding",
			level: "advanced",
			isPremium: true,
			priceCents: 5999,
		},
	},
];

export default function WishlistPage() {
	const [wishlist] = useState<WishlistCourse[]>(mockWishlist);
	const [loading] = useState(false);

	const formatPrice = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
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
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">My Wishlist</h1>
				<p className="text-muted-foreground">
					Courses you&apos;ve saved for later
				</p>
			</div>

			{wishlist.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">
							Your wishlist is empty
						</h3>
						<p className="mb-4 text-muted-foreground">
							Save courses you&apos;re interested in for later
						</p>
						<Button>Browse Courses</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{wishlist.map((item) => (
						<Card key={item.id} className="overflow-hidden">
							<div className="flex gap-4 p-4">
								<div className="flex h-32 w-48 shrink-0 items-center justify-center rounded-lg bg-muted">
									{item.course.thumbnailUrl ? (
										<img
											src={item.course.thumbnailUrl}
											alt={item.course.title}
											className="h-full w-full rounded-lg object-cover"
										/>
									) : (
										<Heart className="h-8 w-8 text-muted-foreground" />
									)}
								</div>

								<div className="flex-1">
									<div className="mb-2 flex items-start justify-between">
										<div>
											<h3 className="mb-1 font-semibold text-lg">
												{item.course.title}
											</h3>
											<p className="mb-2 text-muted-foreground text-sm">
												{item.course.description}
											</p>
											<div className="flex items-center gap-2">
												<span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
													{item.course.level}
												</span>
												<span className="text-muted-foreground text-xs">
													Added {formatDate(item.addedAt)}
												</span>
											</div>
										</div>
									</div>

									<div className="mt-4 flex items-center justify-between">
										<div>
											{item.course.isPremium && item.course.priceCents ? (
												<span className="font-bold text-lg">
													{formatPrice(item.course.priceCents)}
												</span>
											) : (
												<span className="font-bold text-green-500 text-lg">
													Free
												</span>
											)}
										</div>

										<div className="flex gap-2">
											<Button variant="outline" size="icon">
												<Trash2 className="h-4 w-4" />
											</Button>
											<Button>Enroll Now</Button>
										</div>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

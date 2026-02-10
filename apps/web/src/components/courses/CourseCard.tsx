"use client";

import { Clock, Star, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseCardProps {
	id: string;
	title: string;
	description?: string;
	thumbnailUrl?: string;
	category: string;
	level: string;
	isPremium: boolean;
	priceCents?: number;
	lessonsCount?: number;
	enrollmentsCount?: number;
}

const categoryStyles: Record<string, string> = {
	coding: "badge-coding",
	languages: "badge-languages",
	art: "badge-art",
	business: "badge-business",
	music: "badge-music",
	other: "bg-muted text-muted-foreground",
};

const levelLabels: Record<string, string> = {
	beginner: "Beginner",
	intermediate: "Intermediate",
	advanced: "Advanced",
};

export function CourseCard({
	id,
	title,
	description,
	thumbnailUrl,
	category,
	level,
	isPremium,
	priceCents,
	lessonsCount = 0,
	enrollmentsCount = 0,
}: CourseCardProps) {
	const formatPrice = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);
	};

	return (
		<Link href={`/courses/${id}` as any} className="group block">
			<article className="card-course flex h-full flex-col transition-all duration-300">
				<div className="relative aspect-video overflow-hidden">
					{thumbnailUrl ? (
						<img
							src={thumbnailUrl}
							alt={title}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
							<span className="text-left text-4xl">📚</span>
						</div>
					)}
					{isPremium && (
						<div className="absolute top-3 right-3">
							<Badge className="border-0 bg-accent text-accent-foreground">
								<Star className="mr-1 h-3 w-3 fill-current" />
								Premium
							</Badge>
						</div>
					)}
				</div>

				<div className="flex flex-1 flex-col p-5 text-left">
					<div className="mb-3 flex items-center gap-2">
						<span
							className={cn(
								"rounded-full px-2.5 py-1 font-medium text-xs capitalize",
								categoryStyles[category] || categoryStyles.other,
							)}
						>
							{category}
						</span>
						<span className="text-muted-foreground text-xs">
							{levelLabels[level] || level}
						</span>
					</div>

					<h3 className="mb-2 line-clamp-2 font-display font-semibold text-lg transition-colors group-hover:text-primary">
						{title}
					</h3>

					{description && (
						<p className="mb-4 line-clamp-2 flex-1 text-muted-foreground text-sm">
							{description}
						</p>
					)}

					<div className="mt-auto flex items-center justify-between border-border border-t pt-4">
						<div className="flex items-center gap-4 text-muted-foreground text-xs">
							<span className="flex items-center gap-1">
								<Clock className="h-3.5 w-3.5" />
								{lessonsCount} lessons
							</span>
							<span className="flex items-center gap-1">
								<Users className="h-3.5 w-3.5" />
								{enrollmentsCount}
							</span>
						</div>

						<span className="font-semibold text-foreground">
							{isPremium && priceCents ? formatPrice(priceCents) : "Free"}
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}

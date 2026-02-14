"use client";

import {
	Award,
	Calendar,
	Download,
	ExternalLink,
	Loader2,
	Share2,
	Trophy,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Certificate {
	id: string;
	title: string;
	issuedAt: string;
	credentialId: string;
	course: {
		id: string;
		title: string;
		category: string;
		level: string;
	};
}

const mockCertificates: Certificate[] = [
	{
		id: "1",
		title: "Certificate of Completion",
		issuedAt: "2024-01-10",
		credentialId: "cert-abc123xyz",
		course: {
			id: "1",
			title: "Introduction to Python Programming",
			category: "coding",
			level: "beginner",
		},
	},
];

export default function CertificatesPage() {
	const [certificates] = useState<Certificate[]>(mockCertificates);
	const [loading] = useState(false);

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			coding: "bg-blue-500/10 text-blue-500",
			languages: "bg-green-500/10 text-green-500",
			art: "bg-purple-500/10 text-purple-500",
			business: "bg-orange-500/10 text-orange-500",
			music: "bg-pink-500/10 text-pink-500",
		};
		return colors[category] || "bg-muted text-muted-foreground";
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
				<h1 className="mb-2 font-bold font-display text-3xl">
					My Certificates & Achievements
				</h1>
				<p className="text-muted-foreground">
					Your verified credentials and skill badges
				</p>
			</div>

			{/* Stats */}
			<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6 text-center">
						<Award className="mx-auto mb-2 h-8 w-8 text-primary" />
						<p className="font-bold text-2xl">{certificates.length}</p>
						<p className="text-muted-foreground text-sm">Certificates</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6 text-center">
						<Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
						<p className="font-bold text-2xl">
							{new Set(certificates.map((c) => c.course.category)).size}
						</p>
						<p className="text-muted-foreground text-sm">Categories</p>
					</CardContent>
				</Card>
			</div>

			{certificates.length > 0 ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{certificates.map((cert) => (
						<Card
							key={cert.id}
							className="overflow-hidden transition-shadow hover:shadow-lg"
						>
							{/* Certificate Preview */}
							<div className="relative flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-6 text-center">
								<div className="absolute top-4 right-4">
									<Badge className={getCategoryColor(cert.course.category)}>
										{cert.course.category}
									</Badge>
								</div>
								<Award className="mb-4 h-16 w-16 text-primary" />
								<h3 className="font-bold font-display text-lg">{cert.title}</h3>
								<p className="mt-1 text-muted-foreground text-sm">
									{cert.course.title}
								</p>
							</div>

							<CardContent className="p-4">
								<div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
									<Calendar className="h-4 w-4" />
									<span>Issued {formatDate(cert.issuedAt)}</span>
								</div>

								<div className="mb-4 text-muted-foreground text-xs">
									Credential ID:{" "}
									<code className="rounded bg-muted px-1 py-0.5">
										{cert.credentialId.slice(0, 12)}...
									</code>
								</div>

								<div className="flex gap-2">
									<Button variant="outline" size="sm" className="flex-1">
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
									<Button variant="outline" size="sm" className="flex-1">
										<Share2 className="mr-2 h-4 w-4" />
										Share
									</Button>
								</div>

								<Button variant="ghost" size="sm" className="mt-2 w-full">
									View Course
									<ExternalLink className="ml-2 h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<Award className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-xl">No certificates yet</h3>
						<p className="mb-6 text-muted-foreground">
							Complete courses to earn your first certificate
						</p>
						<Button>Browse Courses</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

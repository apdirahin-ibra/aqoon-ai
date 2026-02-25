"use client";

import { Award, Download, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Certificate {
	id: string;
	courseTitle: string;
	completedAt: string;
	credentialId: string;
	category: string;
}

const mockCertificates: Certificate[] = [
	{
		id: "1",
		courseTitle: "Introduction to Python Programming",
		completedAt: "2024-02-15",
		credentialId: "CERT-PY-2024-001",
		category: "Coding",
	},
	{
		id: "2",
		courseTitle: "Advanced JavaScript Patterns",
		completedAt: "2024-03-01",
		credentialId: "CERT-JS-2024-042",
		category: "Coding",
	},
	{
		id: "3",
		courseTitle: "UI/UX Design Fundamentals",
		completedAt: "2024-03-20",
		credentialId: "CERT-UX-2024-018",
		category: "Design",
	},
];

export default function CertificatesPage() {
	const [certificates] = useState<Certificate[]>(mockCertificates);
	const [loading] = useState(false);

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

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
				<h1 className="mb-1 font-bold font-display text-2xl">
					My Certificates
				</h1>
				<p className="text-muted-foreground text-sm">
					{certificates.length} certificates earned
				</p>
			</div>

			{certificates.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{certificates.map((cert, i) => (
						<Card
							key={cert.id}
							className="group fade-in slide-in-from-bottom-4 animate-in overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
							style={{
								animationDelay: `${i * 100}ms`,
								animationFillMode: "backwards",
							}}
						>
							{/* Certificate Preview */}
							<div className="relative flex h-36 items-center justify-center bg-linear-to-br from-primary/15 via-primary/5 to-accent/10">
								<div className="text-center">
									<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary/30 to-primary/10">
										<Award className="h-6 w-6 text-primary" />
									</div>
									<p className="font-display font-semibold text-primary/80 text-xs">
										Certificate of Completion
									</p>
								</div>
								<Badge
									variant="secondary"
									className="absolute top-2 right-2 text-xs"
								>
									{cert.category}
								</Badge>
							</div>

							<CardContent className="p-3">
								<h3 className="mb-1 line-clamp-1 font-semibold text-sm">
									{cert.courseTitle}
								</h3>
								<div className="mb-3 space-y-0.5 text-muted-foreground text-xs">
									<p>Issued: {formatDate(cert.completedAt)}</p>
									<p className="font-mono text-[10px]">
										ID: {cert.credentialId}
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										className="h-7 flex-1 rounded-lg text-xs"
									>
										<Download className="mr-1 h-3 w-3" />
										Download
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-7 rounded-lg px-2"
									>
										<Share2 className="h-3 w-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card className="rounded-2xl">
					<CardContent className="py-10 text-center">
						<Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
						<h3 className="mb-1 font-semibold text-sm">No certificates yet</h3>
						<p className="text-muted-foreground text-xs">
							Complete a course to earn your first certificate
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

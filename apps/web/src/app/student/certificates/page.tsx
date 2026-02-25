"use client";

import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Award, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificatesPage() {
	const certificates = useQuery(api.certificates.myCertificates);

	const formatDate = (timestamp: number) =>
		new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	if (certificates === undefined) {
		return (
			<div className="container py-8">
				<Skeleton className="mb-1 h-8 w-48" />
				<Skeleton className="mb-5 h-4 w-32" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={`cert-skel-${i}`} className="h-64 rounded-2xl" />
					))}
				</div>
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
					{certificates.length} certificate
					{certificates.length !== 1 ? "s" : ""} earned
				</p>
			</div>

			{certificates.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{certificates.map((cert, i) => (
						<Card
							key={cert._id}
							className="group fade-in slide-in-from-bottom-4 animate-in overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
							style={{
								animationDelay: `${i * 100}ms`,
								animationFillMode: "backwards",
							}}
						>
							<div className="relative flex h-36 items-center justify-center bg-linear-to-br from-primary/15 via-primary/5 to-accent/10">
								<div className="text-center">
									<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary/30 to-primary/10">
										<Award className="h-6 w-6 text-primary" />
									</div>
									<p className="font-display font-semibold text-primary/80 text-xs">
										Certificate of Completion
									</p>
								</div>
							</div>

							<CardContent className="p-3">
								<h3 className="mb-1 line-clamp-1 font-semibold text-sm">
									{cert.courseTitle}
								</h3>
								<div className="mb-3 space-y-0.5 text-muted-foreground text-xs">
									<p>Issued: {formatDate(cert.issuedAt)}</p>
									<p className="font-mono text-[10px]">ID: {cert.code}</p>
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

"use client";

import { BookOpen, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Resource {
	id: string;
	title: string;
	type: "pdf" | "link" | "video" | "zip";
	url: string;
	description: string;
}

const mockResources: Resource[] = [
	{
		id: "1",
		title: "Python Cheat Sheet",
		type: "pdf",
		url: "#",
		description: "Quick reference guide for Python syntax",
	},
	{
		id: "2",
		title: "Official Python Documentation",
		type: "link",
		url: "https://docs.python.org",
		description: "Complete Python documentation",
	},
	{
		id: "3",
		title: "Practice Exercises",
		type: "pdf",
		url: "#",
		description: "Additional practice problems",
	},
	{
		id: "4",
		title: "VS Code Setup Guide",
		type: "link",
		url: "#",
		description: "How to set up your development environment",
	},
	{
		id: "5",
		title: "Project Starter Files",
		type: "zip",
		url: "#",
		description: "Starter code for course projects",
	},
];

export default function ResourceLibraryPage() {
	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold font-display text-3xl">
					Resource Library
				</h1>
				<p className="text-muted-foreground">
					Download course materials and external resources
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{mockResources.map((resource) => (
					<Card key={resource.id}>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<FileText className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-base">
											{resource.title}
										</CardTitle>
										<p className="text-muted-foreground text-sm">
											{resource.description}
										</p>
									</div>
								</div>
								<span className="rounded-full bg-muted px-2 py-1 text-xs uppercase">
									{resource.type}
								</span>
							</div>
						</CardHeader>
						<CardContent>
							{resource.type === "link" ? (
								<Button variant="outline" className="w-full">
									<ExternalLink className="mr-2 h-4 w-4" />
									Open Link
								</Button>
							) : (
								<Button variant="outline" className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Download
								</Button>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{mockResources.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">
							No resources available
						</h3>
						<p className="text-muted-foreground">
							Resources will appear here once added by the tutor
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

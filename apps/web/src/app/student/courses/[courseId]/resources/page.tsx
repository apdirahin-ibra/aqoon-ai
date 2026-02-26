"use client";

import {
  Download,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  FolderOpen,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import type { Id } from "@aqoon-ai/backend/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResourceLibraryPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;
  const [search, setSearch] = useState("");

  const resources = useQuery(api.resources.listByCourse, { courseId });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "code":
        return <FileCode className="h-8 w-8 text-blue-500" />;
      case "image":
        return <FileImage className="h-8 w-8 text-purple-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-red-500" />;
      default:
        return <FileText className="h-8 w-8 text-primary" />;
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (resources === undefined) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-20 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const groupedResources = filteredResources.reduce(
    (acc, resource) => {
      const type = resource.fileType || "document";
      if (!acc[type]) acc[type] = [];
      acc[type].push(resource);
      return acc;
    },
    {} as Record<string, typeof filteredResources>,
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${courseId}`}
          className="mb-2 block text-muted-foreground text-sm hover:text-foreground"
        >
          ← Back to Course
        </Link>
        <h1 className="mb-2 font-bold font-display text-3xl">
          Resource Library
        </h1>
        <p className="text-muted-foreground">
          Download course materials and resources
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resources grouped by type */}
      {filteredResources.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([type, items]) => (
            <div key={type}>
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg capitalize">
                {type === "code" && <FileCode className="h-5 w-5" />}
                {type === "document" && <FileText className="h-5 w-5" />}
                {type === "image" && <FileImage className="h-5 w-5" />}
                {type === "video" && <FileVideo className="h-5 w-5" />}
                {type}s<Badge variant="secondary">{items.length}</Badge>
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((resource) => (
                  <Card
                    key={resource._id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {getFileIcon(resource.fileType)}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="line-clamp-2 text-muted-foreground text-sm">
                              {resource.description}
                            </p>
                          )}
                          <p className="mt-1 text-muted-foreground text-xs">
                            {formatFileSize(resource.fileSizeBytes)}
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="mt-4 w-full">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">No resources yet</h3>
            <p className="text-muted-foreground">
              This course doesn&apos;t have any downloadable resources
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

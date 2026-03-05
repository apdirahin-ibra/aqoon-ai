"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ForumTab = "latest" | "top" | "unanswered" | "my_posts";
export type PostTag =
  | "all"
  | "question"
  | "discussion"
  | "bug"
  | "help_wanted"
  | "announcement";

interface ForumFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: PostTag;
  onTagChange: (tag: PostTag) => void;
  activeTab: ForumTab;
  onTabChange: (tab: ForumTab) => void;
}

export function ForumFilters({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  activeTab,
  onTabChange,
}: ForumFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedTag}
          onValueChange={(v) => onTagChange(v as PostTag)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="discussion">Discussion</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="help_wanted">Help Wanted</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs Row */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ForumTab)}>
        <TabsList className="h-auto gap-4 bg-transparent p-0">
          <TabsTrigger
            value="latest"
            className="rounded-none px-0 pb-2 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Latest Threads
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="rounded-none px-0 pb-2 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Top Rated
          </TabsTrigger>
          <TabsTrigger
            value="unanswered"
            className="rounded-none px-0 pb-2 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Unanswered
          </TabsTrigger>
          <TabsTrigger
            value="my_posts"
            className="rounded-none px-0 pb-2 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            My Posts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

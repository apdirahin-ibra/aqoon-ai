"use client";

import { ArrowRight, Megaphone, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Announcement {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface TopContributor {
  id: string;
  name: string;
  avatar?: string | null;
  posts: number;
  badge: "Gold" | "Silver" | "Bronze";
  rank: number;
}

interface ForumSidebarProps {
  courseId: string;
  announcements?: Announcement[];
  topContributors?: TopContributor[];
  totalThreads?: number;
  totalReplies?: number;
}

const badgeColors = {
  Gold: "text-amber-500",
  Silver: "text-slate-400",
  Bronze: "text-orange-600",
};

export function ForumSidebar({
  courseId,
  announcements = [],
  topContributors = [],
  totalThreads = 0,
  totalReplies = 0,
}: ForumSidebarProps) {
  const mockAnnouncements: Announcement[] =
    announcements.length > 0
      ? announcements
      : [
          {
            id: "1",
            date: "TODAY",
            title: "Welcome to the Forum!",
            description: "Feel free to ask questions and help your peers.",
          },
        ];

  const mockContributors: TopContributor[] =
    topContributors.length > 0
      ? topContributors
      : [
          {
            id: "1",
            name: "Top Student",
            posts: 12,
            badge: "Gold",
            rank: 1,
          },
          {
            id: "2",
            name: "Helper Pro",
            posts: 8,
            badge: "Silver",
            rank: 2,
          },
          {
            id: "3",
            name: "Active Learner",
            posts: 5,
            badge: "Bronze",
            rank: 3,
          },
        ];

  const handleFormatDate = (dateStr: string) => {
    if (dateStr === "TODAY") return "TODAY";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Forum Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Forum Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="font-bold text-2xl">{totalThreads}</p>
            <p className="text-muted-foreground text-xs">Threads</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-2xl">{totalReplies}</p>
            <p className="text-muted-foreground text-xs">Replies</p>
          </div>
        </CardContent>
      </Card>

      {/* Course Announcements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-primary" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className="space-y-1">
              <span className="font-medium text-primary text-xs">
                {handleFormatDate(announcement.date)}
              </span>
              <h4 className="font-medium text-sm">{announcement.title}</h4>
              <p className="line-clamp-2 text-muted-foreground text-xs">
                {announcement.description}
              </p>
            </div>
          ))}
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <Link href={`/student/courses/${courseId}`}>
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockContributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contributor.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
                    {contributor.rank}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{contributor.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {contributor.posts} posts • {contributor.badge}
                  </p>
                </div>
              </div>
              <Star className={`h-4 w-4 ${badgeColors[contributor.badge]}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

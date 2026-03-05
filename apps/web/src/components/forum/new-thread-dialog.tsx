"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PostType } from "./forum-post-card";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

interface NewThreadDialogProps {
  onSubmit: (
    title: string,
    content: string,
    postType: PostType,
  ) => Promise<void>;
  isSubmitting: boolean;
  isTutor?: boolean;
}

export function NewThreadDialog({
  onSubmit,
  isSubmitting,
  isTutor = false,
}: NewThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("discussion");

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) return;
    if (
      trimmedTitle.length > MAX_TITLE_LENGTH ||
      trimmedContent.length > MAX_CONTENT_LENGTH
    )
      return;

    await onSubmit(trimmedTitle, trimmedContent, postType);
    setTitle("");
    setContent("");
    setPostType("discussion");
    setOpen(false);
  };

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const titleError = trimmedTitle.length > MAX_TITLE_LENGTH;
  const contentError = trimmedContent.length > MAX_CONTENT_LENGTH;
  const isValid =
    trimmedTitle.length > 0 &&
    trimmedContent.length > 0 &&
    !titleError &&
    !contentError;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="post-type">Thread Type</Label>
            <Select
              value={postType}
              onValueChange={(v) => setPostType(v as PostType)}
            >
              <SelectTrigger id="post-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="help_wanted">Help Wanted</SelectItem>
                {isTutor && (
                  <SelectItem value="announcement">Announcement</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="thread-title">Title</Label>
              <span
                className={`text-xs ${titleError ? "text-destructive" : "text-muted-foreground"}`}
              >
                {trimmedTitle.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <Input
              id="thread-title"
              placeholder="What's your question or topic?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE_LENGTH + 50}
              className={titleError ? "border-destructive" : ""}
            />
            {titleError && (
              <p className="text-destructive text-xs">
                Title must be {MAX_TITLE_LENGTH} characters or less
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="thread-content">Description</Label>
              <span
                className={`text-xs ${contentError ? "text-destructive" : "text-muted-foreground"}`}
              >
                {trimmedContent.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>
            <Textarea
              id="thread-content"
              placeholder="Provide more details about your question or topic..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={MAX_CONTENT_LENGTH + 500}
              className={contentError ? "border-destructive" : ""}
            />
            {contentError && (
              <p className="text-destructive text-xs">
                Content must be {MAX_CONTENT_LENGTH} characters or less
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Thread"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

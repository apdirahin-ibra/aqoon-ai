"use client";

import { useMutation } from "convex/react";
import { api } from "@aqoon-ai/backend/convex/_generated/api";
import { Camera, ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUploaded: (storageId: string) => Promise<void>;
  currentImageUrl?: string | null;
  shape?: "circle" | "rectangle";
  className?: string;
}

export function ImageUpload({
  onUploaded,
  currentImageUrl,
  shape = "rectangle",
  className,
}: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Step 3: Save via parent callback
      await onUploaded(storageId);
    } catch (error) {
      console.error("Upload failed:", error);
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = preview || currentImageUrl;
  const isCircle = shape === "circle";

  if (isCircle) {
    return (
      <div className={cn("relative inline-block", className)}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-muted bg-muted transition-colors hover:border-primary/50",
            uploading && "pointer-events-none opacity-70",
          )}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <Camera className="h-5 w-5 text-muted-foreground" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </button>
        {!uploading && displayUrl && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute right-0 bottom-0 rounded-full bg-linear-to-br from-primary to-primary/80 p-1.5 text-primary-foreground shadow-lg transition-colors hover:from-primary/90 hover:to-primary/70"
          >
            <Camera className="h-3 w-3" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  // Rectangle / card shape
  return (
    <div
      className={cn(
        "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50",
        dragOver && "border-primary bg-primary/5",
        uploading && "pointer-events-none opacity-70",
        className,
      )}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {displayUrl ? (
        <>
          <Image
            src={displayUrl}
            alt="Thumbnail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/30">
            {!uploading && (
              <div className="rounded-lg bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="rounded-lg bg-muted p-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">Click to upload thumbnail</p>
            <p className="text-muted-foreground text-xs">
              or drag and drop an image
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 shadow-lg dark:bg-gray-900/90">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium text-xs">Uploading…</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { ConvexError } from "convex/values";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAuthError = (error: unknown) => {
  const message =
    (error instanceof ConvexError && error.data) ||
    (error instanceof Error && error.message) ||
    "";
  return /auth/i.test(message);
};

/**
 * Format a timestamp into a human-readable relative time string.
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Format cents into a readable currency string (USD).
 */
export const formatCurrency = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

/**
 * Format a timestamp into a short date string.
 */
export const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Get initials from a name (up to 2 characters).
 */
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

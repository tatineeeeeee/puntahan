"use client";

import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  destinationId: Id<"destinations">;
  className?: string;
}

export function BookmarkButton({ destinationId, className }: BookmarkButtonProps) {
  const { isAuthenticated } = useConvexAuth();
  const toggle = useMutation(api.bookmarks.toggle);
  const isBookmarked = useQuery(
    api.bookmarks.isBookmarked,
    isAuthenticated ? { destinationId } : "skip",
  );

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await toggle({ destinationId });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!isAuthenticated}
      className={cn(
        "rounded-full p-1.5 transition-colors",
        isBookmarked
          ? "text-coral"
          : "text-warm-gray/50 hover:text-coral",
        !isAuthenticated && "opacity-50 cursor-not-allowed",
        className,
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        className="h-5 w-5"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

"use client";

import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  tipId: Id<"tips">;
  upvotes: number;
  downvotes: number;
}

export function VoteButtons({ tipId, upvotes, downvotes }: VoteButtonsProps) {
  const { isAuthenticated } = useConvexAuth();
  const castVote = useMutation(api.votes.castVote);
  const currentVote = useQuery(api.votes.getVoteForTip, { tipId });

  const netVotes = upvotes - downvotes;

  async function handleVote(direction: "up" | "down") {
    if (!isAuthenticated) return;
    await castVote({ tipId, direction });
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleVote("up")}
        disabled={!isAuthenticated}
        className={cn(
          "rounded p-1 transition-colors",
          currentVote === "up"
            ? "text-coral"
            : "text-warm-gray hover:text-coral",
          !isAuthenticated && "opacity-50 cursor-not-allowed",
        )}
        aria-label="Upvote"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span
        className={cn(
          "min-w-6 text-center text-sm font-medium",
          netVotes > 0
            ? "text-coral"
            : netVotes < 0
              ? "text-warm-gray"
              : "text-charcoal",
        )}
      >
        {netVotes}
      </span>
      <button
        type="button"
        onClick={() => handleVote("down")}
        disabled={!isAuthenticated}
        className={cn(
          "rounded p-1 transition-colors",
          currentVote === "down"
            ? "text-warm-gray"
            : "text-warm-gray/50 hover:text-warm-gray",
          !isAuthenticated && "opacity-50 cursor-not-allowed",
        )}
        aria-label="Downvote"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

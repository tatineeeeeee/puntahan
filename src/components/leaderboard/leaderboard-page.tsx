"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = ["Top Contributors", "Most Upvoted", "Top Destinations"] as const;
type Tab = (typeof tabs)[number];

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Top Contributors");
  const contributors = useQuery(api.leaderboard.topContributors);
  const upvoted = useQuery(api.leaderboard.topByUpvotes);
  const destinations = useQuery(api.leaderboard.topDestinations);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Leaderboard</h1>

      <div className="flex gap-1 border-b border-warm-gray/10 mb-6" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-coral text-coral"
                : "text-warm-gray hover:text-charcoal",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Top Contributors" && (
        <UserList users={contributors} statKey="tipsCount" statLabel="tips" />
      )}
      {activeTab === "Most Upvoted" && (
        <UserList users={upvoted} statKey="upvotesReceived" statLabel="upvotes" />
      )}
      {activeTab === "Top Destinations" && (
        <DestinationList destinations={destinations} />
      )}
    </div>
  );
}

function UserList({
  users,
  statKey,
  statLabel,
}: {
  users:
    | {
        _id: string;
        name: string;
        imageUrl: string | null;
        tipsCount: number;
        upvotesReceived: number;
      }[]
    | undefined;
  statKey: "tipsCount" | "upvotesReceived";
  statLabel: string;
}) {
  if (users === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-sm text-warm-gray">No users yet.</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user, i) => (
        <div
          key={user._id}
          className="flex items-center gap-3 rounded-xl bg-sand p-3"
        >
          <span className="w-8 text-center text-lg">
            {i < 3 ? MEDALS[i] : `#${i + 1}`}
          </span>
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{user.name}</p>
          </div>
          <Badge variant="budget">
            {user[statKey]} {statLabel}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function DestinationList({
  destinations,
}: {
  destinations:
    | {
        _id: string;
        name: string;
        slug: string;
        region: string;
        avgRating: number;
        tipsCount: number;
      }[]
    | undefined;
}) {
  if (destinations === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return <p className="text-sm text-warm-gray">No destinations yet.</p>;
  }

  return (
    <div className="space-y-2">
      {destinations.map((dest, i) => (
        <Link
          key={dest._id}
          href={`/destination/${dest.slug}`}
          className="flex items-center gap-3 rounded-xl bg-sand p-3 hover:shadow-md transition-shadow"
        >
          <span className="w-8 text-center text-lg">
            {i < 3 ? MEDALS[i] : `#${i + 1}`}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{dest.name}</p>
            <p className="text-xs text-warm-gray">{dest.region}</p>
          </div>
          <Rating value={dest.avgRating} size="sm" />
          <span className="text-xs text-warm-gray">{dest.tipsCount} tips</span>
        </Link>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getHighestBadge } from "@/lib/badges";

export function TopContributors() {
  const contributors = useQuery(api.leaderboard.topContributors);

  if (contributors === undefined) {
    return <TopContributorsSkeleton />;
  }

  const active = contributors.filter((u) => u.tipsCount > 0).slice(0, 5);
  if (active.length < 3) return null;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div className="border-l-[3px] border-teal pl-3">
          <h2 className="text-lg font-bold text-charcoal">
            Top Contributors
          </h2>
          <p className="text-sm text-warm-gray">
            Most active community members
          </p>
        </div>
        <Link
          href="/leaderboard"
          className="text-sm font-medium text-teal hover:text-teal/80 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {active.map((user) => {
          const badge = getHighestBadge({
            tipsCount: user.tipsCount,
            upvotesReceived: user.upvotesReceived,
            destinationsVisited: user.destinationsVisited,
            photosUploaded: user.photosUploaded,
          });
          const initial = (user.name ?? "A").charAt(0).toUpperCase();

          return (
            <Link
              key={user._id}
              href="/leaderboard"
              className="flex flex-col items-center gap-2 rounded-xl border border-warm-gray/10 bg-warm-white p-3 text-center hover:shadow-md transition-shadow"
            >
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                  {initial}
                </div>
              )}
              <p className="w-full truncate text-sm font-medium text-charcoal">
                {user.name}
              </p>
              {badge && (
                <span className="text-xs text-warm-gray">
                  {badge.emoji} {badge.name}
                </span>
              )}
              <p className="text-xs text-warm-gray">
                {user.tipsCount} {user.tipsCount === 1 ? "tip" : "tips"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TopContributorsSkeleton() {
  return (
    <section>
      <Skeleton className="mb-1 h-6 w-44" />
      <Skeleton className="mb-4 h-4 w-56" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-xl bg-sand p-3"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BadgeShelf } from "./badge-shelf";

const tabs = ["My Tips", "Been There", "Saved"] as const;
type Tab = (typeof tabs)[number];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Tips");
  const user = useQuery(api.users.getCurrentUser);
  const tips = useQuery(api.tips.listByUser);
  const bookmarks = useQuery(api.bookmarks.listByUser);

  if (user === undefined) {
    return <ProfileSkeleton />;
  }

  if (user === null) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  const savedDestinations = bookmarks?.filter((b) => !b.isVisited) ?? [];
  const visitedDestinations = bookmarks?.filter((b) => b.isVisited) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name ?? "User"}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-xl font-bold text-white">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            {user.name ?? "Traveler"}
          </h1>
          <p className="text-sm text-warm-gray">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 rounded-xl bg-sand p-4 text-center">
        <div>
          <p className="text-xl font-bold text-charcoal">{user.tipsCount}</p>
          <p className="text-xs text-warm-gray">Tips</p>
        </div>
        <div>
          <p className="text-xl font-bold text-charcoal">
            {user.upvotesReceived}
          </p>
          <p className="text-xs text-warm-gray">Upvotes</p>
        </div>
        <div>
          <p className="text-xl font-bold text-charcoal">
            {user.destinationsVisited}
          </p>
          <p className="text-xs text-warm-gray">Visited</p>
        </div>
        <div>
          <p className="text-xl font-bold text-charcoal">
            {user.bookmarksCount}
          </p>
          <p className="text-xs text-warm-gray">Saved</p>
        </div>
      </div>

      {/* Badges */}
      <BadgeShelf
        stats={{
          tipsCount: user.tipsCount,
          upvotesReceived: user.upvotesReceived,
          destinationsVisited: user.destinationsVisited,
          photosUploaded: user.photosUploaded,
        }}
      />

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-warm-gray/10" role="tablist">
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "My Tips" && (
          <TipsTab tips={tips} />
        )}
        {activeTab === "Been There" && (
          <DestinationList
            bookmarks={visitedDestinations}
            emptyMessage="You haven't marked any destinations as visited yet."
          />
        )}
        {activeTab === "Saved" && (
          <DestinationList
            bookmarks={savedDestinations}
            emptyMessage="You haven't saved any destinations yet."
          />
        )}
      </div>
    </div>
  );
}

function TipsTab({
  tips,
}: {
  tips:
    | {
        _id: string;
        content: string;
        rating: number;
        totalBudget: number;
        createdAt: number;
        destinationName: string;
        destinationSlug: string;
      }[]
    | undefined;
}) {
  if (tips === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <p className="text-sm text-warm-gray">
        You haven&apos;t shared any tips yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <Link
          key={tip._id}
          href={`/destination/${tip.destinationSlug}`}
          className="block rounded-xl bg-sand p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-charcoal">
              {tip.destinationName}
            </p>
            <Rating value={tip.rating} size="sm" />
          </div>
          <p className="mt-1 text-sm text-charcoal/80 line-clamp-2">
            {tip.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-warm-gray">
            <span>₱{tip.totalBudget.toLocaleString()}</span>
            <span>
              {new Date(tip.createdAt).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function DestinationList({
  bookmarks,
  emptyMessage,
}: {
  bookmarks: {
    _id: string;
    destination: {
      _id: string;
      name: string;
      slug: string;
      region: string;
      province: string;
    } | null;
  }[];
  emptyMessage: string;
}) {
  if (bookmarks.length === 0) {
    return <p className="text-sm text-warm-gray">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-2">
      {bookmarks.map((bm) => {
        if (!bm.destination) return null;
        return (
          <Link
            key={bm._id}
            href={`/destination/${bm.destination.slug}`}
            className="flex items-center justify-between rounded-xl bg-sand p-4 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-medium text-sm text-charcoal">
                {bm.destination.name}
              </p>
              <p className="text-xs text-warm-gray">
                {bm.destination.province} · {bm.destination.region}
              </p>
            </div>
            <Badge
              variant={
                `region-${bm.destination.region.toLowerCase()}` as
                  | "region-ncr"
                  | "region-luzon"
                  | "region-visayas"
                  | "region-mindanao"
              }
            >
              {bm.destination.region}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-8 w-64" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

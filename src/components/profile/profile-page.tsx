"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BadgeShelf } from "./badge-shelf";
import { ProfileSkeleton } from "./profile-skeleton";
import { TipsTab } from "./tips-tab";
import { DestinationList } from "./destination-list";
import { Tabs } from "@/components/ui/tabs";

const tabs = ["My Tips", "Been There", "Saved"] as const;

export function ProfilePage() {
  const user = useQuery(api.users.getCurrentUser);
  const tips = useQuery(api.tips.listByUser);
  const bookmarks = useQuery(api.bookmarks.listByUser);
  const provinceTipCounts = useQuery(
    api.tips.getProvinceTipCounts,
    user ? { userId: user._id } : "skip",
  );

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
          <Image
            src={user.imageUrl}
            alt={user.name ?? "User"}
            width={64}
            height={64}
            className="rounded-full object-cover"
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
        provinceTipCounts={provinceTipCounts ?? undefined}
      />

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="My Tips" className="mt-8">
        {(activeTab) => (
          <>
            {activeTab === "My Tips" && <TipsTab tips={tips} />}
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
          </>
        )}
      </Tabs>
    </div>
  );
}

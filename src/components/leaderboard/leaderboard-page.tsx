"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs } from "@/components/ui/tabs";
import { UserList } from "./user-list";
import { LeaderboardDestinationList } from "./destination-list";

const tabs = ["Top Contributors", "Most Upvoted", "Top Destinations"] as const;

export function LeaderboardPage() {
  const contributors = useQuery(api.leaderboard.topContributors);
  const upvoted = useQuery(api.leaderboard.topByUpvotes);
  const destinations = useQuery(api.leaderboard.topDestinations);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Leaderboard</h1>

      <Tabs tabs={tabs} defaultTab="Top Contributors">
        {(activeTab) => (
          <>
            {activeTab === "Top Contributors" && (
              <UserList users={contributors} statKey="tipsCount" statLabel="tips" />
            )}
            {activeTab === "Most Upvoted" && (
              <UserList users={upvoted} statKey="upvotesReceived" statLabel="upvotes" />
            )}
            {activeTab === "Top Destinations" && (
              <LeaderboardDestinationList destinations={destinations} />
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}

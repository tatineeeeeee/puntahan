"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsTab() {
  const stats = useQuery(api.analytics.dashboardStats);

  if (stats === undefined) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Page Views (24h)", value: stats.pageViews24h },
    { label: "Tips Created (7d)", value: stats.tipsCreated7d },
    { label: "Votes Cast (7d)", value: stats.votesCast7d },
    { label: "Searches (7d)", value: stats.searches7d },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-sand p-4 text-center"
          >
            <p className="text-2xl font-bold text-charcoal">{card.value}</p>
            <p className="mt-1 text-xs text-warm-gray">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Top Pages */}
      {stats.topPages.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
            Top Pages (24h)
          </h3>
          <div className="mt-3 space-y-2">
            {stats.topPages.map((page) => (
              <div
                key={page.page}
                className="flex items-center justify-between rounded-lg bg-sand px-3 py-2"
              >
                <span className="text-sm text-charcoal truncate">
                  {page.page}
                </span>
                <span className="ml-2 shrink-0 text-sm font-medium text-warm-gray">
                  {page.count} views
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

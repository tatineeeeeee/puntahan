"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardTab() {
  const stats = useQuery(api.admin.dashboardStats);

  if (stats === undefined) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { label: "Users", value: stats.totalUsers },
        { label: "Destinations", value: stats.totalDestinations },
        { label: "Tips", value: stats.totalTips },
        { label: "Pending", value: stats.pendingTips },
      ].map((s) => (
        <div key={s.label} className="rounded-xl bg-sand p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{s.value}</p>
          <p className="text-xs text-warm-gray">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Doc } from "../../../convex/_generated/dataModel";
import { DestinationCard } from "./destination-card";
import { Skeleton } from "@/components/ui/skeleton";

interface DestinationGridProps {
  destinations: Doc<"destinations">[] | undefined;
  activeCategories: Set<string>;
}

export function DestinationGrid({
  destinations,
  activeCategories,
}: DestinationGridProps) {
  if (destinations === undefined) {
    return <DestinationGridSkeleton />;
  }

  const filtered =
    activeCategories.size > 0
      ? destinations.filter((d) =>
          d.categories.some((c) => activeCategories.has(c)),
        )
      : destinations;

  if (filtered.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((dest) => (
        <DestinationCard key={dest._id} destination={dest} />
      ))}
    </div>
  );
}

function DestinationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded-xl bg-sand overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-medium text-charcoal">No destinations found</p>
      <p className="mt-1 text-sm text-warm-gray">
        Try adjusting your filters or selecting a different region.
      </p>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { DestinationCard } from "./destination-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SortOption } from "./sort-dropdown";

interface DestinationGridProps {
  destinations: Doc<"destinations">[] | undefined;
  activeCategories: Set<string>;
  sort: SortOption;
}

function sortDestinations(
  items: Doc<"destinations">[],
  sort: SortOption,
): Doc<"destinations">[] {
  const sorted = [...items];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.avgRating - a.avgRating);
    case "budget-low":
      return sorted.sort((a, b) => a.budgetMin - b.budgetMin);
    case "budget-high":
      return sorted.sort((a, b) => b.budgetMax - a.budgetMax);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function DestinationGrid({
  destinations,
  activeCategories,
  sort,
}: DestinationGridProps) {
  const processed = useMemo(() => {
    if (!destinations) return undefined;

    const filtered =
      activeCategories.size > 0
        ? destinations.filter((d) =>
            d.categories.some((c) => activeCategories.has(c)),
          )
        : destinations;

    return sortDestinations(filtered, sort);
  }, [destinations, activeCategories, sort]);

  if (processed === undefined) {
    return <DestinationGridSkeleton />;
  }

  if (processed.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {processed.map((dest) => (
        <DestinationCard key={dest._id} destination={dest} />
      ))}
    </div>
  );
}

function DestinationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded-xl bg-sand overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
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

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useComparison } from "@/lib/comparison-context";
import { ComparisonBar } from "./comparison-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const COLORS = ["bg-coral", "bg-teal", "bg-sunset"];

export function ComparisonPage() {
  const { selected, clear } = useComparison();
  const destinations = useQuery(
    api.destinations.getByIds,
    selected.length > 0 ? { ids: selected } : "skip",
  );

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          No destinations selected for comparison.
        </p>
        <p className="mt-1 text-sm text-warm-gray">
          Go back to browse and check the compare boxes on destination cards.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-teal hover:underline">
          Browse destinations
        </Link>
      </div>
    );
  }

  if (destinations === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  const maxBudget = Math.max(...destinations.map((d) => d.budgetMax));
  const maxRating = 5;
  const maxTips = Math.max(...destinations.map((d) => d.tipsCount), 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">Compare Destinations</h1>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear All
        </Button>
      </div>

      {/* Destination headers */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${destinations.length}, 1fr)` }}>
        {destinations.map((dest, i) => (
          <div key={dest._id} className="rounded-xl bg-sand p-4 text-center">
            <div className={`mx-auto mb-2 h-2 w-12 rounded-full ${COLORS[i]}`} />
            <Link
              href={`/destination/${dest.slug}`}
              className="font-bold text-charcoal hover:text-teal"
            >
              {dest.name}
            </Link>
            <p className="text-xs text-warm-gray">{dest.province}</p>
            <Badge variant="default" className="mt-1">
              {dest.region}
            </Badge>
          </div>
        ))}
      </div>

      {/* Comparison bars */}
      <div className="space-y-6">
        <ComparisonBar
          label="Average Rating"
          values={destinations.map((d, i) => ({
            name: d.name,
            value: d.avgRating,
            color: COLORS[i],
          }))}
          max={maxRating}
          format={(v) => `${v.toFixed(1)}/5`}
        />

        <ComparisonBar
          label="Budget (Min)"
          values={destinations.map((d, i) => ({
            name: d.name,
            value: d.budgetMin,
            color: COLORS[i],
          }))}
          max={maxBudget}
          format={(v) => `₱${v.toLocaleString()}`}
        />

        <ComparisonBar
          label="Budget (Max)"
          values={destinations.map((d, i) => ({
            name: d.name,
            value: d.budgetMax,
            color: COLORS[i],
          }))}
          max={maxBudget}
          format={(v) => `₱${v.toLocaleString()}`}
        />

        <ComparisonBar
          label="Tips Count"
          values={destinations.map((d, i) => ({
            name: d.name,
            value: d.tipsCount,
            color: COLORS[i],
          }))}
          max={maxTips}
        />
      </div>

      {/* Category comparison */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-3">
          Categories
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${destinations.length}, 1fr)` }}>
          {destinations.map((dest) => (
            <div key={dest._id} className="flex flex-wrap gap-1">
              {dest.categories.map((cat) => (
                <Badge key={cat} variant="default" className="text-[10px]">
                  {cat}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Best time to visit */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-3">
          Best Time to Visit
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${destinations.length}, 1fr)` }}>
          {destinations.map((dest) => (
            <p key={dest._id} className="text-sm text-charcoal/80">
              {dest.bestTimeToVisit ?? "Year-round"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

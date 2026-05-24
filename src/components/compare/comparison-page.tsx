"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useComparison } from "@/lib/comparison-context";
import { ComparisonBar } from "./comparison-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

const COLORS = ["bg-coral", "bg-teal", "bg-sunset"];

// Static map — Tailwind needs literal class strings, no template literals
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ComparisonPage() {
  const { selectedIds, remove, clear } = useComparison();
  const destinations = useQuery(
    api.destinations.getByIds,
    selectedIds.length > 0 ? { ids: selectedIds } : "skip",
  );

  if (selectedIds.length === 0) {
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
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Compare Destinations</h1>
          <p className="text-sm text-warm-gray mt-0.5">
            {destinations.length} of 3 slots used —{" "}
            <Link href="/" className="text-teal hover:underline">
              add more
            </Link>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear All
        </Button>
      </div>

      {/* Destination headers */}
      <div className={cn("grid gap-4", GRID_COLS[destinations.length])}>
        {destinations.map((dest, i) => (
          <div key={dest._id} className="relative rounded-xl bg-sand p-4 text-center">
            {/* Per-destination remove button */}
            <button
              type="button"
              onClick={() => remove(dest._id)}
              className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-warm-gray transition-colors hover:bg-red-100 hover:text-red-500"
              aria-label={`Remove ${dest.name} from comparison`}
            >
              <XIcon />
            </button>

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

        {/* Empty slot prompt if < 3 selected */}
        {destinations.length < 3 && (
          <Link
            href="/"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-gray/20 p-4 text-center transition-colors hover:border-teal hover:bg-teal/5"
          >
            <span className="text-2xl text-warm-gray/40">+</span>
            <span className="mt-1 text-xs text-warm-gray">Add destination</span>
          </Link>
        )}
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
        <div className={cn("grid gap-4", GRID_COLS[destinations.length])}>
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
        <div className={cn("grid gap-4", GRID_COLS[destinations.length])}>
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

"use client";

import Link from "next/link";
import { Doc } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./bookmark-button";
import { useComparison } from "@/lib/comparison-context";

const regionBadgeVariant = {
  NCR: "region-ncr",
  Luzon: "region-luzon",
  Visayas: "region-visayas",
  Mindanao: "region-mindanao",
} as const;

interface DestinationCardProps {
  destination: Doc<"destinations">;
  className?: string;
}

export function DestinationCard({ destination, className }: DestinationCardProps) {
  const budgetLabel = `₱${destination.budgetMin.toLocaleString()}–${destination.budgetMax.toLocaleString()}`;
  const variant =
    regionBadgeVariant[destination.region as keyof typeof regionBadgeVariant] ??
    "default";
  const { isSelected, add, remove: removeCompare } = useComparison();
  const comparing = isSelected(destination._id);

  function handleCompareToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeCompare(destination._id);
    } else {
      add(destination._id);
    }
  }

  return (
    <div className="relative">
      {/* Interactive controls outside the link to avoid nested interactive elements */}
      <div className="absolute top-2 left-2 z-10">
        <button
          type="button"
          onClick={handleCompareToggle}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded border text-xs transition-colors",
            comparing
              ? "border-teal bg-teal text-white"
              : "border-warm-gray/30 bg-white/80 text-warm-gray hover:border-teal",
          )}
          aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
        >
          {comparing && "\u2713"}
        </button>
      </div>
      <div className="absolute top-2 right-2 z-10">
        <BookmarkButton destinationId={destination._id} />
      </div>

      <Link href={`/destination/${destination.slug}`}>
        <Card className={cn("flex flex-col transition-shadow hover:shadow-md", className)}>
          {/* Placeholder hero area */}
          <div className="relative h-40 bg-warm-gray/10 flex items-center justify-center">
            <span className="text-warm-gray text-sm">Photo coming soon</span>
          </div>

          <CardContent className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-charcoal leading-tight">
                {destination.name}
              </h3>
              <Badge variant={variant}>{destination.region}</Badge>
            </div>

            <p className="mt-1 text-sm text-warm-gray">{destination.province}</p>

            <div className="mt-2 flex items-center gap-2">
              <Rating value={destination.avgRating} size="sm" />
              {destination.tipsCount > 0 && (
                <span className="text-xs text-warm-gray">
                  ({destination.tipsCount})
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {destination.categories.map((cat) => (
                <Badge key={cat} variant="default" className="text-[10px]">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-warm-gray/10 pt-3">
            <Badge variant="budget">{budgetLabel}</Badge>
            <span className="text-xs font-medium text-warm-gray">
              {destination.budgetCategory}
            </span>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

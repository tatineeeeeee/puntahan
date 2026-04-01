"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface SharedItineraryViewProps {
  token: string;
}

export function SharedItineraryView({ token }: SharedItineraryViewProps) {
  const data = useQuery(api.itineraries.getByShareToken, { token });

  if (data === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          Itinerary not found or link has expired.
        </p>
      </div>
    );
  }

  const { destinationMap, ...itinerary } = data;

  const allDestIds = new Set(itinerary.days.flatMap((d) => d.destinationIds));
  let totalBudgetMin = 0;
  let totalBudgetMax = 0;
  allDestIds.forEach((id) => {
    const dest = destinationMap[id as string];
    if (dest) {
      totalBudgetMin += dest.budgetMin;
      totalBudgetMax += dest.budgetMax;
    }
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">{itinerary.name}</h1>
        {itinerary.description && (
          <p className="mt-1 text-sm text-warm-gray">{itinerary.description}</p>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <Badge variant="default">{itinerary.days.length} days</Badge>
        <Badge variant="default">{allDestIds.size} destinations</Badge>
        <Badge variant="budget">
          ₱{totalBudgetMin.toLocaleString()}–{totalBudgetMax.toLocaleString()}
        </Badge>
      </div>

      {itinerary.days.map((day, i) => (
        <div key={i} className="rounded-xl bg-sand p-4">
          <h3 className="font-bold text-sm text-charcoal mb-2">
            Day {day.dayNumber}
          </h3>
          {day.destinationIds.length === 0 ? (
            <p className="text-xs text-warm-gray">No destinations planned.</p>
          ) : (
            <div className="space-y-2">
              {day.destinationIds.map((destId, j) => {
                const dest = destinationMap[destId as string];
                return (
                  <Link
                    key={`${destId}-${j}`}
                    href={`/destination/${dest?.slug ?? ""}`}
                    className="block rounded-lg bg-warm-white p-2 text-sm font-medium text-charcoal hover:text-teal"
                  >
                    {dest?.name ?? "Unknown destination"}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

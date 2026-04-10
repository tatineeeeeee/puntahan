"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TipCard } from "./tip-card";
import { TipForm } from "./tip-form";
import { Skeleton } from "@/components/ui/skeleton";

interface TipListProps {
  destinationId: Id<"destinations">;
  openTrigger?: number;
}

export function TipList({ destinationId, openTrigger }: TipListProps) {
  const tips = useQuery(api.tips.listByDestination, { destinationId });

  return (
    <div className="space-y-4">
      <TipForm destinationId={destinationId} openTrigger={openTrigger} />

      {tips === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : tips.length === 0 ? (
        <p className="text-sm text-warm-gray">
          No tips yet. Be the first to share!
        </p>
      ) : (
        <div className="space-y-3">
          {tips.map((tip) => (
            <TipCard key={tip._id} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingTipsTab() {
  const tips = useQuery(api.admin.pendingTips);
  const approve = useMutation(api.admin.approveTip);
  const reject = useMutation(api.admin.rejectTip);

  if (tips === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return <p className="text-sm text-warm-gray">No pending tips.</p>;
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div key={tip._id} className="rounded-xl bg-sand p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">
                {tip.userName} on {tip.destinationName}
              </p>
              <p className="text-xs text-warm-gray">
                Rating: {tip.rating}/5 · Budget: {"\u20B1"}{tip.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => approve({ tipId: tip._id })}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => reject({ tipId: tip._id })}
              >
                Reject
              </Button>
            </div>
          </div>
          <p className="text-sm text-charcoal/80">{tip.content}</p>
        </div>
      ))}
    </div>
  );
}

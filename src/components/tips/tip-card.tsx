"use client";

import { Rating } from "@/components/ui/rating";

interface TipCardProps {
  tip: {
    _id: string;
    content: string;
    rating: number;
    totalBudget: number;
    budgetBreakdown: { category: string; amount: number }[];
    upvotes: number;
    downvotes: number;
    createdAt: number;
    userName: string;
    userImage: string | null;
  };
}

export function TipCard({ tip }: TipCardProps) {
  const netVotes = tip.upvotes - tip.downvotes;
  const date = new Date(tip.createdAt).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl bg-sand p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        {tip.userImage ? (
          <img
            src={tip.userImage}
            alt={tip.userName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
            {tip.userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-charcoal">{tip.userName}</p>
          <p className="text-xs text-warm-gray">{date}</p>
        </div>
        <Rating value={tip.rating} size="sm" />
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-charcoal/80">{tip.content}</p>

      {/* Budget */}
      {tip.budgetBreakdown.length > 0 && (
        <div className="rounded-lg bg-warm-white p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-1.5">
            Budget Breakdown
          </p>
          <div className="space-y-1">
            {tip.budgetBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-warm-gray">{item.category}</span>
                <span className="font-medium text-charcoal">
                  ₱{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-warm-gray/10 pt-1 text-xs">
              <span className="font-bold text-charcoal">Total</span>
              <span className="font-bold text-sunset">
                ₱{tip.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Votes */}
      <div className="flex items-center gap-2 text-xs text-warm-gray">
        <span>{netVotes > 0 ? `+${netVotes}` : netVotes} votes</span>
      </div>
    </div>
  );
}

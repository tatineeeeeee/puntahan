import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/rating";

interface Tip {
  _id: string;
  content: string;
  rating: number;
  totalBudget: number;
  createdAt: number;
  destinationName: string;
  destinationSlug: string;
}

export function TipsTab({ tips }: { tips: Tip[] | undefined }) {
  if (tips === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <p className="text-sm text-warm-gray">
        You haven&apos;t shared any tips yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <Link
          key={tip._id}
          href={`/destination/${tip.destinationSlug}`}
          className="block rounded-xl bg-sand p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-charcoal">
              {tip.destinationName}
            </p>
            <Rating value={tip.rating} size="sm" />
          </div>
          <p className="mt-1 text-sm text-charcoal/80 line-clamp-2">
            {tip.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-warm-gray">
            <span>{"\u20B1"}{tip.totalBudget.toLocaleString()}</span>
            <span>
              {new Date(tip.createdAt).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

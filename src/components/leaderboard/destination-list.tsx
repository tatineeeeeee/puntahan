import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

interface Destination {
  _id: string;
  name: string;
  slug: string;
  region: string;
  avgRating: number;
  tipsCount: number;
}

export function LeaderboardDestinationList({
  destinations,
}: {
  destinations: Destination[] | undefined;
}) {
  if (destinations === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return <p className="text-sm text-warm-gray">No destinations yet.</p>;
  }

  return (
    <div className="space-y-2">
      {destinations.map((dest, i) => (
        <Link
          key={dest._id}
          href={`/destination/${dest.slug}`}
          className="flex items-center gap-3 rounded-xl bg-sand p-3 hover:shadow-md transition-shadow"
        >
          <span className="w-8 text-center text-lg">
            {i < 3 ? MEDALS[i] : `#${i + 1}`}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{dest.name}</p>
            <p className="text-xs text-warm-gray">{dest.region}</p>
          </div>
          <Rating value={dest.avgRating} size="sm" />
          <span className="text-xs text-warm-gray">{dest.tipsCount} tips</span>
        </Link>
      ))}
    </div>
  );
}

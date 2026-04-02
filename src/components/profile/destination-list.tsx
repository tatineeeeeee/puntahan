import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BookmarkItem {
  _id: string;
  destination: {
    _id: string;
    name: string;
    slug: string;
    region: string;
    province: string;
  } | null;
}

export function DestinationList({
  bookmarks,
  emptyMessage,
}: {
  bookmarks: BookmarkItem[];
  emptyMessage: string;
}) {
  if (bookmarks.length === 0) {
    return <p className="text-sm text-warm-gray">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-2">
      {bookmarks.map((bm) => {
        if (!bm.destination) return null;
        return (
          <Link
            key={bm._id}
            href={`/destination/${bm.destination.slug}`}
            className="flex items-center justify-between rounded-xl bg-sand p-4 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-medium text-sm text-charcoal">
                {bm.destination.name}
              </p>
              <p className="text-xs text-warm-gray">
                {bm.destination.province} · {bm.destination.region}
              </p>
            </div>
            <Badge
              variant={
                `region-${bm.destination.region.toLowerCase()}` as
                  | "region-ncr"
                  | "region-luzon"
                  | "region-visayas"
                  | "region-mindanao"
              }
            >
              {bm.destination.region}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}

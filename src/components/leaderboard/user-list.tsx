import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

interface User {
  _id: string;
  name: string;
  imageUrl: string | null;
  tipsCount: number;
  upvotesReceived: number;
}

export function UserList({
  users,
  statKey,
  statLabel,
}: {
  users: User[] | undefined;
  statKey: "tipsCount" | "upvotesReceived";
  statLabel: string;
}) {
  if (users === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-sm text-warm-gray">No users yet.</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user, i) => (
        <div
          key={user._id}
          className="flex items-center gap-3 rounded-xl bg-sand p-3"
        >
          <span className="w-8 text-center text-lg">
            {i < 3 ? MEDALS[i] : `#${i + 1}`}
          </span>
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{user.name}</p>
          </div>
          <Badge variant="budget">
            {user[statKey]} {statLabel}
          </Badge>
        </div>
      ))}
    </div>
  );
}

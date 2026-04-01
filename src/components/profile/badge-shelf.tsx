import {
  BADGE_DEFINITIONS,
  computeUserBadges,
  type BadgeDefinition,
} from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeShelfProps {
  stats: {
    tipsCount: number;
    upvotesReceived: number;
    destinationsVisited: number;
    photosUploaded: number;
  };
}

export function BadgeShelf({ stats }: BadgeShelfProps) {
  const earned = computeUserBadges(stats);
  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal mb-3">
        Badges
      </h2>
      <div className="flex flex-wrap gap-3">
        {BADGE_DEFINITIONS.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            earned={earnedIds.has(badge.id)}
            progress={Math.min(stats[badge.field] / badge.threshold, 1)}
          />
        ))}
      </div>
    </div>
  );
}

function BadgeItem({
  badge,
  earned,
  progress,
}: {
  badge: BadgeDefinition;
  earned: boolean;
  progress: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl p-3 text-center w-24",
        earned ? "bg-sunset/10" : "bg-warm-gray/5 opacity-50",
      )}
      title={badge.description}
    >
      <span className="text-2xl" aria-hidden="true">
        {badge.emoji}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-charcoal">
        {badge.name}
      </span>
      {!earned && (
        <div className="h-1 w-full rounded-full bg-warm-gray/20">
          <div
            className="h-1 rounded-full bg-sunset transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

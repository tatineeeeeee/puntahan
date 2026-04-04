import {
  BADGE_DEFINITIONS,
  computeUserBadges,
  computeLocalGuideBadges,
  type BadgeDefinition,
  type LocalGuideBadge,
} from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeShelfProps {
  stats: {
    tipsCount: number;
    upvotesReceived: number;
    destinationsVisited: number;
    photosUploaded: number;
  };
  provinceTipCounts?: Record<string, number>;
}

export function BadgeShelf({ stats, provinceTipCounts }: BadgeShelfProps) {
  const earned = computeUserBadges(stats);
  const earnedIds = new Set(earned.map((b) => b.id));
  const localGuideBadges = provinceTipCounts
    ? computeLocalGuideBadges(provinceTipCounts)
    : [];

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
        {localGuideBadges.map((lg) => (
          <LocalGuideItem key={lg.province} badge={lg} />
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

function LocalGuideItem({ badge }: { badge: LocalGuideBadge }) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl p-3 text-center w-24 bg-teal/10"
      title={`Local Guide: ${badge.tipsCount} tips in ${badge.province}`}
    >
      <span className="text-2xl" aria-hidden="true">
        📍
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-charcoal">
        {badge.province}
      </span>
      <span className="text-[9px] text-warm-gray">Local Guide</span>
    </div>
  );
}

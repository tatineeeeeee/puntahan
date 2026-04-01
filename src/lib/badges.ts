export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  field: "tipsCount" | "upvotesReceived" | "destinationsVisited" | "photosUploaded";
  threshold: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "explorer",
    name: "Explorer",
    emoji: "\u{1F9ED}",
    description: "Shared 5 travel tips",
    field: "tipsCount",
    threshold: 5,
  },
  {
    id: "local-guide",
    name: "Local Guide",
    emoji: "\u{1F3C6}",
    description: "Shared 20 travel tips",
    field: "tipsCount",
    threshold: 20,
  },
  {
    id: "trailblazer",
    name: "Trailblazer",
    emoji: "\u{1F525}",
    description: "Received 50 upvotes",
    field: "upvotesReceived",
    threshold: 50,
  },
  {
    id: "wanderer",
    name: "Wanderer",
    emoji: "\u{1F30D}",
    description: "Visited 10 destinations",
    field: "destinationsVisited",
    threshold: 10,
  },
  {
    id: "photographer",
    name: "Photographer",
    emoji: "\u{1F4F8}",
    description: "Uploaded 20 photos",
    field: "photosUploaded",
    threshold: 20,
  },
];

interface UserStats {
  tipsCount: number;
  upvotesReceived: number;
  destinationsVisited: number;
  photosUploaded: number;
}

export function computeUserBadges(stats: UserStats): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((badge) => stats[badge.field] >= badge.threshold);
}

export function getHighestBadge(stats: UserStats): BadgeDefinition | null {
  const earned = computeUserBadges(stats);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

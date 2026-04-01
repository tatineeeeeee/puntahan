import type { BadgeDefinition } from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  badge: BadgeDefinition;
  size?: "sm" | "md";
  className?: string;
}

export function BadgeIcon({ badge, size = "md", className }: BadgeIconProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-sunset/10 font-medium text-sunset",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className,
      )}
      title={badge.description}
    >
      <span aria-hidden="true">{badge.emoji}</span>
      {size === "md" && badge.name}
    </span>
  );
}

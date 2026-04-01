import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-sand text-charcoal",
  budget: "bg-sunset/15 text-sunset",
  "region-ncr": "bg-ncr/15 text-ncr",
  "region-luzon": "bg-luzon/15 text-luzon",
  "region-visayas": "bg-visayas/15 text-visayas",
  "region-mindanao": "bg-mindanao/15 text-mindanao",
} as const;

type Variant = keyof typeof variantStyles;

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

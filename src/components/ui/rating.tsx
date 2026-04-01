import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

type Size = keyof typeof sizeStyles;

interface RatingProps {
  value: number;
  max?: number;
  size?: Size;
  className?: string;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function Rating({ value, max = 5, size = "md", className }: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const starValue = i + 1;
    const isFull = value >= starValue;
    const isHalf = !isFull && value >= starValue - 0.5;

    return (
      <span key={i} className="relative inline-block">
        {/* Empty star (background) */}
        <StarIcon className={cn(sizeStyles[size], "text-warm-gray/30")} />

        {/* Filled or half star (overlay) */}
        {(isFull || isHalf) && (
          <span
            className="absolute inset-0 overflow-hidden"
            style={isHalf ? { width: "50%" } : undefined}
          >
            <StarIcon className={cn(sizeStyles[size], "text-sunset")} />
          </span>
        )}
      </span>
    );
  });

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${value} out of ${max} stars`}
    >
      {stars}
    </div>
  );
}

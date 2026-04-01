import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-coral", className)}
      aria-label="puntahan logo"
      role="img"
    >
      {/* Map pin shape */}
      <path
        d="M16 2C10.477 2 6 6.477 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z"
        fill="currentColor"
      />
      {/* Letter P */}
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="var(--font-dm-sans), sans-serif"
      >
        P
      </text>
    </svg>
  );
}

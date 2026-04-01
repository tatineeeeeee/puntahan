import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-coral text-white hover:bg-coral/90 focus-visible:ring-coral/50",
  secondary:
    "bg-teal text-white hover:bg-teal/90 focus-visible:ring-teal/50",
  ghost:
    "border border-warm-gray/30 text-charcoal hover:bg-sand focus-visible:ring-charcoal/20",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type Variant = keyof typeof variantStyles;
type Size = keyof typeof sizeStyles;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

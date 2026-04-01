import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-sand shadow-sm overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("px-4 pt-4", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn("px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn("px-4 pb-4", className)}>
      {children}
    </div>
  );
}

import { type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border border-warm-gray/20 bg-surface-highest px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal",
          className,
        )}
        {...props}
      />
    </div>
  );
}

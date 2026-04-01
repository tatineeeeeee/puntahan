import { type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-lg border border-warm-gray/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal",
          className,
        )}
        {...props}
      />
    </div>
  );
}

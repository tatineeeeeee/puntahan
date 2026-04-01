import { cn } from "@/lib/utils";

interface ComparisonBarProps {
  label: string;
  values: { name: string; value: number; color: string }[];
  max: number;
  format?: (v: number) => string;
}

export function ComparisonBar({ label, values, max, format }: ComparisonBarProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold uppercase tracking-wide text-charcoal">
        {label}
      </p>
      {values.map((item) => {
        const width = max > 0 ? (item.value / max) * 100 : 0;
        const best = item.value === Math.max(...values.map((v) => v.value));
        return (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-24 truncate text-xs text-warm-gray">
              {item.name}
            </span>
            <div className="flex-1 h-5 rounded-full bg-warm-gray/10 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", item.color)}
                style={{ width: `${Math.max(width, 2)}%` }}
              />
            </div>
            <span
              className={cn(
                "w-20 text-right text-xs font-medium",
                best ? "text-coral font-bold" : "text-charcoal",
              )}
            >
              {format ? format(item.value) : item.value}
              {best && " \u2605"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

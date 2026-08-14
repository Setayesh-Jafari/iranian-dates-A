import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  size = 15,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <span className="flex gap-0.5 text-date-900/15">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} strokeWidth={0} className="fill-current" />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold-500"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} strokeWidth={0} className="shrink-0 fill-current" />
        ))}
      </span>
    </span>
  );
}

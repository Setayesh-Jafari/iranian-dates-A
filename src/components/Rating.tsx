"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { t } from "@/i18n";

export function Rating({
  value,
  size = 15,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const { dict } = useI18n();
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={t(dict.reviews.ratedOutOf, { value })}
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
          <Star
            key={i}
            size={size}
            strokeWidth={0}
            className="shrink-0 fill-current"
          />
        ))}
      </span>
    </span>
  );
}

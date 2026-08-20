"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { dict, href } = useI18n();
  const light = tone === "light";

  return (
    <Link
      href={href("/")}
      aria-label="ME MAZAFATI"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 shadow-[0_6px_16px_rgba(197,133,44,0.35)] ring-1 ring-gold-500/30">
        <span className="font-display text-[13px] font-bold leading-none tracking-tight text-date-950">
          ME
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold uppercase tracking-[0.06em] transition-colors sm:text-xl",
            light ? "text-cream-50" : "text-date-900"
          )}
        >
          ME MAZAFATI
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] transition-colors",
            light ? "text-cream-50/55" : "text-date-500"
          )}
        >
          {dict.logo.tagline}
        </span>
      </span>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Wordmark. The brand name stays in its Latin form in both locales; only the
 * descriptor underneath is translated.
 */
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
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 shadow-[0_6px_16px_rgba(197,133,44,0.35)] ring-1 ring-gold-500/30">
        <span className="font-display text-lg font-semibold leading-none text-date-950">
          M
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight transition-colors",
            light ? "text-cream-50" : "text-date-900",
          )}
        >
          {dict.brand.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] transition-colors",
            light ? "text-cream-50/55" : "text-date-500",
          )}
        >
          {dict.brand.tagline}
        </span>
      </span>
    </Link>
  );
}

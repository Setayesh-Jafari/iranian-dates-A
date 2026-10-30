"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABELS,
  switchLocalePath,
} from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * Locale switcher.
 *
 * Every entry is a plain same-origin link to the current path in another
 * locale; the middleware persists the choice in the `NEXT_LOCALE` cookie on
 * the next request. No JavaScript routing and no redirect is involved.
 */
type LocaleSwitcherProps = { tone?: "light" | "dark"; className?: string };

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  return <Suspense fallback={null}><LocaleSwitcherContent {...props} /></Suspense>;
}

function LocaleSwitcherContent({ tone = "dark", className }: LocaleSwitcherProps) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || "/";
  const search = useSearchParams().toString();
  const currentPath = search ? `${pathname}?${search}` : pathname;
  const light = tone === "light";

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={dict.locale.label}
    >
      <Languages
        size={15}
        aria-hidden="true"
        className={cn(
          "hidden sm:block",
          light ? "text-cream-100/60" : "text-date-400",
        )}
      />
      {LOCALES.map((candidate) => {
        const active = candidate === locale;
        return (
          <Link
            key={candidate}
            href={switchLocalePath(currentPath, candidate)}
            hrefLang={candidate}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-1.5 py-1 text-[10px] font-semibold sm:px-2.5 sm:text-xs tabular-nums transition-colors",
              active
                ? light
                  ? "bg-cream-50/20 text-cream-50"
                  : "bg-date-900/8 text-date-900"
                : light
                  ? "text-cream-100/60 hover:text-cream-50"
                  : "text-date-500 hover:text-date-900",
            )}
          >
            {LOCALE_LABELS[candidate]}
          </Link>
        );
      })}
    </div>
  );
}

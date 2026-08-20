"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  LOCALES,
  LOCALE_LABELS,
  localePath,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Switches locale while keeping the visitor on the same page. */
export function LocaleSwitcher({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const light = tone === "light";

  function switchTo(next: Locale) {
    if (next === locale) return;
    // The middleware persists the NEXT_LOCALE cookie for the target prefix.
    router.push(localePath(next, stripLocale(pathname)));
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border p-0.5",
        light ? "border-cream-50/25" : "border-date-900/12",
        className
      )}
      role="group"
      aria-label={dict.common.language}
    >
      <Globe
        size={14}
        className={cn("ms-2 me-0.5", light ? "text-cream-50/70" : "text-date-500")}
        aria-hidden
      />
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => switchTo(code)}
          aria-current={code === locale}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            code === locale
              ? light
                ? "bg-cream-50 text-date-950"
                : "bg-date-900 text-cream-50"
              : light
                ? "text-cream-50/70 hover:text-cream-50"
                : "text-date-600 hover:text-date-900"
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

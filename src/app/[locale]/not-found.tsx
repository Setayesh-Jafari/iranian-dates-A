"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LOCALE_TAGS } from "@/i18n/config";

/**
 * Localized not-found boundary for the `[locale]` route tree.
 *
 * It is a client component because Next.js does not pass route params to
 * `not-found.tsx`; the locale comes from the provider instead.
 */
export default function NotFound() {
  const { dict, href, dir, locale } = useI18n();

  /**
   * Next renders a 404 through its global error shell (`<html id="__next_error__">`),
   * which does not inherit the locale layout's `lang` / `dir` attributes — so a
   * Persian 404 would otherwise render left-to-right. Re-applying them on the
   * document element keeps the whole page (including the shared header and
   * footer, which live in the layout) in the right language and direction.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_TAGS[locale];
    root.dir = dir;
  }, [locale, dir]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-semibold text-gold-300">404</p>
      <h1 className="mt-6 font-display text-3xl font-semibold text-date-900">
        {dict.notFound.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-date-600">
        {dict.notFound.text}
      </p>
      <Link
        href={href("/")}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
      >
        {dict.notFound.cta}
        <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : undefined} />
      </Link>
    </div>
  );
}

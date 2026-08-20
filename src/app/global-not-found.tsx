import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { inter, vazirmatn } from "@/fonts";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, dir, localePath } from "@/i18n/config";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `404 · ${SITE.brand}`,
  robots: { index: false, follow: false },
};

/** Rendered for URLs that match no route at all (outside any locale segment). */
export default function GlobalNotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);

  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={dir(DEFAULT_LOCALE)}
      className={`${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="grid min-h-screen place-items-center bg-cream-50 px-6 font-sans text-date-900 antialiased">
        <main className="max-w-md text-center">
          <p className="font-display text-6xl font-semibold text-gold-300">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            {dict.notFound.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-date-600">
            {dict.notFound.body}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {LOCALES.map((locale) => (
              <Link
                key={locale}
                href={localePath(locale)}
                className="rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
              >
                {LOCALE_LABELS[locale]}
              </Link>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}

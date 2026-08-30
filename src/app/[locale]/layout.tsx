import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { estedad, fraunces, gandom, inter } from "@/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_TAGS,
  dir as dirOf,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";

/**
 * Root layout for the localized route tree: `app/[locale]/**`.
 *
 * `<html lang>` and `dir` are derived from the active locale, which is what
 * makes the whole document switch to RTL for Persian.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Resolves the segment to a supported locale, falling back to the default. */
function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  // Set NEXT_PUBLIC_SITE_URL once the business verifies its public domain.
  const base = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  );

  return {
    metadataBase: base,
    title: {
      default: dict.meta.title,
      template: dict.meta.template,
    },
    description: dict.meta.description,
    keywords: [
      "Iranian dates export",
      "Mazafati dates wholesale",
      "Piarom dates",
      "date exporter Iran",
      "wholesale dates",
      "bulk dates supplier",
    ],
    alternates: {
      canonical: new URL(localePath(locale), base).toString(),
      languages: Object.fromEntries(
        LOCALES.map((candidate) => [
          LOCALE_TAGS[candidate],
          new URL(localePath(candidate), base).toString(),
        ]),
      ),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale: LOCALE_TAGS[locale],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#170e06",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  // The middleware routes every page through /en or /fa. Falling back to the
  // default locale keeps the shell (and the localized not-found page)
  // renderable if an unsupported segment ever reaches the layout directly.
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      dir={dirOf(locale)}
      className={`${inter.variable} ${fraunces.variable} ${estedad.variable} ${gandom.variable}`}
    >
      <body className="min-h-screen bg-cream-50 font-sans text-date-900 antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </I18nProvider>
      </body>
    </html>
  );
}

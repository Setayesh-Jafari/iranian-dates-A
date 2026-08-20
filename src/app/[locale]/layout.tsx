import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { estedad, fraunces, gandom, inter } from "@/fonts";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InquiryDrawer } from "@/components/InquiryDrawer";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_TAGS,
  dir,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";
import { SITE } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#170e06",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: dict.meta.title,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: localePath(locale),
      languages: {
        fa: "/fa",
        en: "/en",
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: localePath(locale),
      siteName: SITE.brand,
      locale: LOCALE_TAGS[locale].replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const direction = dir(locale);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.brand,
    legalName: locale === "fa" ? SITE.legalNameFa : SITE.legalName,
    url: `${SITE.url}${localePath(locale)}`,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: String(SITE.foundedYear),
    description: dict.meta.description,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        locale === "fa" ? SITE.address.fa : SITE.address.en,
      addressLocality: locale === "fa" ? SITE.city.fa : SITE.city.en,
      addressRegion: locale === "fa" ? "اصفهان" : "Isfahan Province",
      addressCountry: "IR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: "Worldwide",
  };

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      dir={direction}
      className={`${inter.variable} ${fraunces.variable} ${estedad.variable} ${gandom.variable}`}
    >
      <body className="min-h-screen bg-cream-50 font-sans text-date-900 antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <InquiryDrawer />
        </I18nProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { headers } from "next/headers";
import { LOCALES, LOCALE_TAGS, localePath, type Locale } from "@/i18n/config";

/** Canonical URLs are derived only from operator configuration, never Host. */
export function siteBase(): URL | null {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (!(["https:", "http:"].includes(url.protocol)) || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) return null;
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && !local) return null;
    return url;
  } catch {
    return null;
  }
}

/** Preview/unknown hosts get noindex, even when the production URL is set. */
export async function seoContext() {
  const base = siteBase();
  const requestHeaders = await headers();
  const host = requestHeaders.get("host")?.toLowerCase();
  const indexable = Boolean(
    base && host === base.host.toLowerCase() &&
    process.env.SITE_INDEXING_ENABLED === "true" &&
    process.env.VERCEL_ENV !== "preview",
  );
  return { base, indexable };
}

export function alternates(base: URL, locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const candidate of LOCALES) {
    languages[LOCALE_TAGS[candidate]] = new URL(localePath(candidate, path), base).toString();
  }
  languages["x-default"] = new URL(localePath("en", path), base).toString();
  return { canonical: new URL(localePath(locale, path), base).toString(), languages };
}

export async function pageMetadata({
  locale, path, title, description, image, noindex = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}): Promise<Metadata> {
  const { base, indexable } = await seoContext();
  const url = base ? new URL(localePath(locale, path), base).toString() : undefined;
  return {
    ...(base ? { metadataBase: base, alternates: alternates(base, locale, path) } : {}),
    title,
    description,
    robots: { index: indexable && !noindex, follow: true },
    openGraph: {
      type: "website", title, description, url,
      locale: LOCALE_TAGS[locale],
      alternateLocale: LOCALES.filter((candidate) => candidate !== locale).map((candidate) => LOCALE_TAGS[candidate]),
      siteName: "Mr.Mazafati",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title, description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** A single valid path segment, including non-Latin slugs, never a URL/path. */
export function isPublicProductSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 120 && slug !== "." && slug !== ".." &&
    !/[\/\\?#\s\u0000-\u001f\u007f]/u.test(slug);
}

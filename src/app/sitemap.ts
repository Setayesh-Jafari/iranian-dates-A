import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return [];
  }

  const base = siteUrl.replace(/\/+$/, "");

  // Public static paths identified:
  // - / (Home)
  // - /products (Product list)
  // - /certifications (Certifications)
  // NOTE: /products/[slug] (Dynamic product details)
  // LIMITATION: getProductBySlug and getProducts exist in @/lib/queries.ts,
  // but calling them directly in sitemap() requires a database connection (getDb)
  // which is NOT supported in Next.js MetadataRoute static generation (build time)
  // without a configured database pool in the build environment.
  // Since the environment build is isolated and no DB connection is guaranteed
  // for the sitemap generation phase (and to avoid fake URLs), the dynamic
  // slug paths are EXCLUDED. Only static paths are included.
  const publicPaths = ["", "/products", "/certifications"];

  const entries: {
    url: string;
    priority?: number;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [];

  for (const locale of LOCALES) {
    for (const path of publicPaths) {
      const url = new URL(localePath(locale, path), base).toString();
      entries.push({
        url,
        priority: path === "" ? 1.0 : 0.8,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}

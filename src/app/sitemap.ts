import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return [];
  }

  const base = siteUrl.replace(/\/+$/, "");

  const publicPaths = ["", "/products", "/certifications"];

  const entries: {
    url: string;
    lastModified?: Date;
    priority?: number;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [];

  for (const locale of LOCALES) {
    for (const path of publicPaths) {
      const url = new URL(localePath(locale, path), base).toString();
      entries.push({
        url,
        lastModified: new Date(),
        priority: path === "" ? 1.0 : 0.8,
        changeFrequency: "weekly",
      });
    }
  }

  return entries;
}

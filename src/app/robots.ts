import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Safe fallback: if domain is not set, disallow all to prevent indexing on unknown/localhost domains
  if (!siteUrl) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: undefined,
    };
  }

  const base = siteUrl.replace(/\/+$/, "");
  const sitemapUrl = `${base}/sitemap.xml`;

  // Unified group for user-agent *
  // No unnecessary Allow rules (crawler starts from / and follows sitemap/links)
  // Inquiry: No disallow (allows crawler to see noindex meta tag in HTML)
  // Checkout: Redirects to /products or /inquiry per layout/middleware; allow crawl to see redirect/noindex
  // Removed /_next/ disallow
  const rules: {
    userAgent: string;
    disallow?: string[];
    sitemap?: string;
  }[] = [
    {
      userAgent: "*",
      disallow: [
        "/api/",
        "/error",
        // Note: [locale] paths are real segments /en/ and /fa/
        // Inquiry and Checkout pages use noindex via metadata (layout/page) rather than robots disallow
        // so crawlers can see the noindex tag.
      ],
      sitemap: sitemapUrl,
    },
  ];

  return {
    rules,
    sitemap: sitemapUrl,
  };
}

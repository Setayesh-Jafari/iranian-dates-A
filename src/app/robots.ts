import type { MetadataRoute } from "next";
import { seoContext } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { base, indexable } = await seoContext();
  // Do not block inquiry or previews: crawlers need to read their noindex tag.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(indexable && base ? { sitemap: new URL("/sitemap.xml", base).toString() } : {}),
  };
}

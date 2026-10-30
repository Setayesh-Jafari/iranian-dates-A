import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/i18n/config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: undefined,
    };
  }

  const base = siteUrl.replace(/\/+$/, "");
  const sitemapUrl = `${base}/sitemap.xml`;

  const rules: {
    userAgent: string;
    allow?: string | string[];
    disallow?: string | string[];
  }[] = [
    { userAgent: "*", allow: "/" },
    { userAgent: "*", allow: "/en/" },
    { userAgent: "*", allow: "/fa/" },
    { userAgent: "*", allow: "/en/products" },
    { userAgent: "*", allow: "/fa/products" },
    { userAgent: "*", allow: "/en/certifications" },
    { userAgent: "*", allow: "/fa/certifications" },
    { userAgent: "*", allow: "/en/products/*" },
    { userAgent: "*", allow: "/fa/products/*" },
    
    { userAgent: "*", disallow: "/api/" },
    { userAgent: "*", disallow: "/_next/" },
    { userAgent: "*", disallow: "/inquiry" },
    { userAgent: "*", disallow: "/checkout" },
    { userAgent: "*", disallow: "/[locale]/inquiry" },
    { userAgent: "*", disallow: "/[locale]/checkout" },
    { userAgent: "*", disallow: "/error" },
  ];

  return {
    rules,
    sitemap: sitemapUrl,
  };
}

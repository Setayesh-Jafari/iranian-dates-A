import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/content/blog";
import { LOCALES, localePath } from "@/i18n/config";
import { SITE } from "@/lib/site";

const STATIC_PATHS = ["/", "/products", "/certifications", "/blog", "/inquiry"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE.url}${localePath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE.url}${localePath(l, path)}`])
          ),
        },
      });
    }

    for (const post of BLOG_POSTS) {
      entries.push({
        url: `${SITE.url}${localePath(locale, `/blog/${post.slug}`)}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE.url}${localePath(l, `/blog/${post.slug}`)}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}

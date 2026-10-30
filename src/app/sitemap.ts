import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_TAGS, localePath } from "@/i18n/config";
import { getProductSlugs } from "@/lib/queries";
import { isPublicProductSlug, seoContext } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { base, indexable } = await seoContext();
  if (!base || !indexable) return [];
  // Fail the sitemap request if the DB is down instead of publishing an
  // incomplete sitemap that makes real products disappear from search.
  const slugs = await getProductSlugs();
  const paths = ["/", "/products", "/certifications", ...slugs.filter(isPublicProductSlug).map((slug) => `/products/${encodeURIComponent(slug)}`)];
  return paths.flatMap((path) => {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[LOCALE_TAGS[locale]] = new URL(localePath(locale, path), base).toString();
    languages["x-default"] = new URL(localePath("en", path), base).toString();
    return LOCALES.map((locale) => ({
      url: new URL(localePath(locale, path), base).toString(),
      alternates: { languages },
    }));
  });
}

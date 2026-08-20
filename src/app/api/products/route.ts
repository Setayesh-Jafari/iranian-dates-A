import { getCategoryFacets, getProducts } from "@/lib/queries";
import { localizeProducts } from "@/i18n/products";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

// Public B2B API: product payloads never include pricing (see serializeProduct).

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const sort = url.searchParams.get("sort") ?? undefined;
  const minRating = url.searchParams.get("rating") ? Number(url.searchParams.get("rating")) : undefined;
  const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined;

  const [products, facets] = await Promise.all([
    getProducts({ category, q, sort, minRating, limit }),
    getCategoryFacets(),
  ]);

  const rawLocale = url.searchParams.get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const localized = localizeProducts(products, locale);

  return Response.json({
    products: localized,
    facets,
    total: localized.length,
    locale,
  });
}

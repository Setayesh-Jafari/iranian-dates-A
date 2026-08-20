import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/queries";
import { localizeProduct, localizeProducts } from "@/i18n/products";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

// Public B2B API: product payloads never include pricing (see serializeProduct).
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const rawLocale = new URL(request.url).searchParams.get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product, 4),
  ]);

  return Response.json({
    product: localizeProduct(product, locale),
    reviews,
    related: localizeProducts(related, locale),
    locale,
  });
}

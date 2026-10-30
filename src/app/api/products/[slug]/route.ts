import { isLocale } from "@/i18n/config";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug || slug.length > 120) {
    return Response.json({ error: "Invalid product reference" }, { status: 400 });
  }
  const locale = new URL(request.url).searchParams.get("locale") || "en";
  if (!isLocale(locale)) return Response.json({ error: "locale must be en or fa" }, { status: 400 });
  try {
    const product = await getProductBySlug(slug, locale);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product, 4, locale),
  ]);

    return Response.json({ product, reviews, related });
  } catch (error) {
    console.error("[api/products/slug] query failed:", error instanceof Error ? error.constructor.name : "unknown error");
    return Response.json({ error: "Products are temporarily unavailable. Please try again later." }, {
      status: 503, headers: { "Retry-After": "30" },
    });
  }
}

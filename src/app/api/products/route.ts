import { getCategoryFacets, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const sort = url.searchParams.get("sort") ?? undefined;
  const minPrice = url.searchParams.get("min") ? Number(url.searchParams.get("min")) : undefined;
  const maxPrice = url.searchParams.get("max") ? Number(url.searchParams.get("max")) : undefined;
  const minRating = url.searchParams.get("rating") ? Number(url.searchParams.get("rating")) : undefined;
  const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined;

  const [products, facets] = await Promise.all([
    getProducts({ category, q, sort, minPrice, maxPrice, minRating, limit }),
    getCategoryFacets(),
  ]);

  return Response.json({ products, facets, total: products.length });
}

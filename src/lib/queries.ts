import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, ne, or, type SQL } from "drizzle-orm";
import { serializeProduct, serializeReview } from "@/lib/serialize";
import type { Product, Review } from "@/lib/types";

export type ProductFilters = {
  category?: string;
  q?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const conditions: SQL[] = [];

  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (filters.q) {
    const like = `%${filters.q}%`;
    const searchCondition = or(ilike(products.name, like), ilike(products.description, like));
    if (searchCondition) conditions.push(searchCondition);
  }
  if (filters.minPrice && filters.minPrice > 0) conditions.push(gte(products.price, filters.minPrice));
  if (filters.maxPrice && filters.maxPrice > 0) conditions.push(lte(products.price, filters.maxPrice));
  if (filters.minRating && filters.minRating > 0) conditions.push(gte(products.rating, filters.minRating));

  const order: SQL[] = [];
  switch (filters.sort) {
    case "price-asc":
      order.push(asc(products.price));
      break;
    case "price-desc":
      order.push(desc(products.price));
      break;
    case "rating":
      order.push(desc(products.rating));
      break;
    case "newest":
      order.push(desc(products.createdAt));
      break;
    default:
      order.push(desc(products.featured), desc(products.rating), desc(products.reviewCount));
  }

  const query = db.select().from(products).$dynamic();
  if (conditions.length) query.where(and(...conditions));
  query.orderBy(...order);
  if (filters.limit) query.limit(filters.limit);

  const rows = await query;
  return rows.map(serializeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ? serializeProduct(rows[0]) : null;
}

export async function getReviewsForProduct(productId: number): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
  return rows.map(serializeReview);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), ne(products.id, product.id)))
    .limit(limit);
  const result = rows.map(serializeProduct);

  if (result.length >= limit) return result;

  const extra = await db
    .select()
    .from(products)
    .where(ne(products.id, product.id))
    .limit(limit - result.length);
  return [...result, ...extra.map(serializeProduct)];
}

export async function getCategoryFacets(): Promise<Record<string, number>> {
  const rows = await db.select({ category: products.category }).from(products);
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.category] = (counts[row.category] ?? 0) + 1;
  return counts;
}

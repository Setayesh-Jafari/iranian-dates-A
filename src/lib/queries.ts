import { getDb } from "@/db";
import { products, productTranslations, reviews } from "@/db/schema";
import { and, desc, eq, gte, ilike, ne, notInArray, or, type SQL } from "drizzle-orm";
import { serializeProduct, serializeReview } from "@/lib/serialize";
import type { Product, Review } from "@/lib/types";
import type { Locale } from "@/i18n/config";

export type ProductFilters = {
  category?: string;
  q?: string;
  sort?: string;
  minRating?: number;
  limit?: number;
  locale?: Locale;
};

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const db = getDb();
  const locale = filters.locale ?? "en";
  const conditions: SQL[] = [eq(products.published, true)];
  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (filters.q) {
    const like = `%${escapeLike(filters.q)}%`;
    const search = or(ilike(products.name, like), ilike(products.description, like),
      ilike(productTranslations.name, like), ilike(productTranslations.description, like));
    if (search) conditions.push(search);
  }
  if (filters.minRating && filters.minRating > 0) conditions.push(gte(products.rating, filters.minRating));
  const order: SQL[] = [];
  switch (filters.sort) {
    case "rating": order.push(desc(products.rating)); break;
    case "newest": order.push(desc(products.createdAt)); break;
    default: order.push(desc(products.featured), desc(products.rating), desc(products.reviewCount));
  }
  // Use id as a stable tiebreaker to prevent duplicate/reshuffled listings.
  order.push(desc(products.id));
  const query = db.select({ product: products, translation: productTranslations }).from(products)
    .leftJoin(productTranslations, and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale)))
    .$dynamic();
  if (conditions.length) query.where(and(...conditions));
  query.orderBy(...order);
  if (filters.limit && Number.isFinite(filters.limit)) query.limit(Math.max(1, Math.floor(filters.limit)));
  const rows = await query;
  return rows.map(({ product, translation }) => serializeProduct(product, translation));
}

/** Select only public identifiers; sitemap must not expose prices or private data. */
export async function getProductSlugs(): Promise<string[]> {
  const rows = await getDb().select({ slug: products.slug }).from(products).where(eq(products.published, true));
  return rows.map((row) => row.slug);
}

export async function getProductBySlug(slug: string, locale: Locale = "en"): Promise<Product | null> {
  const rows = await getDb().select({ product: products, translation: productTranslations }).from(products)
    .leftJoin(productTranslations, and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale)))
    .where(and(eq(products.slug, slug), eq(products.published, true))).limit(1);
  return rows[0] ? serializeProduct(rows[0].product, rows[0].translation) : null;
}

export async function getReviewsForProduct(productId: number): Promise<Review[]> {
  const rows = await getDb().select().from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")))
    .orderBy(desc(reviews.createdAt));
  return rows.map(serializeReview);
}

export async function getRelatedProducts(product: Product, limit = 4, locale: Locale = "en"): Promise<Product[]> {
  const db = getDb();
  const join = and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale));
  const rows = await db.select({ product: products, translation: productTranslations }).from(products)
    .leftJoin(productTranslations, join)
    .where(and(eq(products.category, product.category), eq(products.published, true), ne(products.id, product.id)))
    .orderBy(desc(products.id)).limit(limit);
  const result = rows.map((row) => serializeProduct(row.product, row.translation));
  if (result.length >= limit) return result;
  const extra = await db.select({ product: products, translation: productTranslations }).from(products)
    .leftJoin(productTranslations, join)
    .where(and(eq(products.published, true), ne(products.id, product.id), notInArray(products.id, result.map((p) => p.id))))
    .orderBy(desc(products.id)).limit(limit - result.length);
  return [...result, ...extra.map((row) => serializeProduct(row.product, row.translation))];
}

export async function getCategoryFacets(): Promise<Record<string, number>> {
  const rows = await getDb().select({ category: products.category }).from(products).where(eq(products.published, true));
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.category] = (counts[row.category] ?? 0) + 1;
  return counts;
}

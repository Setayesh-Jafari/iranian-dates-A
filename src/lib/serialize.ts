import type { Product, Review } from "@/lib/types";
import type { ProductRow, ReviewRow } from "@/db/schema";

export function serializeProduct(p: ProductRow): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    details: p.details,
    // price / compareAtPrice intentionally omitted: B2B catalog, quotes only.
    category: p.category,
    origin: p.origin,
    weight: p.weight,
    unit: p.unit,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    featured: p.featured,
    isNew: p.isNew,
    badge: p.badge,
    images: p.images ?? [],
    highlights: p.highlights ?? [],
    createdAt: p.createdAt.toISOString(),
  };
}

export function serializeReview(r: ReviewRow): Review {
  return {
    id: r.id,
    productId: r.productId,
    author: r.author,
    location: r.location,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  };
}

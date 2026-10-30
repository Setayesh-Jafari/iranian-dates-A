import type { Product, Review } from "@/lib/types";
import type { ProductRow, ProductTranslationRow, ReviewRow } from "@/db/schema";

export function serializeProduct(p: ProductRow, translation?: ProductTranslationRow | null): Product {
  // A partial translation must not mark English fallback text as Persian.
  const translated = translation?.name?.trim() && translation?.description?.trim() ? translation : null;
  const localized = (value: string | null | undefined, fallback: string | null) => value?.trim() || fallback;
  return {
    id: p.id,
    slug: p.slug,
    name: localized(translated?.name, p.name)!,
    tagline: localized(translated?.tagline, p.tagline),
    description: localized(translated?.description, p.description)!,
    details: localized(translated?.details, p.details),
    category: p.category,
    origin: localized(translated?.origin, p.origin)!,
    weight: localized(translated?.weight, p.weight)!,
    unit: localized(translated?.unit, p.unit)!,
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
    isNew: p.isNew,
    badge: localized(translated?.badge, p.badge),
    images: p.images ?? [],
    highlights: translated?.highlights?.length ? translated.highlights : p.highlights ?? [],
    contentLocale: translated?.locale ?? "en",
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
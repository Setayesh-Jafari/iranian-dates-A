export const CATEGORY_SLUGS = [
  "premium",
  "soft",
  "dry",
  "products",
  "gifts",
  "wholesale",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

/**
 * Public product shape.
 *
 * Note: this is a B2B catalog — prices are never exposed publicly.
 * Price columns still exist in the database for internal quoting, but they are
 * deliberately not serialized into anything the browser or the public API sees.
 */
export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  details: string | null;
  category: string;
  origin: string;
  weight: string;
  unit: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  isNew: boolean;
  badge: string | null;
  images: string[];
  highlights: string[];
  createdAt: string;
};

export type Review = {
  id: number;
  productId: number;
  author: string;
  location: string | null;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
};

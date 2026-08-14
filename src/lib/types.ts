export type Category = {
  slug: string;
  label: string;
  short: string;
};

export const CATEGORIES: Category[] = [
  { slug: "premium", label: "Premium Dates", short: "Mazafati, Piarom & more" },
  { slug: "soft", label: "Soft Dates", short: "Kabkab, Rabbi & moist picks" },
  { slug: "dry", label: "Dry & Semi-Dry", short: "Zahedi, Sayer & more" },
  { slug: "products", label: "Date Products", short: "Syrup, paste, sugar & more" },
  { slug: "gifts", label: "Gifts & Gifting", short: "Curated boxes & stuffed dates" },
  { slug: "wholesale", label: "Wholesale", short: "Bulk cartons for importers" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  details: string | null;
  price: number;
  compareAtPrice: number | null;
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

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  weight: string;
  unit: string;
  qty: number;
};

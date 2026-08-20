import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryFacets, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, type FilterState } from "@/components/ProductFilters";
import { categoryLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse our full range of export-grade Iranian dates — Mazafati, Piarom, Zahedi and more. Bulk supply for importers and wholesalers worldwide.",
};

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const filters: FilterState = {
    q: first(sp.q) || undefined,
    category: first(sp.category) || undefined,
    sort: first(sp.sort) || undefined,
    min: first(sp.min) ? Number(first(sp.min)) : undefined,
    max: first(sp.max) ? Number(first(sp.max)) : undefined,
    rating: first(sp.rating) ? Number(first(sp.rating)) : undefined,
  };

  const [products, facets] = await Promise.all([
    getProducts(filters),
    getCategoryFacets(),
  ]);

  const heading = filters.category
    ? categoryLabel(filters.category)
    : filters.q
      ? `Results for "${filters.q}"`
      : "Full Product Catalog";

  return (
    <div>
      <div className="border-b border-date-900/10 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            {filters.category ? "Collection" : "Export catalog"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-date-900 sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 max-w-xl text-base text-date-600">
            Export-grade Iranian dates, graded and cold-chained from the grove.
            Add products to your inquiry list and request a custom quote.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <ProductFilters filters={filters} facets={facets} total={products.length}>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-date-900/15 bg-white/50 px-6 py-24 text-center">
              <p className="font-display text-xl font-semibold text-date-900">
                No products found
              </p>
              <p className="mt-2 max-w-sm text-sm text-date-500">
                We couldn&apos;t match your search. Try a different keyword or clear
                the filters.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="animate-fade-up grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </ProductFilters>
      </div>
    </div>
  );
}

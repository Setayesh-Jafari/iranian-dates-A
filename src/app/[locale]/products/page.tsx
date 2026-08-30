import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryFacets, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, type FilterState } from "@/components/ProductFilters";
import { getDictionary, categoryLabel, t } from "@/i18n";
import {
  DEFAULT_LOCALE,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";

export const dynamic = "force-dynamic";

function resolveLocale(raw: string): Locale | null {
  return isLocale(raw) ? raw : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw) ?? DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.productsTitle,
    description: dict.meta.productsDescription,
  };
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  if (!locale) notFound();

  const dict = getDictionary(locale);
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
    ? categoryLabel(dict, filters.category)
    : filters.q
      ? t(dict.products.resultsFor, { q: filters.q })
      : dict.products.title;

  return (
    <div>
      <div className="border-b border-date-900/10 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            {filters.category
              ? dict.products.eyebrowCollection
              : dict.products.eyebrowCatalog}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-date-900 sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 max-w-xl text-base text-date-600">
            {dict.products.text}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <ProductFilters filters={filters} facets={facets} total={products.length}>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-date-900/15 bg-white/50 px-6 py-24 text-center">
              <p className="font-display text-xl font-semibold text-date-900">
                {dict.products.emptyTitle}
              </p>
              <p className="mt-2 max-w-sm text-sm text-date-500">
                {dict.products.emptyText}
              </p>
              <Link
                href={localePath(locale, "/products")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
              >
                {dict.common.clearAllFilters}
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

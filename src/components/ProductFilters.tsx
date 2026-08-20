"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { CATEGORY_SLUGS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/i18n/I18nProvider";
import { formatNumber, t } from "@/i18n";

export type FilterState = {
  q?: string;
  category?: string;
  sort?: string;
  rating?: number;
};

/** B2B catalog: sorting/filtering by price is intentionally not offered. */
const SORTS = ["featured", "rating", "newest", "name"] as const;

export function ProductFilters({
  filters,
  facets,
  total,
  children,
}: {
  filters: FilterState;
  facets: Record<string, number>;
  total: number;
  children: ReactNode;
}) {
  const { dict, href, locale } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");
  const firstRender = useRef(true);

  function buildUrl(next: FilterState) {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
    if (next.rating) params.set("rating", String(next.rating));
    const qs = params.toString();
    return qs ? `${href("/products")}?${qs}` : href("/products");
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.push(buildUrl({ ...filters, q: q.trim() || undefined }), {
        scroll: false,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCount = [filters.category, filters.rating ? "rating" : undefined].filter(
    Boolean
  ).length;

  function go(overrides: Partial<FilterState>) {
    router.push(buildUrl({ ...filters, ...overrides }), { scroll: false });
    setOpen(false);
  }

  function clearAll() {
    router.push(href("/products"), { scroll: false });
    setOpen(false);
  }

  const content = (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
          {dict.filters.category}
        </h4>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => go({ category: undefined })}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
              !filters.category
                ? "bg-date-900 text-cream-50"
                : "text-date-700 hover:bg-cream-100"
            )}
          >
            <span>{dict.filters.allProducts}</span>
            <span
              className={cn(
                "text-xs",
                !filters.category ? "text-cream-100/60" : "text-date-400"
              )}
            >
              {formatNumber(total, locale)}
            </span>
          </button>
          {CATEGORY_SLUGS.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => go({ category: slug })}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                filters.category === slug
                  ? "bg-date-900 text-cream-50"
                  : "text-date-700 hover:bg-cream-100"
              )}
            >
              <span>{dict.categories[slug].label}</span>
              <span
                className={cn(
                  "text-xs",
                  filters.category === slug ? "text-cream-100/60" : "text-date-400"
                )}
              >
                {formatNumber(facets[slug] ?? 0, locale)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
          {dict.filters.rating}
        </h4>
        <div className="mt-3 flex flex-col gap-1">
          {[4.5, 4].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                go({ rating: filters.rating === value ? undefined : value })
              }
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                filters.rating === value
                  ? "bg-date-900 text-cream-50"
                  : "text-date-700 hover:bg-cream-100"
              )}
            >
              <Star
                size={14}
                className={cn(
                  filters.rating === value
                    ? "fill-gold-400 text-gold-400"
                    : "fill-gold-500 text-gold-500"
                )}
              />
              {t(dict.filters.ratingUp, {
                n: locale === "fa" ? formatNumber(value, locale) : value,
              })}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:text-gold-600"
        >
          <X size={14} /> {dict.filters.clear}
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-date-900/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-date-900/12 bg-white px-4 py-2.5 text-sm font-medium text-date-800 transition-colors hover:bg-cream-100 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            {dict.filters.filters}
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-date-950">
                {formatNumber(activeCount, locale)}
              </span>
            )}
          </button>
          <p className="text-sm text-date-500">
            {total === 1
              ? dict.products.countOne
              : t(dict.products.count, { n: formatNumber(total, locale) })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden flex-1 sm:block">
            <Search
              size={16}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-date-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={dict.filters.search}
              aria-label={dict.filters.search}
              className="w-56 rounded-full border border-date-900/12 bg-white py-2.5 pe-4 ps-10 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>
          <div className="relative">
            <select
              value={filters.sort ?? "featured"}
              onChange={(e) => go({ sort: e.target.value })}
              aria-label={dict.filters.sort}
              className="appearance-none rounded-full border border-date-900/12 bg-white py-2.5 pe-10 ps-4 text-sm font-medium text-date-800 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            >
              {SORTS.map((value) => (
                <option key={value} value={value}>
                  {dict.filters.sorts[value]}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-date-400"
            />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative mt-4 sm:hidden">
        <Search
          size={16}
          className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-date-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={dict.filters.search}
          aria-label={dict.filters.search}
          className="w-full rounded-full border border-date-900/12 bg-white py-3 pe-4 ps-10 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
        />
      </div>

      {/* Layout */}
      <div className="mt-8 lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:block">{content}</aside>
        <div>{children}</div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label={dict.filters.close}
              className="fixed inset-0 z-[60] bg-date-950/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed bottom-0 start-0 end-0 z-[70] max-h-[80vh] overflow-y-auto rounded-t-3xl bg-cream-50 p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-date-900">
                  {dict.filters.filters}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={dict.filters.close}
                  className="grid h-10 w-10 place-items-center rounded-full text-date-600 hover:bg-date-900/5"
                >
                  <X size={20} />
                </button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/i18n/I18nProvider";
import { categoryLabel, t } from "@/i18n";

export type FilterState = {
  q?: string;
  category?: string;
  sort?: string;
  min?: number;
  max?: number;
  rating?: number;
};

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
  const { dict, dir, href } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");
  const firstRender = useRef(true);

  const productsHref = href("/products");

  function buildUrl(next: FilterState) {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
    if (next.min) params.set("min", String(next.min));
    if (next.max) params.set("max", String(next.max));
    if (next.rating) params.set("rating", String(next.rating));
    const qs = params.toString();
    return qs ? `${productsHref}?${qs}` : productsHref;
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      router.push(buildUrl({ ...filters, q: q.trim() || undefined }), {
        scroll: false,
      });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const PRICE_BRACKETS = [
    { key: "under500", min: 0, max: 499, label: dict.priceBrackets.under500 },
    {
      key: "from500to1000",
      min: 500,
      max: 1000,
      label: dict.priceBrackets.from500to1000,
    },
    {
      key: "from1000to2000",
      min: 1000,
      max: 2000,
      label: dict.priceBrackets.from1000to2000,
    },
    { key: "over2000", min: 2000, max: 0, label: dict.priceBrackets.over2000 },
  ];

  const SORTS = [
    { value: "featured", label: dict.sorts.featured },
    { value: "price-asc", label: dict.sorts.priceAsc },
    { value: "price-desc", label: dict.sorts.priceDesc },
    { value: "rating", label: dict.sorts.rating },
    { value: "newest", label: dict.sorts.newest },
  ];

  const RATINGS = [
    { value: 4.5, label: dict.ratingFilters.fourAndHalf },
    { value: 4, label: dict.ratingFilters.four },
  ];

  const noun = total === 1 ? dict.common.productOne : dict.common.productMany;

  const activeCount = [
    filters.category,
    filters.min || filters.max ? "price" : undefined,
    filters.rating ? "rating" : undefined,
  ].filter(Boolean).length;

  function go(overrides: Partial<FilterState>) {
    router.push(buildUrl({ ...filters, ...overrides }), { scroll: false });
    setOpen(false);
  }

  function clearAll() {
    router.push(productsHref, { scroll: false });
    setOpen(false);
  }

  const content = (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
          {dict.common.category}
        </h4>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => go({ category: undefined })}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
              !filters.category
                ? "bg-date-900 text-cream-50"
                : "text-date-700 hover:bg-cream-100",
            )}
          >
            <span>{dict.common.allProducts}</span>
            <span
              className={cn(
                "text-xs",
                !filters.category ? "text-cream-100/60" : "text-date-400",
              )}
            >
              {total}
            </span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => go({ category: c.slug })}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                filters.category === c.slug
                  ? "bg-date-900 text-cream-50"
                  : "text-date-700 hover:bg-cream-100",
              )}
            >
              <span>{categoryLabel(dict, c.slug)}</span>
              <span
                className={cn(
                  "text-xs",
                  filters.category === c.slug
                    ? "text-cream-100/60"
                    : "text-date-400",
                )}
              >
                {facets[c.slug] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
          {dict.common.price}
        </h4>
        <div className="mt-3 flex flex-col gap-1">
          {PRICE_BRACKETS.map((b) => {
            const active = filters.min === b.min && filters.max === b.max;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() =>
                  go({ min: b.min || undefined, max: b.max || undefined })
                }
                className={cn(
                  "rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                  active
                    ? "bg-date-900 text-cream-50"
                    : "text-date-700 hover:bg-cream-100",
                )}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
          {dict.common.rating}
        </h4>
        <div className="mt-3 flex flex-col gap-1">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() =>
                go({ rating: filters.rating === r.value ? undefined : r.value })
              }
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                filters.rating === r.value
                  ? "bg-date-900 text-cream-50"
                  : "text-date-700 hover:bg-cream-100",
              )}
            >
              <Star
                size={14}
                className={cn(
                  filters.rating === r.value
                    ? "fill-gold-400 text-gold-400"
                    : "fill-gold-500 text-gold-500",
                )}
              />
              {r.label}
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
          <X size={14} /> {dict.common.clearAllFilters}
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
            {dict.common.filters}
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-date-950">
                {activeCount}
              </span>
            )}
          </button>
          <p className="text-sm text-date-500">
            <span className="font-semibold text-date-900">{total}</span> {noun}
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
              placeholder={dict.common.searchPlaceholder}
              className="w-56 rounded-full border border-date-900/12 bg-white py-2.5 pe-4 ps-10 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>
          <div className="relative">
            <select
              value={filters.sort ?? "featured"}
              onChange={(e) => go({ sort: e.target.value })}
              className="appearance-none rounded-full border border-date-900/12 bg-white py-2.5 pe-10 ps-4 text-sm font-medium text-date-800 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
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
          placeholder={dict.common.searchPlaceholder}
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
              aria-label={dict.common.closeFilters}
              className="fixed inset-0 z-[60] bg-date-950/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 start-0 z-[70] w-[85%] max-w-sm overflow-y-auto bg-cream-50 p-6"
              initial={{ x: dir === "rtl" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: dir === "rtl" ? "100%" : "-100%" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-date-900">
                  {dict.common.filters}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={dict.common.closeFilters}
                  className="grid h-9 w-9 place-items-center rounded-full text-date-600 hover:bg-cream-100"
                >
                  <X size={18} />
                </button>
              </div>
              {content}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-8 w-full rounded-full bg-date-900 py-3.5 text-sm font-semibold text-cream-50"
              >
                {t(dict.common.showProducts, { count: total, noun })}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

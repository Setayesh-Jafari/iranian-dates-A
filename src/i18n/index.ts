import { en, type Dictionary } from "./dictionaries/en";
import { fa } from "./dictionaries/fa";
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, fa };

/** Returns the dictionary for a locale, falling back to the default locale. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Minimal `{placeholder}` interpolation for dictionary strings.
 *
 * Unknown placeholders are left untouched so a missing value can never
 * silently erase part of a sentence.
 */
export function t(
  template: string,
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale]).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Buyer-facing label for a stored quantity unit.
 *
 * `src/lib/inquiry.ts` owns the canonical unit values and stays untouched
 * (it is part of the PR #5 safety baseline); only the display label is
 * localized here.
 */
export function unitLabel(
  dict: Dictionary,
  unit: string | undefined,
): string {
  if (unit === "cartons") return dict.units.cartons;
  if (unit === "metric_tons") return dict.units.metric_tons;
  return dict.units.kg;
}

/** Display name for a country value, falling back to the stored value. */
export function countryLabel(dict: Dictionary, country: string): string {
  const labels = dict.countries as Record<string, string>;
  return labels[country] ?? country;
}

/** Localized category label for a category slug. */
export function categoryLabel(dict: Dictionary, slug: string): string {
  const categories = dict.categories as Record<
    string,
    { label: string; short: string }
  >;
  return categories[slug]?.label ?? slug;
}

/** Localized short category description ("Mazafati, Piarom & more"). */
export function categoryShort(dict: Dictionary, slug: string): string {
  const categories = dict.categories as Record<
    string,
    { label: string; short: string }
  >;
  return categories[slug]?.short ?? slug;
}

export type { Dictionary };

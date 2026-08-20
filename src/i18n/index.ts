import { en, type Dictionary } from "./dictionaries/en";
import { fa } from "./dictionaries/fa";
import { DEFAULT_LOCALE, type Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** Interpolate {placeholders} in a dictionary string. */
export function t(
  template: string,
  values: Record<string, string | number> = {}
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

/** Locale-aware number formatting (Persian digits for fa). */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export type { Dictionary };

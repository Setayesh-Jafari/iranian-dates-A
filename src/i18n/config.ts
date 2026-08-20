export const LOCALES = ["fa", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

export const LOCALE_LABELS: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

/** BCP-47 tags used for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAGS: Record<Locale, string> = {
  fa: "fa-IR",
  en: "en",
};

export const RTL_LOCALES: Locale[] = ["fa"];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

/** Prefix an internal path with the active locale: ("fa", "/products") -> "/fa/products" */
export function localePath(locale: Locale, path = "/"): string {
  if (!path.startsWith("/")) return `/${locale}/${path}`;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Strip a leading locale segment from a pathname: "/fa/products" -> "/products" */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

/** Pick the best supported locale from an Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

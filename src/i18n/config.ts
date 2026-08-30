/**
 * Locale configuration shared by the middleware, the server components and
 * the client provider.
 *
 * Only `en` and `fa` are supported. `en` is the default: it is used when
 * neither the `NEXT_LOCALE` cookie nor the `Accept-Language` header express a
 * supported preference.
 */

export const LOCALES = ["en", "fa"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Name of the cookie that remembers an explicit locale choice. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Language tags used for `<html lang>` and for `Intl.*` formatting. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  fa: "fa-IR",
};

/** Native names, used by the locale switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Reading direction for a locale. */
export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

/**
 * Prefixes an app-relative path with the locale segment.
 * `/` becomes `/en`; `/products` becomes `/en/products`.
 */
export function localePath(locale: Locale, path = "/"): string {
  const suffix = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${suffix}`;
}

/** Removes a leading locale segment, if present. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

/**
 * Replaces the locale segment of a pathname, keeping the rest of the path
 * (and any query string) intact. Used by the locale switcher.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const [pathOnly, query] = pathname.split("?");
  const rest = stripLocale(pathOnly || "/");
  const target = localePath(next, rest);
  return query ? `${target}?${query}` : target;
}

type RankedTag = { tag: string; q: number };

/**
 * Picks the best supported locale from an `Accept-Language` header.
 *
 * The header is parsed by q-value (highest first, stable for equal weights);
 * the first entry whose primary subtag is a supported locale wins. Anything
 * unparseable, missing or unsupported falls back to `DEFAULT_LOCALE`.
 */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked: RankedTag[] = header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const parsedQ = qParam ? Number(qParam.split("=")[1]) : 1;
      return {
        tag: (rawTag ?? "").trim().toLowerCase(),
        q: Number.isFinite(parsedQ) ? parsedQ : 0,
      };
    })
    .filter((entry) => entry.tag !== "" && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { dir as dirOf, localePath, type Locale } from "@/i18n/config";

type I18nValue = {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  /** Build a locale-prefixed internal href. */
  href: (path?: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dict,
      dir: dirOf(locale),
      href: (path = "/") => localePath(locale, path),
    }),
    [locale, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}

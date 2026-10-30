import type { ReactNode } from "react";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return pageMetadata({
    locale, path: "/inquiry", title: dict.inquiry.title, description: dict.inquiry.subtitle, noindex: true,
  });
}

export default function InquiryLayout({ children }: { children: ReactNode }) {
  return children;
}

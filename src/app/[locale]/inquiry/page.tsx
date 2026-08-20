import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.inquiry.title,
    description: dict.meta.inquiry.description,
    alternates: {
      canonical: localePath(locale, "/inquiry"),
      languages: { fa: "/fa/inquiry", en: "/en/inquiry" },
    },
    robots: { index: true, follow: true },
  };
}

export default function InquiryPage() {
  return <InquiryForm />;
}

"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LocaleNotFound() {
  const { dict, href } = useI18n();

  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center sm:px-6">
      <p className="font-display text-6xl font-semibold text-gold-300">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-date-900">
        {dict.notFound.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-date-600">
        {dict.notFound.body}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={href("/")}
          className="inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
        >
          {dict.notFound.cta} <ArrowRight size={16} className="rtl:rotate-180" />
        </Link>
        <Link
          href={href("/inquiry")}
          className="inline-flex items-center gap-2 rounded-full border border-date-900/15 px-6 py-3 text-sm font-semibold text-date-800 transition-colors hover:bg-cream-100"
        >
          <ClipboardList size={16} /> {dict.common.requestQuote}
        </Link>
      </div>
    </div>
  );
}

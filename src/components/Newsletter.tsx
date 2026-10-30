"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/** No mailing-list provider is configured; offer the real inquiry flow instead. */
export function Newsletter() {
  const { dict, dir, href } = useI18n();
  return (
    <div className="mx-auto max-w-xl text-center">
      <h3 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">{dict.footer.ctaTitle}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-100/70">{dict.footer.ctaText}</p>
      <Link href={href("/inquiry")} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-date-950">
        {dict.common.contactTeam}<ArrowRight size={15} className={dir === "rtl" ? "rotate-180" : undefined} />
      </Link>
    </div>
  );
}

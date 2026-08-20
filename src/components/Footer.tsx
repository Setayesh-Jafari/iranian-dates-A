"use client";

import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CATEGORY_SLUGS } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { t } from "@/i18n";
import { SITE, whatsappLink } from "@/lib/site";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-cream-100/70 transition-colors hover:text-cream-50"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { dict, href, locale } = useI18n();
  const year =
    locale === "fa"
      ? new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())
      : String(new Date().getFullYear());

  return (
    <footer className="bg-date-950 text-cream-50">
      {/* CTA banner → inquiry system */}
      <div className="border-b border-cream-50/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              {dict.footer.ctaTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-100/70">
              {dict.footer.ctaBody}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={href("/inquiry")}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                {dict.common.submitInquiry}
              </Link>
              <a
                href={whatsappLink(dict.footer.ctaTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-6 py-3 text-sm font-semibold text-cream-100/80 transition-colors hover:border-cream-50/50 hover:text-cream-50"
              >
                <MessageCircle size={16} /> {dict.common.whatsappShort}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-100/60">
              {dict.footer.about}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream-100/70">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                <span>
                  {dict.contact.address}
                  <span className="block text-cream-100/45">
                    {dict.contact.city}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} dir="ltr">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500" />
                <a href={`mailto:${SITE.email}`} dir="ltr">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <LocaleSwitcher tone="light" className="mt-6 w-fit" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol
              title={dict.footer.products}
              links={CATEGORY_SLUGS.map((slug) => ({
                label: dict.categories[slug].label,
                href: href(`/products?category=${slug}`),
              }))}
            />
            <FooterCol
              title={dict.footer.company}
              links={[
                { label: dict.footer.links.story, href: href("/#story") },
                {
                  label: dict.footer.links.certifications,
                  href: href("/certifications"),
                },
                { label: dict.footer.links.blog, href: href("/blog") },
                { label: dict.footer.links.quote, href: href("/inquiry") },
                { label: dict.footer.links.contact, href: href("/inquiry") },
              ]}
            />
            <FooterCol
              title={dict.footer.exportInfo}
              links={[
                {
                  label: dict.footer.links.shipping,
                  href: href("/certifications"),
                },
                {
                  label: dict.footer.links.quality,
                  href: href("/certifications"),
                },
                { label: dict.footer.links.payment, href: href("/inquiry") },
                {
                  label: dict.footer.links.faq,
                  href: href("/blog/importing-iranian-dates-documents-and-cold-chain"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream-100/45 sm:flex-row sm:px-6 lg:px-8">
          <p>{t(dict.footer.rights, { year })}</p>
          <p className="flex items-center gap-1.5">
            {dict.footer.grownIn} <span className="text-gold-500">✦</span>{" "}
            {dict.footer.exportedWorldwide}
          </p>
        </div>
      </div>
    </footer>
  );
}

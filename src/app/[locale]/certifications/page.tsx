import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck,
  FlaskConical,
  Globe,
  Leaf,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { formatNumber, getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";
import { whatsappLink } from "@/lib/site";

const CERT_ICONS = [FlaskConical, Leaf, Globe, ShieldCheck, FileCheck, Thermometer];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.certifications.title,
    description: dict.meta.certifications.description,
    alternates: {
      canonical: localePath(locale, "/certifications"),
      languages: { fa: "/fa/certifications", en: "/en/certifications" },
    },
  };
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <div>
      {/* Hero */}
      <section className="bg-date-950 text-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                {dict.certifications.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {dict.certifications.titleA}{" "}
                <span className="italic text-gold-300">
                  {dict.certifications.titleB}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/70 sm:text-lg">
                {dict.certifications.intro}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certifications grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={dict.certifications.listEyebrow}
            title={dict.certifications.listTitle}
            description={dict.certifications.listBody}
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.certifications.items.map((cert, i) => {
            const Icon = CERT_ICONS[i] ?? BadgeCheck;
            return (
              <Reveal key={cert.name} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100">
                    <Icon size={22} className="text-gold-700" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-date-900">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gold-600">
                    {cert.issuer}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-date-600">
                    {cert.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cert.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-date-500">
                        <BadgeCheck size={14} className="mt-0.5 shrink-0 text-gold-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Quality process */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={dict.certifications.processEyebrow}
              title={dict.certifications.processTitle}
              description={dict.certifications.processBody}
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.certifications.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="rounded-3xl bg-white p-7">
                  <span className="font-display text-3xl font-semibold text-gold-200">
                    {formatNumber(i + 1, locale).padStart(2, locale === "fa" ? "۰" : "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-date-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-date-600">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA → inquiry system */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-date-900 to-date-950 p-8 text-center sm:p-16">
            <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              {dict.certifications.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-cream-100/70">
              {dict.certifications.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={localePath(locale, "/inquiry")}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                {dict.certifications.ctaButton}{" "}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
              <a
                href={whatsappLink(dict.certifications.ctaButton)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                {dict.common.whatsapp}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getDictionary } from "@/i18n";
import {
  DEFAULT_LOCALE,
  dir as dirOf,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";

// NOTE (content policy): The items below describe documents that are commonly
// REQUIRED FOR or ARRANGED ON APPLICABLE agricultural export shipments from
// Iran. They are intentionally phrased so they do NOT assert that the company
// currently holds any certification. Company-held certificates and test
// results are pending business verification and must be confirmed before
// being presented as facts.

/** Icons follow the dictionary order (Health, Phyto, Origin, Fumigation, …). */
const CERT_ICONS = [
  FlaskConical,
  Leaf,
  Globe,
  ShieldCheck,
  FileCheck,
  Thermometer,
];

function resolveLocale(raw: string): Locale | null {
  return isLocale(raw) ? raw : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw) ?? DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.certificationsTitle,
    description: dict.meta.certificationsDescription,
  };
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  if (!locale) notFound();

  const dict = getDictionary(locale);
  const rtl = dirOf(locale) === "rtl";
  const flip = rtl ? "rotate-180" : undefined;

  const CERTIFICATIONS = dict.certifications.items.map((cert, i) => ({
    ...cert,
    icon: CERT_ICONS[i] ?? BadgeCheck,
  }));

  const QUALITY_STEPS = dict.certifications.steps.map((step, i) => ({
    ...step,
    step: String(i + 1).padStart(2, "0"),
  }));

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
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {dict.certifications.titleA}{" "}
                <span className="italic text-gold-300">
                  {dict.certifications.titleB}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/70 sm:text-lg">
                {dict.certifications.text}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-50 px-5 py-4 text-sm text-date-700">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-700" />
            <p>{dict.certifications.disclaimer}</p>
          </div>
        </Reveal>
      </section>

      {/* Certifications grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={dict.certifications.gridEyebrow}
            title={dict.certifications.gridTitle}
            description={dict.certifications.gridText}
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100">
                  <cert.icon size={22} className="text-gold-700" />
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
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-date-500"
                    >
                      <BadgeCheck
                        size={14}
                        className="mt-0.5 shrink-0 text-gold-500"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quality process */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={dict.certifications.processEyebrow}
              title={dict.certifications.processTitle}
              description={dict.certifications.processText}
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITY_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06}>
                <div className="rounded-3xl bg-white p-7">
                  <span className="font-display text-3xl font-semibold text-gold-200">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-date-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-date-600">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-date-900 to-date-950 p-8 text-center sm:p-16">
            <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              {dict.certifications.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-cream-100/70">
              {dict.certifications.ctaText}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={localePath(locale, "/inquiry")}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                {dict.certifications.ctaPrimary}
                <ArrowRight size={16} className={flip} />
              </Link>
              <Link
                href={localePath(locale, "/products")}
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                {dict.certifications.ctaSecondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

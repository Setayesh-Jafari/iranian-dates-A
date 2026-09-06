import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  Globe,
  Leaf,
  Send,
  Truck,
} from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AddToInquiryButton } from "@/components/AddToCartButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES } from "@/lib/types";
import { getDictionary, categoryLabel, categoryShort } from "@/i18n";
import {
  dir as dirOf,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";

export const dynamic = "force-dynamic";

// NOTE (content policy): imagery below is licensed stock photography used as a
// placeholder. It is NOT verified company/product photography and must not be
// presented as such until the business provides its own images.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200&h=900`;

function resolveLocale(raw: string): Locale | null {
  return isLocale(raw) ? raw : null;
}

export default async function HomePage({
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
  const gradientX = rtl ? "bg-gradient-to-l" : "bg-gradient-to-r";

  const MARQUEE = dict.home.marquee;

  const COLLECTIONS = [
    { slug: "premium", image: px(15913423) },
    { slug: "gifts", image: px(6200512) },
    { slug: "wholesale", image: px(17302469) },
    { slug: "products", image: px(11771949) },
    { slug: "soft", image: px(11679690) },
    { slug: "dry", image: px(15707374) },
  ];

  const HOW_IT_WORKS = dict.home.howSteps.map((step, i) => ({
    ...step,
    icon: [ClipboardList, FileText, Send][i] ?? ClipboardList,
  }));

  const ON_REQUEST_CHIPS = [
    {
      icon: Boxes,
      value: dict.common.onRequest,
      label: dict.home.chipOriginGrading,
    },
    {
      icon: FlaskConical,
      value: dict.common.onRequest,
      label: dict.home.chipSpecifications,
    },
    {
      icon: Truck,
      value: dict.common.perOrder,
      label: dict.home.chipShipping,
    },
    {
      icon: Globe,
      value: String(CATEGORIES.length),
      label: dict.home.chipCollections,
    },
  ];

  const [featured, flagship] = await Promise.all([
    getProducts({ sort: "featured", limit: 8 }),
    getProductBySlug("mazafati-kimia-dates"),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative -mt-16 min-h-[92vh] w-full overflow-hidden bg-date-950 lg:-mt-[76px]">
        <Image
          src={px(15913423)}
          alt={dict.home.heroAlt}
          fill
          priority
          className="object-cover"
        />
        <div
          className={`absolute inset-0 ${gradientX} from-date-950/95 via-date-950/70 to-date-950/25`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-date-950/80 via-transparent to-date-950/40" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
              <Leaf size={13} /> {dict.home.heroBadge}
            </p>

            <h1
              className="animate-fade-up mt-6 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-tight text-cream-50 text-balance sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              {dict.home.heroTitleA}{" "}
              <span className="italic text-gold-300">
                {dict.home.heroTitleB}
              </span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-cream-100/80 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              {dict.home.heroText}
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={localePath(locale, "/inquiry")}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                {dict.home.heroCtaPrimary}
                <ArrowRight size={16} className={flip} />
              </Link>
              <Link
                href={localePath(locale, "/products?q=Mazafati")}
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                {dict.home.heroCtaSecondary}
              </Link>
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-cream-100/75"
              style={{ animationDelay: "320ms" }}
            >
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-gold-400" />{" "}
                {dict.home.heroPoint1}
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-gold-400" />{" "}
                {dict.home.heroPoint2}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-date-900/10 bg-cream-100 py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pe-10">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-date-600"
              >
                {item} <span className="text-gold-500">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={dict.home.collectionsEyebrow}
              title={dict.home.collectionsTitle}
              description={dict.home.collectionsText}
            />
            <Link
              href={localePath(locale, "/products")}
              className="hidden items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600 sm:inline-flex"
            >
              {dict.common.viewAll}
              <ArrowRight size={16} className={flip} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c, i) => {
            const label = categoryLabel(dict, c.slug);
            return (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link
                  href={localePath(locale, `/products?category=${c.slug}`)}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-date-900"
                >
                  <Image
                    src={c.image}
                    alt={label}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-date-950/85 via-date-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                      {categoryShort(dict, c.slug)}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold text-cream-50">
                        {label}
                      </h3>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-50/10 text-cream-50 backdrop-blur transition-all duration-300 group-hover:bg-gold-500 group-hover:text-date-950">
                        <ArrowRight size={16} className={flip} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FLAGSHIP */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] bg-gradient-to-br from-date-900 to-date-950 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-square">
              <Image
                src={px(15913411)}
                alt={dict.home.flagshipAlt}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute start-5 top-5 rounded-full bg-gold-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-date-950 shadow-lg">
                {dict.home.signature}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                {dict.home.flagshipEyebrow}
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl">
                {dict.home.flagshipTitle}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-100/70">
                {dict.home.flagshipText}
              </p>

              {flagship && (
                <>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {flagship.highlights.slice(0, 4).map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-cream-100/80"
                      >
                        <BadgeCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-gold-400"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <AddToInquiryButton
                      product={flagship}
                      className="bg-gold-500 text-date-950 hover:bg-gold-400"
                    />
                    <Link
                      href={localePath(locale, `/products/${flagship.slug}`)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
                    >
                      {dict.home.fullDetails}
                      <ArrowRight size={16} className={flip} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={dict.home.featuredEyebrow}
              title={dict.home.featuredTitle}
              description={dict.home.featuredText}
            />
            <Link
              href={localePath(locale, "/products")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600"
            >
              {dict.common.browseAllProducts}
              <ArrowRight size={16} className={flip} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY / SOURCING */}
      <section id="story" className="bg-date-950 text-cream-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={px(20106286)}
                alt={dict.home.storyAlt}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <SectionHeading
                tone="light"
                eyebrow={dict.home.storyEyebrow}
                title={dict.home.storyTitle}
                description={dict.home.storyText}
              />

              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {ON_REQUEST_CHIPS.map((s) => (
                  <div key={s.label}>
                    <s.icon size={20} className="text-gold-400" />
                    <p className="mt-3 font-display text-2xl font-semibold text-cream-50">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-cream-100/60">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={localePath(locale, "/inquiry")}
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-6 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/10"
              >
                {dict.common.contactTeam}
                <ArrowRight size={16} className={flip} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={dict.home.howEyebrow}
            title={dict.home.howTitle}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-100">
                  <t.icon size={20} className="text-gold-700" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-date-900">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-date-600">
                  {t.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

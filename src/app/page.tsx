import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  FlaskConical,
  Globe,
  Leaf,
  Snowflake,
  Star,
  Truck,
} from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AddToInquiryButton } from "@/components/AddToCartButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Rating } from "@/components/Rating";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Single-origin",
  "Cold-chain shipped",
  "Lab-tested",
  "FOB Bandar Abbas",
  "Bulk & wholesale",
  "Direct from the grove",
  "6 premium varieties",
  "Export certified",
];

const COLLECTIONS = [
  { slug: "premium", image: "/images/mazafati.jpg", note: "Mazafati, Piarom & medjool-style" },
  { slug: "gifts", image: "/images/gift-box.jpg", note: "Curated boxes & stuffed dates" },
  { slug: "wholesale", image: "/images/mazafati.jpg", note: "Bulk cartons for importers" },
  { slug: "products", image: "/images/mazafati.jpg", note: "Syrup, paste, sugar & more" },
  { slug: "soft", image: "/images/mazafati.jpg", note: "Kabkab, Rabbi & moist picks" },
  { slug: "dry", image: "/images/mazafati.jpg", note: "Zahedi, Sayer & more" },
];

const TESTIMONIALS = [
  {
    quote:
      "The Kimia-grade Mazafati is the best I've sourced in fifteen years of trading. Cold chain was flawless and my retail customers keep asking for more.",
    name: "Rohit Malhotra",
    role: "Owner, Saffron & Co. · Mumbai",
  },
  {
    quote:
      "We supply five-star kitchens across Delhi. The Piarom and stuffed dates arrive pristine every single time. Mr.Mazafati runs a serious operation.",
    name: "Aman Gupta",
    role: "Head of Procurement, The Grove Collective · Delhi",
  },
  {
    quote:
      "The importers' sampler saved me from a costly container decision. Honest grading, transparent pricing and a credit against our first wholesale order.",
    name: "Kunal Bajaj",
    role: "Founder, Nourish Foods · Lucknow",
  },
];

export default async function HomePage() {
  const [featured, flagship] = await Promise.all([
    getProducts({ sort: "featured", limit: 8 }),
    getProductBySlug("mazafati-kimia-dates"),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative -mt-16 min-h-[92vh] w-full overflow-hidden bg-date-950 lg:-mt-[76px]">
        <Image
          src="/images/hero.jpg"
          alt="Premium Iranian Mazafati dates in a ceramic bowl"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-date-950/95 via-date-950/70 to-date-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-date-950/80 via-transparent to-date-950/40" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
              <Leaf size={13} /> B2B Wholesale · Direct Export · Est. 2009
            </p>

            <h1
              className="animate-fade-up mt-6 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-tight text-cream-50 text-balance sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Iranian dates,{" "}
              <span className="italic text-gold-300">exported direct.</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-cream-100/80 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              From the sun-soaked groves of Bam and Hormozgan — we grade,
              cold-chain and export premium Iranian dates worldwide. Bulk
              supply for importers, wholesalers and distributors.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                Request a quote <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                Browse catalog
              </Link>
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-cream-100/75"
              style={{ animationDelay: "320ms" }}
            >
              <span className="flex items-center gap-2">
                <Rating value={4.9} size={15} /> 4.9 rating
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-gold-400" /> 300+ trade partners
              </span>
              <span className="flex items-center gap-2">
                <Snowflake size={16} className="text-gold-400" /> Cold-chain shipped
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-date-900/10 bg-cream-100 py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
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
              eyebrow="The Collections"
              title="Curated for every market"
              description="Six collections, one uncompromising standard — from flagship Mazafati to bulk cartons for the trade."
            />
            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600 sm:inline-flex"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c, i) => {
            const cat = CATEGORIES.find((x) => x.slug === c.slug);
            return (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-date-900"
                >
                  <Image
                    src={c.image}
                    alt={cat?.label ?? c.slug}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-date-950/85 via-date-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                      {c.note}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold text-cream-50">
                        {cat?.label ?? c.slug}
                      </h3>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-50/10 text-cream-50 backdrop-blur transition-all duration-300 group-hover:bg-gold-500 group-hover:text-date-950">
                        <ArrowRight size={16} />
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
                src="/images/mazafati.jpg"
                alt="Signature Mazafati Kimia dates"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute left-5 top-5 rounded-full bg-gold-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-date-950 shadow-lg">
                Signature
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                The Flagship
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl">
                Mazafati, at its absolute peak.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-100/70">
                Hand-harvested in the palm gardens of Bam and graded to the
                exacting Kimia (AAA) standard, our signature date is soft,
                syrup-rich and melts into caramel. Available in bulk cartons
                for wholesale and export.
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
                      href={`/products/${flagship.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
                    >
                      Full details <ArrowRight size={16} />
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
              eyebrow="Export range"
              title="Our product catalog"
              description="Premium varieties trusted by importers across India, the Gulf and beyond."
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600"
            >
              Browse all products <ArrowRight size={16} />
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
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src="/images/story.jpg"
                  alt="Iranian date palm grove at golden hour"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-gold-500/20 bg-date-900/90 px-6 py-5 shadow-2xl backdrop-blur sm:block">
                <p className="font-display text-3xl font-semibold text-gold-300">
                  16+
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cream-100/60">
                  years exporting
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <SectionHeading
                tone="light"
                eyebrow="From the grove"
                title="A family of growers, a promise of quality"
                description="Mr.Mazafati began with a single farm in Bam and a simple belief: international importers deserve dates that arrive exactly as they left the palm. Today we work with a network of grower families across Kerman, Hormozgan and Bushehr — every carton graded, lab-tested and cold-chained for export."
              />

              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { icon: Boxes, value: "40,000+", label: "kg exported yearly" },
                  { icon: Star, value: "4.9", label: "average rating" },
                  { icon: Truck, value: "300+", label: "trade partners" },
                  { icon: Globe, value: "6", label: "signature varieties" },
                ].map((s) => (
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
                href="/inquiry"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-6 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/10"
              >
                Become a trade partner <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Trusted by the trade"
            title="What importers are saying"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="fill-current"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-date-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-date-900/10 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-100 font-display text-base font-semibold text-date-800">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-date-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-date-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

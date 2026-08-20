import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  FileCheck,
  Globe,
  Leaf,
  Snowflake,
  Sprout,
  Star,
  Truck,
} from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AddToInquiryButton } from "@/components/AddToInquiryButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Rating } from "@/components/Rating";
import { CATEGORY_SLUGS } from "@/lib/types";
import { getDictionary } from "@/i18n";
import { localizeProduct, localizeProducts } from "@/i18n/products";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";
import { getSortedPosts } from "@/content/blog";

export const dynamic = "force-dynamic";

const COLLECTION_IMAGES: Record<string, string> = {
  premium: "/images/mazafati.jpg",
  gifts: "/images/gift-box.jpg",
  wholesale: "/images/mazafati.jpg",
  products: "/images/mazafati.jpg",
  soft: "/images/mazafati.jpg",
  dry: "/images/mazafati.jpg",
};

const VALUE_ICONS = [Sprout, Snowflake, BadgeCheck, FileCheck];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const href = (path: string) => localePath(locale, path);

  const [featuredRaw, flagshipRaw] = await Promise.all([
    getProducts({ sort: "featured", limit: 8 }),
    getProductBySlug("mazafati-kimia-dates"),
  ]);

  const featured = localizeProducts(featuredRaw, locale);
  const flagship = flagshipRaw ? localizeProduct(flagshipRaw, locale) : null;
  const posts = getSortedPosts().slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative -mt-16 min-h-[92vh] w-full overflow-hidden bg-date-950 lg:-mt-[76px]">
        <Image
          src="/images/hero.jpg"
          alt={dict.home.heroImageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-date-950/95 via-date-950/70 to-date-950/25 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-date-950/80 via-transparent to-date-950/40" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
              <Leaf size={13} /> {dict.home.heroBadge}
            </p>

            <h1
              className="animate-fade-up mt-6 text-balance font-display text-[2.7rem] font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              {dict.home.heroTitleA}{" "}
              <span className="italic text-gold-300">{dict.home.heroTitleB}</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-cream-100/80 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              {dict.home.heroBody}
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={href("/inquiry")}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                {dict.common.requestQuote}{" "}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
              <Link
                href={href("/products")}
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                {dict.common.browseCatalog}
              </Link>
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-cream-100/75"
              style={{ animationDelay: "320ms" }}
            >
              <span className="flex items-center gap-2">
                <Rating value={4.9} size={15} /> {dict.home.heroRating}
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-gold-400" />{" "}
                {dict.home.heroPartners}
              </span>
              <span className="flex items-center gap-2">
                <Snowflake size={16} className="text-gold-400" />{" "}
                {dict.home.heroColdChain}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-date-900/10 bg-cream-100 py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pe-10">
            {[...dict.home.marquee, ...dict.home.marquee].map((item, i) => (
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
              description={dict.home.collectionsBody}
            />
            <Link
              href={href("/products")}
              className="hidden items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600 sm:inline-flex"
            >
              {dict.common.viewAll}{" "}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_SLUGS.map((slug, i) => (
            <Reveal key={slug} delay={i * 0.05}>
              <Link
                href={href(`/products?category=${slug}`)}
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-date-900"
              >
                <Image
                  src={COLLECTION_IMAGES[slug]}
                  alt={dict.categories[slug].label}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-date-950/85 via-date-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-xl font-semibold text-cream-50">
                    {dict.categories[slug].label}
                  </h3>
                  <p className="mt-1 text-sm text-cream-100/70">
                    {dict.collectionNotes[slug]}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY BUYERS CHOOSE US */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={dict.home.valueEyebrow}
              title={dict.home.valueTitle}
              description={dict.home.valueBody}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.values.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? BadgeCheck;
              return (
                <Reveal key={value.title} delay={i * 0.06}>
                  <div className="h-full rounded-3xl bg-white p-7">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100">
                      <Icon size={22} className="text-gold-700" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-date-900">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-date-600">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLAGSHIP */}
      {flagship && (
        <section className="bg-date-950 text-cream-50">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Image
                  src={flagship.images[0] ?? "/images/mazafati.jpg"}
                  alt={flagship.name}
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
                  eyebrow={dict.home.flagshipEyebrow}
                  title={flagship.name}
                  description={flagship.description}
                />
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
                    href={href(`/products/${flagship.slug}`)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
                  >
                    {dict.common.fullDetails}{" "}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={dict.home.catalogEyebrow}
              title={dict.home.catalogTitle}
              description={dict.home.catalogBody}
            />
            <Link
              href={href("/products")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600"
            >
              {dict.home.catalogCta}{" "}
              <ArrowRight size={16} className="rtl:rotate-180" />
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
                  alt={dict.home.storyImageAlt}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -end-4 hidden rounded-2xl border border-gold-500/20 bg-date-900/90 px-6 py-5 shadow-2xl backdrop-blur sm:block">
                <p className="font-display text-3xl font-semibold text-gold-300">
                  {dict.home.storyBadgeValue}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cream-100/60">
                  {dict.home.storyBadgeLabel}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <SectionHeading
                tone="light"
                eyebrow={dict.home.storyEyebrow}
                title={dict.home.storyTitle}
                description={dict.home.storyBody}
              />

              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {dict.home.stats.map((stat, i) => {
                  const Icon = [Boxes, Star, Truck, Globe][i] ?? Boxes;
                  return (
                    <div key={stat.label}>
                      <Icon size={20} className="text-gold-400" />
                      <p className="mt-3 font-display text-2xl font-semibold text-cream-50">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-cream-100/60">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link
                href={href("/inquiry")}
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-6 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/10"
              >
                {dict.home.storyCta}{" "}
                <ArrowRight size={16} className="rtl:rotate-180" />
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
            eyebrow={dict.home.testimonialsEyebrow}
            title={dict.home.testimonialsTitle}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.home.testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} className="fill-current" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-date-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-date-900/10 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-100 font-display text-base font-semibold text-date-800">
                    {testimonial.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-date-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-date-500">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* JOURNAL TEASER */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={dict.home.blogEyebrow}
                title={dict.home.blogTitle}
                description={dict.home.blogBody}
              />
              <Link
                href={href("/blog")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600"
              >
                {dict.home.blogCta}{" "}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <Link
                  href={href(`/blog/${post.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt[locale]}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                      {post.tag[locale]}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700">
                      {post.content[locale].title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-date-600">
                      {post.content[locale].excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                      {dict.common.readMore}{" "}
                      <ArrowRight size={14} className="rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

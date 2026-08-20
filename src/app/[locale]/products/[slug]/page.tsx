import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Leaf,
  Snowflake,
  Truck,
} from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/queries";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/Rating";
import { SectionHeading } from "@/components/SectionHeading";
import { formatNumber, getDictionary, t } from "@/i18n";
import { localizeProduct, localizeProducts } from "@/i18n/products";
import {
  DEFAULT_LOCALE,
  dir,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const row = await getProductBySlug(slug);
  if (!row) return { title: dict.meta.productNotFound };

  const product = localizeProduct(row, locale);
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: localePath(locale, `/products/${slug}`),
      languages: {
        fa: `/fa/products/${slug}`,
        en: `/en/products/${slug}`,
      },
    },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images.slice(0, 1),
      type: "article",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const href = (path: string) => localePath(locale, path);
  const Chevron = dir(locale) === "rtl" ? ChevronLeft : ChevronRight;

  const row = await getProductBySlug(slug);
  if (!row) notFound();

  const product = localizeProduct(row, locale);

  const [reviews, relatedRows] = await Promise.all([
    getReviewsForProduct(row.id),
    getRelatedProducts(row, 4),
  ]);
  const related = localizeProducts(relatedRows, locale);

  const categoryLabel =
    dict.categories[product.category as keyof typeof dict.categories]?.label ??
    product.category;

  /** Product schema without price: B2B quotes only. */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: categoryLabel,
    brand: { "@type": "Brand", name: SITE.brand },
    countryOfOrigin: "IR",
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        // Wholesale pricing is quoted per inquiry and never published.
        valueAddedTaxIncluded: false,
      },
      url: `${SITE.url}${href(`/products/${product.slug}`)}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-date-500">
          <Link href={href("/")} className="transition-colors hover:text-date-900">
            {dict.common.home}
          </Link>
          <Chevron size={14} />
          <Link
            href={href("/products")}
            className="transition-colors hover:text-date-900"
          >
            {dict.nav.products}
          </Link>
          <Chevron size={14} />
          <Link
            href={href(`/products?category=${product.category}`)}
            className="transition-colors hover:text-date-900"
          >
            {categoryLabel}
          </Link>
          <Chevron size={14} />
          <span className="truncate text-date-900">{product.name}</span>
        </nav>

        {/* Main */}
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                {categoryLabel}
              </p>
              {product.badge && (
                <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-date-950">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-date-900 sm:text-4xl lg:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-date-600">{product.tagline}</p>

            <a href="#reviews" className="mt-4 inline-flex items-center gap-2">
              <Rating value={product.rating} size={17} />
              <span className="text-sm text-date-600">
                {formatNumber(Number(product.rating.toFixed(1)), locale)} ·{" "}
                {t(dict.product.reviews, {
                  n: formatNumber(product.reviewCount, locale),
                })}
              </span>
            </a>

            {/* Origin & pack info replace any public pricing */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-date-900/10 bg-cream-100 px-4 py-2 text-sm font-medium text-date-700">
                {dict.common.origin}: {product.origin}
              </span>
              <span className="rounded-full border border-date-900/10 bg-cream-100 px-4 py-2 text-sm font-medium text-date-700">
                {dict.common.pack}: {product.weight} · {product.unit}
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-date-700">
              {product.description}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-date-700">
                  <BadgeCheck size={16} className="mt-0.5 shrink-0 text-gold-600" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <ProductPurchase product={product} />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-date-900/10 bg-white p-4">
              {[
                { icon: Truck, label: dict.product.trust.shipping },
                { icon: Snowflake, label: dict.product.trust.coldChain },
                { icon: FlaskConical, label: dict.product.trust.labTested },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <item.icon size={18} className="text-gold-600" />
                  <span className="text-xs font-medium text-date-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Origin & grading */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-date-900/10 bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-date-900">
              {dict.product.originGrading}
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-date-400">
                  {dict.product.region}
                </dt>
                <dd className="mt-1 font-medium text-date-900">{product.origin}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-date-400">
                  {dict.product.packSize}
                </dt>
                <dd className="mt-1 font-medium text-date-900">{product.weight}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wider text-date-400">
                  {dict.product.specifications}
                </dt>
                <dd className="mt-1 leading-relaxed text-date-700">
                  {product.details ?? dict.product.detailsOnRequest}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-date-900 to-date-950 p-8 text-cream-50">
            <h2 className="font-display text-xl font-semibold">
              {dict.product.promiseTitle}
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-cream-100/80">
              {dict.product.promise.map((line, i) => {
                const Icon = [Leaf, FlaskConical, Truck][i] ?? Leaf;
                return (
                  <li key={line} className="flex gap-3">
                    <Icon className="mt-0.5 shrink-0 text-gold-400" size={16} />
                    {line}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mt-16 scroll-mt-24">
          <ReviewsSection
            productId={product.id}
            initialReviews={reviews}
            initialRating={product.rating}
            initialCount={product.reviewCount}
          />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <SectionHeading
              eyebrow={dict.product.relatedEyebrow}
              title={dict.product.related}
              description={dict.product.relatedBody}
            />
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

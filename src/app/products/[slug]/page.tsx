import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, FlaskConical, Leaf, Snowflake, Truck } from "lucide-react";
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
import { formatINR, discountPercent } from "@/lib/format";
import { categoryLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product, 4),
  ]);

  const pct = discountPercent(product.price, product.compareAtPrice);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-date-500">
          <Link href="/" className="transition-colors hover:text-date-900">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/products" className="transition-colors hover:text-date-900">
            Shop
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/products?category=${product.category}`}
            className="transition-colors hover:text-date-900"
          >
            {categoryLabel(product.category)}
          </Link>
          <ChevronRight size={14} />
          <span className="truncate text-date-900">{product.name}</span>
        </nav>

        {/* Main */}
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                {categoryLabel(product.category)}
              </p>
              {product.badge && (
                <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-date-950">
                  {product.badge}
                </span>
              )}
              {pct && (
                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Save {pct}%
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
                {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </span>
            </a>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-date-900">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-date-400 line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
              <span className="text-sm text-date-500">
                {product.unit} · {product.weight}
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-date-700">{product.description}</p>

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
                { icon: Truck, label: "Ships in 24h" },
                { icon: Snowflake, label: "Cold-chained" },
                { icon: FlaskConical, label: "Lab-tested" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                  <t.icon size={18} className="text-gold-600" />
                  <span className="text-xs font-medium text-date-700">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Origin & grading */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-date-900/10 bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-date-900">Origin & grading</h2>
            <dl className="mt-5 grid grid-cols-2 gap-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-date-400">Region</dt>
                <dd className="mt-1 font-medium text-date-900">{product.origin}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-date-400">Pack size</dt>
                <dd className="mt-1 font-medium text-date-900">{product.weight}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wider text-date-400">Specifications</dt>
                <dd className="mt-1 leading-relaxed text-date-700">
                  {product.details ?? "Details available on request."}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-date-900 to-date-950 p-8 text-cream-50">
            <h2 className="font-display text-xl font-semibold">Our promise</h2>
            <ul className="mt-5 space-y-4 text-sm text-cream-100/80">
              <li className="flex gap-3">
                <Leaf className="mt-0.5 shrink-0 text-gold-400" size={16} />
                Harvested by grower families we&apos;ve worked with for over a decade.
              </li>
              <li className="flex gap-3">
                <FlaskConical className="mt-0.5 shrink-0 text-gold-400" size={16} />
                Every batch graded and lab-tested before it reaches Kolkata.
              </li>
              <li className="flex gap-3">
                <Truck className="mt-0.5 shrink-0 text-gold-400" size={16} />
                Cold-chained door to door — or full credit, no questions asked.
              </li>
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
              eyebrow="Keep exploring"
              title="You may also love"
              description="Hand-picked from the same groves."
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

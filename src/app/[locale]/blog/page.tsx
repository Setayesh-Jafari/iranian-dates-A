import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { getSortedPosts } from "@/content/blog";
import { Reveal } from "@/components/Reveal";
import { formatDate, formatNumber, getDictionary, t } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.blog.title,
    description: dict.meta.blog.description,
    alternates: {
      canonical: localePath(locale, "/blog"),
      languages: { fa: "/fa/blog", en: "/en/blog" },
    },
    openGraph: {
      title: dict.meta.blog.title,
      description: dict.meta.blog.description,
      type: "website",
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const posts = getSortedPosts();

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: dict.meta.blog.title,
    description: dict.meta.blog.description,
    url: `${SITE.url}${localePath(locale, "/blog")}`,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: SITE.brand },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.content[locale].title,
      description: post.content[locale].description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      url: `${SITE.url}${localePath(locale, `/blog/${post.slug}`)}`,
    })),
  };

  const [lead, ...rest] = posts;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <section className="border-b border-date-900/10 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            {dict.blog.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-date-900 sm:text-5xl">
            {dict.blog.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-date-600">
            {dict.blog.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {posts.length === 0 && (
          <p className="text-center text-date-500">{dict.blog.empty}</p>
        )}

        {/* Lead article */}
        {lead && (
          <Reveal>
            <Link
              href={localePath(locale, `/blog/${lead.slug}`)}
              className="group grid gap-8 overflow-hidden rounded-[2rem] border border-date-900/10 bg-white lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
                <Image
                  src={lead.image}
                  alt={lead.imageAlt[locale]}
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:pe-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                  {lead.tag[locale]}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700 sm:text-3xl">
                  {lead.content[locale].title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-date-600">
                  {lead.content[locale].excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-date-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />{" "}
                    {formatDate(lead.publishedAt, locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />{" "}
                    {t(dict.blog.readingTime, {
                      n: formatNumber(lead.readingMinutes, locale),
                    })}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
                  {dict.common.readMore}{" "}
                  <ArrowRight size={15} className="rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={localePath(locale, `/blog/${post.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-date-900/10 bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt[locale]}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                    {post.tag[locale]}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700">
                    {post.content[locale].title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-date-600">
                    {post.content[locale].excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-date-500">
                    <span>{formatDate(post.publishedAt, locale)}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />{" "}
                      {t(dict.blog.readingTime, {
                        n: formatNumber(post.readingMinutes, locale),
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Clock } from "lucide-react";
import { BLOG_POSTS, getPost, getRelatedPosts } from "@/content/blog";
import { formatDate, formatNumber, getDictionary, t } from "@/i18n";
import {
  DEFAULT_LOCALE,
  LOCALES,
  dir,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n/config";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    BLOG_POSTS.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const post = getPost(slug);
  if (!post) return {};

  const content = post.content[locale];
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: localePath(locale, `/blog/${slug}`),
      languages: { fa: `/fa/blog/${slug}`, en: `/en/blog/${slug}` },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const content = post.content[locale];
  const related = getRelatedPosts(slug, 3);
  const BackIcon = dir(locale) === "rtl" ? ArrowRight : ArrowLeft;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: content.title,
    description: content.description,
    image: [post.image],
    inLanguage: locale,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: content.keywords.join(", "),
    author: { "@type": "Organization", name: SITE.brand },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      address: {
        "@type": "PostalAddress",
        addressLocality: locale === "fa" ? SITE.city.fa : SITE.city.en,
        addressCountry: "IR",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}${localePath(locale, `/blog/${slug}`)}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <header className="border-b border-date-900/10 bg-cream-100">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <Link
            href={localePath(locale, "/blog")}
            className="inline-flex items-center gap-2 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
          >
            <BackIcon size={16} /> {dict.blog.backToList}
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
            {post.tag[locale]}
          </p>
          <h1 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-date-900 sm:text-4xl lg:text-[2.75rem]">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-date-600">
            {content.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-date-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} /> {dict.blog.published}:{" "}
              {formatDate(post.publishedAt, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />{" "}
              {t(dict.blog.readingTime, {
                n: formatNumber(post.readingMinutes, locale),
              })}
            </span>
            <span>{dict.blog.author}</span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative -mt-0 aspect-[16/9] overflow-hidden rounded-b-[2rem] sm:rounded-[2rem] sm:mt-10">
          <Image
            src={post.image}
            alt={post.imageAlt[locale]}
            fill
            priority
            sizes="(min-width:1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_280px] lg:items-start lg:px-8">
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-date-700">{content.intro}</p>

          {content.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`} className="mt-10 scroll-mt-28">
              <h2 className="font-display text-2xl font-semibold leading-snug text-date-900">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-4 leading-relaxed text-date-700"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-5 space-y-2.5 rounded-2xl border border-date-900/10 bg-white p-6">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-date-700">
                      <BadgeCheck size={16} className="mt-0.5 shrink-0 text-gold-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* FAQ */}
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-date-900">
              FAQ
            </h2>
            <dl className="mt-5 space-y-4">
              {content.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-date-900/10 bg-white p-6"
                >
                  <dt className="font-display text-base font-semibold text-date-900">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-date-600">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA → inquiry system */}
          <section className="mt-14 rounded-[2rem] bg-gradient-to-br from-date-900 to-date-950 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              {dict.blog.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-cream-100/70">
              {dict.blog.ctaBody}
            </p>
            <Link
              href={localePath(locale, "/inquiry")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
            >
              {dict.blog.ctaButton}{" "}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
          </section>
        </div>

        {/* Sidebar TOC */}
        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-date-900/10 bg-white p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-date-500">
              {dict.blog.tocTitle}
            </h2>
            <ol className="mt-4 space-y-2.5 text-sm">
              {content.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${index + 1}`}
                    className="text-date-600 transition-colors hover:text-gold-700"
                  >
                    {formatNumber(index + 1, locale)}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-date-900/10 bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-date-900">
              {dict.blog.relatedTitle}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={localePath(locale, `/blog/${item.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt[locale]}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-base font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700">
                      {item.content[locale].title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-date-600">
                      {item.content[locale].excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

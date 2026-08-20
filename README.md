# MAZAFATI — Iranian Dates Export (B2B)

Bilingual (فارسی / English) B2B catalog and quotation site for **MAZAFATI**, an
exporter of premium Iranian dates. Head office: **Isfahan, Iran**.

Built with Next.js 16 (App Router), Tailwind CSS v4, Drizzle ORM and PostgreSQL.

---

## Highlights

- **Bilingual with RTL** — every page lives under `/[locale]` (`/fa`, `/en`).
  Persian is the default and renders right-to-left with self-hosted
  Estedad (text) + Gandom (headings); English renders LTR with Inter + Fraunces.
- **B2B pricing model** — no prices anywhere in the public UI or public API.
  Every CTA (product card, product page, header, footer, blog, certifications)
  routes into the inquiry / RFQ system.
- **SEO blog** at `/[locale]/blog` — bilingual long-form articles with
  `BlogPosting` + `FAQPage` JSON-LD, hreflang alternates, sitemap and robots.
- **Certifications page** documenting export documents and the quality process.

## Project structure

```
src/
├─ app/
│  ├─ [locale]/              # all pages (fa | en)
│  │  ├─ page.tsx            # home
│  │  ├─ products/           # catalog + product detail
│  │  ├─ blog/               # journal index + articles
│  │  ├─ certifications/
│  │  ├─ inquiry/            # RFQ form (the only conversion point)
│  │  └─ not-found.tsx
│  ├─ api/                   # products, product, reviews, inquiry, health
│  ├─ global-not-found.tsx
│  ├─ robots.ts / sitemap.ts
│  └─ globals.css            # theme tokens + RTL rules
├─ content/blog.ts           # bilingual article content
├─ lib/images.ts             # photography (same Pexels photos as the original site)
├─ i18n/
│  ├─ config.ts              # locales, dir(), localePath(), negotiation
│  ├─ dictionaries/{en,fa}.ts
│  ├─ products.ts            # Persian copy for the seeded catalog
│  └─ I18nProvider.tsx       # client-side dict/locale context
├─ fonts/                    # self-hosted woff2: Inter, Fraunces, Estedad, Gandom
├─ middleware.ts             # locale detection, redirect, NEXT_LOCALE cookie
└─ db/                       # Drizzle schema + seed
```

### Adding a locale

1. Add the code to `LOCALES` / `LOCALE_TAGS` / `LOCALE_LABELS` in
   `src/i18n/config.ts` (add it to `RTL_LOCALES` if it is right-to-left).
2. Create `src/i18n/dictionaries/<code>.ts` typed as `Dictionary` — TypeScript
   will report every missing key.
3. Register it in `src/i18n/index.ts`.

### Adding a blog article

Append an entry to `BLOG_POSTS` in `src/content/blog.ts` with `en` **and** `fa`
content. Sitemap entries, hreflang links, JSON-LD and static params are derived
automatically.

## Pricing policy (important)

`price` and `compare_at_price` still exist in the `products` table for internal
quoting, but they are **not** serialized (`src/lib/serialize.ts`), not part of
the public `Product` type, and price sorting/filtering has been removed from the
catalog UI and API. Do not re-expose them — quotes are issued per inquiry.

## Local development

```bash
npm install
cp .env.example .env          # DATABASE_URL=postgresql://...
docker compose up -d db       # or any PostgreSQL 16 instance
npx drizzle-kit push          # create tables
npx tsx src/db/seed.ts        # seed catalog + reviews
npm run dev
```

Then open http://localhost:3000 — you are redirected to `/fa` or `/en` based on
your `Accept-Language` header (the choice is stored in the `NEXT_LOCALE` cookie).

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

---

## خلاصهٔ فارسی

سایت دوزبانه (فارسی/انگلیسی) و B2B برند **MAZAFATI** برای صادرات خرمای ایرانی،
با دفتر مرکزی در **اصفهان**.

- همهٔ صفحات زیر مسیر `/[locale]` قرار دارند؛ نسخهٔ فارسی به‌صورت راست‌به‌چپ و با
  فونت استعداد (متن) و گندم (تیترها) نمایش داده می‌شود.
- قیمت‌ها در هیچ بخش عمومی (رابط کاربری و API) نمایش داده نمی‌شوند و همهٔ دکمه‌های
  فراخوان به سیستم استعلام قیمت متصل هستند.
- بلاگ سئو در مسیر `/blog` با مقالات دوزبانه، داده‌های ساختاریافته و نقشهٔ سایت.

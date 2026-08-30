import "dotenv/config";
import { getDb, getPool } from "./index";
import { products, reviews } from "./schema";
import { sql } from "drizzle-orm";

/**
 * SAFETY GATE — do not remove.
 *
 * This script is DESTRUCTIVE: it TRUNCATEs `products`, `reviews` and
 * `inquiries` (RESTART IDENTITY CASCADE) and reseeds development content.
 * It must never run automatically on container startup and must never run
 * against a production database.
 *
 * Intended usage (explicit, manual, development only):
 *   ALLOW_DESTRUCTIVE_SEED=1 npm run db:seed
 */
function assertSeedAllowed(): void {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "Refusing to seed: NODE_ENV=production. " +
        "Seeding truncates all product/review/inquiry data and is for local development only."
    );
    process.exit(1);
  }
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "1") {
    console.error(
      "Refusing to seed: this script TRUNCATEs products, reviews and inquiries.\n" +
        "If you really intend to wipe and reseed a DEVELOPMENT database, run it explicitly:\n" +
        "  ALLOW_DESTRUCTIVE_SEED=1 npm run db:seed"
    );
    process.exit(1);
  }
}

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200&h=900`;

// NOTE (content policy): This seed intentionally contains NO marketing
// claims, NO customer reviews, NO ratings, NO stock counts, NO origin-region
// specifics and NO certification/logistics promises. All product copy is
// neutral until the business verifies the real details. Product images are
// licensed stock placeholders — they are NOT verified product photography.

// author, location, rating, title, comment
type SeedReview = [string, string, number, string, string];

type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  details: string | null;
  price: number;
  compareAtPrice: number | null;
  category: string;
  origin: string;
  weight: string;
  unit: string;
  stock: number;
  featured: boolean;
  isNew: boolean;
  badge: string | null;
  images: string[];
  highlights: string[];
};

const PRODUCTS: SeedProduct[] = [
  {
    slug: "mazafati-kimia-dates",
    name: "Mazafati Dates · Kimia Grade",
    tagline: "A classic soft Iranian date variety",
    description:
      "Mazafati is a well-known soft date variety from Iran. Grade, size, moisture and packing specifications are available upon request.",
    details: null,
    price: 1299,
    compareAtPrice: null,
    category: "premium",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(15913423), px(15913411), px(20106286)],
    highlights: [
      "Soft date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "piarom-dates",
    name: "Piarom Dates · The Chocolate Date",
    tagline: "Semi-dry variety with a firm texture",
    description:
      "Piarom is a semi-dry Iranian date variety, sometimes called the 'chocolate date' for its darker tone and firmer bite. Specifications are available upon request.",
    details: null,
    price: 1899,
    compareAtPrice: null,
    category: "premium",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(31717521), px(17302469), px(20632725), px(15913421)],
    highlights: [
      "Semi-dry date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "medjool-style-dates",
    name: "Medjool-Style Premium Dates",
    tagline: "Large, soft date fruits",
    description:
      "Large, soft date fruits offered as a medjool-style option. Size range and grade specifications are available upon request.",
    details: null,
    price: 1699,
    compareAtPrice: null,
    category: "premium",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(15913421), px(20106286), px(15707374), px(15913411)],
    highlights: [
      "Large-format date fruits",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "kabkab-dates",
    name: "Kabkab Dates · Soft & Syrupy",
    tagline: "A soft, dark everyday variety",
    description:
      "Kabkab is a soft, dark Iranian date variety commonly used in sweets, confectionery and date-syrup production. Specifications are available upon request.",
    details: null,
    price: 549,
    compareAtPrice: null,
    category: "soft",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(11679690), px(35623785), px(17302469), px(15707373)],
    highlights: [
      "Soft date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "rabbi-dates",
    name: "Rabbi Dates · Extra-Long",
    tagline: "An elongated, chewy variety",
    description:
      "Rabbi is a long, reddish-brown date variety with a chewy texture. Size and grade specifications are available upon request.",
    details: null,
    price: 749,
    compareAtPrice: null,
    category: "soft",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(20106286), px(15913423), px(20632754)],
    highlights: [
      "Elongated date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "zahedi-dates",
    name: "Zahedi Dates · Golden Dry",
    tagline: "A firm, golden semi-dry date",
    description:
      "Zahedi is a dry-to-semi-dry golden date variety widely used for snacking, baking and re-packing. Specifications are available upon request.",
    details: null,
    price: 649,
    compareAtPrice: null,
    category: "dry",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(17302469), px(11679690), px(15707374), px(35623785)],
    highlights: [
      "Dry date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "sayer-dates",
    name: "Sayer Dates · Semi-Dry",
    tagline: "A balanced semi-dry date",
    description:
      "Sayer is a semi-dry date variety with mild sweetness, commonly used in baking and everyday snacking. Specifications are available upon request.",
    details: null,
    price: 599,
    compareAtPrice: null,
    category: "dry",
    origin: "Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(15913411), px(15707373), px(20632754)],
    highlights: [
      "Semi-dry date variety",
      "Bulk & wholesale supply",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "date-syrup-silani",
    name: "Date Syrup · Silani",
    tagline: "Date-based liquid sweetener",
    description:
      "Syrup produced from dates, offered for retail and food-service formats. Composition, Brix and packing specifications are available upon request.",
    details: null,
    price: 449,
    compareAtPrice: null,
    category: "products",
    origin: "Iran",
    weight: "500 ml",
    unit: "per bottle",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(11771949), px(8500508), px(8500502), px(4921856)],
    highlights: [
      "Date-based sweetener",
      "Retail & food-service formats",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "date-paste",
    name: "Date Paste · Pitted & Ground",
    tagline: "Date paste for bakery & confectionery",
    description:
      "Ground date paste intended for bakery and confectionery use. Ingredient composition, Brix and packing specifications are available upon request.",
    details: null,
    price: 399,
    compareAtPrice: null,
    category: "products",
    origin: "Iran",
    weight: "1 kg",
    unit: "per pack",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(4921856), px(8500502), px(15913423)],
    highlights: [
      "Bakery & confectionery use",
      "Bulk supply available",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "chopped-dates",
    name: "Chopped Dates",
    tagline: "Bite-size chopped dates",
    description:
      "Chopped date pieces for baking, cereals and mixes. Piece size and packing specifications are available upon request.",
    details: null,
    price: 349,
    compareAtPrice: null,
    category: "products",
    origin: "Iran",
    weight: "500 g",
    unit: "per pack",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(11679690), px(15913411), px(17302469)],
    highlights: [
      "Bite-size format",
      "Baking & mix ready",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "date-sugar",
    name: "Date Sugar",
    tagline: "Date-based granulated sweetener",
    description:
      "Granulated sweetener made from dates. Nutritional profile and packing specifications are available upon request.",
    details: null,
    price: 699,
    compareAtPrice: null,
    category: "products",
    origin: "Iran",
    weight: "500 g",
    unit: "per jar",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(8500508), px(11771949), px(4921856)],
    highlights: [
      "Granulated sweetener",
      "Retail & food-service formats",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "stuffed-dates-walnut",
    name: "Stuffed Dates · Walnut",
    tagline: "Date halves filled with walnut",
    description:
      "Date halves filled with walnut kernels, offered as a delicacy and gifting item. Composition and packing specifications are available upon request.",
    details: null,
    price: 1099,
    compareAtPrice: null,
    category: "gifts",
    origin: "Iran",
    weight: "500 g",
    unit: "per box",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(20632745), px(20632746), px(15707374)],
    highlights: [
      "Dates with walnut filling",
      "Gift & retail formats",
      "Specifications on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "royal-gift-box",
    name: "The Royal Assorted Gift Box",
    tagline: "Assorted gift box",
    description:
      "Assorted dates gift box for corporate and festive gifting. Contents, packing and labelling details are available upon request.",
    details: null,
    price: 2499,
    compareAtPrice: null,
    category: "gifts",
    origin: "Iran",
    weight: "1.6 kg",
    unit: "per box",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(20632754), px(20632746), px(6200512)],
    highlights: [
      "Assorted varieties",
      "Corporate & festive gifting",
      "Contents on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "mazafati-wholesale-10kg",
    name: "Mazafati Wholesale Carton · 10 kg",
    tagline: "Bulk carton for wholesale inquiries",
    description:
      "Bulk carton format of Mazafati dates for wholesale and import inquiries. Packing format, minimum order quantity and Incoterms are confirmed per order.",
    details: null,
    price: 10990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Iran",
    weight: "10 kg",
    unit: "per carton",
    stock: 0,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(15913423), px(20106286), px(15913411)],
    highlights: [
      "Bulk carton format",
      "MOQ confirmed per order",
      "Packing details on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "zahedi-export-25kg",
    name: "Zahedi Export Carton · 25 kg",
    tagline: "Bulk dry dates for trade & re-packers",
    description:
      "Bulk export carton of dry Zahedi dates for trade and re-packing inquiries. Packing format, minimum order quantity and Incoterms are confirmed per order.",
    details: null,
    price: 11990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Iran",
    weight: "25 kg",
    unit: "per carton",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(17302469), px(11679690), px(35623785)],
    highlights: [
      "Bulk export carton",
      "MOQ confirmed per order",
      "Packing details on request",
      "Pricing on inquiry",
    ],
  },
  {
    slug: "importers-sampler-5kg",
    name: "Importers' Sampler · 5 kg Assorted",
    tagline: "Assorted sampler for buyers",
    description:
      "Assorted sample box covering multiple varieties, for buyers evaluating options before a bulk order. Contents and sampling terms are confirmed with our team.",
    details: null,
    price: 5990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Iran",
    weight: "5 kg",
    unit: "per box",
    stock: 0,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(6200512), px(15707374), px(20632754)],
    highlights: [
      "Multiple varieties",
      "Evaluate before bulk orders",
      "Terms confirmed with our team",
      "Pricing on inquiry",
    ],
  },
];

// NOTE: Fake demo reviews have been removed. Real customer reviews can only
// be added through the public review form (/api/reviews) once the site is
// live; none are seeded.
const REVIEWS: Record<string, SeedReview[]> = {};

async function main() {
  assertSeedAllowed();
  const db = getDb();
  const pool = getPool();
  console.log("Seeding database…");
  await db.execute(sql`TRUNCATE TABLE reviews, inquiries, products RESTART IDENTITY CASCADE`);

  let totalReviews = 0;
  for (const p of PRODUCTS) {
    const list = REVIEWS[p.slug] ?? [];
    const avg = list.length
      ? Math.round((list.reduce((s, r) => s + r[2], 0) / list.length) * 10) / 10
      : 0;

    const [inserted] = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        details: p.details,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        category: p.category,
        origin: p.origin,
        weight: p.weight,
        unit: p.unit,
        stock: p.stock,
        featured: p.featured,
        isNew: p.isNew,
        badge: p.badge,
        images: p.images,
        highlights: p.highlights,
        rating: avg,
        reviewCount: list.length,
      })
      .returning({ id: products.id });

    for (let i = 0; i < list.length; i++) {
      const [author, location, rating, title, comment] = list[i];
      await db.insert(reviews).values({
        productId: inserted.id,
        author,
        location,
        rating,
        title,
        comment,
        createdAt: new Date(Date.now() - (i * 9 + 4) * 86_400_000),
      });
      totalReviews += 1;
    }
  }

  console.log(`Seeded ${PRODUCTS.length} products and ${totalReviews} reviews.`);
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

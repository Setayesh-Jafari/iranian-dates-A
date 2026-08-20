import "dotenv/config";
import { db, pool } from "./index";
import { products, reviews } from "./schema";
import { sql } from "drizzle-orm";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200&h=900`;

// author, location, rating, title, comment
type SeedReview = [string, string, number, string, string];

type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  details: string;
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
    tagline: "Our signature — soft, syrup-rich and endlessly luxurious",
    description:
      "The crown jewel of Bam's palm gardens. Our Kimia-grade Mazafati is hand-selected for its deep, almost-black skin, plump body and impossibly soft flesh that melts into caramel sweetness. This is the date that made Iranian dates famous in India.",
    details:
      "Moisture: 15–18% · Grade: Kimia (AAA) · Shelf life: 12 months refrigerated · Hand-washed and cold-stored from harvest to shipment.",
    price: 1299,
    compareAtPrice: 1599,
    category: "premium",
    origin: "Bam, Kerman · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 84,
    featured: true,
    isNew: false,
    badge: "Bestseller",
    images: ["/images/mazafati.jpg", px(15913423), px(15913411), px(20106286)],
    highlights: [
      "Single-origin Kimia grade (AAA)",
      "Hand-harvested at peak ripeness",
      "Naturally soft with a caramel finish",
      "No additives or preservatives",
    ],
  },
  {
    slug: "piarom-dates",
    name: "Piarom Dates · The Chocolate Date",
    tagline: "Semi-dry, fudge-like and famously complex",
    description:
      "Often called the 'chocolate date', Piarom is semi-dry with a fudge-like chew and a complex, low-sweet finish. Sun-dried on the palm, it needs no added syrup and keeps beautifully. The connoisseur's choice.",
    details:
      "Moisture: 12–15% · Grade: Premium export · Shelf life: 18 months · Naturally semi-dry, no added syrup.",
    price: 1899,
    compareAtPrice: 2199,
    category: "premium",
    origin: "Hormozgan · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 46,
    featured: true,
    isNew: false,
    badge: "Limited",
    images: [px(31717521), px(17302469), px(20632725), px(15913421)],
    highlights: [
      "Sun-dried, zero added syrup",
      "Fudge-like chew, low sweetness",
      "18-month shelf life",
      "The connoisseur's date",
    ],
  },
  {
    slug: "medjool-style-dates",
    name: "Medjool-Style Premium Dates",
    tagline: "Jumbo, plump and show-stoppingly soft",
    description:
      "Jumbo, plump and impossibly soft — our medjool-style dates rival the finest imported medjool at a fraction of the cost. Grown in Iran's sun-soaked south-east, they are a showstopper on any gifting table.",
    details:
      "Moisture: 16–20% · Size: Jumbo 40–60 g each · Shelf life: 12 months · Pitted and re-packed options available.",
    price: 1699,
    compareAtPrice: null,
    category: "premium",
    origin: "Sistan & Baluchestan · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 32,
    featured: false,
    isNew: true,
    badge: "New",
    images: [px(15913421), px(20106286), px(15707374), px(15913411)],
    highlights: [
      "Jumbo 40–60 g fruits",
      "Ultra-soft and glossy",
      "Rivals Californian medjool",
      "Excellent for gifting",
    ],
  },
  {
    slug: "kabkab-dates",
    name: "Kabkab Dates · Soft & Syrupy",
    tagline: "The everyday luxury at a gentle price",
    description:
      "Soft, dark and syrup-rich, Kabkab is the everyday luxury of southern Iran. It is the variety of choice for mass-market sweets, energy balls and date syrup, delivering a honeyed punch at a gentle price.",
    details:
      "Moisture: 18–22% · Grade: Standard premium · Shelf life: 12 months · High natural syrup content.",
    price: 549,
    compareAtPrice: 649,
    category: "soft",
    origin: "Bushehr · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 120,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(11679690), px(35623785), px(17302469), px(15707373)],
    highlights: [
      "Soft with high syrup content",
      "Excellent for sweets & bars",
      "Great value every day",
      "Consistent, repeatable grade",
    ],
  },
  {
    slug: "rabbi-dates",
    name: "Rabbi Dates · Extra-Long",
    tagline: "Elongated, chewy and naturally sweet",
    description:
      "Distinguished by its elongated shape and deep reddish-brown skin, Rabbi dates are chewy and naturally sweet with a light, almost floral finish. A favourite for direct snacking and festival gifting.",
    details:
      "Moisture: 15–18% · Grade: Premium · Shelf life: 12 months · Length: 4–5 cm.",
    price: 749,
    compareAtPrice: null,
    category: "soft",
    origin: "Sistan & Baluchestan · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 58,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(20106286), px(15913423), px(20632754)],
    highlights: [
      "Signature elongated shape",
      "Chewy, floral sweetness",
      "Ideal for stuffing",
      "Festival gifting favourite",
    ],
  },
  {
    slug: "zahedi-dates",
    name: "Zahedi Dates · Golden Dry",
    tagline: "Firm, honeyed and endlessly snackable",
    description:
      "The golden dry date. Firm and gently honeyed, Zahedi keeps exceptionally well and is the workhorse of the trade — perfect for re-packers, confectionery and health snacks.",
    details:
      "Moisture: 10–12% · Grade: Export · Shelf life: 24 months · Naturally dry, no refrigeration needed.",
    price: 649,
    compareAtPrice: 749,
    category: "dry",
    origin: "Dashtestan · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 140,
    featured: true,
    isNew: false,
    badge: null,
    images: [px(17302469), px(11679690), px(15707374), px(35623785)],
    highlights: [
      "Firm, honeyed bite",
      "24-month shelf life",
      "No cold chain needed",
      "Trade favourite",
    ],
  },
  {
    slug: "sayer-dates",
    name: "Sayer Dates · Semi-Dry",
    tagline: "Balanced bite with a honeyed finish",
    description:
      "A balanced semi-dry date with a honeyed finish. Sayer sits between soft and dry, making it endlessly versatile in baking, sweets and everyday snacking.",
    details:
      "Moisture: 12–15% · Grade: Premium · Shelf life: 18 months · Mild, approachable sweetness.",
    price: 599,
    compareAtPrice: null,
    category: "dry",
    origin: "Khuzestan · Iran",
    weight: "1 kg",
    unit: "per kg",
    stock: 76,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(15913411), px(15707373), px(20632754)],
    highlights: [
      "Versatile semi-dry texture",
      "Mild, approachable sweetness",
      "Baking and snack favourite",
      "18-month shelf life",
    ],
  },
  {
    slug: "date-syrup-silani",
    name: "Date Syrup · Silani Pure",
    tagline: "Cold-pressed, single-ingredient liquid gold",
    description:
      "Cold-pressed from fresh Kabkab dates, our Silani syrup is 100% fruit — nothing added, nothing removed. Drizzle over pancakes, stir into milk or use as a natural sweetener in everything.",
    details:
      "Brix: 72–75 · 100% single ingredient · 24-month shelf life · No preservatives, no added sugar.",
    price: 449,
    compareAtPrice: null,
    category: "products",
    origin: "Kerman · Iran",
    weight: "500 ml",
    unit: "per bottle",
    stock: 95,
    featured: true,
    isNew: false,
    badge: "Vegan",
    images: [px(11771949), px(8500508), px(8500502), px(4921856)],
    highlights: [
      "100% single ingredient",
      "Cold-pressed, nothing added",
      "Natural sweetener",
      "24-month shelf life",
    ],
  },
  {
    slug: "date-paste",
    name: "Date Paste · Pitted & Ground",
    tagline: "Bakery-grade, 100% fruit",
    description:
      "Bakery-grade date paste made from pitted, steam-cooked and finely ground dates. The clean, all-natural base your production line has been looking for — perfect for energy bars and baking.",
    details:
      "100% fruit · Brix: 78 · 12-month shelf life · Vacuum-sealed, food-grade pack.",
    price: 399,
    compareAtPrice: null,
    category: "products",
    origin: "Bushehr · Iran",
    weight: "1 kg",
    unit: "per pack",
    stock: 66,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(4921856), px(8500502), px(15913423)],
    highlights: [
      "Bakery-grade, 100% fruit",
      "Steam-cooked & finely ground",
      "Clean-label energy bars",
      "Vacuum-sealed for freshness",
    ],
  },
  {
    slug: "chopped-dates",
    name: "Chopped Dates · Sugar-Coated",
    tagline: "Ready-to-eat bite-size pieces",
    description:
      "Bite-size chopped dates dusted with a whisper of date sugar so they never clump. Ready to eat, ready to bake, and the easiest way to add natural sweetness to your mix.",
    details:
      "Piece size: 4–6 mm · 12-month shelf life · Anti-caking date-sugar coating.",
    price: 349,
    compareAtPrice: null,
    category: "products",
    origin: "Kerman · Iran",
    weight: "500 g",
    unit: "per pack",
    stock: 110,
    featured: false,
    isNew: false,
    badge: null,
    images: [px(11679690), px(15913411), px(17302469)],
    highlights: [
      "Bite-size 4–6 mm pieces",
      "Never clumps",
      "Baking & trail-mix ready",
      "All-natural coating",
    ],
  },
  {
    slug: "date-sugar",
    name: "Date Sugar · Natural Sweetener",
    tagline: "Low-GI, made from whole dehydrated dates",
    description:
      "Made from whole, dehydrated dates ground to a fine crystal — date sugar is a low-GI, mineral-rich alternative to refined sugar that caramelises like the real thing.",
    details:
      "100% whole dates · Low GI · 18-month shelf life · Retains fibre and minerals.",
    price: 699,
    compareAtPrice: null,
    category: "products",
    origin: "Kerman · Iran",
    weight: "500 g",
    unit: "per jar",
    stock: 44,
    featured: false,
    isNew: true,
    badge: "New",
    images: [px(8500508), px(11771949), px(4921856)],
    highlights: [
      "100% whole dates",
      "Low-GI sweetener",
      "Retains fibre & minerals",
      "Caramelises beautifully",
    ],
  },
  {
    slug: "stuffed-dates-walnut",
    name: "Stuffed Dates · Walnut",
    tagline: "Piarom halves filled with crunchy walnut",
    description:
      "Buttery Piarom halves hand-filled with crunchy Persian walnut. A luxurious two-bite treat that needs no sugar — just beautiful ingredients.",
    details:
      "Hand-filled · 50% date, 50% walnut · 9-month shelf life · Individually tray-packed.",
    price: 1099,
    compareAtPrice: 1299,
    category: "gifts",
    origin: "Hormozgan · Iran",
    weight: "500 g",
    unit: "per box",
    stock: 39,
    featured: false,
    isNew: true,
    badge: "New",
    images: [px(20632745), px(20632746), px(15707374)],
    highlights: [
      "Hand-filled Piarom halves",
      "Crunchy Persian walnut",
      "No added sugar",
      "Individually tray-packed",
    ],
  },
  {
    slug: "royal-gift-box",
    name: "The Royal Assorted Gift Box",
    tagline: "Four varieties, artfully curated",
    description:
      "Four of our finest varieties — Mazafati Kimia, Piarom, Medjool-style and stuffed walnut — arranged in a silk-lined wooden box with gold ribbon. The ultimate corporate or festive gift.",
    details:
      "1.6 kg total · 4 varieties · Silk-lined wooden box · Complimentary note card.",
    price: 2499,
    compareAtPrice: 2999,
    category: "gifts",
    origin: "Mixed origins · Iran",
    weight: "1.6 kg",
    unit: "per box",
    stock: 21,
    featured: true,
    isNew: false,
    badge: "Gift",
    images: ["/images/gift-box.jpg", px(20632754), px(20632746), px(6200512)],
    highlights: [
      "Four signature varieties",
      "Silk-lined wooden box",
      "Gold ribbon & note card",
      "Corporate & festive gifting",
    ],
  },
  {
    slug: "mazafati-wholesale-10kg",
    name: "Mazafati Wholesale Carton · 10 kg",
    tagline: "Food-grade carton, direct-import pricing",
    description:
      "Food-grade carton of our signature Kimia-grade Mazafati, cold-chain shipped from our Isfahan warehouse. Direct-import pricing for wholesalers, retailers and re-packers.",
    details:
      "10 kg food-grade carton · Vacuum bagged in 1 kg packs · MOQ: 1 carton · Commercial invoice and export documents available.",
    price: 10990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Bam, Kerman · Iran",
    weight: "10 kg",
    unit: "per carton",
    stock: 18,
    featured: true,
    isNew: false,
    badge: "Wholesale",
    images: [px(15913423), px(20106286), px(15913411)],
    highlights: [
      "Direct-import pricing",
      "Vacuum-bagged in 1 kg packs",
      "Cold-chain shipped",
      "Commercial invoice available",
    ],
  },
  {
    slug: "zahedi-export-25kg",
    name: "Zahedi Export Carton · 25 kg",
    tagline: "Bulk dry dates for trade & re-packers",
    description:
      "Bulk dry Zahedi dates for trade, confectionery and re-packing. Long shelf life, no cold chain needed, and rock-solid pricing at scale.",
    details:
      "25 kg export carton · 24-month shelf life · No cold chain required · Trade pricing on 10+ cartons.",
    price: 11990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Dashtestan · Iran",
    weight: "25 kg",
    unit: "per carton",
    stock: 12,
    featured: false,
    isNew: false,
    badge: "Wholesale",
    images: [px(17302469), px(11679690), px(35623785)],
    highlights: [
      "24-month shelf life",
      "No cold chain needed",
      "Ideal for re-packers",
      "Trade pricing on 10+ cartons",
    ],
  },
  {
    slug: "importers-sampler-5kg",
    name: "Importers' Sampler · 5 kg Assorted",
    tagline: "Five varieties to taste before you commit",
    description:
      "Can't decide? Taste five varieties — Mazafati, Piarom, Kabkab, Zahedi and Sayer — before you commit to a full container. The smart way to buy.",
    details:
      "5 × 1 kg packs · 5 varieties · Ships within 24 hours · Full credit against your first wholesale order.",
    price: 5990,
    compareAtPrice: null,
    category: "wholesale",
    origin: "Mixed origins · Iran",
    weight: "5 kg",
    unit: "per box",
    stock: 27,
    featured: false,
    isNew: false,
    badge: "Try First",
    images: [px(6200512), px(15707374), px(20632754)],
    highlights: [
      "Five varieties in one box",
      "Ships within 24 hours",
      "Credit against first order",
      "Ideal for first-time buyers",
    ],
  },
];

const REVIEWS: Record<string, SeedReview[]> = {
  "mazafati-kimia-dates": [
    ["Rohit Malhotra", "Mumbai", 5, "The best Mazafati I've imported", "Soft, glossy and honestly better than any date I've sourced from Dubai. Cold chain was perfect and the carton arrived immaculate."],
    ["Priya Nair", "Bengaluru", 5, "Blew my retail customers away", "We sell these in our organic store and they fly off the shelf. The texture is exactly as described — caramel-like."],
    ["Aman Gupta", "Delhi", 4, "Superb quality, slight premium", "Quality is top tier. Slightly pricier than alternatives but you can taste where the money goes. Repeat order placed."],
    ["Sana Khan", "Hyderabad", 5, "Restaurant-worthy", "We stuff these with mascarpone for our dessert menu. Guests constantly ask where we get them."],
  ],
  "piarom-dates": [
    ["Farhan Ali", "Kolkata", 5, "'Chocolate date' is accurate", "The Piarom has that fudge-like chew and low sweetness. Nothing like the syrupy stuff you normally get."],
    ["Meera Iyer", "Chennai", 5, "Perfect for gifting", "Bought for Diwali corporate gifting. The boxes looked stunning and the dates tasted even better."],
    ["Deepak Khemka", "Ahmedabad", 4, "Excellent, ships fresh", "Fresh, semi-dry and elegant. Four stars only because I wish the larger sizes were in stock."],
  ],
  "medjool-style-dates": [
    ["Nikhil Agarwal", "Pune", 5, "Rivals real Medjool", "I've bought Californian Medjool for years. These are 95% of the quality at half the price. Impressive."],
    ["Pooja Reddy", "Hyderabad", 4, "Big and plump", "Jumbo fruits, very soft. A couple were slightly squashed in transit but otherwise excellent."],
    ["Vikram Mehta", "Mumbai", 5, "Showstopper", "Served these at a client dinner and everyone asked for the source. A+."],
  ],
  "kabkab-dates": [
    ["Rajesh Patel", "Surat", 5, "Best value soft date", "We make date syrup and sweets from these. Consistent quality, great moisture. Highly recommend."],
    ["Aditya Deshmukh", "Nagpur", 4, "Syrupy and soft", "Very moist as promised. Perfect for energy balls. Packaging could be sturdier."],
    ["Neha Sharma", "Jaipur", 5, "Everyday luxury", "Soft, sweet and affordable. My kids eat them like candy."],
  ],
  "rabbi-dates": [
    ["Kunal Bajaj", "Lucknow", 4, "Unique shape, lovely chew", "The elongated shape makes them easy to stuff and the chew is delightful. Good value."],
    ["Sana Khan", "Hyderabad", 5, "Festival favourite", "We gift these during Ramadan and Eid. Beautiful colour and taste."],
    ["Rohit Malhotra", "Mumbai", 4, "Solid pick", "Chewy, naturally sweet, keeps well. Will reorder."],
  ],
  "zahedi-dates": [
    ["Deepak Khemka", "Ahmedabad", 5, "Trade workhorse", "Dry, firm, zero spoilage. Exactly what you want for re-packing at scale."],
    ["Farhan Ali", "Kolkata", 4, "Clean and dry", "Honeyed without being sticky. Long shelf life is a huge plus for our warehouse."],
    ["Priya Nair", "Bengaluru", 5, "Perfect for baking", "We chop these into cookies and granola. Reliable and clean."],
  ],
  "sayer-dates": [
    ["Meera Iyer", "Chennai", 4, "Balanced and versatile", "Nice middle ground between soft and dry. Great in everything."],
    ["Vikram Mehta", "Mumbai", 4, "Good all-rounder", "Mild sweetness, even texture. Solid everyday date."],
    ["Pooja Reddy", "Hyderabad", 5, "Bakery favourite", "Our pastry chef swears by Sayer for its caramel notes."],
  ],
  "date-syrup-silani": [
    ["Aman Gupta", "Delhi", 5, "Liquid gold", "Single ingredient, clean taste. My customers love it over oatmeal and in smoothies."],
    ["Neha Sharma", "Jaipur", 5, "Kids approve", "Swapped out sugar in everything. Thick, pourable, delicious."],
    ["Rajesh Patel", "Surat", 4, "Great for bakers", "Excellent brix and colour. Would love bigger bulk packs."],
  ],
  "date-paste": [
    ["Nikhil Agarwal", "Pune", 5, "Bakery-grade", "We switched our bars to this paste — cleaner label and better binding than anything else."],
    ["Kunal Bajaj", "Lucknow", 4, "Clean and consistent", "Steam-cooked and finely ground. Very consistent batch to batch."],
  ],
  "chopped-dates": [
    ["Pooja Reddy", "Hyderabad", 4, "Never clumps", "The sugar coating works. Dump straight into dough. Convenient."],
    ["Aditya Deshmukh", "Nagpur", 4, "Handy format", "Great for trail mix and quick baking. Good price."],
  ],
  "date-sugar": [
    ["Meera Iyer", "Chennai", 5, "Low-GI winner", "Caramelises beautifully in coffee and baking. A cupboard staple now."],
    ["Aman Gupta", "Delhi", 4, "Nice alternative", "Clean ingredient, subtle sweetness. Good for tea."],
  ],
  "stuffed-dates-walnut": [
    ["Sana Khan", "Hyderabad", 5, "Two-bite luxury", "The walnut and Piarom pairing is perfect. Guests adore these."],
    ["Rohit Malhotra", "Mumbai", 5, "Gift perfection", "Boxed beautifully and they taste expensive — because they are."],
  ],
  "royal-gift-box": [
    ["Priya Nair", "Bengaluru", 5, "Stunning box", "The wooden box and silk lining are gorgeous. Our clients were delighted."],
    ["Vikram Mehta", "Mumbai", 5, "Corporate hit", "Ordered 50 for Diwali. Impeccable presentation and delivery."],
    ["Neha Sharma", "Jaipur", 5, "Feels premium", "Worth every rupee. The note card is a lovely touch."],
  ],
  "mazafati-wholesale-10kg": [
    ["Rajesh Patel", "Surat", 5, "Import-grade quality", "Cold chain held up perfectly. This is the benchmark for wholesale Mazafati."],
    ["Deepak Khemka", "Ahmedabad", 5, "Pricing is unbeatable", "Direct-import pricing beats our Dubai supplier. Ten cartons deep now."],
    ["Farhan Ali", "Kolkata", 4, "Consistent and clean", "Vacuum bags keep freshness locked in. Very consistent."],
  ],
  "zahedi-export-25kg": [
    ["Aditya Deshmukh", "Nagpur", 5, "Rock solid", "No spoilage, no cold chain, great margins. Our re-pack business runs on this."],
    ["Rajesh Patel", "Surat", 4, "Bulk that works", "25 kg carton is well packed and the dates are clean. Trade pricing helps."],
  ],
  "importers-sampler-5kg": [
    ["Kunal Bajaj", "Lucknow", 5, "Smart way to buy", "Tried all five before committing. Saved me from a bad container decision."],
    ["Nikhil Agarwal", "Pune", 5, "Impressive taste test", "Mazafati and Piarom won us over. The credit against wholesale orders is generous."],
    ["Pooja Reddy", "Hyderabad", 5, "Great onboarding", "Perfect for a first-time importer like us. Clear tasting notes included."],
  ],
};

async function main() {
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

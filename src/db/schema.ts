import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  boolean,
  jsonb,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { StoredInquiryItem } from "@/lib/inquiry";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline"),
    description: text("description").notNull(),
    details: text("details"),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    category: text("category").notNull(),
    origin: text("origin").notNull(),
    weight: text("weight").notNull(),
    unit: text("unit").notNull().default("per kg"),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    stock: integer("stock").notNull().default(10),
    // New records must be explicitly reviewed before public exposure.
    published: boolean("published").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    badge: text("badge"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_featured_idx").on(table.featured),
    index("products_published_idx").on(table.published),
  ]
);

/** Optional, owner-maintained localized catalog copy; base product stays unchanged. */
export const productTranslations = pgTable("product_translations", {
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  name: text("name"),
  tagline: text("tagline"),
  description: text("description"),
  details: text("details"),
  origin: text("origin"),
  weight: text("weight"),
  unit: text("unit"),
  badge: text("badge"),
  highlights: jsonb("highlights").$type<string[]>(),
}, (table) => [primaryKey({ columns: [table.productId, table.locale] })]);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    location: text("location"),
    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment").notNull(),
    // pending | approved | rejected. Only "approved" reviews are shown publicly.
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reviews_product_idx").on(table.productId),
    index("reviews_status_idx").on(table.productId, table.status),
  ]
);

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  country: text("country").notNull(),
  city: text("city"),
  message: text("message"),
  // jsonb only — annotation change, no physical schema change.
  items: jsonb("items").$type<StoredInquiryItem[]>().notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductTranslationRow = typeof productTranslations.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type InquiryRow = typeof inquiries.$inferSelect;

/** Shared, atomic counters for public write endpoints across all instances. */
export const rateLimitBuckets = pgTable(
  "rate_limit_buckets",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull(),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("rate_limit_buckets_reset_at_idx").on(table.resetAt)],
);

/** Idempotency claims and inquiries are written in the same DB transaction. */
export const inquirySubmissionKeys = pgTable("inquiry_submission_keys", {
  key: text("key").primaryKey(),
  payloadHash: text("payload_hash").notNull(),
  inquiryId: text("inquiry_id").notNull().references(() => inquiries.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

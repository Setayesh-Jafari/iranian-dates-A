import { getDb } from "@/db";
import { products, inquiries } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  FIELD_LIMITS,
  MAX_INQUIRY_ITEMS,
  MAX_MESSAGE_LENGTH,
  MAX_QUANTITY_VALUE,
  MAX_REQUEST_BODY_BYTES,
  QUANTITY_UNITS,
  type InquiryUnit,
  type StoredInquiryItem,
} from "@/lib/inquiry";
import { notifyNewInquiry } from "@/lib/notify";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits with optional country code / formatting characters.
const PHONE_RE = /^\+?[0-9\s\-().]{5,23}$/;
const UNIT_VALUES = QUANTITY_UNITS.map((u) => u.value) as InquiryUnit[];

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(trimmed)) return null;
  return trimmed;
}

function cleanOptional(
  value: unknown,
  max: number
): { ok: true; value: string | null } | { ok: false } {
  if (value == null || (typeof value === "string" && value.trim() === "")) {
    return { ok: true, value: null };
  }
  const cleaned = cleanString(value, max);
  return cleaned ? { ok: true, value: cleaned } : { ok: false };
}

/**
 * Accepts a number or a numeric string and normalizes it.
 * Returns null when invalid. Guards are technical anti-abuse limits,
 * not business rules (no MOQ is defined anywhere in this application).
 */
function parseQuantity(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  if (!Number.isFinite(n) || Number.isNaN(n)) return null;
  if (n <= 0) return null;
  if (n > MAX_QUANTITY_VALUE) return null;
  // Normalize to at most 2 decimal places.
  return Math.round(n * 100) / 100;
}

type RawItem = {
  slug?: unknown;
  quantity?: unknown;
  unit?: unknown;
};

export async function POST(request: Request) {
  // ── Payload size guard before parsing ──
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return jsonError("Invalid request body");
  }
  if (raw.length > MAX_REQUEST_BODY_BYTES) {
    return jsonError("Request payload is too large", 413);
  }

  let body: {
    items?: RawItem[];
    customer?: Record<string, unknown>;
    _hp?: unknown; // honeypot field — must stay empty for real users
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError("Invalid request body");
  }
  body ??= {};

  // ── Honeypot: hidden field legitimate users never fill ──
  if (
    typeof body._hp === "string" &&
    body._hp.trim() !== ""
  ) {
    return jsonError("Submission could not be processed");
  }

  const { items, customer = {} } = body;

  // ── Buyer fields (validated, never silently truncated) ──
  const name = cleanString(customer.name, FIELD_LIMITS.name);
  if (!name) return jsonError("Please enter your full name");

  const company = cleanString(customer.company, FIELD_LIMITS.company);
  if (!company)
    return jsonError("Please enter your company name");

  const email = cleanString(customer.email, FIELD_LIMITS.email);
  if (!email || !EMAIL_RE.test(email))
    return jsonError("Please enter a valid business email address");

  const phone = cleanString(customer.phone, FIELD_LIMITS.phone);
  if (!phone || !PHONE_RE.test(phone))
    return jsonError("Please enter a valid phone / WhatsApp number");

  const country = cleanString(customer.country, FIELD_LIMITS.country);
  if (!country) return jsonError("Please select your country");

  // Optional free-text fields: reject oversized/invalid values instead of truncating.
  const cityResult = cleanOptional(customer.city, FIELD_LIMITS.city);
  if (!cityResult.ok)
    return jsonError("Destination is too long or contains invalid characters");
  const city = cityResult.value;

  const messageResult = cleanOptional(customer.message, MAX_MESSAGE_LENGTH);
  if (!messageResult.ok)
    return jsonError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
  const message = messageResult.value;

  // ── Items: technical cap of MAX_INQUIRY_ITEMS (anti-abuse, not a business rule) ──
  if (!Array.isArray(items) || items.length === 0) {
    return jsonError("Please select at least one product");
  }
  if (items.length > MAX_INQUIRY_ITEMS) {
    return jsonError(`An inquiry can include at most ${MAX_INQUIRY_ITEMS} products`);
  }

  const requested: { slug: string; quantity: number; unit: InquiryUnit }[] = [];
  const seenSlugs = new Set<string>();
  for (const item of items) {
    const slug = cleanString(item?.slug, 120);
    if (!slug) return jsonError("Each inquiry item needs a product reference");
    if (seenSlugs.has(slug))
      return jsonError("Duplicate products in inquiry — please remove duplicates");
    seenSlugs.add(slug);

    const quantity = parseQuantity(item?.quantity);
    if (quantity === null) {
      return jsonError(
        "Please provide a valid requested quantity for every product (a number greater than zero)"
      );
    }

    const unit = UNIT_VALUES.includes(item?.unit as InquiryUnit)
      ? (item.unit as InquiryUnit)
      : "kg";

    requested.push({ slug, quantity, unit });
  }

  // ── Product verification: never trust client-supplied names ──
  let authoritative: Map<string, { id: number; name: string }>;
  try {
    const db = getDb();
    const rows = await db
      .select({ id: products.id, slug: products.slug, name: products.name })
      .from(products)
      .where(
        inArray(
          products.slug,
          requested.map((r) => r.slug)
        )
      );
    authoritative = new Map(rows.map((r) => [r.slug, { id: r.id, name: r.name }]));
  } catch {
    // Database unavailable — controlled error, no internals exposed.
    console.error("[inquiry] product verification failed (database unavailable)");
    return jsonError(
      "We couldn't verify the selected products right now. Please try again later.",
      503
    );
  }

  const missing = requested.filter((r) => !authoritative.has(r.slug));
  if (missing.length > 0) {
    return jsonError(
      "One or more selected products could not be verified. Please refresh the page and try again."
    );
  }

  const storedItems: StoredInquiryItem[] = requested.map((r) => {
    const source = authoritative.get(r.slug)!;
    return {
      productId: source.id,
      name: source.name,
      slug: r.slug,
      quantity: r.quantity,
      unit: r.unit,
    };
  });

  // ── Persist first; success is reported only after the row exists ──
  const inquiryId = `INQ-${randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    const db = getDb();
    await db.insert(inquiries).values({
      id: inquiryId,
      name,
      email,
      phone,
      company,
      country,
      city,
      message,
      items: storedItems,
      status: "new",
    });
  } catch (err) {
    // Log the reference + error class only — no PII, no connection details.
    console.error(
      `[inquiry] insert failed for ${inquiryId}:`,
      err instanceof Error ? err.constructor.name : "unknown error"
    );
    return jsonError(
      "We couldn't submit your inquiry right now. Your details were not saved — please try again.",
      500
    );
  }

  // Best-effort team notification (no-op unless INQUIRY_WEBHOOK_URL is set).
  // Never blocks or fails the buyer's request.
  await notifyNewInquiry({
    inquiryId,
    itemCount: storedItems.length,
    country,
  });

  return Response.json({ inquiryId }, { status: 201 });
}

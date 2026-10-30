import { getDb } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY_CHARS = 8 * 1024;
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

function fail(message: string, status = 400, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers });
}

/** Required string: never silently truncated; out of range means rejected. */
function required(v: unknown, min: number, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s.length < min || s.length > max || CONTROL_CHARS.test(s)) return null;
  return s;
}

/** Optional string: empty becomes null; too long or invalid is rejected. */
function optional(
  v: unknown,
  max: number,
): { ok: true; value: string | null } | { ok: false } {
  if (v == null || (typeof v === "string" && v.trim() === "")) {
    return { ok: true, value: null };
  }
  const s = required(v, 1, max);
  return s ? { ok: true, value: s } : { ok: false };
}

export async function POST(request: Request) {
  // 1) Rate limit: 5 reviews per hour per IP.
  const rl = rateLimit(`review:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return fail("Too many reviews. Please try again later.", 429, {
      "Retry-After": String(rl.retryAfter),
    });
  }

  // 2) Payload size guard before parsing.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("Invalid request body");
  }
  if (raw.length > MAX_BODY_CHARS) return fail("Request payload is too large", 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Invalid request body");
  }
  if (!body || typeof body !== "object") return fail("Invalid request body");

  // 3) Honeypot: pretend success to bots, store nothing.
  if (typeof body._hp === "string" && body._hp.trim() !== "") {
    return Response.json({ status: "pending" }, { status: 202 });
  }

  // 4) Validation: no field is silently truncated.
  const productId = Number(body.productId);
  const rating = Number(body.rating);
  if (!Number.isInteger(productId) || productId <= 0) return fail("Invalid product");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return fail("Rating must be a whole number between 1 and 5");
  }

  const author = required(body.author, 1, 80);
  if (!author) return fail("Please enter your name (up to 80 characters)");

  const comment = required(body.comment, 10, 2000);
  if (!comment) return fail("Review must be between 10 and 2000 characters");

  const title = optional(body.title, 120);
  if (!title.ok) return fail("Title must be 120 characters or fewer");

  const location = optional(body.location, 80);
  if (!location.ok) return fail("City must be 80 characters or fewer");

  // 5) The product must exist.
  const db = getDb();
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return fail("Product not found", 404);

  // 6) Store as pending. products.rating / review_count are NOT touched until
  //    a moderator approves the review (see the SQL in the setup notes).
  await db.insert(reviews).values({
    productId,
    author,
    location: location.value,
    rating,
    title: title.value,
    comment,
    status: "pending",
  });

  return Response.json({ status: "pending" }, { status: 202 });
}

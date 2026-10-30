import { getDb } from "@/db";
import { products, reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { checkWriteOrigin, readJsonObject } from "@/lib/request";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

function fail(message: string, status = 400) {
  return Response.json({ code: status === 503 ? "UNAVAILABLE" : "INVALID_REQUEST", error: message }, {
    status, headers: { "Cache-Control": "no-store" },
  });
}
function required(v: unknown, min: number, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length >= min && s.length <= max && !CONTROL_CHARS.test(s) ? s : null;
}
function optional(v: unknown, max: number): { ok: true; value: string | null } | { ok: false } {
  if (v == null || (typeof v === "string" && v.trim() === "")) return { ok: true, value: null };
  const s = required(v, 1, max);
  return s ? { ok: true, value: s } : { ok: false };
}

/** Anonymous submissions are untrusted and always pending; moderation is CLI/DB-only. */
export async function POST(request: Request) {
  const originError = checkWriteOrigin(request);
  if (originError) return originError;
  const limited = rateLimitResponse(await rateLimit(request, "review", 5, 60 * 60_000));
  if (limited) return limited;
  const parsed = await readJsonObject(request, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;
  if (body._hp != null && body._hp !== "") return fail("Submission could not be processed.");

  // Do not coerce null, booleans, arrays or numeric strings into valid numbers.
  const productId = body.productId;
  const rating = body.rating;
  if (typeof productId !== "number" || !Number.isSafeInteger(productId) || productId <= 0) return fail("Invalid product.");
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return fail("Rating must be a whole number between 1 and 5.");
  }
  const author = required(body.author, 1, 80);
  if (!author) return fail("Please enter your name (up to 80 characters).");
  const comment = required(body.comment, 10, 2000);
  if (!comment) return fail("Review must be between 10 and 2000 characters.");
  const title = optional(body.title, 120);
  if (!title.ok) return fail("Title must be 120 characters or fewer.");
  const location = optional(body.location, 80);
  if (!location.ok) return fail("City must be 80 characters or fewer.");

  try {
    const db = getDb();
    const [product] = await db.select({ id: products.id }).from(products).where(and(eq(products.id, productId), eq(products.published, true))).limit(1);
    if (!product) return fail("Product not found.", 404);
    await db.insert(reviews).values({
      productId, author, location: location.value, rating, title: title.value, comment, status: "pending",
    });
    return Response.json({ status: "pending" }, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[reviews] could not store review:", error instanceof Error ? error.constructor.name : "unknown error");
    return fail("Reviews are temporarily unavailable. Please try again later.", 503);
  }
}

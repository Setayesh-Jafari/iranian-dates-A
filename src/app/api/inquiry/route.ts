import { getPool } from "@/db";
import { createHash, randomUUID } from "node:crypto";
import {
  FIELD_LIMITS,
  MAX_INQUIRY_ITEMS,
  MAX_MESSAGE_LENGTH,
  MAX_QUANTITY_VALUE,
  MAX_REQUEST_BODY_BYTES,
  QUANTITY_UNITS,
  normalizeDigits,
  type InquiryUnit,
  type StoredInquiryItem,
} from "@/lib/inquiry";
import { notifyNewInquiry } from "@/lib/notify";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { checkWriteOrigin, readJsonObject } from "@/lib/request";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-().]{5,23}$/;
const UNIT_VALUES = QUANTITY_UNITS.map((u) => u.value) as InquiryUnit[];

function jsonError(message: string, status = 400, code = "INVALID_REQUEST") {
  return Response.json({ code, error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(trimmed)) return null;
  return trimmed;
}

function cleanOptional(value: unknown, max: number): { ok: true; value: string | null } | { ok: false } {
  if (value == null || (typeof value === "string" && value.trim() === "")) return { ok: true, value: null };
  const cleaned = cleanString(value, max);
  return cleaned ? { ok: true, value: cleaned } : { ok: false };
}

function parseQuantity(value: unknown): number | null {
  const numericText = typeof value === "string" ? normalizeDigits(value.trim()) : "";
  const n = typeof value === "number" ? value
    : /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(numericText) ? Number(numericText) : NaN;
  // Never round a small positive amount to zero or invent a business MOQ.
  return Number.isFinite(n) && n > 0 && n <= MAX_QUANTITY_VALUE ? n : null;
}

export async function POST(request: Request) {
  const originError = checkWriteOrigin(request);
  if (originError) return originError;
  const limited = rateLimitResponse(await rateLimit(request, "inquiry", 10, 15 * 60_000));
  if (limited) return limited;

  const parsed = await readJsonObject(request, MAX_REQUEST_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;
  if (body._hp != null && body._hp !== "") return jsonError("Submission could not be processed.");

  const rawCustomer = body.customer;
  if (!rawCustomer || typeof rawCustomer !== "object" || Array.isArray(rawCustomer)) {
    return jsonError("Please provide contact details.");
  }
  const customer = rawCustomer as Record<string, unknown>;
  const name = cleanString(customer.name, FIELD_LIMITS.name);
  if (!name) return jsonError("Please enter your full name.");
  const company = cleanString(customer.company, FIELD_LIMITS.company);
  if (!company) return jsonError("Please enter your company name.");
  const email = cleanString(customer.email, FIELD_LIMITS.email);
  if (!email || !EMAIL_RE.test(email)) return jsonError("Please enter a valid business email address.");
  const phoneRaw = cleanString(customer.phone, FIELD_LIMITS.phone);
  const phone = phoneRaw ? normalizeDigits(phoneRaw) : null;
  if (!phone || !PHONE_RE.test(phone) || (phone.match(/[0-9]/g)?.length ?? 0) < 5) {
    return jsonError("Please enter a valid phone / WhatsApp number.");
  }
  const country = cleanString(customer.country, FIELD_LIMITS.country);
  if (!country) return jsonError("Please select your country.");
  const cityResult = cleanOptional(customer.city, FIELD_LIMITS.city);
  if (!cityResult.ok) return jsonError("Destination is too long or contains invalid characters.");
  const messageResult = cleanOptional(customer.message, MAX_MESSAGE_LENGTH);
  if (!messageResult.ok) return jsonError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);

  if (!Array.isArray(body.items) || body.items.length === 0) return jsonError("Please select at least one product.");
  if (body.items.length > MAX_INQUIRY_ITEMS) return jsonError(`An inquiry can include at most ${MAX_INQUIRY_ITEMS} products.`);
  const requested: { slug: string; quantity: number; unit: InquiryUnit }[] = [];
  const seen = new Set<string>();
  for (const rawItem of body.items) {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) return jsonError("Invalid product entry.");
    const item = rawItem as Record<string, unknown>;
    const slug = cleanString(item.slug, 120);
    if (!slug || seen.has(slug)) return jsonError("Invalid or duplicate product reference.");
    seen.add(slug);
    const quantity = parseQuantity(item.quantity);
    if (quantity === null) return jsonError("Provide a valid quantity greater than zero for every product.");
    if (typeof item.unit !== "string" || !UNIT_VALUES.includes(item.unit as InquiryUnit)) {
      return jsonError("Invalid quantity unit.");
    }
    requested.push({ slug, quantity, unit: item.unit as InquiryUnit });
  }

  // The client retains this random key when retrying the same payload. Reuse
  // with different details is rejected instead of overwriting an existing lead.
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || !/^[a-zA-Z0-9_-]{16,128}$/.test(idempotencyKey)) {
    return jsonError("A valid Idempotency-Key is required.");
  }
  const keyHash = createHash("sha256").update(idempotencyKey).digest("hex");
  const payloadHash = createHash("sha256").update(JSON.stringify({
    requested, name, company, email, phone, country, city: cityResult.value, message: messageResult.value,
  })).digest("hex");
  const inquiryId = `INQ-${randomUUID().toUpperCase()}`;
  let created = false;
  let confirmedId = inquiryId;

  try {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      // Serialize requests with the same key across instances. The inquiry and
      // its claim commit together, and the FK removes stale claims on deletion.
      const lockId = BigInt.asIntN(64, BigInt(`0x${keyHash.slice(0, 16)}`)).toString();
      await client.query("SELECT pg_advisory_xact_lock($1::bigint)", [lockId]);
      const previous = await client.query<{ payload_hash: string; inquiry_id: string }>(
        "SELECT payload_hash, inquiry_id FROM inquiry_submission_keys WHERE key = $1", [keyHash],
      );
      if (previous.rows[0]) {
        if (previous.rows[0].payload_hash !== payloadHash) {
          await client.query("ROLLBACK");
          return jsonError("This submission key was already used for different details.", 409, "CONFLICT");
        }
        confirmedId = previous.rows[0].inquiry_id;
      } else {
        const rows = await client.query<{ id: number; slug: string; name: string }>(
          "SELECT id, slug, name FROM products WHERE published = true AND slug = ANY($1::text[])",
          [requested.map((item) => item.slug)],
        );
        const authoritative = new Map(rows.rows.map((row) => [row.slug, row]));
        if (requested.some((item) => !authoritative.has(item.slug))) {
          await client.query("ROLLBACK");
          return jsonError("One or more selected products could not be verified.");
        }
        const storedItems: StoredInquiryItem[] = requested.map((item) => {
          const product = authoritative.get(item.slug)!;
          return { productId: product.id, name: product.name, ...item };
        });
        await client.query(
          `INSERT INTO inquiries (id, name, email, phone, company, country, city, message, items, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, 'new')`,
          [inquiryId, name, email, phone, company, country, cityResult.value, messageResult.value, JSON.stringify(storedItems)],
        );
        await client.query(
          "INSERT INTO inquiry_submission_keys (key, payload_hash, inquiry_id) VALUES ($1, $2, $3)",
          [keyHash, payloadHash, inquiryId],
        );
        created = true;
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[inquiry] could not confirm submission:", error instanceof Error ? error.constructor.name : "unknown error");
    // If the connection failed during COMMIT its outcome can be uncertain. A
    // retry using the same key safely recovers the original reference.
    return jsonError("We could not confirm your inquiry. Please retry with the same details.", 503, "UNAVAILABLE");
  }

  if (created) await notifyNewInquiry({ inquiryId, itemCount: requested.length, country });
  return Response.json({ inquiryId: confirmedId }, {
    status: created ? 201 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}

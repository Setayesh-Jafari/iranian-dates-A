import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { getPool } from "@/db";

/**
 * A shared fixed-window limiter backed by PostgreSQL. The upsert is atomic
 * across processes/instances. Never trust arbitrary forwarded headers: a
 * production deployment must configure a SINGLE header that its trusted edge
 * strips from incoming requests and replaces with the actual client IP.
 *
 * This is defense in depth, not a substitute for an edge/WAF request limit.
 */
export type RateLimitResult =
  | { status: "allowed" }
  | { status: "limited"; retryAfter: number }
  | { status: "unavailable" };

const SUPPORTED_IP_HEADERS = new Set(["x-real-ip", "x-forwarded-for", "cf-connecting-ip"]);

function clientIp(request: Request): string | null {
  const configured = process.env.RATE_LIMIT_IP_HEADER?.toLowerCase().trim();
  if (!configured) {
    // Development with no proxy shares one bucket. Production must be explicit.
    return process.env.NODE_ENV === "production" ? null : "local-development";
  }
  if (!SUPPORTED_IP_HEADERS.has(configured)) return null;
  const raw = request.headers.get(configured)?.trim();
  // Reject lists, ports, and invalid IPs; the trusted proxy must replace the
  // whole header with exactly one value, not append to client input.
  if (!raw || !isIP(raw)) return null;
  if (isIP(raw) === 6) {
    // Collapse equivalent textual IPv6 spellings into one bucket.
    return new URL(`http://[${raw}]/`).hostname.toLowerCase();
  }
  return raw;
}

export async function rateLimit(
  request: Request,
  scope: "inquiry" | "review",
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  if (!ip) return { status: "unavailable" };

  // Do not store raw IPs. IP hashes remain potentially identifying and need
  // the retention controls described in the deployment documentation.
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  try {
    const pool = getPool();
    const result = await pool.query<{ count: number; retry_after: number }>(
      `INSERT INTO rate_limit_buckets (key, count, reset_at)
       VALUES ($1, 1, clock_timestamp() + $2::bigint * interval '1 millisecond')
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN rate_limit_buckets.reset_at <= clock_timestamp()
           THEN 1 ELSE LEAST(rate_limit_buckets.count + 1, $3::integer + 1) END,
         reset_at = CASE WHEN rate_limit_buckets.reset_at <= clock_timestamp()
           THEN clock_timestamp() + $2::bigint * interval '1 millisecond'
           ELSE rate_limit_buckets.reset_at END
       RETURNING count, GREATEST(1, CEIL(EXTRACT(EPOCH FROM
         (reset_at - clock_timestamp()))))::integer AS retry_after`,
      [key, windowMs, limit],
    );

    // Opportunistically prune expired entries; the index makes this bounded by
    // expired rows. Failure is non-fatal to the successful limiter decision.
    if (Math.random() < 0.01) {
      void pool.query("DELETE FROM rate_limit_buckets WHERE reset_at < now() - interval '1 day'")
        .catch(() => console.error("[rate-limit] expired bucket cleanup failed"));
    }
    const bucket = result.rows[0];
    return bucket.count > limit
      ? { status: "limited", retryAfter: bucket.retry_after }
      : { status: "allowed" };
  } catch {
    // Fail closed: accepting traffic without a functioning shared limiter
    // would silently remove the production abuse protection.
    console.error("[rate-limit] shared limiter unavailable");
    return { status: "unavailable" };
  }
}

export function rateLimitResponse(result: RateLimitResult): Response | null {
  if (result.status === "allowed") return null;
  if (result.status === "limited") {
    return Response.json(
      { code: "RATE_LIMITED", error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(result.retryAfter), "Cache-Control": "no-store" } },
    );
  }
  return Response.json(
    { code: "UNAVAILABLE", error: "The service is temporarily unavailable. Please try again later." },
    { status: 503, headers: { "Retry-After": "30", "Cache-Control": "no-store" } },
  );
}

import { getPool, isDbConfigured } from "@/db";

export const dynamic = "force-dynamic";

const DB_PROBE_TIMEOUT_MS = 3000;

/**
 * Health probe. Safe to call even when the database is missing,
 * misconfigured or unreachable. Never throws at module import and never
 * exposes connection strings, errors or stack traces.
 */
export async function GET() {
  if (!isDbConfigured) {
    return degraded();
  }

  if (process.env.NODE_ENV === "production" &&
      !["x-real-ip", "x-forwarded-for", "cf-connecting-ip"].includes(process.env.RATE_LIMIT_IP_HEADER?.toLowerCase().trim() ?? "")) {
    return degraded();
  }
  try {
    const pool = getPool();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        pool.query<{ ready: boolean }>(`SELECT
          to_regclass('products') IS NOT NULL AND
          to_regclass('reviews') IS NOT NULL AND
          to_regclass('inquiries') IS NOT NULL AND
          to_regclass('product_translations') IS NOT NULL AND
          to_regclass('rate_limit_buckets') IS NOT NULL AND
          to_regclass('inquiry_submission_keys') IS NOT NULL AND
          EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = to_regclass('products')
            AND attname = 'published' AND NOT attisdropped) AS ready`),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("db-probe-timeout")), DB_PROBE_TIMEOUT_MS);
          timer.unref?.();
        }),
      ]);
      if (!result.rows[0]?.ready) return degraded();
    } finally {
      if (timer) clearTimeout(timer);
    }
    return Response.json(
      { status: "ok", database: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return degraded();
  }
}

function degraded() {
  return Response.json(
    { status: "degraded", database: "unavailable" },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

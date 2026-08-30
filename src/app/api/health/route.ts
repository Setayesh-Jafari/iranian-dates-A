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

  try {
    const pool = getPool();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        pool.query("select 1"),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("db-probe-timeout")), DB_PROBE_TIMEOUT_MS);
          timer.unref?.();
        }),
      ]);
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

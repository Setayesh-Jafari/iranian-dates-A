/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Limits: the counters live in this process only. They reset on restart and
 * are NOT shared between several instances. With more than one instance,
 * use Redis or rate-limit at the reverse proxy instead.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing forever.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client IP. `x-forwarded-for` is only trustworthy when the app
 * runs behind a proxy that overwrites it; otherwise a client can spoof it.
 */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

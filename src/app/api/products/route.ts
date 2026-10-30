import { isLocale } from "@/i18n/config";
import { getCategoryFacets, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 50;
const MAX_QUERY_LENGTH = 100;
const SORTS = ["featured", "rating", "newest"];

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

/**
 * Reads an optional numeric query parameter.
 * - absent or empty  -> undefined
 * - not a finite number -> null (the caller answers 400)
 */
function numberParam(params: URLSearchParams, name: string): number | undefined | null {
  const raw = params.get(name);
  if (raw === null || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  // Garbage input (not a number, unknown sort, absurdly long search) -> 400.
  // Numbers that are merely out of range are clamped instead.
  const limitRaw = numberParam(params, "limit");
  if (limitRaw === null) return badRequest("limit must be a number");
  const limit =
    limitRaw === undefined
      ? DEFAULT_LIMIT
      : Math.min(Math.max(Math.floor(limitRaw), 1), MAX_LIMIT);

  const ratingRaw = numberParam(params, "rating");
  if (ratingRaw === null) return badRequest("rating must be a number");
  const minRating =
    ratingRaw === undefined ? undefined : Math.min(Math.max(ratingRaw, 0), 5);

  const sort = params.get("sort") || undefined;
  if (sort && !SORTS.includes(sort)) {
    return badRequest(`sort must be one of: ${SORTS.join(", ")}`);
  }

  const q = params.get("q")?.trim() || undefined;
  if (q && q.length > MAX_QUERY_LENGTH) {
    return badRequest(`q must be ${MAX_QUERY_LENGTH} characters or fewer`);
  }

  const localeRaw = params.get("locale") || "en";
  if (!isLocale(localeRaw)) return badRequest("locale must be en or fa");
  const category = params.get("category") || undefined;
  if (category && category.length > 80) return badRequest("category must be 80 characters or fewer");

  try {
    const [products, facets] = await Promise.all([
      getProducts({ category, q, sort, minRating, limit, locale: localeRaw }),
      getCategoryFacets(),
    ]);
    return Response.json({ products, facets, total: products.length });
  } catch (err) {
    // Database unavailable or misconfigured: controlled error, no internals.
    console.error(
      "[api/products] query failed:",
      err instanceof Error ? err.constructor.name : "unknown error"
    );
    return Response.json(
      { error: "Products are temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Retry-After": "30" } }
    );
  }
}
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  negotiateLocale,
} from "@/i18n/config";

/** Requests for files (anything with an extension) are never locale-rewritten. */
const PUBLIC_FILE = /\.[^/]+$/;

/**
 * Locale routing middleware.
 *
 * - `/`, `/products`, … are redirected to `/{locale}/…`.
 * - The locale comes from the `NEXT_LOCALE` cookie (an explicit previous
 *   choice) and otherwise from `Accept-Language` negotiation.
 * - `/api/**`, `/_next/**` and static file requests are passed through
 *   untouched, so API routes keep their unprefixed URLs and their PR #5
 *   request/response contract.
 * - Redirects are same-origin by construction: only the pathname of the
 *   incoming request is prefixed, never a host or an absolute URL.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Never rewrite API routes, Next internals, or file requests.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Guard against protocol-relative or malformed paths.
  if (pathname.startsWith("//") || pathname.includes("\\")) {
    return NextResponse.next();
  }

  const maybeLocale = pathname.split("/")[1];

  if (isLocale(maybeLocale)) {
    // Already localized: remember the explicit choice for the next visit.
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== maybeLocale) {
      response.cookies.set(LOCALE_COOKIE, maybeLocale, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : negotiateLocale(request.headers.get("accept-language")) || DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /**
     * Everything except API routes, Next internals and requests that look
     * like files (they can never be a locale-prefixed page).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  negotiateLocale,
} from "@/i18n/config";

export const LOCALE_COOKIE = "NEXT_LOCALE";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip API routes, Next internals and static assets.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  // Already locale-prefixed → remember the choice and continue.
  if (isLocale(maybeLocale)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== maybeLocale) {
      response.cookies.set(LOCALE_COOKIE, maybeLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Otherwise redirect to the best matching locale.
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
    // Everything except Next internals, API routes and files with an extension.
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
  ],
};

export const SUPPORTED_LOCALES = LOCALES;

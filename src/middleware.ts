import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, negotiateLocale } from "@/i18n/config";

export const LOCALE_COOKIE = "NEXT_LOCALE";
const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const maybeLocale = pathname.split("/")[1];
  if (isLocale(maybeLocale)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== maybeLocale) {
      response.cookies.set(LOCALE_COOKIE, maybeLocale, {
        path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax",
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};

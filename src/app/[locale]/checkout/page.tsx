import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/i18n/config";

/**
 * Checkout no longer exists as its own step: it was replaced by the inquiry
 * (RFQ) flow in PR #5. The redirect is kept, now locale-aware.
 */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  redirect(localePath(locale, "/inquiry"));
}

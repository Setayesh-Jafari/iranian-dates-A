import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/i18n/config";

/**
 * Legacy B2C route. This is a B2B catalog with no public checkout —
 * everything routes into the inquiry (RFQ) system.
 */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  redirect(localePath(locale, "/inquiry"));
}

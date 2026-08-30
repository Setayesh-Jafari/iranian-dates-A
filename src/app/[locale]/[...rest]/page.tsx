import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths inside a locale segment.
 *
 * Without it, an unknown URL such as `/en/does-not-exist` falls through to
 * Next's global 404, which renders outside the localized layout — no
 * `lang`/`dir` on `<html>`, no header/footer, and an untranslated message.
 * Matching the segment here lets the localized not-found boundary
 * (`app/[locale]/not-found.tsx`) handle it instead.
 *
 * More specific routes (`products/[slug]`, `certifications`, …) always take
 * precedence over this catch-all.
 */
export default function LocaleCatchAll(): never {
  notFound();
}

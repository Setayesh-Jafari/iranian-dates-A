"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Localized error boundary for the `[locale]` route tree.
 *
 * Catches errors thrown while rendering a page (for example when the
 * database is unreachable) and shows a friendly message instead of the
 * default Next.js error screen.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();
  const router = useRouter();

  useEffect(() => {
    // The digest links this to the full server-side log; never log the message.
    console.error("[page error]", error.digest ?? error.name);
  }, [error]);

  function retry() {
    // Re-fetch the server-rendered data, then re-render the segment.
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-date-900">
        {dict.serverError.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-date-600">
        {dict.serverError.text}
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
      >
        {dict.serverError.retry}
      </button>
    </div>
  );
}
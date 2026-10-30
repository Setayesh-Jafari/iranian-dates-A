"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE, firstImage } from "@/lib/images";
import { useI18n } from "@/i18n/I18nProvider";

/** Handles both invalid URLs and a valid remote URL that later fails to load. */
export function SafeImage({ src, alt, onError, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  const { dict } = useI18n();
  const safeSrc = firstImage([src]);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const displaySrc = failedSrc === safeSrc ? FALLBACK_IMAGE : safeSrc;
  return (
    <Image
      {...props}
      src={displaySrc}
      alt={alt && displaySrc === FALLBACK_IMAGE ? `${alt} — ${dict.common.imageUnavailable}` : alt}
      onError={(event) => {
        if (displaySrc !== FALLBACK_IMAGE) setFailedSrc(safeSrc);
        onError?.(event);
      }}
    />
  );
}

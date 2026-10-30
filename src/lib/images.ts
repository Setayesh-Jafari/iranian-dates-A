/**
 * Shared image helpers for products.
 *
 * Centralises the fallback image used when a product has no images so every
 * surface (cards, buttons, cart drawer, inquiry list, gallery) renders a
 * valid URL instead of passing "" to next/image.
 */

// Neutral fallback used only when a product has no images attached.
// NOTE: placeholder imagery — not verified product photography.
// Host must be whitelisted in next.config.ts (images.pexels.com is).
export const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/15913423/pexels-photo-15913423.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200&h=900";

/**
 * Returns the first valid image URL from a product's `images` array, or the
 * FALLBACK_IMAGE when the array is missing/empty/contains only blank strings.
 * Guarantees callers always receive a non-empty URL suitable for next/image.
 */
export function firstImage(images: string[] | undefined | null): string {
  if (!images) return FALLBACK_IMAGE;
  for (const src of images) {
    if (isValidImageSrc(src)) return src;
  }
  return FALLBACK_IMAGE;
}

/**
 * Returns a new array containing only valid image URLs, with FALLBACK_IMAGE
 * appended when the input contained no valid entries. Useful for surfaces
 * that iterate over every image (thumbnails, gallery).
 */
export function sanitizeImages(images: string[] | undefined | null): string[] {
  const valid = images?.filter(isValidImageSrc) ?? [];
  return valid.length > 0 ? valid : [FALLBACK_IMAGE];
}

function isValidImageSrc(src: unknown): src is string {
  return typeof src === "string" && src.trim() !== "";
}

/** Only local files and the configured remote image host are accepted. */
export const FALLBACK_IMAGE = "/product-placeholder.svg";

function validImageSrc(src: unknown): string | null {
  if (typeof src !== "string") return null;
  const value = src.trim();
  if (!value || /[\u0000-\u001f\u007f\\]/.test(value)) return null;
  if (value.startsWith("/") && !value.startsWith("//")) {
    try {
      const url = new URL(value, "https://local.invalid");
      return url.origin === "https://local.invalid" ? value : null;
    } catch { return null; }
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "images.pexels.com" &&
      !url.port && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}

export function firstImage(images: string[] | undefined | null): string {
  return sanitizeImages(images)[0];
}

export function sanitizeImages(images: string[] | undefined | null): string[] {
  const valid = Array.isArray(images) ? images.map(validImageSrc).filter((src): src is string => !!src) : [];
  return valid.length ? valid : [FALLBACK_IMAGE];
}

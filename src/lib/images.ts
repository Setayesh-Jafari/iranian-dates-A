/**
 * Photography used outside the product catalog.
 *
 * These are the same Pexels photographs the original version of the site
 * shipped with (see `src/db/seed.ts`) — no generated or third-party imagery.
 * Remote patterns for images.pexels.com are allowed in `next.config.ts`.
 */
export function pexels(id: number, w = 1600, h = 900): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=${w}&h=${h}`;
}

export const SITE_IMAGES = {
  hero: pexels(15913423, 1920, 1280),
  flagship: pexels(15913411, 1200, 1500),
  story: pexels(20106286, 1200, 900),
  giftBox: pexels(20632754, 1200, 900),
} as const;

/** One distinct catalog photo per collection tile on the home page. */
export const COLLECTION_IMAGES: Record<string, string> = {
  premium: pexels(15913423, 1200, 900),
  soft: pexels(11679690, 1200, 900),
  dry: pexels(17302469, 1200, 900),
  products: pexels(8500508, 1200, 900),
  gifts: pexels(20632754, 1200, 900),
  wholesale: pexels(15913411, 1200, 900),
};

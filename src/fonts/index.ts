import localFont from "next/font/local";

/**
 * Self-hosted fonts.
 *
 * The woff2 files next to this module are bundled with the application, so
 * the build is hermetic and no request is made to any third-party font host,
 * at build time or at runtime: this project loads fonts from `next/font/local`
 * only and imports nothing from the Google Fonts helper.
 *
 * Latin (en):   Inter (body) + Fraunces (display, with a true italic).
 * Persian (fa): Estedad (body) + Gandom (display) — chosen so the Persian
 *               pair keeps the same body/display contrast as the Latin pair.
 *
 * NOTE: next/font requires every loader option to be an inline literal, so
 * the fallback stacks are written out per face instead of shared.
 */

export const inter = localFont({
  src: [
    {
      path: "./inter-latin-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "sans-serif",
  ],
});

export const fraunces = localFont({
  src: [
    {
      path: "./fraunces-latin-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fraunces-latin-variable-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});

export const estedad = localFont({
  src: [
    {
      path: "./estedad-arabic-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./estedad-latin-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-estedad",
  display: "swap",
  fallback: ["Tahoma", "ui-sans-serif", "system-ui", "sans-serif"],
});

export const gandom = localFont({
  src: [{ path: "./gandom.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-gandom",
  display: "swap",
  fallback: ["Tahoma", "ui-sans-serif", "system-ui", "sans-serif"],
});

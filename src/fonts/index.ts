import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (woff2, subset per script).
 *
 * They are bundled with the app instead of fetched from Google Fonts so the
 * Docker/CI build stays hermetic and no third-party request is made at runtime.
 *
 * Latin (en):   Inter (body) + Fraunces (display)
 * Persian (fa): Estedad (body) + Gandom (display) — the Persian pair mirrors the
 *               body/display contrast of the Latin pair instead of using one
 *               single face for everything.
 */

export const inter = localFont({
  src: [{ path: "./inter-latin-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

export const fraunces = localFont({
  src: [
    { path: "./fraunces-latin-variable.woff2", weight: "100 900", style: "normal" },
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

/** Persian/Arabic text face — variable weight, excellent on-screen legibility. */
export const estedad = localFont({
  src: [
    { path: "./estedad-arabic-variable.woff2", weight: "100 900", style: "normal" },
    { path: "./estedad-latin-variable.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-estedad",
  display: "swap",
  fallback: ["Tahoma", "ui-sans-serif", "system-ui", "sans-serif"],
});

/** Persian display face used for headings in the fa locale. */
export const gandom = localFont({
  src: [{ path: "./gandom.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-gandom",
  display: "swap",
  fallback: ["Tahoma", "ui-sans-serif", "system-ui", "sans-serif"],
});

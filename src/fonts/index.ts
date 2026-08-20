import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (woff2, subset per script).
 *
 * They are bundled with the app instead of fetched from Google Fonts so the
 * Docker/CI build stays hermetic and no third-party request is made at runtime.
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

/** Persian/Arabic script face used for the fa locale (body + headings). */
export const vazirmatn = localFont({
  src: [
    { path: "./vazirmatn-arabic-variable.woff2", weight: "100 900", style: "normal" },
    { path: "./vazirmatn-latin-variable.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "ui-sans-serif", "system-ui", "sans-serif"],
});

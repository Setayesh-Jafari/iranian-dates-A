import type { NextConfig } from "next";

// The sandbox preview explicitly opts into framing; production defaults to
// DENY. Next requires inline hydration scripts/styles; eval is allowed only in
// development. A nonce-based strict CSP would require a broader rendering change.
const previewEmbedding = process.env.ALLOW_EMBEDDED_PREVIEW === "1";
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  ...(!previewEmbedding ? ["frame-ancestors 'none'"] : []),
  "img-src 'self' data: https://images.pexels.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        ...(!previewEmbedding ? [{ key: "X-Frame-Options", value: "DENY" }] : []),
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=()" },
        // Browsers ignore HSTS over HTTP; no includeSubDomains until the owner
        // verifies all subdomains are HTTPS-ready.
        ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
      ],
    }, {
      source: "/api/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }];
  },
};
export default nextConfig;

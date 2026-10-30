import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  headers: () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "geolocation=(), microphone=(), camera=(), payment=()",
        },
        // Strict-Transport-Security only for production HTTPS
        ...(process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
          ? [
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000",
              },
            ]
          : []),
      ],
    },
  ],
};

export default nextConfig;

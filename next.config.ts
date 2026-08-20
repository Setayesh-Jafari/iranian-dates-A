import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // All photography is served from the Pexels CDN with the right dimensions
    // already baked into the URL, so it is loaded straight from the browser
    // instead of being re-fetched and re-encoded by the Next.js server.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;

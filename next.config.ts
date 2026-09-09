import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Sandboxed/remote dev previews are served from a different host than the
  // dev server binds to. Without this, Next's dev-only cross-origin guard
  // answers every /_next/static/* request with 403 "Unauthorized", so no
  // client JS ever runs in the preview and the app renders un-hydrated.
  // Has no effect on production builds.
  allowedDevOrigins: ["*.e2b.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;

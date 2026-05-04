import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: {
    // Lint runs in CI separately; don't block the deploy build.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type-check runs locally; don't block deploy build on type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

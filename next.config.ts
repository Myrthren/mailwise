import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typescript: {
    // Type-check runs locally; don't block deploy build on type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

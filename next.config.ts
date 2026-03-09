import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // PWA configuration
  // Note: next-pwa will be added as dependency
  // For now, manifest.json is configured in /public
};

export default nextConfig;

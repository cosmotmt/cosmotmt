import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {
  /* config options here */
};

// Cloudflare の開発プラットフォーム（D1, R2 等）を next dev で使えるようにする
if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

export default nextConfig;

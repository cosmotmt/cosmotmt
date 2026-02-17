import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig = async (): Promise<NextConfig> => {
  // Cloudflare の開発プラットフォーム（D1, R2 等）を next dev で使えるようにする
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform({
      persist: true
    });
  }

  return {
    /* config options here */
  };
};

export default nextConfig;

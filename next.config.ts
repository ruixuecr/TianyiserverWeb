import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  output: process.env.TIANYI_STANDALONE === "1" ? "standalone" : undefined,
  async rewrites() {
    return [
      { source: "/_AMapService/:path*", destination: "/api/amap/:path*" },
    ];
  },
};
export default config;

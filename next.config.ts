import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      { source: "/_AMapService/:path*", destination: "/api/amap/:path*" },
    ];
  },
};
export default config;

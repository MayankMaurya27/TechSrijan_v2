import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["three", "qrcode", "react-hook-form", "lucide-react"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output only when building in a container (Docker/Cloud Run)
  ...(process.env.DOCKER_BUILD === "true" ? { output: "standalone" as const } : {}),
  images: {
    qualities: [75, 100],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["qrcode", "react-hook-form", "lucide-react"],
  },
};

export default nextConfig;

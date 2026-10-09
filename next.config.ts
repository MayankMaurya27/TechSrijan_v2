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
    optimizePackageImports: ["qrcode", "lucide-react"],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

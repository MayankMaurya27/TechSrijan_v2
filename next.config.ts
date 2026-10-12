import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output only when building in a container (Docker/Cloud Run)
  ...(process.env.DOCKER_BUILD === "true" ? { output: "standalone" as const } : {}),
  images: {
    loader: "custom",
    loaderFile: "./src/shared/utils/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["qrcode", "lucide-react"],
  },
  async rewrites() {
    let backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://techsrijan-backend.onrender.com"
        : "http://localhost:4000");

    // Guard: Prevent Vercel edge proxy from resolving localhost/private IPs in production
    if (
      process.env.NODE_ENV === "production" &&
      (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1"))
    ) {
      backendUrl = "https://techsrijan-backend.onrender.com";
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

};

export default nextConfig;

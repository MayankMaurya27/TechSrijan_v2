"use client";

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps): string {
  const isCloudinaryEnabled =
    process.env.NEXT_PUBLIC_ENABLE_CLOUDINARY !== "false";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Fallback to local asset if Cloudinary is explicitly disabled or no cloud name configured
  if (!isCloudinaryEnabled || !cloudName) {
    return src;
  }

  // Preserve external absolute URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Strip leading slash
  const cleanPath = src.startsWith("/") ? src.slice(1) : src;

  // Automated optimizations:
  // - w_${width}: Responsive downscaling matching screen DPR
  // - q_${quality || 'auto'}: Smart quality compression
  // - f_auto: Modern AVIF / WebP delivery
  // - c_limit: No upscaling distortion
  const transforms = [
    `w_${width}`,
    `q_${quality || "auto"}`,
    "f_auto",
    "c_limit",
  ].join(",");

  const versionPrefix = cleanPath.startsWith("hero-logo") ? "v1791912581/" : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${versionPrefix}techsrijan/${cleanPath}`;
}

export function getOptimizedImageUrl(src: string, width = 1200, quality = 85): string {
  try {
    return cloudinaryLoader({ src, width, quality });
  } catch {
    return src;
  }
}

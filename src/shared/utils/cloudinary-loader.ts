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

  // Strip leading slash and extension for dynamic format negotiation
  const cleanPath = src.startsWith("/") ? src.slice(1) : src;
  const pathWithoutExt = cleanPath.replace(/\.[^/.]+$/, "");

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

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/techsrijan/${pathWithoutExt}`;
}

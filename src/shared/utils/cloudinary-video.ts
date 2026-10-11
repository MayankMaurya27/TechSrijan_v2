/**
 * Helper to dynamically stream videos from Cloudinary CDN when enabled,
 * with zero-latency local fallback if offline or Cloudinary is disabled.
 */
export function getMediaVideoUrl(localVideoPath: string): string {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_CLOUDINARY !== "false";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!isEnabled || !cloudName) {
    return localVideoPath;
  }

  // e.g. "/event_video_desktop.mp4" -> "event_video_desktop"
  const filename = localVideoPath.replace(/^\//, "").replace(/\.mp4$/, "");

  // Deliver exact video bytes with intact keyframe intervals (avoiding q_auto re-encoding)
  return `https://res.cloudinary.com/${cloudName}/video/upload/techsrijan/videos/${filename}.mp4`;
}

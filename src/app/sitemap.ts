import type { MetadataRoute } from "next";
import { SITE_URL } from "@/core/site";

// Only indexable, non-redirecting pages (/cap redirects; auth/dashboard routes are noindex)
const ROUTES: [path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly"][] = [
  ["/", 1.0, "daily"],
  ["/events", 0.9, "daily"],
  ["/ambassador", 0.8, "weekly"],
  ["/accommodation", 0.8, "weekly"],
  ["/team", 0.7, "monthly"],
  ["/about", 0.7, "monthly"],
  ["/guests", 0.7, "monthly"],
  ["/sponsors", 0.7, "monthly"],
  ["/contact", 0.6, "monthly"],
  ["/developers", 0.4, "monthly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([path, priority, changeFrequency]) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));
}

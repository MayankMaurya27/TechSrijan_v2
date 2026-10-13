import type { Metadata } from "next";

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: "Events & Competitions — MMMUT Techfest 2026",
  description:
    "Robotics, coding, hackathons, design and management competitions at TechSrijan'27, the techfest of MMMUT Gorakhpur, 25–27 December 2026. Explore events by MMMUT RESO, SAE MMMUT, IEEE MMMUT and the Robotics Club and register online.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events & Competitions — MMMUT Techfest 2026 | TechSrijan'27",
    description:
      "Robotics, coding, hackathons, design and management competitions at TechSrijan'27, the techfest of MMMUT Gorakhpur, 25–27 December 2026. Explore events by MMMUT RESO, SAE MMMUT, IEEE MMMUT and the Robotics Club and register online.",
    url: "/events",
    // A segment-level openGraph replaces the root one, so the default share image is repeated here
    images: ["/opengraph-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

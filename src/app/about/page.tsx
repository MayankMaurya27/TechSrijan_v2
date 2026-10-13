import type { Metadata } from "next";
import { AboutView } from "@/domains/about";

export const metadata: Metadata = {
  title: "About TechSrijan — MMMUT Gorakhpur's Techfest",
  description:
    "TechSrijan is the annual technical symposium of MMMUT Gorakhpur, conducted by the Technical Sub Council (TSC) with MMMUT RESO, SAE MMMUT, IEEE MMMUT and the Robotics Club. TechSrijan'27 — Imperium: Requiem — runs 25–27 December 2026.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | TechSrijan'27",
    description:
      "The story, mission and houses behind TechSrijan'27 — Imperium: Requiem, the annual technical fest of MMMUT Gorakhpur.",
    url: "/about",
    // A segment-level openGraph replaces the root one, so the default share image is repeated here
    images: ["/opengraph-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutView />;
}

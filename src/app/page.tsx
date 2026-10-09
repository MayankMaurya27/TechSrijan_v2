import type { Metadata } from "next";
import { ScrollJourney } from "@/domains/landing";

export const metadata: Metadata = {
  title: "TechSrijan'27 — IMPERIUM: REQUIEM | MMMUT",
  description: "North India's premier collegiate techno-management festival. Experience 120 FPS cinematic exploration, competitive arenas, hackathons, and symposiums at MMMUT Gorakhpur.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TechSrijan'27 — IMPERIUM: REQUIEM",
    description: "North India's premier collegiate techno-management festival at MMMUT Gorakhpur. Starts 25 Dec.",
    url: "/",
    siteName: "TechSrijan'27",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSrijan'27 — IMPERIUM: REQUIEM",
    description: "North India's premier collegiate techno-management festival at MMMUT Gorakhpur. Starts 25 Dec.",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Pure Full-Screen Scroll-Driven Cinematic Flight through Imperium Citadel */}
      <ScrollJourney />
    </>
  );
}

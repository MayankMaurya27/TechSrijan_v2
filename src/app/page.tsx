import type { Metadata } from "next";
import { ScrollJourney } from "@/domains/landing";

// Title/description/OG come from the root layout (they are written for the home page)
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
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

import { IntroGate } from "@/components/effects/intro-gate";
import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeTicker } from "@/components/landing/marquee-ticker";
import { CountdownHUD } from "@/components/landing/countdown-hud";
import { FlagshipHighlights } from "@/components/landing/flagship-highlights";

export default function LandingPage() {
  return (
    <>
      {/* Decryption Intro Layer */}
      <IntroGate />

      {/* Hero Visual Anchor */}
      <HeroSection />

      {/* Continuous Kinetic Divider */}
      <MarqueeTicker />

      {/* Live Synchronization Countdown HUD */}
      <CountdownHUD />

      {/* Flagship Directive Highlights */}
      <FlagshipHighlights />

      {/* Reverse Marquee Faction Strip */}
      <MarqueeTicker
        reverse
        items={[
          "ARRAKIS SECTOR 07",
          "GIEDI PRIME INFRARED",
          "BLACK KNIGHTS ORDER",
          "GEASS ACTIVATION",
          "MMMUT GORAKHPUR",
          "CASH POOL: ₹5,00,000+",
          "36-HOUR HACKATHON",
        ]}
      />
    </>
  );
}

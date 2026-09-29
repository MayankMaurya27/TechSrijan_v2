import { IntroGate } from "@/components/effects/intro-gate";
import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeTicker } from "@/components/landing/marquee-ticker";
import { CountdownHUD } from "@/components/landing/countdown-hud";
import { HoltzmanCylinder } from "@/components/landing/holtzman-cylinder";

export default function LandingPage() {
  return (
    <>
      {/* 3D WebGL Sandworm Emergence Sequence */}
      <IntroGate />

      {/* Hero Visual Display */}
      <HeroSection />

      {/* Kinetic Telemetry Divider */}
      <MarqueeTicker />

      {/* Synchronized 4-Digit T-Minus Countdown HUD */}
      <CountdownHUD />

      {/* 3D Holtzman Cylindrical Flagship Showcase */}
      <HoltzmanCylinder />

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

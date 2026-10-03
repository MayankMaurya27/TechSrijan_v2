"use client";

/**
 * ARCHIVED LANDING PAGE SECTIONS
 * Preserved here so they can be re-enabled or integrated whenever needed.
 */

import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeTicker } from "@/components/landing/marquee-ticker";
import { CountdownHUD } from "@/components/landing/countdown-hud";
import { HoltzmanCylinder } from "@/components/landing/holtzman-cylinder";

export function ArchivedLandingContent() {
  return (
    <div className="archived-landing-content">
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
    </div>
  );
}

export { HeroSection, MarqueeTicker, CountdownHUD, HoltzmanCylinder };

"use client";

import { useEffect, useState } from "react";
import { EventsHeroScroll, ClubEventsSection } from "@/domains/events";
import type { ClubId } from "@/domains/events";

export default function EventsPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeClubId, setActiveClubId] = useState<ClubId | null>(null);

  // Handle category and club selection from arena cards
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryId(categoryId);
  };

  const handleClubSelect = (clubId: ClubId) => {
    setActiveClubId(clubId);
  };

  const handleReturnToArena = () => {
    const lenis = (window as any).__lenis;
    const st = (window as any).ScrollTrigger?.getById?.("events-hero-scroll");
    if (st) {
      const arenaScroll = st.start + (st.end - st.start) * 0.65;
      if (lenis) {
        lenis.scrollTo(arenaScroll, {
          duration: 1.25,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: arenaScroll, behavior: "smooth" });
      }
      return;
    }
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Video Scrubber + Arena Spatial Cards + Stay-style Transition */}
      <EventsHeroScroll
        onCategorySelect={handleCategorySelect}
        onClubSelect={handleClubSelect}
      />

      {/* 2. Our Events Section — Dedicated, Full-Height, Zero Truncation, Uncut 3D Orbit */}
      <ClubEventsSection
        activeCategoryId={activeCategoryId}
        activeClubId={activeClubId}
        onReturnToArena={handleReturnToArena}
      />
    </div>
  );
}

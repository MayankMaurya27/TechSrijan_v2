"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/core";
import { EventsHeroScroll, ClubEventsSection } from "@/domains/events";
import type { ClubId } from "@/domains/events";

export default function EventsPage() {
  const { setTheme } = useTheme();
  const [activeClubId, setActiveClubId] = useState<ClubId | null>(null);

  // Automatically enforce the dark black & white monochrome theme on the events page
  useEffect(() => {
    setTheme("giedi-prime");
  }, [setTheme]);

  // Handle club selection from arena cards
  const handleClubSelect = (clubId: ClubId) => {
    setActiveClubId(clubId);
  };

  const handleReturnToArena = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Video Scrubber + Arena Spatial Cards + Stay-style Transition */}
      <EventsHeroScroll onClubSelect={handleClubSelect} />

      {/* 2. Our Events Section — Dedicated, Full-Height, Zero Truncation, Uncut 3D Orbit */}
      <ClubEventsSection
        activeClubId={activeClubId}
        onReturnToArena={handleReturnToArena}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/core";
import { EventsHeroScroll, ClubEventsSection } from "@/domains/events";
import type { ClubId } from "@/domains/events";

export default function EventsPage() {
  const { setTheme } = useTheme();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Automatically enforce the dark black & white monochrome theme on the events page
  useEffect(() => {
    setTheme("giedi-prime");
  }, [setTheme]);

  // Handle category selection from arena cards
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryId(categoryId);
  };

  const handleReturnToArena = () => {
    const lenis = (window as any).__lenis;
    const st = (window as any).ScrollTrigger?.getById?.("events-hero-scroll");
    if (st) {
      const arenaScroll = st.start + (st.end - st.start) * 0.65;
      if (lenis) {
        lenis.scrollTo(arenaScroll, { duration: 1.0 });
      } else {
        window.scrollTo({ top: arenaScroll, behavior: "smooth" });
      }
      return;
    }
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Video Scrubber + Arena Spatial Cards + Stay-style Transition */}
      <EventsHeroScroll onCategorySelect={handleCategorySelect} />

      {/* 2. Our Events Section — Dedicated, Full-Height, Zero Truncation, Uncut 3D Orbit */}
      <ClubEventsSection
        activeCategoryId={activeCategoryId}
        onReturnToArena={handleReturnToArena}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/core";
import { EventsHeroScroll, SpatialEventsGrid } from "@/domains/events";

import { ChevronDown, Database } from "lucide-react";

export default function EventsPage() {
  const { setTheme } = useTheme();
  const [showFullArchives, setShowFullArchives] = useState(false);

  // Automatically enforce the dark black & white monochrome theme on the events page
  useEffect(() => {
    setTheme("giedi-prime");
  }, [setTheme]);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Fast Scroll-Driven Video Journey & Spatial Arena Cards (Feyd-Rautha Hero -> Arena Crowd Scene) */}
      <EventsHeroScroll />

      {/* 2. Optional Collapsible Archive Database for all competitions */}
      <div id="arena-archives" className="relative z-30 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-24 pt-8 text-center">
          <div className="border-t border-white/10 pt-12 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowFullArchives(!showFullArchives)}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{showFullArchives ? "COLLAPSE ARCHIVES" : "EXPLORE ALL IMPERIUM ARCHIVES"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  showFullArchives ? "rotate-180" : ""
                }`}
              />
            </button>
            <p className="mt-3 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              // CODING • ROBOTICS • AEROSPACE • CIRCUITS • GAMING
            </p>

            {showFullArchives && (
              <div className="w-full mt-12 text-left animate-in fade-in duration-500">
                <SpatialEventsGrid />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

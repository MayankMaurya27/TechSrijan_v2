"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { isMobileDevice } from "@/lib/device-tier";

interface CitadelArchiveProps {
  scrollProgress: number;
}

const FEATURED_DIRECTIVES = [
  {
    id: "01",
    title: "CODE//FORGE",
    meta: "25 SEP · 10:30 · CSE BLOCK",
    category: "TECHNOLOGY",
    link: "/events",
  },
  {
    id: "02",
    title: "CIRCUIT//BREAK",
    meta: "25 SEP · 14:00 · TECH ARENA",
    category: "COMPETITION",
    link: "/events",
  },
  {
    id: "03",
    title: "DESIGN//SHIFT",
    meta: "26 SEP · 11:00 · DESIGN DOME",
    category: "CREATIVE",
    link: "/events",
  },
  {
    id: "04",
    title: "ROBOT//ASCENT",
    meta: "27 SEP · 15:30 · CENTRAL ARENA",
    category: "ROBOTICS",
    link: "/events",
  },
];

const ALLIANCE_NODES = [
  { id: "A1", label: "ALLIANCE I", x: 50, y: 18, roman: "I", tier: "APEX PATRON" },
  { id: "A2", label: "ALLIANCE II", x: 22, y: 44, roman: "II", tier: "ORBITAL NODE" },
  { id: "A3", label: "ALLIANCE III", x: 50, y: 46, roman: "III", tier: "NUCLEUS" },
  { id: "A4", label: "ALLIANCE IV", x: 78, y: 44, roman: "IV", tier: "ORBITAL NODE" },
  { id: "A5", label: "ALLIANCE V", x: 50, y: 76, roman: "V", tier: "FOUNDATION" },
];

const TRANSMISSIONS = [
  {
    id: "01",
    quote: "TECHSRIJAN FELT LESS LIKE AN EVENT AND MORE LIKE ENTERING ANOTHER WORLD.",
    author: "ARYAN VERMA",
    dept: "CSE · MMMUT",
    year: "PILGRIM '25",
  },
  {
    id: "02",
    quote: "THE MONUMENTAL SCALE OF IMPERIUM AND TECHNICAL RIGOR OF THE ARENAS IS UNRIVALED.",
    author: "SNEHA MISHRA",
    dept: "ECE · MMMUT",
    year: "CHAMPION '25",
  },
  {
    id: "03",
    quote: "FROM HARDWARE HACKATHONS TO THE ROBOTIC DRIFTS, EVERY SECOND WAS PURE ADRENALINE.",
    author: "ROHAN SINGH",
    dept: "IT · MMMUT",
    year: "TEAM LEAD '26",
  },
  {
    id: "04",
    quote: "A MASTERCLASS IN TECHNICAL EXECUTION, WORLD-BUILDING, AND ARCHITECTURAL SCALE.",
    author: "ANANYA TRIPATHI",
    dept: "EE · MMMUT",
    year: "FINALIST '25",
  },
  {
    id: "05",
    quote: "AN UNFORGETTABLE PILGRIMAGE FOR EVERY ENGINEER DARING TO CONQUER THE FUTURE.",
    author: "ADITYA PANDEY",
    dept: "ME · MMMUT",
    year: "INNOVATOR '26",
  },
];

const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min));
  return x * x * (3 - 2 * x);
};

export function CitadelArchive({ scrollProgress }: CitadelArchiveProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [hoveredAlliance, setHoveredAlliance] = useState<string | null>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () =>
      isMobileDevice() || (typeof window !== "undefined" && window.innerWidth < 1024);
    setIsMobile(checkMobile());
    const onResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Subtle mouse parallax tilt for 3D perspective scene on desktop
  useEffect(() => {
    if (isMobile) return;
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w > 0 && h > 0) {
        const rotY = ((e.clientX / w) - 0.5) * 2.6;
        const rotX = -((e.clientY / h) - 0.5) * 2.0;
        setMouseTilt({ x: rotX, y: rotY });
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [isMobile]);

  // Testimonial auto-carousel (6 seconds cycle, pauses on user interaction)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to active card on mobile (centers card exactly in track)
  const scrollToMobileCard = (index: number) => {
    setActiveMobileCard(index);
    if (mobileTrackRef.current) {
      const child = mobileTrackRef.current.children[index] as HTMLElement;
      if (child) {
        const track = mobileTrackRef.current;
        const targetScrollLeft =
          child.offsetLeft - (track.clientWidth - child.offsetWidth) / 2;
        track.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  // Sync active mobile card indicator on touch swipe using exact centers
  const onMobileTrackScroll = () => {
    if (!mobileTrackRef.current) return;
    const track = mobileTrackRef.current;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const children = Array.from(track.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(trackCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveMobileCard(closestIndex);
  };

  // Check if active on screen (starts earlier on mobile to align with arrival)
  const isVisible = scrollProgress >= (isMobile ? 0.76 : 0.80);

  // Progressive Emergence Curve:
  // Mobile flight completes at 0.80, so mobile cards start revealing at 0.77 and settle by 0.86
  // Desktop flight finishes at 0.82, so desktop slabs start revealing at 0.81 and settle by 0.89
  const pStart = isMobile ? 0.77 : 0.81;
  const pSettle = isMobile ? 0.86 : 0.89;

  const phaseA = smoothstep(pStart, pStart + 0.04, scrollProgress);
  const phaseB = smoothstep(pStart + 0.02, pSettle, scrollProgress);

  // Phase C staggered content reveals
  const contentEvents = smoothstep(pStart + 0.02, pSettle, scrollProgress);
  const contentSponsors = smoothstep(pStart + 0.03, pSettle, scrollProgress);
  const contentTrans = smoothstep(pStart + 0.04, pSettle, scrollProgress);

  // Overall master container opacity
  const containerOpacity = smoothstep(pStart, pStart + 0.05, scrollProgress);

  // Physical emergence transforms for the frames (Phase B)
  const emergeY = (1 - phaseB) * 60; // 60px -> 0px
  const emergeZ = (1 - phaseB) * -60; // -60px -> 0px
  const frameAlpha = phaseB;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-center overflow-hidden"
      style={{
        opacity: isVisible ? containerOpacity : 0,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: isVisible && containerOpacity > 0.4 ? "auto" : "none",
        perspective: isMobile ? "none" : "1600px",
        transformStyle: isMobile ? "flat" : "preserve-3d",
      }}
    >
      {/* ─── PHASE A: Subtle Architectural Guide Lines & Ticks ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: phaseA * 0.35 }}
      >
        <div className="absolute top-[6%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />
        <div className="absolute bottom-[6%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />

        <div className="absolute top-[6.5%] left-8 text-[9px] font-mono tracking-[0.25em] text-[#d4a843]/45 hidden sm:block">
          SEC // 07 · LAT 26.738°N · CITADEL NETWORK
        </div>
        <div className="absolute top-[6.5%] right-8 text-[9px] font-mono tracking-[0.25em] text-[#d4a843]/45 hidden sm:block">
          SYS // ARCHIVE_V27 · SYNC: OPTIMAL
        </div>
        <div className="absolute bottom-[6.5%] right-8 text-[9px] font-mono tracking-[0.25em] text-[#d4a843]/35 hidden sm:block">
          ◈ FREMEN PROTOCOL ACTIVE
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE EXPERIENCE: 3 HORIZONTALLY ALIGNED CARDS (CAROUSEL)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col justify-start items-center pt-14 sm:pt-16 px-2 pointer-events-auto">
          {/* Top Arrakis HUD Tab Selector */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-full border border-[#d4a843]/30 bg-black/80 backdrop-blur-md z-30 mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
            {[
              { label: "DIRECTIVES", idx: 0 },
              { label: "ALLIANCES", idx: 1 },
              { label: "VOICES", idx: 2 },
            ].map((tab) => (
              <button
                key={tab.idx}
                type="button"
                onClick={() => scrollToMobileCard(tab.idx)}
                className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.16em] uppercase transition-all duration-300 ${
                  activeMobileCard === tab.idx
                    ? "bg-[#d4a843] text-black font-bold shadow-[0_0_12px_rgba(212,168,67,0.7)]"
                    : "text-[#c4b79b]/70 hover:text-[#F0EAE1]"
                }`}
              >
                0{tab.idx + 1} {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Track Container with Little Floating Navigation Arrows on Left/Right */}
          <div className="relative w-full flex items-center justify-center">
            {/* Left Chevron Arrow Button (visible when not on first card) */}
            {activeMobileCard > 0 && (
              <button
                type="button"
                onClick={() => scrollToMobileCard(activeMobileCard - 1)}
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#d4a843]/60 bg-black/85 backdrop-blur-md flex items-center justify-center text-[#ffd685] shadow-[0_0_12px_rgba(212,168,67,0.5)] active:scale-90 transition-all"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-4 w-4 text-[#ffd685]" />
              </button>
            )}

            {/* Right Chevron Arrow Button (visible so user can see and go to other boxes) */}
            {activeMobileCard < 2 && (
              <button
                type="button"
                onClick={() => scrollToMobileCard(activeMobileCard + 1)}
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#d4a843]/60 bg-black/85 backdrop-blur-md flex items-center justify-center text-[#ffd685] shadow-[0_0_12px_rgba(212,168,67,0.5)] active:scale-90 transition-all animate-pulse"
                aria-label="Next card"
              >
                <ChevronRight className="h-4 w-4 text-[#ffd685]" />
              </button>
            )}

            {/* Horizontal Track of 3 Aligned Cards */}
            <div
              ref={mobileTrackRef}
              onScroll={onMobileTrackScroll}
              className="w-full flex flex-row items-center gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[11vw] py-1 pointer-events-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* ─── MOBILE CARD 1: FEATURED DIRECTIVES ─── */}
              <div className="archive-card pointer-events-auto relative w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center transition-transform duration-300">
                <div className="absolute inset-[8%] bg-gradient-to-b from-black/70 via-[#1a120c]/75 to-black/85 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />
                <img
                  src="/images/citadel-frame.webp"
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div
                  className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[16%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]"
                  style={{ opacity: contentEvents }}
                >
                  {/* Header info */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d4a843] uppercase">
                        CITADEL INDEX
                      </span>
                      <span className="text-[7.5px] font-mono tracking-widest text-[#d4a843]/60">
                        04 DIRECTIVES
                      </span>
                    </div>
                    <h3 className="text-[12px] sm:text-[13px] font-serif tracking-[0.14em] uppercase text-[#F0EAE1] mt-0.5 leading-none">
                      FEATURED DIRECTIVES
                    </h3>
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-[#c4b79b] mt-0.5 leading-tight truncate">
                      Choose your route into Techsrijan’27.
                    </p>
                  </div>

                  {/* 4 Compact Event Rows */}
                  <div className="flex-1 flex flex-col justify-evenly py-0.5 gap-0.5 min-h-0">
                    {FEATURED_DIRECTIVES.map((ev) => (
                      <Link
                        key={ev.id}
                        href={ev.link}
                        className="group relative flex items-center justify-between py-1 px-2 rounded border border-[#d4a843]/20 bg-black/60 hover:bg-[#d4a843]/15 transition-all"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[9px] text-[#d4a843] font-bold">
                            {ev.id}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-serif text-[9.5px] font-semibold tracking-wider text-[#F0EAE1] truncate">
                              {ev.title}
                            </span>
                            <span className="font-mono text-[6.5px] sm:text-[7px] text-[#a89b88] tracking-wider truncate">
                              {ev.meta}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-2.5 w-2.5 text-[#d4a843] opacity-60 flex-shrink-0 ml-1" />
                      </Link>
                    ))}
                  </div>

                  {/* Bottom Action — EXPLORE ALL EVENTS is guaranteed fully visible inside safe area */}
                  <div className="flex-shrink-0">
                    <Link
                      href="/events"
                      className="group flex items-center justify-center gap-1.5 w-full py-1 px-2.5 rounded border border-[#d4a843]/60 bg-[#d4a843]/25 hover:bg-[#d4a843]/40 text-[#F0EAE1] font-mono text-[8px] tracking-[0.2em] uppercase transition-all shadow-[0_0_10px_rgba(212,168,67,0.3)]"
                    >
                      <span>EXPLORE ALL EVENTS</span>
                      <ArrowRight className="h-2.5 w-2.5 text-[#d4a843]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ─── MOBILE CARD 2: THE ALLIANCES ─── */}
              <div className="archive-card pointer-events-auto relative w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center transition-transform duration-300">
                <div className="absolute inset-[8%] bg-gradient-to-b from-black/70 via-[#1a120c]/75 to-black/85 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />
                <img
                  src="/images/citadel-frame.webp"
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div
                  className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[16%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]"
                  style={{ opacity: contentSponsors }}
                >
                  <div className="flex-shrink-0">
                    <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d4a843] uppercase block">
                      CITADEL ARCHIVE
                    </span>
                    <h3 className="text-[12px] sm:text-[13px] font-serif tracking-[0.14em] uppercase text-[#F0EAE1] mt-0.5 leading-none">
                      THE ALLIANCES
                    </h3>
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-[#c4b79b] mt-0.5 leading-tight truncate">
                      Those who power the awakening.
                    </p>
                  </div>

                  {/* Constellation / Orbital Arrangement */}
                  <div className="relative my-auto w-full h-[70px] sm:h-[78px] flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <circle cx="50%" cy="46%" r="38%" fill="none" stroke="#d4a843" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="50%" cy="46%" r="20%" fill="none" stroke="#d4a843" strokeWidth="0.8" />
                      <line x1="50%" y1="18%" x2="22%" y2="44%" stroke="#d4a843" strokeWidth="0.8" />
                      <line x1="50%" y1="18%" x2="78%" y2="44%" stroke="#d4a843" strokeWidth="0.8" />
                      <line x1="22%" y1="44%" x2="50%" y2="46%" stroke="#d4a843" strokeWidth="0.8" />
                      <line x1="78%" y1="44%" x2="50%" y2="46%" stroke="#d4a843" strokeWidth="0.8" />
                      <line x1="50%" y1="46%" x2="50%" y2="76%" stroke="#d4a843" strokeWidth="0.8" />
                    </svg>

                    {ALLIANCE_NODES.map((node) => {
                      const isHover = hoveredAlliance === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setHoveredAlliance(node.id)}
                          className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
                          style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            zIndex: isHover ? 30 : 15,
                          }}
                        >
                          <div
                            className="w-4.5 h-4.5 rounded-full border border-[#d4a843] bg-[#2a1b12]/90 flex items-center justify-center text-[#d4a843] transition-all"
                            style={{
                              boxShadow: isHover
                                ? "0 0 10px rgba(212, 168, 67, 0.8)"
                                : "0 0 5px rgba(212, 168, 67, 0.3)",
                            }}
                          >
                            <span className="text-[7.5px] font-serif font-bold">
                              {node.roman}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center font-mono text-[7px] tracking-widest text-[#d4a843] uppercase min-h-[10px] flex-shrink-0">
                    {hoveredAlliance
                      ? `${ALLIANCE_NODES.find((n) => n.id === hoveredAlliance)?.label}`
                      : "◈ 5 STRATEGIC SYNDICATES"}
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      href="/sponsors"
                      className="group flex items-center justify-center gap-1.5 w-full py-1 px-2.5 rounded border border-[#d4a843]/40 bg-[#d4a843]/15 hover:bg-[#d4a843]/30 text-[#F0EAE1] font-mono text-[8px] tracking-[0.2em] uppercase transition-all"
                    >
                      <span>VIEW ALL ALLIANCES</span>
                      <ArrowRight className="h-2.5 w-2.5 text-[#d4a843]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ─── MOBILE CARD 3: VOICES FROM WITHIN ─── */}
              <div
                className="archive-card pointer-events-auto relative w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center transition-transform duration-300"
                onTouchStart={() => {
                  isPausedRef.current = true;
                }}
                onTouchEnd={() => {
                  isPausedRef.current = false;
                }}
              >
                <div className="absolute inset-[8%] bg-gradient-to-b from-black/70 via-[#1a120c]/75 to-black/85 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />
                <img
                  src="/images/citadel-frame.webp"
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div
                  className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[16%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]"
                  style={{ opacity: contentTrans }}
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d4a843] uppercase">
                        TRANSMISSION // 07
                      </span>
                      <span className="text-[7.5px] font-mono tracking-widest text-[#d4a843]/60">
                        {TRANSMISSIONS[activeQuoteIndex].id} / 05
                      </span>
                    </div>
                    <h3 className="text-[13px] sm:text-sm font-serif tracking-[0.14em] uppercase text-[#F0EAE1] mt-0.5 leading-none">
                      VOICES FROM WITHIN
                    </h3>
                  </div>

                  <div className="my-auto py-1 flex flex-col justify-center min-h-[46px]">
                    <p className="text-[8.5px] sm:text-[9px] font-serif uppercase tracking-wider text-[#F0EAE1] leading-relaxed italic pl-2 border-l border-[#d4a843]/40 line-clamp-3">
                      “{TRANSMISSIONS[activeQuoteIndex].quote}”
                    </p>
                    <div className="mt-1 pl-2 flex items-center gap-1 flex-wrap">
                      <span className="text-[8px] font-mono font-bold text-[#d4a843] tracking-wider uppercase">
                        — {TRANSMISSIONS[activeQuoteIndex].author}
                      </span>
                      <span className="text-[7px] font-mono text-[#a89b88] tracking-widest uppercase truncate">
                        · {TRANSMISSIONS[activeQuoteIndex].dept}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pt-0.5 flex items-center justify-between border-t border-[#d4a843]/20">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveQuoteIndex(
                          (prev) => (prev - 1 + TRANSMISSIONS.length) % TRANSMISSIONS.length
                        )
                      }
                      className="p-1 rounded text-[#d4a843]/70 hover:text-[#ffd685]"
                      aria-label="Previous transmission"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {TRANSMISSIONS.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveQuoteIndex(i)}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i === activeQuoteIndex
                              ? "w-3 bg-[#d4a843] shadow-[0_0_6px_rgba(212,168,67,0.7)]"
                              : "w-1 bg-[#d4a843]/30 hover:bg-[#d4a843]/60"
                          }`}
                          aria-label={`Go to transmission ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length)
                      }
                      className="p-1 rounded text-[#d4a843]/70 hover:text-[#ffd685]"
                      aria-label="Next transmission"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* DESKTOP EXPERIENCE: MONUMENTAL 3D ARCHIVE STAGE              */
        /* ───────────────────────────────────────────────────────────── */
        <div
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none h-[76vh] max-h-[590px] min-h-[460px] translate-y-6 sm:translate-y-8"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* CARD #1 — EVENTS (Primary Module: Image 4 Box)               */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div
            className="archive-card pointer-events-auto transition-transform duration-300 absolute left-[19%] lg:left-[21%] xl:left-[23%] top-0 h-full w-[35vw] max-w-[405px] min-w-[290px]"
            style={{
              transform: `translate3d(0, ${emergeY}px, ${30 + emergeZ}px) rotateY(${
                1.5 + mouseTilt.y * 0.4
              }deg) rotateX(${0.5 + mouseTilt.x * 0.4}deg)`,
              transformStyle: "preserve-3d",
              opacity: frameAlpha,
            }}
          >
            {/* Desert-ambience backing */}
            <div className="absolute inset-[8%] bg-gradient-to-b from-black/60 via-[#1a120c]/65 to-black/80 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />

            {/* Asset 3 Architectural Frame */}
            <img
              src="/images/citadel-frame.webp"
              alt=""
              className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
              loading="eager"
            />

            {/* Card Content — Comfortably padded inside frame safe area so text never clips */}
            <div
              className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[21%] pb-[19%] px-[15%] pointer-events-auto text-[#F0EAE1]"
              style={{
                opacity: contentEvents,
                transform: `translateZ(24px) translateY(${(1 - contentEvents) * 12}px)`,
                transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
              }}
            >
              {/* Header info */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4a843] uppercase">
                    CITADEL INDEX
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#d4a843]/60">
                    04 DIRECTIVES
                  </span>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-serif tracking-[0.16em] uppercase text-[#F0EAE1] mt-0.5 leading-tight text-shadow-gold">
                  FEATURED DIRECTIVES
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono text-[#c4b79b] mt-0.5 tracking-wide">
                  Choose your route into Techsrijan’27.
                </p>
              </div>

              {/* 4 Compact Event Rows — evenly distributed across safe height */}
              <div className="flex-1 flex flex-col justify-evenly py-2 gap-1.5 sm:gap-2">
                {FEATURED_DIRECTIVES.map((ev) => {
                  const isHover = hoveredEvent === ev.id;
                  return (
                    <Link
                      key={ev.id}
                      href={ev.link}
                      onMouseEnter={() => setHoveredEvent(ev.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className="group relative flex items-center justify-between py-2 px-2.5 rounded border border-[#d4a843]/20 bg-black/60 hover:bg-[#d4a843]/15 hover:border-[#d4a843]/70 transition-all duration-200"
                      style={{
                        transform: isHover ? "translateZ(8px) scale(1.01)" : "translateZ(0)",
                        boxShadow: isHover
                          ? "0 4px 16px rgba(212, 168, 67, 0.25), inset 0 0 12px rgba(212, 168, 67, 0.15)"
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] sm:text-[11px] text-[#d4a843] font-bold">
                          {ev.id}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif text-[11px] sm:text-xs font-semibold tracking-wider text-[#F0EAE1] group-hover:text-[#ffd685] transition-colors truncate">
                            {ev.title}
                          </span>
                          <span className="font-mono text-[8px] sm:text-[9px] text-[#a89b88] tracking-wider truncate">
                            {ev.meta}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                        <span className="hidden xs:inline-block text-[7px] sm:text-[8px] font-mono tracking-widest px-1 py-0.5 rounded border border-[#d4a843]/30 text-[#d4a843] bg-black/50 uppercase">
                          {ev.category}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#d4a843] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Action — Safely elevated above bottom frame ornamentation */}
              <div className="flex-shrink-0 pt-1">
                <Link
                  href="/events"
                  className="group relative flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded border border-[#d4a843]/50 bg-[#d4a843]/15 hover:bg-[#d4a843]/30 hover:border-[#d4a843] text-[#F0EAE1] font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(212,168,67,0.2)] hover:shadow-[0_0_20px_rgba(212,168,67,0.45)]"
                >
                  <span>EXPLORE ALL EVENTS</span>
                  <ArrowRight className="h-3 w-3 text-[#d4a843] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: 2 SEPARATE BOXES                                */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div
            className="pointer-events-none absolute right-[18.5%] lg:right-[19.5%] xl:right-[20.5%] top-0 h-full w-[22vw] max-w-[275px] min-w-[210px] flex flex-col justify-between gap-3 sm:gap-3.5"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* ───────────────────────────────────────────────────────────── */}
            {/* BOX 1 (TOP): THE ALLIANCES                                   */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div
              className="archive-card pointer-events-auto transition-transform duration-300 relative flex-1 w-full"
              style={{
                transform: `translate3d(0, ${emergeY}px, ${24 + emergeZ}px) rotateY(${
                  -1.5 + mouseTilt.y * 0.4
                }deg) rotateX(${0.5 + mouseTilt.x * 0.4}deg)`,
                transformStyle: "preserve-3d",
                opacity: frameAlpha,
              }}
            >
              {/* Desert-ambience backing */}
              <div className="absolute inset-[8%] bg-gradient-to-b from-black/60 via-[#1a120c]/65 to-black/80 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />

              {/* Asset 3 Architectural Frame */}
              <img
                src="/images/citadel-frame.webp"
                alt=""
                className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                loading="eager"
              />

              {/* Content */}
              <div
                className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[20%] pb-[17%] px-[15%] pointer-events-auto text-[#F0EAE1]"
                style={{
                  opacity: contentSponsors,
                  transform: `translateZ(18px) translateY(${(1 - contentSponsors) * 12}px)`,
                  transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4a843] uppercase block">
                    CITADEL ARCHIVE
                  </span>
                  <h3 className="text-sm sm:text-base font-serif tracking-[0.16em] uppercase text-[#F0EAE1] mt-0.5 leading-tight">
                    THE ALLIANCES
                  </h3>
                  <p className="text-[8px] sm:text-[9px] font-mono text-[#c4b79b] tracking-wide">
                    Those who power the awakening.
                  </p>
                </div>

                {/* Constellation / Orbital Arrangement */}
                <div className="relative my-auto w-full h-[70px] sm:h-[85px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <circle
                      cx="50%"
                      cy="46%"
                      r="38%"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="50%"
                      cy="46%"
                      r="20%"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="0.8"
                    />
                    <line x1="50%" y1="18%" x2="22%" y2="44%" stroke="#d4a843" strokeWidth="0.8" />
                    <line x1="50%" y1="18%" x2="78%" y2="44%" stroke="#d4a843" strokeWidth="0.8" />
                    <line x1="22%" y1="44%" x2="50%" y2="46%" stroke="#d4a843" strokeWidth="0.8" />
                    <line x1="78%" y1="44%" x2="50%" y2="46%" stroke="#d4a843" strokeWidth="0.8" />
                    <line x1="50%" y1="46%" x2="50%" y2="76%" stroke="#d4a843" strokeWidth="0.8" />
                  </svg>

                  {ALLIANCE_NODES.map((node) => {
                    const isHover = hoveredAlliance === node.id;
                    return (
                      <div
                        key={node.id}
                        onMouseEnter={() => setHoveredAlliance(node.id)}
                        onMouseLeave={() => setHoveredAlliance(null)}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                          zIndex: isHover ? 30 : 15,
                        }}
                      >
                        <div
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border border-[#d4a843] bg-[#2a1b12]/90 flex items-center justify-center text-[#d4a843] transition-all duration-300 shadow-[0_0_8px_rgba(212,168,67,0.3)] group-hover:scale-115 group-hover:border-[#ffd685] group-hover:bg-[#3d2719]"
                          style={{
                            boxShadow: isHover
                              ? "0 0 14px rgba(212, 168, 67, 0.8), inset 0 0 6px rgba(212, 168, 67, 0.5)"
                              : "0 0 6px rgba(212, 168, 67, 0.3)",
                          }}
                        >
                          <span className="text-[8px] sm:text-[9px] font-serif font-bold tracking-tight">
                            {node.roman}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic status info */}
                <div className="text-center font-mono text-[7px] sm:text-[8px] tracking-widest text-[#d4a843] uppercase min-h-[12px] flex-shrink-0">
                  {hoveredAlliance
                    ? `${ALLIANCE_NODES.find((n) => n.id === hoveredAlliance)?.label} · ${
                        ALLIANCE_NODES.find((n) => n.id === hoveredAlliance)?.tier
                      }`
                    : "◈ 5 STRATEGIC SYNDICATES"}
                </div>

                {/* Bottom Action */}
                <div className="flex-shrink-0 pt-0.5">
                  <Link
                    href="/sponsors"
                    className="group flex items-center justify-center gap-1.5 w-full py-1 px-2 rounded border border-[#d4a843]/40 bg-[#d4a843]/10 hover:bg-[#d4a843]/25 hover:border-[#d4a843] text-[#F0EAE1] font-mono text-[8px] sm:text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
                  >
                    <span>VIEW ALL ALLIANCES</span>
                    <ArrowRight className="h-2.5 w-2.5 text-[#d4a843] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* BOX 2 (BOTTOM): VOICES FROM WITHIN                           */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div
              className="archive-card pointer-events-auto transition-transform duration-300 relative flex-1 w-full"
              style={{
                transform: `translate3d(0, ${emergeY}px, ${20 + emergeZ}px) rotateY(${
                  -1.2 + mouseTilt.y * 0.4
                }deg) rotateX(${-0.5 + mouseTilt.x * 0.4}deg)`,
                transformStyle: "preserve-3d",
                opacity: frameAlpha,
              }}
              onMouseEnter={() => {
                isPausedRef.current = true;
              }}
              onMouseLeave={() => {
                isPausedRef.current = false;
              }}
            >
              {/* Desert-ambience backing */}
              <div className="absolute inset-[8%] bg-gradient-to-b from-black/60 via-[#1a120c]/65 to-black/80 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />

              {/* Asset 3 Architectural Frame */}
              <img
                src="/images/citadel-frame.webp"
                alt=""
                className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                loading="eager"
              />

              {/* Content */}
              <div
                className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[20%] pb-[17%] px-[15%] pointer-events-auto text-[#F0EAE1]"
                style={{
                  opacity: contentTrans,
                  transform: `translateZ(18px) translateY(${(1 - contentTrans) * 12}px)`,
                  transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4a843] uppercase">
                      TRANSMISSION // 07
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-[#d4a843]/60">
                      {TRANSMISSIONS[activeQuoteIndex].id} / 05
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-serif tracking-[0.16em] uppercase text-[#F0EAE1] mt-0.5 leading-tight">
                    VOICES FROM WITHIN
                  </h3>
                </div>

                {/* Quote Body */}
                <div className="my-auto py-0.5 flex flex-col justify-center min-h-[46px]">
                  <p className="text-[9px] sm:text-[10px] font-serif uppercase tracking-wider text-[#F0EAE1] leading-tight italic pl-2 border-l border-[#d4a843]/40 line-clamp-3">
                    “{TRANSMISSIONS[activeQuoteIndex].quote}”
                  </p>
                  <div className="mt-1 pl-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-[#d4a843] tracking-wider uppercase">
                      — {TRANSMISSIONS[activeQuoteIndex].author}
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-mono text-[#a89b88] tracking-widest uppercase truncate">
                      · {TRANSMISSIONS[activeQuoteIndex].dept}
                    </span>
                  </div>
                </div>

                {/* Carousel Navigation */}
                <div className="flex-shrink-0 pt-0.5 flex items-center justify-between border-t border-[#d4a843]/20">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveQuoteIndex(
                        (prev) => (prev - 1 + TRANSMISSIONS.length) % TRANSMISSIONS.length
                      )
                    }
                    className="p-0.5 rounded text-[#d4a843]/70 hover:text-[#ffd685] transition-colors"
                    aria-label="Previous transmission"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    {TRANSMISSIONS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveQuoteIndex(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === activeQuoteIndex
                            ? "w-3.5 bg-[#d4a843] shadow-[0_0_6px_rgba(212,168,67,0.7)]"
                            : "w-1 bg-[#d4a843]/30 hover:bg-[#d4a843]/60"
                        }`}
                        aria-label={`Go to transmission ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length)
                    }
                    className="p-0.5 rounded text-[#d4a843]/70 hover:text-[#ffd685] transition-colors"
                    aria-label="Next transmission"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

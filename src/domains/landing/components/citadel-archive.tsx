"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { isMobileDevice } from "@/core";
import { api } from "@/lib/api";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

const CITADEL_FRAME = getOptimizedImageUrl("/images/citadel-frame.webp", 700);


interface CitadelArchiveProps {
  scrollProgress: number;
}

const FEATURED_DIRECTIVES = [
  {
    id: "01",
    title: "CODING & ALGORITHMS",
    meta: "MANTRASTRA · CODE ZILLA · INCOGNITO",
    category: "SOFTWARE",
    link: "/events",
  },
  {
    id: "02",
    title: "ROBOTICS & COMBAT",
    meta: "ROBOKIRTI · ROBOSOCCER · HYDRORACER",
    category: "ROBOTICS",
    link: "/events",
  },
  {
    id: "03",
    title: "INNOVATION & CIRCUITS",
    meta: "SCIENCE EXHIBITION · BRAINS & BRAWN",
    category: "RESEARCH",
    link: "/events",
  },
  {
    id: "04",
    title: "ARENA & COSPLAY",
    meta: "VAIL · MR & MRS TECHSRIJAN · SHERLOCKED",
    category: "FLAGSHIP",
    link: "/events",
  },
];

const SPONSORS_SHOWCASE = [
  {
    id: "nova",
    name: "NOVA SYSTEMS",
    tier: "TITLE SPONSOR",
    tagline: "Apex Strategic Patron",
    image: getOptimizedImageUrl("/images/sponsors/cp-1.webp", 400),
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.9)",
  },
  {
    id: "aether",
    name: "AETHER ENERGY",
    tier: "GOLD SPONSOR",
    tagline: "Energy Syndicate Partner",
    image: getOptimizedImageUrl("/images/sponsors/cp-2.webp", 400),
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.9)",
  },
  {
    id: "quantum",
    name: "QUANTUM WORKS",
    tier: "SILVER SPONSOR",
    tagline: "High-Compute Architecture Partner",
    image: getOptimizedImageUrl("/images/sponsors/cp-6.webp", 400),
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.9)",
  },
  {
    id: "gridline",
    name: "GRIDLINE MEDIA",
    tier: "ASSOCIATE SPONSOR",
    tagline: "Digital & Broadcast Syndicate",
    image: getOptimizedImageUrl("/images/sponsors/cp-5.webp", 400),
    accent: "#EF4444",
    glow: "rgba(239, 68, 68, 0.9)",
  },
  {
    id: "skyward",
    name: "SKYWARD LABS",
    tier: "SUPPORTING SPONSOR",
    tagline: "Innovation & Labs Patron",
    image: getOptimizedImageUrl("/images/sponsors/cp-4.webp", 400),
    accent: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.9)",
  },
];

const TRANSMISSIONS = [
  {
    id: "01",
    quote: "TechSrijan felt less like an event and more like entering another world.",
    author: "ARYAN VERMA",
    dept: "CSE · MMMUT",
    year: "PILGRIM '25",
  },
  {
    id: "02",
    quote: "The monumental scale of Imperium and technical rigor of the arenas is unrivaled.",
    author: "SNEHA MISHRA",
    dept: "ECE · MMMUT",
    year: "CHAMPION '25",
  },
  {
    id: "03",
    quote: "From hardware hackathons to the robotic drifts, every second was pure adrenaline.",
    author: "ROHAN SINGH",
    dept: "IT · MMMUT",
    year: "TEAM LEAD '26",
  },
  {
    id: "04",
    quote: "A masterclass in technical execution, world-building, and architectural scale.",
    author: "ANANYA TRIPATHI",
    dept: "EE · MMMUT",
    year: "FINALIST '25",
  },
  {
    id: "05",
    quote: "An unforgettable pilgrimage for every engineer daring to conquer the future.",
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
  const [activeSponsorIndex, setActiveSponsorIndex] = useState(0);
  const [isSponsorPaused, setIsSponsorPaused] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  // Dynamic Backend Sourced Events and Sponsors with Curated Baseline Fallbacks
  const [eventsList, setEventsList] = useState(FEATURED_DIRECTIVES);
  const [sponsorsList, setSponsorsList] = useState(SPONSORS_SHOWCASE);

  useEffect(() => {
    // 1. Fetch live events and map into Featured Directives
    api.events
      .list()
      .then((res) => {
        if (res && res.length > 0) {
          const codingEvs = res.filter((e) => e.category === "TECHNICAL").map((e) => e.title);
          const roboEvs = res.filter((e) => e.category === "ROBOTICS").map((e) => e.title);
          const gamingEvs = res.filter((e) => e.category === "GAMING").map((e) => e.title);
          const mgmtEvs = res.filter((e) => e.category === "MANAGEMENT" || e.category === "WORKSHOP").map((e) => e.title);

          const updatedDirectives = [
            {
              id: "01",
              title: "TECHNICAL & CODING",
              meta: (codingEvs.length > 0 ? codingEvs.slice(0, 3).join(" · ") : "MANTRASTRA · CODE ZILLA · ALGOSTRIKE").toUpperCase(),
              category: "TECHNICAL",
              link: "/events",
            },
            {
              id: "02",
              title: "ROBOTICS & COMBAT",
              meta: (roboEvs.length > 0 ? roboEvs.slice(0, 3).join(" · ") : "ROBOKIRTI · ROBOWARS · DRONE LEAGUE").toUpperCase(),
              category: "ROBOTICS",
              link: "/events",
            },
            {
              id: "03",
              title: "GAMING & ARENA",
              meta: (gamingEvs.length > 0 ? gamingEvs.slice(0, 3).join(" · ") : "VALORANT CLASH · BGMI ARENA").toUpperCase(),
              category: "GAMING",
              link: "/events",
            },
            {
              id: "04",
              title: "MANAGEMENT & INNOVATION",
              meta: (mgmtEvs.length > 0 ? mgmtEvs.slice(0, 3).join(" · ") : "BIZ CONCLAVE · SCIENCE EXHIBITION").toUpperCase(),
              category: "MANAGEMENT",
              link: "/events",
            },
          ];
          setEventsList(updatedDirectives);
        }
      })
      .catch(() => {});

    // 2. Fetch live sponsors and map into Sponsors Showcase
    api.sponsors
      .list()
      .then((res) => {
        if (res && res.length > 0) {
          const accents = ["#FFE600", "#F59E0B", "#38BDF8", "#EF4444", "#06B6D4"];
          const mapped = res.map((s, idx) => ({
            id: s.id,
            name: s.name.toUpperCase(),
            tier: s.category ? `${s.category.replace(/_/g, " ")} SPONSOR` : "OFFICIAL SPONSOR",
            tagline: s.websiteUrl ? s.websiteUrl.replace(/^https?:\/\//, "") : "Strategic Citadel Partner",
            image: getOptimizedImageUrl(s.logoUrl || `/images/sponsors/cp-${(idx % 6) + 1}.webp`, 400),
            accent: accents[idx % accents.length],
            glow: "rgba(245, 158, 11, 0.9)",
          }));
          setSponsorsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Active sponsor computed
  const activeSponsor = sponsorsList[activeSponsorIndex] || sponsorsList[0];

  // Sponsors auto-carousel (3.5s cycle with smooth fade transition)
  useEffect(() => {
    if (isSponsorPaused || sponsorsList.length === 0) return;
    const timer = setInterval(() => {
      setActiveSponsorIndex((prev) => (prev + 1) % sponsorsList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isSponsorPaused, sponsorsList.length]);

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
          VOICES FROM WITHIN · TECHSRIJAN ARCHIVE
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE EXPERIENCE: 3 HORIZONTALLY ALIGNED CARDS (CAROUSEL)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col justify-start items-center pt-14 sm:pt-16 px-2 pointer-events-auto touch-pan-y">
          {/* Top Arrakis HUD Tab Selector */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-full border border-[#d4a843]/30 bg-black/80 backdrop-blur-md z-30 mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
            {[
              { label: "EVENTS", idx: 0 },
              { label: "SPONSORS", idx: 1 },
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
              {/* ─── MOBILE CARD 1: FEATURED EVENTS ─── */}
              <div className="archive-card pointer-events-auto relative w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center transition-transform duration-300">
                <div className="absolute inset-[8%] bg-gradient-to-b from-black/70 via-[#1a120c]/75 to-black/85 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />
                <img
                  src={CITADEL_FRAME}
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[17%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]">
                  {/* Header info without dummy labels */}
                  <div className="flex-shrink-0">
                    <h3 className="text-[13px] sm:text-[14px] font-montserrat font-black tracking-[0.14em] uppercase text-[#F0EAE1] leading-tight">
                      FEATURED EVENTS
                    </h3>
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-[#c4b79b] mt-0.5 leading-tight truncate">
                      Choose your route into Techsrijan’27.
                    </p>
                  </div>

                  {/* 4 Categorized Event Rows */}
                  <div className="flex-1 flex flex-col justify-evenly py-0.5 gap-0.5 min-h-0">
                    {eventsList.map((ev) => (
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
                            <span className="font-montserrat text-[9.5px] font-semibold tracking-wider text-[#F0EAE1] truncate">
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

                  {/* Bottom Action */}
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

              {/* ─── MOBILE CARD 2: THE SPONSORS ─── */}
              <div
                className="archive-card pointer-events-auto relative w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center transition-transform duration-300"
                onTouchStart={() => setIsSponsorPaused(true)}
                onTouchEnd={() => setIsSponsorPaused(false)}
              >
                <div className="absolute inset-[8%] bg-gradient-to-b from-black/70 via-[#1a120c]/75 to-black/85 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />
                <img
                  src={CITADEL_FRAME}
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[16%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]">
                  <div className="flex-shrink-0 text-center">
                    <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d4a843] uppercase block">
                      OFFICIAL PATRONS
                    </span>
                    <h3 className="text-[12px] sm:text-[13px] font-montserrat font-bold tracking-[0.14em] uppercase text-[#F0EAE1] mt-0.5 leading-none">
                      OUR SPONSORS
                    </h3>
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-[#c4b79b] mt-0.5 leading-tight truncate">
                      Powering the awakening.
                    </p>
                  </div>

                  {/* Sponsor Circle & Tier Showcase with Smooth Fade Animation */}
                  <div className="relative my-auto w-full flex-1 flex flex-col items-center justify-center py-1">
                    <div
                      key={activeSponsor.id}
                      className="flex flex-col items-center text-center animate-sponsor-fade transition-all duration-500 w-full"
                    >
                      {/* Sponsor Tier Badge */}
                      <div
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[7.5px] font-mono font-bold tracking-[0.15em] uppercase mb-1 shadow-sm"
                        style={{
                          borderColor: `${activeSponsor.accent}70`,
                          backgroundColor: `${activeSponsor.accent}15`,
                          color: activeSponsor.accent,
                          boxShadow: `0 0 8px ${activeSponsor.accent}25`,
                        }}
                      >
                        <span className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: activeSponsor.accent }} />
                        <span>{activeSponsor.tier}</span>
                      </div>

                      {/* Sponsor Circle */}
                      <div className="relative my-1">
                        <div
                          className="absolute -inset-1.5 rounded-full blur-md opacity-50 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle, ${activeSponsor.glow} 0%, transparent 70%)`,
                          }}
                        />
                        <div
                          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px]"
                          style={{
                            background: `linear-gradient(135deg, ${activeSponsor.accent}, #d4a843, ${activeSponsor.accent}40)`,
                            boxShadow: `0 0 12px ${activeSponsor.glow}`,
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1c120c] to-[#0a0604] flex items-center justify-center overflow-hidden p-2 border border-black/80">
                            <img
                              src={activeSponsor.image}
                              alt={activeSponsor.name}
                              className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                              loading="eager"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sponsor Name & Tagline */}
                      <h4 className="text-[11px] sm:text-[12px] font-montserrat font-bold tracking-[0.12em] text-[#F0EAE1] mt-1 leading-none">
                        {activeSponsor.name}
                      </h4>
                      <p className="text-[7px] font-mono text-[#a89b88] tracking-wider mt-0.5 truncate max-w-[170px]">
                        {activeSponsor.tagline}
                      </p>
                    </div>

                    {/* Dots Carousel Indicator */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {sponsorsList.map((sp, idx) => (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => setActiveSponsorIndex(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === activeSponsorIndex
                              ? "w-3.5 h-1 bg-[#d4a843] shadow-[0_0_6px_rgba(212,168,67,0.8)]"
                              : "w-1 h-1 bg-[#d4a843]/30 hover:bg-[#d4a843]/60"
                          }`}
                          aria-label={`Show ${sp.name}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      href="/sponsors"
                      className="group flex items-center justify-center gap-1.5 w-full py-1 px-2.5 rounded border border-[#d4a843]/40 bg-[#d4a843]/15 hover:bg-[#d4a843]/30 text-[#F0EAE1] font-mono text-[8px] tracking-[0.2em] uppercase transition-all"
                    >
                      <span>VIEW ALL SPONSORS</span>
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
                  src={CITADEL_FRAME}
                  alt=""
                  className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  loading="eager"
                />
                <div className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[16%] pb-[18%] px-[13%] pointer-events-auto text-[#F0EAE1]">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d4a843] uppercase">
                        TESTIMONIALS
                      </span>
                      <span className="text-[7.5px] font-mono tracking-widest text-[#d4a843]/60">
                        {TRANSMISSIONS[activeQuoteIndex].id} / 05
                      </span>
                    </div>
                    <h3 className="text-[13px] sm:text-sm font-montserrat font-bold tracking-[0.14em] uppercase text-[#F0EAE1] mt-0.5 leading-none">
                      VOICES FROM WITHIN
                    </h3>
                  </div>

                  <div className="my-auto py-1 flex flex-col justify-center min-h-[46px]">
                    <p className="text-[11.5px] sm:text-[12.5px] font-geist tracking-normal text-[#FAF6EE] leading-relaxed italic pl-2.5 border-l-2 border-[#d4a843]/60 line-clamp-3">
                      “{TRANSMISSIONS[activeQuoteIndex].quote}”
                    </p>
                    <div className="mt-1.5 pl-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bebas font-normal text-[#d4a843] tracking-wider uppercase">
                        — {TRANSMISSIONS[activeQuoteIndex].author}
                      </span>
                      <span className="text-[7.5px] font-geist text-[#a89b88] tracking-wider uppercase truncate">
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
              src={CITADEL_FRAME}
              alt=""
              className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
              loading="eager"
            />

            {/* Card Content — Comfortably padded inside frame safe area so text never clips */}
            <div
              className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[21%] pb-[19%] px-[15%] pointer-events-auto text-[#F0EAE1]"
              style={{
                transform: "translateZ(24px)",
              }}
            >
              {/* Header info without dummy labels */}
              <div className="flex-shrink-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-montserrat font-black tracking-[0.16em] uppercase text-[#F0EAE1] leading-tight text-shadow-gold">
                  FEATURED EVENTS
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono text-[#c4b79b] mt-0.5 tracking-wide">
                  Choose your route into Techsrijan’27.
                </p>
              </div>

              {/* 4 Compact Event Rows — evenly distributed across safe height */}
              <div className="flex-1 flex flex-col justify-evenly py-2 gap-1.5 sm:gap-2">
                {eventsList.map((ev) => {
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
                          <span className="font-montserrat text-[11px] sm:text-xs font-semibold tracking-wider text-[#F0EAE1] group-hover:text-[#ffd685] transition-colors truncate">
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
            {/* BOX 1 (TOP): OUR SPONSORS                                     */}
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
              onMouseEnter={() => setIsSponsorPaused(true)}
              onMouseLeave={() => setIsSponsorPaused(false)}
            >
              {/* Desert-ambience backing */}
              <div className="absolute inset-[8%] bg-gradient-to-b from-black/60 via-[#1a120c]/65 to-black/80 backdrop-blur-[3px] rounded-2xl pointer-events-none z-0" />

              {/* Asset 3 Architectural Frame */}
              <img
                src={CITADEL_FRAME}
                alt=""
                className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                loading="eager"
              />

              {/* Content */}
              <div
                className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[19%] pb-[16%] px-[14%] pointer-events-auto text-[#F0EAE1]"
                style={{
                  transform: "translateZ(18px)",
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 text-center">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4a843] uppercase block">
                    OFFICIAL PATRONS
                  </span>
                  <h3 className="text-sm sm:text-base font-montserrat font-bold tracking-[0.16em] uppercase text-[#F0EAE1] mt-0.5 leading-tight">
                    OUR SPONSORS
                  </h3>
                  <p className="text-[8px] sm:text-[9px] font-mono text-[#c4b79b] tracking-wide mt-0.5">
                    Powering the awakening.
                  </p>
                </div>

                {/* Center Sponsor Circle with Smooth Fade Transition */}
                <div className="relative my-auto w-full flex-1 flex flex-col items-center justify-center py-1 overflow-hidden">
                  <div
                    key={activeSponsor.id}
                    className="flex flex-col items-center text-center animate-sponsor-fade transition-all duration-500 w-full"
                  >
                    {/* Sponsor Tier Badge */}
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[8px] font-mono font-bold tracking-[0.18em] uppercase mb-1 shadow-sm"
                      style={{
                        borderColor: `${activeSponsor.accent}80`,
                        backgroundColor: `${activeSponsor.accent}15`,
                        color: activeSponsor.accent,
                        boxShadow: `0 0 10px ${activeSponsor.accent}30`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeSponsor.accent }} />
                      <span>{activeSponsor.tier}</span>
                    </div>

                    {/* Sponsor Circle */}
                    <div className="relative group cursor-pointer my-1">
                      <div
                        className="absolute -inset-2 rounded-full blur-md opacity-60 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle, ${activeSponsor.glow} 0%, transparent 70%)`,
                        }}
                      />
                      <div
                        className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${activeSponsor.accent}, #d4a843, ${activeSponsor.accent}40)`,
                          boxShadow: `0 0 16px ${activeSponsor.glow}`,
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1c120c] to-[#0a0604] flex items-center justify-center overflow-hidden p-2.5 border border-black/80">
                          <img
                            src={activeSponsor.image}
                            alt={activeSponsor.name}
                            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                            loading="eager"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sponsor Name & Tagline */}
                    <h4 className="text-[12px] sm:text-[13px] font-montserrat font-extrabold tracking-[0.14em] text-[#F0EAE1] mt-1 leading-none">
                      {activeSponsor.name}
                    </h4>
                    <p className="text-[7.5px] sm:text-[8px] font-mono text-[#a89b88] tracking-wider mt-0.5 truncate max-w-[200px]">
                      {activeSponsor.tagline}
                    </p>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {sponsorsList.map((sp, idx) => (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => setActiveSponsorIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === activeSponsorIndex
                            ? "w-4 h-1 bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.8)]"
                            : "w-1.5 h-1 bg-[#d4a843]/30 hover:bg-[#d4a843]/60"
                        }`}
                        aria-label={`Show ${sp.name}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="flex-shrink-0 pt-0.5">
                  <Link
                    href="/sponsors"
                    className="group flex items-center justify-center gap-1.5 w-full py-1 px-2 rounded border border-[#d4a843]/40 bg-[#d4a843]/10 hover:bg-[#d4a843]/25 hover:border-[#d4a843] text-[#F0EAE1] font-mono text-[8px] sm:text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
                  >
                    <span>VIEW ALL SPONSORS</span>
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
                src={CITADEL_FRAME}
                alt=""
                className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                loading="eager"
              />

              {/* Content */}
              <div
                className="archive-content relative z-10 w-full h-full flex flex-col justify-between pt-[20%] pb-[17%] px-[15%] pointer-events-auto text-[#F0EAE1]"
                style={{
                  transform: "translateZ(18px)",
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono tracking-[0.25em] text-[#d4a843] uppercase">
                      TESTIMONIALS
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-[#d4a843]/60">
                      {TRANSMISSIONS[activeQuoteIndex].id} / 05
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-montserrat font-bold tracking-[0.16em] uppercase text-[#F0EAE1] mt-0.5 leading-tight">
                    VOICES FROM WITHIN
                  </h3>
                </div>

                {/* Quote Body */}
                <div className="my-auto py-0.5 flex flex-col justify-center min-h-[46px]">
                  <p className="text-[12.5px] sm:text-[13.5px] font-geist tracking-normal text-[#FAF6EE] leading-relaxed italic pl-2.5 border-l-2 border-[#d4a843]/60 line-clamp-3">
                    “{TRANSMISSIONS[activeQuoteIndex].quote}”
                  </p>
                  <div className="mt-1.5 pl-2.5 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bebas font-normal text-[#d4a843] tracking-wider uppercase">
                      — {TRANSMISSIONS[activeQuoteIndex].author}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-geist text-[#a89b88] tracking-wider uppercase truncate">
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
      {/* Smooth Keyframe Animation for Sponsor Fade */}
      <style>{`
        @keyframes sponsorFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-sponsor-fade {
          animation: sponsorFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

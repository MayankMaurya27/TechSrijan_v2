"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isMobileDevice } from "@/core";
import { api } from "@/lib/api";
import { useActiveCanonicalTheme } from "../hooks/use-active-theme";
import {
  CITADEL_THEMES,
  FEATURED_DIRECTIVES,
  SPONSORS_SHOWCASE,
  TRANSMISSIONS,
  type DirectiveItem,
  type SponsorItem,
} from "./citadel-archive/types";
import { ArchiveFrameCard } from "./citadel-archive/archive-frame-card";
import { CardEvents } from "./citadel-archive/card-events";
import { CardSponsors } from "./citadel-archive/card-sponsors";
import { CardTestimonials } from "./citadel-archive/card-testimonials";

interface CitadelArchiveProps {
  scrollProgress: number;
}

const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min));
  return x * x * (3 - 2 * x);
};

export function CitadelArchive({ scrollProgress }: CitadelArchiveProps) {
  const currentTheme = useActiveCanonicalTheme();
  const citadelTheme = CITADEL_THEMES[currentTheme] || CITADEL_THEMES["arrakis-day"];

  // State
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [activeSponsorIndex, setActiveSponsorIndex] = useState(0);
  const [isSponsorPaused, setIsSponsorPaused] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const isQuotePausedRef = useRef(false);

  // Dynamic Backend Sourced Events and Sponsors with Curated Fallbacks
  const [eventsList, setEventsList] = useState<DirectiveItem[]>(FEATURED_DIRECTIVES);
  const [sponsorsList, setSponsorsList] = useState<SponsorItem[]>(SPONSORS_SHOWCASE);

  useEffect(() => {
    // 1. Fetch live events
    api.events
      .list()
      .then((res) => {
        if (res && res.length > 0) {
          const codingEvs = res.filter((e) => e.category === "TECHNICAL").map((e) => e.title);
          const roboEvs = res.filter((e) => e.category === "ROBOTICS").map((e) => e.title);
          const gamingEvs = res.filter((e) => e.category === "GAMING").map((e) => e.title);
          const mgmtEvs = res
            .filter((e) => e.category === "MANAGEMENT" || e.category === "WORKSHOP")
            .map((e) => e.title);

          const updatedDirectives: DirectiveItem[] = [
            {
              id: "01",
              title: "TECHNICAL & CODING",
              meta: (
                codingEvs.length > 0
                  ? codingEvs.slice(0, 3).join(" · ")
                  : "MANTRASTRA · CODE ZILLA · ALGOSTRIKE"
              ).toUpperCase(),
              category: "TECHNICAL",
              link: "/events",
            },
            {
              id: "02",
              title: "ROBOTICS & COMBAT",
              meta: (
                roboEvs.length > 0
                  ? roboEvs.slice(0, 3).join(" · ")
                  : "ROBOKIRTI · ROBOWARS · DRONE LEAGUE"
              ).toUpperCase(),
              category: "ROBOTICS",
              link: "/events",
            },
            {
              id: "03",
              title: "GAMING & ARENA",
              meta: (
                gamingEvs.length > 0
                  ? gamingEvs.slice(0, 3).join(" · ")
                  : "VALORANT CLASH · BGMI ARENA"
              ).toUpperCase(),
              category: "GAMING",
              link: "/events",
            },
            {
              id: "04",
              title: "MANAGEMENT & INNOVATION",
              meta: (
                mgmtEvs.length > 0
                  ? mgmtEvs.slice(0, 3).join(" · ")
                  : "BIZ CONCLAVE · SCIENCE EXHIBITION"
              ).toUpperCase(),
              category: "MANAGEMENT",
              link: "/events",
            },
          ];
          setEventsList(updatedDirectives);
        }
      })
      .catch(() => {});

    // 2. Fetch live sponsors
    api.sponsors
      .list()
      .then((res) => {
        if (res && res.length > 0) {
          const accents = ["#FFE600", "#F59E0B", "#38BDF8", "#EF4444", "#06B6D4"];
          const mapped: SponsorItem[] = res.map((s, idx) => ({
            id: s.id,
            name: s.name.toUpperCase(),
            tier: s.category ? `${s.category.replace(/_/g, " ")} SPONSOR` : "OFFICIAL SPONSOR",
            tagline: s.websiteUrl
              ? s.websiteUrl.replace(/^https?:\/\//, "")
              : "Strategic Citadel Partner",
            image: s.logoUrl || `/images/sponsors/cp-${(idx % 6) + 1}.webp`,
            accent: accents[idx % accents.length],
            glow: "rgba(245, 158, 11, 0.9)",
          }));
          setSponsorsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () =>
      isMobileDevice() || (typeof window !== "undefined" && window.innerWidth < 1024);
    setIsMobile(checkMobile());
    const onResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Visibility determination
  const isVisible = scrollProgress >= (isMobile ? 0.76 : 0.8);

  // Auto-carousel Dormancy & Timers: Only run when visible and document is active
  useEffect(() => {
    if (!isVisible || isSponsorPaused || sponsorsList.length === 0) return;
    const timer = setInterval(() => {
      if (!document.hidden) {
        setActiveSponsorIndex((prev) => (prev + 1) % sponsorsList.length);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [isVisible, isSponsorPaused, sponsorsList.length]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      if (!isQuotePausedRef.current && !document.hidden) {
        setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [isVisible]);

  // Throttled mouse parallax tilt for 3D perspective scene on desktop
  useEffect(() => {
    if (isMobile) return;
    let rafId = 0;
    const onPointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w > 0 && h > 0) {
          const rotY = (e.clientX / w - 0.5) * 2.6;
          const rotX = -(e.clientY / h - 0.5) * 2.0;
          setMouseTilt({ x: rotX, y: rotY });
        }
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [isMobile]);

  // Mobile Track Scroll and Navigation Handlers
  const scrollToMobileCard = useCallback((index: number) => {
    setActiveMobileCard(index);
    if (mobileTrackRef.current) {
      const child = mobileTrackRef.current.children[index] as HTMLElement;
      if (child) {
        const track = mobileTrackRef.current;
        const targetScrollLeft = child.offsetLeft - (track.clientWidth - child.offsetWidth) / 2;
        track.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const onMobileTrackScroll = useCallback(() => {
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
  }, []);

  // Progressive Emergence Curve
  const pStart = isMobile ? 0.77 : 0.81;
  const pSettle = isMobile ? 0.86 : 0.89;

  const phaseA = smoothstep(pStart, pStart + 0.04, scrollProgress);
  const phaseB = smoothstep(pStart + 0.02, pSettle, scrollProgress);
  const containerOpacity = smoothstep(pStart, pStart + 0.05, scrollProgress);

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
        <div
          className={`absolute top-[6%] left-0 w-full h-[1px] bg-gradient-to-r ${citadelTheme.guideLines} transition-all duration-500`}
        />
        <div
          className={`absolute bottom-[6%] left-0 w-full h-[1px] bg-gradient-to-r ${citadelTheme.guideLines} transition-all duration-500`}
        />

        <div
          className={`absolute top-[6.5%] left-8 text-[9px] font-mono tracking-[0.25em] hidden sm:block transition-colors duration-500 ${citadelTheme.guideText}`}
        >
          VOICES FROM WITHIN · TECHSRIJAN ARCHIVE
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE EXPERIENCE: 3 HORIZONTALLY ALIGNED CARDS (CAROUSEL)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col justify-start items-center pt-14 sm:pt-16 px-2 pointer-events-auto touch-pan-y">
          {/* Top HUD Tab Selector */}
          <div
            className={`flex items-center justify-center gap-1.5 p-1 rounded-full border ${citadelTheme.mobileHudBorder} bg-black/80 backdrop-blur-md z-30 mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.85)] transition-all duration-500`}
          >
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
                    ? `${citadelTheme.mobileHudActiveBg} ${citadelTheme.mobileHudActiveText} font-bold ${citadelTheme.mobileHudActiveShadow}`
                    : "text-[#c4b79b]/70 hover:text-[#F0EAE1]"
                }`}
              >
                0{tab.idx + 1} {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Track Container with Navigation Chevrons */}
          <div className="relative w-full flex items-center justify-center">
            {activeMobileCard > 0 && (
              <button
                type="button"
                onClick={() => scrollToMobileCard(activeMobileCard - 1)}
                className={`absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${citadelTheme.mobileNavArrowBorder} bg-black/85 backdrop-blur-md flex items-center justify-center ${citadelTheme.mobileNavArrowGlow} active:scale-90 transition-all`}
                style={{ color: citadelTheme.accentBright }}
                aria-label="Previous card"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {activeMobileCard < 2 && (
              <button
                type="button"
                onClick={() => scrollToMobileCard(activeMobileCard + 1)}
                className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${citadelTheme.mobileNavArrowBorder} bg-black/85 backdrop-blur-md flex items-center justify-center ${citadelTheme.mobileNavArrowGlow} active:scale-90 transition-all animate-pulse`}
                style={{ color: citadelTheme.accentBright }}
                aria-label="Next card"
              >
                <ChevronRight className="h-4 w-4" />
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
              {/* Card 1: Featured Events */}
              <ArchiveFrameCard
                theme={citadelTheme}
                className="w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center"
                paddingClassName="pt-[17%] pb-[18%] px-[13%]"
              >
                <CardEvents
                  theme={citadelTheme}
                  events={eventsList}
                  isMobile={true}
                  hoveredEvent={hoveredEvent}
                  onHoverEvent={setHoveredEvent}
                />
              </ArchiveFrameCard>

              {/* Card 2: Sponsors Showcase */}
              <ArchiveFrameCard
                theme={citadelTheme}
                className="w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center"
                paddingClassName="pt-[16%] pb-[18%] px-[13%]"
                onTouchStart={() => setIsSponsorPaused(true)}
                onTouchEnd={() => setIsSponsorPaused(false)}
              >
                <CardSponsors
                  theme={citadelTheme}
                  sponsors={sponsorsList}
                  activeSponsorIndex={activeSponsorIndex}
                  onSelectSponsor={setActiveSponsorIndex}
                  isMobile={true}
                />
              </ArchiveFrameCard>

              {/* Card 3: Voices from Within */}
              <ArchiveFrameCard
                theme={citadelTheme}
                className="w-[78vw] max-w-[285px] h-[48vh] max-h-[385px] min-h-[330px] shrink-0 snap-center"
                paddingClassName="pt-[16%] pb-[18%] px-[13%]"
              >
                <CardTestimonials
                  theme={citadelTheme}
                  transmissions={TRANSMISSIONS}
                  activeQuoteIndex={activeQuoteIndex}
                  onSelectQuote={setActiveQuoteIndex}
                  onPrevQuote={() =>
                    setActiveQuoteIndex(
                      (prev) => (prev - 1 + TRANSMISSIONS.length) % TRANSMISSIONS.length
                    )
                  }
                  onNextQuote={() =>
                    setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length)
                  }
                  isMobile={true}
                />
              </ArchiveFrameCard>
            </div>
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* DESKTOP EXPERIENCE: MONUMENTAL BALANCED 3D ARCHIVE STAGE      */
        /* ───────────────────────────────────────────────────────────── */
        <div
          className="relative w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 lg:pr-14 xl:pr-20 2xl:pr-24 flex items-center justify-center gap-5 lg:gap-8 xl:gap-10 pointer-events-none h-[76vh] max-h-[580px] min-h-[460px] translate-y-6 sm:translate-y-8"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* LEFT CARD — FEATURED EVENTS (Primary Grand Monolith)         */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <ArchiveFrameCard
            theme={citadelTheme}
            className="h-full w-[46vw] lg:w-[48vw] xl:w-[50vw] max-w-[540px] lg:max-w-[590px] xl:max-w-[650px] 2xl:max-w-[680px] min-w-[320px]"
            contentTranslateZ={24}
            paddingClassName="pt-[16%] lg:pt-[15%] xl:pt-[14%] pb-[14%] lg:pb-[13%] xl:pb-[12%] px-[12%] lg:px-[11%] xl:px-[10%]"
            style={{
              transform: `translate3d(0, ${emergeY}px, ${30 + emergeZ}px) rotateY(${
                1.5 + mouseTilt.y * 0.4
              }deg) rotateX(${0.5 + mouseTilt.x * 0.4}deg)`,
              transformStyle: "preserve-3d",
              opacity: frameAlpha,
            }}
          >
            <CardEvents
              theme={citadelTheme}
              events={eventsList}
              isMobile={false}
              hoveredEvent={hoveredEvent}
              onHoverEvent={setHoveredEvent}
            />
          </ArchiveFrameCard>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN — 2 MONOLITHS (SPONSORS + TESTIMONIALS)         */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div
            className="pointer-events-none h-full w-[24vw] max-w-[285px] min-w-[215px] flex flex-col justify-between gap-3 sm:gap-3.5"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* BOX 1 (TOP): OUR SPONSORS */}
            <ArchiveFrameCard
              theme={citadelTheme}
              className="flex-1 w-full"
              contentTranslateZ={18}
              paddingClassName="pt-[19%] pb-[16%] px-[14%]"
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
              <CardSponsors
                theme={citadelTheme}
                sponsors={sponsorsList}
                activeSponsorIndex={activeSponsorIndex}
                onSelectSponsor={setActiveSponsorIndex}
                isMobile={false}
              />
            </ArchiveFrameCard>

            {/* BOX 2 (BOTTOM): VOICES FROM WITHIN */}
            <ArchiveFrameCard
              theme={citadelTheme}
              className="flex-1 w-full"
              contentTranslateZ={18}
              paddingClassName="pt-[20%] pb-[17%] px-[15%]"
              style={{
                transform: `translate3d(0, ${emergeY}px, ${20 + emergeZ}px) rotateY(${
                  -1.2 + mouseTilt.y * 0.4
                }deg) rotateX(${-0.5 + mouseTilt.x * 0.4}deg)`,
                transformStyle: "preserve-3d",
                opacity: frameAlpha,
              }}
              onMouseEnter={() => {
                isQuotePausedRef.current = true;
              }}
              onMouseLeave={() => {
                isQuotePausedRef.current = false;
              }}
            >
              <CardTestimonials
                theme={citadelTheme}
                transmissions={TRANSMISSIONS}
                activeQuoteIndex={activeQuoteIndex}
                onSelectQuote={setActiveQuoteIndex}
                onPrevQuote={() =>
                  setActiveQuoteIndex(
                    (prev) => (prev - 1 + TRANSMISSIONS.length) % TRANSMISSIONS.length
                  )
                }
                onNextQuote={() =>
                  setActiveQuoteIndex((prev) => (prev + 1) % TRANSMISSIONS.length)
                }
                isMobile={false}
              />
            </ArchiveFrameCard>
          </div>
        </div>
      )}
    </div>
  );
}

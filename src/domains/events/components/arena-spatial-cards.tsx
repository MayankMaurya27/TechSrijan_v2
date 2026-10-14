"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

// ─── Club registry ────────────────────────────────────────────────────────────
export type ClubId =
  | "tsc"
  | "mmmut-reso"
  | "ieee-stb"
  | "robotics"
  | "sae";

export interface Club {
  id: ClubId;
  slotNumber: string;
  shortName: string;
  fullName: string;
  tagline: string;
  eventCount: number;
  color: string;
  logo: string;
  watermarkLogo?: string;
  glowColor: string;
}

export const CLUBS: Club[] = [
  {
    id: "tsc",
    slotNumber: "01",
    shortName: "TSC",
    fullName: "TechSrijan Core",
    tagline: "The cultural vanguard — cosplay, science exhibitions & flagship campus events.",
    eventCount: 4,
    color: "crimson",
    logo: getOptimizedImageUrl("/club-logos/techrijan-logo.png", 320),
    watermarkLogo: getOptimizedImageUrl("/club-logos/techrijan-logo.png", 320),
    glowColor: "rgba(220, 38, 38, 0.5)",
  },
  {
    id: "mmmut-reso",
    slotNumber: "02",
    shortName: "RESO",
    fullName: "MMMUT RESO",
    tagline: "Resonance — the premier coding arena powering Mantrastra & beyond.",
    eventCount: 1,
    color: "amber",
    logo: getOptimizedImageUrl("/club-logos/reso-logo.png", 320),
    watermarkLogo: getOptimizedImageUrl("/club-logos/reso-logo.png", 320),
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "ieee-stb",
    slotNumber: "03",
    shortName: "IEEE-STB",
    fullName: "IEEE-STB MMMUT",
    tagline: "Technical excellence across robotics, software, hardware & innovation.",
    eventCount: 8,
    color: "blue",
    logo: getOptimizedImageUrl("/club-logos/ieee-logo.png", 320),
    watermarkLogo: getOptimizedImageUrl("/club-logos/ieee-logo.png", 320),
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: "robotics",
    slotNumber: "04",
    shortName: "RC",
    fullName: "Robotics Club",
    tagline: "Battle-tested machines — RoboWar, Laser Strike, CTF & arena combat.",
    eventCount: 6,
    color: "emerald",
    logo: getOptimizedImageUrl("/club-logos/robotics-logo.png", 320),
    watermarkLogo: getOptimizedImageUrl("/club-logos/robotics-logo.png", 320),
    glowColor: "rgba(234, 179, 8, 0.5)",
  },
  {
    id: "sae",
    slotNumber: "05",
    shortName: "SAE",
    fullName: "SAE Collegiate, MMMUT Chapter",
    tagline: "Engineering design mastery — CAD, bridge-building & precision challenges.",
    eventCount: 4,
    color: "violet",
    logo: getOptimizedImageUrl("/club-logos/sae-logo-white.png", 320),
    watermarkLogo: getOptimizedImageUrl("/club-logos/sae-logo-white.png", 320),
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
];

export interface ArenaSpatialCardsProps {
  isVisible: boolean;
  onClubSelect?: (clubId: ClubId) => void;
  onCategorySelect?: (categoryId: string) => void;
  onExploreEvents?: () => void;
  leftCardsRef?: React.RefObject<HTMLDivElement | null>;
  centerCardRef?: React.RefObject<HTMLDivElement | null>;
  rightCardsRef?: React.RefObject<HTMLDivElement | null>;
}

function ClubCard({
  club,
  idx,
  onClick,
}: {
  club: Club;
  idx: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.07, ease: "easeOut" }}
      onClick={onClick}
      className="relative cursor-pointer group flex items-center justify-center select-none active:scale-95 transition-transform duration-150 w-[108px] sm:w-[140px] md:w-[170px] lg:w-[210px] xl:w-[230px]"
    >
      <div className="relative w-full aspect-[2/3] max-h-[36vh] sm:max-h-[46vh] md:max-h-[64vh] flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
        {/* Dark Glass Interior */}
        <div className="absolute inset-[4%_4%] sm:inset-[4.5%_4.5%] rounded-[12px] sm:rounded-[22px] bg-black/85 backdrop-blur-md border border-white/10 pt-[7%] pb-[6%] sm:pt-[10%] sm:pb-[8%] px-[6%] sm:px-[8%] flex flex-col justify-between text-left z-10 transition-all duration-300 group-hover:bg-black/90 group-hover:border-white/25 shadow-[0_8px_40px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* ── Background Hologram Watermark ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[12px] sm:rounded-[22px] z-0">
            <img
              loading="lazy"
              decoding="async"
              src={club.watermarkLogo || club.logo}
              alt=""
              aria-hidden="true"
              className="w-[72%] h-[72%] object-contain opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 filter brightness-110"
              style={{
                maskImage: "radial-gradient(circle at center, black 32%, transparent 74%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 32%, transparent 74%)",
              }}
            />
            {/* Subtle Thematic Radial Backlight */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 38%, ${club.glowColor} 0%, transparent 68%)`,
              }}
            />
          </div>

          {/* ── Slot Eyebrow ── */}
          <div className="flex items-center justify-between gap-1 relative z-10">
            <span className="font-mono text-[7px] sm:text-[9.5px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
              CLUB // {club.slotNumber}
            </span>
            <div className="h-[1px] flex-1 max-w-[14px] sm:max-w-[26px] bg-gradient-to-r from-white/30 to-transparent" />
          </div>

          {/* ── Club Medallion Crest & Titles ── */}
          <div className="relative z-10 my-auto py-0.5 sm:py-1 flex flex-col items-center text-center">
            {/* Emblem Crest Bezel with Glow */}
            <div className="relative mb-1.5 sm:mb-2.5">
              <div
                className="w-11 h-11 sm:w-15 sm:h-15 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 rounded-full p-1 sm:p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.6) 100%)",
                  boxShadow: `0 4px 18px rgba(0,0,0,0.85)`,
                }}
              >
                <div
                  className="w-full h-full rounded-full p-0.5 sm:p-1 flex items-center justify-center border border-white/20 group-hover:border-white/50 transition-colors duration-300 bg-black/70 backdrop-blur-sm shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={club.logo}
                    alt={`${club.shortName} Logo`}
                    className="w-full h-full object-contain rounded-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Ambient Colored Halo Glow around Crest */}
              <div
                className="absolute -inset-1 rounded-full blur-md opacity-25 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none -z-10"
                style={{ backgroundColor: club.glowColor }}
              />
            </div>

            {/* Typography */}
            <p className="font-bebas text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] tracking-widest text-white uppercase leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,1)] group-hover:text-white transition-colors">
              {club.shortName}
            </p>
            <p className="mt-0.5 sm:mt-1 font-mono text-[6.5px] sm:text-[8.5px] tracking-[0.1em] text-neutral-300 uppercase leading-tight line-clamp-1 max-w-[95%]">
              {club.fullName}
            </p>
            <p className="mt-1 sm:mt-1.5 font-sans text-[7.5px] sm:text-[9.5px] md:text-[10px] text-neutral-400 group-hover:text-neutral-200 leading-snug line-clamp-2 transition-colors duration-300 max-w-[95%]">
              {club.tagline}
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="relative flex items-center justify-center w-full py-0.5 mb-0.5 sm:mb-1 z-10">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="absolute px-1 text-white/50 text-[6.5px] sm:text-[8px]">✦</span>
          </div>

          {/* ── Event count & Action ── */}
          <div className="flex items-center justify-between font-mono text-[7px] sm:text-[9px] tracking-[0.12em] text-neutral-500 uppercase border-t border-white/10 pt-1 sm:pt-1.5 z-10">
            <span>{club.eventCount} EVENTS</span>
            <span className="text-white/70 group-hover:text-white transition-colors flex items-center gap-0.5 font-semibold">
              VIEW <ChevronDown className="w-2.5 h-2.5 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Real Event Frame Overlay */}
        <img
          loading="lazy"
          decoding="async"
          src={getOptimizedImageUrl("/real-event.webp", 1024)}
          alt={club.shortName}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_36px_rgba(0,0,0,0.95)] transition-all duration-300 group-hover:drop-shadow-[0_0_36px_rgba(255,255,255,0.35)] group-hover:scale-[1.02] z-20"
        />
      </div>
    </motion.div>
  );
}

export function ArenaSpatialCards({
  isVisible,
  onClubSelect,
  onCategorySelect,
  onExploreEvents,
  leftCardsRef,
  centerCardRef,
  rightCardsRef,
}: ArenaSpatialCardsProps) {
  const handleClubClick = (club: Club) => {
    const categoryMap: Record<string, string> = {
      tsc: "CULTURAL",
      "mmmut-reso": "TECHNICAL",
      "ieee-stb": "TECHNICAL",
      robotics: "ROBOTICS",
      sae: "MANAGEMENT",
    };
    if (onCategorySelect) onCategorySelect(categoryMap[club.id] || "ALL");
    if (onClubSelect) onClubSelect(club.id);
    if (onExploreEvents) onExploreEvents();
  };

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col justify-between transition-all duration-500 ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* ── Desktop & Tablet View (md+): 5 Ornate Spatial Columns ── */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center pb-2 sm:pb-8 pointer-events-auto w-full px-2 sm:px-6">
        <div className="w-full max-w-[98vw] lg:max-w-6xl xl:max-w-7xl flex flex-row items-center justify-center gap-3.5 lg:gap-5">
          {/* Left Column (Cards 0 & 1: TSC, RESO) */}
          <div
            ref={leftCardsRef}
            className="flex items-center justify-center gap-3.5 lg:gap-5 will-change-transform"
          >
            {CLUBS.slice(0, 2).map((club, i) => (
              <ClubCard
                key={club.id}
                club={club}
                idx={i}
                onClick={() => handleClubClick(club)}
              />
            ))}
          </div>

          {/* Center Column (Card 2: IEEE-STB) */}
          <div
            ref={centerCardRef}
            className="flex items-center justify-center will-change-transform"
          >
            <ClubCard
              club={CLUBS[2]}
              idx={2}
              onClick={() => handleClubClick(CLUBS[2])}
            />
          </div>

          {/* Right Column (Cards 3 & 4: RC, SAE) */}
          <div
            ref={rightCardsRef}
            className="flex items-center justify-center gap-3.5 lg:gap-5 will-change-transform"
          >
            {CLUBS.slice(3, 5).map((club, i) => (
              <ClubCard
                key={club.id}
                club={club}
                idx={i + 3}
                onClick={() => handleClubClick(club)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Directive & Direct Action Bar */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onExploreEvents}
            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-2 sm:py-2.5 font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white bg-black/85 hover:bg-white hover:text-black border border-white/30 hover:border-white transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
          >
            <span>ENTER OUR EVENTS DOSSIER</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase text-center">
            SELECT A CLUB OR SCROLL DOWN TO ENTER THE DOSSIER
          </p>
        </div>
      </div>

      {/* ── Mobile View (<md): Compact High-Performance Touch Deck ── */}
      <div className="flex md:hidden flex-1 flex-col justify-center items-center pt-14 pb-18 px-3 pointer-events-auto w-full max-w-sm mx-auto">
        <div className="w-full text-center mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/80">
              THE ARENA · 5 CHAPTERS
            </span>
          </div>
          <p className="font-mono text-[7.5px] tracking-[0.25em] text-white/50 uppercase">
            TAP A CLUB TO ENTER DOSSIER
          </p>
        </div>

        {/* 2x2 Grid with Left & Right Collapse Refs */}
        <div className="w-full grid grid-cols-2 gap-2">
          {/* Left Column Mobile (TSC, IEEE) */}
          <div ref={leftCardsRef} className="flex flex-col gap-2 will-change-transform">
            {[CLUBS[0], CLUBS[2]].map((club) => (
              <div
                key={club.id}
                onClick={() => handleClubClick(club)}
                className="relative cursor-pointer active:scale-95 transition-transform duration-150 rounded-xl bg-black/85 border border-white/15 p-2.5 flex flex-col items-center text-center shadow-[0_4px_18px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden"
              >
                <div
                  className="w-10 h-10 rounded-full p-1 flex items-center justify-center border border-white/20 bg-black/60 mb-1.5"
                  style={{ boxShadow: `0 0 12px ${club.glowColor}` }}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={club.logo}
                    alt={club.shortName}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="font-mono text-[7.5px] tracking-[0.15em] text-white/60 uppercase">
                  CLUB // {club.slotNumber}
                </span>
                <span className="font-bebas text-base tracking-wider text-white uppercase leading-none mt-0.5">
                  {club.shortName}
                </span>
                <span className="mt-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[7px] font-mono tracking-wider text-neutral-300 uppercase">
                  {club.eventCount} EVENTS
                </span>
              </div>
            ))}
          </div>

          {/* Right Column Mobile (RESO, RC) */}
          <div ref={rightCardsRef} className="flex flex-col gap-2 will-change-transform">
            {[CLUBS[1], CLUBS[3]].map((club) => (
              <div
                key={club.id}
                onClick={() => handleClubClick(club)}
                className="relative cursor-pointer active:scale-95 transition-transform duration-150 rounded-xl bg-black/85 border border-white/15 p-2.5 flex flex-col items-center text-center shadow-[0_4px_18px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden"
              >
                <div
                  className="w-10 h-10 rounded-full p-1 flex items-center justify-center border border-white/20 bg-black/60 mb-1.5"
                  style={{ boxShadow: `0 0 12px ${club.glowColor}` }}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={club.logo}
                    alt={club.shortName}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="font-mono text-[7.5px] tracking-[0.15em] text-white/60 uppercase">
                  CLUB // {club.slotNumber}
                </span>
                <span className="font-bebas text-base tracking-wider text-white uppercase leading-none mt-0.5">
                  {club.shortName}
                </span>
                <span className="mt-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[7px] font-mono tracking-wider text-neutral-300 uppercase">
                  {club.eventCount} EVENTS
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5th Club (SAE) full-width centered card inside centerCardRef */}
        <div ref={centerCardRef} className="w-full mt-2 will-change-transform">
          <div
            onClick={() => handleClubClick(CLUBS[4])}
            className="relative cursor-pointer active:scale-95 transition-transform duration-150 rounded-xl bg-black/85 border border-white/15 p-2.5 flex items-center justify-between shadow-[0_4px_18px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full p-1 flex items-center justify-center border border-white/20 bg-black/60 shrink-0"
                style={{ boxShadow: `0 0 12px ${CLUBS[4].glowColor}` }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={CLUBS[4].logo}
                  alt={CLUBS[4].shortName}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="text-left">
                <span className="font-mono text-[7.5px] tracking-[0.15em] text-white/60 uppercase block">
                  CLUB // {CLUBS[4].slotNumber}
                </span>
                <span className="font-bebas text-base tracking-wider text-white uppercase">
                  {CLUBS[4].shortName} · {CLUBS[4].fullName}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[7px] font-mono tracking-wider text-neutral-300 uppercase shrink-0">
              {CLUBS[4].eventCount} EVENTS
            </span>
          </div>
        </div>

        {/* Mobile Action Button */}
        <div className="w-full mt-2.5 text-center">
          <button
            type="button"
            onClick={onExploreEvents}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-black font-mono text-[10px] font-bold tracking-[0.2em] uppercase rounded-lg active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] cursor-pointer"
          >
            <span>EXPLORE ALL 23 EVENTS</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}

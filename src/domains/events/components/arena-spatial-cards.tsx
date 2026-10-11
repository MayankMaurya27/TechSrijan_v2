"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

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
  },
  {
    id: "mmmut-reso",
    slotNumber: "02",
    shortName: "RESO",
    fullName: "MMMUT RESO",
    tagline: "Resonance — the premier coding arena powering Mantrastra & beyond.",
    eventCount: 1,
    color: "amber",
  },
  {
    id: "ieee-stb",
    slotNumber: "03",
    shortName: "IEEE-STB",
    fullName: "IEEE-STB MMMUT",
    tagline: "Technical excellence across robotics, software, hardware & innovation.",
    eventCount: 8,
    color: "blue",
  },
  {
    id: "robotics",
    slotNumber: "04",
    shortName: "RC",
    fullName: "Robotics Club",
    tagline: "Battle-tested machines — RoboWar, Laser Strike, CTF & arena combat.",
    eventCount: 6,
    color: "emerald",
  },
  {
    id: "sae",
    slotNumber: "05",
    shortName: "SAE",
    fullName: "SAE Collegiate, MMMUT Chapter",
    tagline: "Engineering design mastery — CAD, bridge-building & precision challenges.",
    eventCount: 4,
    color: "violet",
  },
];

export interface ArenaSpatialCardsProps {
  isVisible: boolean;
  onClubSelect?: (clubId: ClubId) => void;
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
        <div className="absolute inset-[4%_4%] sm:inset-[4.5%_4.5%] rounded-[12px] sm:rounded-[22px] bg-black/85 backdrop-blur-md border border-white/10 pt-[8%] pb-[7%] sm:pt-[12%] sm:pb-[10%] px-[7%] sm:px-[10%] flex flex-col justify-between text-left z-10 transition-all duration-300 group-hover:bg-black/90 group-hover:border-white/25 shadow-[0_8px_40px_rgba(0,0,0,0.95)]">
          {/* Slot Eyebrow */}
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
              CLUB // {club.slotNumber}
            </span>
            <div className="h-[1px] flex-1 max-w-[16px] sm:max-w-[28px] bg-gradient-to-r from-white/30 to-transparent" />
          </div>

          {/* Short name & full name */}
          <div className="my-auto py-0.5 sm:py-1">
            <p className="font-bebas text-[20px] sm:text-[28px] md:text-[34px] lg:text-[38px] tracking-widest text-white uppercase leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,1)] group-hover:text-white transition-colors">
              {club.shortName}
            </p>
            <p className="mt-0.5 sm:mt-1 font-mono text-[7.5px] sm:text-[9px] tracking-[0.12em] text-neutral-300 uppercase leading-tight line-clamp-1">
              {club.fullName}
            </p>
            <p className="mt-1 sm:mt-2 font-sans text-[8px] sm:text-[10px] md:text-[11px] text-neutral-400 group-hover:text-neutral-200 leading-snug line-clamp-2 sm:line-clamp-3 transition-colors duration-300">
              {club.tagline}
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center w-full py-0.5 mb-0.5 sm:mb-1">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="absolute px-1 text-white/50 text-[6.5px] sm:text-[8px]">✦</span>
          </div>

          {/* Event count */}
          <div className="flex items-center justify-between font-mono text-[7.5px] sm:text-[9px] tracking-[0.12em] text-neutral-500 uppercase border-t border-white/10 pt-1 sm:pt-1.5">
            <span>{club.eventCount} EVENTS</span>
            <span className="text-white/70 group-hover:text-white transition-colors flex items-center gap-0.5">
              VIEW <ChevronDown className="w-2.5 h-2.5 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Real Event Frame Overlay */}
        <img
          src="/real-event.webp"
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
  onExploreEvents,
  leftCardsRef,
  centerCardRef,
  rightCardsRef,
}: ArenaSpatialCardsProps) {
  const handleClubClick = (club: Club) => {
    if (onClubSelect) onClubSelect(club.id);
    if (onExploreEvents) onExploreEvents();
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between transition-all duration-700 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 5 Club Cards with Ref Attachment for Stay-Style Structural Collapse */}
      <div className="flex-1 flex flex-col justify-center items-center pb-2 sm:pb-8 pointer-events-auto w-full px-2 sm:px-6">
        <div className="w-full max-w-[98vw] lg:max-w-6xl xl:max-w-7xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3.5 lg:gap-5">
          {/* Left Column (Cards 0 & 1: TSC, RESO) */}
          <div
            ref={leftCardsRef}
            className="flex items-center justify-center gap-2 sm:gap-3.5 lg:gap-5 will-change-transform"
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
            className="flex items-center justify-center gap-2 sm:gap-3.5 lg:gap-5 will-change-transform mt-1 sm:mt-0"
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
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, RotateCcw, LayoutGrid, Orbit, ArrowUp } from "lucide-react";
import type { ClubId } from "./arena-spatial-cards";
import { CLUBS } from "./arena-spatial-cards";
import { EventDetailModal } from "./event-detail-modal";
import { InteractiveDossierParticles } from "./interactive-dossier-particles";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { api } from "@/lib/api";

// ─── Data Types ───────────────────────────────────────────────────────────────

export interface DetailedEvent {
  id: string;
  clubId: ClubId;
  clubName: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  prizePool: string;
  teamSize: string;
  venue: string;
  date: string;
  image: string;
  rounds: { title: string; desc: string }[];
  rules: string[];
}

// ─── Event Metadata Presets (Enriches DB records with theme assets & rounds) ──
interface EventMetadataPreset {
  tagline?: string;
  description?: string;
  image?: string;
  rounds?: { title: string; desc: string }[];
  rules?: string[];
}

const EVENT_METADATA_PRESETS: Record<string, EventMetadataPreset> = {
  "bot sumo": {
    image: "/images/events/rc-robowar.jpg",
    tagline: "Autonomous & RC combat robots pushing adversaries off the dohyo ring.",
    rounds: [
      { title: "ROUND 1: TACTICAL SEEDING", desc: "Circular ring qualifiers scoring push-outs and ring control." },
      { title: "ROUND 2: RING FINALS", desc: "Best-of-three championship rounds in the circular arena." },
    ],
    rules: [
      "Robots must comply with dimensional envelope and weight limits (under 3kg).",
      "No sticky tires, vacuum suction, or weapon systems that damage the ring surface.",
    ],
  },
  "algostrike": {
    image: "/images/events/reso-mantrastra.jpg",
    tagline: "High-octane competitive programming sprint under algorithmic stress.",
    rounds: [
      { title: "ROUND 1: ALGORITHMIC SPRINT", desc: "60-minute time-constrained challenge on core data structures." },
      { title: "ROUND 2: CODE GLADIATOR FINALS", desc: "Advanced dynamic programming, graph theory, and NP dilemmas." },
    ],
    rules: [
      "Individual solo participation only. Automated code similarity audit active.",
      "Accepted languages: C++, Python, Java, Rust.",
    ],
  },
  "robowars": {
    image: "/images/events/rc-robowar.jpg",
    tagline: "Sparks, shattered steel, and titanium armor inside the combat cage.",
    rounds: [
      { title: "ROUND 1: KNOCKOUT BRACKET", desc: "3-minute duels scored on damage, aggression, and arena control." },
      { title: "ROUND 2: THE GRAND CARNAGE", desc: "Championship deathmatch to determine ultimate arena dominance." },
    ],
    rules: [
      "Fail-safe RF transmission inspected before cage entry.",
      "Pyrotechnics, liquids, and untethered projectiles strictly prohibited.",
    ],
  },
  "skyrush": {
    image: "/images/events/ieee-hydroracer.jpg",
    tagline: "High-speed indoor & outdoor FPV drone racing through neon obstacles.",
    rounds: [
      { title: "HEAT 1: TIME TRIAL SPRINT", desc: "Solo obstacle circuit lap-time recording." },
      { title: "HEAT 2: GATED RACING FINALS", desc: "Simultaneous multi-quad navigation through illuminated gates." },
    ],
    rules: [
      "5.8GHz video transmission frequency allocation coordinated with track control.",
      "Propeller guards mandatory for indoor segments.",
    ],
  },
  "imperium pitch": {
    image: "/images/events/sae-davinci.jpg",
    tagline: "Strategic business case analysis and executive venture pitching.",
    rounds: [
      { title: "ROUND 1: EXECUTIVE BRIEF", desc: "Slide deck audit and market feasibility evaluation." },
      { title: "ROUND 2: JURY SHARK TANK", desc: "7-minute venture presentation followed by rigorous jury Q&A." },
    ],
    rules: [
      "Pitch decks must follow 10-slide venture format.",
      "Financial projections and market sizing must be defended with verifiable sources.",
    ],
  },
  "tactical strike": {
    image: "/images/events/rc-laser-strike.jpg",
    tagline: "High-stakes 5v5 tactical esports tournament on dedicated LAN servers.",
    rounds: [
      { title: "STAGE 1: GROUP STAGE", desc: "Round-robin best-of-one bracket elimination." },
      { title: "STAGE 2: GRAND FINALS", desc: "Best-of-three grand final on main auditorium projection." },
    ],
    rules: [
      "Standard competitive tournament rules and map pool apply.",
      "Third-party cheats, macros, or unauthorized config injections result in instant ban.",
    ],
  },
  "valorant": {
    image: "/images/events/rc-laser-strike.jpg",
    tagline: "Tactical FPS championship testing aim, strategy, and utility execution.",
    rounds: [
      { title: "STAGE 1: GROUP BRACKET", desc: "Single-elimination qualification bracket." },
      { title: "STAGE 2: CHAMPIONSHIP SHOWDOWN", desc: "Best-of-three tactical standoff." },
    ],
    rules: ["Competitive tournament mode active on Mumbai servers."],
  },
};

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  TECHNICAL: "/images/events/reso-mantrastra.jpg",
  CODING: "/images/events/reso-mantrastra.jpg",
  ROBOTICS: "/images/events/rc-robowar.jpg",
  AERO: "/images/events/ieee-hydroracer.jpg",
  GAMING: "/images/events/rc-laser-strike.jpg",
  MANAGEMENT: "/images/events/sae-davinci.jpg",
  CULTURAL: "/images/events/tsc-vail.jpg",
};

export const ALL_EVENTS: DetailedEvent[] = [];

// ─── 3D Circular Loop Position Calculator ─────────────────────────────────────
function getCircleCardTransform(
  index: number,
  activeIndex: number,
  total: number,
  isMobile: boolean
) {
  if (total <= 1) {
    return {
      transform: "translate3d(-50%, -50%, 0px) scale(1)",
      zIndex: 50,
      opacity: 1,
      pointerEvents: "auto" as const,
      visibility: "visible" as const,
      isFront: true,
      filter: "none",
    };
  }

  // Shortest angular difference in wrapped space [-total/2, total/2]
  let diff = (index - activeIndex) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  const absDiff = Math.abs(diff);
  const sign = Math.sign(diff);
  const maxVisible = isMobile ? 2 : 3;

  // Off-screen / far cards are culled completely to prevent Z-fighting and visual collision
  if (absDiff > maxVisible) {
    const farX = sign * (isMobile ? 240 : 600);
    return {
      transform: `translate3d(calc(-50% + ${farX}px), -50%, -500px) scale(0.5)`,
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
      visibility: "hidden" as const,
      isFront: false,
      filter: "none",
    };
  }

  // Active / Front Center Card
  if (absDiff === 0) {
    return {
      transform: "translate3d(-50%, -50%, 0px) rotateY(0deg) scale(1)",
      zIndex: 50,
      opacity: 1,
      pointerEvents: "auto" as const,
      visibility: "visible" as const,
      isFront: true,
      filter: "none",
    };
  }

  // Flanking cards with guaranteed Z-clearance so background cards NEVER penetrate or clip through front cards
  let x = 0;
  let z = 0;
  let rotateY = 0;
  let scale = 1;
  let opacity = 1;
  const zIndex = 50 - Math.round(absDiff * 10);

  if (isMobile) {
    if (absDiff === 1) {
      x = sign * 140;
      z = -120;
      rotateY = -sign * 18;
      scale = 0.85;
      opacity = 0.7;
    } else if (absDiff === 2) {
      x = sign * 220;
      z = -220;
      rotateY = -sign * 28;
      scale = 0.72;
      opacity = 0.35;
    }
  } else {
    if (absDiff === 1) {
      x = sign * 270;
      z = -150;
      rotateY = -sign * 22;
      scale = 0.88;
      opacity = 0.75;
    } else if (absDiff === 2) {
      x = sign * 440;
      z = -280;
      rotateY = -sign * 34;
      scale = 0.76;
      opacity = 0.45;
    } else if (absDiff === 3) {
      x = sign * 580;
      z = -400;
      rotateY = -sign * 44;
      scale = 0.65;
      opacity = 0.18;
    }
  }

  return {
    transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(
      1
    )}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
    zIndex,
    opacity,
    pointerEvents: "auto" as const,
    visibility: "visible" as const,
    isFront: false,
    filter: "none",
  };
}

// ─── Stack & Circle Loop Card Item Component ──────────────────────────────────
interface StackCardProps {
  event: DetailedEvent;
  index: number;
  total: number;
  isStacked: boolean;
  activeIndex: number;
  isMobile: boolean;
  onClick: () => void;
}

function StackCardItem({
  event,
  index,
  total,
  isStacked,
  activeIndex,
  isMobile,
  onClick,
}: StackCardProps) {
  const counterNumber = String(index + 1).padStart(2, "0");

  if (!isStacked) {
    // ── Grid View Card ────────────────────────────────────────────────────────
    return (
      <div className="grid-card-wrap group" onClick={onClick}>
        {/* Layer 1: .shadow offset layer */}
        <div className="shadow" />

        {/* Layer 2: .inner surface in stark Black & White */}
        <div className="inner">
          {/* Real Extracted Event Photo */}
          <div className="card-image-wrap">
            <img
              src={getOptimizedImageUrl(event.image, 600)}
              alt={event.name}
              loading="lazy"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/events-hero-poster.webp";
              }}
              className="w-full h-full object-cover select-none"
            />
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-white font-medium">
                {event.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-amber-300/90 font-medium">
                {event.clubName}
              </span>
            </div>
          </div>

          {/* Event Content */}
          <div className="px-1 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg tracking-tight uppercase leading-snug line-clamp-2 min-h-[2.75rem]">
                {event.name}
              </h3>
              <p className="mt-1 text-white/70 text-[11px] sm:text-xs line-clamp-3 leading-relaxed font-sans">
                {event.description}
              </p>
            </div>

            {/* Bottom Row - pr-12 ensures counter NEVER overlaps specs */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2 relative pr-12">
              <div className="font-mono text-[10px] text-white/80 flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-bold whitespace-nowrap">🏆 {event.prizePool}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60 whitespace-nowrap">{event.teamSize}</span>
              </div>
              <div className="counter">{counterNumber}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3D Circular Loop Stacked Card ───────────────────────────────────────────
  const circleStyle = getCircleCardTransform(index, activeIndex, total, isMobile);

  return (
    <div
      onClick={onClick}
      className={`stack-cards__item group ${circleStyle.isFront ? "is-front" : ""}`}
      style={{
        transform: circleStyle.transform,
        zIndex: circleStyle.zIndex,
        opacity: circleStyle.opacity,
        visibility: circleStyle.visibility,
        pointerEvents: circleStyle.pointerEvents,
        filter: circleStyle.filter,
      }}
    >
      {/* Layer 1: .shadow offset layer */}
      <div className="shadow" />

      {/* Layer 2: .inner surface in stark Black & White */}
      <div className="inner">
        {/* Real Extracted Event Photo */}
        <div className="card-image-wrap">
          <img
            src={getOptimizedImageUrl(event.image, 600)}
            alt={event.name}
            loading="lazy"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/events-hero-poster.webp";
            }}
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-white font-semibold">
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-amber-300/90 font-semibold">
              {event.clubName}
            </span>
          </div>
        </div>

        {/* Event Content & Lore */}
        <div className="px-1 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg tracking-tight uppercase leading-snug line-clamp-2 min-h-[2.75rem]">
              {event.name}
            </h3>
            <p className="mt-1 text-white/75 text-[11px] sm:text-xs line-clamp-3 leading-relaxed font-sans">
              {event.description}
            </p>
          </div>

          {/* Bottom Row & Counter - pr-12 ensures counter NEVER overlaps specs */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2 relative pr-12">
            <div className="font-mono text-[10px] text-white/80 flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-semibold whitespace-nowrap">🏆 {event.prizePool}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60 whitespace-nowrap">{event.teamSize}</span>
            </div>
            <div className="counter">{counterNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stark Monochrome Category Tab Button ────────────────────────────────────────
export type EventCategoryKey =
  | "ALL"
  | "TECHNICAL"
  | "ROBOTICS"
  | "GAMING"
  | "MANAGEMENT"
  | "CULTURAL";

export interface CategoryTabItem {
  id: EventCategoryKey;
  label: string;
  tagline: string;
  glowColor: string;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  {
    id: "ALL",
    label: "EVENTS",
    tagline: "",
    glowColor: "rgba(255, 255, 255, 0.4)",
  },
  {
    id: "TECHNICAL",
    label: "TECHNICAL & CODE",
    tagline: "Competitive programming, blind algorithms, system architecture & web engineering.",
    glowColor: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "ROBOTICS",
    label: "ROBOTICS & COMBAT",
    tagline: "Battle-tested machines — RoboWars, laser strike skirmishes & autonomous drones.",
    glowColor: "rgba(234, 179, 8, 0.5)",
  },
  {
    id: "GAMING",
    label: "GAMING & ESPORTS",
    tagline: "High-octane competitive LAN showdowns, tactical FPS & gaming battles.",
    glowColor: "rgba(220, 38, 38, 0.5)",
  },
  {
    id: "MANAGEMENT",
    label: "MANAGEMENT & STRATEGY",
    tagline: "Venture pitch conclaves, strategic turnarounds & corporate leadership.",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: "CULTURAL",
    label: "CULTURAL & FLAGSHIP",
    tagline: "Vail cosplay spectacle, talent show trials & personality pageants.",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
];

function CategoryTab({
  tab,
  count,
  isActive,
  onClick,
}: {
  tab: CategoryTabItem;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 border cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-2 sm:gap-2.5 ${
        isActive
          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold"
          : "bg-transparent text-neutral-400 border-white/15 hover:border-white/40 hover:text-white"
      }`}
      style={{
        clipPath: isActive
          ? "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
          : undefined,
      }}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
          isActive ? "bg-black" : "bg-white/40"
        }`}
      />
      <span>{tab.label}</span>
      <span className={`ml-0.5 font-normal ${isActive ? "text-black/70" : "text-neutral-500"}`}>
        {count}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export interface ClubEventsSectionProps {
  activeClubId?: ClubId | null;
  activeCategoryId?: EventCategoryKey | string | null;
  onReturnToArena?: () => void;
}

export function ClubEventsSection({
  activeClubId: propActiveClubId,
  activeCategoryId: propActiveCategoryId,
  onReturnToArena,
}: ClubEventsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<EventCategoryKey>("ALL");
  const [eventsList, setEventsList] = useState<DetailedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEventModal, setActiveEventModal] = useState<DetailedEvent | null>(null);
  const [viewMode, setViewMode] = useState<"stack" | "grid">("stack");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const liveEvents = await api.events.list();
        if (!isMounted) return;

        if (liveEvents && liveEvents.length > 0) {
          const clubIdMap: Record<string, ClubId> = {
            TSC: "tsc",
            RC: "robotics",
            IEEE: "ieee-stb",
            SAE: "sae",
            RESO: "mmmut-reso",
          };

          const clubNameMap: Record<string, string> = {
            TSC: "TechSrijan Core",
            RC: "Robotics Club",
            IEEE: "IEEE-STB MMMUT",
            SAE: "SAE Collegiate Club",
            RESO: "MMMUT RESO",
          };

          const mappedLive: DetailedEvent[] = liveEvents.map((be) => {
            const lowerTitle = (be.title || "").toLowerCase();
            const lowerSlug = (be.slug || "").toLowerCase();
            const matchedKey = Object.keys(EVENT_METADATA_PRESETS).find(
              (key) => lowerTitle.includes(key) || lowerSlug.includes(key)
            );
            const preset = matchedKey ? EVENT_METADATA_PRESETS[matchedKey] : undefined;

            const normClub = (be.organizingClub || "TSC").toUpperCase();
            const clubId = clubIdMap[normClub] || "tsc";
            const clubName = clubNameMap[normClub] || "TechSrijan Core";
            const catUpper = (be.category || "TECHNICAL").toUpperCase();

            return {
              id: be.id,
              clubId,
              clubName,
              name: be.title,
              category: catUpper,
              tagline:
                preset?.tagline ||
                `Championship arena in ${be.category.toLowerCase()}.`,
              description:
                preset?.description ||
                be.rulesText ||
                `${be.title} organized by ${clubName}. Compete for glory and a prize pool of ₹${be.prizePool.toLocaleString("en-IN")}.`,
              prizePool: `₹${be.prizePool.toLocaleString("en-IN")}`,
              teamSize:
                be.maxTeamSize > 1
                  ? be.minTeamSize === be.maxTeamSize
                    ? `Teams of ${be.maxTeamSize}`
                    : `${be.minTeamSize} to ${be.maxTeamSize} Members`
                  : "Solo (1)",
              venue: be.venue || "Main Campus Complex",
              date: "TechSrijan '27",
              image:
                preset?.image ||
                CATEGORY_DEFAULT_IMAGES[catUpper] ||
                "/events-hero-poster.webp",
              rounds: preset?.rounds || [
                { title: "STAGE 1: QUALIFIER", desc: "Preliminary competitive screening and evaluation." },
                { title: "STAGE 2: FINALS", desc: "Championship showdown before the official jury." },
              ],
              rules:
                preset?.rules ||
                (be.rulesText ? [be.rulesText] : ["Standard TechSrijan tournament rules and fair-play regulations apply."]),
            };
          });

          setEventsList(mappedLive);
        } else {
          setEventsList([]);
        }
      } catch (err) {
        console.warn("Could not fetch events from database:", err);
        if (isMounted) setEventsList([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Detect mobile screen width for circle radius scaling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync with prop when clicked from arena cards
  useEffect(() => {
    let targetCat: EventCategoryKey | null = null;
    if (propActiveCategoryId) {
      targetCat = propActiveCategoryId as EventCategoryKey;
    } else if (propActiveClubId) {
      const clubToCategory: Record<string, EventCategoryKey> = {
        tsc: "CULTURAL",
        "mmmut-reso": "TECHNICAL",
        "ieee-stb": "TECHNICAL",
        robotics: "ROBOTICS",
        sae: "MANAGEMENT",
      };
      targetCat = clubToCategory[propActiveClubId] || null;
    }

    if (targetCat) {
      setActiveCategory(targetCat);
      setActiveIndex(0);
      setTimeout(() => {
        const activeBtn = tabsRef.current?.querySelector(`[data-catid="${targetCat}"]`) as HTMLElement;
        if (activeBtn && tabsRef.current) {
          const container = tabsRef.current;
          const scrollLeft =
            activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
          container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
        }
      }, 60);
    }
  }, [propActiveCategoryId, propActiveClubId]);

  const getCategoryCount = (catKey: EventCategoryKey) => {
    if (catKey === "ALL") return eventsList.length;
    return eventsList.filter((e) => {
      const c = e.category.toUpperCase();
      if (catKey === "TECHNICAL") {
        return c === "TECHNICAL" || c.includes("CODE") || c.includes("CODING") || c.includes("PROGRAMMING") || c.includes("INNOVATION") || c.includes("ACCESSIBILITY") || c.includes("RELAY") || c.includes("CIRCUITS");
      }
      if (catKey === "ROBOTICS") {
        return c === "ROBOTICS" || c.includes("ROBOT") || c.includes("DRONE") || c.includes("AERO") || c.includes("HARDWARE") || c.includes("SPORTS") || c.includes("FORENSICS");
      }
      if (catKey === "GAMING") {
        return c === "GAMING" || c.includes("GAMING") || c.includes("ESPORTS") || c.includes("VALORANT") || c.includes("STRIKE");
      }
      if (catKey === "MANAGEMENT") {
        return c === "MANAGEMENT" || c.includes("MANAGEMENT") || c.includes("VENTURE") || c.includes("STRATEGY") || c.includes("PRODUCT") || c.includes("BUSINESS") || c.includes("CASE");
      }
      if (catKey === "CULTURAL") {
        return c === "CULTURAL" || c.includes("COSPLAY") || c.includes("PERSONALITY") || c.includes("TALENT") || c.includes("CIVIL") || c.includes("DESIGN");
      }
      return c === catKey;
    }).length;
  };

  const filteredEvents =
    activeCategory === "ALL"
      ? eventsList
      : eventsList.filter((e) => {
          const c = e.category.toUpperCase();
          if (activeCategory === "TECHNICAL") {
            return c === "TECHNICAL" || c.includes("CODE") || c.includes("CODING") || c.includes("PROGRAMMING") || c.includes("INNOVATION") || c.includes("ACCESSIBILITY") || c.includes("RELAY") || c.includes("CIRCUITS");
          }
          if (activeCategory === "ROBOTICS") {
            return c === "ROBOTICS" || c.includes("ROBOT") || c.includes("DRONE") || c.includes("AERO") || c.includes("HARDWARE") || c.includes("SPORTS") || c.includes("FORENSICS");
          }
          if (activeCategory === "GAMING") {
            return c === "GAMING" || c.includes("GAMING") || c.includes("ESPORTS") || c.includes("VALORANT") || c.includes("STRIKE");
          }
          if (activeCategory === "MANAGEMENT") {
            return c === "MANAGEMENT" || c.includes("MANAGEMENT") || c.includes("VENTURE") || c.includes("STRATEGY") || c.includes("PRODUCT") || c.includes("BUSINESS") || c.includes("CASE");
          }
          if (activeCategory === "CULTURAL") {
            return c === "CULTURAL" || c.includes("COSPLAY") || c.includes("PERSONALITY") || c.includes("TALENT") || c.includes("CIVIL") || c.includes("DESIGN");
          }
          return c === activeCategory;
        });

  const activeCategoryTab =
    CATEGORY_TABS.find((t) => t.id === activeCategory) || CATEGORY_TABS[0];

  // Reset circle index when switching categories
  const handleTabClick = (catId: EventCategoryKey) => {
    setActiveCategory(catId);
    setActiveIndex(0);
    setTimeout(() => {
      const activeBtn = tabsRef.current?.querySelector(`[data-catid="${catId}"]`) as HTMLElement;
      if (activeBtn && tabsRef.current) {
        const container = tabsRef.current;
        const scrollLeft =
          activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
        container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
      }
    }, 60);
  };

  // Next / Prev circular navigation
  const handleNextCard = useCallback(() => {
    if (filteredEvents.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredEvents.length);
  }, [filteredEvents.length]);

  const handlePrevCard = useCallback(() => {
    if (filteredEvents.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  }, [filteredEvents.length]);

  const handleResetLoop = () => {
    setActiveIndex(0);
  };

  // Native non-passive wheel listener on the card stage:
  // When scrolling over the 3D cards, advance/rewind cards smoothly without scrolling the background page.
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el || viewMode !== "stack") return;

    const onWheel = (e: WheelEvent) => {
      if (filteredEvents.length <= 1) return;

      const primaryDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(primaryDelta) < 12) return;

      // Prevent the page from scrolling away while user is interacting with the card deck
      e.preventDefault();

      const now = Date.now();
      // Throttle to prevent trackpad momentum / rapid wheel ticks from skipping multiple cards
      if (now - lastScrollTimeRef.current < 220) return;
      lastScrollTimeRef.current = now;

      if (primaryDelta > 0) {
        handleNextCard();
      } else {
        handlePrevCard();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [viewMode, filteredEvents.length, handleNextCard, handlePrevCard]);

  // Keyboard navigation when stage is in viewport
  useEffect(() => {
    if (viewMode !== "stack" || filteredEvents.length <= 1) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const el = stageContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode, filteredEvents.length, handleNextCard, handlePrevCard]);

  // Touch swipe support: handles both horizontal and vertical swipes on the card deck
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Allow native page scroll for vertical drags. Only trigger card navigation on clear horizontal swipes:
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) {
        handleNextCard();
      } else {
        handlePrevCard();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <section
      id="our-events-section"
      ref={sectionRef}
      className="relative w-full bg-[#030406] overflow-x-clip text-white min-h-screen"
    >
      {/* ── Interactive Cosmic Particle Field (Micro Stardust, Cyber Sparks, Floating Bokeh Orbs & Shockwaves) ── */}
      <InteractiveDossierParticles activeClubGlow={activeCategoryTab.glowColor} />

      {/* Subtle Monochrome Dune Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Atmospheric Feather Blend from Arena Void */}
      <div className="absolute top-0 inset-x-0 h-40 sm:h-56 bg-gradient-to-b from-[#030406] via-[#030406]/80 to-transparent pointer-events-none z-15" />

      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-14 sm:pt-20 pb-5 sm:pb-7 px-4 sm:px-8 text-center border-b border-white/10">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-montserrat font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
        >
          OUR EVENTS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-2 font-sans italic text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed"
        >
          &ldquo;A dynamic lineup of technical, creative, and high-energy competitions divided by event disciplines.&rdquo;
        </motion.p>
      </div>

      {/* ── Category Filter Tabs Bar ────────────────────────────────────────── */}
      <div className="relative z-10 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="flex items-center justify-between gap-4 w-full max-w-7xl 2xl:max-w-[1720px] mx-auto">
          {/* Category Tabs */}
          <div
            ref={tabsRef}
            className="flex items-center gap-2 sm:gap-3 md:gap-3.5 overflow-x-auto scrollbar-none pb-0.5 flex-1"
          >
            {CATEGORY_TABS.map((tab) => (
              <div key={tab.id} data-catid={tab.id}>
                <CategoryTab
                  tab={tab}
                  count={getCategoryCount(tab.id)}
                  isActive={activeCategory === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            

            {/* View Mode Toggle: Orbit Circle vs Grid */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-black/60 rounded-lg sm:rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setViewMode("stack")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg font-mono text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "stack"
                    ? "bg-white text-black font-bold border border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Circle Loop View"
              >
                <Orbit className="w-3 h-3" />
                <span className="hidden xs:inline sm:inline">Circle Loop</span>
                <span className="xs:hidden sm:hidden">Circle</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg font-mono text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-black font-bold border border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="All Cards View"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>All Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Category Eyebrow & Subtitle ───────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4 w-full max-w-7xl 2xl:max-w-[1720px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          {/* Active Category Shield Seal */}
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full p-1 bg-black/80 border border-white/25 flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105 font-mono text-white text-xs sm:text-sm font-black tracking-widest uppercase"
            style={{
              boxShadow: `0 0 24px ${activeCategoryTab.glowColor || "rgba(255,255,255,0.25)"}`,
            }}
          >
            {activeCategoryTab.id.slice(0, 3)}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <div className="w-4 h-[1px] bg-white" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/80 uppercase">
                {filteredEvents.length} Competitions
              </span>
            </div>
            <h3 className="font-montserrat font-bold text-2xl sm:text-4xl tracking-tight text-white uppercase">
              {activeCategoryTab.label}
            </h3>
            {activeCategoryTab.tagline && (
              <p className="mt-1 font-sans text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                {activeCategoryTab.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Controls row */}
        {viewMode === "stack" ? (
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-white/60 mr-1 sm:mr-2">
              {filteredEvents.length > 0 ? activeIndex + 1 : 0} / {filteredEvents.length}
            </span>
            <button
              type="button"
              onClick={handlePrevCard}
              disabled={filteredEvents.length <= 1}
              className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Previous Event"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              disabled={filteredEvents.length <= 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 border border-white text-black font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] flex items-center gap-1.5 cursor-pointer active:scale-95 text-xs sm:text-sm"
              title="Rotate Circle Loop"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetLoop}
              className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Reset Loop"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white/80 hover:text-white text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 ml-auto"
              title="View All Cards in Grid"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>All Cards</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="text-white/60 mr-1 sm:mr-2">
              {filteredEvents.length} {filteredEvents.length === 1 ? "EVENT" : "EVENTS"}
            </span>
            <button
              type="button"
              onClick={() => setViewMode("stack")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-white/10 border border-white/25 text-white/90 hover:text-white text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              title="Switch to Circle Loop"
            >
              <Orbit className="w-3.5 h-3.5 text-white" />
              <span>Circle Loop</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Cards Presentation Area ─────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase">
              SYNCHRONIZING DOSSIER WITH ARENA DATABASE...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
            <p className="font-mono text-sm text-neutral-400 tracking-widest uppercase">
              // NO EVENTS IN THIS CATEGORY
            </p>
            <p className="font-sans text-xs text-neutral-500 max-w-sm">
              No live database events found under {activeCategoryTab.label}. Select &ldquo;ALL ARENAS&rdquo; to browse all active championships.
            </p>
          </div>
        ) : viewMode === "stack" ? (
          /* 3D Circular Loop Interactive Stage with Scroll Wheel / Gesture Support */
          <div
            ref={stageContainerRef}
            className="relative py-8 sm:py-12 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="stack-cards-stage w-full">
              <div className="stack-cards">
                {filteredEvents.map((ev, i) => (
                  <StackCardItem
                    key={ev.id}
                    event={ev}
                    index={i}
                    total={filteredEvents.length}
                    isStacked={true}
                    activeIndex={activeIndex}
                    isMobile={isMobile}
                    onClick={() => {
                      if (i === activeIndex) {
                        setActiveEventModal(ev);
                      } else {
                        setActiveIndex(i);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Circular Orbit Pagination Dots */}
            {filteredEvents.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {filteredEvents.map((ev, i) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === activeIndex
                        ? "w-7 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : "w-2 h-2 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Jump to ${ev.name}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Responsive Grid View */
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 justify-items-center">
            {filteredEvents.map((ev, i) => (
              <StackCardItem
                key={ev.id}
                event={ev}
                index={i}
                total={filteredEvents.length}
                isStacked={false}
                activeIndex={activeIndex}
                isMobile={isMobile}
                onClick={() => setActiveEventModal(ev)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detailed Event Modal ────────────────────────────────────────────── */}
      <EventDetailModal
        event={activeEventModal}
        onClose={() => setActiveEventModal(null)}
      />
    </section>
  );
}

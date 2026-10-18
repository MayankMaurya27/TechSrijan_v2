import type { CanonicalTheme } from "@/core";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

export const CITADEL_FRAME = getOptimizedImageUrl("/images/citadel-frame.webp", 700);

export interface CitadelThemeConfig {
  id: CanonicalTheme;
  frameFilter: string;
  cardBacking: string;
  cardInnerBorder: string;
  accent: string;
  accentBright: string;
  accentGlow: string;
  accentMuted: string;
  subtext: string;
  headingShadow: string;
  eventNumber: string;
  eventItemBorder: string;
  eventItemBg: string;
  eventItemHoverBg: string;
  eventItemHoverBorder: string;
  rowHoverShadow: string;
  eventCategoryBorder: string;
  eventCategoryText: string;
  eventCategoryBg: string;
  btnBorder: string;
  btnBg: string;
  btnHoverBg: string;
  btnHoverBorder: string;
  btnShadow: string;
  btnText: string;
  sponsorRingSecondary: string;
  sponsorInnerBg: string;
  dotActive: string;
  dotInactive: string;
  quoteBorder: string;
  guideLines: string;
  guideText: string;
  mobileHudBorder: string;
  mobileHudActiveBg: string;
  mobileHudActiveText: string;
  mobileHudActiveShadow: string;
  mobileNavArrowBorder: string;
  mobileNavArrowGlow: string;
}

export const CITADEL_THEMES: Record<CanonicalTheme, CitadelThemeConfig> = {
  "arrakis-day": {
    id: "arrakis-day",
    frameFilter: "drop-shadow(0 15px 35px rgba(0,0,0,0.95))",
    cardBacking: "bg-gradient-to-b from-black/65 via-[#1a120c]/70 to-black/85",
    cardInnerBorder: "border border-[#d4a843]/20",
    accent: "#d4a843",
    accentBright: "#ffd685",
    accentGlow: "rgba(212, 168, 67, 0.45)",
    accentMuted: "rgba(212, 168, 67, 0.15)",
    subtext: "#c4b79b",
    headingShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
    eventNumber: "#d4a843",
    eventItemBorder: "border-[#d4a843]/20",
    eventItemBg: "bg-black/60",
    eventItemHoverBg: "hover:bg-[#d4a843]/15",
    eventItemHoverBorder: "hover:border-[#d4a843]/70",
    rowHoverShadow: "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(0, 0, 0, 0.4)",
    eventCategoryBorder: "border-[#d4a843]/30",
    eventCategoryText: "#d4a843",
    eventCategoryBg: "bg-black/50",
    btnBorder: "border-[#d4a843]/50",
    btnBg: "bg-[#d4a843]/15",
    btnHoverBg: "hover:bg-[#d4a843]/30",
    btnHoverBorder: "hover:border-[#d4a843]",
    btnShadow: "shadow-md hover:shadow-lg",
    btnText: "#F0EAE1",
    sponsorRingSecondary: "#d4a843",
    sponsorInnerBg: "bg-gradient-to-b from-[#1c120c] to-[#0a0604]",
    dotActive: "bg-[#d4a843] shadow-sm",
    dotInactive: "bg-[#d4a843]/30 hover:bg-[#d4a843]/60",
    quoteBorder: "border-l-2 border-[#d4a843]/70",
    guideLines: "from-transparent via-[#d4a843]/25 to-transparent",
    guideText: "text-[#d4a843]/45",
    mobileHudBorder: "border-[#d4a843]/30",
    mobileHudActiveBg: "bg-[#d4a843]",
    mobileHudActiveText: "text-black",
    mobileHudActiveShadow: "shadow-sm",
    mobileNavArrowBorder: "border-[#d4a843]/60",
    mobileNavArrowGlow: "shadow-md",
  },
  "geass-moon": {
    id: "geass-moon",
    frameFilter: "hue-rotate(342deg) saturate(2.4) contrast(1.30) brightness(0.80) drop-shadow(0 15px 35px rgba(0,0,0,0.95))",
    cardBacking: "bg-gradient-to-b from-black/85 via-[#180204]/90 to-black/95",
    cardInnerBorder: "border border-[#b30006]/35",
    accent: "#E5000A",
    accentBright: "#FF2222",
    accentGlow: "rgba(220, 0, 10, 0.65)",
    accentMuted: "rgba(200, 0, 10, 0.18)",
    subtext: "#D4B2B2",
    headingShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
    eventNumber: "#E5000A",
    eventItemBorder: "border-[#b30006]/30",
    eventItemBg: "bg-black/75",
    eventItemHoverBg: "hover:bg-[#800005]/30",
    eventItemHoverBorder: "hover:border-[#E5000A]",
    rowHoverShadow: "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(0, 0, 0, 0.4)",
    eventCategoryBorder: "border-[#b30006]/45",
    eventCategoryText: "#FF2222",
    eventCategoryBg: "bg-black/70",
    btnBorder: "border-[#cc000a]/70",
    btnBg: "bg-[#990008]/30",
    btnHoverBg: "hover:bg-[#b8000a]/50",
    btnHoverBorder: "hover:border-[#FF2222]",
    btnShadow: "shadow-md hover:shadow-lg",
    btnText: "#FFFFFF",
    sponsorRingSecondary: "#E5000A",
    sponsorInnerBg: "bg-gradient-to-b from-[#1c0204] to-[#080102]",
    dotActive: "bg-[#E5000A] shadow-sm",
    dotInactive: "bg-[#b30006]/35 hover:bg-[#E5000A]/70",
    quoteBorder: "border-l-2 border-[#E5000A]",
    guideLines: "from-transparent via-[#b30006]/40 to-transparent",
    guideText: "text-[#E5000A]/70",
    mobileHudBorder: "border-[#b30006]/40",
    mobileHudActiveBg: "bg-[#b80008]",
    mobileHudActiveText: "text-white",
    mobileHudActiveShadow: "shadow-sm",
    mobileNavArrowBorder: "border-[#b30006]/70",
    mobileNavArrowGlow: "shadow-md",
  },
  "krelln-night": {
    id: "krelln-night",
    frameFilter: "grayscale(0.92) contrast(1.22) brightness(1.08) drop-shadow(0 15px 35px rgba(0,0,0,0.95))",
    cardBacking: "bg-gradient-to-b from-black/75 via-[#0e131b]/80 to-black/90",
    cardInnerBorder: "border border-[#94a3b8]/20",
    accent: "#cbd5e1",
    accentBright: "#ffffff",
    accentGlow: "rgba(203, 213, 225, 0.45)",
    accentMuted: "rgba(203, 213, 225, 0.16)",
    subtext: "#94a3b8",
    headingShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
    eventNumber: "#cbd5e1",
    eventItemBorder: "border-[#94a3b8]/25",
    eventItemBg: "bg-black/60",
    eventItemHoverBg: "hover:bg-[#cbd5e1]/15",
    eventItemHoverBorder: "hover:border-[#cbd5e1]/75",
    rowHoverShadow: "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(0, 0, 0, 0.4)",
    eventCategoryBorder: "border-[#94a3b8]/35",
    eventCategoryText: "#cbd5e1",
    eventCategoryBg: "bg-black/60",
    btnBorder: "border-[#94a3b8]/50",
    btnBg: "bg-[#475569]/30",
    btnHoverBg: "hover:bg-[#64748b]/40",
    btnHoverBorder: "hover:border-[#cbd5e1]",
    btnShadow: "shadow-md hover:shadow-lg",
    btnText: "#FFFFFF",
    sponsorRingSecondary: "#94a3b8",
    sponsorInnerBg: "bg-gradient-to-b from-[#141b24] to-[#080b0f]",
    dotActive: "bg-[#cbd5e1] shadow-sm",
    dotInactive: "bg-[#94a3b8]/30 hover:bg-[#94a3b8]/60",
    quoteBorder: "border-l-2 border-[#cbd5e1]/75",
    guideLines: "from-transparent via-[#cbd5e1]/25 to-transparent",
    guideText: "text-[#cbd5e1]/45",
    mobileHudBorder: "border-[#94a3b8]/30",
    mobileHudActiveBg: "bg-[#cbd5e1]",
    mobileHudActiveText: "text-black",
    mobileHudActiveShadow: "shadow-sm",
    mobileNavArrowBorder: "border-[#94a3b8]/60",
    mobileNavArrowGlow: "shadow-md",
  },
};

export interface DirectiveItem {
  id: string;
  title: string;
  meta: string;
  category: string;
  link: string;
}

export const FEATURED_DIRECTIVES: DirectiveItem[] = [
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

export interface SponsorItem {
  id: string;
  name: string;
  tier: string;
  tagline: string;
  image: string;
  accent: string;
  glow: string;
}

export const SPONSORS_SHOWCASE: SponsorItem[] = [
  {
    id: "imperium",
    name: "IMPERIUM TECHNOLOGIES",
    tier: "TITLE SPONSOR",
    tagline: "Apex Strategic Patron",
    image: getOptimizedImageUrl("/images/sponsors/cp-1.webp", 400),
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.9)",
  },
  {
    id: "robokriti",
    name: "ROBOKRITI ROBOTICS",
    tier: "POWERED BY SPONSOR",
    tagline: "Robotics Arena Partner",
    image: getOptimizedImageUrl("/images/sponsors/cp-2.webp", 400),
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.9)",
  },
  {
    id: "purvanchal",
    name: "PURVANCHAL TECH NEXUS",
    tier: "ASSOCIATE SPONSOR",
    tagline: "Regional Technology Syndicate",
    image: getOptimizedImageUrl("/images/sponsors/3-sigil.webp", 400),
    accent: "#EF4444",
    glow: "rgba(239, 68, 68, 0.9)",
  },
];

export interface TransmissionItem {
  id: string;
  quote: string;
  author: string;
  dept: string;
  year: string;
}

export const TRANSMISSIONS: TransmissionItem[] = [
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

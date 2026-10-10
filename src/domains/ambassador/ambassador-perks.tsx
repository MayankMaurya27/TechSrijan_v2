"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useAmbassadorTheme } from "./ambassador-theme";

interface PerkItem {
  number: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

// Custom High-Fidelity Sci-Fi Line-Art Icons matching Image 2
const RosetteMedalIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="16" cy="12" r="8" />
    <circle cx="16" cy="12" r="5" strokeDasharray="1.5 2" />
    <path d="M12 18.5 L9 28 L16 24.5 L23 28 L20 18.5" />
    <path d="M16 12 L16 12.01" strokeWidth={3} />
  </svg>
);

const NetworkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="16" cy="9" r="4" />
    <path d="M10 19 C10 15.5 13 14 16 14 C19 14 22 15.5 22 19" />
    <circle cx="7" cy="14" r="3" />
    <path d="M2.5 23 C2.5 20.5 4.5 19.5 7 19.5 C8.5 19.5 9.8 20 10.5 21" />
    <circle cx="25" cy="14" r="3" />
    <path d="M29.5 23 C29.5 20.5 27.5 19.5 25 19.5 C23.5 19.5 22.2 20 21.5 21" />
  </svg>
);

const GrowthBarsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 25 L6 21" strokeWidth={2.2} />
    <path d="M12 25 L12 16" strokeWidth={2.2} />
    <path d="M18 25 L18 11" strokeWidth={2.2} />
    <path d="M24 25 L24 7" strokeWidth={2.2} />
    <path d="M4 27 L28 27" strokeWidth={1.5} opacity={0.4} />
  </svg>
);

const MentorshipIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="16" cy="10" r="3.5" />
    <path d="M10 19 C10 16.5 12.5 15.5 16 15.5 C19.5 15.5 22 16.5 22 19" />
    <path d="M16 29 C22 26 25 21 25 15 L25 7 L16 4 L7 7 L7 15 C7 21 10 26 16 29 Z" />
  </svg>
);

const InternshipsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="5" y="10" width="22" height="16" rx="2.5" />
    <path d="M11 10 L11 7 C11 5.9 11.9 5 13 5 L19 5 C20.1 5 21 5.9 21 7 L21 10" />
    <path d="M5 16 L27 16" opacity={0.6} />
    <rect x="14" y="14" width="4" height="4" rx="0.5" />
  </svg>
);

const RewardsGiftIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="13" width="20" height="14" rx="1.5" />
    <rect x="4.5" y="9" width="23" height="4.5" rx="1" />
    <path d="M16 9 L16 27" />
    <path d="M16 9 C14 5 9 5 11 9 Z" />
    <path d="M16 9 C18 5 23 5 21 9 Z" />
  </svg>
);

const PERKS: PerkItem[] = [
  {
    number: "01",
    title: "CERTIFICATE & LOR",
    description: "Official recognition from Techsrijan, MMMUT Gorakhpur.",
    icon: RosetteMedalIcon,
  },
  {
    number: "02",
    title: "EXCLUSIVE NETWORK",
    description: "Connect with ambassadors across Eastern India.",
    icon: NetworkIcon,
  },
  {
    number: "03",
    title: "LEADERSHIP GROWTH",
    description: "Build event, speaking and outreach skills.",
    icon: GrowthBarsIcon,
  },
  {
    number: "04",
    title: "MENTORSHIP ACCESS",
    description: "Learn directly from the organizing team.",
    icon: MentorshipIcon,
  },
  {
    number: "05",
    title: "PRIORITY INTERNSHIPS",
    description: "Get considered for sponsor opportunities.",
    icon: InternshipsIcon,
  },
  {
    number: "06",
    title: "FESTIVAL REWARDS",
    description: "Earn passes, merchandise and recognition.",
    icon: RewardsGiftIcon,
  },
];

const listContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 45 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AmbassadorPerks() {
  const t = useAmbassadorTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const [activePerk, setActivePerk] = useState<number>(0);

  return (
    <section
      ref={containerRef}
      className="relative pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10 bg-[#040303] overflow-hidden select-none"
    >
      {/* ========================================================
          BACKGROUND LAYER: Topographic Contours & Sci-Fi Grids
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Topographic Elevation Curves (SVG Contour Lines) */}
        <svg
          className="absolute -top-10 -right-10 w-[700px] lg:w-[1000px] h-[600px] lg:h-[800px] opacity-[0.08] pointer-events-none transition-colors duration-500"
          style={{ color: t.accent }}
          viewBox="0 0 1000 800"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M200 0 C400 120 600 80 800 250 C950 380 980 600 1000 800" />
          <path d="M120 0 C320 150 550 140 750 320 C900 460 940 680 1000 750" />
          <path d="M50 0 C250 180 490 200 700 390 C850 540 890 730 950 800" />
          <path d="M0 50 C200 220 420 270 640 460 C790 620 830 780 880 800" />
          <path d="M0 140 C170 290 360 340 580 530 C720 690 760 800 800 800" />
          <path d="M0 240 C140 370 300 420 510 610 C650 760 680 800 700 800" />
          <circle cx="850" cy="220" r="180" strokeDasharray="3 4" opacity="0.4" />
          <circle cx="850" cy="220" r="100" strokeDasharray="2 3" opacity="0.3" />
        </svg>

        {/* Ambient Theme Glow behind HUD Cards */}
        <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-[550px] h-[550px] ${t.perksAtmosphereClass} blur-[150px] rounded-full pointer-events-none transition-colors duration-500`} />

        {/* Subtle Sci-Fi Dot Matrix & Reticle Crosshairs */}
        <div
          className="absolute inset-0 opacity-[0.035] transition-all duration-500"
          style={{
            backgroundImage:
              `radial-gradient(${t.perksDotMatrixColor} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ========================================================
          MAIN CONTENT CONTAINER (Matches Image 2 Split Layout)
          ======================================================== */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ----------------------------------------------------
              LEFT COLUMN: Impact Headline, Mission, CTA & Insignia
              ---------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col pt-1">
            <div>
              {/* Massive Industrial Headline: WHY JOIN THE VANGUARD (Bebas Neue) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[4.85rem] leading-[0.88] tracking-wider">
                  <span className="block text-[#FAF6EE] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] whitespace-nowrap">
                    WHY JOIN
                  </span>
                  <span className={`block ${t.perksHeaderAccent} drop-shadow-[0_0_35px_${t.accentGlow}] transition-colors duration-500 whitespace-nowrap`}>
                    THE VANGUARD
                  </span>
                </h2>
              </motion.div>

              {/* Subtitle / Mission Statement */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 sm:mt-5 max-w-md text-xs sm:text-sm text-neutral-300 font-geist leading-relaxed"
              >
                More than a title. A launchpad for your career, a badge of
                leadership, and your gateway into Eastern UP&apos;s biggest tech
                movement.
              </motion.p>

              {/* Primary Chamfered CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 sm:mt-5"
              >
                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-ambassador-modal"));
                  }}
                  className={`group relative overflow-hidden inline-flex items-center justify-center px-7 py-3 font-mono text-xs sm:text-xs font-bold tracking-[0.2em] uppercase text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} transition-all duration-300 ${t.primaryBtnShadow} ${t.primaryBtnHoverShadow} active:scale-[0.98] border ${t.primaryBtnBorder}`}
                  style={{
                    clipPath:
                      "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                  }}
                >
                  {/* Subtle diagonal light shimmer */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">BECOME AN AMBASSADOR</span>
                </a>
              </motion.div>
            </div>

            {/* --------------------------------------------------
                LOWER-LEFT RETICLE INSIGNIA (Scaled to fit frame perfectly like Image 2)
                -------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-0.5 sm:mt-1 lg:mt-1.5 relative w-full max-w-[350px] sm:max-w-[375px] lg:max-w-[395px]"
            >
              {/* Scaled SVG Composition: Craggy Mountains + Reticle + Faceted Stealth Wings */}
              <div className="relative w-full aspect-[16/9.6]">
                <svg
                  viewBox="0 0 460 275"
                  fill="none"
                  className="w-full h-full select-none"
                >
                  <defs>
                    {/* Stealth Wing Theme Gradients */}
                    <linearGradient id="wing-top-left" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={t.perksInsignia.wingTopLeft0} stopOpacity="0.85" />
                      <stop offset="50%" stopColor={t.perksInsignia.wingTopLeft50} stopOpacity="0.75" />
                      <stop offset="100%" stopColor={t.perksInsignia.wingTopLeft100} stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="wing-top-right" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={t.perksInsignia.wingTopLeft0} stopOpacity="0.85" />
                      <stop offset="50%" stopColor={t.perksInsignia.wingTopLeft50} stopOpacity="0.75" />
                      <stop offset="100%" stopColor={t.perksInsignia.wingTopLeft100} stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="wing-facet-dark" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor={t.perksInsignia.wingFacetDark0} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={t.perksInsignia.wingFacetDark100} stopOpacity="0.85" />
                    </linearGradient>

                    {/* Mountain Shading Gradients */}
                    <linearGradient id="mountain-rock-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E2228" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#121518" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#08090B" stopOpacity="1" />
                    </linearGradient>

                    <linearGradient id="mountain-rock-2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#282D35" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0C0E10" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Radial Glow Filter */}
                    <filter id="core-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* ----------------------------------------------
                      LAYER 1: Textured Jagged Obsidian Mountain Crags
                      ---------------------------------------------- */}
                  <g opacity="0.65">
                    {/* Far background mountain ridges */}
                    <polygon
                      points="0,150 25,125 65,150 100,105 150,155 205,115 260,165 330,110 395,150 460,125 460,275 0,275"
                      fill="#0C0E11"
                    />
                    {/* Mid-ground crags with shaded facets */}
                    <polygon
                      points="0,180 40,140 80,170 125,130 175,185 240,145 305,200 380,155 460,190 460,275 0,275"
                      fill="url(#mountain-rock-1)"
                    />
                    <polygon
                      points="40,140 80,170 55,215 0,195"
                      fill="url(#mountain-rock-2)"
                      opacity="0.7"
                    />
                    <polygon
                      points="125,130 175,185 145,230 80,195"
                      fill="url(#mountain-rock-2)"
                      opacity="0.8"
                    />
                    <polygon
                      points="240,145 305,200 270,250 205,215"
                      fill="url(#mountain-rock-2)"
                      opacity="0.6"
                    />
                    <polygon
                      points="380,155 460,190 430,240 350,215"
                      fill="url(#mountain-rock-2)"
                      opacity="0.75"
                    />

                    {/* Sharp Rocky Ridge Rim Lines with themed lighting */}
                    <polyline
                      points="0,180 40,140 80,170 125,130 175,185 240,145 305,200 380,155 460,190"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.35"
                    />
                  </g>

                  {/* ----------------------------------------------
                      LAYER 2: Cyber Crosshairs & Concentric Rings
                      ---------------------------------------------- */}
                  {/* Concentric Radar Rings */}
                  <circle cx="230" cy="138" r="120" stroke={t.perksInsignia.ridgeColor} strokeWidth="0.8" strokeOpacity="0.18" strokeDasharray="3 5" />
                  <circle cx="230" cy="138" r="92" stroke={t.perksInsignia.ridgeColor} strokeWidth="0.9" strokeOpacity="0.32" />
                  <circle cx="230" cy="138" r="64" stroke={t.perksInsignia.ridgeColor} strokeWidth="1.1" strokeOpacity="0.45" />
                  <circle cx="230" cy="138" r="25" stroke={t.perksInsignia.ridgeColor} strokeWidth="1.5" strokeOpacity="0.85" />

                  {/* Horizontal Crosshair Ray segments */}
                  <line x1="25" y1="138" x2="70" y2="138" stroke={t.perksInsignia.ridgeColor} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <line x1="390" y1="138" x2="435" y2="138" stroke={t.perksInsignia.ridgeColor} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />

                  {/* Vertical Needle Spire (Top & Center) */}
                  <line x1="230" y1="25" x2="230" y2="110" stroke={t.perksInsignia.ridgeColor} strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="230" y1="165" x2="230" y2="250" stroke={t.perksInsignia.ridgeColor} strokeWidth="1.8" strokeLinecap="round" />

                  {/* Bottom Dagger Sheath Contour (Exact from Image 2) */}
                  <polygon
                    points="222,190 222,232 230,255 238,232 238,190"
                    stroke={t.perksInsignia.ridgeColor}
                    strokeWidth="1.4"
                    fill="rgba(0, 0, 0, 0.4)"
                  />

                  {/* Diagonal 45-degree Targeting Ray shooting Up-Right */}
                  <line x1="230" y1="138" x2="385" y2="18" stroke={t.perksInsignia.ridgeColor} strokeWidth="1.2" strokeOpacity="0.85" />
                  <line x1="308" y1="58" x2="322" y2="72" stroke={t.perksInsignia.ridgeColor} strokeWidth="1" strokeOpacity="0.7" />
                  {/* Small Square Beacon on Grid Ray */}
                  <rect x="310" y="42" width="5.5" height="5.5" fill={t.perksInsignia.beaconColor} opacity="0.75" />

                  {/* ----------------------------------------------
                      LAYER 3: 4 Faceted 3D Stealth Wings (The Emblem)
                      ---------------------------------------------- */}
                  {/* UPPER-LEFT WING */}
                  <g>
                    <polygon
                      points="220,78 170,105 55,138 148,130 210,93"
                      fill="url(#wing-top-left)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="220,78 148,130 185,123 216,99"
                      fill="url(#wing-facet-dark)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                    <line x1="220" y1="78" x2="55" y2="138" stroke={t.perksInsignia.labelColor} strokeWidth="0.8" opacity="0.65" />
                  </g>

                  {/* UPPER-RIGHT WING */}
                  <g>
                    <polygon
                      points="240,78 290,105 405,138 312,130 250,93"
                      fill="url(#wing-top-right)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="240,78 312,130 275,123 244,99"
                      fill="url(#wing-facet-dark)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                    <line x1="240" y1="78" x2="405" y2="138" stroke={t.perksInsignia.labelColor} strokeWidth="0.8" opacity="0.65" />
                  </g>

                  {/* LOWER-LEFT WING */}
                  <g>
                    <polygon
                      points="220,198 170,171 55,138 148,146 210,183"
                      fill="url(#wing-top-left)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="220,198 148,146 185,153 216,177"
                      fill="url(#wing-facet-dark)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                    <line x1="220" y1="198" x2="55" y2="138" stroke={t.perksInsignia.labelColor} strokeWidth="0.8" opacity="0.65" />
                  </g>

                  {/* LOWER-RIGHT WING */}
                  <g>
                    <polygon
                      points="240,198 290,171 405,138 312,146 250,183"
                      fill="url(#wing-top-right)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="240,198 312,146 275,153 244,177"
                      fill="url(#wing-facet-dark)"
                      stroke={t.perksInsignia.ridgeColor}
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                    <line x1="240" y1="198" x2="405" y2="138" stroke={t.perksInsignia.labelColor} strokeWidth="0.8" opacity="0.65" />
                  </g>

                  {/* ----------------------------------------------
                      LAYER 4: Center Core Glowing Beacon
                      ---------------------------------------------- */}
                  <circle cx="230" cy="138" r="14" fill={t.perksInsignia.beaconColor} opacity="0.45" filter="url(#core-glow)" />
                  <circle cx="230" cy="138" r="7" fill={t.perksInsignia.beaconColor} />
                  <circle cx="230" cy="138" r="3" fill="#FFFFFF" />
                </svg>

                {/* ----------------------------------------------
                    TOP-RIGHT MONOSPACE LABELS (Aligned with Ray)
                    PEOPLE / IDEAS / CAMPUS / BEYOND
                    ---------------------------------------------- */}
                <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5 text-right pointer-events-none">
                  <span
                    className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors duration-500"
                    style={{ color: t.perksInsignia.labelColor }}
                  >
                    PEOPLE
                  </span>
                  <span
                    className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors duration-500"
                    style={{ color: t.perksInsignia.labelColor }}
                  >
                    IDEAS
                  </span>
                  <span
                    className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors duration-500"
                    style={{ color: t.perksInsignia.labelColor }}
                  >
                    CAMPUS
                  </span>
                  <span
                    className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors duration-500"
                    style={{ color: t.perksInsignia.labelColor }}
                  >
                    BEYOND
                  </span>
                </div>

                {/* ----------------------------------------------
                    LOWER-LEFT TECH BRACKET & MOTTO (Exact from Image 2)
                    A BRIGHTER / TOMORROW / TOGETHER. ──
                    ---------------------------------------------- */}
                <div className="absolute bottom-1.5 left-1 flex items-end gap-2 pointer-events-none">
                  {/* Themed L-Bracket Notch */}
                  <div
                    className="w-3 h-8 border-l-2 border-b-2 transition-colors duration-500"
                    style={{ borderColor: t.perksInsignia.bracketColor }}
                  />
                  <div className="flex flex-col gap-0.5 pb-0.5">
                    <span
                      className="font-mono text-[7.5px] sm:text-[8px] tracking-[0.22em] uppercase font-semibold leading-tight transition-colors duration-500"
                      style={{ color: t.perksInsignia.labelColor }}
                    >
                      A BRIGHTER
                    </span>
                    <span
                      className="font-mono text-[7.5px] sm:text-[8px] tracking-[0.22em] uppercase font-semibold leading-tight transition-colors duration-500"
                      style={{ color: t.perksInsignia.labelColor }}
                    >
                      TOMORROW
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-mono text-[7.5px] sm:text-[8px] tracking-[0.22em] uppercase font-semibold leading-tight transition-colors duration-500"
                        style={{ color: t.perksInsignia.labelColor }}
                      >
                        TOGETHER.
                      </span>
                      <div
                        className="w-4 h-[1.5px] transition-colors duration-500"
                        style={{ background: t.perksInsignia.labelColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* ----------------------------------------------
                    BOTTOM-RIGHT GLOWING SQUARE BEACON
                    ---------------------------------------------- */}
                <div className="absolute bottom-3 right-5 pointer-events-none">
                  <div
                    className="w-2.5 h-2.5 rounded-[1px] animate-pulse transition-all duration-500"
                    style={{
                      background: t.perksInsignia.beaconColor,
                      boxShadow: `0 0 10px ${t.perksInsignia.beaconColor}`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: 6 Sci-Fi HUD Perk Rows (01 through 06)
              ---------------------------------------------------- */}
          <div className="lg:col-span-7">
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col gap-2.5 sm:gap-3"
            >
              {PERKS.map((perk, index) => {
                const Icon = perk.icon;
                const isActive = activePerk === index;

                return (
                  <motion.div
                    key={perk.number}
                    variants={rowVariants}
                    onMouseEnter={() => setActivePerk(index)}
                    className={`group relative rounded-[3px] transition-all duration-300 cursor-pointer ${
                      isActive
                        ? `${t.perksCardActiveBg} border ${t.perksCardActiveBorder} ${t.perksCardActiveShadow}`
                        : `bg-[#0b0808]/85 hover:bg-[#120a0a]/90 border border-neutral-800/80 ${t.perksCardHoverBorder} shadow-[0_4px_20px_rgba(0,0,0,0.6)]`
                    }`}
                  >
                    {/* Left Sci-Fi Corner Brackets (⌜ and ⌞) */}
                    <div
                      className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300 pointer-events-none ${
                        isActive
                          ? t.perksBracketActive
                          : t.perksBracketDefault
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors duration-300 pointer-events-none ${
                        isActive
                          ? t.perksBracketActive
                          : t.perksBracketDefault
                      }`}
                    />

                    {/* Right Edge Bracket */}
                    <div
                      className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r transition-colors duration-300 pointer-events-none ${
                        isActive ? t.perksBracketActive : "border-neutral-700/60"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r transition-colors duration-300 pointer-events-none ${
                        isActive ? t.perksBracketActive : "border-neutral-700/60"
                      }`}
                    />

                    {/* Row Content */}
                    <div className="py-3.5 sm:py-4 px-5 sm:px-6 flex items-center justify-between gap-4">
                      {/* Left: Themed Monospace Number */}
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-shrink-0">
                        <span className={`font-bebas text-2xl sm:text-3xl ${t.perksNumberClass} tracking-wider w-8 sm:w-10 text-center transition-all duration-300`}>
                          {perk.number}
                        </span>
                        {/* Vertical Hairline Divider */}
                        <div
                          className="h-8 w-[1px] hidden sm:block transition-colors duration-500"
                          style={{ background: `${t.accent}33` }}
                        />
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bebas text-base sm:text-lg tracking-wider text-white uppercase group-hover:text-white transition-colors">
                          {perk.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-neutral-300 font-geist leading-snug group-hover:text-neutral-200 transition-colors">
                          {perk.description}
                        </p>
                      </div>

                      {/* Right: Themed Line-Art Icon */}
                      <div className="flex-shrink-0 ml-2">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-sm flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? `${t.perksIconActiveColor} scale-110 drop-shadow-[0_0_10px_${t.accentGlow}]`
                              : `${t.perksIconDefaultColor} group-hover:scale-110`
                          }`}
                        >
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

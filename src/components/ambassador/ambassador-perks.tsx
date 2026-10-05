"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";

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
    {/* Rosette scalloped ribbon medal */}
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
    {/* 3 Linked team nodes */}
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
    {/* 4 ascending vertical bars */}
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
    {/* User silhouette inside security/mentorship shield */}
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
    {/* Executive Briefcase */}
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
    {/* Gift Box with Bow */}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const [activePerk, setActivePerk] = useState<number>(0);

  return (
    <section
      ref={containerRef}
      className="relative pt-28 sm:pt-36 lg:pt-44 pb-20 sm:pb-28 lg:pb-36 bg-[#040303] overflow-hidden select-none"
    >
      {/* ========================================================
          BACKGROUND LAYER: Topographic Contours & Sci-Fi Grids
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Topographic Elevation Curves (SVG Contour Lines) */}
        <svg
          className="absolute -top-10 -right-10 w-[700px] lg:w-[1000px] h-[600px] lg:h-[800px] opacity-[0.08] text-red-500 pointer-events-none"
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

        {/* Ambient Crimson Glow behind HUD Cards */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

        {/* Subtle Sci-Fi Dot Matrix & Reticle Crosshairs */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(239,68,68,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ========================================================
          MAIN CONTENT CONTAINER (Matches Image 2 Split Layout)
          ======================================================== */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* ----------------------------------------------------
              LEFT COLUMN: Impact Headline, Mission, CTA & Insignia
              ---------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-2">
            <div>
              {/* Massive Industrial Headline: WHY JOIN THE VANGUARD */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-impact text-[clamp(3.5rem,7.5vw,6.5rem)] font-normal leading-[0.88] tracking-tight">
                  <span className="block text-[#FAF6EE] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                    WHY JOIN
                  </span>
                  <span className="block text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.55)]">
                    THE VANGUARD
                  </span>
                </h2>
              </motion.div>

              {/* Subtitle / Mission Statement */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-md text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed"
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
                className="mt-8"
              >
                <a
                  href="#apply"
                  className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white bg-gradient-to-r from-[#991B1B] via-[#C51D24] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#E61924] transition-all duration-300 shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:shadow-[0_0_36px_rgba(255,42,54,0.7)] active:scale-[0.98] border border-red-500/50"
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

            {/* Lower-Left Insignia & Mountain Silhouette (From Image 2) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-16 lg:mt-24 pt-4 relative"
            >
              {/* Dark Jagged Mountain Ridge Silhouette in Background */}
              <svg
                viewBox="0 0 400 120"
                fill="none"
                className="w-full h-24 text-neutral-900/60 pointer-events-none absolute -top-8 left-0 opacity-40"
              >
                <path
                  d="M0 120 L0 85 L40 60 L90 85 L140 45 L190 75 L240 30 L290 65 L340 40 L400 80 L400 120 Z"
                  fill="currentColor"
                />
              </svg>

              <div className="relative flex items-center justify-between">
                {/* Tech Reticle Emblem (Crosshair + Wings + Pulsing Core) */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Outer Concentric Radar Rings */}
                  <svg
                    viewBox="0 0 180 180"
                    fill="none"
                    className="absolute inset-0 w-full h-full text-red-600/35"
                  >
                    <circle cx="90" cy="90" r="76" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
                    <circle cx="90" cy="90" r="54" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="90" cy="90" r="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
                    {/* Compass Crosshair Lines */}
                    <line x1="90" y1="6" x2="90" y2="174" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                    <line x1="6" y1="90" x2="174" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                    {/* Stealth Wing Chevron Crest */}
                    <polygon
                      points="90,45 130,85 155,90 125,105 90,140 55,105 25,90 50,85"
                      stroke="#FF2A36"
                      strokeWidth="1.2"
                      fill="rgba(255,42,54,0.06)"
                    />
                    {/* Reticle Central Spikes */}
                    <line x1="90" y1="36" x2="90" y2="148" stroke="#FF2A36" strokeWidth="1.8" />
                  </svg>

                  {/* Pulsing Core Radar Beacon */}
                  <div className="relative flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[#FF2A36] shadow-[0_0_15px_#FF2A36]" />
                    <span className="absolute w-7 h-7 rounded-full border border-red-500/60 animate-ping" />
                  </div>
                </div>

                {/* Right Stacked Labels: PEOPLE, IDEAS, CAMPUS, BEYOND */}
                <div className="flex flex-col gap-1 text-right">
                  <span className="font-mono text-[9px] tracking-[0.28em] text-[#D4A373]/90 uppercase font-semibold">
                    PEOPLE
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.28em] text-[#D4A373]/90 uppercase font-semibold">
                    IDEAS
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.28em] text-[#D4A373]/90 uppercase font-semibold">
                    CAMPUS
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.28em] text-[#D4A373]/90 uppercase font-semibold">
                    BEYOND
                  </span>
                </div>
              </div>

              {/* Bottom-left Slogan: A BRIGHTER TOMORROW TOGETHER + Red Beacon Square */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-3 bg-red-600/70" />
                  <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-neutral-500 uppercase font-medium">
                    A BRIGHTER TOMORROW TOGETHER.
                  </span>
                </div>
                {/* Red Square Beacon */}
                <div className="w-2 h-2 bg-[#FF2A36] shadow-[0_0_8px_#FF2A36]" />
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
              className="flex flex-col gap-3 sm:gap-3.5"
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
                        ? "bg-gradient-to-r from-red-950/40 via-[#0e0909]/90 to-[#0c0808] border border-[#FF2A36] shadow-[0_0_26px_rgba(255,42,54,0.32)]"
                        : "bg-[#0b0808]/85 hover:bg-[#120a0a]/90 border border-neutral-800/80 hover:border-red-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {/* Left Sci-Fi Corner Brackets (⌜ and ⌞) */}
                    <div
                      className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300 pointer-events-none ${
                        isActive
                          ? "border-[#FF2A36]"
                          : "border-red-500/50 group-hover:border-[#FF2A36]"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors duration-300 pointer-events-none ${
                        isActive
                          ? "border-[#FF2A36]"
                          : "border-red-500/50 group-hover:border-[#FF2A36]"
                      }`}
                    />

                    {/* Right Edge Bracket */}
                    <div
                      className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r transition-colors duration-300 pointer-events-none ${
                        isActive ? "border-[#FF2A36]" : "border-neutral-700/60"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r transition-colors duration-300 pointer-events-none ${
                        isActive ? "border-[#FF2A36]" : "border-neutral-700/60"
                      }`}
                    />

                    {/* Row Content */}
                    <div className="py-4 sm:py-5 px-5 sm:px-7 flex items-center justify-between gap-4">
                      {/* Left: Red Monospace Number */}
                      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
                        <span className="font-impact text-2xl sm:text-3xl lg:text-4xl text-[#FF2A36] tracking-wider drop-shadow-[0_0_12px_rgba(255,42,54,0.45)] w-9 sm:w-12 text-center">
                          {perk.number}
                        </span>
                        {/* Vertical Hairline Divider */}
                        <div className="h-9 w-[1px] bg-red-500/20 hidden sm:block" />
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-impact text-sm sm:text-base lg:text-[17px] font-normal tracking-[0.14em] text-white uppercase group-hover:text-red-100 transition-colors">
                          {perk.title}
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-[13px] text-neutral-400 font-sans font-light leading-snug group-hover:text-neutral-300 transition-colors">
                          {perk.description}
                        </p>
                      </div>

                      {/* Right: Crimson Line-Art Icon */}
                      <div className="flex-shrink-0 ml-2">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "text-[#FF2A36] scale-110 drop-shadow-[0_0_10px_rgba(255,42,54,0.6)]"
                              : "text-[#FF2A36]/80 group-hover:text-[#FF2A36] group-hover:scale-110"
                          }`}
                        >
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
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

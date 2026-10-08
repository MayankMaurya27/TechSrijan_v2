"use client";

import { useState, useId } from "react";

interface SocialNode {
  id: string;
  name: string;
  label: string;
  sublabel: string;
  href: string;
  x: number;
  y: number;
  r: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitRotation: number;
  labelPlacement: "bottom" | "left" | "top";
  icon: (props: { className?: string; style?: React.CSSProperties }) => React.JSX.Element;
}

// Crisp official vector SVG icons
function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

function YouTubeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}

// Compact celestial coordinates shifted to the left flank
const SOCIAL_NODES: SocialNode[] = [
  {
    id: "x",
    name: "X",
    label: "X",
    sublabel: "DISPATCHES",
    href: "https://x.com/techsrijan_",
    x: 36,
    y: 265,
    r: 22,
    orbitRadiusX: 33,
    orbitRadiusY: 13,
    orbitRotation: -25,
    labelPlacement: "bottom",
    icon: XIcon,
  },
  {
    id: "youtube",
    name: "YouTube",
    label: "YOUTUBE",
    sublabel: "HIGHLIGHTS",
    href: "https://www.youtube.com/@techSrijanMMMUT",
    x: 104,
    y: 165,
    r: 25,
    orbitRadiusX: 37,
    orbitRadiusY: 14,
    orbitRotation: 20,
    labelPlacement: "left",
    icon: YouTubeIcon,
  },
  {
    id: "instagram",
    name: "Instagram",
    label: "INSTAGRAM",
    sublabel: "VISUALS",
    href: "https://www.instagram.com/techsrijan_mmmut/",
    x: 188,
    y: 100,
    r: 26,
    orbitRadiusX: 39,
    orbitRadiusY: 15,
    orbitRotation: -15,
    labelPlacement: "bottom",
    icon: InstagramIcon,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    label: "LINKEDIN",
    sublabel: "UPDATES",
    href: "https://www.linkedin.com/company/techsrijan/",
    x: 185,
    y: 225,
    r: 24,
    orbitRadiusX: 35,
    orbitRadiusY: 14,
    orbitRotation: 28,
    labelPlacement: "bottom",
    icon: LinkedInIcon,
  },
];

// Pedestal coordinates anchored firmly on the left rock ledge
const PEDESTAL = { x: 116, y: 365 };

interface SocialConstellationProps {
  scrollProgress?: number;
}

export function SocialConstellation({ scrollProgress = 0 }: SocialConstellationProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();

  // Synchronized emergence with Paul 3D and Citadel Archive at the end of the scroll journey
  // (Hidden on landing page, spawns at the end on the far right)
  const enterStart = 0.81;
  const enterEnd = 0.89;

  let currentOpacity = 0;
  let currentTranslateY = 32;

  if (scrollProgress >= enterStart) {
    const t = Math.min(1, Math.max(0, (scrollProgress - enterStart) / (enterEnd - enterStart)));
    const eased = t * t * (3 - 2 * t);
    currentOpacity = eased * 0.98;
    currentTranslateY = (1 - eased) * 32;
  }

  const isVisible = currentOpacity > 0.005;

  return (
    <div
      className="hidden lg:block pointer-events-none absolute z-30 select-none transition-all duration-700"
      style={{
        // Positioned cleanly on the far right plaza flank, anchored at the bottom corner
        right: "clamp(12px, 1.8vw, 36px)",
        bottom: "clamp(4px, 1vh, 16px)",
        opacity: currentOpacity,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: currentOpacity > 0.4 ? "auto" : "none",
        transform: `translateY(${currentTranslateY}px)`,
        willChange: "transform, opacity",
      }}
    >
      {/* Refined compact container size: gracefully fits into right corner without overcrowding */}
      <div className="relative w-[190px] sm:w-[215px] md:w-[235px] lg:w-[250px] h-[250px] sm:h-[275px] md:h-[300px] lg:h-[320px]">
        {/* SVG Holographic Beams, Orbit Rings, and Rock-Integrated Pedestal */}
        <svg
          viewBox="0 0 270 390"
          className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Holographic Golden Bloom Filter */}
            <filter id={`hologram-glow-${filterId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur1" />
              <feGaussianBlur stdDeviation="6" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radiant Beam Gradients from Pedestal to Orbs */}
            {SOCIAL_NODES.map((node) => (
              <linearGradient
                key={`beam-grad-${node.id}`}
                id={`beam-grad-${node.id}-${filterId}`}
                x1={PEDESTAL.x}
                y1={PEDESTAL.y}
                x2={node.x}
                y2={node.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="20%" stopColor="#ffd54f" stopOpacity={hoveredId === node.id ? "0.95" : "0.7"} />
                <stop offset="65%" stopColor="#d4a843" stopOpacity={hoveredId === node.id ? "0.8" : "0.4"} />
                <stop offset="100%" stopColor="#ffb300" stopOpacity="0.15" />
              </linearGradient>
            ))}

            {/* Constellation Filament Gradient */}
            <linearGradient id={`constellation-grad-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe082" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffca28" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#d4a843" stopOpacity="0.8" />
            </linearGradient>

            {/* Base Pedestal Metallic Materials */}
            <linearGradient id={`ped-metal-base-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2214" />
              <stop offset="30%" stopColor="#4a381f" />
              <stop offset="50%" stopColor="#694f29" />
              <stop offset="70%" stopColor="#3d2c17" />
              <stop offset="100%" stopColor="#191209" />
            </linearGradient>

            <linearGradient id={`ped-gold-rim-${filterId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a6721" />
              <stop offset="25%" stopColor="#ffd54f" />
              <stop offset="50%" stopColor="#fff8e1" />
              <stop offset="75%" stopColor="#d4a843" />
              <stop offset="100%" stopColor="#664912" />
            </linearGradient>

            <radialGradient id={`pedestal-core-${filterId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#fffde7" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#ffd54f" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#ff9800" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={`rock-cast-light-${filterId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd54f" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#d4a843" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#ff8f00" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff8f00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ══════════════════════════════════════════════════════════
              LAYER 1: BEAM RAYS FROM PEDESTAL TO ORBS
             ══════════════════════════════════════════════════════════ */}
          <g filter={`url(#hologram-glow-${filterId})`}>
            {SOCIAL_NODES.map((node) => {
              const isHovered = hoveredId === node.id;
              return (
                <g key={`beam-${node.id}`}>
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 3}
                    x2={node.x}
                    y2={node.y}
                    stroke={`url(#beam-grad-${node.id}-${filterId})`}
                    strokeWidth={isHovered ? 3.6 : 1.8}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    opacity={isHovered ? 1 : 0.75}
                  />
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 3}
                    x2={node.x}
                    y2={node.y}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    strokeLinecap="round"
                    opacity={isHovered ? 0.95 : 0.55}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </g>

          {/* ══════════════════════════════════════════════════════════
              LAYER 2: SPARKLING CONSTELLATION FILAMENTS
             ══════════════════════════════════════════════════════════ */}
          <g filter={`url(#hologram-glow-${filterId})`}>
            {/* Primary Orbit Ring linking all 4 orbs into a tight ellipse */}
            <path
              d="M 36 265 C 48 190, 75 140, 104 165 C 142 195, 160 95, 188 100 C 220 102, 228 190, 185 225 C 140 260, 60 310, 36 265 Z"
              fill="none"
              stroke={`url(#constellation-grad-${filterId})`}
              strokeWidth="1.3"
              strokeDasharray="4 3"
              className="animate-constellation-drift opacity-75"
            />

            {/* Connecting chords between nodes */}
            <path
              d="M 36 265 Q 110 230, 185 225"
              fill="none"
              stroke="#ffd54f"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.45"
            />
            <path
              d="M 104 165 Q 148 140, 185 225"
              fill="none"
              stroke="#ffca28"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <path
              d="M 36 265 Q 70 120, 104 165"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.2"
              opacity="0.65"
            />
            <path
              d="M 104 165 Q 155 95, 188 100"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.2"
              opacity="0.65"
            />
          </g>

          {/* Animated Sparkling Light Motes */}
          <g>
            <circle r="2" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 36 265 C 48 190, 75 140, 104 165 C 142 195, 160 95, 188 100 C 220 102, 228 190, 185 225 C 140 260, 60 310, 36 265 Z"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.6" fill="#ffd54f" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 36 265 C 48 190, 75 140, 104 165 C 142 195, 160 95, 188 100 C 220 102, 228 190, 185 225 C 140 260, 60 310, 36 265 Z"
                dur="8s"
                begin="-3.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.5" fill="#fff9c4" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 104 165 Q 155 95, 188 100 Q 215 155, 185 225 Q 110 230, 36 265"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.4" fill="#ffe082" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path={`M ${PEDESTAL.x} ${PEDESTAL.y} L 104 165 L 188 100`}
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* ══════════════════════════════════════════════════════════
              LAYER 3: ROCK-INTEGRATED BASE PEDESTAL (FLUSH TO BOTTOM)
             ══════════════════════════════════════════════════════════ */}
          <g transform={`translate(${PEDESTAL.x}, ${PEDESTAL.y})`}>
            {/* 1. Deep Contact Occlusion Shadow */}
            <ellipse cx="0" cy="12" rx="72" ry="16" fill="#000000" opacity="0.95" filter="blur(6px)" />
            <ellipse cx="0" cy="10" rx="62" ry="13" fill="#050302" opacity="0.9" filter="blur(3px)" />

            {/* 2. Warm Amber Light Spill onto Rock Surface */}
            <ellipse cx="0" cy="8" rx="80" ry="22" fill={`url(#rock-cast-light-${filterId})`} filter="blur(8px)" />

            {/* 3. Base Bed Foundation Ring */}
            <ellipse cx="0" cy="8" rx="64" ry="15" fill={`url(#ped-metal-base-${filterId})`} stroke="#1a1208" strokeWidth="1.5" />
            <ellipse cx="0" cy="6" rx="61" ry="14" fill="none" stroke={`url(#ped-gold-rim-${filterId})`} strokeWidth="1.2" opacity="0.85" />

            {/* 4. Stepped Mechanical Collar */}
            <ellipse cx="0" cy="4" rx="50" ry="12" fill={`url(#ped-metal-base-${filterId})`} stroke="#150f07" strokeWidth="1" />
            <ellipse cx="0" cy="3" rx="47" ry="11" fill="none" stroke={`url(#ped-gold-rim-${filterId})`} strokeWidth="1.8" />

            {/* 5. Inner Concentric Emitter Collar Ring */}
            <ellipse cx="0" cy="1" rx="38" ry="9" fill="#241a0b" stroke="#ffd54f" strokeWidth="1.4" filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="0" rx="32" ry="7.5" fill="none" stroke="#fff9c4" strokeWidth="1" opacity="0.9" />

            {/* 6. Central Holographic Laser Lens & Core */}
            <ellipse cx="0" cy="-2" rx="23" ry="5.8" fill={`url(#pedestal-core-${filterId})`} filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="-2" rx="11" ry="2.8" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`} />

            {/* Rotating holographic circuit lens markings */}
            <g className="animate-spin-slow origin-center opacity-70">
              <line x1="-19" y1="-2" x2="19" y2="-2" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-5.5" x2="0" y2="3.5" stroke="#ffffff" strokeWidth="1" />
            </g>

            {/* Volumetric vertical flare beam shroud hovering over pedestal */}
            <ellipse cx="0" cy="-10" rx="32" ry="10" fill="rgba(255, 213, 79, 0.3)" filter="blur(8px)" />
          </g>
        </svg>

        {/* ══════════════════════════════════════════════════════════
            LAYER 4: INTERACTIVE 3D OBSIDIAN-GOLD CELESTIAL SPHERES
           ══════════════════════════════════════════════════════════ */}
        {SOCIAL_NODES.map((node) => {
          const isHovered = hoveredId === node.id;
          const Icon = node.icon;

          // Convert viewBox coords (270x390) to percentages
          const leftPercent = (node.x / 270) * 100;
          const topPercent = (node.y / 390) * 100;

          return (
            <div
              key={node.id}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
              }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <a
                href={node.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`TechSrijan ${node.name} — ${node.sublabel}`}
                className="relative flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#ffd54f]"
              >
                {/* 3D Tilted Orbital Rings Encircling the Sphere */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${node.orbitRotation}deg)`,
                  }}
                >
                  <div
                    className={`rounded-full border border-[rgba(255,213,79,0.5)] transition-all duration-500 ${
                      isHovered
                        ? "border-[#ffd54f] shadow-[0_0_15px_rgba(255,213,79,0.85)] scale-110"
                        : "shadow-[0_0_6px_rgba(212,168,67,0.3)]"
                    }`}
                    style={{
                      width: `${node.orbitRadiusX * 2}px`,
                      height: `${node.orbitRadiusY * 2}px`,
                      transform: "rotateX(68deg)",
                    }}
                  />
                  <div
                    className="absolute rounded-full border border-[rgba(212,168,67,0.25)]"
                    style={{
                      width: `${node.orbitRadiusX * 1.55}px`,
                      height: `${node.orbitRadiusY * 1.45}px`,
                      transform: "rotateX(60deg) rotateZ(45deg)",
                    }}
                  />
                </div>

                {/* Ambient Golden Core Backing Glow */}
                <div
                  className={`pointer-events-none absolute rounded-full transition-all duration-500 ${
                    isHovered
                      ? "bg-gradient-to-r from-[#ffd54f]/50 to-[#ff9800]/40 blur-lg scale-140"
                      : "bg-[#d4a843]/18 blur-md scale-105"
                  }`}
                  style={{
                    width: `${node.r * 2}px`,
                    height: `${node.r * 2}px`,
                  }}
                />

                {/* ─── The Obsidian Glass Orb ──────────────────────── */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-350 ease-out ${
                    isHovered
                      ? "scale-115 -translate-y-1 shadow-[0_0_26px_rgba(255,213,79,0.75),inset_0_0_15px_rgba(255,235,59,0.5)] border-[#fff8e1]"
                      : "shadow-[0_6px_18px_rgba(0,0,0,0.85),0_0_12px_rgba(212,168,67,0.4),inset_0_0_10px_rgba(255,215,0,0.22)] border-[rgba(255,213,79,0.75)]"
                  }`}
                  style={{
                    width: `${node.r * 2}px`,
                    height: `${node.r * 2}px`,
                    borderWidth: "1.6px",
                    background:
                      "radial-gradient(circle at 35% 30%, rgba(55, 42, 22, 0.95) 0%, rgba(20, 16, 10, 0.98) 60%, rgba(8, 6, 4, 1) 100%)",
                  }}
                >
                  {/* Glossy Spherical Specular Rim / Highlight */}
                  <div
                    className="pointer-events-none absolute inset-x-1.5 top-1 h-[38%] rounded-full opacity-65"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 235, 59, 0.45) 45%, transparent 80%)",
                    }}
                  />

                  {/* Clean SVG Vector Icon */}
                  <Icon
                    className={`relative z-10 transition-all duration-300 ${
                      isHovered
                        ? "text-[#ffffff] drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-105"
                        : "text-[#ffd54f] drop-shadow-[0_0_3px_rgba(212,168,67,0.75)]"
                    }`}
                    style={{
                      width: `${node.r * 0.95}px`,
                      height: `${node.r * 0.95}px`,
                    }}
                  />
                </div>

                {/* ─── Compact Dune Telemetry Typography Labels ───── */}
                <div
                  className={`pointer-events-none absolute flex flex-col whitespace-nowrap transition-all duration-300 ${
                    node.labelPlacement === "left"
                      ? "right-full top-1/2 -translate-y-1/2 pr-2 items-end"
                      : "top-full left-1/2 -translate-x-1/2 pt-1.5 items-center"
                  }`}
                >
                  <span
                    className={`font-sans font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${
                      isHovered ? "text-[#ffffff]" : "text-[#f8eed9]"
                    }`}
                    style={{
                      fontSize: "clamp(7.5px, 0.72vw, 9.5px)",
                      textShadow: isHovered
                        ? "0 0 8px rgba(255,213,79,0.9)"
                        : "0 2px 4px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85)",
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="font-mono text-[6px] sm:text-[7px] tracking-[0.22em] text-[var(--accent-primary,#d4a843)] uppercase opacity-85"
                    style={{
                      textShadow: "0 1px 3px rgba(0,0,0,0.95)",
                    }}
                  >
                    {node.sublabel}
                  </span>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

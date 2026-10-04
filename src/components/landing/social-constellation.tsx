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

// Compact celestial coordinates: tightened horizontally so nothing collides with TechSrijan title
const SOCIAL_NODES: SocialNode[] = [
  {
    id: "x",
    name: "X",
    label: "X",
    sublabel: "DISPATCHES",
    href: "https://x.com/techsrijan_",
    x: 48,
    y: 298,
    r: 24,
    orbitRadiusX: 36,
    orbitRadiusY: 14,
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
    x: 126,
    y: 178,
    r: 27,
    orbitRadiusX: 40,
    orbitRadiusY: 15,
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
    x: 236,
    y: 62,
    r: 30,
    orbitRadiusX: 44,
    orbitRadiusY: 16,
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
    x: 226,
    y: 242,
    r: 26,
    orbitRadiusX: 38,
    orbitRadiusY: 15,
    orbitRotation: 28,
    labelPlacement: "bottom",
    icon: LinkedInIcon,
  },
];

// Pedestal coordinates anchored firmly on the rock ledge
const PEDESTAL = { x: 145, y: 418 };

interface SocialConstellationProps {
  scrollProgress?: number;
}

export function SocialConstellation({ scrollProgress = 0 }: SocialConstellationProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();

  // Smooth scroll exit as the user scrolls into the citadel
  const fadeOutThreshold = 0.08;
  const normalizedFade = Math.min(1, Math.max(0, scrollProgress / fadeOutThreshold));
  const currentOpacity = Math.max(0, 1 - normalizedFade);
  const currentTranslateY = -normalizedFade * 35;

  if (currentOpacity <= 0.005) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-30 select-none transition-all duration-700"
      style={{
        // Positioned hard to the left so it sits firmly on the rock and never touches the center title
        left: "clamp(0px, 1.2vw, 24px)",
        bottom: "clamp(12px, 3.5vh, 52px)",
        opacity: currentOpacity,
        transform: `translateY(${currentTranslateY}px)`,
        willChange: "transform, opacity",
      }}
    >
      {/* Compact container size: stops well short of the center title */}
      <div className="relative w-[280px] xs:w-[310px] sm:w-[340px] md:w-[370px] lg:w-[390px] h-[330px] xs:h-[370px] sm:h-[410px] md:h-[450px]">
        {/* SVG Holographic Beams, Orbit Rings, and Realistic Rock-Embedded Pedestal */}
        <svg
          viewBox="0 0 320 460"
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
            {/* 1. Heavy machined bronze base ring */}
            <linearGradient id={`ped-metal-base-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2214" />
              <stop offset="30%" stopColor="#4a381f" />
              <stop offset="50%" stopColor="#694f29" />
              <stop offset="70%" stopColor="#3d2c17" />
              <stop offset="100%" stopColor="#191209" />
            </linearGradient>

            {/* 2. Specular burnished gold collar */}
            <linearGradient id={`ped-gold-rim-${filterId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a6721" />
              <stop offset="25%" stopColor="#ffd54f" />
              <stop offset="50%" stopColor="#fff8e1" />
              <stop offset="75%" stopColor="#d4a843" />
              <stop offset="100%" stopColor="#664912" />
            </linearGradient>

            {/* 3. Central Laser Emitter Core Radial Flare */}
            <radialGradient id={`pedestal-core-${filterId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#fffde7" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#ffd54f" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#ff9800" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
            </radialGradient>

            {/* 4. Soft warm light cast on rock surface */}
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
                  {/* Outer atmospheric light glow line */}
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 3}
                    x2={node.x}
                    y2={node.y}
                    stroke={`url(#beam-grad-${node.id}-${filterId})`}
                    strokeWidth={isHovered ? 3.8 : 1.8}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    opacity={isHovered ? 1 : 0.75}
                  />
                  {/* Intense center laser core */}
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 3}
                    x2={node.x}
                    y2={node.y}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 1.6 : 0.8}
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
            {/* Primary Orbit Ring linking all 4 orbs into an ellipse */}
            <path
              d="M 48 298 C 65 210, 95 150, 126 178 C 175 215, 200 60, 236 62 C 275 64, 280 200, 226 242 C 170 280, 75 350, 48 298 Z"
              fill="none"
              stroke={`url(#constellation-grad-${filterId})`}
              strokeWidth="1.4"
              strokeDasharray="4 3"
              className="animate-constellation-drift opacity-75"
            />

            {/* Connecting chords between nodes */}
            <path
              d="M 48 298 Q 140 250, 226 242"
              fill="none"
              stroke="#ffd54f"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.45"
            />
            <path
              d="M 126 178 Q 180 150, 226 242"
              fill="none"
              stroke="#ffca28"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <path
              d="M 48 298 Q 90 130, 126 178"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.2"
              opacity="0.65"
            />
            <path
              d="M 126 178 Q 190 100, 236 62"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.2"
              opacity="0.65"
            />
          </g>

          {/* Animated Sparkling Light Motes Traveling Along the Filaments */}
          <g>
            <circle r="2.2" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 48 298 C 65 210, 95 150, 126 178 C 175 215, 200 60, 236 62 C 275 64, 280 200, 226 242 C 170 280, 75 350, 48 298 Z"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.8" fill="#ffd54f" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 48 298 C 65 210, 95 150, 126 178 C 175 215, 200 60, 236 62 C 275 64, 280 200, 226 242 C 170 280, 75 350, 48 298 Z"
                dur="8s"
                begin="-3.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.6" fill="#fff9c4" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 126 178 Q 190 100, 236 62 Q 250 170, 226 242 Q 140 250, 48 298"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.5" fill="#ffe082" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 145 418 L 126 178 L 236 62"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* ══════════════════════════════════════════════════════════
              LAYER 3: REALISTIC ROCK-INTEGRATED BASE PEDESTAL
             ══════════════════════════════════════════════════════════ */}
          <g transform={`translate(${PEDESTAL.x}, ${PEDESTAL.y})`}>
            {/* 1. Deep Contact Occlusion Shadow — wraps tightly into the rock stone crevices */}
            <ellipse cx="0" cy="12" rx="76" ry="18" fill="#000000" opacity="0.95" filter="blur(6px)" />
            <ellipse cx="0" cy="10" rx="66" ry="14" fill="#050302" opacity="0.9" filter="blur(3px)" />

            {/* 2. Warm Amber Light Spill onto Rock Surface — illuminates the surrounding stone naturally */}
            <ellipse cx="0" cy="8" rx="85" ry="24" fill={`url(#rock-cast-light-${filterId})`} filter="blur(8px)" />

            {/* 3. Base Bed Foundation Ring (Machined weathered bronze embedded in rock) */}
            <ellipse cx="0" cy="8" rx="68" ry="16" fill={`url(#ped-metal-base-${filterId})`} stroke="#1a1208" strokeWidth="1.5" />
            {/* Top bevel rim of base ring */}
            <ellipse cx="0" cy="6" rx="65" ry="15" fill="none" stroke={`url(#ped-gold-rim-${filterId})`} strokeWidth="1.2" opacity="0.85" />

            {/* 4. Stepped Mechanical Collar (Solid burnished gold with metallic bevel) */}
            <ellipse cx="0" cy="4" rx="55" ry="13" fill={`url(#ped-metal-base-${filterId})`} stroke="#150f07" strokeWidth="1" />
            <ellipse cx="0" cy="3" rx="52" ry="12" fill="none" stroke={`url(#ped-gold-rim-${filterId})`} strokeWidth="1.8" />

            {/* 5. Inner Concentric Emitter Collar Ring */}
            <ellipse cx="0" cy="1" rx="42" ry="10" fill="#241a0b" stroke="#ffd54f" strokeWidth="1.4" filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="0" rx="36" ry="8.5" fill="none" stroke="#fff9c4" strokeWidth="1" opacity="0.9" />

            {/* 6. Central Holographic Laser Lens & Blinding Plasma Core */}
            <ellipse cx="0" cy="-2" rx="26" ry="6.5" fill={`url(#pedestal-core-${filterId})`} filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="-2" rx="13" ry="3.2" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`} />

            {/* Rotating holographic circuit lens markings */}
            <g className="animate-spin-slow origin-center opacity-70">
              <line x1="-22" y1="-2" x2="22" y2="-2" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-6.5" x2="0" y2="4.5" stroke="#ffffff" strokeWidth="1" />
            </g>

            {/* Volumetric vertical flare beam shroud hovering over pedestal */}
            <ellipse cx="0" cy="-10" rx="36" ry="12" fill="rgba(255, 213, 79, 0.3)" filter="blur(8px)" />
          </g>
        </svg>

        {/* ══════════════════════════════════════════════════════════
            LAYER 4: INTERACTIVE 3D OBSIDIAN-GOLD CELESTIAL SPHERES
           ══════════════════════════════════════════════════════════ */}
        {SOCIAL_NODES.map((node) => {
          const isHovered = hoveredId === node.id;
          const Icon = node.icon;

          // Convert viewBox coords (320x460) to percentages
          const leftPercent = (node.x / 320) * 100;
          const topPercent = (node.y / 460) * 100;

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
              {/* Interactive Anchor Link */}
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
                  {/* Primary Luminous Orbital Ellipse */}
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

                  {/* Secondary Counter-Rotating Orbital Ring */}
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
                      ? "scale-115 -translate-y-1 shadow-[0_0_28px_rgba(255,213,79,0.75),inset_0_0_15px_rgba(255,235,59,0.5)] border-[#fff8e1]"
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
                {/* Placed below or to the left of the orbs to NEVER collide with the title on the right */}
                <div
                  className={`pointer-events-none absolute flex flex-col whitespace-nowrap transition-all duration-300 ${
                    node.labelPlacement === "left"
                      ? "right-full top-1/2 -translate-y-1/2 pr-2.5 items-end"
                      : "top-full left-1/2 -translate-x-1/2 pt-1.5 items-center"
                  }`}
                >
                  <span
                    className={`font-sans font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${
                      isHovered ? "text-[#ffffff]" : "text-[#f8eed9]"
                    }`}
                    style={{
                      fontSize: "clamp(8px, 0.75vw, 10px)",
                      textShadow: isHovered
                        ? "0 0 8px rgba(255,213,79,0.9)"
                        : "0 2px 4px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85)",
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="font-mono text-[6.5px] sm:text-[7.5px] tracking-[0.22em] text-[var(--accent-primary,#d4a843)] uppercase opacity-85"
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

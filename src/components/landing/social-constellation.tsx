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
  color: string;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitRotation: number;
  icon: (props: { className?: string; style?: React.CSSProperties }) => React.JSX.Element;
}

// Crisp official vector SVG icons
function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
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

// 4 Celestial Social Orbs matching Image 1 constellation coordinates
const SOCIAL_NODES: SocialNode[] = [
  {
    id: "x",
    name: "X",
    label: "X",
    sublabel: "DISPATCHES",
    href: "https://x.com/techsrijan_",
    x: 82,
    y: 338,
    r: 34,
    color: "#ffc107",
    orbitRadiusX: 48,
    orbitRadiusY: 18,
    orbitRotation: -28,
    icon: XIcon,
  },
  {
    id: "youtube",
    name: "YouTube",
    label: "YOUTUBE",
    sublabel: "HIGHLIGHTS",
    href: "https://www.youtube.com/@techSrijanMMMUT",
    x: 218,
    y: 204,
    r: 38,
    color: "#ffb300",
    orbitRadiusX: 54,
    orbitRadiusY: 20,
    orbitRotation: 24,
    icon: YouTubeIcon,
  },
  {
    id: "instagram",
    name: "Instagram",
    label: "INSTAGRAM",
    sublabel: "VISUALS",
    href: "https://www.instagram.com/techsrijan_mmmut/",
    x: 396,
    y: 82,
    r: 42,
    color: "#ffd54f",
    orbitRadiusX: 58,
    orbitRadiusY: 22,
    orbitRotation: -18,
    icon: InstagramIcon,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    label: "LINKEDIN",
    sublabel: "UPDATES",
    href: "https://www.linkedin.com/company/techsrijan/",
    x: 384,
    y: 298,
    r: 39,
    color: "#ffca28",
    orbitRadiusX: 56,
    orbitRadiusY: 21,
    orbitRotation: 32,
    icon: LinkedInIcon,
  },
];

// Pedestal coordinates on the rock
const PEDESTAL = { x: 260, y: 462 };

interface SocialConstellationProps {
  scrollProgress?: number;
}

export function SocialConstellation({ scrollProgress = 0 }: SocialConstellationProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();

  // Fade out alongside HeroTitle as the user scrolls into the gate
  const fadeOutThreshold = 0.08;
  const normalizedFade = Math.min(1, Math.max(0, scrollProgress / fadeOutThreshold));
  const currentOpacity = Math.max(0, 1 - normalizedFade);
  const currentTranslateY = -normalizedFade * 40;

  if (currentOpacity <= 0.005) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-30 select-none transition-all duration-700"
      style={{
        // Positioned on the left rocky plateau of the landing hero
        left: "clamp(12px, 3.5vw, 64px)",
        bottom: "clamp(16px, 4.5vh, 72px)",
        opacity: currentOpacity,
        transform: `translateY(${currentTranslateY}px)`,
        willChange: "transform, opacity",
      }}
    >
      {/* Container scaling: compact on mobile, majestic on desktop */}
      <div className="relative w-[310px] xs:w-[350px] sm:w-[410px] md:w-[460px] lg:w-[500px] h-[320px] xs:h-[360px] sm:h-[420px] md:h-[470px] lg:h-[510px]">
        {/* SVG Holographic Beams, Orbit Rings, and Sparkling Connectors */}
        <svg
          viewBox="0 0 520 520"
          className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Holographic Golden Bloom Filter */}
            <filter id={`hologram-glow-${filterId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
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
                <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#ffd54f" stopOpacity={hoveredId === node.id ? "0.9" : "0.55"} />
                <stop offset="70%" stopColor="#d4a843" stopOpacity={hoveredId === node.id ? "0.75" : "0.35"} />
                <stop offset="100%" stopColor="#ffb300" stopOpacity="0.15" />
              </linearGradient>
            ))}

            {/* Glowing Constellation Inter-Orb Gradient */}
            <linearGradient id={`constellation-grad-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe082" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#ffca28" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d4a843" stopOpacity="0.75" />
            </linearGradient>

            {/* Base Pedestal Core Radial Flare */}
            <radialGradient id={`pedestal-core-${filterId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#fff9c4" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#ffd54f" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#ff9800" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
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
                  {/* Outer atmospheric light shroud */}
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 4}
                    x2={node.x}
                    y2={node.y}
                    stroke={`url(#beam-grad-${node.id}-${filterId})`}
                    strokeWidth={isHovered ? 4.5 : 2.2}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    opacity={isHovered ? 1 : 0.65}
                  />
                  {/* Core laser filament */}
                  <line
                    x1={PEDESTAL.x}
                    y1={PEDESTAL.y - 4}
                    x2={node.x}
                    y2={node.y}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1}
                    strokeLinecap="round"
                    opacity={isHovered ? 0.95 : 0.5}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </g>

          {/* ══════════════════════════════════════════════════════════
              LAYER 2: SPARKLING INTER-ORB CONSTELLATION FILAMENTS
             ══════════════════════════════════════════════════════════ */}
          <g filter={`url(#hologram-glow-${filterId})`}>
            {/* Primary Orbit Ring passing through all 4 Orbs */}
            <path
              d="M 82 338 C 110 240, 160 170, 218 204 C 290 245, 330 80, 396 82 C 450 84, 460 250, 384 298 C 300 350, 120 420, 82 338 Z"
              fill="none"
              stroke={`url(#constellation-grad-${filterId})`}
              strokeWidth="1.6"
              strokeDasharray="4 3"
              className="animate-constellation-drift opacity-70"
            />

            {/* Secondary Harmonic Resonant Chord */}
            <path
              d="M 82 338 Q 240 280, 384 298"
              fill="none"
              stroke="#ffd54f"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.45"
            />
            <path
              d="M 218 204 Q 300 180, 384 298"
              fill="none"
              stroke="#ffca28"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              opacity="0.5"
            />
            <path
              d="M 82 338 Q 150 140, 218 204"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.4"
              opacity="0.6"
            />
            <path
              d="M 218 204 Q 320 120, 396 82"
              fill="none"
              stroke="#fff3b0"
              strokeWidth="1.4"
              opacity="0.6"
            />
          </g>

          {/* Animated Sparkling Light Motes Traveling Along Constellation Paths */}
          <g>
            <circle r="2.8" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 82 338 C 110 240, 160 170, 218 204 C 290 245, 330 80, 396 82 C 450 84, 460 250, 384 298 C 300 350, 120 420, 82 338 Z"
                dur="7s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2.2" fill="#ffd54f" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 82 338 C 110 240, 160 170, 218 204 C 290 245, 330 80, 396 82 C 450 84, 460 250, 384 298 C 300 350, 120 420, 82 338 Z"
                dur="9s"
                begin="-3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="#fff9c4" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 218 204 Q 320 120, 396 82 Q 410 220, 384 298 Q 240 280, 82 338"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.8" fill="#ffe082" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 260 462 L 218 204 L 396 82"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.8" fill="#ffe082" filter={`url(#hologram-glow-${filterId})`}>
              <animateMotion
                path="M 260 462 L 82 338"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* ══════════════════════════════════════════════════════════
              LAYER 3: BASE PROJECTOR PEDESTAL (Resting on the Rock)
             ══════════════════════════════════════════════════════════ */}
          <g transform={`translate(${PEDESTAL.x}, ${PEDESTAL.y})`}>
            {/* Ground contact shadow on rock */}
            <ellipse cx="0" cy="14" rx="95" ry="24" fill="rgba(0,0,0,0.85)" filter="blur(8px)" />

            {/* Base Tier 1: Outer dark basalt / bronze ring */}
            <ellipse cx="0" cy="10" rx="88" ry="22" fill="#18130c" stroke="#5a4522" strokeWidth="2.5" />
            <ellipse cx="0" cy="8" rx="84" ry="20" fill="none" stroke="#d4a843" strokeWidth="1" strokeDasharray="6 4" opacity="0.8" />

            {/* Base Tier 2: Stepped mechanical metallic collar with golden rim */}
            <ellipse cx="0" cy="5" rx="72" ry="17" fill="#241c10" stroke="#ffd54f" strokeWidth="2" />
            <ellipse cx="0" cy="4" rx="68" ry="15" fill="none" stroke="#ffb300" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />

            {/* Base Tier 3: Inner golden emitter ring */}
            <ellipse cx="0" cy="1" rx="54" ry="13" fill="#382a13" stroke="#fff3b0" strokeWidth="2.5" filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="0" rx="46" ry="11" fill="none" stroke="#d4a843" strokeWidth="1.5" />

            {/* Central Holographic Emitter Core & Pulsing Flare */}
            <ellipse cx="0" cy="-2" rx="34" ry="8" fill={`url(#pedestal-core-${filterId})`} filter={`url(#hologram-glow-${filterId})`} />
            <ellipse cx="0" cy="-2" rx="16" ry="4" fill="#ffffff" filter={`url(#hologram-glow-${filterId})`} />

            {/* Rotating holographic circuit compass on the pedestal */}
            <g className="animate-spin-slow origin-center opacity-60">
              <line x1="-30" y1="-2" x2="30" y2="-2" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="0" y1="-9" x2="0" y2="5" stroke="#ffffff" strokeWidth="1.2" />
            </g>

            {/* Vertical lens flare aura rising from the pedestal core */}
            <ellipse cx="0" cy="-14" rx="48" ry="16" fill="rgba(255, 213, 79, 0.25)" filter="blur(10px)" />
          </g>
        </svg>

        {/* ══════════════════════════════════════════════════════════
            LAYER 4: INTERACTIVE 3D OBSIDIAN-GOLD CELESTIAL SPHERES
           ══════════════════════════════════════════════════════════ */}
        {SOCIAL_NODES.map((node) => {
          const isHovered = hoveredId === node.id;
          const Icon = node.icon;

          // Convert viewBox coords (520x520) to percentages
          const leftPercent = (node.x / 520) * 100;
          const topPercent = (node.y / 520) * 100;

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
                    className={`rounded-full border border-[rgba(255,213,79,0.55)] transition-all duration-500 ${
                      isHovered
                        ? "border-[#ffd54f] shadow-[0_0_18px_rgba(255,213,79,0.8)] scale-110"
                        : "shadow-[0_0_8px_rgba(212,168,67,0.35)]"
                    }`}
                    style={{
                      width: `${node.orbitRadiusX * 2}px`,
                      height: `${node.orbitRadiusY * 2}px`,
                      transform: "rotateX(68deg)",
                    }}
                  />

                  {/* Secondary Counter-Rotating Orbital Ring */}
                  <div
                    className="absolute rounded-full border border-[rgba(212,168,67,0.3)]"
                    style={{
                      width: `${node.orbitRadiusX * 1.65}px`,
                      height: `${node.orbitRadiusY * 1.55}px`,
                      transform: "rotateX(62deg) rotateZ(45deg)",
                    }}
                  />
                </div>

                {/* Ambient Golden Core Backing Glow */}
                <div
                  className={`pointer-events-none absolute rounded-full transition-all duration-500 ${
                    isHovered
                      ? "bg-gradient-to-r from-[#ffd54f]/50 to-[#ff9800]/40 blur-xl scale-150"
                      : "bg-[#d4a843]/20 blur-md scale-110"
                  }`}
                  style={{
                    width: `${node.r * 2.2}px`,
                    height: `${node.r * 2.2}px`,
                  }}
                />

                {/* ─── The Obsidian Glass Orb ──────────────────────── */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-400 ease-out ${
                    isHovered
                      ? "scale-115 -translate-y-1.5 shadow-[0_0_35px_rgba(255,213,79,0.7),inset_0_0_20px_rgba(255,235,59,0.5)] border-[#fff3b0]"
                      : "shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_18px_rgba(212,168,67,0.4),inset_0_0_12px_rgba(255,215,0,0.25)] border-[rgba(255,213,79,0.7)]"
                  }`}
                  style={{
                    width: `${node.r * 2}px`,
                    height: `${node.r * 2}px`,
                    borderWidth: "1.8px",
                    background:
                      "radial-gradient(circle at 35% 30%, rgba(55, 42, 22, 0.95) 0%, rgba(20, 16, 10, 0.98) 60%, rgba(8, 6, 4, 1) 100%)",
                  }}
                >
                  {/* Glossy Spherical Specular Rim / Highlight */}
                  <div
                    className="pointer-events-none absolute inset-x-2 top-1 h-[40%] rounded-full opacity-60"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 235, 59, 0.4) 40%, transparent 80%)",
                    }}
                  />

                  {/* Clean SVG Vector Icon */}
                  <Icon
                    className={`relative z-10 transition-all duration-300 ${
                      isHovered
                        ? "text-[#ffffff] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110"
                        : "text-[#ffd54f] drop-shadow-[0_0_4px_rgba(212,168,67,0.8)]"
                    }`}
                    style={{
                      width: `${node.r * 0.95}px`,
                      height: `${node.r * 0.95}px`,
                    }}
                  />
                </div>

                {/* ─── Dune Telemetry Typography Labels ───────────── */}
                <div
                  className={`pointer-events-none absolute flex flex-col whitespace-nowrap transition-all duration-300 ${
                    node.id === "instagram"
                      ? "top-full left-1/2 -translate-x-1/2 pt-2 items-center"
                      : node.id === "x"
                      ? "top-full left-1/2 -translate-x-1/2 pt-2 items-center"
                      : "left-full top-1/2 -translate-y-1/2 pl-3 items-start"
                  }`}
                >
                  <span
                    className={`font-sans font-bold tracking-[0.22em] uppercase transition-colors duration-200 ${
                      isHovered ? "text-[#ffffff]" : "text-[#f8eed9]"
                    }`}
                    style={{
                      fontSize: "clamp(9px, 0.85vw, 11px)",
                      textShadow: isHovered
                        ? "0 0 10px rgba(255,213,79,0.9)"
                        : "0 2px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)",
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="font-mono text-[7px] sm:text-[8px] tracking-[0.25em] text-[var(--accent-primary,#d4a843)] uppercase opacity-85"
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

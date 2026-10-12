"use client";

import { useState, useEffect, useId } from "react";

interface Waypoint {
  id: string;
  name: string;
  handle: string;
  href: string;
  cy: number; // Center Y in SVG coordinate space (0-720)
  glowColor: string;
  neonColor: string;
  icon: (props: { cx: number; cy: number }) => React.JSX.Element;
}

// ─── SVG VECTOR ICONS (Embossed Burnished Gold with High-Contrast Relief) ───
function InstagramGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.25;
  return (
    <g transform={`translate(${cx - 15 * s}, ${cy - 15 * s}) scale(${s})`}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.5"
        ry="5.5"
        fill="none"
        stroke="url(#goldEmbossGrad)"
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="none"
        stroke="url(#goldEmbossGrad)"
        strokeWidth="2.2"
      />
      <circle cx="17.2" cy="6.8" r="1.4" fill="url(#goldEmbossGrad)" />
    </g>
  );
}

function YouTubeGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.25;
  return (
    <g transform={`translate(${cx - 15 * s}, ${cy - 15 * s}) scale(${s})`}>
      <path
        d="M22.5 7.2a2.9 2.9 0 0 0-2-2C18.7 4.7 12 4.7 12 4.7s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2C1 9 1 12 1 12s0 3 .5 4.8a2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8z"
        fill="url(#goldEmbossGrad)"
      />
      <polygon points="10,9 15.5,12 10,15" fill="#140d08" />
    </g>
  );
}

function LinkedInGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.3;
  return (
    <g transform={`translate(${cx - 13 * s}, ${cy - 13 * s}) scale(${s})`}>
      <rect x="2" y="8" width="4.5" height="12" rx="1" fill="url(#goldEmbossGrad)" />
      <circle cx="4.25" cy="4.2" r="2.4" fill="url(#goldEmbossGrad)" />
      <path
        d="M9 8h4v1.8h.1c.6-1.1 1.9-2 3.9-2 4.1 0 4.8 2.7 4.8 6.2v6H17.7v-5.6c0-1.3 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.7H9.6V8z"
        fill="url(#goldEmbossGrad)"
      />
    </g>
  );
}

function XGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.22;
  return (
    <g transform={`translate(${cx - 13 * s}, ${cy - 13 * s}) scale(${s})`}>
      <path
        d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24H16.17l-5.21-6.82L4.99 21.75H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"
        fill="url(#goldEmbossGrad)"
      />
    </g>
  );
}

const WAYPOINTS: Waypoint[] = [
  {
    id: "instagram",
    name: "INSTAGRAM",
    handle: "@techsrijan",
    href: "https://www.instagram.com/techsrijan_mmmut/",
    cy: 110,
    glowColor: "rgba(255, 180, 50, 0.95)",
    neonColor: "#ff9900",
    icon: InstagramGlyph,
  },
  {
    id: "youtube",
    name: "YOUTUBE",
    handle: "@techsrijan",
    href: "https://www.youtube.com/@techSrijanMMMUT",
    cy: 250,
    glowColor: "rgba(255, 60, 45, 0.95)",
    neonColor: "#ff2a4b",
    icon: YouTubeGlyph,
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    handle: "Techsrijan",
    href: "https://www.linkedin.com/company/techsrijan/",
    cy: 390,
    glowColor: "rgba(50, 180, 255, 0.95)",
    neonColor: "#00b4d8",
    icon: LinkedInGlyph,
  },
  {
    id: "x",
    name: "X",
    handle: "@techsrijan",
    href: "https://x.com/techsrijan_",
    cy: 530,
    glowColor: "rgba(255, 220, 80, 0.95)",
    neonColor: "#ffd60a",
    icon: XGlyph,
  },
];

interface SocialTotemProps {
  scrollProgress?: number;
}

export function SocialTotem({ scrollProgress = 0 }: SocialTotemProps) {
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const uniqueId = useId().replace(/:/g, "");

  // Mouse parallax tilt for 3D depth matching the Citadel monoliths
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w > 0 && h > 0) {
        const rotY = (e.clientX / w - 0.5) * 4.5;
        const rotX = -(e.clientY / h - 0.5) * 3.2;
        setMouseTilt({ x: rotX, y: rotY });
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Synchronized emergence with Citadel Archive
  const enterStart = 0.80;
  const enterEnd = 0.88;

  let currentOpacity = 0;
  let currentTranslateY = 36;

  if (scrollProgress >= enterStart) {
    const t = Math.min(1, Math.max(0, (scrollProgress - enterStart) / (enterEnd - enterStart)));
    const eased = t * t * (3 - 2 * t);
    currentOpacity = eased * 0.99;
    currentTranslateY = (1 - eased) * 36;
  }

  const isVisible = currentOpacity > 0.005;

  return (
    <div
      className="hidden lg:block pointer-events-none absolute z-30 select-none transition-all duration-700"
      style={{
        // Shifted bit right and bit top to align with Citadel Archive cards
        right: "clamp(2px, 0.9vw, 18px)",
        bottom: "clamp(45px, 6.5vh, 75px)",
        opacity: currentOpacity,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: currentOpacity > 0.35 ? "auto" : "none",
        transform: `translate3d(0, ${currentTranslateY}px, 0) rotateY(${mouseTilt.y * 0.65}deg) rotateX(${mouseTilt.x * 0.65}deg)`,
        perspective: "1400px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Master Container: Sized proportionally and vertically aligned with the Citadel cards */}
      <div className="relative w-[250px] lg:w-[275px] xl:w-[315px] 2xl:w-[345px] h-[430px] lg:h-[470px] xl:h-[525px] 2xl:h-[580px] flex items-center justify-center">
        {/* ─── NATIVE ARCHITECTURAL TOTEM SPIRE WITH RADIANT NEON GLOW ─── */}
        <svg
          viewBox="0 0 520 680"
          className="w-full h-full overflow-visible pointer-events-auto"
          style={{
            filter: "drop-shadow(0 20px 35px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 18px rgba(212, 168, 67, 0.28))",
          }}
        >
          <defs>
            {/* ─── High-Fidelity Multi-Pass Holographic Neon Glow Filter ─── */}
            <filter id={`neonGlow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur1" />
              <feGaussianBlur stdDeviation="6" result="blur2" />
              <feGaussianBlur stdDeviation="14" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={`intenseCore-${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={`dropShadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.9" />
            </filter>

            {/* Radiant Metallic Gold Gradients */}
            <linearGradient id="goldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff8d6" />
              <stop offset="25%" stopColor="#ffd54f" />
              <stop offset="50%" stopColor="#8a5a18" />
              <stop offset="75%" stopColor="#f7d374" />
              <stop offset="100%" stopColor="#ffea9f" />
            </linearGradient>

            <linearGradient id="goldBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff8d9" />
              <stop offset="30%" stopColor="#ffd54f" />
              <stop offset="70%" stopColor="#8a5716" />
              <stop offset="100%" stopColor="#d4a843" />
            </linearGradient>

            <linearGradient id="goldBrightRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff9db" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#d4a330" />
            </linearGradient>

            <linearGradient id="goldEmbossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ffe27a" />
              <stop offset="75%" stopColor="#ffd043" />
              <stop offset="100%" stopColor="#b37f19" />
            </linearGradient>

            {/* Glowing Text Gradient: Brilliant High-Contrast Gold */}
            <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fff5cb" />
              <stop offset="80%" stopColor="#ffd868" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>

            {/* Dark Obsidian & Basalt Stone Gradients */}
            <linearGradient id="obsidianBannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1f140c" />
              <stop offset="50%" stopColor="#0c0704" />
              <stop offset="100%" stopColor="#1b110a" />
            </linearGradient>

            <linearGradient id="spireBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2c1d13" />
              <stop offset="30%" stopColor="#100905" />
              <stop offset="70%" stopColor="#1b1008" />
              <stop offset="100%" stopColor="#352316" />
            </linearGradient>

            <linearGradient id="columnPillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff4bd" />
              <stop offset="40%" stopColor="#d4a843" />
              <stop offset="70%" stopColor="#66410e" />
              <stop offset="100%" stopColor="#c28e2a" />
            </linearGradient>

            {/* Crimson Heraldic Gradient */}
            <linearGradient id="crimsonBannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ba1a27" />
              <stop offset="50%" stopColor="#7a0e16" />
              <stop offset="100%" stopColor="#3d050a" />
            </linearGradient>

            <linearGradient id="rubyGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b77" />
              <stop offset="40%" stopColor="#f01325" />
              <stop offset="100%" stopColor="#6b060f" />
            </linearGradient>

            {/* Holographic Laser Beam Gradients */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="15%" stopColor="#fff3b0" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#ffb300" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ff8f00" stopOpacity="0.3" />
            </linearGradient>

            <radialGradient id="lensDomeGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3d2719" />
              <stop offset="45%" stopColor="#180e08" />
              <stop offset="100%" stopColor="#080402" />
            </radialGradient>
          </defs>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: CENTRAL OBSIDIAN & GOLDEN SPIRE SHAFT                       */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <g id="central-spire">
            {/* White-Hot Core Laser Column inside the Spire */}
            <line
              x1="345"
              y1="45"
              x2="345"
              y2="660"
              stroke="url(#laserBeamGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              filter={`url(#neonGlow-${uniqueId})`}
              opacity="0.85"
            />
            <line
              x1="345"
              y1="45"
              x2="345"
              y2="660"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Main Obsidian Tower Body */}
            <rect
              x="318"
              y="45"
              width="54"
              height="620"
              fill="url(#spireBodyGrad)"
              stroke="#59391a"
              strokeWidth="1"
            />

            {/* Fluted Vertical Bronze Panels */}
            <rect x="325" y="45" width="11" height="620" fill="#170f08" />
            <rect x="354" y="45" width="11" height="620" fill="#20140b" />

            {/* Flanking Golden Structural Columns (Left & Right) */}
            <rect
              x="317"
              y="40"
              width="7"
              height="625"
              fill="url(#columnPillarGrad)"
              stroke="#734714"
              strokeWidth="0.8"
            />
            <rect
              x="366"
              y="40"
              width="7"
              height="625"
              fill="url(#columnPillarGrad)"
              stroke="#734714"
              strokeWidth="0.8"
            />

            {/* Royal Crimson Heraldic Swallowtail Banners with 8-Pointed Star Sigil */}
            {/* Banner 1: Between Instagram & YouTube */}
            <g transform="translate(0, 0)">
              <path
                d="M 333,155 L 357,155 L 357,215 L 345,203 L 333,215 Z"
                fill="url(#crimsonBannerGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.3"
              />
              <polygon
                points="345,170 347,179 356,181 347,183 345,192 343,183 334,181 343,179"
                fill="url(#goldTextGrad)"
                filter={`url(#intenseCore-${uniqueId})`}
              />
            </g>

            {/* Banner 2: Between LinkedIn & X */}
            <g transform="translate(0, 0)">
              <path
                d="M 333,435 L 357,435 L 357,495 L 345,483 L 333,495 Z"
                fill="url(#crimsonBannerGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.3"
              />
              <polygon
                points="345,450 347,459 356,461 347,463 345,472 343,463 334,461 343,459"
                fill="url(#goldTextGrad)"
                filter={`url(#intenseCore-${uniqueId})`}
              />
            </g>

            {/* ─── HELICAL SPIRAL RIBBON WITH NEON GOLD EDGES ─── */}
            <g id="helical-ribbon" opacity="0.95">
              {/* Loop 1 (Bottom, around Y=480) */}
              <path
                d="M 285,510 C 265,490 330,430 415,465 C 438,477 410,510 350,495"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 285,510 C 265,490 330,430 415,465 C 438,477 410,510 350,495"
                fill="none"
                stroke="#ffd54f"
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 2 (Middle-low, around Y=340) */}
              <path
                d="M 280,370 C 260,350 330,290 420,325 C 442,337 415,370 350,355"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="8.5"
                strokeLinecap="round"
              />
              <path
                d="M 280,370 C 260,350 330,290 420,325 C 442,337 415,370 350,355"
                fill="none"
                stroke="#ffd54f"
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 3 (Middle-high, around Y=200) */}
              <path
                d="M 285,230 C 265,210 330,150 420,185 C 442,197 415,230 350,215"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M 285,230 C 265,210 330,150 420,185 C 442,197 415,230 350,215"
                fill="none"
                stroke="#ffd54f"
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 4 (Top, around Y=75) */}
              <path
                d="M 290,95 C 270,75 340,25 425,65 C 442,77 410,105 350,92"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="9.5"
                strokeLinecap="round"
              />
              <path
                d="M 290,95 C 270,75 340,25 425,65 C 442,77 410,105 350,92"
                fill="none"
                stroke="#ffd54f"
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />
            </g>

            {/* ─── SPIRE APEX NEEDLE & CROWN (Top Finials at Y=8 to 55) ─── */}
            <g id="apex-crown">
              <circle
                cx="345"
                cy="28"
                r="18"
                fill="none"
                stroke="#ffb300"
                strokeWidth="2"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.85"
              />
              <polygon
                points="345,6 351,52 345,58 339,52"
                fill="url(#goldBrightRim)"
                stroke="#694110"
                strokeWidth="1"
                filter={`url(#intenseCore-${uniqueId})`}
              />
              <line x1="345" y1="6" x2="345" y2="58" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

              <polygon points="331,28 334,56 331,59 328,56" fill="url(#goldBevelGrad)" />
              <polygon points="359,28 362,56 359,59 356,56" fill="url(#goldBevelGrad)" />

              <circle cx="345" cy="65" r="6" fill="url(#goldMetallicGrad)" stroke="#734714" strokeWidth="1" />
              <circle cx="345" cy="82" r="4.5" fill="url(#goldMetallicGrad)" stroke="#734714" strokeWidth="0.8" />
            </g>

            {/* ─── BASE COLUMN TERMINATION (Clean Architectural Foot Plinth) ─── */}
            <g id="spire-base-foot">
              <rect
                x="314"
                y="660"
                width="62"
                height="8"
                rx="2"
                fill="url(#goldMetallicGrad)"
                stroke="url(#goldBrightRim)"
                strokeWidth="1.5"
              />
              <rect
                x="308"
                y="668"
                width="74"
                height="10"
                rx="2"
                fill="url(#spireBodyGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.5"
              />
            </g>
          </g>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: THE 4 SIGNPOST WAYPOINTS (Arrows + Medallions + Neon Glow)     */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          {WAYPOINTS.map((wp) => {
            const isHover = hoveredWaypoint === wp.id;
            const cy = wp.cy;
            const Icon = wp.icon;
            // The banner horizontal body spans from X=78 to X=345
            // Center X of the banner body is exactly (78 + 345) / 2 = 211.5
            const bannerCenterX = 211.5;

            return (
              <g
                key={wp.id}
                id={`waypoint-${wp.id}`}
                className="cursor-pointer transition-transform duration-300 ease-out"
                transform={isHover ? "translate(-10, 0)" : "translate(0, 0)"}
                onMouseEnter={() => setHoveredWaypoint(wp.id)}
                onMouseLeave={() => setHoveredWaypoint(null)}
                onClick={() => window.open(wp.href, "_blank", "noopener,noreferrer")}
                role="link"
                tabIndex={0}
                aria-label={`${wp.name} ${wp.handle}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    window.open(wp.href, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {/* ─── A. ORNATE DIRECTIONAL ARROW (Pointing Left) ─── */}
                <g id={`arrow-${wp.id}`}>
                  {/* Neon Glow Outer Outline */}
                  <path
                    d={`
                      M 26,${cy}
                      L 78,${cy - 27}
                      L 74,${cy - 23}
                      L 345,${cy - 23}
                      L 345,${cy + 23}
                      L 74,${cy + 23}
                      L 78,${cy + 27}
                      Z
                    `}
                    fill="none"
                    stroke={wp.neonColor}
                    strokeWidth={isHover ? "4" : "1.8"}
                    filter={`url(#neonGlow-${uniqueId})`}
                    opacity={isHover ? 1 : 0.45}
                  />

                  {/* Outer Heavy Gold Beveled Arrow Shell */}
                  <path
                    d={`
                      M 28,${cy}
                      L 78,${cy - 27}
                      L 74,${cy - 22}
                      L 345,${cy - 22}
                      L 345,${cy + 22}
                      L 74,${cy + 22}
                      L 78,${cy + 27}
                      Z
                    `}
                    fill="url(#goldBevelGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="1.8"
                    filter={`url(#dropShadow-${uniqueId})`}
                  />

                  {/* Top & Bottom Accent Diamond Finials */}
                  <polygon
                    points={`78,${cy - 27} 82,${cy - 31} 78,${cy - 35} 74,${cy - 31}`}
                    fill="url(#goldMetallicGrad)"
                    stroke="#734714"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points={`78,${cy + 27} 82,${cy + 31} 78,${cy + 35} 74,${cy + 31}`}
                    fill="url(#goldMetallicGrad)"
                    stroke="#734714"
                    strokeWidth="0.8"
                  />

                  {/* Inner Dark Obsidian Banner Panel */}
                  <path
                    d={`
                      M 44,${cy}
                      L 76,${cy - 19}
                      L 342,${cy - 19}
                      L 342,${cy + 19}
                      L 76,${cy + 19}
                      Z
                    `}
                    fill="url(#obsidianBannerGrad)"
                    stroke="#59391a"
                    strokeWidth="1.3"
                  />

                  {/* Gold Pinstripe Divider Guides inside Banner */}
                  <line
                    x1="76"
                    y1={cy - 16}
                    x2="330"
                    y2={cy - 16}
                    stroke="#ffd269"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                  <line
                    x1="76"
                    y1={cy + 16}
                    x2="330"
                    y2={cy + 16}
                    stroke="#ffd269"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />

                  {/* Ruby Gemstone Embedded in Left Arrowhead Tip */}
                  <polygon
                    points={`36,${cy} 58,${cy - 12} 68,${cy} 58,${cy + 12}`}
                    fill="url(#rubyGemGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="1.3"
                    filter={`url(#intenseCore-${uniqueId})`}
                  />
                  <polygon
                    points={`40,${cy} 58,${cy - 9} 58,${cy}`}
                    fill="#ff8a94"
                    opacity="0.8"
                  />

                  {/* High-Intensity Laser Shimmer Sweep on Hover */}
                  {isHover && (
                    <rect
                      x="40"
                      y={cy - 19}
                      width="300"
                      height="38"
                      fill="url(#goldBrightRim)"
                      opacity="0.22"
                      className="animate-pulse"
                    />
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* BANNER TYPOGRAPHY: EXACTLY CENTERED & CLEARLY LEGIBLE         */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* Platform Title: Exactly in the horizontal center */}
                  <text
                    x={bannerCenterX}
                    y={cy - 3}
                    textAnchor="middle"
                    fill="url(#goldTextGrad)"
                    fontFamily="Cinzel, 'Times New Roman', Georgia, serif"
                    fontSize="14.5"
                    fontWeight="900"
                    letterSpacing="0.22em"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(255, 215, 60, 0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.95))",
                    }}
                  >
                    {wp.name}
                  </text>

                  {/* Handle / Subtitle: Exactly in the horizontal center */}
                  <text
                    x={bannerCenterX}
                    y={cy + 13}
                    textAnchor="middle"
                    fill="#ff4757"
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fontSize="11.5"
                    fontWeight="800"
                    letterSpacing="0.1em"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255, 71, 87, 0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.95))",
                    }}
                  >
                    {wp.handle}
                  </text>
                </g>

                {/* ─── B. CIRCULAR ASTRONAVIGATION MEDALLION (Column Hub) ─── */}
                <g id={`medallion-${wp.id}`}>
                  {/* Intense Neon Aura Ring Pulsing Around Medallion */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="53"
                    fill="none"
                    stroke={wp.neonColor}
                    strokeWidth={isHover ? "4" : "2.5"}
                    filter={`url(#neonGlow-${uniqueId})`}
                    opacity={isHover ? 1 : 0.8}
                    className="transition-all duration-300"
                  />

                  {/* 4 Cardinal Golden Diamond Studs */}
                  <polygon
                    points={`345,${cy - 59} 350,${cy - 53} 345,${cy - 47} 340,${cy - 53}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  <polygon
                    points={`345,${cy + 47} 350,${cy + 53} 345,${cy + 59} 340,${cy + 53}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  <polygon
                    points={`286,${cy} 292,${cy - 5} 298,${cy} 292,${cy + 5}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  <polygon
                    points={`392,${cy} 398,${cy - 5} 404,${cy} 398,${cy + 5}`}
                    fill="url(#goldMetallicGrad)"
                  />

                  {/* Raised Gold Beveled Medallion Ring */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="46"
                    fill="url(#goldMetallicGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="2.4"
                    filter={`url(#dropShadow-${uniqueId})`}
                  />

                  {/* Inner Stepped Gold Lip */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="39.5"
                    fill="none"
                    stroke="#734714"
                    strokeWidth="1.8"
                  />

                  {/* Deep Obsidian Convex Lens Dome */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="37"
                    fill="url(#lensDomeGrad)"
                  />

                  {/* Top Specular Crescent Glint */}
                  <path
                    d={`
                      M 320,${cy - 19}
                      A 30,30 0 0,1 370,${cy - 19}
                      A 28,26 0 0,0 320,${cy - 19}
                      Z
                    `}
                    fill="#ffffff"
                    opacity="0.4"
                  />

                  {/* Official Platform Vector Icon (Gleaming Gold Emboss) */}
                  <g
                    transform={isHover ? `scale(1.12) translate(${-345 * 0.12}, ${-cy * 0.12})` : ""}
                    className="transition-transform duration-300"
                    filter={isHover ? `url(#intenseCore-${uniqueId})` : undefined}
                  >
                    <Icon cx={345} cy={cy} />
                  </g>
                </g>
              </g>
            );
          })}
        </svg>

        {/* ─── AMBIENT FLOATING SPICE PARTICLES (Desert Atmosphere) ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[
            { top: "14%", left: "76%", delay: "0s", duration: "3.8s", size: "3.5px" },
            { top: "32%", left: "84%", delay: "1.2s", duration: "4.8s", size: "2.5px" },
            { top: "54%", left: "72%", delay: "0.6s", duration: "4.2s", size: "3px" },
            { top: "74%", left: "68%", delay: "1.8s", duration: "3.5s", size: "3.5px" },
          ].map((ember, i) => (
            <div
              key={`spice-${i}`}
              className="absolute rounded-full bg-[#ffd685] opacity-80 animate-pulse"
              style={{
                top: ember.top,
                left: ember.left,
                width: ember.size,
                height: ember.size,
                boxShadow: "0 0 8px rgba(255, 214, 133, 0.95)",
                animationDuration: ember.duration,
                animationDelay: ember.delay,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

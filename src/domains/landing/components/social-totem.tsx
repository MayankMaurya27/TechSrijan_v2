"use client";

import { useState, useEffect, useId } from "react";
import { ExternalLink } from "lucide-react";

interface Waypoint {
  id: string;
  name: string;
  handle: string;
  action: string;
  href: string;
  cy: number; // Center Y in SVG coordinate space (0-760)
  glowColor: string;
  icon: (props: { cx: number; cy: number }) => React.JSX.Element;
}

// ─── SVG VECTOR ICONS (Embossed Burnished Gold) ───
function InstagramGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.15;
  return (
    <g transform={`translate(${cx - 13.8 * s}, ${cy - 13.8 * s}) scale(${s})`}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        ry="5.5"
        fill="none"
        stroke="url(#goldEmbossGrad)"
        strokeWidth="2.1"
      />
      <circle
        cx="12"
        cy="12"
        r="4.4"
        fill="none"
        stroke="url(#goldEmbossGrad)"
        strokeWidth="2.1"
      />
      <circle cx="17.4" cy="6.6" r="1.3" fill="url(#goldEmbossGrad)" />
    </g>
  );
}

function YouTubeGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.15;
  return (
    <g transform={`translate(${cx - 13.8 * s}, ${cy - 13.8 * s}) scale(${s})`}>
      <path
        d="M22.5 7.2a2.9 2.9 0 0 0-2-2C18.7 4.7 12 4.7 12 4.7s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2C1 9 1 12 1 12s0 3 .5 4.8a2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8z"
        fill="url(#goldEmbossGrad)"
      />
      <polygon points="9.8,8.8 15.6,12 9.8,15.2" fill="#140d08" />
    </g>
  );
}

function LinkedInGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.2;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      {/* "in" Typography */}
      <rect x="2" y="8" width="4.2" height="12" rx="1" fill="url(#goldEmbossGrad)" />
      <circle cx="4.1" cy="4.2" r="2.3" fill="url(#goldEmbossGrad)" />
      <path
        d="M9 8h3.8v1.8h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6v6.2h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9V8z"
        fill="url(#goldEmbossGrad)"
      />
    </g>
  );
}

function XGlyph({ cx, cy }: { cx: number; cy: number }) {
  const s = 1.12;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
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
    action: "FOLLOW",
    href: "https://www.instagram.com/techsrijan_mmmut/",
    cy: 145,
    glowColor: "rgba(255, 175, 45, 0.9)",
    icon: InstagramGlyph,
  },
  {
    id: "youtube",
    name: "YOUTUBE",
    handle: "@techsrijan",
    action: "SUBSCRIBE",
    href: "https://www.youtube.com/@techSrijanMMMUT",
    cy: 285,
    glowColor: "rgba(255, 75, 50, 0.85)",
    icon: YouTubeGlyph,
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    handle: "Techsrijan",
    action: "CONNECT",
    href: "https://www.linkedin.com/company/techsrijan/",
    cy: 425,
    glowColor: "rgba(70, 170, 255, 0.85)",
    icon: LinkedInGlyph,
  },
  {
    id: "x",
    name: "X",
    handle: "@techsrijan",
    action: "DISPATCH",
    href: "https://x.com/techsrijan_",
    cy: 565,
    glowColor: "rgba(255, 215, 90, 0.9)",
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

  // Mouse parallax tilt for dimensional depth matching Citadel frames
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
        // Anchored firmly to the right plaza flank, base resting on the ground with generous breathing room
        right: "clamp(4px, 1.2vw, 24px)",
        bottom: "0px",
        opacity: currentOpacity,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: currentOpacity > 0.35 ? "auto" : "none",
        transform: `translate3d(0, ${currentTranslateY}px, 0) rotateY(${mouseTilt.y * 0.7}deg) rotateX(${mouseTilt.x * 0.7}deg)`,
        perspective: "1400px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Master Container: Scaled proportionally with optimal aspect ratio */}
      <div className="relative w-[185px] lg:w-[210px] xl:w-[245px] 2xl:w-[275px] h-[300px] lg:h-[340px] xl:h-[395px] 2xl:h-[445px] flex items-end justify-center">
        {/* ─── Ambient Floor Glow Beneath Stepped Dais ─── */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-[65px] rounded-full pointer-events-none blur-xl animate-pulse"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 175, 45, 0.45) 0%, rgba(212, 168, 67, 0.2) 42%, transparent 75%)",
            animationDuration: "3.6s",
          }}
        />

        {/* ─── NATIVE VECTOR ARCHITECTURAL TOTEM SPIRE (Image 2 Native Reproduction) ─── */}
        <svg
          viewBox="0 0 520 760"
          className="w-full h-full overflow-visible pointer-events-auto"
          style={{
            filter: "drop-shadow(0 20px 35px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 16px rgba(212, 168, 67, 0.22))",
          }}
        >
          <defs>
            {/* Filters */}
            <filter id={`glow-${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="7" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={`softShadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.85" />
            </filter>

            {/* Linear Metallic Gold Gradients */}
            <linearGradient id="goldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2be" />
              <stop offset="25%" stopColor="#d4a843" />
              <stop offset="50%" stopColor="#8a5a18" />
              <stop offset="75%" stopColor="#f3ca65" />
              <stop offset="100%" stopColor="#ffea9f" />
            </linearGradient>

            <linearGradient id="goldBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3bf" />
              <stop offset="35%" stopColor="#d4a843" />
              <stop offset="70%" stopColor="#7a4e12" />
              <stop offset="100%" stopColor="#c49733" />
            </linearGradient>

            <linearGradient id="goldBrightRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffe699" />
              <stop offset="50%" stopColor="#fff8db" />
              <stop offset="100%" stopColor="#c99732" />
            </linearGradient>

            <linearGradient id="goldEmbossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff4c2" />
              <stop offset="50%" stopColor="#ffd269" />
              <stop offset="100%" stopColor="#d49e32" />
            </linearGradient>

            <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff4cd" />
              <stop offset="70%" stopColor="#ffd685" />
              <stop offset="100%" stopColor="#e2af42" />
            </linearGradient>

            {/* Dark Obsidian & Basalt Stone Gradients */}
            <linearGradient id="obsidianBannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e130c" />
              <stop offset="50%" stopColor="#0d0805" />
              <stop offset="100%" stopColor="#1b110a" />
            </linearGradient>

            <linearGradient id="spireBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2c1d13" />
              <stop offset="30%" stopColor="#130b07" />
              <stop offset="70%" stopColor="#1e130b" />
              <stop offset="100%" stopColor="#382619" />
            </linearGradient>

            <linearGradient id="columnPillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffe082" />
              <stop offset="40%" stopColor="#d4a843" />
              <stop offset="70%" stopColor="#6d4610" />
              <stop offset="100%" stopColor="#b38228" />
            </linearGradient>

            {/* Crimson Heraldic Gradient */}
            <linearGradient id="crimsonBannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a31722" />
              <stop offset="50%" stopColor="#6e0e15" />
              <stop offset="100%" stopColor="#3d050a" />
            </linearGradient>

            <linearGradient id="rubyGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d5a" />
              <stop offset="40%" stopColor="#d91424" />
              <stop offset="100%" stopColor="#5e050c" />
            </linearGradient>

            {/* Glowing Energy Gradients */}
            <radialGradient id="amberCoreNeon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffae0" />
              <stop offset="35%" stopColor="#ffb300" />
              <stop offset="70%" stopColor="#ff6f00" />
              <stop offset="100%" stopColor="#b33900" />
            </radialGradient>

            <radialGradient id="lensDomeGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#382417" />
              <stop offset="45%" stopColor="#180f0a" />
              <stop offset="100%" stopColor="#080402" />
            </radialGradient>

            {/* Base Dais Gradients */}
            <radialGradient id="daisRimGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3a2517" />
              <stop offset="60%" stopColor="#1a110a" />
              <stop offset="100%" stopColor="#0d0805" />
            </radialGradient>
          </defs>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: TIERED CIRCULAR DAIS BASE (Pedestal with Radiating Teeth)   */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <g id="base-dais" transform="translate(0, 0)">
            {/* Outer Radiating Triangular Buttress Blades / Teeth */}
            {[
              "M 210,695 L 175,718 L 195,728 L 225,702 Z",
              "M 245,712 L 215,738 L 240,748 L 265,718 Z",
              "M 305,724 L 285,754 L 315,760 L 330,725 Z",
              "M 360,725 L 375,760 L 405,754 L 385,724 Z",
              "M 425,718 L 450,748 L 475,738 L 445,712 Z",
              "M 465,702 L 495,728 L 515,718 L 480,695 Z",
            ].map((d, i) => (
              <path
                key={`tooth-${i}`}
                d={d}
                fill="url(#daisRimGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.6"
              />
            ))}

            {/* Outer Tier Ground Slab */}
            <ellipse
              cx="345"
              cy="705"
              rx="155"
              ry="36"
              fill="url(#daisRimGrad)"
              stroke="url(#goldMetallicGrad)"
              strokeWidth="2.4"
            />

            {/* Glowing Concentric Amber Energy Canal */}
            <ellipse
              cx="345"
              cy="690"
              rx="122"
              ry="27"
              fill="#140c08"
              stroke="#ff9800"
              strokeWidth="3.2"
              filter={`url(#glow-${uniqueId})`}
              opacity="0.92"
            />
            <ellipse
              cx="345"
              cy="690"
              rx="122"
              ry="27"
              fill="none"
              stroke="#ffeb3b"
              strokeWidth="1.2"
            />

            {/* Mid Stepped Platform Ring */}
            <ellipse
              cx="345"
              cy="674"
              rx="90"
              ry="20"
              fill="url(#daisRimGrad)"
              stroke="url(#goldMetallicGrad)"
              strokeWidth="2"
            />

            {/* Inner Raised Dais Hub / Column Socket */}
            <ellipse
              cx="345"
              cy="658"
              rx="58"
              ry="14"
              fill="url(#daisRimGrad)"
              stroke="url(#goldBevelGrad)"
              strokeWidth="2.5"
            />

            {/* Core Vertical Light Conduit Flare at Socket */}
            <ellipse
              cx="345"
              cy="656"
              rx="32"
              ry="8"
              fill="url(#amberCoreNeon)"
              filter={`url(#glow-${uniqueId})`}
            />
          </g>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: CENTRAL OBSIDIAN & BRONZE COLUMN SHAFT                      */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <g id="central-spire">
            {/* Main Obsidian Tower Body */}
            <rect
              x="318"
              y="60"
              width="54"
              height="598"
              fill="url(#spireBodyGrad)"
              stroke="#52361d"
              strokeWidth="1"
            />

            {/* Vertical Fluted Bronze Inner Panels */}
            <rect x="325" y="60" width="10" height="598" fill="#1b110a" />
            <rect x="355" y="60" width="10" height="598" fill="#24170e" />

            {/* Flanking Golden Structural Columns (Left & Right) */}
            <rect
              x="317"
              y="55"
              width="6.5"
              height="603"
              fill="url(#columnPillarGrad)"
              stroke="#734714"
              strokeWidth="0.8"
            />
            <rect
              x="366.5"
              y="55"
              width="6.5"
              height="603"
              fill="url(#columnPillarGrad)"
              stroke="#734714"
              strokeWidth="0.8"
            />

            {/* Glowing Golden Internal Light Conduit (Core Energy Line) */}
            <line
              x1="345"
              y1="70"
              x2="345"
              y2="656"
              stroke="#ffa000"
              strokeWidth="2.5"
              filter={`url(#glow-${uniqueId})`}
              opacity="0.85"
            />
            <line
              x1="345"
              y1="70"
              x2="345"
              y2="656"
              stroke="#fff9c4"
              strokeWidth="0.9"
            />

            {/* Royal Crimson Heraldic Swallowtail Banners with 8-Pointed Star */}
            {/* Banner 1: Below Instagram */}
            <g transform="translate(0, 0)">
              <path
                d="M 333,185 L 357,185 L 357,246 L 345,234 L 333,246 Z"
                fill="url(#crimsonBannerGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.2"
              />
              {/* Gold Sigil Emblem */}
              <polygon
                points="345,200 347,209 356,211 347,213 345,222 343,213 334,211 343,209"
                fill="url(#goldTextGrad)"
              />
            </g>

            {/* Banner 2: Below LinkedIn */}
            <g transform="translate(0, 0)">
              <path
                d="M 333,465 L 357,465 L 357,526 L 345,514 L 333,526 Z"
                fill="url(#crimsonBannerGrad)"
                stroke="url(#goldBevelGrad)"
                strokeWidth="1.2"
              />
              <polygon
                points="345,480 347,489 356,491 347,493 345,502 343,493 334,491 343,489"
                fill="url(#goldTextGrad)"
              />
            </g>

            {/* Hanging Golden Plumb Needle Lines & Orb Weights */}
            {[
              { x: 310, y1: 70, y2: 300, orbY: 304, r: 3.5 },
              { x: 380, y1: 150, y2: 440, orbY: 444, r: 4 },
              { x: 382, y1: 450, y2: 620, orbY: 624, r: 3.5 },
            ].map((p, i) => (
              <g key={`plumb-${i}`}>
                <line x1={p.x} y1={p.y1} x2={p.x} y2={p.y2} stroke="url(#goldBevelGrad)" strokeWidth="1" />
                <circle cx={p.x} cy={p.orbY} r={p.r} fill="url(#goldMetallicGrad)" stroke="#754812" strokeWidth="0.8" />
              </g>
            ))}

            {/* ─── HELICAL SPIRAL RIBBON (Winding Ascending Golden Path) ─── */}
            <g id="helical-ribbon" opacity="0.95">
              {/* Helix Loop 1 (Bottom, around Y=520) */}
              <path
                d="M 285,550 C 265,530 330,470 415,505 C 435,515 410,545 350,530"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              {/* Helix Loop 2 (Middle-low, around Y=380) */}
              <path
                d="M 280,410 C 260,390 330,330 420,365 C 440,375 415,405 350,390"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Helix Loop 3 (Middle-high, around Y=240) */}
              <path
                d="M 285,270 C 265,250 330,190 420,225 C 440,235 415,265 350,250"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="8.5"
                strokeLinecap="round"
              />
              {/* Helix Loop 4 (Top, around Y=110) */}
              <path
                d="M 290,135 C 270,115 340,65 425,105 C 440,115 410,140 350,128"
                fill="none"
                stroke="url(#goldMetallicGrad)"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </g>

            {/* ─── SPIRE APEX NEEDLE & CROWN (Top Finials at Y=12 to 65) ─── */}
            <g id="apex-crown">
              {/* Central Tall Golden Spearhead Needle */}
              <polygon
                points="345,12 350,62 345,67 340,62"
                fill="url(#goldBrightRim)"
                stroke="#694110"
                strokeWidth="0.8"
              />
              <line x1="345" y1="12" x2="345" y2="67" stroke="#fff" strokeWidth="0.8" opacity="0.8" />

              {/* Flanking Satellite Spikes */}
              <polygon points="332,38 335,68 332,71 329,68" fill="url(#goldBevelGrad)" />
              <polygon points="358,38 361,68 358,71 355,68" fill="url(#goldBevelGrad)" />

              {/* Golden Spherical Nodes */}
              <circle cx="345" cy="74" r="6" fill="url(#goldMetallicGrad)" stroke="#734714" strokeWidth="0.9" />
              <circle cx="345" cy="94" r="4.5" fill="url(#goldMetallicGrad)" stroke="#734714" strokeWidth="0.8" />
            </g>
          </g>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 3: THE 4 SIGNPOST WAYPOINTS (Arrows + Glowing Medallions)        */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          {WAYPOINTS.map((wp) => {
            const isHover = hoveredWaypoint === wp.id;
            const cy = wp.cy;
            const Icon = wp.icon;

            return (
              <g
                key={wp.id}
                id={`waypoint-${wp.id}`}
                className="cursor-pointer transition-transform duration-300 ease-out"
                transform={isHover ? "translate(-8, 0)" : "translate(0, 0)"}
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
                  {/* Outer Gold Beveled Arrow Shell */}
                  <path
                    d={`
                      M 28,${cy}
                      L 78,${cy - 26}
                      L 74,${cy - 21}
                      L 345,${cy - 21}
                      L 345,${cy + 21}
                      L 74,${cy + 21}
                      L 78,${cy + 26}
                      Z
                    `}
                    fill="url(#goldBevelGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="1.8"
                    filter={`url(#softShadow-${uniqueId})`}
                  />

                  {/* Top & Bottom Arrowhead Accent Diamond Finials */}
                  <polygon
                    points={`78,${cy - 26} 82,${cy - 30} 78,${cy - 34} 74,${cy - 30}`}
                    fill="url(#goldMetallicGrad)"
                    stroke="#734714"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points={`78,${cy + 26} 82,${cy + 30} 78,${cy + 34} 74,${cy + 30}`}
                    fill="url(#goldMetallicGrad)"
                    stroke="#734714"
                    strokeWidth="0.8"
                  />

                  {/* Inner Dark Obsidian Banner Panel */}
                  <path
                    d={`
                      M 44,${cy}
                      L 76,${cy - 17}
                      L 342,${cy - 17}
                      L 342,${cy + 17}
                      L 76,${cy + 17}
                      Z
                    `}
                    fill="url(#obsidianBannerGrad)"
                    stroke="#5a3818"
                    strokeWidth="1.2"
                  />

                  {/* Gold Pinstripe Divider Lines inside Banner */}
                  <line
                    x1="80"
                    y1={cy - 14}
                    x2="330"
                    y2={cy - 14}
                    stroke="#ffd269"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                  <line
                    x1="80"
                    y1={cy + 14}
                    x2="330"
                    y2={cy + 14}
                    stroke="#ffd269"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />

                  {/* Ruby Gemstone Embedded in Left Arrowhead Tip */}
                  <polygon
                    points={`38,${cy} 58,${cy - 11} 68,${cy} 58,${cy + 11}`}
                    fill="url(#rubyGemGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="1.2"
                  />
                  {/* Gem Specular Facet Line */}
                  <polygon
                    points={`42,${cy} 58,${cy - 8} 58,${cy}`}
                    fill="#ff808b"
                    opacity="0.65"
                  />

                  {/* Shimmer Light Beam Effect on Hover */}
                  {isHover && (
                    <rect
                      x="40"
                      y={cy - 17}
                      width="295"
                      height="34"
                      fill="url(#goldBrightRim)"
                      opacity="0.16"
                      className="animate-pulse"
                    />
                  )}

                  {/* Banner Typography: Platform Name & Handle */}
                  <text
                    x="94"
                    y={cy - 3}
                    fill="url(#goldTextGrad)"
                    fontFamily="Cinzel, 'Times New Roman', serif"
                    fontSize="11.5"
                    fontWeight="800"
                    letterSpacing="0.22em"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                  >
                    {wp.name}
                  </text>

                  <text
                    x="94"
                    y={cy + 12}
                    fill="#ff3d4d"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="9.8"
                    fontWeight="700"
                    letterSpacing="0.08em"
                  >
                    {wp.handle}
                  </text>
                </g>

                {/* ─── B. CIRCULAR ASTRONAVIGATION MEDALLION (Column Hub) ─── */}
                <g id={`medallion-${wp.id}`} transform="translate(0, 0)">
                  {/* Outer Pulsing Neon Amber Energy Ring on Hover / Idle */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="52"
                    fill="none"
                    stroke={wp.glowColor}
                    strokeWidth={isHover ? "3.6" : "2.2"}
                    filter={`url(#glow-${uniqueId})`}
                    opacity={isHover ? "1" : "0.75"}
                  />

                  {/* 4 Cardinal Golden Diamond Studs */}
                  {/* Top */}
                  <polygon
                    points={`345,${cy - 57} 349,${cy - 51} 345,${cy - 45} 341,${cy - 51}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  {/* Bottom */}
                  <polygon
                    points={`345,${cy + 45} 349,${cy + 51} 345,${cy + 57} 341,${cy + 51}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  {/* Left */}
                  <polygon
                    points={`288,${cy} 294,${cy - 4} 300,${cy} 294,${cy + 4}`}
                    fill="url(#goldMetallicGrad)"
                  />
                  {/* Right */}
                  <polygon
                    points={`390,${cy} 396,${cy - 4} 402,${cy} 396,${cy + 4}`}
                    fill="url(#goldMetallicGrad)"
                  />

                  {/* Heavy Raised Gold Beveled Ring */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="44"
                    fill="url(#goldMetallicGrad)"
                    stroke="url(#goldBrightRim)"
                    strokeWidth="2.2"
                    filter={`url(#softShadow-${uniqueId})`}
                  />

                  {/* Inner Stepped Gold Lip */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="37.5"
                    fill="none"
                    stroke="#734714"
                    strokeWidth="1.8"
                  />

                  {/* Deep Obsidian Convex Lens Dome */}
                  <circle
                    cx="345"
                    cy={cy}
                    r="35.5"
                    fill="url(#lensDomeGrad)"
                  />

                  {/* Top Specular Crescent Glint */}
                  <path
                    d={`
                      M 322,${cy - 18}
                      A 28,28 0 0,1 368,${cy - 18}
                      A 26,24 0 0,0 322,${cy - 18}
                      Z
                    `}
                    fill="#fff4d0"
                    opacity="0.3"
                  />

                  {/* Official Platform Vector Icon (Gleaming Gold Emboss) */}
                  <g
                    transform={isHover ? `scale(1.1) translate(${-345 * 0.1}, ${-cy * 0.1})` : ""}
                    className="transition-transform duration-300"
                  >
                    <Icon cx={345} cy={cy} />
                  </g>
                </g>
              </g>
            );
          })}
        </svg>

        {/* ─── HOLOGRAPHIC DUNE DIRECTIVE TOOLTIPS (HTML/CSS Floating Overlay) ─── */}
        {WAYPOINTS.map((wp) => {
          const isHover = hoveredWaypoint === wp.id;
          // Percentage Y in container: 145/760 ≈ 19%, 285/760 ≈ 37.5%, 425/760 ≈ 56%, 565/760 ≈ 74%
          const topPercent = (wp.cy / 760) * 100;

          return (
            <div
              key={`tooltip-${wp.id}`}
              className={`absolute right-[102%] -translate-y-1/2 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded border border-[#d4a843]/70 bg-black/92 backdrop-blur-md shadow-[0_0_20px_rgba(212,168,67,0.55)] transition-all duration-300 whitespace-nowrap z-50 ${
                isHover
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-3 scale-95 pointer-events-none"
              }`}
              style={{ top: `${topPercent}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffd685] shadow-[0_0_8px_#ffd685] animate-ping" />
              <span className="text-[9.5px] font-mono tracking-[0.2em] uppercase font-bold text-[#ffd685]">
                {wp.action}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-[#ff8080]">
                {wp.handle}
              </span>
              <ExternalLink className="w-3 h-3 text-[#d4a843] ml-0.5" />
            </div>
          );
        })}

        {/* ─── AMBIENT FLOATING SPICE PARTICLES (Desert Atmosphere) ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[
            { top: "18%", left: "78%", delay: "0s", duration: "4s", size: "3px" },
            { top: "35%", left: "84%", delay: "1.2s", duration: "5s", size: "2.5px" },
            { top: "58%", left: "74%", delay: "0.6s", duration: "4.5s", size: "2px" },
            { top: "78%", left: "68%", delay: "1.8s", duration: "3.8s", size: "3px" },
          ].map((ember, i) => (
            <div
              key={`spice-${i}`}
              className="absolute rounded-full bg-[#ffd685] opacity-75 animate-pulse"
              style={{
                top: ember.top,
                left: ember.left,
                width: ember.size,
                height: ember.size,
                boxShadow: "0 0 6px rgba(255, 214, 133, 0.8)",
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

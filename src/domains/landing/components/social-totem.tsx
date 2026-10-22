"use client";

import { useState, useEffect, useRef, useId } from "react";
import type { CanonicalTheme } from "@/core";
import { getPrefersReducedMotion } from "@/core/utils/reduced-motion";
import { useActiveCanonicalTheme } from "../hooks/use-active-theme";

interface Waypoint {
  id: string;
  name: string;
  handle: string;
  href: string;
  cy: number; // Center Y in SVG coordinate space (0-680)
  renderIcon: (cx: number, cy: number, embossId: string) => React.JSX.Element;
}

// ─── MATHEMATICALLY PIXEL-PERFECT CENTERED SVG ICONS ───
function renderInstagram(cx: number, cy: number, embossId: string) {
  return (
    <svg
      x={cx - 16}
      y={cy - 16}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${embossId})`}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="overflow-visible"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" ry="5.5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

function renderWhatsApp(cx: number, cy: number, embossId: string) {
  return (
    <svg
      x={cx - 16}
      y={cy - 16}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill={`url(#${embossId})`}
      className="overflow-visible"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24m4.52 11.59c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.06 0 1.21.88 2.39 1 2.56.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.13-.22-.19-.47-.32" />
    </svg>
  );
}

function renderLinkedIn(cx: number, cy: number, embossId: string) {
  return (
    <svg
      x={cx - 15}
      y={cy - 15}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill={`url(#${embossId})`}
      className="overflow-visible"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}

function renderX(cx: number, cy: number, embossId: string) {
  return (
    <svg
      x={cx - 15}
      y={cy - 15}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill={`url(#${embossId})`}
      className="overflow-visible"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const WAYPOINTS: Waypoint[] = [
  {
    id: "instagram",
    name: "INSTAGRAM",
    handle: "@techsrijan_mmmut",
    href: "https://www.instagram.com/techsrijan_mmmut",
    cy: 110,
    renderIcon: renderInstagram,
  },
  {
    id: "whatsapp",
    name: "WHATSAPP",
    handle: "TechSrijan Channel",
    href: "https://whatsapp.com/channel/0029VbBGctj1Hsq0KeSlRl0G",
    cy: 250,
    renderIcon: renderWhatsApp,
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    handle: "techsrijan-mmmut",
    href: "https://www.linkedin.com/company/techsrijan-mmmut/",
    cy: 390,
    renderIcon: renderLinkedIn,
  },
  {
    id: "x",
    name: "X",
    handle: "@TechSrijan_Fest",
    href: "https://x.com/TechSrijan_Fest",
    cy: 530,
    renderIcon: renderX,
  },
];

interface TotemThemeConfig {
  id: CanonicalTheme;
  outerFilterGlow: string;
  spireBody: {
    stop0: string;
    stop30: string;
    stop70: string;
    stop100: string;
    stroke: string;
  };
  flutedPanel1: string;
  flutedPanel2: string;
  columnPillar: {
    stop0: string;
    stop40: string;
    stop70: string;
    stop100: string;
    stroke: string;
  };
  laserBeam: {
    stop0: string;
    stop30: string;
    stop70: string;
    stop100: string;
  };
  metallicGrad: {
    stop0: string;
    stop25: string;
    stop50: string;
    stop75: string;
    stop100: string;
  };
  bevelGrad: {
    stop0: string;
    stop30: string;
    stop70: string;
    stop100: string;
  };
  brightRim: {
    stop0: string;
    stop50: string;
    stop100: string;
  };
  embossGrad: {
    stop0: string;
    stop35: string;
    stop75: string;
    stop100: string;
  };
  textGrad: {
    stop0: string;
    stop40: string;
    stop80: string;
    stop100: string;
  };
  bannerGrad: {
    stop0: string;
    stop50: string;
    stop100: string;
  };
  lensDome: {
    stop0: string;
    stop45: string;
    stop100: string;
  };
  ribbonNeonStroke: string;
  apexRingStroke: string;
  apexSpikeStroke: string;
  innerLipStroke: string;
  emberColor: string;
  emberShadow: string;
  waypointNeons: Record<string, { stroke: string; glow: string }>;
}

const TOTEM_THEMES: Record<CanonicalTheme, TotemThemeConfig> = {
  "arrakis-day": {
    id: "arrakis-day",
    outerFilterGlow: "",
    spireBody: {
      stop0: "#2c1d13",
      stop30: "#100905",
      stop70: "#1b1008",
      stop100: "#352316",
      stroke: "#59391a",
    },
    flutedPanel1: "#170f08",
    flutedPanel2: "#20140b",
    columnPillar: {
      stop0: "#fff4bd",
      stop40: "#d4a843",
      stop70: "#66410e",
      stop100: "#c28e2a",
      stroke: "#734714",
    },
    laserBeam: {
      stop0: "#ffffff",
      stop30: "#ffd54f",
      stop70: "#ffb300",
      stop100: "#ff8f00",
    },
    metallicGrad: {
      stop0: "#fff8d6",
      stop25: "#ffd54f",
      stop50: "#8a5a18",
      stop75: "#f7d374",
      stop100: "#ffea9f",
    },
    bevelGrad: {
      stop0: "#fff8d9",
      stop30: "#ffd54f",
      stop70: "#8a5716",
      stop100: "#d4a843",
    },
    brightRim: {
      stop0: "#fff9db",
      stop50: "#ffd700",
      stop100: "#d4a330",
    },
    embossGrad: {
      stop0: "#ffffff",
      stop35: "#ffe27a",
      stop75: "#ffd043",
      stop100: "#b37f19",
    },
    textGrad: {
      stop0: "#ffffff",
      stop40: "#fff5cb",
      stop80: "#ffd868",
      stop100: "#ffb300",
    },
    bannerGrad: {
      stop0: "#ba1a27",
      stop50: "#7a0e16",
      stop100: "#3d050a",
    },
    lensDome: {
      stop0: "#3d2719",
      stop45: "#180e08",
      stop100: "#080402",
    },
    ribbonNeonStroke: "#ffd54f",
    apexRingStroke: "#ffb300",
    apexSpikeStroke: "#694110",
    innerLipStroke: "#734714",
    emberColor: "#ffd685",
    emberShadow: "rgba(255, 214, 133, 0.95)",
    waypointNeons: {
      instagram: { stroke: "#ff9900", glow: "rgba(255, 180, 50, 0.95)" },
      whatsapp: { stroke: "#25D366", glow: "rgba(37, 211, 102, 0.95)" },
      linkedin: { stroke: "#00b4d8", glow: "rgba(50, 180, 255, 0.95)" },
      x: { stroke: "#ffd60a", glow: "rgba(255, 220, 80, 0.95)" },
    },
  },
  "geass-moon": {
    id: "geass-moon",
    outerFilterGlow: "",
    spireBody: {
      stop0: "#240205",
      stop30: "#0d0102",
      stop70: "#160204",
      stop100: "#2d0306",
      stroke: "#550005",
    },
    flutedPanel1: "#100102",
    flutedPanel2: "#1c0204",
    columnPillar: {
      stop0: "#ff4d2e",
      stop40: "#cc000a",
      stop70: "#5c0005",
      stop100: "#a30008",
      stroke: "#5c0005",
    },
    laserBeam: {
      stop0: "#fff8f0",
      stop30: "#ff3300",
      stop70: "#cc000a",
      stop100: "#660005",
    },
    metallicGrad: {
      stop0: "#ff5e40",
      stop25: "#d6000c",
      stop50: "#5c0005",
      stop75: "#b8000a",
      stop100: "#e6000e",
    },
    bevelGrad: {
      stop0: "#ff5e40",
      stop30: "#cc000a",
      stop70: "#550004",
      stop100: "#990008",
    },
    brightRim: {
      stop0: "#ffa08a",
      stop50: "#e6000a",
      stop100: "#800005",
    },
    embossGrad: {
      stop0: "#fff5eb",
      stop35: "#ff4d2e",
      stop75: "#cc000a",
      stop100: "#660005",
    },
    textGrad: {
      stop0: "#ffffff",
      stop40: "#ffe2d6",
      stop80: "#ff3300",
      stop100: "#cc000a",
    },
    bannerGrad: {
      stop0: "#cc000a",
      stop50: "#730005",
      stop100: "#240003",
    },
    lensDome: {
      stop0: "#330004",
      stop45: "#140002",
      stop100: "#080001",
    },
    ribbonNeonStroke: "#ff2200",
    apexRingStroke: "#cc000a",
    apexSpikeStroke: "#5c0005",
    innerLipStroke: "#730005",
    emberColor: "#ff3300",
    emberShadow: "rgba(255, 34, 0, 0.95)",
    waypointNeons: {
      instagram: { stroke: "#ff3300", glow: "rgba(255, 51, 0, 0.95)" },
      whatsapp: { stroke: "#d6000a", glow: "rgba(214, 0, 10, 0.95)" },
      linkedin: { stroke: "#b30008", glow: "rgba(179, 0, 8, 0.95)" },
      x: { stroke: "#ff1e00", glow: "rgba(255, 30, 0, 0.95)" },
    },
  },
  "krelln-night": {
    id: "krelln-night",
    outerFilterGlow: "",
    spireBody: {
      stop0: "#161c24",
      stop30: "#090c10",
      stop70: "#11161d",
      stop100: "#202834",
      stroke: "#334155",
    },
    flutedPanel1: "#0b0f14",
    flutedPanel2: "#141920",
    columnPillar: {
      stop0: "#ffffff",
      stop40: "#cbd5e1",
      stop70: "#475569",
      stop100: "#94a3b8",
      stroke: "#475569",
    },
    laserBeam: {
      stop0: "#ffffff",
      stop30: "#e2e8f0",
      stop70: "#94a3b8",
      stop100: "#475569",
    },
    metallicGrad: {
      stop0: "#ffffff",
      stop25: "#e2e8f0",
      stop50: "#475569",
      stop75: "#cbd5e1",
      stop100: "#94a3b8",
    },
    bevelGrad: {
      stop0: "#ffffff",
      stop30: "#cbd5e1",
      stop70: "#475569",
      stop100: "#64748b",
    },
    brightRim: {
      stop0: "#ffffff",
      stop50: "#f1f5f9",
      stop100: "#94a3b8",
    },
    embossGrad: {
      stop0: "#ffffff",
      stop35: "#f1f5f9",
      stop75: "#cbd5e1",
      stop100: "#64748b",
    },
    textGrad: {
      stop0: "#ffffff",
      stop40: "#f8fafc",
      stop80: "#cbd5e1",
      stop100: "#94a3b8",
    },
    bannerGrad: {
      stop0: "#475569",
      stop50: "#334155",
      stop100: "#0f172a",
    },
    lensDome: {
      stop0: "#1e2632",
      stop45: "#0f141a",
      stop100: "#050709",
    },
    ribbonNeonStroke: "#cbd5e1",
    apexRingStroke: "#94a3b8",
    apexSpikeStroke: "#334155",
    innerLipStroke: "#475569",
    emberColor: "#e2e8f0",
    emberShadow: "rgba(203, 213, 225, 0.95)",
    waypointNeons: {
      instagram: { stroke: "#e2e8f0", glow: "rgba(226, 232, 240, 0.92)" },
      whatsapp: { stroke: "#94a3b8", glow: "rgba(148, 163, 184, 0.92)" },
      linkedin: { stroke: "#cbd5e1", glow: "rgba(203, 213, 225, 0.92)" },
      x: { stroke: "#f8fafc", glow: "rgba(248, 250, 252, 0.95)" },
    },
  },
};

interface SocialTotemProps {
  scrollProgress?: number;
}

export function SocialTotem({ scrollProgress = 0 }: SocialTotemProps) {
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);
  const totemRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "");

  // Dynamic Theme Synchronization with 0ms reactivity
  const currentTheme = useActiveCanonicalTheme();
  const totemTheme = TOTEM_THEMES[currentTheme] || TOTEM_THEMES["arrakis-day"];

  // RAF-throttled mouse parallax tilt for 3D depth matching the Citadel monoliths (Direct DOM style mutation)
  useEffect(() => {
    let rafId = 0;
    const prefersReducedMotion = getPrefersReducedMotion();
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w > 0 && h > 0 && totemRef.current) {
          const rotY = ((e.clientX / w - 0.5) * 4.5 * 0.65).toFixed(2);
          const rotX = (-(e.clientY / h - 0.5) * 3.2 * 0.65).toFixed(2);
          totemRef.current.style.transform = `translate3d(0, var(--totem-translate-y, 0px), 0) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
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

  // Center coordinate of the vertical pillar column inside viewBox 0 0 220 680
  const CX = 110;

  // Prefix IDs to prevent collisions between theme variants
  const embossGradId = `embossGrad-${uniqueId}`;
  const metallicGradId = `metallicGrad-${uniqueId}`;
  const bevelGradId = `bevelGrad-${uniqueId}`;
  const brightRimId = `brightRim-${uniqueId}`;
  const textGradId = `textGrad-${uniqueId}`;
  const spireBodyGradId = `spireBodyGrad-${uniqueId}`;
  const columnPillarGradId = `columnPillarGrad-${uniqueId}`;
  const bannerGradId = `bannerGrad-${uniqueId}`;
  const laserBeamGradId = `laserBeamGrad-${uniqueId}`;
  const lensDomeGradId = `lensDomeGrad-${uniqueId}`;

  return (
    <div
      ref={totemRef}
      className="hidden lg:block pointer-events-none absolute z-30 select-none transition-all duration-700"
      style={{
        // Perfectly positioned on the right flank, aligned with Citadel Archive cards
        right: "clamp(16px, 2.8vw, 64px)",
        bottom: "clamp(35px, 5.5vh, 70px)",
        opacity: currentOpacity,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: currentOpacity > 0.35 ? "auto" : "none",
        ["--totem-translate-y" as string]: `${currentTranslateY}px`,
        transform: `translate3d(0, var(--totem-translate-y, 0px), 0) rotateY(0deg) rotateX(0deg)`,
        perspective: "1400px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {/* Sleek vertical column container: no arrows, centered, open from below */}
      <div className="relative w-[100px] lg:w-[120px] xl:w-[140px] 2xl:w-[160px] h-[440px] lg:h-[480px] xl:h-[535px] 2xl:h-[590px] flex items-center justify-center">
        <svg
          viewBox="0 0 220 680"
          className="w-full h-full overflow-visible pointer-events-auto transition-[filter] duration-500"
          style={{
            filter: `drop-shadow(0 20px 35px rgba(0, 0, 0, 0.92)) ${totemTheme.outerFilterGlow}`,
          }}
        >
          <defs>
            {/* Multi-Pass Holographic Neon Glow Filter */}
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

            {/* Radiant Metallic Gradients (Dynamically Themed) */}
            <linearGradient id={metallicGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={totemTheme.metallicGrad.stop0} />
              <stop offset="25%" stopColor={totemTheme.metallicGrad.stop25} />
              <stop offset="50%" stopColor={totemTheme.metallicGrad.stop50} />
              <stop offset="75%" stopColor={totemTheme.metallicGrad.stop75} />
              <stop offset="100%" stopColor={totemTheme.metallicGrad.stop100} />
            </linearGradient>

            <linearGradient id={bevelGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={totemTheme.bevelGrad.stop0} />
              <stop offset="30%" stopColor={totemTheme.bevelGrad.stop30} />
              <stop offset="70%" stopColor={totemTheme.bevelGrad.stop70} />
              <stop offset="100%" stopColor={totemTheme.bevelGrad.stop100} />
            </linearGradient>

            <linearGradient id={brightRimId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={totemTheme.brightRim.stop0} />
              <stop offset="50%" stopColor={totemTheme.brightRim.stop50} />
              <stop offset="100%" stopColor={totemTheme.brightRim.stop100} />
            </linearGradient>

            <linearGradient id={embossGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={totemTheme.embossGrad.stop0} />
              <stop offset="35%" stopColor={totemTheme.embossGrad.stop35} />
              <stop offset="75%" stopColor={totemTheme.embossGrad.stop75} />
              <stop offset="100%" stopColor={totemTheme.embossGrad.stop100} />
            </linearGradient>

            <linearGradient id={textGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={totemTheme.textGrad.stop0} />
              <stop offset="40%" stopColor={totemTheme.textGrad.stop40} />
              <stop offset="80%" stopColor={totemTheme.textGrad.stop80} />
              <stop offset="100%" stopColor={totemTheme.textGrad.stop100} />
            </linearGradient>

            {/* Dark Obsidian Spire Gradients */}
            <linearGradient id={spireBodyGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={totemTheme.spireBody.stop0} />
              <stop offset="30%" stopColor={totemTheme.spireBody.stop30} />
              <stop offset="70%" stopColor={totemTheme.spireBody.stop70} />
              <stop offset="100%" stopColor={totemTheme.spireBody.stop100} />
            </linearGradient>

            <linearGradient id={columnPillarGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={totemTheme.columnPillar.stop0} />
              <stop offset="40%" stopColor={totemTheme.columnPillar.stop40} />
              <stop offset="70%" stopColor={totemTheme.columnPillar.stop70} />
              <stop offset="100%" stopColor={totemTheme.columnPillar.stop100} />
            </linearGradient>

            {/* Open-Ended Fade Mask for Bottom of Column (Keeps it cleanly open below) */}
            <linearGradient id="openBottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <mask id="spireOpenMask">
              <rect x="0" y="0" width="220" height="680" fill="url(#openBottomFade)" />
            </mask>

            {/* Themed Heraldic Gradient */}
            <linearGradient id={bannerGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={totemTheme.bannerGrad.stop0} />
              <stop offset="50%" stopColor={totemTheme.bannerGrad.stop50} />
              <stop offset="100%" stopColor={totemTheme.bannerGrad.stop100} />
            </linearGradient>

            {/* Themed Laser Beam Gradients */}
            <linearGradient id={laserBeamGradId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={totemTheme.laserBeam.stop0} stopOpacity="0.2" />
              <stop offset="30%" stopColor={totemTheme.laserBeam.stop30} stopOpacity="0.95" />
              <stop offset="70%" stopColor={totemTheme.laserBeam.stop70} stopOpacity="0.8" />
              <stop offset="100%" stopColor={totemTheme.laserBeam.stop100} stopOpacity="0.3" />
            </linearGradient>

            <radialGradient id={lensDomeGradId} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor={totemTheme.lensDome.stop0} />
              <stop offset="45%" stopColor={totemTheme.lensDome.stop45} />
              <stop offset="100%" stopColor={totemTheme.lensDome.stop100} />
            </radialGradient>
          </defs>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: CENTRAL OBSIDIAN & THEMED SPIRE SHAFT (OPEN FROM BELOW)       */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <g id="central-spire" mask="url(#spireOpenMask)">
            {/* White-Hot Core Laser Column inside the Spire */}
            <line
              x1={CX}
              y1="45"
              x2={CX}
              y2={675}
              stroke={`url(#${laserBeamGradId})`}
              strokeWidth="5"
              strokeLinecap="round"
              filter={`url(#neonGlow-${uniqueId})`}
              opacity="0.85"
            />
            <line
              x1={CX}
              y1="45"
              x2={CX}
              y2={675}
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Main Obsidian Tower Body */}
            <rect
              x={CX - 27}
              y="45"
              width="54"
              height="630"
              fill={`url(#${spireBodyGradId})`}
              stroke={totemTheme.spireBody.stroke}
              strokeWidth="1"
            />

            {/* Fluted Vertical Panels */}
            <rect x={CX - 20} y="45" width="11" height="630" fill={totemTheme.flutedPanel1} />
            <rect x={CX + 9} y="45" width="11" height="630" fill={totemTheme.flutedPanel2} />

            {/* Flanking Structural Columns (Left & Right) */}
            <rect
              x={CX - 28}
              y="40"
              width="7"
              height="635"
              fill={`url(#${columnPillarGradId})`}
              stroke={totemTheme.columnPillar.stroke}
              strokeWidth="0.8"
            />
            <rect
              x={CX + 21}
              y="40"
              width="7"
              height="635"
              fill={`url(#${columnPillarGradId})`}
              stroke={totemTheme.columnPillar.stroke}
              strokeWidth="0.8"
            />

            {/* Themed Heraldic Swallowtail Banners with 8-Pointed Star Sigil */}
            {/* Banner 1: Between Instagram & WhatsApp */}
            <g transform="translate(0, 0)">
              <path
                d={`M ${CX - 12},155 L ${CX + 12},155 L ${CX + 12},215 L ${CX},203 L ${CX - 12},215 Z`}
                fill={`url(#${bannerGradId})`}
                stroke={`url(#${bevelGradId})`}
                strokeWidth="1.3"
              />
              <polygon
                points={`${CX},170 ${CX + 2},179 ${CX + 11},181 ${CX + 2},183 ${CX},192 ${CX - 2},183 ${CX - 11},181 ${CX - 2},179`}
                fill={`url(#${textGradId})`}
                filter={`url(#intenseCore-${uniqueId})`}
              />
            </g>

            {/* Banner 2: Between LinkedIn & X */}
            <g transform="translate(0, 0)">
              <path
                d={`M ${CX - 12},435 L ${CX + 12},435 L ${CX + 12},495 L ${CX},483 L ${CX - 12},495 Z`}
                fill={`url(#${bannerGradId})`}
                stroke={`url(#${bevelGradId})`}
                strokeWidth="1.3"
              />
              <polygon
                points={`${CX},450 ${CX + 2},459 ${CX + 11},461 ${CX + 2},463 ${CX},472 ${CX - 2},463 ${CX - 11},461 ${CX - 2},459`}
                fill={`url(#${textGradId})`}
                filter={`url(#intenseCore-${uniqueId})`}
              />
            </g>

            {/* ─── HELICAL SPIRAL RIBBON WITH THEMED NEON EDGES ─── */}
            <g id="helical-ribbon" opacity="0.95">
              {/* Loop 1 (around Y=480) */}
              <path
                d={`M ${CX - 60},510 C ${CX - 80},490 ${CX - 15},430 ${CX + 70},465 C ${CX + 93},477 ${CX + 65},510 ${CX + 5},495`}
                fill="none"
                stroke={`url(#${metallicGradId})`}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - 60},510 C ${CX - 80},490 ${CX - 15},430 ${CX + 70},465 C ${CX + 93},477 ${CX + 65},510 ${CX + 5},495`}
                fill="none"
                stroke={totemTheme.ribbonNeonStroke}
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 2 (around Y=340) */}
              <path
                d={`M ${CX - 65},370 C ${CX - 85},350 ${CX - 15},290 ${CX + 75},325 C ${CX + 97},337 ${CX + 70},370 ${CX + 5},355`}
                fill="none"
                stroke={`url(#${metallicGradId})`}
                strokeWidth="8.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - 65},370 C ${CX - 85},350 ${CX - 15},290 ${CX + 75},325 C ${CX + 97},337 ${CX + 70},370 ${CX + 5},355`}
                fill="none"
                stroke={totemTheme.ribbonNeonStroke}
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 3 (around Y=200) */}
              <path
                d={`M ${CX - 60},230 C ${CX - 80},210 ${CX - 15},150 ${CX + 75},185 C ${CX + 97},197 ${CX + 70},230 ${CX + 5},215`}
                fill="none"
                stroke={`url(#${metallicGradId})`}
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - 60},230 C ${CX - 80},210 ${CX - 15},150 ${CX + 75},185 C ${CX + 97},197 ${CX + 70},230 ${CX + 5},215`}
                fill="none"
                stroke={totemTheme.ribbonNeonStroke}
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />

              {/* Loop 4 (around Y=75) */}
              <path
                d={`M ${CX - 55},95 C ${CX - 75},75 ${CX - 5},25 ${CX + 80},65 C ${CX + 97},77 ${CX + 65},105 ${CX + 5},92`}
                fill="none"
                stroke={`url(#${metallicGradId})`}
                strokeWidth="9.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${CX - 55},95 C ${CX - 75},75 ${CX - 5},25 ${CX + 80},65 C ${CX + 97},77 ${CX + 65},105 ${CX + 5},92`}
                fill="none"
                stroke={totemTheme.ribbonNeonStroke}
                strokeWidth="2.5"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.8"
              />
            </g>

            {/* ─── SPIRE APEX NEEDLE & CROWN (Top Finials at Y=6 to 58) ─── */}
            <g id="apex-crown">
              <circle
                cx={CX}
                cy="28"
                r="18"
                fill="none"
                stroke={totemTheme.apexRingStroke}
                strokeWidth="2"
                filter={`url(#neonGlow-${uniqueId})`}
                opacity="0.85"
              />
              <polygon
                points={`${CX},6 ${CX + 6},52 ${CX},58 ${CX - 6},52`}
                fill={`url(#${brightRimId})`}
                stroke={totemTheme.apexSpikeStroke}
                strokeWidth="1"
                filter={`url(#intenseCore-${uniqueId})`}
              />
              <line x1={CX} y1="6" x2={CX} y2="58" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

              <polygon points={`${CX - 14},28 ${CX - 11},56 ${CX - 14},59 ${CX - 17},56`} fill={`url(#${bevelGradId})`} />
              <polygon points={`${CX + 14},28 ${CX + 17},56 ${CX + 14},59 ${CX + 11},56`} fill={`url(#${bevelGradId})`} />

              <circle cx={CX} cy="65" r="6" fill={`url(#${metallicGradId})`} stroke={totemTheme.innerLipStroke} strokeWidth="1" />
              <circle cx={CX} cy="82" r="4.5" fill={`url(#${metallicGradId})`} stroke={totemTheme.innerLipStroke} strokeWidth="0.8" />
            </g>
          </g>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: THE 4 CIRCULAR ASTRONAVIGATION MEDALLIONS (Centered on Spire) */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          {WAYPOINTS.map((wp) => {
            const isHover = hoveredWaypoint === wp.id;
            const cy = wp.cy;
            const neon = totemTheme.waypointNeons[wp.id] || { stroke: totemTheme.ribbonNeonStroke, glow: totemTheme.emberShadow };

            return (
              <g
                key={wp.id}
                id={`waypoint-${wp.id}`}
                className="cursor-pointer transition-transform duration-300 ease-out"
                transform={isHover ? `scale(1.1) translate(${-(CX * 0.1)}, ${-(cy * 0.1)})` : ""}
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
                {/* Intense Neon Aura Ring Pulsing Around Medallion */}
                <circle
                  cx={CX}
                  cy={cy}
                  r="53"
                  fill="none"
                  stroke={neon.stroke}
                  strokeWidth={isHover ? "4.5" : "2.6"}
                  filter={`url(#neonGlow-${uniqueId})`}
                  opacity={isHover ? 1 : 0.82}
                  className="transition-all duration-300"
                />

                {/* 4 Cardinal Golden/Themed Diamond Studs */}
                <polygon
                  points={`${CX},${cy - 59} ${CX + 5},${cy - 53} ${CX},${cy - 47} ${CX - 5},${cy - 53}`}
                  fill={`url(#${metallicGradId})`}
                />
                <polygon
                  points={`${CX},${cy + 47} ${CX + 5},${cy + 53} ${CX},${cy + 59} ${CX - 5},${cy + 53}`}
                  fill={`url(#${metallicGradId})`}
                />
                <polygon
                  points={`${CX - 59},${cy} ${CX - 53},${cy - 5} ${CX - 47},${cy} ${CX - 53},${cy + 5}`}
                  fill={`url(#${metallicGradId})`}
                />
                <polygon
                  points={`${CX + 47},${cy} ${CX + 53},${cy - 5} ${CX + 59},${cy} ${CX + 53},${cy + 5}`}
                  fill={`url(#${metallicGradId})`}
                />

                {/* Raised Themed Beveled Medallion Outer Ring */}
                <circle
                  cx={CX}
                  cy={cy}
                  r="46"
                  fill={`url(#${metallicGradId})`}
                  stroke={`url(#${brightRimId})`}
                  strokeWidth="2.4"
                  filter={`url(#dropShadow-${uniqueId})`}
                />

                {/* Inner Stepped Lip */}
                <circle
                  cx={CX}
                  cy={cy}
                  r="39.5"
                  fill="none"
                  stroke={totemTheme.innerLipStroke}
                  strokeWidth="1.8"
                />

                {/* Deep Obsidian Convex Lens Dome */}
                <circle
                  cx={CX}
                  cy={cy}
                  r="37"
                  fill={`url(#${lensDomeGradId})`}
                />

                {/* Top Specular Crescent Glint */}
                <path
                  d={`
                    M ${CX - 25},${cy - 19}
                    A 30,30 0 0,1 ${CX + 25},${cy - 19}
                    A 28,26 0 0,0 ${CX - 25},${cy - 19}
                    Z
                  `}
                  fill="#ffffff"
                  opacity="0.4"
                />

                {/* Official Vector Glyph (Guaranteed 100% Mathematically Centered) */}
                <g filter={isHover ? `url(#intenseCore-${uniqueId})` : undefined}>
                  {wp.renderIcon(CX, cy, embossGradId)}
                </g>
              </g>
            );
          })}
        </svg>

        {/* ─── AMBIENT FLOATING PARTICLES (THEMED) ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[
            { top: "14%", left: "70%", delay: "0s", duration: "3.8s", size: "3.5px" },
            { top: "34%", left: "80%", delay: "1.2s", duration: "4.8s", size: "2.5px" },
            { top: "54%", left: "25%", delay: "0.6s", duration: "4.2s", size: "3px" },
            { top: "74%", left: "30%", delay: "1.8s", duration: "3.5s", size: "3.5px" },
          ].map((ember, i) => (
            <div
              key={`spice-${i}`}
              className="absolute rounded-full opacity-80 animate-pulse transition-colors duration-500"
              style={{
                top: ember.top,
                left: ember.left,
                width: ember.size,
                height: ember.size,
                backgroundColor: totemTheme.emberColor,
                boxShadow: `0 0 8px ${totemTheme.emberShadow}`,
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

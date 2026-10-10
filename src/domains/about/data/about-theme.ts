"use client";

import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

export interface AboutThemeTokens {
  theme: CanonicalTheme;
  // Accent colors
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  accentBright: string;

  // Base background atmosphere tint
  bgGradient: string;
  radialCenterScrim: string;
  radialColumnScrim: string;

  // Selection
  selectionClass: string;

  // Hero Headline & Conclave 'TechSrijan '27'
  headlineGradient: string;
  headlineDropShadow: string;
  subheadColor: string; // Thematic chancery italic subhead color

  // Buttons
  primaryBtnClass: string;
  primaryBtnBorder: string;
  primaryBtnShadow: string;
  secondaryBtnClass: string;

  // Metrics Counters
  metricGradient: string;

  // Societies / Houses
  activeHouseTabBg: string;
  activeHouseTabBorder: string;
  activeHouseTabShadow: string;

  // Timeline / Milestones
  timelineYearGradient: string;

  // Canvas Bloom
  particlePrimary: string;
  particleSecondary: string;
}

export const ABOUT_THEMES: Record<CanonicalTheme, AboutThemeTokens> = {
  "geass-moon": {
    theme: "geass-moon",
    accent: "#FF1E27",
    accentSecondary: "#9E0B0F",
    accentGlow: "rgba(255, 30, 39, 0.55)",
    accentBright: "#FFD6D8",

    bgGradient: "bg-gradient-to-b from-[#0e0407]/75 via-[#090305]/58 to-[#070305]/92",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(14,4,7,0.72)_0%,rgba(9,3,5,0.52)_55%,rgba(7,3,5,0.90)_100%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_75%_75%_at_50%_45%,rgba(14,4,7,0.44)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#FF1E27]/30 selection:text-white",

    headlineGradient: "linear-gradient(to right, #FAF6EE 0%, #FF2E36 45%, #9E0B0F 100%)",
    headlineDropShadow: "drop-shadow(0 2px 20px rgba(255, 30, 39, 0.45))",
    subheadColor: "#FFCCD0",

    primaryBtnClass:
      "bg-gradient-to-r from-[#B50E15] via-[#85080E] to-[#6E050A] text-white",
    primaryBtnBorder: "border-[#FF1E27]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(181,14,21,0.55)]",
    secondaryBtnClass:
      "bg-[#12070A]/85 hover:bg-[#1C0A0F] border border-white/20 hover:border-red-500/40 text-neutral-200 hover:text-white",

    metricGradient: "linear-gradient(135deg, #FAF6EE 0%, #FF1E27 60%, #9E0B0F 100%)",

    activeHouseTabBg: "bg-[#9E0B0F] text-white",
    activeHouseTabBorder: "border-[#FF1E27]",
    activeHouseTabShadow: "shadow-[0_0_20px_rgba(255,30,39,0.5)]",

    timelineYearGradient: "linear-gradient(to right, #FAF6EE, #FF1E27, #85080E)",

    particlePrimary: "255, 30, 39",
    particleSecondary: "220, 38, 38",
  },

  "arrakis-day": {
    theme: "arrakis-day",
    accent: "#D4A843",
    accentSecondary: "#8C5D0D",
    accentGlow: "rgba(212, 168, 67, 0.50)",
    accentBright: "#FFF5D6",

    bgGradient: "bg-gradient-to-b from-[#100b04]/75 via-[#0c0803]/58 to-[#070503]/92",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(16,11,4,0.72)_0%,rgba(12,8,3,0.52)_55%,rgba(7,5,3,0.90)_100%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_75%_75%_at_50%_45%,rgba(16,11,4,0.44)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#D4A843]/30 selection:text-white",

    headlineGradient: "linear-gradient(to right, #FAF6EE 0%, #D4A843 45%, #78350F 100%)",
    headlineDropShadow: "drop-shadow(0 2px 20px rgba(212, 168, 67, 0.45))",
    subheadColor: "#FFF5D6",

    primaryBtnClass:
      "bg-gradient-to-r from-[#8C5D0D] via-[#D4A843] to-[#78350F] text-white font-bold",
    primaryBtnBorder: "border-[#D4A843]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(212,168,67,0.55)]",
    secondaryBtnClass:
      "bg-[#140e06]/85 hover:bg-[#201509] border border-white/20 hover:border-amber-500/40 text-neutral-200 hover:text-white",

    metricGradient: "linear-gradient(135deg, #FAF6EE 0%, #D4A843 60%, #78350F 100%)",

    activeHouseTabBg: "bg-[#B45309] text-white",
    activeHouseTabBorder: "border-[#D4A843]",
    activeHouseTabShadow: "shadow-[0_0_20px_rgba(212,168,67,0.5)]",

    timelineYearGradient: "linear-gradient(to right, #FAF6EE, #D4A843, #78350F)",

    particlePrimary: "212, 168, 67",
    particleSecondary: "245, 158, 11",
  },

  "krelln-night": {
    theme: "krelln-night",
    accent: "#CBD5E1",
    accentSecondary: "#64748B",
    accentGlow: "rgba(203, 213, 225, 0.45)",
    accentBright: "#FFFFFF",

    bgGradient: "bg-gradient-to-b from-[#111317]/80 via-[#0d0f12]/65 to-[#08090b]/94",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(26,29,36,0.70)_0%,rgba(15,17,21,0.55)_55%,rgba(8,9,11,0.92)_100%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_75%_75%_at_50%_45%,rgba(30,35,42,0.45)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#CBD5E1]/30 selection:text-white",

    headlineGradient: "linear-gradient(to right, #FFFFFF 0%, #CBD5E1 45%, #64748B 100%)",
    headlineDropShadow: "drop-shadow(0 2px 20px rgba(203, 213, 225, 0.40))",
    subheadColor: "#E2E8F0",

    primaryBtnClass:
      "bg-gradient-to-r from-[#475569] via-[#334155] to-[#1E293B] text-white font-bold",
    primaryBtnBorder: "border-[#CBD5E1]/60",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(203,213,225,0.35)]",
    secondaryBtnClass:
      "bg-[#131519]/85 hover:bg-[#1e2229] border border-white/20 hover:border-neutral-400/50 text-neutral-200 hover:text-white",

    metricGradient: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 60%, #64748B 100%)",

    activeHouseTabBg: "bg-[#475569] text-white",
    activeHouseTabBorder: "border-[#CBD5E1]",
    activeHouseTabShadow: "shadow-[0_0_20px_rgba(203,213,225,0.45)]",

    timelineYearGradient: "linear-gradient(to right, #FFFFFF, #CBD5E1, #64748B)",

    particlePrimary: "203, 213, 225",
    particleSecondary: "148, 163, 184",
  },
};

export function useAboutTheme(): AboutThemeTokens {
  const { resolvedTheme } = useTheme();
  const canonical = normalizeTheme(resolvedTheme);
  return ABOUT_THEMES[canonical] || ABOUT_THEMES["geass-moon"];
}

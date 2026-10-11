"use client";

import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

export interface ContactThemeTokens {
  theme: CanonicalTheme;
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  accentBright: string;
  accentMuted: string;
  border: string;
  borderHover: string;

  // Background atmosphere and scrims for background art
  bgGradient: string;
  radialCenterScrim: string;
  radialColumnScrim: string;

  // Selection
  selectionClass: string;

  // Headlines
  headlineGradient: string;
  headlineDropShadow: string;
  subheadColor: string;

  // Buttons & Controls
  primaryBtnClass: string;
  primaryBtnBorder: string;
  primaryBtnShadow: string;
  secondaryBtnClass: string;

  // Card accents
  cardBg: string;
  cardBorder: string;
  cardGlow: string;

  // Embers & atmospheric particles
  particlePrimary: string;
  particleSecondary: string;
}

export const CONTACT_THEMES: Record<CanonicalTheme, ContactThemeTokens> = {
  "geass-moon": {
    theme: "geass-moon",
    accent: "#FF1E27",
    accentSecondary: "#9E0B0F",
    accentGlow: "rgba(255, 30, 39, 0.52)",
    accentBright: "#FFD6D8",
    accentMuted: "rgba(255, 30, 39, 0.16)",
    border: "rgba(255, 30, 39, 0.38)",
    borderHover: "#FF1E27",

    bgGradient: "bg-gradient-to-b from-[#0e0407]/45 via-transparent to-[#070305]/65",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(14,4,7,0.35)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(14,4,7,0.25)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#FF1E27]/30 selection:text-white",

    headlineGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #FFCCD0 45%, #FF1E27 100%)",
    headlineDropShadow: "drop-shadow(0 4px 35px rgba(255, 30, 39, 0.50))",
    subheadColor: "#FFCCD0",

    primaryBtnClass:
      "bg-gradient-to-r from-[#B50E15] via-[#85080E] to-[#6E050A] text-white",
    primaryBtnBorder: "border-[#FF1E27]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(181,14,21,0.55)]",
    secondaryBtnClass:
      "bg-black/75 hover:bg-black/90 border border-white/15 hover:border-red-500/40 text-neutral-200 hover:text-white",

    cardBg: "bg-black/70 backdrop-blur-2xl",
    cardBorder: "border-red-500/25",
    cardGlow: "shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(255,30,39,0.18)]",

    particlePrimary: "255, 30, 39",
    particleSecondary: "220, 38, 38",
  },

  "arrakis-day": {
    theme: "arrakis-day",
    accent: "#D4A843",
    accentSecondary: "#8C5D0D",
    accentGlow: "rgba(212, 168, 67, 0.48)",
    accentBright: "#FFF5D6",
    accentMuted: "rgba(212, 168, 67, 0.16)",
    border: "rgba(212, 168, 67, 0.36)",
    borderHover: "#D4A843",

    bgGradient: "bg-gradient-to-b from-[#100b04]/45 via-transparent to-[#070503]/65",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(16,11,4,0.35)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(16,11,4,0.25)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#D4A843]/30 selection:text-white",

    headlineGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #FFF5D6 45%, #D4A843 100%)",
    headlineDropShadow: "drop-shadow(0 4px 35px rgba(212, 168, 67, 0.45))",
    subheadColor: "#FFF5D6",

    primaryBtnClass:
      "bg-gradient-to-r from-[#8C5D0D] via-[#D4A843] to-[#78350F] text-white font-bold",
    primaryBtnBorder: "border-[#D4A843]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(212,168,67,0.55)]",
    secondaryBtnClass:
      "bg-black/75 hover:bg-black/90 border border-white/15 hover:border-amber-500/40 text-neutral-200 hover:text-white",

    cardBg: "bg-black/70 backdrop-blur-2xl",
    cardBorder: "border-amber-500/25",
    cardGlow: "shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(212,168,67,0.18)]",

    particlePrimary: "212, 168, 67",
    particleSecondary: "245, 158, 11",
  },

  "krelln-night": {
    theme: "krelln-night",
    accent: "#CBD5E1",
    accentSecondary: "#64748B",
    accentGlow: "rgba(203, 213, 225, 0.38)",
    accentBright: "#FFFFFF",
    accentMuted: "rgba(203, 213, 225, 0.16)",
    border: "rgba(203, 213, 225, 0.32)",
    borderHover: "#CBD5E1",

    bgGradient: "bg-gradient-to-b from-[#090d14]/45 via-transparent to-[#04060a]/65",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(9,13,20,0.35)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(9,13,20,0.25)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#CBD5E1]/30 selection:text-white",

    headlineGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%)",
    headlineDropShadow: "drop-shadow(0 4px 35px rgba(203, 213, 225, 0.35))",
    subheadColor: "#E2E8F0",

    primaryBtnClass:
      "bg-gradient-to-r from-[#334155] via-[#64748B] to-[#1E293B] text-white font-bold",
    primaryBtnBorder: "border-[#CBD5E1]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(203,213,225,0.40)]",
    secondaryBtnClass:
      "bg-black/75 hover:bg-black/90 border border-white/15 hover:border-slate-400/40 text-neutral-200 hover:text-white",

    cardBg: "bg-black/70 backdrop-blur-2xl",
    cardBorder: "border-slate-400/25",
    cardGlow: "shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(203,213,225,0.18)]",

    particlePrimary: "203, 213, 225",
    particleSecondary: "148, 163, 184",
  },
};

export function useContactTheme(): ContactThemeTokens {
  const { resolvedTheme } = useTheme();
  const canonical = normalizeTheme(resolvedTheme);
  return CONTACT_THEMES[canonical] || CONTACT_THEMES["arrakis-day"];
}

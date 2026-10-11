"use client";

import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

export interface GuestsThemeTokens {
  theme: CanonicalTheme;
  // Primary accent (Dr. Kiran Bedi & Hero Dignitary)
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  accentBright: string;
  accentMuted: string;
  border: string;
  borderHover: string;

  // Secondary dignitary accent (Prof. H. C. Verma)
  guest2Accent: string;
  guest2Secondary: string;
  guest2Glow: string;
  guest2Bright: string;
  guest2Border: string;
  guest2HeadingGradient: string;
  guest2SubheadColor: string;

  // Base background & atmosphere for assets/background.png
  bgBase: string;
  bgGradient: string;
  radialCenterScrim: string;
  radialColumnScrim: string;
  selectionClass: string;
  heroSubheadGradient: string;
  subheadColor: string;
  transitionalBg: string;

  // Buttons
  primaryBtnClass: string;
  primaryBtnBorder: string;
  primaryBtnShadow: string;
  secondaryBtnClass: string;
}

export const GUESTS_THEMES: Record<CanonicalTheme, GuestsThemeTokens> = {
  "geass-moon": {
    theme: "geass-moon",
    accent: "#FF1E27",
    accentSecondary: "#9E0B0F",
    accentGlow: "rgba(255, 30, 39, 0.50)",
    accentBright: "#FFD6D8",
    accentMuted: "rgba(255, 30, 39, 0.15)",
    border: "rgba(255, 30, 39, 0.38)",
    borderHover: "#FF1E27",

    guest2Accent: "#FF4D55",
    guest2Secondary: "#B91C1C",
    guest2Glow: "rgba(255, 77, 85, 0.40)",
    guest2Bright: "#FFE4E6",
    guest2Border: "rgba(255, 77, 85, 0.40)",
    guest2HeadingGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #FFB4B8 45%, #FF4D55 100%)",
    guest2SubheadColor: "#FFCCD0",

    bgBase: "bg-black/30",
    bgGradient:
      "bg-gradient-to-b from-[#0e0407]/40 via-transparent to-[#070305]/60",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(14,4,7,0.30)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(14,4,7,0.20)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#FF1E27]/30 selection:text-white",
    heroSubheadGradient:
      "linear-gradient(to right, #FFD6D8 0%, #FF1E27 50%, #FF8A8F 100%)",
    subheadColor: "#FFCCD0",
    transitionalBg:
      "bg-gradient-to-r from-black/70 via-[#1A050A]/70 to-black/70",

    primaryBtnClass:
      "bg-gradient-to-r from-[#B50E15] via-[#85080E] to-[#6E050A] text-white",
    primaryBtnBorder: "border-[#FF1E27]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(181,14,21,0.55)]",
    secondaryBtnClass:
      "bg-black/70 hover:bg-black/85 border border-white/20 hover:border-red-500/40 text-neutral-200 hover:text-white",
  },

  "arrakis-day": {
    theme: "arrakis-day",
    accent: "#D4A843",
    accentSecondary: "#8C5D0D",
    accentGlow: "rgba(212, 168, 67, 0.45)",
    accentBright: "#FFF5D6",
    accentMuted: "rgba(212, 168, 67, 0.15)",
    border: "rgba(212, 168, 67, 0.35)",
    borderHover: "#D4A843",

    guest2Accent: "#F59E0B",
    guest2Secondary: "#B45309",
    guest2Glow: "rgba(245, 158, 11, 0.38)",
    guest2Bright: "#FEF3C7",
    guest2Border: "rgba(245, 158, 11, 0.38)",
    guest2HeadingGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #FDE68A 45%, #F59E0B 100%)",
    guest2SubheadColor: "#FFF5D6",

    bgBase: "bg-black/30",
    bgGradient:
      "bg-gradient-to-b from-[#100b04]/40 via-transparent to-[#070503]/60",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(16,11,4,0.30)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(16,11,4,0.20)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#D4A843]/30 selection:text-white",
    heroSubheadGradient:
      "linear-gradient(to right, #FFF5D6 0%, #D4A843 50%, #F59E0B 100%)",
    subheadColor: "#FFF5D6",
    transitionalBg:
      "bg-gradient-to-r from-black/70 via-[#1B1204]/70 to-black/70",

    primaryBtnClass:
      "bg-gradient-to-r from-[#8C5D0D] via-[#D4A843] to-[#78350F] text-white font-bold",
    primaryBtnBorder: "border-[#D4A843]/70",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(212,168,67,0.55)]",
    secondaryBtnClass:
      "bg-black/70 hover:bg-black/85 border border-white/20 hover:border-amber-500/40 text-neutral-200 hover:text-white",
  },

  "krelln-night": {
    theme: "krelln-night",
    accent: "#CBD5E1",
    accentSecondary: "#64748B",
    accentGlow: "rgba(203, 213, 225, 0.35)",
    accentBright: "#FFFFFF",
    accentMuted: "rgba(203, 213, 225, 0.15)",
    border: "rgba(203, 213, 225, 0.30)",
    borderHover: "#CBD5E1",

    guest2Accent: "#94A3B8",
    guest2Secondary: "#475569",
    guest2Glow: "rgba(148, 163, 184, 0.32)",
    guest2Bright: "#F8FAFC",
    guest2Border: "rgba(148, 163, 184, 0.35)",
    guest2HeadingGradient:
      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%)",
    guest2SubheadColor: "#E2E8F0",

    bgBase: "bg-black/30",
    bgGradient:
      "bg-gradient-to-b from-[#111317]/40 via-transparent to-[#08090b]/60",
    radialCenterScrim:
      "bg-[radial-gradient(ellipse_at_center,rgba(26,29,36,0.30)_0%,transparent_75%)]",
    radialColumnScrim:
      "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(30,35,42,0.20)_0%,transparent_100%)]",

    selectionClass: "selection:bg-[#CBD5E1]/30 selection:text-white",
    heroSubheadGradient:
      "linear-gradient(to right, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)",
    subheadColor: "#E2E8F0",
    transitionalBg:
      "bg-gradient-to-r from-black/70 via-[#15181F]/70 to-black/70",

    primaryBtnClass:
      "bg-gradient-to-r from-[#475569] via-[#334155] to-[#1E293B] text-white font-bold",
    primaryBtnBorder: "border-[#CBD5E1]/60",
    primaryBtnShadow: "shadow-[0_0_25px_rgba(203,213,225,0.30)]",
    secondaryBtnClass:
      "bg-black/70 hover:bg-black/85 border border-white/20 hover:border-slate-400/40 text-neutral-200 hover:text-white",
  },
};

export function useGuestsTheme(): GuestsThemeTokens {
  const { resolvedTheme } = useTheme();
  const canonical = normalizeTheme(resolvedTheme);
  return GUESTS_THEMES[canonical] || GUESTS_THEMES["geass-moon"];
}

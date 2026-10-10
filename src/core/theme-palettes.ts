"use client";

import { useTheme, type CanonicalTheme, normalizeTheme } from "./providers/theme-provider";

export interface PageThemeConfig {
  id: CanonicalTheme;
  name: string;
  accent: string;
  accentBright: string;
  accentGlow: string;
  accentMuted: string;
  border: string;
  borderHover: string;
  headingFrom: string;
  headingVia: string;
  headingTo: string;
  headingGradient: string;
  italicGradient: string;
  btnGradient: string;
  btnText: string;
  btnShadow: string;
  cardBg: string;
  particlePrimary: string;
  particleSecondary: string;
  selectionBg: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const PAGE_THEMES: Record<CanonicalTheme, PageThemeConfig> = {
  "arrakis-day": {
    id: "arrakis-day",
    name: "Arrakis Day",
    accent: "#D4A843",
    accentBright: "#FFF5D6",
    accentGlow: "rgba(212, 168, 67, 0.45)",
    accentMuted: "rgba(212, 168, 67, 0.15)",
    border: "rgba(212, 168, 67, 0.35)",
    borderHover: "#D4A843",
    headingFrom: "#FFFFFF",
    headingVia: "#FFF5D6",
    headingTo: "#D4A843",
    headingGradient: "from-white via-[#FFF5D6] to-[#D4A843]",
    italicGradient: "from-[#FFF5D6] via-[#E8D4FF] to-[#D4A843]",
    btnGradient: "from-[#D4A843] via-[#E2B755] to-[#C59B27]",
    btnText: "text-black",
    btnShadow: "shadow-[0_0_30px_rgba(212,168,67,0.4)]",
    cardBg: "from-[#D4A843]/15 via-black/80 to-black/90",
    particlePrimary: "212, 168, 67",
    particleSecondary: "245, 158, 11",
    selectionBg: "#D4A843",
    badgeBg: "rgba(212, 168, 67, 0.12)",
    badgeBorder: "rgba(212, 168, 67, 0.3)",
    badgeText: "text-[#D4A843]",
  },
  "geass-moon": {
    id: "geass-moon",
    name: "Geass Moon",
    accent: "#FF1E27",
    accentBright: "#FFD6D8",
    accentGlow: "rgba(255, 30, 39, 0.52)",
    accentMuted: "rgba(255, 30, 39, 0.15)",
    border: "rgba(255, 30, 39, 0.38)",
    borderHover: "#FF1E27",
    headingFrom: "#FFFFFF",
    headingVia: "#FFCCD0",
    headingTo: "#FF1E27",
    headingGradient: "from-white via-[#FFCCD0] to-[#FF1E27]",
    italicGradient: "from-[#FFD6D8] via-[#FF8A8F] to-[#FF1E27]",
    btnGradient: "from-[#FF1E27] via-[#E61924] to-[#C4000A]",
    btnText: "text-white",
    btnShadow: "shadow-[0_0_30px_rgba(255,30,39,0.5)]",
    cardBg: "from-[#FF1E27]/15 via-black/80 to-black/90",
    particlePrimary: "255, 30, 39",
    particleSecondary: "220, 38, 38",
    selectionBg: "#FF1E27",
    badgeBg: "rgba(255, 30, 39, 0.12)",
    badgeBorder: "rgba(255, 30, 39, 0.35)",
    badgeText: "text-[#FF1E27]",
  },
  "krelln-night": {
    id: "krelln-night",
    name: "Krelln Night",
    accent: "#79C7E3",
    accentBright: "#E0F7FF",
    accentGlow: "rgba(121, 199, 227, 0.45)",
    accentMuted: "rgba(121, 199, 227, 0.15)",
    border: "rgba(121, 199, 227, 0.35)",
    borderHover: "#79C7E3",
    headingFrom: "#FFFFFF",
    headingVia: "#E0F7FF",
    headingTo: "#79C7E3",
    headingGradient: "from-white via-[#E0F7FF] to-[#79C7E3]",
    italicGradient: "from-[#E0F7FF] via-[#E8D4FF] to-[#79C7E3]",
    btnGradient: "from-[#79C7E3] via-[#9DE2FB] to-[#5BAECD]",
    btnText: "text-black",
    btnShadow: "shadow-[0_0_30px_rgba(121,199,227,0.4)]",
    cardBg: "from-[#79C7E3]/15 via-black/80 to-black/90",
    particlePrimary: "121, 199, 227",
    particleSecondary: "203, 213, 225",
    selectionBg: "#79C7E3",
    badgeBg: "rgba(121, 199, 227, 0.12)",
    badgeBorder: "rgba(121, 199, 227, 0.3)",
    badgeText: "text-[#79C7E3]",
  },
};

export function usePageTheme(): PageThemeConfig {
  const { resolvedTheme } = useTheme();
  const canonical = normalizeTheme(resolvedTheme);
  return PAGE_THEMES[canonical] || PAGE_THEMES["arrakis-day"];
}

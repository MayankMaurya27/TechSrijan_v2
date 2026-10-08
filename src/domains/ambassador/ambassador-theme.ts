"use client";

import { useTheme, type CanonicalTheme } from "@/core";

export interface AmbassadorThemeTokens {
  theme: CanonicalTheme;
  // Core text / accents
  accent: string;
  accentSecondary: string;
  accentTextClass: string;
  accentGlow: string;
  subtextColor: string;

  // Hero Titles & Gradients
  heroTitleGradient: string;
  heroTopDash: string;
  heroDotShadow: string;

  // Hero Moon & Atmosphere
  moonFilter: string;
  moonHoverFilter: string;
  moonCoronaShadow: string;
  moonHoverCoronaShadow: string;
  moonAtmosphereClass: string;
  characterDropShadow: string;
  embers: {
    primaryBg: string;
    secondaryBg: string;
    primaryShadow: string;
    secondaryShadow: string;
  };

  // HUD Glass Card
  hudCardBorder: string;
  hudCardHoverBorder: string;
  hudCardHoverShadow: string;
  hudCornerSvgStroke: string;
  hudCornerFill: string;
  hudInnerGradient: string;

  // Primary & Secondary Buttons
  primaryBtnBg: string;
  primaryBtnHoverBg: string;
  primaryBtnBorder: string;
  primaryBtnShadow: string;
  primaryBtnHoverShadow: string;
  secondaryBtnBorder: string;
  secondaryBtnHoverBorder: string;

  // Perks Section
  perksHeaderAccent: string;
  perksHeaderGradient: string;
  perksAtmosphereClass: string;
  perksDotMatrixColor: string;
  perksCardActiveBg: string;
  perksCardActiveBorder: string;
  perksCardActiveShadow: string;
  perksCardHoverBorder: string;
  perksBracketActive: string;
  perksBracketDefault: string;
  perksNumberClass: string;
  perksIconActiveColor: string;
  perksIconDefaultColor: string;
  perksInsignia: {
    wingTopLeft0: string;
    wingTopLeft50: string;
    wingTopLeft100: string;
    wingFacetDark0: string;
    wingFacetDark100: string;
    ridgeColor: string;
    beaconColor: string;
    beaconShadow: string;
    reticleColor: string;
    labelColor: string;
    bracketColor: string;
  };

  // Journey Section
  journeyHeaderGradient: string;
  journeyLaserGradient: string;
  journeyLaserShadow: string;
  journeyLeadingSparkColor: string;
  journeyLeadingSparkShadow: string;
  journeyNodeBloom: string;
  journeyNodeGlowGradient: string;
  journeyNodeReticleBorder: string;
  journeyNodeBorder: string;
  journeyNodeBg: string;
  journeyNodeShadow: string;
  journeyCrosshairs: string;
  journeyCardBorder: string;
  journeyCardHoverBorder: string;
  journeyCardHoverShadow: string;
  journeyCardCornerBracket: string;
  journeyIconBoxBg: string;
  journeyIconBoxBorder: string;
  journeyIconColor: string;

  // Colleges Section
  collegesHeaderGradient: string;
  collegesAtmosphereClass: string;
  collegesStatGradient: string;
  collegesCardBorder: string;
  collegesCardHoverBorder: string;
  collegesCardHoverShadow: string;
  collegesPinColor: string;
  collegesTierHost: string;
  collegesTierPrimary: string;
  collegesTierSecondary: string;
  collegesExpandBtn: string;

  // Leaderboard Section
  leaderboardHeaderGradient: string;
  leaderboardAtmosphereClass: string;
  leaderboardTableBorder: string;
  leaderboardHeaderBg: string;
  leaderboardPointsColor: string;
  rank1Badge: string;
  rank2Badge: string;
  rank3Badge: string;

  // Apply Section & Razor Cuts
  applyHeaderGradient: string;
  applyAtmosphereClass: string;
  applyRazorLinePrimary: string;
  applyRazorLineSecondary: string;
  applyArmorStroke: string;
  applyCrestCenter0: string;
  applyCrestCenter100: string;
  applyCrestWing0: string;
  applyCrestWing100: string;
  applyCrestFlank0: string;
  applyCrestFlank100: string;
  applyCrestHighlight: string;
  applyTimelineSpine: string;
  applyStepActiveNode: string;
  applyStepActiveNumber: string;

  // Modal Dialog
  modalArmorLineStroke: string;
  modalArmorFillStroke: string;
  modalProgressBarBg: string;
  modalInputFocusBorder: string;
  modalInputFocusShadow: string;
  modalCheckboxCheckedBg: string;
  modalCheckboxCheckedBorder: string;
}

export const AMBASSADOR_THEMES: Record<CanonicalTheme, AmbassadorThemeTokens> = {
  "geass-moon": {
    theme: "geass-moon",
    accent: "#FF2A36",
    accentSecondary: "#FF1E27",
    accentTextClass: "text-[#FF2A36]",
    accentGlow: "rgba(255, 42, 54, 0.65)",
    subtextColor: "#D4A373",

    // Hero
    heroTitleGradient: "from-[#FF3B20] via-[#FF8533] to-[#FFA726]",
    heroTopDash: "#E5983A",
    heroDotShadow: "shadow-[0_0_12px_#FF2A36]",
    moonFilter: "brightness(1.0)",
    moonHoverFilter: "drop-shadow(0 0 35px rgba(255,40,20,0.85)) brightness(1.08)",
    moonCoronaShadow:
      "0 0 40px 10px rgba(239, 68, 68, 0.45), 0 0 85px 25px rgba(220, 38, 38, 0.22)",
    moonHoverCoronaShadow:
      "0 0 55px 15px rgba(255, 50, 30, 0.65), 0 0 110px 35px rgba(220, 38, 38, 0.35)",
    moonAtmosphereClass: "bg-red-600/25",
    characterDropShadow:
      "drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)] drop-shadow-[0_0_24px_rgba(220,38,38,0.35)]",
    embers: {
      primaryBg: "rgba(239, 68, 68, 0.75)",
      secondaryBg: "rgba(245, 158, 11, 0.75)",
      primaryShadow: "0 0 8px rgba(239, 68, 68, 0.85)",
      secondaryShadow: "0 0 8px rgba(245, 158, 11, 0.85)",
    },

    // HUD Card
    hudCardBorder: "border-[rgba(212,168,67,0.26)]",
    hudCardHoverBorder: "hover:border-[rgba(255,42,54,0.55)]",
    hudCardHoverShadow: "hover:shadow-[0_20px_60px_rgba(220,38,38,0.3)]",
    hudCornerSvgStroke: "#FF2A36",
    hudCornerFill: "rgba(255, 42, 54, 0.4)",
    hudInnerGradient: "from-red-950/20 via-transparent to-amber-950/15",

    // Buttons
    primaryBtnBg: "bg-gradient-to-r from-[#8B0000] via-[#B91C1C] to-[#8B0000]",
    primaryBtnHoverBg: "hover:from-[#991B1B] hover:to-[#DC2626]",
    primaryBtnBorder: "border-red-500/40",
    primaryBtnShadow: "shadow-[0_0_20px_rgba(185,28,28,0.45)]",
    primaryBtnHoverShadow: "hover:shadow-[0_0_32px_rgba(239,68,68,0.65)]",
    secondaryBtnBorder: "border-[rgba(212,168,67,0.32)]",
    secondaryBtnHoverBorder: "hover:border-red-500/50",

    // Perks
    perksHeaderAccent: "text-[#FF2A36]",
    perksHeaderGradient: "from-[#FF2A36] to-[#DC2626]",
    perksAtmosphereClass: "bg-red-600/10",
    perksDotMatrixColor: "rgba(239,68,68,0.8)",
    perksCardActiveBg:
      "bg-gradient-to-r from-red-950/40 via-[#0e0909]/90 to-[#0c0808]",
    perksCardActiveBorder: "border-[#FF2A36]",
    perksCardActiveShadow: "shadow-[0_0_24px_rgba(255,42,54,0.32)]",
    perksCardHoverBorder: "hover:border-red-500/60",
    perksBracketActive: "border-[#FF2A36]",
    perksBracketDefault: "border-red-500/50 group-hover:border-[#FF2A36]",
    perksNumberClass: "text-[#FF2A36] drop-shadow-[0_0_12px_rgba(255,42,54,0.45)]",
    perksIconActiveColor: "text-[#FF2A36]",
    perksIconDefaultColor: "text-[#FF2A36]/80 group-hover:text-[#FF2A36]",
    perksInsignia: {
      wingTopLeft0: "#8A0B12",
      wingTopLeft50: "#C4131C",
      wingTopLeft100: "#FF1E27",
      wingFacetDark0: "#4A050A",
      wingFacetDark100: "#7A0A10",
      ridgeColor: "#FF2A36",
      beaconColor: "#FF1E27",
      beaconShadow: "shadow-[0_0_10px_#FF2A36]",
      reticleColor: "rgba(255, 30, 39, 0.4)",
      labelColor: "#D4A373",
      bracketColor: "#FF2A36",
    },

    // Journey
    journeyHeaderGradient: "text-[#FF2A36]",
    journeyLaserGradient: "from-[#800000] via-[#DC2626] to-[#FF1E27]",
    journeyLaserShadow:
      "shadow-[0_0_14px_#FF1E27,0_0_28px_rgba(255,30,39,0.9),0_0_45px_rgba(220,38,38,0.7)]",
    journeyLeadingSparkColor: "#FFFFFF",
    journeyLeadingSparkShadow:
      "shadow-[0_0_12px_#FFFFFF,0_0_24px_#FF1E27,0_0_48px_#FF1E27]",
    journeyNodeBloom: "bg-[#FF1E27]/40",
    journeyNodeGlowGradient: "from-[#FF1E27] via-[#DC2626] to-[#7F0909]",
    journeyNodeReticleBorder: "border-red-500/50",
    journeyNodeBorder: "border-[#FF1E27]",
    journeyNodeBg: "from-[#1E0407] via-[#0E0102] to-black",
    journeyNodeShadow:
      "shadow-[0_0_20px_rgba(255,30,39,0.95),inset_0_0_12px_rgba(220,38,38,0.7)]",
    journeyCrosshairs: "bg-red-400 shadow-[0_0_6px_#FF1E27]",
    journeyCardBorder: "border-red-500/25",
    journeyCardHoverBorder: "hover:border-red-500/60",
    journeyCardHoverShadow: "hover:shadow-[0_0_28px_rgba(220,38,38,0.25)]",
    journeyCardCornerBracket: "border-red-500/60",
    journeyIconBoxBg: "bg-red-950/50",
    journeyIconBoxBorder: "border-red-500/25 group-hover:border-red-500/60",
    journeyIconColor: "text-red-400/90 group-hover:text-white",

    // Colleges
    collegesHeaderGradient: "text-[#FF2A36]",
    collegesAtmosphereClass: "bg-red-950/15",
    collegesStatGradient: "from-[#FF2A36] to-[#DC2626]",
    collegesCardBorder: "border-red-500/20",
    collegesCardHoverBorder: "hover:border-red-500/60",
    collegesCardHoverShadow: "hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]",
    collegesPinColor: "text-red-500",
    collegesTierHost:
      "text-red-400 border-red-500/50 bg-red-950/40 shadow-[0_0_12px_rgba(255,30,39,0.3)]",
    collegesTierPrimary: "text-red-400/90 border-red-500/30 bg-red-950/25",
    collegesTierSecondary: "text-red-300/80 border-red-500/20 bg-red-950/15",
    collegesExpandBtn:
      "border-red-500/40 bg-red-950/30 hover:bg-red-900/40 hover:border-red-500/70 shadow-[0_0_15px_rgba(220,38,38,0.2)]",

    // Leaderboard
    leaderboardHeaderGradient: "text-[#FF2A36]",
    leaderboardAtmosphereClass: "bg-red-950/15",
    leaderboardTableBorder: "border-red-500/25",
    leaderboardHeaderBg: "bg-red-950/20 border-red-500/20",
    leaderboardPointsColor: "text-red-400",
    rank1Badge:
      "bg-gradient-to-r from-[#FF1E27] to-[#DC2626] text-white shadow-[0_0_12px_rgba(255,30,39,0.7)] border border-red-400",
    rank2Badge:
      "bg-gradient-to-r from-[#C4131C] to-[#8A0B12] text-white border border-red-500/60",
    rank3Badge:
      "bg-gradient-to-r from-[#8A0B12] to-[#5A070B] text-neutral-200 border border-red-500/40",

    // Apply
    applyHeaderGradient: "text-[#FF2A36]",
    applyAtmosphereClass: "bg-red-950/20",
    applyRazorLinePrimary: "#FF1E27",
    applyRazorLineSecondary: "#991B1B",
    applyArmorStroke: "#DC2626",
    applyCrestCenter0: "#FF1E27",
    applyCrestCenter100: "#7F0909",
    applyCrestWing0: "#DC2626",
    applyCrestWing100: "#450A0A",
    applyCrestFlank0: "#991B1B",
    applyCrestFlank100: "#1A0204",
    applyCrestHighlight: "#FFA3A8",
    applyTimelineSpine: "bg-red-600/80 shadow-[0_0_10px_#FF1E27]",
    applyStepActiveNode: "border-red-500 shadow-[0_0_16px_#FF1E27]",
    applyStepActiveNumber:
      "text-[#FF2A36] drop-shadow-[0_0_15px_rgba(255,42,54,0.6)]",

    // Modal
    modalArmorLineStroke: "#FF2A36",
    modalArmorFillStroke: "#DC2626",
    modalProgressBarBg: "bg-[#E61924] shadow-[0_0_10px_#FF1E27]",
    modalInputFocusBorder: "focus:border-red-500/80",
    modalInputFocusShadow: "focus:shadow-[0_0_15px_rgba(255,30,39,0.25)]",
    modalCheckboxCheckedBg: "bg-[#E61924] border-[#E61924]",
    modalCheckboxCheckedBorder: "border-[#E61924]",
  },

  "arrakis-day": {
    theme: "arrakis-day",
    accent: "#E5983A",
    accentSecondary: "#F59E0B",
    accentTextClass: "text-[#F59E0B]",
    accentGlow: "rgba(245, 158, 11, 0.65)",
    subtextColor: "#FDE68A",

    // Hero
    heroTitleGradient: "from-[#FF8533] via-[#F59E0B] to-[#FCD34D]",
    heroTopDash: "#E5983A",
    heroDotShadow: "shadow-[0_0_12px_#F59E0B]",
    // Dune Movie Reference: Radiant Dune solar celestial sphere (pure golden-yellowish, zero pink/magenta)
    moonFilter:
      "grayscale(100%) sepia(100%) saturate(380%) hue-rotate(12deg) brightness(1.18) contrast(1.1)",
    moonHoverFilter:
      "grayscale(100%) sepia(100%) saturate(440%) hue-rotate(15deg) brightness(1.28) contrast(1.15) drop-shadow(0 0 42px rgba(245,158,11,0.95))",
    moonCoronaShadow:
      "0 0 45px 14px rgba(245, 158, 11, 0.55), 0 0 95px 30px rgba(217, 119, 6, 0.3)",
    moonHoverCoronaShadow:
      "0 0 65px 20px rgba(251, 191, 36, 0.75), 0 0 125px 42px rgba(245, 158, 11, 0.45)",
    moonAtmosphereClass: "bg-amber-500/22",
    characterDropShadow:
      "drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)] drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]",
    embers: {
      primaryBg: "rgba(245, 158, 11, 0.85)",
      secondaryBg: "rgba(252, 211, 77, 0.85)",
      primaryShadow: "0 0 10px rgba(245, 158, 11, 0.95)",
      secondaryShadow: "0 0 10px rgba(252, 211, 77, 0.95)",
    },

    // HUD Card
    hudCardBorder: "border-[rgba(245,158,11,0.35)]",
    hudCardHoverBorder: "hover:border-[rgba(251,191,36,0.65)]",
    hudCardHoverShadow: "hover:shadow-[0_20px_60px_rgba(217,119,6,0.35)]",
    hudCornerSvgStroke: "#F59E0B",
    hudCornerFill: "rgba(245, 158, 11, 0.4)",
    hudInnerGradient: "from-amber-950/25 via-transparent to-amber-900/15",

    // Buttons
    primaryBtnBg: "bg-gradient-to-r from-[#78350F] via-[#D97706] to-[#78350F]",
    primaryBtnHoverBg: "hover:from-[#92400E] hover:to-[#F59E0B]",
    primaryBtnBorder: "border-amber-500/40",
    primaryBtnShadow: "shadow-[0_0_20px_rgba(217,119,6,0.45)]",
    primaryBtnHoverShadow: "hover:shadow-[0_0_32px_rgba(245,158,11,0.65)]",
    secondaryBtnBorder: "border-[rgba(245,158,11,0.35)]",
    secondaryBtnHoverBorder: "hover:border-amber-500/60",

    // Perks
    perksHeaderAccent: "text-[#F59E0B]",
    perksHeaderGradient: "from-[#F59E0B] to-[#D97706]",
    perksAtmosphereClass: "bg-amber-600/10",
    perksDotMatrixColor: "rgba(245,158,11,0.8)",
    perksCardActiveBg:
      "bg-gradient-to-r from-amber-950/40 via-[#120d09]/90 to-[#0c0906]",
    perksCardActiveBorder: "border-[#F59E0B]",
    perksCardActiveShadow: "shadow-[0_0_24px_rgba(245,158,11,0.35)]",
    perksCardHoverBorder: "hover:border-amber-500/60",
    perksBracketActive: "border-[#F59E0B]",
    perksBracketDefault: "border-amber-500/50 group-hover:border-[#F59E0B]",
    perksNumberClass: "text-[#F59E0B] drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    perksIconActiveColor: "text-[#F59E0B]",
    perksIconDefaultColor: "text-[#F59E0B]/80 group-hover:text-[#F59E0B]",
    perksInsignia: {
      wingTopLeft0: "#78350F",
      wingTopLeft50: "#B45309",
      wingTopLeft100: "#F59E0B",
      wingFacetDark0: "#451A03",
      wingFacetDark100: "#78350F",
      ridgeColor: "#F59E0B",
      beaconColor: "#F59E0B",
      beaconShadow: "shadow-[0_0_12px_#F59E0B]",
      reticleColor: "rgba(245, 158, 11, 0.4)",
      labelColor: "#FCD34D",
      bracketColor: "#F59E0B",
    },

    // Journey
    journeyHeaderGradient: "text-[#F59E0B]",
    journeyLaserGradient: "from-[#78350F] via-[#D97706] to-[#F59E0B]",
    journeyLaserShadow:
      "shadow-[0_0_14px_#F59E0B,0_0_28px_rgba(245,158,11,0.9),0_0_45px_rgba(217,119,6,0.7)]",
    journeyLeadingSparkColor: "#FFFBEB",
    journeyLeadingSparkShadow:
      "shadow-[0_0_12px_#FFFBEB,0_0_24px_#F59E0B,0_0_48px_#F59E0B]",
    journeyNodeBloom: "bg-[#F59E0B]/40",
    journeyNodeGlowGradient: "from-[#F59E0B] via-[#D97706] to-[#78350F]",
    journeyNodeReticleBorder: "border-amber-500/50",
    journeyNodeBorder: "border-[#F59E0B]",
    journeyNodeBg: "from-[#241705] via-[#120B02] to-black",
    journeyNodeShadow:
      "shadow-[0_0_20px_rgba(245,158,11,0.95),inset_0_0_12px_rgba(217,119,6,0.7)]",
    journeyCrosshairs: "bg-amber-400 shadow-[0_0_6px_#F59E0B]",
    journeyCardBorder: "border-amber-500/25",
    journeyCardHoverBorder: "hover:border-amber-500/60",
    journeyCardHoverShadow: "hover:shadow-[0_0_28px_rgba(245,158,11,0.25)]",
    journeyCardCornerBracket: "border-amber-500/60",
    journeyIconBoxBg: "bg-amber-950/50",
    journeyIconBoxBorder: "border-amber-500/25 group-hover:border-amber-500/60",
    journeyIconColor: "text-amber-400/90 group-hover:text-white",

    // Colleges
    collegesHeaderGradient: "text-[#F59E0B]",
    collegesAtmosphereClass: "bg-amber-950/15",
    collegesStatGradient: "from-[#F59E0B] to-[#D97706]",
    collegesCardBorder: "border-amber-500/20",
    collegesCardHoverBorder: "hover:border-amber-500/60",
    collegesCardHoverShadow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]",
    collegesPinColor: "text-amber-500",
    collegesTierHost:
      "text-amber-400 border-amber-500/50 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    collegesTierPrimary: "text-amber-400/90 border-amber-500/30 bg-amber-950/25",
    collegesTierSecondary: "text-amber-300/80 border-amber-500/20 bg-amber-950/15",
    collegesExpandBtn:
      "border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 hover:border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.2)]",

    // Leaderboard
    leaderboardHeaderGradient: "text-[#F59E0B]",
    leaderboardAtmosphereClass: "bg-amber-950/15",
    leaderboardTableBorder: "border-amber-500/25",
    leaderboardHeaderBg: "bg-amber-950/20 border-amber-500/20",
    leaderboardPointsColor: "text-amber-400",
    rank1Badge:
      "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold shadow-[0_0_14px_rgba(245,158,11,0.8)] border border-amber-300",
    rank2Badge:
      "bg-gradient-to-r from-[#B45309] to-[#78350F] text-amber-100 border border-amber-500/60",
    rank3Badge:
      "bg-gradient-to-r from-[#78350F] to-[#451A03] text-amber-200 border border-amber-500/40",

    // Apply
    applyHeaderGradient: "text-[#F59E0B]",
    applyAtmosphereClass: "bg-amber-950/20",
    applyRazorLinePrimary: "#F59E0B",
    applyRazorLineSecondary: "#B45309",
    applyArmorStroke: "#D97706",
    applyCrestCenter0: "#F59E0B",
    applyCrestCenter100: "#78350F",
    applyCrestWing0: "#D97706",
    applyCrestWing100: "#451A03",
    applyCrestFlank0: "#B45309",
    applyCrestFlank100: "#1E0D02",
    applyCrestHighlight: "#FDE68A",
    applyTimelineSpine: "bg-amber-600/80 shadow-[0_0_10px_#F59E0B]",
    applyStepActiveNode: "border-amber-500 shadow-[0_0_16px_#F59E0B]",
    applyStepActiveNumber:
      "text-[#F59E0B] drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]",

    // Modal
    modalArmorLineStroke: "#F59E0B",
    modalArmorFillStroke: "#D97706",
    modalProgressBarBg: "bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]",
    modalInputFocusBorder: "focus:border-amber-500/80",
    modalInputFocusShadow: "focus:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
    modalCheckboxCheckedBg: "bg-[#F59E0B] border-[#F59E0B]",
    modalCheckboxCheckedBorder: "border-[#F59E0B]",
  },

  "krelln-night": {
    theme: "krelln-night",
    // Dune Movie Reference: Moonlit Silver, Bone-White & Slate Graphite (replaces dominating electric blue)
    accent: "#D7DBE2",
    accentSecondary: "#778292",
    accentTextClass: "text-[#D7DBE2]",
    accentGlow: "rgba(215, 219, 226, 0.45)",
    subtextColor: "#94A3B8",

    // Hero
    heroTitleGradient: "from-[#FFFFFF] via-[#D7DBE2] to-[#8C97A7]",
    heroTopDash: "#8C97A7",
    heroDotShadow: "shadow-[0_0_12px_#D7DBE2]",
    // Dune Movie Reference: Stark monochrome, photorealistic greyish silver moon (crater maria & platinum rim)
    moonFilter: "grayscale(100%) brightness(1.08) contrast(1.15)",
    moonHoverFilter:
      "grayscale(100%) brightness(1.22) contrast(1.2) drop-shadow(0 0 38px rgba(215,219,226,0.65))",
    moonCoronaShadow:
      "0 0 40px 10px rgba(215, 219, 226, 0.32), 0 0 85px 25px rgba(119, 130, 146, 0.2)",
    moonHoverCoronaShadow:
      "0 0 55px 15px rgba(245, 247, 250, 0.55), 0 0 110px 35px rgba(215, 219, 226, 0.35)",
    moonAtmosphereClass: "bg-slate-400/12",
    characterDropShadow:
      "drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)] drop-shadow-[0_0_24px_rgba(215,219,226,0.25)]",
    embers: {
      primaryBg: "rgba(215, 219, 226, 0.75)",
      secondaryBg: "rgba(148, 163, 184, 0.75)",
      primaryShadow: "0 0 8px rgba(215, 219, 226, 0.85)",
      secondaryShadow: "0 0 8px rgba(148, 163, 184, 0.85)",
    },

    // HUD Card
    hudCardBorder: "border-[rgba(119,130,146,0.35)]",
    hudCardHoverBorder: "hover:border-[rgba(215,219,226,0.7)]",
    hudCardHoverShadow: "hover:shadow-[0_20px_60px_rgba(119,130,146,0.35)]",
    hudCornerSvgStroke: "#D7DBE2",
    hudCornerFill: "rgba(215, 219, 226, 0.35)",
    hudInnerGradient: "from-slate-900/35 via-transparent to-neutral-900/25",

    // Buttons
    primaryBtnBg: "bg-gradient-to-r from-[#1A1E24] via-[#353E4B] to-[#1A1E24]",
    primaryBtnHoverBg: "hover:from-[#262C36] hover:to-[#465364]",
    primaryBtnBorder: "border-[#8C97A7]/60",
    primaryBtnShadow: "shadow-[0_0_20px_rgba(119,130,146,0.35)]",
    primaryBtnHoverShadow: "hover:shadow-[0_0_32px_rgba(215,219,226,0.55)]",
    secondaryBtnBorder: "border-[rgba(119,130,146,0.45)]",
    secondaryBtnHoverBorder: "hover:border-[rgba(215,219,226,0.75)]",

    // Perks
    perksHeaderAccent: "text-[#D7DBE2]",
    perksHeaderGradient: "from-[#FFFFFF] to-[#8C97A7]",
    perksAtmosphereClass: "bg-slate-600/10",
    perksDotMatrixColor: "rgba(215,219,226,0.6)",
    perksCardActiveBg:
      "bg-gradient-to-r from-slate-900/50 via-[#13161B]/90 to-[#0E1014]",
    perksCardActiveBorder: "border-[#D7DBE2]",
    perksCardActiveShadow: "shadow-[0_0_24px_rgba(215,219,226,0.25)]",
    perksCardHoverBorder: "hover:border-slate-400/60",
    perksBracketActive: "border-[#D7DBE2]",
    perksBracketDefault: "border-slate-500/50 group-hover:border-[#D7DBE2]",
    perksNumberClass: "text-[#D7DBE2] drop-shadow-[0_0_12px_rgba(215,219,226,0.45)]",
    perksIconActiveColor: "text-[#D7DBE2]",
    perksIconDefaultColor: "text-[#8C97A7] group-hover:text-white",
    perksInsignia: {
      wingTopLeft0: "#1A1E24",
      wingTopLeft50: "#475569",
      wingTopLeft100: "#D7DBE2",
      wingFacetDark0: "#0F1216",
      wingFacetDark100: "#1A1E24",
      ridgeColor: "#D7DBE2",
      beaconColor: "#D7DBE2",
      beaconShadow: "shadow-[0_0_12px_#D7DBE2]",
      reticleColor: "rgba(215, 219, 226, 0.35)",
      labelColor: "#CBD5E1",
      bracketColor: "#D7DBE2",
    },

    // Journey
    journeyHeaderGradient: "text-[#D7DBE2]",
    journeyLaserGradient: "from-[#1A1E24] via-[#778292] to-[#D7DBE2]",
    journeyLaserShadow:
      "shadow-[0_0_14px_#D7DBE2,0_0_28px_rgba(215,219,226,0.7),0_0_45px_rgba(119,130,146,0.5)]",
    journeyLeadingSparkColor: "#FFFFFF",
    journeyLeadingSparkShadow:
      "shadow-[0_0_12px_#FFFFFF,0_0_24px_#D7DBE2,0_0_48px_#D7DBE2]",
    journeyNodeBloom: "bg-[#D7DBE2]/35",
    journeyNodeGlowGradient: "from-[#D7DBE2] via-[#778292] to-[#1A1E24]",
    journeyNodeReticleBorder: "border-slate-400/50",
    journeyNodeBorder: "border-[#D7DBE2]",
    journeyNodeBg: "from-[#161A20] via-[#0E1115] to-black",
    journeyNodeShadow:
      "shadow-[0_0_20px_rgba(215,219,226,0.8),inset_0_0_12px_rgba(119,130,146,0.6)]",
    journeyCrosshairs: "bg-slate-300 shadow-[0_0_6px_#D7DBE2]",
    journeyCardBorder: "border-slate-600/30",
    journeyCardHoverBorder: "hover:border-slate-400/60",
    journeyCardHoverShadow: "hover:shadow-[0_0_28px_rgba(215,219,226,0.2)]",
    journeyCardCornerBracket: "border-slate-400/60",
    journeyIconBoxBg: "bg-slate-800/50",
    journeyIconBoxBorder: "border-slate-500/30 group-hover:border-slate-400/60",
    journeyIconColor: "text-slate-300 group-hover:text-white",

    // Colleges
    collegesHeaderGradient: "text-[#D7DBE2]",
    collegesAtmosphereClass: "bg-slate-800/15",
    collegesStatGradient: "from-[#FFFFFF] to-[#778292]",
    collegesCardBorder: "border-slate-600/25",
    collegesCardHoverBorder: "hover:border-slate-400/60",
    collegesCardHoverShadow: "hover:shadow-[0_0_25px_rgba(215,219,226,0.2)]",
    collegesPinColor: "text-slate-300",
    collegesTierHost:
      "text-slate-200 border-slate-400/50 bg-slate-800/50 shadow-[0_0_12px_rgba(215,219,226,0.25)]",
    collegesTierPrimary: "text-slate-300/90 border-slate-500/40 bg-slate-800/30",
    collegesTierSecondary: "text-slate-400/80 border-slate-600/30 bg-slate-900/20",
    collegesExpandBtn:
      "border-slate-500/40 bg-slate-800/40 hover:bg-slate-700/50 hover:border-slate-300/70 shadow-[0_0_15px_rgba(215,219,226,0.15)]",

    // Leaderboard
    leaderboardHeaderGradient: "text-[#D7DBE2]",
    leaderboardAtmosphereClass: "bg-slate-800/15",
    leaderboardTableBorder: "border-slate-600/30",
    leaderboardHeaderBg: "bg-slate-800/30 border-slate-600/20",
    leaderboardPointsColor: "text-slate-200",
    rank1Badge:
      "bg-gradient-to-r from-[#FFFFFF] via-[#D7DBE2] to-[#94A3B8] text-black font-extrabold shadow-[0_0_14px_rgba(215,219,226,0.7)] border border-white",
    rank2Badge:
      "bg-gradient-to-r from-[#5B6472] to-[#3A4452] text-slate-100 border border-slate-400/60",
    rank3Badge:
      "bg-gradient-to-r from-[#2B323D] to-[#1A1D21] text-slate-300 border border-slate-600/40",

    // Apply
    applyHeaderGradient: "text-[#D7DBE2]",
    applyAtmosphereClass: "bg-slate-800/20",
    applyRazorLinePrimary: "#D7DBE2",
    applyRazorLineSecondary: "#5B6472",
    applyArmorStroke: "#778292",
    applyCrestCenter0: "#FFFFFF",
    applyCrestCenter100: "#1A1E24",
    applyCrestWing0: "#778292",
    applyCrestWing100: "#14181D",
    applyCrestFlank0: "#5B6472",
    applyCrestFlank100: "#0D1013",
    applyCrestHighlight: "#FFFFFF",
    applyTimelineSpine: "bg-slate-400/80 shadow-[0_0_10px_#D7DBE2]",
    applyStepActiveNode: "border-[#D7DBE2] shadow-[0_0_16px_#D7DBE2]",
    applyStepActiveNumber:
      "text-[#D7DBE2] drop-shadow-[0_0_15px_rgba(215,219,226,0.6)]",

    // Modal
    modalArmorLineStroke: "#D7DBE2",
    modalArmorFillStroke: "#778292",
    modalProgressBarBg: "bg-[#D7DBE2] shadow-[0_0_10px_#D7DBE2]",
    modalInputFocusBorder: "focus:border-slate-300/80",
    modalInputFocusShadow: "focus:shadow-[0_0_15px_rgba(215,219,226,0.25)]",
    modalCheckboxCheckedBg: "bg-[#D7DBE2] text-black border-[#D7DBE2]",
    modalCheckboxCheckedBorder: "border-[#D7DBE2]",
  },
};

export function useAmbassadorTheme(): AmbassadorThemeTokens {
  const { resolvedTheme } = useTheme();
  const canonical = (resolvedTheme as CanonicalTheme) || "arrakis-day";
  return AMBASSADOR_THEMES[canonical] || AMBASSADOR_THEMES["arrakis-day"];
}

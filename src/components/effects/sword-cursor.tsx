"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

interface SwordThemePalette {
  coreBeam: string;
  bladeLit: string;
  bladeLitStroke: string;
  bladeShadow: string;
  auraInner: string;
  auraOuter: string;
  auraStroke: string;
  guardMain: string;
  guardAlt: string;
  guardHighlight: string;
  gemFill: string;
  gemShine: string;
  gemGlow: string;
  gripBand: string;
  pommelFill: string;
  pommelStroke: string;
  dropShadow: string;
  dropShadowHover: string;
}

const SWORD_THEMES: Record<CanonicalTheme, SwordThemePalette> = {
  // Arrakis Solar Day - Imperial Sand Gold & Melange Spice Blue Core
  "arrakis-day": {
    coreBeam: "#FFFFFF",
    bladeLit: "#F59E0B",
    bladeLitStroke: "#FEF08A",
    bladeShadow: "#B45309",
    auraInner: "#F59E0B",
    auraOuter: "#D97706",
    auraStroke: "#F59E0B",
    guardMain: "#D4A843",
    guardAlt: "#B88A27",
    guardHighlight: "#FFF1BA",
    gemFill: "#00E5FF", // Electric Spice Blue in the golden sun
    gemShine: "#E0F2FE",
    gemGlow: "#00E5FF",
    gripBand: "#D4A843",
    pommelFill: "#D4A843",
    pommelStroke: "#FFE58F",
    dropShadow: "rgba(212,168,67,0.55)",
    dropShadowHover: "rgba(245,158,11,0.85)",
  },

  // Geass Moon - The exact MVS Vibro-Blade with crimson scarlet & emerald core
  "geass-moon": {
    coreBeam: "#FFFFFF",
    bladeLit: "#FF2632",
    bladeLitStroke: "#FFA6AC",
    bladeShadow: "#B8000C",
    auraInner: "#FF1E27",
    auraOuter: "#FF404A",
    auraStroke: "#FF1E27",
    guardMain: "#D4A843",
    guardAlt: "#B88A27",
    guardHighlight: "#FFF1BA",
    gemFill: "#00E676", // Sakuradite Emerald Green
    gemShine: "#B9F6CA",
    gemGlow: "#00E676",
    gripBand: "#D4A843",
    pommelFill: "#D4A843",
    pommelStroke: "#FFE58F",
    dropShadow: "rgba(255,30,39,0.55)",
    dropShadowHover: "rgba(255,30,39,0.9)",
  },

  // Krelln Night - Moonlit Dust, Stark Platinum & Lunar Silver
  "krelln-night": {
    coreBeam: "#FFFFFF",
    bladeLit: "#E2E8F0",
    bladeLitStroke: "#F8FAFC",
    bladeShadow: "#64748B",
    auraInner: "#94A3B8",
    auraOuter: "#CBD5E1",
    auraStroke: "#94A3B8",
    guardMain: "#94A3B8",
    guardAlt: "#64748B",
    guardHighlight: "#F1F5F9",
    gemFill: "#E2E8F0", // Stark Diamond Silver
    gemShine: "#FFFFFF",
    gemGlow: "#CBD5E1",
    gripBand: "#CBD5E1",
    pommelFill: "#94A3B8",
    pommelStroke: "#F8FAFC",
    dropShadow: "rgba(148,163,184,0.35)",
    dropShadowHover: "rgba(203,213,225,0.65)",
  },
};

export function SwordCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const themeContext = useTheme();
  const [currentTheme, setCurrentTheme] = useState<CanonicalTheme>(
    () => normalizeTheme(themeContext?.resolvedTheme)
  );
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  // Synchronize theme dynamically on any theme switcher change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveTheme = (): CanonicalTheme => {
      const docTheme = document.documentElement.getAttribute("data-theme");
      return normalizeTheme(docTheme || themeContext?.resolvedTheme);
    };

    const applyTheme = () => {
      setCurrentTheme(resolveTheme());
    };

    applyTheme();

    // Instant observation of data-theme change on html root
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("techsrijan-theme-change", applyTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("techsrijan-theme-change", applyTheme);
    };
  }, [themeContext?.resolvedTheme]);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setIsEnabled(true);
    document.documentElement.classList.add("has-sword-cursor");
    document.body.classList.add("has-sword-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number | null = null;

    const updatePosition = () => {
      if (cursorRef.current) {
        // Offset so the sword blade tip at (2, 2) aligns exactly with (mouseX, mouseY)
        cursorRef.current.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      updatePosition();

      // Check if hovering clickable/interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            'a, button, [role="button"], input, select, textarea, label, .cursor-pointer, [tabindex="0"]'
          )
        );
        setIsPointer(interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("has-sword-cursor");
      document.body.classList.remove("has-sword-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isEnabled) return null;

  const palette = SWORD_THEMES[currentTheme] || SWORD_THEMES["arrakis-day"];

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] transition-opacity duration-100 ease-out will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {isPointer ? (
        // Hovering interactive elements: Glowing energized sword pointer in theme colors
        <div
          className="relative transition-transform duration-100 scale-105"
          style={{
            filter: `drop-shadow(0 0 10px ${palette.dropShadowHover})`,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ACTIVE VIBRO-FREQUENCY BURST AURA */}
            <circle cx="17.5" cy="17.5" r="9" fill={palette.auraInner} fillOpacity="0.3" />
            <path d="M2 2 L23 15 L15 23 Z" fill={palette.auraInner} fillOpacity="0.45" />
            <path
              d="M2 2 L22.5 15.5 L15.5 22.5 Z"
              stroke={palette.auraInner}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <path
              d="M2 2 L21 16 L16 21 Z"
              stroke={palette.auraOuter}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />

            {/* BLADE BLACK SILHOUETTE OUTLINE */}
            <path
              d="M2 2 L20 16.2 L18.5 18.5 L16.2 20 Z"
              fill="#050203"
              stroke="#050203"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* BLADE THEMED FACETS (OVERLOADED ENERGY) */}
            <path d="M2.4 2.4 L19.4 16.4 L18.2 18.2 Z" fill={palette.bladeLit} />
            <path
              d="M2.4 2.4 L19.4 16.4"
              stroke={palette.bladeLitStroke}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M2.4 2.4 L18.2 18.2 L16.4 19.4 Z" fill={palette.bladeShadow} />

            {/* WHITE LASER ENERGY CORE */}
            <path
              d="M2.4 2.4 L17.5 17.5"
              stroke={palette.coreBeam}
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* HILT / GRIP */}
            <path d="M18.5 18.5 L26 26" stroke="#0D0B08" strokeWidth="3.2" strokeLinecap="square" />
            <path d="M19.5 19.5 L25.5 25.5" stroke="#42372A" strokeWidth="2.2" strokeLinecap="square" />
            <path d="M20.5 21.5 L21.5 20.5" stroke={palette.gripBand} strokeWidth="1.4" />
            <path d="M22.5 23.5 L23.5 22.5" stroke={palette.gripBand} strokeWidth="1.4" />
            <path d="M24.5 25.5 L25.5 24.5" stroke={palette.gripBand} strokeWidth="1.4" />

            {/* POMMEL */}
            <path d="M25 27 L27 25 L31 29 L29 31 Z" fill="#050203" />
            <path
              d="M25.5 26.5 L26.5 25.5 L30 29 L29 30 Z"
              fill={palette.pommelFill}
              stroke={palette.pommelStroke}
              strokeWidth="0.6"
            />

            {/* CROSSGUARD */}
            <path
              d="M17.5 15.5 L24 10 L22.5 7.5 L18.5 13.5 L13.5 18.5 L7.5 22.5 L10 24 L15.5 17.5 Z"
              fill="#050203"
              stroke="#050203"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M18 15.5 L23.5 10.5 L22.2 8.5 L19 13.8 Z" fill={palette.guardMain} />
            <path d="M18 15.5 L23.2 10.8" stroke={palette.guardHighlight} strokeWidth="1" />
            <path d="M15.5 18 L10.5 23.5 L8.5 22.2 L13.8 19 Z" fill={palette.guardAlt} />
            <path d="M15.5 18 L10.8 23.2" stroke={palette.guardHighlight} strokeWidth="1" />

            {/* Center Crest */}
            <circle cx="17.5" cy="17.5" r="3.4" fill={palette.guardMain} stroke="#050203" strokeWidth="0.8" />

            {/* RADIANT THEMED GEM FLASH */}
            <circle cx="17.5" cy="17.5" r="4.5" fill={palette.gemGlow} fillOpacity="0.5" />
            <polygon
              points="17.5,14.8 20.2,17.5 17.5,20.2 14.8,17.5"
              fill={palette.gemFill}
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            <polygon
              points="17.5,15.8 19.2,17.5 17.5,19.2 15.8,17.5"
              fill={palette.gemShine}
            />
            <circle cx="17.5" cy="17.5" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>
      ) : (
        // Resting state: The authentic Vibro-blade sword cursor matched to current theme
        <div
          className="relative"
          style={{
            filter: `drop-shadow(0 0 6px ${palette.dropShadow})`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* VIBRATION GLOW AURA (HIGH FREQUENCY OSCILLATION) */}
            <path d="M2 2 L20.5 16.5 L16.5 20.5 Z" fill={palette.auraInner} fillOpacity="0.25" />
            <path
              d="M2 2 L21 16 L16 21 Z"
              stroke={palette.auraStroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
            <path
              d="M2 2 L20 16.2 L16.2 20 Z"
              stroke={palette.auraOuter}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />

            {/* BLADE BLACK SILHOUETTE OUTLINE FOR MAXIMUM CONTRAST */}
            <path
              d="M2 2 L20 16.2 L18.5 18.5 L16.2 20 Z"
              fill="#050203"
              stroke="#050203"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* BLADE THEMED VIBRO-FACETS */}
            <path d="M2.4 2.4 L19.4 16.4 L18.2 18.2 Z" fill={palette.bladeLit} />
            <path
              d="M2.4 2.4 L19.4 16.4"
              stroke={palette.bladeLitStroke}
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <path d="M2.4 2.4 L18.2 18.2 L16.4 19.4 Z" fill={palette.bladeShadow} />

            {/* WHITE-HOT HIGH FREQUENCY BLADE CORE */}
            <path
              d="M2.4 2.4 L17.5 17.5"
              stroke={palette.coreBeam}
              strokeWidth="0.85"
              strokeLinecap="round"
            />

            {/* HILT / GRIP */}
            <path d="M18.5 18.5 L26 26" stroke="#0D0B08" strokeWidth="3.2" strokeLinecap="square" />
            <path d="M19.5 19.5 L25.5 25.5" stroke="#42372A" strokeWidth="2.2" strokeLinecap="square" />
            <path d="M20.5 21.5 L21.5 20.5" stroke={palette.gripBand} strokeWidth="1.2" />
            <path d="M22.5 23.5 L23.5 22.5" stroke={palette.gripBand} strokeWidth="1.2" />
            <path d="M24.5 25.5 L25.5 24.5" stroke={palette.gripBand} strokeWidth="1.2" />

            {/* POMMEL */}
            <path d="M25 27 L27 25 L31 29 L29 31 Z" fill="#050203" />
            <path
              d="M25.5 26.5 L26.5 25.5 L30 29 L29 30 Z"
              fill={palette.pommelFill}
              stroke={palette.pommelStroke}
              strokeWidth="0.5"
            />

            {/* CROSSGUARD */}
            <path
              d="M17.5 15.5 L23.5 10.5 L22 8 L18.5 13.5 L13.5 18.5 L8 22 L10.5 23.5 L15.5 17.5 Z"
              fill="#050203"
              stroke="#050203"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M18 15.5 L23 11 L21.8 9 L19 13.8 Z" fill={palette.guardMain} />
            <path d="M18 15.5 L22.8 11.2" stroke={palette.guardHighlight} strokeWidth="0.8" />
            <path d="M15.5 18 L11 23 L9 21.8 L13.8 19 Z" fill={palette.guardAlt} />
            <path d="M15.5 18 L11.2 22.8" stroke={palette.guardHighlight} strokeWidth="0.8" />

            {/* Guard Center Crest */}
            <circle cx="17.5" cy="17.5" r="3.2" fill={palette.guardMain} stroke="#050203" strokeWidth="0.8" />

            {/* THEMED CORE GEM */}
            <polygon
              points="17.5,15.2 19.8,17.5 17.5,19.8 15.2,17.5"
              fill={palette.gemFill}
              stroke="#050203"
              strokeWidth="0.6"
            />
            <polygon
              points="17.5,16 19,17.5 17.5,19 16,17.5"
              fill={palette.gemShine}
            />
            <circle cx="17.5" cy="17.5" r="0.6" fill="#FFFFFF" />
          </svg>
        </div>
      )}
    </div>
  );
}

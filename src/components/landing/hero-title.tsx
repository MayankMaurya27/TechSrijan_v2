"use client";

import { useEffect, useState, useRef } from "react";
import { TechSrijan3DLogo } from "./techsrijan-3d-logo";

const SESSION_KEY = "techsrijan_intro_video_played";

export interface HeroTitleProps {
  scrollProgress: number;
}

export function HeroTitle({ scrollProgress }: HeroTitleProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If intro has already played in this tab (e.g. user refreshed), enter immediately!
    if (typeof window !== "undefined") {
      const hasPlayedInTab = sessionStorage.getItem(SESSION_KEY);
      if (hasPlayedInTab) {
        setHasEntered(true);
      }
    }

    const handleIntroComplete = () => {
      // As intro fades out to the black/ambient landing page, animate in the TechSrijan text
      setTimeout(() => {
        setHasEntered(true);
      }, 80);
    };

    window.addEventListener("intro-complete", handleIntroComplete);

    // Fallback: If no intro video is shown or after delay, ensure entered
    const fallbackTimer = setTimeout(() => {
      setHasEntered(true);
    }, 1200);

    return () => {
      window.removeEventListener("intro-complete", handleIntroComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Smooth scroll exit:
  // 1. Vignette: Fixed to screen edges, ZERO translation. Fades out smoothly as scroll starts (0 to 3.5% scroll)
  const vignetteFadeThreshold = 0.035;
  const vignetteProgress = Math.min(1, Math.max(0, scrollProgress / vignetteFadeThreshold));
  const vignetteOpacity = hasEntered ? Math.max(0, 1 - vignetteProgress) : 0;

  // 2. Main emblem logo: subtle upward drift and scale, fades out completely by 7% scroll
  const emblemFadeThreshold = 0.07;
  const emblemProgress = Math.min(1, Math.max(0, scrollProgress / emblemFadeThreshold));
  const emblemOpacity = hasEntered ? Math.max(0, 1 - emblemProgress) : 0;
  const emblemTranslateY = -emblemProgress * 32;
  const emblemScale = 1 - emblemProgress * 0.03;

  // Don't render/composite if both are fully faded out down the scroll track
  if (emblemOpacity <= 0.002 && vignetteOpacity <= 0.002 && hasEntered) {
    return null;
  }

  // Use CSS transition only during initial entrance animation on mount (when scroll is 0).
  // When scrolling (scrollProgress > 0), disable transition so frame-by-frame scroll is buttery smooth with zero lag!
  const isScrolling = scrollProgress > 0.001;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {/* ========================================================
          CINEMATIC VIEWPORT BORDER VIGNETTE
          - Locked strictly to screen edges: NO translation/transform
          - Feathered radial & edge gradients
          - Fades out cleanly on scroll without dragging or showing
          ======================================================== */}
      {vignetteOpacity > 0.001 && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            opacity: vignetteOpacity,
            transition: isScrolling
              ? "none"
              : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "opacity",
          }}
        >
          {/* Top border vignette (smoothly frames navbar & sky) */}
          <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

          {/* Bottom border vignette (grounds dunes & scroll indicator) */}
          <div className="absolute bottom-0 inset-x-0 h-36 sm:h-48 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          {/* Left border vignette */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

          {/* Right border vignette */}
          <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-black/45 via-black/15 to-transparent" />

          {/* Radial perimeter falloff */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.25) 70%, rgba(0, 0, 0, 0.58) 100%)",
            }}
          />

          {/* Central Soft Contrast Pocket (seamless 55px blur to make bronze metal & ruby star insets pop) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[1100px] h-[340px] rounded-full blur-[55px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.36) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 75%)",
            }}
          />
        </div>
      )}

      {/* ========================================================
          HERO EMBLEM & SCROLL INDICATOR
          - Smooth entrance and responsive scroll drift
          ======================================================== */}
      {emblemOpacity > 0.001 && (
        <div
          ref={containerRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 pb-20 sm:pt-14 sm:pb-16 pointer-events-none"
          style={{
            opacity: emblemOpacity,
            transform: hasEntered
              ? `translateY(${emblemTranslateY}px) scale(${emblemScale})`
              : "translateY(28px) scale(0.92)",
            transition: isScrolling
              ? "none"
              : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform, opacity",
          }}
        >
          {/* Main 3D Sculpted Typography Canvas (Interactive Three.js & CSS 3D Engine) */}
          <div className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex justify-center items-center pointer-events-auto">
            {/* Hidden Accessible H1 for SEO & Screen Readers */}
            <h1 className="sr-only">
              TechSrijan &apos;27 — The Awakening Begins — Coming Soon
            </h1>

            <TechSrijan3DLogo scrollProgress={scrollProgress} hasEntered={hasEntered} />
          </div>

          {/* Minimal Luxury Vertical Scroll Indicator */}
          <div
            className="absolute bottom-3 sm:bottom-5 flex flex-col items-center pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - scrollProgress / 0.025),
              transition: isScrolling ? "none" : "opacity 0.3s ease-out",
            }}
          >
            {/* SCROLL TO ENTER CITADEL text in clean, geometric bold sans-serif */}
            <span className="font-sans font-bold text-[11px] sm:text-xs tracking-[0.28em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
              SCROLL TO ENTER CITADEL
            </span>

            {/* Vertical animated line moving smoothly up and down with light beam */}
            <div className="relative mt-2 flex flex-col items-center animate-scroll-indicator">
              {/* Subtle ambient blur glow */}
              <div className="absolute w-[2px] h-8 sm:h-10 bg-white/40 blur-[2px]" />

              {/* Razor-thin luminous vertical track */}
              <div className="relative w-[1.5px] h-8 sm:h-10 bg-gradient-to-b from-white via-white/80 to-transparent rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)] overflow-hidden">
                {/* Sliding light pulse beam */}
                <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white to-transparent animate-scroll-beam" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

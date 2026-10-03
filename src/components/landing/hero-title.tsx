"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

interface HeroTitleProps {
  scrollProgress: number;
}

export function HeroTitle({ scrollProgress }: HeroTitleProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ rotX: 0, rotY: 0, transX: 0, transY: 0, lightX: 50, lightY: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntroComplete = () => {
      // Smooth cinematic entrance right after intro completes
      setTimeout(() => {
        setHasEntered(true);
      }, 150);
    };

    window.addEventListener("intro-complete", handleIntroComplete);

    // Safety fallback: if no intro video or completed immediately
    const fallbackTimer = setTimeout(() => {
      setHasEntered(true);
    }, 4500);

    return () => {
      window.removeEventListener("intro-complete", handleIntroComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Enhanced interactive 3D perspective tilt & cursor light reflection
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

    // Tastefully increased tilt and parallax movement
    setMouseTilt({
      rotX: -normY * 6.5,
      rotY: normX * 6.5,
      transX: normX * 14,
      transY: normY * 10,
      lightX: ((normX + 1) / 2) * 100,
      lightY: ((normY + 1) / 2) * 100,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Smooth scroll exit: fades out completely within the first 8% of the scroll journey
  const fadeOutThreshold = 0.08;
  const normalizedFade = Math.min(1, Math.max(0, scrollProgress / fadeOutThreshold));
  const currentOpacity = hasEntered ? Math.max(0, 1 - normalizedFade) : 0;
  const currentTranslateY = -normalizedFade * 65; // Upward drift on scroll
  const currentScale = 1 - normalizedFade * 0.05;

  // Don't render/composite if fully faded out down the scroll track
  if (currentOpacity <= 0.005 && hasEntered) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4 pt-10 sm:pt-14 pb-12 sm:pb-16"
      style={{
        opacity: currentOpacity,
        transform: `translateY(${currentTranslateY}px) scale(${currentScale})`,
        transition: hasEntered ? "none" : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Layer A: Atmospheric Contrast Backing (subtle vignette for crisp separation) */}
      <div
        className="absolute w-[95vw] sm:w-[950px] lg:w-[1250px] h-[360px] sm:h-[480px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 55% at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 80%)",
        }}
      />

      {/* Layer B: Gentle Warm Celestial Glow (toned down brightness for deep antique gold look) */}
      <div
        className="absolute w-[600px] sm:w-[850px] lg:w-[1100px] h-[280px] sm:h-[380px] rounded-full pointer-events-none opacity-25 blur-3xl -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.20) 0%, rgba(212,168,67,0.06) 50%, transparent 75%)",
          animationDuration: "4s",
        }}
      />

      {/* Main 3D Sculpted Typography Asset (Responsive 3D Parallax & Cursor Spotlight) */}
      <div
        className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex justify-center items-center transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1100px) rotateX(${mouseTilt.rotX}deg) rotateY(${mouseTilt.rotY}deg) translate3d(${mouseTilt.transX}px, ${mouseTilt.transY}px, 0)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Hidden Accessible H1 for SEO & Screen Readers */}
        <h1 className="sr-only">
          TechSrijan &apos;27 — MMMUT Gorakhpur Presents — The Awakening Begins (25 - 27 September 2027)
        </h1>

        <div className="relative w-full flex justify-center overflow-hidden">
          <picture className="w-full flex justify-center">
            <source srcSet="/hero-logo.webp" type="image/webp" />
            <Image
              src="/hero-logo.png"
              alt="TechSrijan '27 — The Awakening Begins"
              width={2048}
              height={682}
              priority
              quality={100}
              className="w-full h-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              style={{
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          </picture>

          {/* Dynamic Interactive Cursor Specular Gleam across the metallic relief */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${mouseTilt.lightX}% ${mouseTilt.lightY}%, rgba(255, 235, 175, 0.22) 0%, rgba(212, 168, 67, 0.06) 40%, transparent 70%)`,
              mixBlendMode: "color-dodge",
            }}
          />

          {/* Periodic Specular Metallic Sheen across the gold letters */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/12 to-transparent animate-specular-sheen" />
        </div>
      </div>

      {/* Minimal Luxury Vertical Scroll Indicator */}
      <div
        className="absolute bottom-3 sm:bottom-5 flex flex-col items-center"
        style={{
          opacity: Math.max(0, currentOpacity * 0.95),
          transition: "opacity 0.3s ease-out",
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
  );
}

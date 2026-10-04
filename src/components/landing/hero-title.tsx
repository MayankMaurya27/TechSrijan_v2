"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

const SESSION_KEY = "techsrijan_intro_video_played";

interface HeroTitleProps {
  scrollProgress: number;
}

export function HeroTitle({ scrollProgress }: HeroTitleProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ rotX: 0, rotY: 0 });
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

  // Subtle, highly damped 3D perspective tilt on mouse move (keeps text rock-solid without displacing position)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

    // Very gentle 1.5 degree tilt only, no position shift
    setMouseTilt({
      rotX: -normY * 1.5,
      rotY: normX * 1.5,
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
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4 pt-16 pb-20 sm:pt-14 sm:pb-16"
      style={{
        opacity: currentOpacity,
        transform: hasEntered
          ? `translateY(${currentTranslateY}px) scale(${currentScale})`
          : "translateY(28px) scale(0.92)",
        transition: "opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Layer A: Atmospheric Contrast Backing (subtle dark vignette for clean separation) */}
      <div
        className="absolute w-[95vw] sm:w-[950px] lg:w-[1250px] h-[360px] sm:h-[480px] pointer-events-none -z-10 md:translate-x-12 lg:translate-x-20 xl:translate-x-28 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(ellipse 70% 55% at center, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.22) 55%, transparent 80%)",
        }}
      />

      {/* Main 3D Sculpted Typography Asset (Gentle, stable 3D perspective tilt, shifted right on desktop) */}
      <div className="w-full flex justify-center items-center md:translate-x-12 lg:translate-x-20 xl:translate-x-28 transition-transform duration-700 ease-out">
        <div
          className="relative w-full max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex justify-center items-center transition-transform duration-500 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mouseTilt.rotX}deg) rotateY(${mouseTilt.rotY}deg)`,
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
          </div>
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

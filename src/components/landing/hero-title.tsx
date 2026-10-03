"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeroTitleProps {
  scrollProgress: number;
}

export function HeroTitle({ scrollProgress }: HeroTitleProps) {
  const [hasEntered, setHasEntered] = useState(false);

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

  // Smooth scroll exit: fades out completely within the first 8% of the scroll journey
  const fadeOutThreshold = 0.08;
  const normalizedFade = Math.min(1, Math.max(0, scrollProgress / fadeOutThreshold));
  const currentOpacity = hasEntered ? Math.max(0, 1 - normalizedFade) : 0;
  const currentTranslateY = -normalizedFade * 60; // Upward drift on scroll
  const currentScale = 1 - normalizedFade * 0.05;

  // Don't render/composite if fully faded out down the scroll track
  if (currentOpacity <= 0.005 && hasEntered) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4 pt-10 sm:pt-14 pb-12 sm:pb-16"
      style={{
        opacity: currentOpacity,
        transform: `translateY(${currentTranslateY}px) scale(${currentScale})`,
        transition: hasEntered ? "none" : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Layer A: Atmospheric Contrast Backing (ensures bold 100% readability over bright desert video frames) */}
      <div
        className="absolute w-[95vw] sm:w-[900px] lg:w-[1200px] h-[360px] sm:h-[480px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 55% at center, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.35) 55%, transparent 80%)",
        }}
      />

      {/* Layer B: Volumetric Radial Celestial Gold Aura */}
      <div
        className="absolute w-[600px] sm:w-[850px] lg:w-[1100px] h-[300px] sm:h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.32) 0%, rgba(212,168,67,0.10) 45%, transparent 75%)",
          animationDuration: "4s",
        }}
      />

      {/* Main 3D Sculpted Typography Asset (Centered & Scaled for Maximum Boldness) */}
      <div className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex justify-center items-center">
        {/* Hidden Accessible H1 for SEO & Screen Readers */}
        <h1 className="sr-only">
          TechSrijan &apos;27 — MMMUT Gorakhpur Presents — The Awakening Begins (25 - 27 September 2027)
        </h1>

        <picture className="w-full flex justify-center">
          <source srcSet="/hero-logo.webp" type="image/webp" />
          <Image
            src="/hero-logo.png"
            alt="TechSrijan '27 — The Awakening Begins"
            width={1024}
            height={341}
            priority
            className="w-full h-auto object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(212,168,67,0.4)]"
          />
        </picture>
      </div>

      {/* Subtle Tactical Scroll Prompt */}
      <div
        className="absolute bottom-6 sm:bottom-10 flex flex-col items-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[var(--accent-primary,#d4a843)] opacity-85"
        style={{
          opacity: Math.max(0, currentOpacity * 0.85),
          transition: "opacity 0.3s ease-out",
        }}
      >
        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">[ SCROLL TO ENTER CITADEL ]</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[var(--accent-primary,#d4a843)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
      </div>
    </div>
  );
}

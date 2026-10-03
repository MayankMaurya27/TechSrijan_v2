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
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
      style={{
        opacity: currentOpacity,
        transform: `translateY(${currentTranslateY}px) scale(${currentScale})`,
        transition: hasEntered ? "none" : "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Volumetric Radial Celestial Glow behind Logo */}
      <div
        className="absolute w-[600px] sm:w-[850px] lg:w-[1100px] h-[350px] sm:h-[450px] rounded-full pointer-events-none opacity-40 blur-3xl -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,168,67,0.28) 0%, rgba(212,168,67,0.08) 45%, transparent 75%)",
          animationDuration: "4s",
        }}
      />

      {/* Main 3D Sculpted Typography Asset */}
      <div className="relative w-full max-w-[92vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex justify-center items-center">
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
            className="w-full h-auto object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(212,168,67,0.35)]"
          />
        </picture>
      </div>

      {/* Subtle Tactical Scroll Prompt */}
      <div
        className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[var(--accent-primary,#d4a843)] opacity-80"
        style={{
          opacity: Math.max(0, currentOpacity * 0.85),
          transition: "opacity 0.3s ease-out",
        }}
      >
        <span className="text-shadow-sm">[ SCROLL TO ENTER CITADEL ]</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[var(--accent-primary,#d4a843)]" />
      </div>
    </div>
  );
}

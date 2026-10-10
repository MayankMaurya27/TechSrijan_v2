"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePageTheme, useTheme, normalizeTheme, type CanonicalTheme } from "@/core";
import { useAboutTheme } from "../data/about-theme";

const LOGO_CONFIGS: Record<
  CanonicalTheme,
  {
    imageSrcWebp: string;
    imageSrcPng: string;
    glowColor: string;
    dropGlow: string;
    tagAccent: string;
  }
> = {
  "geass-moon": {
    imageSrcWebp: "/hero-logo-geass-moon.webp",
    imageSrcPng: "/hero-logo-geass-moon.png",
    glowColor: "rgba(255, 30, 39, 0.45)",
    dropGlow: "drop-shadow(0 0 25px rgba(255, 30, 39, 0.45)) drop-shadow(0 15px 45px rgba(0,0,0,0.9))",
    tagAccent: "text-[#FF1E27]",
  },
  "arrakis-day": {
    imageSrcWebp: "/hero-logo-arrakis-day.webp",
    imageSrcPng: "/hero-logo-arrakis-day.png",
    glowColor: "rgba(212, 168, 67, 0.45)",
    dropGlow: "drop-shadow(0 0 25px rgba(212, 168, 67, 0.45)) drop-shadow(0 15px 45px rgba(0,0,0,0.9))",
    tagAccent: "text-[#D4A843]",
  },
  "krelln-night": {
    imageSrcWebp: "/hero-logo-krelln-night.webp",
    imageSrcPng: "/hero-logo-krelln-night.png",
    glowColor: "rgba(121, 199, 227, 0.45)",
    dropGlow: "drop-shadow(0 0 25px rgba(121, 199, 227, 0.45)) drop-shadow(0 15px 45px rgba(0,0,0,0.9))",
    tagAccent: "text-[#79C7E3]",
  },
};

/**
 * Full-Frame 3D Interactive TechSrijan Emblem Showcase
 * Completely synchronized with the landing page 3D logo and active theme.
 */
export function TechSrijanLogoScrollReveal() {
  const containerRef = useRef<HTMLElement>(null);
  const pageTheme = usePageTheme();
  const aboutTheme = useAboutTheme();
  const themeContext = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const activeCanonical: CanonicalTheme = normalizeTheme(themeContext?.resolvedTheme);
  const activeLogo = LOGO_CONFIGS[activeCanonical] || LOGO_CONFIGS["geass-moon"];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 1.05;
      const end = windowHeight * 0.3;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  const rotX = isHovered ? -mouseOffset.y * 12 : (1 - scrollProgress) * 10;
  const rotY = isHovered ? mouseOffset.x * 14 : 0;
  const scale = 0.94 + scrollProgress * 0.08 + (isHovered ? 0.03 : 0);
  const translateY = (1 - scrollProgress) * 35;
  const opacity = Math.min(1, 0.4 + scrollProgress * 0.7);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-6 sm:py-10 my-2 overflow-visible select-none"
    >
      {/* 3D Perspective Stage */}
      <div
        style={{ perspective: "1600px" }}
        className="w-full flex flex-col items-center justify-center"
      >
        <div
          style={{
            transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity,
            transformStyle: "preserve-3d",
            transition: isHovered
              ? "transform 0.12s ease-out, opacity 0.3s ease-out"
              : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
          }}
          className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center px-4"
        >
          {/* Ambient Laser Aura Behind the Emblem */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl h-72 rounded-full blur-[120px] opacity-70 transition-all duration-700"
            style={{
              backgroundColor: activeLogo.glowColor,
            }}
          />

          {/* THE MASTER CRAFTED TECHSRIJAN EMBLEM (Landing Page Synced) */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className="relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl aspect-[2172/724] my-4 transition-transform duration-500 hover:scale-[1.03]"
          >
            {/* Dynamic Crossfade Stack Across Canonical Themes */}
            {(["geass-moon", "arrakis-day", "krelln-night"] as CanonicalTheme[]).map((themeKey) => {
              const conf = LOGO_CONFIGS[themeKey];
              const isCurrent = activeCanonical === themeKey;
              return (
                <div
                  key={themeKey}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out flex items-center justify-center ${
                    isCurrent ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <picture className="w-full h-full relative">
                    <source srcSet={conf.imageSrcWebp} type="image/webp" />
                    <Image
                      src={conf.imageSrcPng}
                      alt="TechSrijan '27 Official Emblem"
                      fill
                      priority={isCurrent}
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1200px"
                      className="object-contain filter contrast-110 brightness-105"
                      style={{
                        filter: conf.dropGlow,
                      }}
                    />
                  </picture>
                </div>
              );
            })}

            {/* Specular Light Reflection Sweep that tracks across the metallic crest */}
            <div
              aria-hidden="true"
              style={{
                transform: `translateX(${mouseOffset.x * 50}%)`,
                transition: "transform 0.2s ease-out",
              }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-60 mix-blend-overlay"
            />
          </div>

          {/* Editorial Caption Below Logo */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="relative z-10 max-w-3xl mx-auto space-y-4 pt-2"
          >
            <p className="text-base sm:text-lg text-neutral-200 font-geist leading-relaxed tracking-wide">
              Where ancient architectural legacy meets cybernetic innovation.
              The annual flagship techno-management gathering of Eastern India awakens at{" "}
              <span className="text-white font-semibold">MMMUT Gorakhpur</span>.
            </p>

            {/* Feature Telemetry Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-sm font-bebas text-neutral-300">
              <span className={`${activeLogo.tagAccent} tracking-wider uppercase text-base`}>
                25+ Flagship Experiences
              </span>
              <span className="text-neutral-600 font-mono select-none">•</span>
              <span className="text-[#D4A843] tracking-wider uppercase text-base">
                ₹2.5L+ Prize Pool
              </span>
              <span className="text-neutral-600 font-mono select-none">•</span>
              <span className="text-emerald-400 tracking-wider uppercase text-base">
                25K+ Expected Footfall
              </span>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/events"
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-montserrat uppercase tracking-wider ${aboutTheme.primaryBtnClass} border ${aboutTheme.primaryBtnBorder} ${aboutTheme.primaryBtnShadow} transition-all duration-300 hover:scale-105 hover:brightness-125`}
              >
                <span>Enter The Arena</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-montserrat font-semibold uppercase tracking-wider ${aboutTheme.secondaryBtnClass} backdrop-blur-xl transition-all`}
              >
                <span>Command Roster</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

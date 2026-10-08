"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Full-Frame 3D Interactive TechSrijan Emblem Showcase
 * Completely borderless, ZERO box containers.
 * Floats majestically on the page canvas with dynamic 3D perspective,
 * smooth mouse parallax tilt, and scroll-linked depth.
 */
export function TechSrijanLogoScrollReveal() {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Smooth progress from entering viewport to centering
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
    // Normalized -1 to +1 from center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  // Dynamic 3D transform computations
  const rotX = isHovered ? -mouseOffset.y * 14 : (1 - scrollProgress) * 12;
  const rotY = isHovered ? mouseOffset.x * 16 : 0;
  const scale = 0.92 + scrollProgress * 0.1 + (isHovered ? 0.04 : 0);
  const translateY = (1 - scrollProgress) * 45;
  const opacity = Math.min(1, 0.3 + scrollProgress * 0.75);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-20 sm:py-32 my-12 overflow-visible select-none"
    >
      {/* Dynamic 3D Perspective Stage across the full width */}
      <div
        style={{ perspective: "1600px" }}
        className="w-full flex flex-col items-center justify-center"
      >
        {/* Full-Frame 3D Floating Rig (Zero Box, Zero Borders) */}
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
          {/* Ambient Multi-Chromatic Aurora Blooms Behind the Logo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl h-80 rounded-full bg-gradient-to-r from-[#79C7E3]/20 via-[#CAA4CF]/25 to-[#D4A843]/30 blur-[130px] opacity-75 transition-opacity duration-700"
          />

          {/* THE MASTER CRAFTED TECHSRIJAN '27 EMBLEM (Full Frame 3D Presence) */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className="relative w-full max-w-4xl sm:max-w-5xl aspect-[2048/682] my-4 transition-transform duration-500 hover:scale-105"
          >
            <Image
              src="/images/hero-logo.png"
              alt="TechSrijan '27 Official Emblem"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1200px"
              className="object-contain drop-shadow-[0_20px_50px_rgba(212,168,67,0.5)] drop-shadow-[0_40px_100px_rgba(121,199,227,0.35)] filter contrast-110 brightness-105"
            />

            {/* Specular Light Reflection Sweep that tracks across the metallic crest */}
            <div
              aria-hidden="true"
              style={{
                transform: `translateX(${mouseOffset.x * 60}%)`,
                transition: "transform 0.2s ease-out",
              }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-60 mix-blend-overlay"
            />
          </div>

          {/* Clean Editorial Caption Below Logo (Full Frame, Zero Box) */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="relative z-10 max-w-3xl mx-auto space-y-5 pt-4"
          >
            <p className="text-base sm:text-xl text-zinc-200 font-sans leading-relaxed tracking-wide">
              Where ancient architectural legacy meets cybernetic innovation.
              The annual flagship techno-management gathering of Eastern India awakens at{" "}
              <span className="text-white font-semibold">MMMUT Gorakhpur</span>.
            </p>

            {/* Clean Feature Divider Strip (No Box, Pure Text) */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-sm font-sans text-zinc-300">
              <span className="text-[#79C7E3] font-medium tracking-wide">30+ Arena Contests</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#D4A843] font-medium tracking-wide">₹10L+ Prize Purse</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#CAA4CF] font-medium tracking-wide">60+ Top Institutes</span>
            </div>

            {/* Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] px-8 py-3.5 text-xs font-sans font-bold text-black shadow-[0_0_30px_rgba(121,199,227,0.4)] transition-transform duration-300 hover:scale-105"
              >
                <span>Enter The Arena</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-7 py-3.5 text-xs font-sans font-medium text-white transition-all backdrop-blur-xl"
              >
                <span>Council Roster</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

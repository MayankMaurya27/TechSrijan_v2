"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Shield, Compass, Zap } from "lucide-react";

export function TechSrijanLogoScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollFactor, setScrollFactor] = useState(0); // 0 at top, 1 when scrolled into reveal
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // As soon as the user starts scrolling down, rect.top starts coming into view
      // Reveal progresses smoothly from rect.top = windowHeight to rect.top = windowHeight * 0.4
      const start = windowHeight * 1.1;
      const end = windowHeight * 0.35;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setScrollFactor(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
    setMousePos({ x, y });
  };

  // 3D transform calculations
  const rotateX = isHovered ? -mousePos.y * 18 : (1 - scrollFactor) * 16;
  const rotateY = isHovered ? mousePos.x * 22 : 0;
  const scale = 0.88 + scrollFactor * 0.14 + (isHovered ? 0.03 : 0);
  const translateY = (1 - scrollFactor) * 50;
  const opacity = Math.min(1, 0.2 + scrollFactor * 0.85);

  return (
    <section ref={containerRef} className="py-16 sm:py-24 my-12 sm:my-20 relative">
      {/* Dynamic 3D Perspective Stage */}
      <div
        style={{ perspective: "1400px" }}
        className="w-full flex items-center justify-center"
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePos({ x: 0, y: 0 });
          }}
          onMouseMove={handleMouseMove}
          style={{
            transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            opacity,
            transition: isHovered
              ? "transform 0.12s ease-out, opacity 0.3s ease-out"
              : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out",
          }}
          className="relative w-full max-w-5xl rounded-[3rem] bg-gradient-to-b from-white/[0.07] via-white/[0.04] to-black/40 border border-white/[0.18] p-8 sm:p-14 lg:p-16 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden cursor-pointer group"
        >
          {/* Ambient Multi-Chromatic Aurora Blooms */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#79C7E3]/25 blur-[100px] transition-opacity duration-700 group-hover:opacity-100 opacity-60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#D4A843]/30 blur-[110px] transition-opacity duration-700 group-hover:opacity-100 opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#CAA4CF]/20 blur-[120px] opacity-50"
          />

          {/* Specular Glint Beam that sweeps across the metallic logo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          />

          {/* Top Header Labels */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs font-mono">
            <span className="text-xs font-mono tracking-[0.25em] text-[#79C7E3] uppercase font-semibold">
              OFFICIAL IMPERIAL CREST
            </span>

            <span className="text-xs font-mono text-zinc-400 tracking-wider">
              MMMUT GORAKHPUR • EST. 1962
            </span>
          </div>

          {/* THE MASTER CRAFTED TECHSRIJAN LOGO EMBLEM */}
          <div className="relative z-10 my-6 sm:my-10 flex justify-center items-center">
            <div className="relative w-full max-w-3xl aspect-[2048/682] transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/images/hero-logo.png"
                alt="TechSrijan '27 Official Logo Crest"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain drop-shadow-[0_0_40px_rgba(212,168,67,0.55)] drop-shadow-[0_0_80px_rgba(121,199,227,0.3)] filter contrast-110"
              />
            </div>
          </div>

          {/* Subtitle & Descriptive Directives */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
              Where ancient architectural legacy meets cybernetic innovation.
              The annual flagship techno-management gathering of Eastern India awakens at{" "}
              <span className="text-white font-semibold">MMMUT Gorakhpur</span>.
            </p>

            {/* Quick Feature Badges - Clean Text Divider format */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 text-xs font-mono text-zinc-300">
              <span className="text-[#79C7E3] font-medium">30+ Arena Contests</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#D4A843] font-medium">₹10L+ Prize Purse</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#CAA4CF] font-medium">60+ Top Institutes</span>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] px-7 py-3 text-xs font-sans font-bold text-black shadow-[0_0_30px_rgba(121,199,227,0.4)] transition-transform duration-300 hover:scale-105"
              >
                <span>Enter The Arena</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-6 py-3 text-xs font-sans font-medium text-white transition-all backdrop-blur-xl"
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

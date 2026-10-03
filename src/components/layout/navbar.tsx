"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const isArrakis = theme === "arrakis";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(isArrakis ? "giedi-prime" : "arrakis");
  };

  return (
    <header className="fixed top-1 sm:top-1.5 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none select-none">
      <div className="relative w-full max-w-[1020px] pointer-events-auto">
        {/* SVG Mecha HUD Frame with Live Moving Neon Laser Border */}
        <svg
          className="absolute inset-0 w-full h-[62px] sm:h-[72px] pointer-events-none -z-10"
          viewBox="0 0 1200 76"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Deep basalt dark glass fill with subtle warm gradient */}
            <linearGradient id="hud-bg-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#120d08" stopOpacity="0.94" />
              <stop offset="50%" stopColor="#080604" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#150e07" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing filter for the neon beam */}
            <filter id="neon-beam-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="7" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Backdrop Glass Fill with exact chamfered corners & bottom center arch notch */}
          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="url(#hud-bg-fill)"
            className="backdrop-blur-xl"
          />

          {/* 2. Base Subtle Frame Stroke */}
          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={isArrakis ? "rgba(212, 168, 67, 0.45)" : "rgba(255, 60, 60, 0.45)"}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* 3. LIVE MOVING NEON LASER BORDER - Layer 1: Wide Radiant Aura Bloom */}
          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={isArrakis ? "#ffb703" : "#ff1a35"}
            strokeWidth="7"
            strokeOpacity="0.8"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-beam-glow)"
            className="animate-neon-border-glow"
          />

          {/* 4. LIVE MOVING NEON LASER BORDER - Layer 2: Vivid High-Intensity Laser Arc */}
          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={isArrakis ? "#ffd700" : "#ff4d6d"}
            strokeWidth="3.6"
            strokeOpacity="1"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-beam-glow)"
            className="animate-neon-border"
          />

          {/* 5. LIVE MOVING NEON LASER BORDER - Layer 3: White-Hot Core Laser Needle */}
          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeOpacity="1"
            vectorEffect="non-scaling-stroke"
            className="animate-neon-border"
          />
        </svg>

        {/* Bottom Center Solar Beacon Flare */}
        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-full blur-[3px] pointer-events-none ${
            isArrakis
              ? "bg-gradient-to-t from-amber-400/80 via-amber-500/40 to-transparent"
              : "bg-gradient-to-t from-red-500/80 via-red-600/40 to-transparent"
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white pointer-events-none animate-pulse ${
            isArrakis ? "shadow-[0_0_12px_#ffd700]" : "shadow-[0_0_12px_#ff2a3b]"
          }`}
        />

        {/* Inner Content Bar */}
        <div className="relative flex h-[54px] sm:h-[64px] items-center justify-between px-4 sm:px-8">
          {/* LEFT: [ TS ] Badge + TECHSRIJAN Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="group flex items-center gap-2.5">
              {/* Tactical TS Square Badge */}
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[3px] border border-[rgba(212,168,67,0.45)] bg-black/60 shadow-[0_0_12px_rgba(212,168,67,0.2)] transition-transform group-hover:scale-105">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-primary,#d4a843)]">
                  TS
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-[rgba(212,168,67,0.3)] mx-0.5 sm:mx-1" />

              {/* Brand Text */}
              <span className="font-sans font-bold text-xs sm:text-sm tracking-[0.24em] text-[#f8eed9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase transition-colors group-hover:text-[var(--accent-primary,#d4a843)]">
                TECHSRIJAN
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation Links with Vertical Dividers */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 font-sans text-[11px] xl:text-xs tracking-[0.22em] text-[#d6c7b2]">
            <Link
              href="/"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>COMMAND</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/events"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>DIRECTIVES</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/accommodation"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>ACCOMMODATION</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="#schedule"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>TIMELINE</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* RIGHT: Theme Pill (Planet Orb + ARRAKIS // 1.0) & INITIALIZE PASS Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Interactive Theme Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-[rgba(212,168,67,0.45)] bg-black/60 shadow-[0_0_12px_rgba(212,168,67,0.18)] hover:border-[var(--accent-primary,#d4a843)] transition-all active:scale-95 cursor-pointer"
              title={`Switch Celestial Theme: Current is ${isArrakis ? "Arrakis Solar Prime" : "Giedi Prime Infrared"}`}
            >
              {/* 3D Shaded Planet Sphere */}
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-500 relative flex-shrink-0 ${
                  isArrakis
                    ? "bg-gradient-to-br from-[#f5b358] via-[#c66c1b] to-[#421d05] shadow-[0_0_8px_#d4a843]"
                    : "bg-gradient-to-br from-[#ffffff] via-[#ff1e27] to-[#120000] shadow-[0_0_8px_#ff1e27]"
                }`}
              />

              {/* State Text */}
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold text-[#f8eed9] uppercase">
                {isArrakis ? "ARRAKIS // 1.0" : "GIEDI // 2.0"}
              </span>
            </button>

            {/* INITIALIZE PASS Chamfered Mecha Button */}
            <Link href="/dashboard" className="hidden sm:inline-block">
              <button
                type="button"
                className="clip-mecha-btn relative px-4 sm:px-5 py-2 font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_rgba(212,168,67,0.65)] transition-all active:scale-95"
              >
                INITIALIZE PASS
              </button>
            </Link>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded border border-[rgba(212,168,67,0.4)] bg-black/60 text-[#f8eed9] hover:text-[var(--accent-primary,#d4a843)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-2 rounded-lg border border-[rgba(212,168,67,0.4)] bg-[#0c0805]/95 backdrop-blur-2xl p-5 shadow-2xl">
            <div className="flex flex-col gap-4 font-sans text-xs tracking-[0.2em] text-[#d6c7b2]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // COMMAND
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // DIRECTIVES
              </Link>
              <Link
                href="/accommodation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // ACCOMMODATION
              </Link>
              <Link
                href="#schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // TIMELINE
              </Link>
              <div className="pt-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button
                    type="button"
                    className="clip-mecha-btn w-full py-2.5 font-sans font-bold text-xs tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] to-[rgba(212,168,67,0.08)] border border-[var(--accent-primary,#d4a843)]"
                  >
                    INITIALIZE PASS
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

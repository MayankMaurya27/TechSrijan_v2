"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { Menu, X } from "lucide-react";

const SESSION_KEY = "techsrijan_intro_video_played";

const NAVBAR_PATH =
  "M 24,0 L 1176,0 C 1192,0 1200,8 1200,22 L 1200,42 C 1200,56 1192,64 1176,64 L 760,64 C 752,64 746,67 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 C 454,67 448,64 440,64 L 24,64 C 8,64 0,56 0,42 L 0,22 C 0,8 8,0 24,0 Z";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, setTheme } = useTheme();
  const isArrakis = theme === "arrakis";

  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

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
    <header
      className={`fixed top-1 sm:top-1.5 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none select-none transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-8 invisible"
      }`}
    >
      <div className="group/navbar relative w-[96%] max-w-[1100px] lg:max-w-[1150px] xl:max-w-[1200px] hover:max-w-[1180px] lg:hover:max-w-[1240px] xl:hover:max-w-[1290px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto">
        {/* SVG Mecha HUD Frame with Live Moving Neon Laser Border */}
        <svg
          className="absolute inset-0 w-full h-[54px] sm:h-[62px] pointer-events-none -z-10 transition-all duration-500 group-hover/navbar:brightness-115"
          style={{
            filter: isArrakis
              ? "drop-shadow(0 0 10px rgba(245, 158, 11, 0.7)) drop-shadow(0 0 24px rgba(217, 119, 6, 0.45))"
              : "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7)) drop-shadow(0 0 24px rgba(220, 38, 38, 0.45))",
          }}
          viewBox="0 0 1200 76"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Deep basalt dark glass fill with subtle warm gradient */}
            <linearGradient id="hud-bg-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#100b07" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#080604" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#130d07" stopOpacity="0.96" />
            </linearGradient>

            {/* High-Impact Radiant Neon Edge Halo */}
            <filter id="neon-subtle-aura" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Crisp Laser Beam Glow */}
            <filter id="neon-crisp-beam" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blurCore" />
              <feGaussianBlur stdDeviation="4.5" result="blurMid" />
              <feMerge>
                <feMergeNode in="blurMid" />
                <feMergeNode in="blurCore" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Backdrop Glass Fill with curved corners */}
          <path
            d={NAVBAR_PATH}
            fill="url(#hud-bg-fill)"
            className="backdrop-blur-xl"
          />

          {/* Base Frame Border */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={isArrakis ? "rgba(245, 158, 11, 0.45)" : "rgba(239, 68, 68, 0.45)"}
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Flowing Radiant Outer Aura */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={isArrakis ? "#F59E0B" : "#FF1E27"}
            strokeWidth="5.5"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-subtle-aura)"
            className="animate-neon-border"
          />

          {/* Flowing Saturated Mid Beam */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={isArrakis ? "#FBBF24" : "#EF4444"}
            strokeWidth="3"
            strokeOpacity="0.95"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-crisp-beam)"
            className="animate-neon-border"
          />

          {/* Flowing Hot Theme Core Filament (NO WHITE) */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={isArrakis ? "#D97706" : "#DC2626"}
            strokeWidth="1.8"
            strokeOpacity="1"
            vectorEffect="non-scaling-stroke"
            className="animate-neon-border"
          />
        </svg>

        {/* Bottom Center Solar Beacon Flare */}
        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3.5 rounded-t-full blur-[3px] pointer-events-none transition-all duration-500 group-hover/navbar:w-24 group-hover/navbar:blur-[4px] ${
            isArrakis
              ? "bg-gradient-to-t from-amber-400/80 via-amber-500/40 to-transparent"
              : "bg-gradient-to-t from-white/80 via-white/40 to-transparent"
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white pointer-events-none animate-pulse ${
            isArrakis ? "shadow-[0_0_12px_#ffd700]" : "shadow-[0_0_12px_#ffffff]"
          }`}
        />

        {/* Inner Content Bar */}
        <div className="relative flex h-[50px] sm:h-[58px] items-center justify-between px-3 sm:px-6">
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
              onClick={() => setTheme("giedi-prime")}
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>EVENTS</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/ambassador"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>AMBASSADOR</span>
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
                    : "bg-gradient-to-br from-[#ffffff] via-[#888888] to-[#121212] shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                }`}
              />

              {/* State Text */}
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold text-[#f8eed9] uppercase">
                {isArrakis ? "ARRAKIS // 1.0" : "GIEDI // MONO"}
              </span>
            </button>

            {/* INITIALIZE PASS Chamfered Mecha Button */}
            <Link href="/dashboard" className="hidden sm:inline-block">
              <button
                type="button"
                className={`clip-mecha-btn relative px-4 sm:px-5 py-2 font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.22em] uppercase transition-all active:scale-95 ${
                  isArrakis
                    ? "text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_rgba(212,168,67,0.65)]"
                    : "text-white bg-gradient-to-r from-white/20 via-white/10 to-transparent border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.7)]"
                }`}
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
                onClick={() => {
                  setTheme("giedi-prime");
                  setMobileMenuOpen(false);
                }}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // EVENTS
              </Link>
              <Link
                href="/ambassador"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                // AMBASSADOR
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

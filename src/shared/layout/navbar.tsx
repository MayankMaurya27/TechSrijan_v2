"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/core";
import { Menu, X } from "lucide-react";

const SESSION_KEY = "techsrijan_intro_video_played";

const THEME_CYCLE = [
  "arrakis-day",
  "krelln-night",
  "geass-moon",
] as const;

const NAVBAR_PATH =
  "M 24,0 L 1176,0 C 1192,0 1200,8 1200,22 L 1200,42 C 1200,56 1192,64 1176,64 L 760,64 C 752,64 746,67 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 C 454,67 448,64 440,64 L 24,64 C 8,64 0,56 0,42 L 0,22 C 0,8 8,0 24,0 Z";

const THEME_CONFIG = {
  "arrakis-day": {
    label: "Arrakis Day",
    title: "Arrakis Solar Day (Canopus Glare & Spice Ridge)",
    orbClass: "bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#78350F] shadow-[0_0_12px_#F59E0B]",
    laserStrokeAura: "#F59E0B",
    laserStrokeMid: "#FBBF24",
    laserStrokeBeam: "#D97706",
    laserStrokeCore: "#F59E0B",
    frameStroke: "rgba(245, 158, 11, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#F59E0B]/85 via-[#F59E0B]/40 to-transparent",
    beaconShadow: "shadow-[0_0_14px_#F59E0B,0_0_28px_rgba(245,158,11,0.8)]",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.7)) drop-shadow(0 0 24px rgba(217, 119, 6, 0.45))",
  },
  "krelln-night": {
    label: "Krelln Night",
    title: "Arrakis Night Krelln (Moonlit Dust & Stark Silver)",
    orbClass: "bg-gradient-to-br from-[#FFFFFF] via-[#CBD5E1] to-[#1E293B] shadow-[0_0_12px_#CBD5E1]",
    laserStrokeAura: "#94A3B8",
    laserStrokeMid: "#CBD5E1",
    laserStrokeBeam: "#64748B",
    laserStrokeCore: "#CBD5E1",
    frameStroke: "rgba(148, 163, 184, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#CBD5E1]/85 via-[#94A3B8]/40 to-transparent",
    beaconShadow: "shadow-[0_0_14px_#CBD5E1,0_0_28px_rgba(203,213,225,0.8)]",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(148, 163, 184, 0.65)) drop-shadow(0 0 24px rgba(100, 116, 139, 0.4))",
  },
  "geass-moon": {
    label: "Geass Moon",
    title: "Geass Moon (Piercing Glow & Core Crimson)",
    orbClass: "bg-gradient-to-br from-[#FF2A36] via-[#DC2626] to-[#450A0A] shadow-[0_0_12px_#FF1E27]",
    laserStrokeAura: "#FF1E27",
    laserStrokeMid: "#EF4444",
    laserStrokeBeam: "#DC2626",
    laserStrokeCore: "#FF1E27",
    frameStroke: "rgba(239, 68, 68, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#FF1E27]/85 via-[#DC2626]/40 to-transparent",
    beaconShadow: "shadow-[0_0_14px_#FF1E27,0_0_28px_rgba(255,30,39,0.8)]",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7)) drop-shadow(0 0 24px rgba(220, 38, 38, 0.45))",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  const currentThemeConfig =
    THEME_CONFIG[theme as keyof typeof THEME_CONFIG] || THEME_CONFIG["arrakis-day"];

  const toggleTheme = () => {
    const normalized =
      theme === "arrakis"
        ? "arrakis-day"
        : theme === "giedi-prime"
          ? "geass-moon"
          : (theme as (typeof THEME_CYCLE)[number]);
    const currentIndex = THEME_CYCLE.indexOf(normalized);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  };

  return (
    <header
      className={`fixed top-2 sm:top-2.5 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none select-none transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-8 invisible"
      }`}
    >
      <div className="group/navbar relative w-[96%] max-w-[1100px] lg:max-w-[1150px] xl:max-w-[1200px] hover:max-w-[1180px] lg:hover:max-w-[1240px] xl:hover:max-w-[1290px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto">
        <svg
          className="absolute inset-0 w-full h-[54px] sm:h-[62px] pointer-events-none -z-10 transition-all duration-500 group-hover/navbar:brightness-115"
          style={{ filter: currentThemeConfig.ambientChassisGlow }}
          viewBox="0 0 1200 76"
          preserveAspectRatio="none"
        >
          <defs>
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

          {/* Solid Chassis Background Fill with Curved Corners */}
          <path
            d={NAVBAR_PATH}
            fill="url(#hud-bg-fill)"
          />

          {/* Base Frame Border */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={currentThemeConfig.frameStroke}
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Flowing Radiant Outer Aura (Theme Color) */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={currentThemeConfig.laserStrokeAura}
            strokeWidth="5.5"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-subtle-aura)"
            className="animate-neon-border"
          />

          {/* Flowing Saturated Mid Beam (Theme Color) */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={currentThemeConfig.laserStrokeMid}
            strokeWidth="3"
            strokeOpacity="0.95"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-crisp-beam)"
            className="animate-neon-border"
          />

          {/* Flowing Hot Theme Core Filament (Pure Theme Color - NO WHITE) */}
          <path
            d={NAVBAR_PATH}
            fill="none"
            stroke={currentThemeConfig.laserStrokeCore}
            strokeWidth="1.8"
            strokeOpacity="1"
            vectorEffect="non-scaling-stroke"
            className="animate-neon-border"
          />
        </svg>

        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-t-full blur-[3px] pointer-events-none transition-all duration-500 group-hover/navbar:w-22 ${currentThemeConfig.flareGradient}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary,#d4a843)] pointer-events-none animate-pulse ${currentThemeConfig.beaconShadow}`}
        />

        <div className="relative flex h-[50px] sm:h-[58px] items-center justify-between px-3 sm:px-6">
          <div className="flex items-center flex-shrink-0 mr-2 sm:mr-3">
            <Link href="/" className="group relative flex items-center" aria-label="TechSrijan Home">
              {/* Luminous Logo */}
              <img
                src="/images/TS LOGO NEW.png"
                alt="TechSrijan Logo"
                className="relative h-7 w-auto sm:h-8 object-contain brightness-110 transition-all duration-300 group-hover:scale-105 group-hover:brightness-125"
                style={{
                  filter: `drop-shadow(0 0 4px ${currentThemeConfig.laserStrokeAura})`,
                }}
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 group-hover/navbar:gap-2 xl:group-hover/navbar:gap-3 transition-all duration-500 font-sans text-[9px] xl:text-[10px] 2xl:text-[10.5px] tracking-[0.11em] xl:tracking-[0.15em] text-[#d6c7b2]">
            <Link
              href="/about"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>About</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/events"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Events</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/guests"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Guests</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/team"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Team</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/sponsors"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Sponsors</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/ambassador"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Ambassador</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/accommodation"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Stay</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/developers"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Developers</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.25)] select-none text-[8px] xl:text-[9px]">|</span>

            <Link
              href="/contact"
              className="px-1 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group whitespace-nowrap"
            >
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-[rgba(212,168,67,0.45)] bg-black/60 shadow-[0_0_12px_rgba(212,168,67,0.18)] hover:border-[var(--accent-primary,#d4a843)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title={`Active Theme: ${currentThemeConfig.title} (Click to cycle)`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 relative flex-shrink-0 ${currentThemeConfig.orbClass}`}
              />

              <span className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.18em] font-semibold text-[#f8eed9] uppercase">
                {currentThemeConfig.label}
              </span>
            </button>

            <Link
              href="/dashboard"
              className="hidden sm:inline-block clip-mecha-btn relative px-3 sm:px-4 py-1.5 font-sans font-bold text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_rgba(212,168,67,0.65)] transition-all active:scale-95 text-center whitespace-nowrap"
            >
              Login/Sign Up
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-7 w-7 items-center justify-center rounded border border-[rgba(212,168,67,0.4)] bg-black/60 text-[#f8eed9] hover:text-[var(--accent-primary,#d4a843)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-2 rounded-lg border border-[rgba(212,168,67,0.4)] bg-[#0c0805]/95 backdrop-blur-2xl p-5 shadow-2xl">
            <div className="flex flex-col gap-4 font-sans text-xs tracking-[0.2em] text-[#d6c7b2]">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                About
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Events
              </Link>
              <Link
                href="/guests"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Guests
              </Link>
              <Link
                href="/team"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Team
              </Link>
              <Link
                href="/sponsors"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Sponsors
              </Link>
              <Link
                href="/ambassador"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Ambassador
              </Link>
              <Link
                href="/accommodation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Stay
              </Link>
              <Link
                href="/developers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Developers
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Contact
              </Link>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="clip-mecha-btn block w-full py-2.5 font-sans font-bold text-xs tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] to-[rgba(212,168,67,0.08)] border border-[var(--accent-primary,#d4a843)] text-center"
                >
                  Login/Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

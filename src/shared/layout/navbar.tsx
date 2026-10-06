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
  "avron-night",
  "geass-moon",
] as const;

const THEME_CONFIG = {
  "arrakis-day": {
    label: "Arrakis Day",
    title: "Arrakis Solar Day (Canopus Glare & Spice Ridge)",
    orbClass: "bg-gradient-to-br from-[#F0EAE1] via-[#C47D48] to-[#4B3629] shadow-[0_0_8px_#C47D48]",
    laserStrokeAura: "#C47D48",
    laserStrokeBeam: "#F0EAE1",
    frameStroke: "rgba(196, 125, 72, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#C47D48]/80 via-[#C47D48]/40 to-transparent",
    beaconShadow: "shadow-[0_0_12px_#C47D48]",
  },
  "krelln-night": {
    label: "Krelln Night",
    title: "Arrakis Night Krelln (Moonlit Dust & Stark Silver)",
    orbClass: "bg-gradient-to-br from-[#D7DBE2] via-[#778292] to-[#1A1D21] shadow-[0_0_8px_#778292]",
    laserStrokeAura: "#778292",
    laserStrokeBeam: "#D7DBE2",
    frameStroke: "rgba(119, 130, 146, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#778292]/80 via-[#778292]/40 to-transparent",
    beaconShadow: "shadow-[0_0_12px_#D7DBE2]",
  },
  "avron-night": {
    label: "Avron Night",
    title: "Arrakis Night Avron (Eyes of Ibad Melange Glow)",
    orbClass: "bg-gradient-to-br from-[#B3B0B7] via-[#5793CE] to-[#221B2A] shadow-[0_0_8px_#5793CE]",
    laserStrokeAura: "#5793CE",
    laserStrokeBeam: "#8EB7E5",
    frameStroke: "rgba(87, 147, 206, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#5793CE]/80 via-[#5793CE]/40 to-transparent",
    beaconShadow: "shadow-[0_0_12px_#5793CE]",
  },
  "geass-moon": {
    label: "Geass Moon",
    title: "Geass Moon (Piercing Glow & Core Crimson)",
    orbClass: "bg-gradient-to-br from-[#FF1E27] via-[#C80014] to-[#0B0408] shadow-[0_0_8px_#FF1E27]",
    laserStrokeAura: "#FF1E27",
    laserStrokeBeam: "#FFA6AC",
    frameStroke: "rgba(255, 30, 39, 0.45)",
    flareGradient: "bg-gradient-to-t from-[#FF1E27]/80 via-[#C80014]/40 to-transparent",
    beaconShadow: "shadow-[0_0_12px_#FF1E27]",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(true);
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const hasPlayed = sessionStorage.getItem(SESSION_KEY);
        if (hasPlayed) {
          setIsVisible(true);
          return;
        }
      } catch {
      }
    }

    setIsVisible(false);

    const handleIntroComplete = () => {
      setIsVisible(true);
    };

    window.addEventListener("intro-complete", handleIntroComplete);

    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => {
      window.removeEventListener("intro-complete", handleIntroComplete);
      clearTimeout(fallbackTimer);
    };
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
      className={`fixed top-1 sm:top-1.5 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none select-none transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-8 invisible"
      }`}
    >
      <div className="relative w-full max-w-full px-2 sm:px-4 pointer-events-auto">
        <svg
          className="absolute inset-0 w-full h-[62px] sm:h-[72px] pointer-events-none -z-10"
          viewBox="0 0 1200 76"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hud-bg-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#120d08" stopOpacity="0.94" />
              <stop offset="50%" stopColor="#080604" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#150e07" stopOpacity="0.95" />
            </linearGradient>

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

          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="url(#hud-bg-fill)"
          />

          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={currentThemeConfig.frameStroke}
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={currentThemeConfig.laserStrokeAura}
            strokeWidth="6"
            strokeOpacity="0.45"
            vectorEffect="non-scaling-stroke"
            className="animate-neon-border"
          />

          <path
            d="M 16,0 L 1184,0 L 1200,16 L 1200,48 L 1184,64 L 760,64 L 740,74 L 635,74 C 620,62 580,62 565,74 L 460,74 L 440,64 L 16,64 L 0,48 L 0,16 Z"
            fill="none"
            stroke={currentThemeConfig.laserStrokeBeam}
            strokeWidth="3.6"
            strokeOpacity="1"
            vectorEffect="non-scaling-stroke"
            filter="url(#neon-beam-glow)"
            className="animate-neon-border"
          />

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

        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-full blur-[3px] pointer-events-none ${currentThemeConfig.flareGradient}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white pointer-events-none animate-pulse ${currentThemeConfig.beaconShadow}`}
        />

        <div className="relative flex h-[54px] sm:h-[64px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <Link href="/" className="group relative flex items-center" aria-label="TechSrijan Home">
              {/* Ambient radial neon aura behind logo */}
              <div
                className="absolute -inset-1 rounded-full blur-[10px] opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${currentThemeConfig.laserStrokeAura} 0%, transparent 70%)`,
                }}
              />

              {/* Luminous Logo with dual-layer neon drop-shadow */}
              <img
                src="/images/TS LOGO NEW.png"
                alt="TechSrijan Logo"
                className="relative h-8 w-auto sm:h-9 object-contain brightness-110 transition-all duration-300 group-hover:scale-105 group-hover:brightness-125"
                style={{
                  filter: `drop-shadow(0 0 2px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 6px ${currentThemeConfig.laserStrokeAura}) drop-shadow(0 0 14px ${currentThemeConfig.laserStrokeAura})`,
                }}
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 font-sans text-[11px] xl:text-xs tracking-[0.22em] text-[#d6c7b2]">
            <Link
              href="/events"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Events</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/sponsors"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Sponsors</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/ambassador"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Ambassador</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/accommodation"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Stay</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/developers"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Developers</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>

            <span className="text-[rgba(212,168,67,0.3)] select-none">|</span>

            <Link
              href="/contact"
              className="px-1.5 py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-colors relative group"
            >
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[var(--accent-primary,#d4a843)] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-[rgba(212,168,67,0.45)] bg-black/60 shadow-[0_0_12px_rgba(212,168,67,0.18)] hover:border-[var(--accent-primary,#d4a843)] transition-all active:scale-95 cursor-pointer"
              title={`Active Theme: ${currentThemeConfig.title} (Click to cycle)`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-500 relative flex-shrink-0 ${currentThemeConfig.orbClass}`}
              />

              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold text-[#f8eed9] uppercase">
                {currentThemeConfig.label}
              </span>
            </button>

            <Link
              href="/dashboard"
              className="hidden sm:inline-block clip-mecha-btn relative px-4 sm:px-5 py-2 font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_rgba(212,168,67,0.65)] transition-all active:scale-95 text-center"
            >
              Login/Sign Up
            </Link>

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

        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-2 rounded-lg border border-[rgba(212,168,67,0.4)] bg-[#0c0805]/95 backdrop-blur-2xl p-5 shadow-2xl">
            <div className="flex flex-col gap-4 font-sans text-xs tracking-[0.2em] text-[#d6c7b2]">
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)]"
              >
                Events
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

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/core";
import { Menu, X, Home, Calendar, Users, Hotel, Layers } from "lucide-react";

const THEME_CYCLE = [
  "arrakis-day",
  "krelln-night",
  "geass-moon",
] as const;

// Mathematically calibrated pill path (width: 1020, height: 52, radius: 24, safe insets: 2px)
const PILL_PATH =
  "M 26,2 L 994,2 A 24,24 0 0 1 1018,26 A 24,24 0 0 1 994,50 L 26,50 A 24,24 0 0 1 2,26 A 24,24 0 0 1 26,2 Z";

const THEME_CONFIG = {
  "arrakis-day": {
    label: "Arrakis Day",
    shortLabel: "Day",
    title: "Arrakis Solar Day (Canopus Glare & Spice Ridge)",
    orbClass: "bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#78350F] shadow-[0_0_12px_#F59E0B]",
    laserStrokeAura: "#F59E0B",
    laserStrokeMid: "#FBBF24",
    laserStrokeBeam: "#D97706",
    laserStrokeCore: "#F59E0B",
    frameStroke: "rgba(245, 158, 11, 0.45)",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.7)) drop-shadow(0 0 24px rgba(217, 119, 6, 0.45))",
  },
  "krelln-night": {
    label: "Krelln Night",
    shortLabel: "Night",
    title: "Arrakis Night Krelln (Moonlit Dust & Stark Silver)",
    orbClass: "bg-gradient-to-br from-[#FFFFFF] via-[#CBD5E1] to-[#1E293B] shadow-[0_0_12px_#CBD5E1]",
    laserStrokeAura: "#94A3B8",
    laserStrokeMid: "#CBD5E1",
    laserStrokeBeam: "#64748B",
    laserStrokeCore: "#CBD5E1",
    frameStroke: "rgba(148, 163, 184, 0.45)",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(148, 163, 184, 0.65)) drop-shadow(0 0 24px rgba(100, 116, 139, 0.4))",
  },
  "geass-moon": {
    label: "Geass Moon",
    shortLabel: "Moon",
    title: "Geass Moon (Piercing Glow & Core Crimson)",
    orbClass: "bg-gradient-to-br from-[#FF2A36] via-[#DC2626] to-[#450A0A] shadow-[0_0_12px_#FF1E27]",
    laserStrokeAura: "#FF1E27",
    laserStrokeMid: "#EF4444",
    laserStrokeBeam: "#DC2626",
    laserStrokeCore: "#FF1E27",
    frameStroke: "rgba(239, 68, 68, 0.45)",
    ambientChassisGlow: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7)) drop-shadow(0 0 24px rgba(220, 38, 38, 0.45))",
  },
};

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/guests", label: "Guests" },
  { href: "/team", label: "Team" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/ambassador", label: "Ambassador" },
  { href: "/accommodation", label: "Stay" },
  { href: "/developers", label: "Developers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
    setMobileMenuOpen(false);
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
    <>
      {/* =========================================================
          MOBILE TOP HEADER (IIT Bombay Techfest Level)
          - Left: Hamburger Menu Button + TechSrijan Logo
          - Right: Theme Orb Switcher + SIGN IN Button
          - Pure floating overlay (no extra height or width)
          ========================================================= */}
      <header
        className={`lg:hidden fixed top-2.5 sm:top-3 inset-x-0 z-50 pointer-events-none select-none px-3 sm:px-5 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-8 invisible"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Mobile Left: Hamburger + TechSrijan Logo */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(212,168,67,0.45)] bg-black/85 backdrop-blur-md text-[#f8eed9] hover:text-[var(--accent-primary,#d4a843)] hover:border-[var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 shadow-[0_0_12px_rgba(0,0,0,0.7)] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>

            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-105 active:scale-95"
              aria-label="TechSrijan Home"
            >
              <img
                src="/images/TS LOGO NEW.png"
                alt="TechSrijan Logo"
                className="h-9 sm:h-9.5 w-auto object-contain brightness-110 group-hover:brightness-125 transition-all duration-300"
                style={{
                  filter: `drop-shadow(0 0 6px ${currentThemeConfig.laserStrokeAura})`,
                }}
              />
            </Link>
          </div>

          {/* Mobile Right: Theme Orb Switcher + SIGN IN Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,168,67,0.45)] bg-black/85 backdrop-blur-md shadow-[0_0_10px_rgba(0,0,0,0.6)] hover:border-[var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 cursor-pointer"
              title={`Active Theme: ${currentThemeConfig.title} (Click to cycle)`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full relative flex-shrink-0 ${currentThemeConfig.orbClass}`}
              />
            </button>

            <Link
              href="/dashboard"
              className="clip-mecha-btn relative px-3 py-1.5 font-mono font-bold text-[9.5px] tracking-[0.16em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.25)] via-[rgba(212,168,67,0.12)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_12px_rgba(212,168,67,0.25)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_20px_var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-1"
            >
              <span className="relative z-10">SIGN IN</span>
              <span className="relative z-10 opacity-70 text-[9px]">↗</span>
            </Link>
          </div>
        </div>

        {/* Mobile Full Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mt-2.5 rounded-xl border border-[rgba(212,168,67,0.35)] bg-[#0b0805]/95 backdrop-blur-2xl p-5 shadow-2xl transition-all duration-300 pointer-events-auto animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2 font-sans text-xs tracking-[0.18em] text-[#d6c7b2]">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-3 rounded-lg uppercase font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-[rgba(212,168,67,0.18)] text-[var(--accent-primary,#d4a843)] font-semibold border-l-2 border-[var(--accent-primary,#d4a843)]"
                        : "hover:bg-white/5 hover:text-[var(--accent-primary,#d4a843)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-[10px] font-mono text-[var(--accent-primary,#d4a843)]">●</span>}
                  </Link>
                );
              })}
              <div className="pt-3 mt-1 border-t border-[rgba(212,168,67,0.2)] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-[rgba(212,168,67,0.3)] bg-white/5 text-[#f8eed9] font-mono text-xs uppercase cursor-pointer"
                >
                  <span>Active Theme</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentThemeConfig.orbClass}`} />
                    <span className="font-semibold">{currentThemeConfig.label}</span>
                  </div>
                </button>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="clip-mecha-btn block w-full py-2.5 font-mono font-bold text-xs tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.25)] to-[rgba(212,168,67,0.08)] border border-[var(--accent-primary,#d4a843)] text-center shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black transition-all"
                >
                  SIGN IN ↗
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          DESKTOP HEADER (lg and above)
          - Left Corner: TechSrijan Logo
          - Center: Smooth Neon Glow Pill Navbar (Centered in Overall Screen Width)
          - Right Corner: Futuristic SIGN IN Button
          - Pure floating overlay (no extra height or width)
          ========================================================= */}
      <header
        className={`hidden lg:block fixed top-2.5 sm:top-3 inset-x-0 z-50 pointer-events-none select-none px-6 md:px-8 xl:px-10 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-8 invisible"
        }`}
      >
        <div className="w-full relative flex items-center justify-between min-h-[48px] xl:min-h-[52px]">
          {/* Desktop Left Corner: TechSrijan Logo */}
          <div className="flex items-center flex-shrink-0 pointer-events-auto z-10">
            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-105 active:scale-95 py-0.5"
              aria-label="TechSrijan Home"
            >
              <div className="relative flex items-center">
                <div
                  className="absolute -inset-1 rounded-full blur-md opacity-35 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: currentThemeConfig.laserStrokeAura }}
                />
                <img
                  src="/images/TS LOGO NEW.png"
                  alt="TechSrijan Logo"
                  className="relative h-9.5 xl:h-10.5 2xl:h-11 w-auto object-contain brightness-110 group-hover:brightness-125 transition-all duration-300"
                  style={{
                    filter: `drop-shadow(0 0 6px ${currentThemeConfig.laserStrokeAura})`,
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Center: Exactly Centered in Overall Screen Width with Proportional Width */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto z-0">
            <div className="group/navbar relative w-[880px] lg:w-[940px] xl:w-[1020px] 2xl:w-[1080px]">
              <svg
                className="absolute inset-0 w-full h-[48px] xl:h-[52px] pointer-events-none -z-10 transition-all duration-500 group-hover/navbar:brightness-115 overflow-visible"
                style={{ filter: currentThemeConfig.ambientChassisGlow, overflow: "visible" }}
                viewBox="0 0 1020 52"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hud-bg-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#100b07" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#080604" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="#130d07" stopOpacity="0.96" />
                  </linearGradient>

                  {/* High-Impact Radiant Neon Edge Halo */}
                  <filter id="neon-subtle-aura" x="-100%" y="-200%" width="300%" height="500%">
                    <feGaussianBlur stdDeviation="5" result="blur1" />
                    <feGaussianBlur stdDeviation="10" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Crisp Laser Beam Glow */}
                  <filter id="neon-crisp-beam" x="-100%" y="-200%" width="300%" height="500%">
                    <feGaussianBlur stdDeviation="2.5" result="blurCore" />
                    <feGaussianBlur stdDeviation="6" result="blurMid" />
                    <feMerge>
                      <feMergeNode in="blurMid" />
                      <feMergeNode in="blurCore" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Smooth Pill Background Fill */}
                <path
                  d={PILL_PATH}
                  fill="url(#hud-bg-fill)"
                />

                {/* Continuous Base Glowing Chassis Border */}
                <path
                  d={PILL_PATH}
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeAura}
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={PILL_PATH}
                  fill="none"
                  stroke={currentThemeConfig.frameStroke}
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Flowing Radiant Outer Aura */}
                <path
                  d={PILL_PATH}
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeAura}
                  strokeWidth="5.5"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#neon-subtle-aura)"
                  className="animate-neon-border"
                />

                {/* Flowing Saturated Mid Beam */}
                <path
                  d={PILL_PATH}
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeMid}
                  strokeWidth="3"
                  strokeOpacity="0.95"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#neon-crisp-beam)"
                  className="animate-neon-border"
                />

                {/* Flowing Hot Theme Core Filament */}
                <path
                  d={PILL_PATH}
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeCore}
                  strokeWidth="1.8"
                  strokeOpacity="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className="animate-neon-border"
                />
              </svg>

              {/* Links and Theme Changer inside the Smooth Pill Navbar */}
              <div className="relative flex h-[48px] xl:h-[52px] items-center justify-center px-6 xl:px-8">
                <nav className="flex items-center gap-1.5 xl:gap-2.5 font-sans text-[10px] lg:text-[10.5px] xl:text-[11px] 2xl:text-[11.5px] tracking-[0.11em] xl:tracking-[0.13em] text-[#d6c7b2]">
                  {NAV_LINKS.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href} className="flex items-center">
                        {index > 0 && (
                          <span className="text-[rgba(212,168,67,0.25)] select-none text-[8.5px] xl:text-[9.5px] mx-0.5 xl:mx-1">
                            |
                          </span>
                        )}
                        <Link
                          href={item.href}
                          className={`px-1.5 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-all duration-300 relative group whitespace-nowrap ${
                            isActive ? "text-[var(--accent-primary,#d4a843)] font-semibold" : ""
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`absolute bottom-0 left-0 h-[1.5px] bg-[var(--accent-primary,#d4a843)] transition-all duration-300 ${
                              isActive ? "w-full" : "w-0 group-hover:w-full"
                            }`}
                          />
                        </Link>
                      </div>
                    );
                  })}

                  {/* Separator before Theme Toggle */}
                  <span className="text-[rgba(212,168,67,0.25)] select-none text-[8.5px] xl:text-[9.5px] mx-1 xl:mx-1.5">
                    |
                  </span>

                  {/* Theme Orb Button (Symmetrically Positioned Inside Nav with Safe Margins) */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center justify-center h-6 w-6 xl:h-6.5 xl:w-6.5 rounded-full border border-[rgba(212,168,67,0.45)] bg-black/75 shadow-[0_0_12px_rgba(212,168,67,0.25)] hover:border-[var(--accent-primary,#d4a843)] hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0 ml-0.5"
                    title={`Active Theme: ${currentThemeConfig.title} (Click to cycle)`}
                    aria-label={`Cycle Theme: Currently ${currentThemeConfig.label}`}
                  >
                    <div
                      className={`w-3 h-3 xl:w-3.5 xl:h-3.5 rounded-full transition-all duration-300 relative flex-shrink-0 ${currentThemeConfig.orbClass}`}
                    />
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Desktop Right Corner: SIGN IN Button */}
          <div className="flex items-center flex-shrink-0 pointer-events-auto z-10">
            <Link
              href="/dashboard"
              className="clip-mecha-btn relative px-3.5 xl:px-4 py-1.5 xl:py-2 font-mono font-bold text-[9.5px] xl:text-[10.5px] tracking-[0.2em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-1.5 group"
            >
              <span className="relative z-10">SIGN IN</span>
              <span className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-[9px]">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION DOCK (IIT Bombay Techfest Level)
          ========================================================= */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-50 pointer-events-auto">
        <nav className="grid grid-cols-5 w-full items-center py-1.5 px-1 rounded-2xl border border-[rgba(212,168,67,0.35)] bg-[#070503]/92 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${
              pathname === "/" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="font-mono text-[8px] tracking-[0.08em] uppercase font-medium">Home</span>
          </Link>
          <Link
            href="/events"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${
              pathname === "/events" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="font-mono text-[8px] tracking-[0.08em] uppercase font-medium">Events</span>
          </Link>
          <Link
            href="/team"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${
              pathname === "/team" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="font-mono text-[8px] tracking-[0.08em] uppercase font-medium">Team</span>
          </Link>
          <Link
            href="/accommodation"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${
              pathname === "/accommodation" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
            }`}
          >
            <Hotel className="h-4 w-4" />
            <span className="font-mono text-[8px] tracking-[0.08em] uppercase font-medium">Stay</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mobileMenuOpen ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="font-mono text-[8px] tracking-[0.08em] uppercase font-medium">Menu</span>
          </button>
        </nav>
      </div>
    </>
  );
}

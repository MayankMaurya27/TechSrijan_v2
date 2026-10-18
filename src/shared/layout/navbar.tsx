"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme, useAuth, normalizeTheme } from "@/core";
import { useAuthModal } from "@/domains/auth/context/auth-modal-context";
import {
  Menu,
  X,
  Home,
  Calendar,
  Code2,
  Hotel,
  Layers,
  Award,
  Handshake,
  Compass,
  ChevronDown,
  User,
  LogOut,
  Shield,
} from "lucide-react";

const THEME_CYCLE = [
  "arrakis-day",
  "krelln-night",
  "geass-moon",
] as const;


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
  { href: "/developers", label: "Developers" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/ambassador", label: "Ambassador" },
  { href: "/accommodation", label: "Stay" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useAuthModal();

  const hasProfile = isAuthenticated || Boolean(user);

  // Exact border pill curvature tracking to keep traveling laser lines strictly on the border
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillRadius, setPillRadius] = useState(26);

  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const updateRadius = () => {
      if (el.offsetHeight > 0) {
        setPillRadius(el.offsetHeight / 2);
      }
    };
    updateRadius();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateRadius);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  if (
    pathname === "/signup" ||
    pathname === "/signin" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const currentCanonical = normalizeTheme(resolvedTheme || theme);
  const currentThemeConfig =
    THEME_CONFIG[currentCanonical] || THEME_CONFIG["arrakis-day"];

  const toggleTheme = () => {
    const activeCanonical = normalizeTheme(resolvedTheme || theme);
    const currentIndex = THEME_CYCLE.indexOf(activeCanonical);
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
        className={`xl:hidden fixed top-2.5 sm:top-3 inset-x-0 z-50 pointer-events-none select-none px-3 sm:px-5 transition-all duration-700 ease-out ${isVisible
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
                  filter: `drop-shadow(0 0 6px ${currentThemeConfig.laserStrokeAura}73)`,
                }}
              />
            </Link>
          </div>

          {/* Mobile Right: Theme Orb Switcher + SIGN IN Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border bg-black/85 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer"
              style={{
                borderColor: currentThemeConfig.frameStroke,
                boxShadow: `0 0 10px ${currentThemeConfig.laserStrokeAura}33`,
              }}
              title={`Active Theme: ${currentThemeConfig.title} (Click to cycle)`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full relative flex-shrink-0 ${currentThemeConfig.orbClass}`}
              />
            </button>

            {hasProfile || pathname === "/profile" ? (
              <Link
                href="/profile"
                className="clip-mecha-btn relative px-3 py-1.5 font-mono font-bold text-[9.5px] tracking-[0.16em] uppercase text-[#f8eed9] bg-[rgba(212,168,67,0.25)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_12px_rgba(212,168,67,0.25)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="relative z-10">PROFILE</span>
                <span className="relative z-10 opacity-70 text-[9px]">→</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="clip-mecha-btn relative px-3 py-1.5 font-mono font-bold text-[9.5px] tracking-[0.16em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.25)] via-[rgba(212,168,67,0.12)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_12px_rgba(212,168,67,0.25)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_20px_var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="relative z-10">SIGN IN</span>
                <span className="relative z-10 opacity-70 text-[9px]">↗</span>
              </button>
            )}
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
                    className={`py-2 px-3 rounded-lg uppercase font-medium flex items-center justify-between transition-colors ${isActive
                        ? "bg-[rgba(212,168,67,0.18)] text-[var(--accent-primary,#d4a843)] font-semibold border-l-2 border-[var(--accent-primary,#d4a843)]"
                        : "hover:bg-white/5 hover:text-[var(--accent-primary,#d4a843)]"
                      }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-[10px] font-mono text-[var(--accent-primary,#d4a843)]">●</span>}
                  </Link>
                );
              })}
              {hasProfile ? (
                <div className="pt-3 mt-1 border-t border-[rgba(212,168,67,0.2)] flex flex-col gap-2">
                  <div className="px-3 py-2.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Signed in as</p>
                    <p className="font-sans text-xs font-bold text-white truncate">{user?.name || "Participant"}</p>
                    {user?.email && <p className="font-mono text-[10px] text-neutral-400 truncate mt-0.5">{user.email}</p>}
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.15)] text-[var(--accent-primary,#d4a843)] font-mono text-xs uppercase font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>MY PROFILE</span>
                    </div>
                    <span>→</span>
                  </Link>

                  {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "BOSS") && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-400 font-mono text-xs uppercase font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>ADMIN CONSOLE</span>
                      </div>
                      <span>→</span>
                    </Link>
                  )}

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

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 font-mono font-bold text-xs tracking-[0.2em] uppercase text-red-400 hover:text-white bg-red-950/30 hover:bg-red-900/50 border border-red-800/50 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOG OUT</span>
                  </button>
                </div>
              ) : (
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
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="clip-mecha-btn block w-full py-2.5 font-mono font-bold text-xs tracking-[0.22em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.25)] to-[rgba(212,168,67,0.08)] border border-[var(--accent-primary,#d4a843)] text-center shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black transition-all cursor-pointer"
                  >
                    SIGN IN ↗
                  </button>
                </div>
              )}
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
        className={`hidden xl:block fixed top-2.5 sm:top-3 inset-x-0 z-50 pointer-events-none select-none px-4 md:px-6 xl:px-8 transition-all duration-700 ease-out ${isVisible
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-8 invisible"
          }`}
      >
        <div className="w-full relative flex items-center justify-between min-h-[48px] xl:min-h-[52px] gap-3">
          {/* Desktop Left Corner: TechSrijan Logo */}
          <div className="flex items-center flex-shrink-0 min-w-[130px] pointer-events-auto z-20">
            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-105 active:scale-95 py-0.5"
              aria-label="TechSrijan Home"
            >
              <div className="relative flex items-center">
                <div
                  className="absolute -inset-1 rounded-full blur-md opacity-35 group-hover:opacity-75 transition-all duration-500 pointer-events-none"
                  style={{ backgroundColor: currentThemeConfig.frameStroke }}
                />
                <img
                  src="/images/TS LOGO NEW.png"
                  alt="TechSrijan Logo"
                  className="relative h-9.5 xl:h-10.5 2xl:h-11 w-auto object-contain brightness-110 group-hover:brightness-125 transition-all duration-300"
                  style={{
                    filter: `drop-shadow(0 0 6px ${currentThemeConfig.laserStrokeAura}73)`,
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Center: Anti-Collision Flexible Pill */}
          <div className="flex-1 flex items-center justify-center min-w-0 pointer-events-auto z-10 mx-auto px-2">
            <div
              ref={pillRef}
              className="group/navbar relative w-fit max-w-full rounded-full border bg-[#0d0906]/92 backdrop-blur-2xl transition-all duration-500 shadow-2xl"
              style={{
                borderColor: currentThemeConfig.frameStroke,
                boxShadow: `0 0 18px ${currentThemeConfig.laserStrokeAura}33, 0 10px 30px rgba(0,0,0,0.9)`,
              }}
            >
              {/* Dynamic Normalized Traveling Laser Border (Strictly Bound to Pill Perimeter) */}
              <svg
                className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none rounded-full overflow-visible z-0 transition-[filter] duration-500"
                style={{ filter: currentThemeConfig.ambientChassisGlow }}
              >
                <rect
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx={pillRadius}
                  ry={pillRadius}
                  pathLength="100"
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeAura}
                  strokeWidth="3"
                  strokeOpacity="0.5"
                  strokeLinecap="round"
                  className="animate-neon-rect-travel transition-[stroke] duration-500"
                />
                <rect
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx={pillRadius}
                  ry={pillRadius}
                  pathLength="100"
                  fill="none"
                  stroke={currentThemeConfig.laserStrokeCore}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="animate-neon-rect-travel transition-[stroke] duration-500"
                />
              </svg>

              {/* Links and Theme Changer inside the Smooth Pill Navbar */}
              <div className="relative z-10 flex h-[46px] xl:h-[50px] items-center justify-center px-5 lg:px-6 xl:px-7">
                <nav className="flex items-center gap-1 xl:gap-2 font-sans text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.13em] xl:tracking-[0.15em] text-[#d6c7b2]">
                  {NAV_LINKS.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href} className="flex items-center">
                        {index > 0 && (
                          <span className="text-white/20 select-none text-[9.5px] xl:text-[10.5px] mx-1 xl:mx-1.5">
                            |
                          </span>
                        )}
                        <Link
                          href={item.href}
                          className={`px-1.5 xl:px-2 py-0.5 uppercase font-medium hover:text-[var(--accent-primary,#d4a843)] transition-all duration-300 relative group whitespace-nowrap ${isActive ? "text-[var(--accent-primary,#d4a843)] font-semibold" : ""
                            }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`absolute bottom-0 left-0 h-[1.5px] bg-[var(--accent-primary,#d4a843)] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                          />
                        </Link>
                      </div>
                    );
                  })}

                  {/* Separator before Theme Toggle */}
                  <span className="text-white/20 select-none text-[9.5px] xl:text-[10.5px] mx-1 xl:mx-1.5">
                    |
                  </span>

                  {/* Theme Orb Button (Symmetrically Positioned with Safe Inset Clearance) */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center justify-center h-6 w-6 xl:h-6.5 xl:w-6.5 rounded-full border bg-black/75 hover:border-[var(--accent-primary,#d4a843)] hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0 ml-1.5 xl:ml-2"
                    style={{
                      borderColor: currentThemeConfig.frameStroke,
                      boxShadow: `0 0 12px ${currentThemeConfig.laserStrokeAura}33`,
                    }}
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

          {/* Desktop Right Corner: SIGN IN / PROFILE Pill Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0 pointer-events-auto z-10">
            {hasProfile ? (
              <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
                {(user?.role === "ADMIN" ||
                  user?.role === "SUPER_ADMIN" ||
                  user?.role === "BOSS") && (
                    <Link
                      href="/admin"
                      className="clip-mecha-btn px-2.5 xl:px-3 py-1.5 xl:py-2 font-mono text-[9px] xl:text-[9.5px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-all"
                    >
                      ADMIN
                    </Link>
                  )}

                {/* Profile Pill with Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={`clip-mecha-btn relative px-3 xl:px-3.5 py-1.5 xl:py-2 font-mono font-bold text-[9.5px] xl:text-[10px] tracking-[0.16em] uppercase text-[#f8eed9] transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer group ${profileDropdownOpen || pathname === "/profile"
                      ? "bg-[var(--accent-primary,#d4a843)] text-black shadow-[0_0_20px_var(--accent-primary,#d4a843)] border border-[var(--accent-primary,#d4a843)]"
                      : "bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black"
                    }`}
                  aria-expanded={profileDropdownOpen}
                >
                  <div
                    className={`w-4 h-4 rounded-full border text-[8.5px] flex items-center justify-center font-bold transition-colors ${profileDropdownOpen || pathname === "/profile"
                        ? "bg-black/20 border-black/40 text-black"
                        : "bg-[var(--accent-primary,#d4a843)]/20 border-[var(--accent-primary,#d4a843)] text-[#f8eed9] group-hover:text-black group-hover:border-black/40"
                      }`}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="relative z-10 max-w-[100px] truncate">
                    {user?.name ? user.name.split(" ")[0] : "PROFILE"}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[rgba(212,168,67,0.35)] bg-[#0d0906]/98 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Signed in as</p>
                      <p className="font-sans text-xs font-bold text-white truncate">{user?.name || "Participant"}</p>
                      {user?.email && <p className="font-mono text-[9.5px] text-neutral-400 truncate">{user.email}</p>}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-[rgba(212,168,67,0.18)] rounded-lg transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--accent-primary,#d4a843)]" />
                      <span>My Profile</span>
                    </Link>

                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "BOSS") && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-amber-400 hover:bg-amber-950/40 rounded-lg transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="clip-mecha-btn relative px-3.5 xl:px-4 py-1.5 xl:py-2 font-mono font-bold text-[9.5px] xl:text-[10.5px] tracking-[0.2em] uppercase text-[#f8eed9] bg-gradient-to-r from-[rgba(212,168,67,0.22)] via-[rgba(212,168,67,0.1)] to-[rgba(212,168,67,0.04)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_15px_rgba(212,168,67,0.3)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black hover:shadow-[0_0_25px_var(--accent-primary,#d4a843)] transition-all duration-300 active:scale-95 text-center whitespace-nowrap inline-flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative z-10">SIGN IN</span>
                <span className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-[9px]">
                  ↗
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION DOCK (Events, Ambassador, Sponsorship, Stay)
          ========================================================= */}
      <div className="xl:hidden fixed bottom-3 inset-x-3 z-50 pointer-events-auto">
        <nav className="grid grid-cols-4 w-full items-center py-1.5 px-1 rounded-2xl border border-[rgba(212,168,67,0.35)] bg-[#070503]/92 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          <Link
            href="/events"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${pathname === "/events" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
              }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase font-medium">Events</span>
          </Link>
          <Link
            href="/about"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${pathname === "/about" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
              }`}
          >
            <Compass className="h-4 w-4" />
            <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase font-medium">About</span>
          </Link>
          <Link
            href="/sponsors"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${pathname === "/sponsors" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
              }`}
          >
            <Handshake className="h-4 w-4" />
            <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase font-medium truncate max-w-[70px]">Sponsors</span>
          </Link>
          <Link
            href="/accommodation"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${pathname === "/accommodation" ? "text-[var(--accent-primary,#d4a843)]" : "text-[#a89b88] hover:text-[#f8eed9]"
              }`}
          >
            <Hotel className="h-4 w-4" />
            <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase font-medium">Stay</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

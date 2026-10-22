"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  ABOUT_STATS,
  PATRON_DIRECTORATE,
  FACULTY_INCHARGES,
  ABOUT_CLUBS,
} from "../data/about-data";
import { useAboutTheme } from "../data/about-theme";
import { FestFooter } from "@/shared";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function clamp(val: number, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

function mapRange(
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  if (inMax === inMin) return outMin;
  const clamped = clamp(val, inMin, inMax);
  const ratio = (clamped - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

function StatCounter({
  target,
  suffix,
  prefix = "",
}: {
  target: number;
  suffix: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isDecimal = target % 1 !== 0;

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasAnimated) return;
        setHasAnimated(true);
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Number((target * eased).toFixed(isDecimal ? 1 : 0)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    node && observer.observe(node);
    return () => observer.disconnect();
  }, [target, hasAnimated, isDecimal]);

  return (
    <span ref={ref} className="tabular-nums font-montserrat font-black">
      {prefix}
      {isDecimal ? display.toFixed(1) : display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutView() {
  const theme = useAboutTheme();

  // Multi-stage scroll tracker with fixed-pin guarantee (bypasses sticky overflow bug)
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pinState, setPinState] = useState<"fixed" | "bottom">("fixed");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight || 800;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollDistance = Math.max(heroHeight - windowHeight, 1);

      const p = clamp(scrollY / scrollDistance, 0, 1);
      // Only trigger React state reconciliation when inside the active pinned hero range
      if (scrollY <= scrollDistance + 150) {
        setScrollProgress((prev) => (Math.abs(prev - p) >= 0.002 ? p : prev));
      } else if (p === 1) {
        setScrollProgress((prev) => (prev !== 1 ? 1 : prev));
      }

      if (scrollY >= scrollDistance) {
        setPinState((prev) => (prev !== "bottom" ? "bottom" : prev));
      } else {
        setPinState((prev) => (prev !== "fixed" ? "fixed" : prev));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scene 1: "WE ARE" + TS27 white text graphic (Active 0 -> 0.45)
  const weAreOpacity =
    scrollProgress < 0.25
      ? 1
      : mapRange(scrollProgress, 0.25, 0.45, 1, 0);
  const weAreScale = mapRange(scrollProgress, 0, 0.45, 1, 1.05);
  const weAreY = mapRange(scrollProgress, 0, 0.45, 0, -35);

  // Scene 2: Narrative & Metrics (Active 0.40 -> 1.0)
  const narrativeOpacity = mapRange(scrollProgress, 0.40, 0.65, 0, 1);
  const narrativeScale = mapRange(scrollProgress, 0.40, 0.65, 0.95, 1);
  const narrativeY = mapRange(scrollProgress, 0.40, 0.65, 35, 0);

  const scrollDownToNarrative = () => {
    const windowHeight = window.innerHeight || 800;
    const heroHeight = heroRef.current?.offsetHeight || windowHeight * 2;
    const scrollDistance = heroHeight - windowHeight;
    window.scrollTo({
      top: scrollDistance * 0.7,
      behavior: "smooth",
    });
  };

  const scrollToLeadership = () => {
    document.getElementById("leadership")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)]/30 selection:text-white"
      style={{
        "--theme-accent": theme.accent,
        "--theme-accent-glow": theme.accentGlow,
        "--theme-accent-bright": theme.accentBright,
      } as React.CSSProperties}
    >
      {/* ============================================================
          HERO SCROLL-DRIVEN STAGE (Pinned Container)
          ============================================================ */}
      <div ref={heroRef} className="relative h-[200vh] w-full">
        <div
          className={`${
            pinState === "fixed" ? "fixed top-0 left-0" : "absolute bottom-0 left-0"
          } h-screen w-full flex items-center justify-center overflow-hidden bg-black z-10`}
        >
          {/* Dynamic Cloudinary Narrative Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="https://res.cloudinary.com/dosovvovq/image/upload/w_1920,q_85,f_auto,c_limit/techsrijan/images/about/about-bg.webp"
              alt="TechSrijan Citadel Architecture"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.78] contrast-[1.08]"
            />
            {/* Balanced Vignette Scrim Overlays: rich cinematic atmosphere with readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
          </div>

          {/* ── STAGE 1: "WE ARE" + TS27 WHITE TEXT GRAPHIC + ECLIPSE GLOW & SPECULAR SHEEN ── */}
          <div
            style={{
              opacity: weAreOpacity,
              transform: `translate3d(0, ${weAreY}px, 0) scale(${weAreScale})`,
              visibility: weAreOpacity > 0.005 ? "visible" : "hidden",
              pointerEvents: weAreOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center select-none transition-all duration-200 ease-out"
          >
            {/* ── THEMATIC ARCHITECTURAL HALO (Crisp Vector Celestial Reticle) ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
              <svg
                viewBox="0 0 800 800"
                className="w-[320px] xs:w-[460px] sm:w-[640px] md:w-[820px] lg:w-[960px] h-[320px] xs:h-[460px] sm:h-[640px] md:h-[820px] lg:h-[960px] select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Clean Celestial Radial Diffusion (GPU composite-friendly) */}
                  <radialGradient id="archHaloDiffusion" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent-primary, #D4A843)" stopOpacity="0.20" />
                    <stop offset="45%" stopColor="var(--accent-glow, rgba(212,168,67,0.3))" stopOpacity="0.07" />
                    <stop offset="85%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ambient Center Glow */}
                <circle cx="400" cy="400" r="320" fill="url(#archHaloDiffusion)" />

                {/* Outer Celestial Stippled Ring */}
                <circle
                  cx="400"
                  cy="400"
                  r="365"
                  stroke="var(--accent-primary, #D4A843)"
                  strokeWidth="1"
                  strokeDasharray="3 9"
                  opacity="0.25"
                />

                {/* Rotating Segmented Orbital Ring */}
                <circle
                  cx="400"
                  cy="400"
                  r="325"
                  stroke="var(--border-accent, #D4A843)"
                  strokeWidth="1.5"
                  strokeDasharray="140 60 40 60 90 60"
                  opacity="0.32"
                  className="motion-safe:animate-[spin_120s_linear_infinite] motion-reduce:animate-none origin-center"
                />

                {/* Concentric Precision Guide Ring */}
                <circle
                  cx="400"
                  cy="400"
                  r="265"
                  stroke="var(--accent-primary, #D4A843)"
                  strokeWidth="1"
                  opacity="0.2"
                />

                {/* Inner Focal Reticle Ring */}
                <circle
                  cx="400"
                  cy="400"
                  r="205"
                  stroke="var(--accent-primary, #D4A843)"
                  strokeWidth="1.25"
                  strokeDasharray="6 14"
                  opacity="0.28"
                  className="motion-safe:animate-[spin_90s_linear_infinite_reverse] motion-reduce:animate-none origin-center"
                />

                {/* Cardinal Reticle Crosshair Ticks */}
                <line x1="400" y1="25" x2="400" y2="75" stroke="var(--accent-primary, #D4A843)" strokeWidth="1.5" opacity="0.4" />
                <line x1="400" y1="725" x2="400" y2="775" stroke="var(--accent-primary, #D4A843)" strokeWidth="1.5" opacity="0.4" />
                <line x1="25" y1="400" x2="75" y2="400" stroke="var(--accent-primary, #D4A843)" strokeWidth="1.5" opacity="0.4" />
                <line x1="725" y1="400" x2="775" y2="400" stroke="var(--accent-primary, #D4A843)" strokeWidth="1.5" opacity="0.4" />

                {/* Cardinal Degree Calibration Points */}
                <circle cx="170" cy="170" r="3" fill="var(--accent-primary, #D4A843)" opacity="0.45" />
                <circle cx="630" cy="170" r="3" fill="var(--accent-primary, #D4A843)" opacity="0.45" />
                <circle cx="170" cy="630" r="3" fill="var(--accent-primary, #D4A843)" opacity="0.45" />
                <circle cx="630" cy="630" r="3" fill="var(--accent-primary, #D4A843)" opacity="0.45" />
              </svg>
            </div>

            <h1 className="font-montserrat font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] uppercase text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              WE ARE
            </h1>

            {/* Stylized White TS27 Emblem Graphic with Specular Sheen & Dynamic Theme Glow */}
            <div className="relative w-[300px] xs:w-[420px] sm:w-[560px] md:w-[700px] lg:w-[820px] max-w-[92vw] aspect-[2939/556] my-3 sm:my-5 flex items-center justify-center">
              {/* Base Logo Image with Thematic Ambient Rim Glow */}
              <Image
                src="/TS27 white Text.png"
                alt="TechSrijan '27"
                fill
                priority
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 700px, 820px"
                className="object-contain transition-all duration-500"
                style={{
                  filter: `drop-shadow(0 0 20px ${theme.accentGlow}) drop-shadow(0 0 45px rgba(255,255,255,0.35)) drop-shadow(0 12px 30px rgba(0,0,0,0.95))`,
                }}
              />

              {/* Specular Light Sweep Overlay: Alpha-masked to the exact contours of the letterforms */}
              <div
                className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                style={{
                  maskImage: "url('/TS27 white Text.png')",
                  WebkitMaskImage: "url('/TS27 white Text.png')",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  mixBlendMode: "screen",
                }}
              >
                {/* Luminous High-Intensity Light Beam Traversing Across the Letters */}
                <div
                  className="w-full h-full pointer-events-none animate-logo-sheen"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, ${theme.accentSecondary}25 40%, rgba(255,255,255,0.7) 47%, #ffffff 50%, ${theme.accentBright} 53%, ${theme.accentSecondary}25 60%, transparent 70%)`,
                  }}
                />
              </div>
            </div>

            <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-neutral-300 uppercase max-w-xl drop-shadow-md">
              Madan Mohan Malaviya University of Technology · Gorakhpur
            </p>

            {/* Scroll Indicator */}
            <button
              type="button"
              onClick={scrollDownToNarrative}
              className="absolute bottom-10 sm:bottom-14 flex flex-col items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <span>SCROLL TO ENTER</span>
              <ChevronDown className="w-4 h-4 text-white/70 motion-safe:animate-pulse motion-reduce:animate-none" />
            </button>
          </div>

          {/* ── STAGE 2: CORE FESTIVAL NARRATIVE & METRICS (FROSTED GLASS CARD) ── */}
          <div
            style={{
              opacity: narrativeOpacity,
              transform: `translate3d(0, ${narrativeY}px, 0) scale(${narrativeScale})`,
              visibility: narrativeOpacity > 0.005 ? "visible" : "hidden",
              pointerEvents: narrativeOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 select-none transition-all duration-200 ease-out"
          >
            <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 md:p-10 bg-[var(--surface)] backdrop-blur-2xl border border-[var(--border)] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col items-center text-center">
              {/* Exact User Text Block */}
              <p className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-normal text-neutral-100 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                TechSrijan is the flagship annual techno-management festival of{" "}
                <span className="text-white font-bold">
                  Madan Mohan Malaviya University of Technology (MMMUT)
                </span>{" "}
                Gorakhpur, bringing together technology, innovation, coding, robotics and creative
                competition with 15K+ expected footfall nationwide, Governed by the Technical
                Sub-Council under the Council of Student Activities (CSA).
              </p>

              {/* Metric Strip */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-5 sm:pt-6 border-t border-white/15">
                {ABOUT_STATS.map((stat) => (
                  <div key={stat.id} className="flex flex-col items-center text-center p-2">
                    <div
                      className="text-xl sm:text-2xl md:text-3xl font-montserrat font-black text-transparent bg-clip-text"
                      style={{ backgroundImage: theme.metricGradient }}
                    >
                      <StatCounter
                        target={stat.number}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </div>
                    <div className="mt-1 font-bebas text-xs sm:text-sm tracking-wider uppercase text-white">
                      {stat.label}
                    </div>
                    <div className="font-mono text-[8.5px] sm:text-[9.5px] tracking-wide text-neutral-400 mt-0.5">
                      {stat.subtext}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Down Prompt for Faculty Cards */}
              <button
                type="button"
                onClick={scrollToLeadership}
                className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-white/70 hover:text-white uppercase transition-colors cursor-pointer"
              >
                <span>EXPLORE PATRONAGE &amp; GOVERNANCE</span>
                <ChevronDown className="w-3.5 h-3.5 motion-safe:animate-pulse motion-reduce:animate-none" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 2: PATRONAGE & FACULTY LEADERSHIP
          ============================================================ */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="font-mono text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-6 bg-[var(--border)]" />
            <span className="text-[var(--accent-primary)] font-semibold">UNIVERSITY LEADERSHIP</span>
            <span className="h-px w-6 bg-[var(--border)]" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white uppercase leading-tight">
            Patronage &amp; Directorate
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Guiding TechSrijan &apos;27 under the institutional governance of Madan Mohan Malaviya University of Technology.
          </p>
        </div>

        {/* 3 Apex Mentors (Prof. Anupama Kaushik Sharma, Dr. Rajan Mishra, Dr. Pallav Gupta) */}
        <div className="space-y-8 sm:space-y-12">
          {PATRON_DIRECTORATE.map((patron, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={patron.id}
                className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[var(--surface)] via-[var(--bg-secondary)]/90 to-[var(--bg-primary)] border border-[var(--border)] backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] hover:border-[var(--border-accent)]/50 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Portrait Bezel */}
                  <div
                    className={`w-full lg:col-span-4 flex flex-col items-center justify-center text-center ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative group w-full flex flex-col items-center justify-center mx-auto">
                      {/* Architectural Precision Frame */}
                      <div
                        className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-b from-white/10 via-black to-black/90 border-2 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          borderColor: patron.accent,
                          boxShadow: `0 0 24px ${patron.accent}33, inset 0 0 16px rgba(0,0,0,0.9)`,
                        }}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-black shadow-inner">
                          <Image
                            src={patron.image}
                            alt={patron.name}
                            fill
                            sizes="(max-width: 768px) 200px, 260px"
                            className="object-cover object-center filter contrast-[1.05]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Concise Narrative */}
                  <div className={`lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="space-y-3.5">
                      {patron.kicker && (
                        <div className="font-mono text-[11px] sm:text-xs tracking-widest uppercase text-[var(--accent-primary)] font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                          <span>{patron.kicker}</span>
                        </div>
                      )}

                      <h3 className="text-2xl sm:text-4xl font-montserrat font-black tracking-tight text-white leading-tight">
                        {patron.name}
                      </h3>

                      <div className="space-y-0.5">
                        <div
                          className="text-base sm:text-lg font-bebas tracking-wide uppercase"
                          style={{ color: theme.accent }}
                        >
                          {patron.role}
                        </div>
                        <div className="text-xs sm:text-sm font-sans text-neutral-400">
                          {patron.department}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed pt-1">
                        {patron.bio}
                      </p>

                      {/* Key Directives */}
                      <div className="pt-3 border-t border-white/10 grid sm:grid-cols-2 gap-2">
                        {patron.initiatives.map((init, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 font-sans">
                            <span className="font-bold select-none shrink-0" style={{ color: patron.accent }}>
                              ✦
                            </span>
                            <span>{init}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── THE 3 FACULTY INCHARGES ── */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="font-mono text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[var(--text-muted)] flex items-center justify-center gap-2.5">
              <span className="h-px w-6 bg-[var(--border)]" />
              <span className="text-[var(--accent-primary)] font-semibold">MENTORSHIP COUNCIL</span>
              <span className="h-px w-6 bg-[var(--border)]" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-montserrat font-black tracking-tight text-white uppercase">
              Faculty Incharges
            </h3>
            <p className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
              Technical Sub Council · TechSrijan &apos;27
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FACULTY_INCHARGES.map((mentor) => (
              <div
                key={mentor.id}
                className="group relative rounded-3xl p-6 bg-gradient-to-b from-[var(--surface)] via-[var(--bg-secondary)]/90 to-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-accent)]/50 transition-all duration-300 text-center flex flex-col items-center backdrop-blur-xl shadow-xl hover:-translate-y-1.5"
              >
                {/* Circular Avatar */}
                <div
                  className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 mb-4 bg-gradient-to-b from-white/20 via-black to-black border-2 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    borderColor: theme.accent,
                    boxShadow: `0 0 25px ${theme.accentGlow}`,
                  }}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-black shadow-inner">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      sizes="144px"
                      className="object-cover object-center filter contrast-[1.05]"
                    />
                  </div>
                </div>

                <h4 className="text-lg sm:text-xl font-montserrat font-bold text-white group-hover:text-white transition-colors">
                  {mentor.name}
                </h4>
                <div
                  className="font-bebas text-sm tracking-wider uppercase mt-1"
                  style={{ color: theme.accent }}
                >
                  {mentor.role}
                </div>
                <div className="text-xs sm:text-sm font-sans text-neutral-400 mt-1 leading-snug">
                  {mentor.designation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: TECHNICAL SUB-COUNCIL & SPECIALIST SOCIETIES
          (Shows Faculty Mentors & Very Short Explanations)
          ============================================================ */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="font-mono text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-6 bg-[var(--border)]" />
            <span className="text-[var(--accent-primary)] font-semibold">TECHNICAL SUB-COUNCIL BODIES</span>
            <span className="h-px w-6 bg-[var(--border)]" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white uppercase leading-tight">
            Clubs Under Technical Sub-Council
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Operating under the Technical Sub-Council (TSC) to organize and power all arenas, engineering championships, and flagship events of TechSrijan.
          </p>
        </div>

        {/* Symmetrical Specialist Club Cards with Faculty Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ABOUT_CLUBS.map((club) => (
            <div
              key={club.id}
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[var(--surface)] via-[var(--bg-secondary)]/90 to-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-accent)]/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Top Header Row with Logo & Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full p-1 flex items-center justify-center border border-white/20 bg-black/70 shrink-0"
                    style={{ boxShadow: `0 0 16px ${club.glowColor}` }}
                  >
                    <Image
                      src={club.logo}
                      alt={club.shortName}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span
                    className="font-mono text-[9px] sm:text-[10px] tracking-widest px-2.5 py-1 rounded-full uppercase border font-semibold text-right"
                    style={{
                      borderColor: `${club.accentColor}55`,
                      color: club.accentColor,
                      backgroundColor: `${club.accentColor}10`,
                    }}
                  >
                    {club.shortName}
                  </span>
                </div>

                {/* Club Name & Instagram Link */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl sm:text-2xl font-montserrat font-black text-white uppercase tracking-tight">
                    {club.fullName}
                  </h3>
                  {club.instagram && (
                    <a
                      href={club.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${club.fullName} Instagram`}
                      className="p-1.5 sm:p-2 rounded-xl border transition-all duration-200 hover:scale-110 shrink-0 flex items-center justify-center group/insta"
                      style={{
                        borderColor: `${club.accentColor}40`,
                        color: club.accentColor,
                        backgroundColor: `${club.accentColor}12`,
                        boxShadow: `0 0 14px ${club.accentColor}20`,
                      }}
                      title="Follow on Instagram"
                    >
                      <IconInstagram className="w-4 h-4 transition-transform group-hover/insta:scale-110" />
                    </a>
                  )}
                </div>

                {/* Optional Tagline (Strictly only for MMMUT RESO) */}
                {club.tagline && (
                  <p
                    className="mt-1 font-mono text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                    style={{ color: club.accentColor }}
                  >
                    &ldquo;{club.tagline}&rdquo;
                  </p>
                )}

                {/* Faculty Mentorship Card */}
                <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-400 uppercase font-bold flex items-center gap-1.5 pb-1 border-b border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: club.accentColor }} />
                    FACULTY MENTORSHIP
                  </div>
                  <div className="flex flex-col gap-3">
                    {club.faculties.map((fac, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {fac.image ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-black/60 shrink-0 shadow-sm">
                            <Image
                              src={fac.image}
                              alt={fac.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs uppercase border border-white/15 bg-white/5 shrink-0"
                            style={{ color: club.accentColor }}
                          >
                            {fac.name.split(" ").filter(Boolean).slice(-1)[0]?.[0] || "F"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-montserrat font-bold text-xs sm:text-sm text-white truncate">
                              {fac.name}
                            </span>
                            <span
                              className="font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border shrink-0"
                              style={{
                                borderColor: `${club.accentColor}40`,
                                color: club.accentColor,
                                backgroundColor: `${club.accentColor}0D`,
                              }}
                            >
                              {fac.role}
                            </span>
                          </div>
                          <span className="font-sans text-[11px] sm:text-xs text-neutral-300 truncate">
                            {fac.designation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/events"
                  className="font-mono text-[10px] sm:text-xs font-bold tracking-wider text-neutral-300 hover:text-white uppercase flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>Explore Arenas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: club.accentColor }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standard Fest Footer */}
      <FestFooter />
    </div>
  );
}

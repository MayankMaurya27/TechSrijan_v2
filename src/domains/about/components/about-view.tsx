"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import {
  ABOUT_STATS,
  PATRON_DIRECTORATE,
  FACULTY_INCHARGES,
  ABOUT_CLUBS,
} from "../data/about-data";
import { useAboutTheme } from "../data/about-theme";
import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";
import { FestFooter } from "@/shared/layout/fest-footer";

const LOGO_CONFIGS: Record<
  CanonicalTheme,
  {
    imageSrcWebp: string;
    imageSrcPng: string;
    glowColor: string;
    dropGlow: string;
    accentHex: string;
  }
> = {
  "geass-moon": {
    imageSrcWebp: "/hero-logo-geass-moon.webp",
    imageSrcPng: "/hero-logo-geass-moon.png",
    glowColor: "rgba(255, 30, 39, 0.65)",
    dropGlow: "drop-shadow(0 0 35px rgba(255, 30, 39, 0.6)) drop-shadow(0 20px 50px rgba(0,0,0,0.95))",
    accentHex: "#FF1E27",
  },
  "arrakis-day": {
    imageSrcWebp: "/hero-logo-arrakis-day.webp",
    imageSrcPng: "/hero-logo-arrakis-day.png",
    glowColor: "rgba(212, 168, 67, 0.65)",
    dropGlow: "drop-shadow(0 0 35px rgba(212, 168, 67, 0.6)) drop-shadow(0 20px 50px rgba(0,0,0,0.95))",
    accentHex: "#D4A843",
  },
  "krelln-night": {
    imageSrcWebp: "/hero-logo-krelln-night.webp",
    imageSrcPng: "/hero-logo-krelln-night.png",
    glowColor: "rgba(121, 199, 227, 0.65)",
    dropGlow: "drop-shadow(0 0 35px rgba(121, 199, 227, 0.6)) drop-shadow(0 20px 50px rgba(0,0,0,0.95))",
    accentHex: "#79C7E3",
  },
};

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
  const themeContext = useTheme();
  const activeCanonical: CanonicalTheme = normalizeTheme(themeContext?.resolvedTheme);
  const activeLogo = LOGO_CONFIGS[activeCanonical] || LOGO_CONFIGS["geass-moon"];

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
      setScrollProgress(p);

      if (scrollY >= scrollDistance) {
        setPinState("bottom");
      } else {
        setPinState("fixed");
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

  // Stage 1: Shining Logo (0 -> 0.28)
  const logoOpacity = scrollProgress < 0.16 ? 1 : mapRange(scrollProgress, 0.16, 0.28, 1, 0);
  const logoScale = mapRange(scrollProgress, 0, 0.28, 1, 1.08);
  const logoY = mapRange(scrollProgress, 0, 0.28, 0, -30);

  // Stage 2: "We Are techSRIJAN '27" (0.24 -> 0.64)
  const weAreOpacity =
    scrollProgress < 0.44
      ? mapRange(scrollProgress, 0.25, 0.36, 0, 1)
      : mapRange(scrollProgress, 0.52, 0.63, 1, 0);
  const weAreScale =
    scrollProgress < 0.44
      ? mapRange(scrollProgress, 0.25, 0.36, 0.94, 1)
      : mapRange(scrollProgress, 0.52, 0.63, 1, 1.06);
  const weAreY =
    scrollProgress < 0.44
      ? mapRange(scrollProgress, 0.25, 0.36, 30, 0)
      : mapRange(scrollProgress, 0.52, 0.63, 0, -30);

  // Stage 3: Narrative & Cloudinary BG (0.58 -> 1.0)
  const bgImageOpacity = mapRange(scrollProgress, 0.56, 0.70, 0, 0.75);
  const narrativeOpacity = mapRange(scrollProgress, 0.62, 0.74, 0, 1);
  const narrativeScale = mapRange(scrollProgress, 0.62, 0.74, 0.95, 1);
  const narrativeY = mapRange(scrollProgress, 0.62, 0.74, 35, 0);

  const scrollDownFromStage1 = () => {
    const windowHeight = window.innerHeight || 800;
    const heroHeight = heroRef.current?.offsetHeight || windowHeight * 2.8;
    const scrollDistance = heroHeight - windowHeight;
    window.scrollTo({
      top: scrollDistance * 0.42,
      behavior: "smooth",
    });
  };

  const scrollDownFromStage2 = () => {
    const windowHeight = window.innerHeight || 800;
    const heroHeight = heroRef.current?.offsetHeight || windowHeight * 2.8;
    const scrollDistance = heroHeight - windowHeight;
    window.scrollTo({
      top: scrollDistance * 0.8,
      behavior: "smooth",
    });
  };

  const scrollToLeadership = () => {
    document.getElementById("leadership")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen bg-[#050304] text-[#F3EFEA] font-sans selection:bg-[#E61E25]/30 selection:text-white"
      style={{
        "--theme-accent": theme.accent,
        "--theme-accent-glow": theme.accentGlow,
        "--theme-accent-bright": theme.accentBright,
      } as React.CSSProperties}
    >
      {/* ============================================================
          SCENE 1, 2 & 3: HERO SCROLL-DRIVEN STAGE (Pinned Container)
          ============================================================ */}
      <div ref={heroRef} className="relative h-[280vh] w-full">
        <div
          className={`${
            pinState === "fixed" ? "fixed top-0 left-0" : "absolute bottom-0 left-0"
          } h-screen w-full flex items-center justify-center overflow-hidden bg-black z-10`}
        >
          {/* Dynamic Cloudinary Narrative Background Image (Cross-fades in Stage 3) */}
          <div
            style={{
              opacity: bgImageOpacity,
              visibility: bgImageOpacity > 0.005 ? "visible" : "hidden",
            }}
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out"
          >
            <Image
              src="https://res.cloudinary.com/dosovvovq/image/upload/w_1920,q_85,f_auto,c_limit/techsrijan/images/about/about-bg.webp"
              alt="TechSrijan Citadel Architecture"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.35] contrast-[1.2] blur-[1px]"
            />
            {/* Deep Vignette Scrim Overlays to guarantee zero visual text clash */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/85" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.92)_100%)]" />
          </div>

          {/* ── STAGE 1: TECHSRIJAN LOGO SHINING IN MIDDLE ── */}
          <div
            style={{
              opacity: logoOpacity,
              transform: `translate3d(0, ${logoY}px, 0) scale(${logoScale})`,
              visibility: logoOpacity > 0.005 ? "visible" : "hidden",
              pointerEvents: logoOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 select-none transition-all duration-200 ease-out"
          >
            {/* Ambient Laser Halo */}
            <div
              className="absolute w-[320px] sm:w-[550px] md:w-[700px] h-[220px] sm:h-[320px] rounded-full blur-[100px] sm:blur-[140px] opacity-75 animate-pulse transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: activeLogo.glowColor }}
            />

            {/* Glowing TechSrijan Emblem */}
            <div className="relative w-[280px] xs:w-[340px] sm:w-[500px] md:w-[680px] lg:w-[820px] aspect-[2172/724] drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
              <Image
                src={activeLogo.imageSrcWebp}
                alt="TechSrijan '27 Logo"
                fill
                priority
                className="object-contain filter contrast-110 brightness-110"
                style={{ filter: activeLogo.dropGlow }}
              />

              {/* Shimmer Specular Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 mix-blend-overlay animate-pulse pointer-events-none" />
            </div>

            {/* Scroll Indicator */}
            <button
              type="button"
              onClick={scrollDownFromStage1}
              className="absolute bottom-10 sm:bottom-14 flex flex-col items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>SCROLL TO ENTER</span>
              <ChevronDown className="w-4 h-4 text-white/60 animate-bounce" />
            </button>
          </div>

          {/* ── STAGE 2: "WE ARE TECHSRIJAN '27" ── */}
          <div
            style={{
              opacity: weAreOpacity,
              transform: `translate3d(0, ${weAreY}px, 0) scale(${weAreScale})`,
              visibility: weAreOpacity > 0.005 ? "visible" : "hidden",
              pointerEvents: weAreOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center select-none transition-all duration-200 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-white/70 uppercase font-semibold">
                THE ANNUAL TECHNO-MANAGEMENT PHENOMENON
              </span>
            </div>

            <h1 className="font-montserrat font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-none drop-shadow-[0_8px_35px_rgba(0,0,0,1)]">
              WE ARE{" "}
              <span
                className="text-transparent bg-clip-text transition-all duration-500"
                style={{
                  backgroundImage: theme.headlineGradient,
                  filter: `drop-shadow(0 0 25px ${theme.accentGlow})`,
                }}
              >
                TECHSRIJAN &apos;27
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm tracking-[0.2em] text-neutral-400 uppercase max-w-xl">
              Madan Mohan Malaviya University of Technology · Gorakhpur
            </p>

            {/* Scroll Indicator */}
            <button
              type="button"
              onClick={scrollDownFromStage2}
              className="absolute bottom-10 sm:bottom-14 flex flex-col items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>KEEP SCROLLING</span>
              <ChevronDown className="w-4 h-4 text-white/60 animate-bounce" />
            </button>
          </div>

          {/* ── STAGE 3: CORE FESTIVAL NARRATIVE & METRICS (FROSTED GLASS CARD) ── */}
          <div
            style={{
              opacity: narrativeOpacity,
              transform: `translate3d(0, ${narrativeY}px, 0) scale(${narrativeScale})`,
              visibility: narrativeOpacity > 0.005 ? "visible" : "hidden",
              pointerEvents: narrativeOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 select-none transition-all duration-200 ease-out"
          >
            <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 md:p-10 bg-[#090507]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 mb-4 sm:mb-5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-white/90 uppercase font-bold">
                  ABOUT TECHSRIJAN &apos;27
                </span>
              </div>

              {/* Exact User Text Block */}
              <p className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-normal text-neutral-100 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                TechSrijan is the flagship annual techno-management festival of{" "}
                <span
                  className="text-white font-bold underline decoration-2 underline-offset-4"
                  style={{ textDecorationColor: theme.accent }}
                >
                  Madan Mohan Malaviya University of Technology (MMMUT)
                </span>{" "}
                Gorakhpur, bringing together technology, innovation, coding, robotics and creative
                competition with 25K+ expected footfall nationwide, Governed by the Technical
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
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
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
          <div
            className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2"
            style={{ color: theme.accent }}
          >
            UNIVERSITY LEADERSHIP
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
                className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[#140b0e]/90 via-[#0d0709]/90 to-[#070305]/95 border border-white/10 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] hover:border-white/20 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Portrait Bezel */}
                  <div
                    className={`w-full lg:col-span-4 flex flex-col items-center justify-center text-center ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative group w-full flex flex-col items-center justify-center mx-auto">
                      {/* Ambient Aura */}
                      <div
                        className="absolute -inset-3 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: `${patron.accent}55` }}
                      />

                      {/* Dual-Ring Frame */}
                      <div
                        className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-b from-white/20 via-black to-black/80 border-2 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          borderColor: patron.accent,
                          boxShadow: `0 0 30px ${patron.accent}50, inset 0 0 20px rgba(0,0,0,0.9)`,
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

                      {/* Badge Pill */}
                      <div className="mt-4 w-full flex justify-center text-center">
                        <span
                          className="inline-block px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase border bg-black/85 backdrop-blur-md"
                          style={{
                            borderColor: `${patron.accent}66`,
                            color: patron.accent,
                          }}
                        >
                          {patron.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Concise Narrative */}
                  <div className={`lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="space-y-3.5">
                      <div
                        className="font-bebas text-sm sm:text-base tracking-[0.2em] uppercase"
                        style={{ color: patron.accent }}
                      >
                        {patron.kicker}
                      </div>

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
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase"
              style={{ color: theme.accent }}
            >
              MENTORSHIP COUNCIL
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
                className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#180a0e]/85 via-[#0e0508]/85 to-[#070305]/95 border border-white/10 hover:border-white/25 transition-all duration-300 text-center flex flex-col items-center backdrop-blur-xl shadow-xl hover:-translate-y-1.5"
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
          <div
            className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2"
            style={{ color: theme.accent }}
          >
            GOVERNING BODIES &amp; CHAPTERS
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white uppercase leading-tight">
            Technical Sub-Council &amp; Specialist Societies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Operating under apex faculty mentorship to conduct university-level engineering championships.
          </p>
        </div>

        {/* Symmetrical Specialist Club Cards with Faculty Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ABOUT_CLUBS.map((club) => (
            <div
              key={club.id}
              className="group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#140b0e]/85 via-[#0d0709]/85 to-[#070305]/95 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:-translate-y-1"
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

                {/* Club Name */}
                <h3 className="text-xl sm:text-2xl font-montserrat font-black text-white uppercase tracking-tight">
                  {club.fullName}
                </h3>

                {/* Optional Tagline (Strictly only for MMMUT RESO) */}
                {club.tagline && (
                  <p
                    className="mt-1 font-mono text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                    style={{ color: club.accentColor }}
                  >
                    &ldquo;{club.tagline}&rdquo;
                  </p>
                )}

                {/* Department Info */}
                <p className="mt-1 text-xs text-neutral-400 font-sans">
                  {club.department}
                </p>

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
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  TSC · MMMUT
                </span>
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

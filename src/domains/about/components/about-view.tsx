"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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

function StatCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

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
          setDisplay(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    node && observer.observe(node);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums font-montserrat font-black">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutView() {
  const theme = useAboutTheme();
  const themeContext = useTheme();
  const activeCanonical: CanonicalTheme = normalizeTheme(themeContext?.resolvedTheme);
  const activeLogo = LOGO_CONFIGS[activeCanonical] || LOGO_CONFIGS["geass-moon"];

  // Hero multi-stage scroll progress
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: Shining Logo (0 -> 0.32)
  const logoOpacity = useTransform(heroProgress, [0, 0.22, 0.32], [1, 1, 0]);
  const logoScale = useTransform(heroProgress, [0, 0.3], [1, 1.12]);
  const logoY = useTransform(heroProgress, [0, 0.3], [0, -35]);

  // Stage 2: "We Are techSRIJAN '27" (0.26 -> 0.62)
  const weAreOpacity = useTransform(heroProgress, [0.26, 0.36, 0.52, 0.62], [0, 1, 1, 0]);
  const weAreScale = useTransform(heroProgress, [0.26, 0.36, 0.62], [0.9, 1, 1.08]);
  const weAreY = useTransform(heroProgress, [0.26, 0.36, 0.62], [35, 0, -30]);

  // Stage 3: Narrative & Cloudinary BG (0.52 -> 1.0)
  const bgImageOpacity = useTransform(heroProgress, [0.5, 0.68], [0, 0.88]);
  const narrativeOpacity = useTransform(heroProgress, [0.56, 0.72, 1], [0, 1, 1]);
  const narrativeY = useTransform(heroProgress, [0.56, 0.72], [45, 0]);
  const narrativeScale = useTransform(heroProgress, [0.56, 0.72], [0.96, 1]);

  return (
    <div
      className="relative min-h-screen bg-[#050304] text-[#F3EFEA] font-sans overflow-x-hidden selection:bg-[#E61E25]/30 selection:text-white"
      style={{
        "--theme-accent": theme.accent,
        "--theme-accent-glow": theme.accentGlow,
        "--theme-accent-bright": theme.accentBright,
      } as React.CSSProperties}
    >
      {/* ============================================================
          SCENE 1, 2 & 3: HERO SCROLL-DRIVEN STAGE (Pinned 260vh Container)
          ============================================================ */}
      <div ref={heroRef} className="relative h-[270vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
          {/* Dynamic Cloudinary Narrative Background Image (Cross-fades in Stage 3) */}
          <motion.div
            style={{ opacity: bgImageOpacity }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <Image
              src="https://res.cloudinary.com/dosovvovq/image/upload/w_1920,q_85,f_auto,c_limit/techsrijan/images/about/about-bg.webp"
              alt="TechSrijan Citadel Architecture"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.4] contrast-[1.15]"
            />
            {/* Deep Vignette Scrim Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
          </motion.div>

          {/* ── STAGE 1: TECHSRIJAN LOGO SHINING IN MIDDLE ── */}
          <motion.div
            style={{
              opacity: logoOpacity,
              scale: logoScale,
              y: logoY,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 select-none"
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
            <div className="absolute bottom-10 sm:bottom-14 flex flex-col items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/50">
              <span>SCROLL TO ENTER</span>
              <ChevronDown className="w-4 h-4 text-white/60 animate-bounce" />
            </div>
          </motion.div>

          {/* ── STAGE 2: "WE ARE TECHSRIJAN '27" ── */}
          <motion.div
            style={{
              opacity: weAreOpacity,
              scale: weAreScale,
              y: weAreY,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center select-none"
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
          </motion.div>

          {/* ── STAGE 3: CORE FESTIVAL NARRATIVE & METRICS ── */}
          <motion.div
            style={{
              opacity: narrativeOpacity,
              scale: narrativeScale,
              y: narrativeY,
            }}
            className="relative z-30 w-full max-w-5xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center justify-center my-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md mb-5 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-white/80 uppercase font-bold">
                ABOUT TECHSRIJAN &apos;27
              </span>
            </div>

            {/* Exact User Text Block */}
            <p className="font-sans text-base sm:text-xl md:text-2xl lg:text-[25px] font-normal text-neutral-200 leading-relaxed sm:leading-relaxed md:leading-snug max-w-4xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
              TechSrijan is the flagship annual techno-management festival of{" "}
              <span
                className="text-white font-semibold underline decoration-2 underline-offset-8 transition-colors duration-300"
                style={{ textDecorationColor: theme.accent }}
              >
                Madan Mohan Malaviya University of Technology (MMMUT)
              </span>{" "}
              Gorakhpur, bringing together technology, innovation, coding, robotics and creative
              competition with 25K+ expected footfall nationwide, Governed by the Technical
              Sub-Council under the Council of Student Activities (CSA).
            </p>

            {/* Metric Strip */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl border-t border-b border-white/15 py-5 sm:py-6 bg-black/50 backdrop-blur-md rounded-2xl px-4">
              {ABOUT_STATS.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center text-center">
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: theme.metricGradient }}
                  >
                    <StatCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 font-bebas text-xs sm:text-sm tracking-wider uppercase text-white">
                    {stat.label}
                  </div>
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-wide text-neutral-400 mt-0.5">
                    {stat.subtext}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Down Prompt for Faculty Cards */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 font-mono text-[9.5px] sm:text-[11px] tracking-[0.25em] text-white/60 uppercase">
              <span>EXPLORE PATRONAGE &amp; GOVERNANCE</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </motion.div>
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

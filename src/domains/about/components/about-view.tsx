"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Shield,
  Train,
  Plane,
} from "lucide-react";
import {
  ABOUT_STATS,
  ABOUT_HOUSES,
  ABOUT_TIMELINE,
  ABOUT_TENETS,
  PATRON_DIRECTORATE,
  FACULTY_INCHARGES,
  type HouseItem,
} from "../data/about-data";
import { About3DScene } from "./about-3d-scene";
import { TechSrijanLogoScrollReveal } from "./techsrijan-logo-scroll-reveal";
import { useAboutTheme } from "../data/about-theme";

/* Social Icon SVGs */
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* Stat Counter with smooth easing */
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
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutView() {
  const theme = useAboutTheme();
  const [activeHouseId, setActiveHouseId] = useState<string>("tsc");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeHouse: HouseItem =
    ABOUT_HOUSES.find((h) => h.id === activeHouseId) || ABOUT_HOUSES[0];

  return (
    <div
      className={`relative min-h-screen bg-[#070305] text-[#f8eed9] ${theme.selectionClass} font-sans overflow-x-hidden`}
      style={{
        "--theme-accent": theme.accent,
        "--theme-accent-glow": theme.accentGlow,
        "--theme-accent-bright": theme.accentBright,
      } as React.CSSProperties}
    >
      {/* ============================================================
          CINEMATIC BACKDROP LAYER (Using @[assets/background.png])
          Dynamically tinted & synchronized with active moon theme
          ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      >
        <picture className="w-full h-full">
          <source srcSet="/images/about/about-bg.webp" type="image/webp" />
          <img
            src="/images/about/about-bg.webp"
            alt=""
            className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.18]"
          />
        </picture>
        {/* Soft atmospheric base gradient */}
        <div className={`absolute inset-0 ${theme.bgGradient} transition-colors duration-700`} />
        {/* Calibrated center-weighted radial fade: gently dims/fades the central reading area so text is properly visible */}
        <div className={`absolute inset-0 ${theme.radialCenterScrim} transition-all duration-700`} />
        {/* Reading column ambient soften layer */}
        <div className={`absolute inset-0 ${theme.radialColumnScrim} transition-all duration-700`} />
      </div>

      {/* 3D Atmospheric Volumetric Bloom Canvas */}
      <About3DScene />

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.08]">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${scrollProgress}%`,
            backgroundImage: `linear-gradient(to right, ${theme.accent}, ${theme.accentBright}, ${theme.accent})`,
            boxShadow: `0 0 12px ${theme.accentGlow}`,
          }}
        />
      </div>

      {/* ============================================================
          BALANCED CONTAINER: Matches Standard max-w-7xl Grid (Universal Harmony)
          ============================================================ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-14 sm:pt-18 pb-4 sm:pb-6">

        {/* ============================================================
            HERO SECTION: Grand Editorial Typography with Unclipped '27
            ============================================================ */}
        <section className="pt-4 sm:pt-8 pb-10 sm:pb-14">
          <div className="space-y-6 lg:space-y-8">

            {/* Grand Headline: HELLO ENGINEERS ! WE ARE TECHSRIJAN '27 */}
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-montserrat font-black tracking-tight text-white uppercase leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                HELLO ENGINEERS !
              </h1>
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-black tracking-tight uppercase leading-[0.95]">
                <span className="text-white">WE ARE </span>
                {/* Unclipped '27 with dynamic theme gradient */}
                <span
                  className="inline-block font-chancery italic font-normal text-transparent bg-clip-text pr-6 pb-2 transition-all duration-500"
                  style={{
                    backgroundImage: theme.headlineGradient,
                    filter: theme.headlineDropShadow,
                  }}
                >
                  TechSrijan &apos;27
                </span>
              </div>
            </div>

            {/* Thematic Subhead */}
            <div className="space-y-1 max-w-4xl">
              <div className="font-bebas text-xl sm:text-2xl lg:text-3xl tracking-wider text-neutral-300 uppercase">
                EASTERN INDIA&apos;S APEX
              </div>
              <div
                className="font-chancery italic text-xl sm:text-2xl lg:text-3xl transition-colors duration-500"
                style={{ color: theme.subheadColor }}
              >
                Crucible of Engineers, Inventors & Disruptors
              </div>
            </div>

            {/* Engineering Manifesto Strip with Theme Accents */}
            <div className="pt-5 pb-4 border-t border-b border-white/[0.1] max-w-5xl">
              <p className="text-base sm:text-xl lg:text-2xl font-geist font-light tracking-wide text-neutral-200 uppercase leading-relaxed">
                AND THIS IS THE CITADEL. YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-2 underline-offset-8 hover:text-white transition-colors"
                  style={{ textDecorationColor: theme.accent }}
                >
                  ROBO-WARS
                </Link>
                . YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-2 underline-offset-8 hover:text-white transition-colors"
                  style={{ textDecorationColor: theme.accentSecondary }}
                >
                  24H HACKATHONS
                </Link>
                . YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-2 underline-offset-8 hover:text-white transition-colors"
                  style={{ textDecorationColor: theme.accent }}
                >
                  BAJA RACING
                </Link>
                . AND YES, WE{" "}
                <Link
                  href="/events"
                  className="underline decoration-2 underline-offset-8 hover:text-white transition-colors"
                  style={{ textDecorationColor: theme.accentSecondary }}
                >
                  ENGINEER THE FUTURE
                </Link>
                .
              </p>
            </div>

            {/* Narrative & Action Row with Dynamic Theme Buttons */}
            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 lg:gap-12 items-end pt-1">
              <p className="text-sm sm:text-base text-neutral-300 font-geist leading-relaxed">
                TechSrijan is the flagship annual techno-management festival of{" "}
                <span className="text-white font-semibold">Madan Mohan Malaviya University of Technology (MMMUT) Gorakhpur</span>,
                bringing together technology, innovation, coding, robotics, and creative competition with 25K+ expected footfall nationwide.
                Governed by the Technical Sub-Council under the apex Council of Student Activities (CSA).
              </p>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {/* Dynamic Imperial Theme Button */}
                <Link
                  href="/events"
                  className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-montserrat uppercase tracking-wider ${theme.primaryBtnClass} border ${theme.primaryBtnBorder} ${theme.primaryBtnShadow} transition-all duration-300 hover:scale-105 hover:brightness-125`}
                >
                  <span>Explore 25+ Experiences</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-montserrat font-semibold uppercase tracking-wider ${theme.secondaryBtnClass} transition-all backdrop-blur-xl`}
                >
                  <span>Command Roster</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            METRICS STRIP (Compact & Rich Contrast Telemetry)
            ============================================================ */}
        <section className="py-7 border-t border-b border-white/[0.1] mb-12 sm:mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {ABOUT_STATS.map((stat, idx) => (
              <div
                key={stat.id}
                className={`space-y-1.5 ${idx > 0 ? "lg:border-l lg:border-white/[0.08] lg:pl-8" : ""
                  }`}
              >
                <div
                  className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-transparent bg-clip-text transition-all duration-500"
                  style={{
                    backgroundImage: theme.metricGradient,
                  }}
                >
                  <StatCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-sm sm:text-base font-bebas tracking-wider text-white uppercase">
                  {stat.label}
                </div>
                <p className="text-sm text-neutral-300 font-geist leading-relaxed">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            BORDERLESS 3D TECHSRIJAN EMBLEM (Landing Page Synced)
            ============================================================ */}
        <TechSrijanLogoScrollReveal />

        {/* ============================================================
            PATRONAGE & DIRECTORATE (Symmetrical Executive Leadership Cards)
            ============================================================ */}
        <section className="mb-14 sm:mb-20 pt-2">
          {/* Section Title */}
          <div className="mb-10 sm:mb-14 max-w-3xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-1.5 transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              APEX UNIVERSITY LEADERSHIP
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery italic font-normal text-neutral-200 mr-3">
                Patronage &
              </span>
              <span>Directorate</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 font-geist leading-relaxed max-w-2xl">
              Under the apex direction of university leadership and the Council of Student Activities (CSA),
              TechSrijan &apos;27 operates as Northern India&apos;s most formidable proving ground for engineers.
            </p>
          </div>

          {/* Symmetrical Executive Leadership Cards with Perfectly Centered Medallions */}
          <div className="space-y-8 sm:space-y-12">
            {PATRON_DIRECTORATE.map((patron, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={patron.id}
                  className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[#160b0e]/85 via-[#0d0709]/85 to-[#070305]/95 border border-white/[0.12] backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] hover:border-white/[0.24] transition-all duration-400"
                >
                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Centered Imperial Portrait Medallion */}
                    <div
                      className={`lg:col-span-4 flex flex-col items-center justify-center ${isEven ? "lg:order-2" : "lg:order-1"
                        }`}
                    >
                      <div className="relative group">
                        {/* Ambient Outer Halo */}
                        <div
                          className="absolute -inset-3 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                          style={{ backgroundColor: `${patron.accent}55` }}
                        />

                        {/* Dual-Ring Imperial Frame */}
                        <div
                          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full p-1.5 bg-gradient-to-b from-white/20 via-black to-black/80 border-2 transition-transform duration-500 group-hover:scale-105"
                          style={{
                            borderColor: patron.accent,
                            boxShadow: `0 0 35px ${patron.accent}55, inset 0 0 20px rgba(0,0,0,0.9)`,
                          }}
                        >
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-black/70 shadow-inner">
                            <Image
                              src={patron.image}
                              alt={patron.name}
                              fill
                              sizes="(max-width: 768px) 220px, 280px"
                              className="object-cover object-center filter contrast-[1.06]"
                            />
                          </div>
                        </div>

                        {/* Tactical Medallion Badge */}
                        <div className="mt-3.5 text-center">
                          <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase border bg-black/80 backdrop-blur-md"
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

                    {/* Editorial Leadership Narrative */}
                    <div
                      className={`lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"
                        }`}
                    >
                      <div className="space-y-4">
                        {/* Kicker / Title */}
                        <div
                          className="font-bebas text-sm sm:text-base tracking-[0.2em] uppercase"
                          style={{ color: patron.accent }}
                        >
                          {patron.kicker}
                        </div>

                        {/* Name Headline */}
                        <h3 className="text-2xl sm:text-4xl lg:text-4xl font-montserrat font-black tracking-tight text-white leading-tight">
                          {patron.name}
                        </h3>

                        {/* Official Institutional Role */}
                        <div className="space-y-0.5">
                          <div
                            className="text-base sm:text-lg font-bebas tracking-wide uppercase"
                            style={{ color: theme.accent }}
                          >
                            {patron.role}
                          </div>
                          <div className="text-sm sm:text-base font-geist text-neutral-200">
                            {patron.department}
                          </div>
                        </div>

                        {/* Bio Narrative */}
                        <p className="text-sm sm:text-base text-neutral-200 font-geist leading-relaxed">
                          {patron.bio}
                        </p>

                        {/* Strategic Initiatives */}
                        <div className="space-y-2.5 border-t border-white/[0.1] pt-4">
                          <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-300">
                            Strategic Directives & Mandate
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2.5">
                            {patron.initiatives.map((init, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm text-neutral-200 font-geist"
                              >
                                <span
                                  className="font-bold select-none shrink-0"
                                  style={{ color: patron.accent }}
                                >
                                  ◇
                                </span>
                                <span className="leading-snug">
                                  {init}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================
              FACULTY INCHARGES GRID (Image 4 Fix: Symmetrically Fitted Avatars)
              ============================================================ */}
          <div className="mt-14 pt-10 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: theme.accent }}
              >
                MENTORSHIP COUNCIL
              </div>
              <h3 className="text-2xl sm:text-3xl font-montserrat font-black tracking-tight text-white uppercase">
                Faculty Incharges <span className="font-chancery italic font-normal text-neutral-200 lowercase text-2xl sm:text-3xl">TechSrijan</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {FACULTY_INCHARGES.map((mentor) => (
                <div
                  key={mentor.id}
                  className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#180a0e]/85 via-[#0e0508]/85 to-[#070305]/95 border border-white/[0.1] hover:border-[var(--theme-accent)]/60 transition-all duration-400 text-center flex flex-col items-center backdrop-blur-xl shadow-xl hover:-translate-y-1"
                >
                  {/* Perfectly Fitted & Centered Circular Avatar (Zero Brochure Artifacts) */}
                  <div
                    className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 mb-4 bg-gradient-to-b from-white/20 via-black to-black border-2 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      borderColor: theme.accent,
                      boxShadow: `0 0 25px ${theme.accentGlow}`,
                    }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-black/70 shadow-inner">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        sizes="144px"
                        className="object-cover object-center filter contrast-[1.06]"
                      />
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-montserrat font-bold text-white group-hover:text-[var(--theme-accent-bright)] transition-colors">
                    {mentor.name}
                  </h4>
                  <div
                    className="font-bebas text-sm tracking-wider uppercase mt-1 transition-colors duration-300"
                    style={{ color: theme.accent }}
                  >
                    {mentor.role}
                  </div>
                  <div className="text-sm font-geist text-neutral-300 mt-1">
                    {mentor.designation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            THE CRUCIBLE OF GORAKHPUR: Compact Narrative
            ============================================================ */}
        <section className="mb-14 sm:mb-20 py-6 border-t border-white/[0.08]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start">
            <div className="space-y-4">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: theme.accent }}
              >
                THE 354-ACRE PROVING GROUND
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
                Forging Engineers in the{" "}
                <span className="font-chancery italic font-normal text-neutral-200">
                  Crucible of Real Action
                </span>
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-neutral-200 font-geist leading-relaxed">
                <p>
                  Every year, the storied 354-acre campus of{" "}
                  <span className="text-white font-semibold">
                    Madan Mohan Malaviya University of Technology
                  </span>{" "}
                  transforms into an open arena of technological conquest. Founded in 1962 as MMMEC and
                  elevated to university status in 2013, the institution has stood as an intellectual bastion
                  for more than six decades.
                </p>
                <p>
                  TechSrijan was born out of a relentless belief: that true engineering begins where classroom
                  blackboards end. Over three days, students leave lecture halls behind to battle in bullet-proof
                  combat cages, debug deep-learning models in 24-hour hackathons, tear down combustion engines,
                  and stress-test structural bridges.
                </p>
                <p>
                  With over <span style={{ color: theme.accent }} className="font-semibold transition-colors duration-300">25,000+ expected footfall</span> hailing from prestigious institutions
                  including IITs, NITs, and premier universities, TechSrijan provides a proving ground where
                  merit is sovereign and lifelong collaborations are forged.
                </p>
              </div>
            </div>

            {/* Right: Blockquote & Campus Overview */}
            <div className="space-y-6 pt-2">
              <div
                className="border-l-2 pl-6 space-y-3 transition-colors duration-300"
                style={{ borderColor: theme.accent }}
              >
                <p className="font-chancery italic text-lg sm:text-xl lg:text-2xl text-neutral-100 leading-relaxed">
                  “The arena does not reward passive credentials. It honors the machine that runs under stress,
                  the algorithm that executes without failure, and the resolve of students who refuse to yield.”
                </p>
                <div
                  className="text-sm font-bebas tracking-widest uppercase transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  — TechSrijan &apos;27 Convocation
                </div>
              </div>

              {/* Campus Facility Details */}
              <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-sm font-bebas tracking-wider uppercase text-white">
                  <Building2 className="h-4 w-4" style={{ color: theme.accent }} />
                  <span>Campus Facilities & Arenas</span>
                </div>
                <p className="text-sm sm:text-base text-neutral-200 font-geist leading-relaxed">
                  Hosted across MMMUT&apos;s apex campus infrastructure: the air-conditioned 800-seat Multi-Purpose Hall (MPH),
                  Pushpagiri Lecture Hall Complex, Information Technology Resource Centre (ITRC) with 1 Gbps NKN high-speed
                  computing labs, the 12-acre Shaheed Bandhu Singh Stadium for drone and RC flight arenas, and university
                  residential halls for visiting national delegates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TECHNICAL SUB-COUNCIL & SOCIETIES: Compact Showcase
            ============================================================ */}
        <section className="mb-14 sm:mb-20 py-6 border-t border-white/[0.08]">
          <div className="mb-8 max-w-2xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-1.5 transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              PILLARS OF EXECUTION
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery italic font-normal text-neutral-200 mr-2">
                Technical Sub-Council &amp;
              </span>
              <span>Specialist Societies</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-200 font-geist">
              Under the apex governance of the Technical Sub-Council (TSC), student societies spearhead
              specialized engineering disciplines — powering 25+ flagship events across robotics, coding, aeromodelling, automotive, and innovation.
            </p>
          </div>

          {/* Clean Horizontal Tabs with Dark Imperial Styling */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8 border-b border-white/[0.08] pb-5">
            {ABOUT_HOUSES.map((house) => {
              const isSelected = house.id === activeHouseId;
              return (
                <button
                  key={house.id}
                  onClick={() => setActiveHouseId(house.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-montserrat font-semibold tracking-wider transition-all duration-300 cursor-pointer ${isSelected
                      ? `${theme.activeHouseTabBg} border ${theme.activeHouseTabBorder} ${theme.activeHouseTabShadow} scale-105`
                      : "bg-[#0e0508]/80 text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
                    }`}
                >
                  {house.shortName}
                </button>
              );
            })}
          </div>

          {/* Active House Dossier */}
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-14 items-start">
            <div className="space-y-4">
              <div className="font-bebas text-sm sm:text-base tracking-widest uppercase" style={{ color: activeHouse.accentColor }}>
                {activeHouse.designation}
              </div>

              <h3 className="text-2xl sm:text-4xl font-montserrat font-black text-white tracking-tight">
                {activeHouse.fullName}
              </h3>

              <div className="text-lg sm:text-xl font-chancery italic text-neutral-200">
                &ldquo;{activeHouse.motto}&rdquo;
              </div>

              <p className="text-sm sm:text-base text-neutral-200 font-geist leading-relaxed max-w-xl">
                {activeHouse.summary}
              </p>

              {/* Directives List */}
              <div className="pt-4 border-t border-white/[0.08]">
                <h4 className="font-bebas text-sm sm:text-base tracking-wider text-white uppercase mb-3">
                  Core Responsibilities
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2.5 text-sm text-neutral-200 font-geist">
                  {activeHouse.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: activeHouse.accentColor }}
                      />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Flagship Arenas List with Dark Buttons */}
            <div className="space-y-4 pt-1">
              <h4 className="font-bebas text-sm sm:text-base tracking-wider text-white uppercase mb-2">
                Flagship Events & Arenas
              </h4>
              <div className="space-y-2">
                {activeHouse.flagshipEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.08] text-sm sm:text-base text-white font-geist font-medium hover:border-[var(--theme-accent)] transition-colors"
                  >
                    <span>{event}</span>
                    <ArrowUpRight className="h-4 w-4 text-neutral-400" />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/events"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-montserrat font-bold uppercase tracking-wider ${theme.primaryBtnClass} border ${theme.primaryBtnBorder} ${theme.primaryBtnShadow} transition-all hover:brightness-125`}
                >
                  <span>View All {activeHouse.shortName} Events</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-montserrat font-semibold uppercase tracking-wider ${theme.secondaryBtnClass} transition-colors`}
                >
                  <span>Meet Coordinators</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            HISTORICAL MILESTONES (Compact Rhythm & Rich Dark Gradient)
            ============================================================ */}
        <section className="mb-14 sm:mb-20 py-6 border-t border-white/[0.08]">
          <div className="mb-10 max-w-2xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-1.5 transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              CHRONICLES OF GLORY
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery italic font-normal text-neutral-200 mr-2">
                Milestones &
              </span>
              <span>Heritage</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-200 font-geist">
              Six decades of educational heritage and twenty-five years of technical fest legacy
              culminate in this year&apos;s grandest edition.
            </p>
          </div>

          {/* Horizontal Milestone Track with Richer Contrast Numbers */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-4 border-t border-white/[0.1]">
            {ABOUT_TIMELINE.map((item) => (
              <div key={item.year} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl sm:text-4xl font-montserrat font-black text-transparent bg-clip-text transition-all duration-300"
                    style={{
                      backgroundImage: theme.timelineYearGradient,
                    }}
                  >
                    {item.year}
                  </span>
                  <span
                    className="font-bebas text-sm tracking-wider uppercase transition-colors duration-300"
                    style={{ color: theme.accent }}
                  >
                    {item.era}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-montserrat font-bold text-white">
                  {item.title}
                </h3>
                <div className="font-chancery italic text-sm sm:text-base text-neutral-200">
                  {item.tagline}
                </div>
                <p className="text-sm text-neutral-200 font-geist leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-1.5 space-y-1">
                  {item.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="text-xs sm:text-sm text-neutral-200 font-geist flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            CORE PHILOSOPHY & TENETS (Compact Rhythm)
            ============================================================ */}
        <section className="mb-14 sm:mb-20 py-6 border-t border-b border-white/[0.08]">
          <div className="mb-10 max-w-2xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-1.5 transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              FOUNDATIONAL PILLARS
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery italic font-normal text-neutral-200 mr-2">
                The Four Tenets of
              </span>
              <span>Our Creed</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-200 font-geist">
              Principles guiding the arena judges, student conveners, and contestants who step onto the fest grounds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {ABOUT_TENETS.map((tenet) => (
              <div key={tenet.number} className="space-y-1.5">
                <div
                  className="text-3xl font-montserrat font-black mb-1 transition-colors duration-300 opacity-75"
                  style={{ color: theme.accent }}
                >
                  {tenet.number}
                </div>
                <h3 className="font-bebas text-base sm:text-lg tracking-wider text-white uppercase">
                  {tenet.title}
                </h3>
                <div className="font-chancery italic text-sm sm:text-base text-neutral-200">
                  {tenet.subtitle}
                </div>
                <p className="text-sm text-neutral-200 font-geist leading-relaxed pt-0.5">
                  {tenet.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            CAMPUS, CONNECTIVITY & LOGISTICS
            ============================================================ */}
        <section className="mb-14 sm:mb-20 py-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: theme.accent }}
              >
                CAMPUS NAVIGATION
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
                Getting to the Campus:{" "}
                <span className="font-chancery italic font-normal text-neutral-200">
                  Gorakhpur, UP
                </span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 font-geist leading-relaxed">
                Located along Deoria Road in Gorakhpur, Madan Mohan Malaviya University of Technology is
                easily reachable from all major metro hubs across India via express railway corridors and domestic flights.
              </p>

              <div className="space-y-3.5 pt-3 border-t border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <Train className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                  <div>
                    <span className="font-bebas text-sm sm:text-base tracking-wider uppercase text-white block">By Railway (Gorakhpur Junction - 9.2 KM):</span>
                    <p className="text-sm text-neutral-200 font-geist mt-0.5">
                      Major railway division headquarters situated just 9 km from the campus with 24/7 cabs and auto-rickshaws along Deoria Road.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                  <div>
                    <span className="font-bebas text-sm sm:text-base tracking-wider uppercase text-white block">By Air (Gorakhpur Airport - 5.4 KM):</span>
                    <p className="text-sm text-neutral-200 font-geist mt-0.5">
                      Direct domestic flights connect Gorakhpur with New Delhi, Mumbai, Kolkata, Bengaluru, and Hyderabad. Quick 12-min cab ride.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.accent }} />
                  <div>
                    <span className="font-bebas text-sm sm:text-base tracking-wider uppercase text-white block">On-Campus Hospitality & Security:</span>
                    <p className="text-sm text-neutral-200 font-geist mt-0.5">
                      Verified student delegate pass holders receive secure residential dorms, mess catering, and round-the-clock festival security.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Campus Overview Specs */}
            <div className="lg:col-span-5 space-y-4 pt-2 lg:border-l lg:border-white/[0.08] lg:pl-10">
              <h3 className="font-bebas text-base tracking-wider text-white uppercase">
                Campus Overview
              </h3>

              <div className="space-y-2 text-sm sm:text-base font-geist">
                <div className="flex justify-between py-1.5 border-b border-white/[0.08]">
                  <span className="text-neutral-400">Institution</span>
                  <span className="text-white font-semibold">MMMUT Gorakhpur</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.08]">
                  <span className="text-neutral-400">Governing Body</span>
                  <span className="text-white font-semibold">Technical Sub-Council (TSC)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.08]">
                  <span className="text-neutral-400">Campus Area</span>
                  <span className="text-white font-semibold">354+ Acres</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.08]">
                  <span className="text-neutral-400">Festival Dates</span>
                  <span className="font-bold" style={{ color: theme.accent }}>25 – 27 Dec 2026</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-400">Official Portal</span>
                  <span className="text-white">techsrijan.mmmut.ac.in</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/accommodation"
                  className="inline-flex items-center gap-2 text-sm font-montserrat font-semibold hover:text-white transition-colors"
                  style={{ color: theme.accent }}
                >
                  <span>View Accommodation Guidelines</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CALL TO ACTION with Dark Imperial Crimson Button
            ============================================================ */}
        <section className="pt-12 sm:pt-14 pb-8 sm:pb-10 border-t border-white/[0.1] text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              IMPERIUM : REQUIEM CONCLAVE
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
              Claim Your Proving Ground at{" "}
              <span
                className="inline-block font-chancery italic font-normal text-transparent bg-clip-text pr-4 transition-all duration-300"
                style={{
                  backgroundImage: theme.headlineGradient,
                  filter: theme.headlineDropShadow,
                }}
              >
                TechSrijan &apos;27
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 font-geist leading-relaxed max-w-xl mx-auto">
              Registrations for national competitions, hackathons, and robo-cages are now active.
              Assemble your crew, calibrate your machines, and join over 25,000+ innovators at MMMUT Gorakhpur.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/events"
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-montserrat font-bold uppercase tracking-wider ${theme.primaryBtnClass} border ${theme.primaryBtnBorder} ${theme.primaryBtnShadow} transition-all duration-300 hover:scale-105 hover:brightness-125`}
              >
                <span>Register for Competitions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-montserrat font-semibold uppercase tracking-wider ${theme.secondaryBtnClass} transition-all backdrop-blur-xl`}
              >
                <span>Meet The Council</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Clean Footer (Positioned Close to End of Page) */}
        <footer className="pt-5 pb-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08] text-sm font-sans text-neutral-300">
          <div>
            Follow <span className="text-white font-medium">@techsrijan_mmmut</span> for live announcements and event schedules
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5">
            {[
              {
                icon: IconInstagram,
                label: "Instagram",
                href: "https://www.instagram.com/techsrijan_mmmut",
              },
              {
                icon: IconLinkedin,
                label: "LinkedIn",
                href: "https://www.linkedin.com/school/mmmutgorakhpur",
              },
              {
                icon: IconX,
                label: "X",
                href: "https://twitter.com/techsrijan_mmmut",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/[0.12] hover:border-white/[0.3] text-neutral-200 hover:text-white transition-all shadow-md hover:scale-110"
              >
                <social.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

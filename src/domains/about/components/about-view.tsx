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
import { usePageTheme } from "@/core";

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

function IconGithub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
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
  const pageTheme = usePageTheme();
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
    <div className="relative min-h-screen bg-[#070712] text-white selection:bg-[#79C7E3]/30 selection:text-white font-sans overflow-x-hidden">
      {/* ============================================================
          CLEAN AMBIENT GRADIENT MESH BACKGROUND (Zero Text, Pure Atmosphere)
          ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/images/about/about-mesh-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#070712]/40 via-[#070712]/60 to-[#070712]/95" />
      </div>

      {/* 3D Atmospheric Canvas */}
      <About3DScene />

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.08]">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress}%`,
            backgroundImage: `linear-gradient(to right, ${pageTheme.accent}, ${pageTheme.accentBright}, ${pageTheme.accent})`,
            boxShadow: `0 0 12px ${pageTheme.accentGlow}`,
          }}
        />
      </div>

      {/* ============================================================
          FULL-FRAME CONTAINER: Content Spans Across the Entire Page
          ============================================================ */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-36">

        {/* ============================================================
            FULL-FRAME HERO: Grand Editorial Typography Spanning Screen
            ============================================================ */}
        <section className="pt-6 sm:pt-14 pb-20 sm:pb-28">
          <div className="space-y-8 lg:space-y-12">
            
            {/* Grand Headline: HELLO ENGINEERS ! WE ARE TECHSRIJAN '27 */}
            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-montserrat font-black tracking-tight text-white uppercase leading-[0.92]">
                HELLO ENGINEERS !
              </h1>
              <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-montserrat font-black tracking-tight uppercase leading-[0.95]">
                <span className="text-white">WE ARE </span>
                <span
                  className="font-chancery font-normal text-transparent bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, #FFFFFF, ${pageTheme.headingVia}, ${pageTheme.headingTo})`,
                    filter: `drop-shadow(0 2px 25px ${pageTheme.accentGlow})`,
                  }}
                >
                  techsrijan &apos;27
                </span>
              </div>
            </div>

            {/* Thematic Subhead */}
            <div className="space-y-1 max-w-5xl">
              <div className="font-bebas text-2xl sm:text-3xl lg:text-4xl tracking-wider text-zinc-300 uppercase">
                EASTERN INDIA&apos;S APEX
              </div>
              <div
                className="font-chancery text-2xl sm:text-3xl lg:text-4xl transition-colors duration-300"
                style={{ color: pageTheme.accentBright }}
              >
                Crucible of Engineers, Inventors & Disruptors
              </div>
            </div>

            {/* Iconic Engineering Manifesto - Spanning Full Width (Zero Box) */}
            <div className="pt-6 pb-4 border-t border-b border-white/[0.08] max-w-6xl">
              <p className="text-lg sm:text-2xl lg:text-3xl font-geist font-light tracking-wide text-zinc-200 uppercase leading-relaxed">
                AND THIS IS THE CITADEL. YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-[#79C7E3] decoration-2 underline-offset-8 hover:text-[#79C7E3] transition-colors"
                >
                  ROBO-WARS
                </Link>
                . YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-[#CAA4CF] decoration-2 underline-offset-8 hover:text-[#CAA4CF] transition-colors"
                >
                  24H HACKATHONS
                </Link>
                . YES, WE DO{" "}
                <Link
                  href="/events"
                  className="underline decoration-[#E8D4FF] decoration-2 underline-offset-8 hover:text-[#E8D4FF] transition-colors"
                >
                  BAJA RACING
                </Link>
                . AND YES, WE{" "}
                <Link
                  href="/events"
                  className="underline decoration-[#D4A843] decoration-2 underline-offset-8 hover:text-[#D4A843] transition-colors"
                >
                  ENGINEER THE FUTURE
                </Link>
                .
              </p>
            </div>

            {/* Narrative & Action Row */}
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-end pt-2">
              <p className="text-base sm:text-lg text-zinc-300 font-geist leading-relaxed">
                TechSrijan is the flagship annual techno-management festival of{" "}
                <span className="text-white font-semibold">Madan Mohan Malaviya University of Technology (MMMUT) Gorakhpur</span>,
                bringing together technology, innovation, coding, robotics, and creative competition with 25K+ expected footfall nationwide.
                Governed by the Technical Sub-Council under the apex Council of Student Activities (CSA).
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                <Link
                  href="/events"
                  className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-montserrat font-bold uppercase tracking-wider ${pageTheme.btnText} transition-transform duration-300 hover:scale-105`}
                  style={{
                    backgroundImage: `linear-gradient(to right, ${pageTheme.headingTo}, ${pageTheme.accentBright}, ${pageTheme.headingTo})`,
                    boxShadow: `0 0 30px ${pageTheme.accentGlow}`,
                  }}
                >
                  <span>Explore 25+ Experiences</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-7 py-3.5 text-xs font-montserrat font-semibold uppercase tracking-wider text-white transition-all backdrop-blur-xl"
                >
                  <span>Command Roster</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            METRICS STRIP (Borderless Full-Width Horizontal Telemetry)
            ============================================================ */}
        <section className="py-12 border-t border-b border-white/[0.1] mb-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {ABOUT_STATS.map((stat, idx) => (
              <div
                key={stat.id}
                className={`space-y-2 ${
                  idx > 0 ? "lg:border-l lg:border-white/[0.08] lg:pl-10" : ""
                }`}
              >
                <div
                  className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-transparent bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 50%, ${pageTheme.headingTo} 100%)`,
                  }}
                >
                  <StatCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-base font-bebas tracking-wider text-white uppercase">
                  {stat.label}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-geist leading-relaxed">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            BORDERLESS FULL-FRAME 3D TECHSRIJAN EMBLEM (Zero Box)
            ============================================================ */}
        <TechSrijanLogoScrollReveal />

        {/* ============================================================
            PATRONAGE & DIRECTORATE (Full-Frame Editorial Spreads)
            ============================================================ */}
        <section className="mb-36 pt-4">
          {/* Section Title */}
          <div className="mb-20 sm:mb-28 max-w-4xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              APEX UNIVERSITY LEADERSHIP
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery font-normal text-[#E8D4FF] mr-3">
                Patronage &
              </span>
              <span>Directorate</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 font-geist leading-relaxed max-w-2xl">
              Under the apex direction of university leadership and the Council of Student Activities (CSA),
              TechSrijan &apos;27 operates as Northern India&apos;s most formidable proving ground for engineers.
            </p>
          </div>

          {/* Full-Frame Editorial Leader Showcase */}
          <div className="space-y-28 sm:space-y-36">
            {PATRON_DIRECTORATE.map((patron, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={patron.id}
                  className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center py-6 border-b border-white/[0.06] pb-24"
                >
                  {/* Portrait Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative group max-w-lg mx-auto lg:max-w-none">
                      {/* Ambient Bloom */}
                      <div
                        className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: `${patron.accent}33` }}
                      />

                      {/* Clean Framed Portrait */}
                      <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.12] bg-black/40 shadow-2xl">
                        <Image
                          src={patron.image}
                          alt={patron.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Editorial Content Column */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="space-y-6">
                      {/* Designation */}
                      <div className="font-bebas text-sm sm:text-base tracking-widest uppercase" style={{ color: patron.accent }}>
                        {patron.title}
                      </div>

                      {/* Name Headline */}
                      <h3 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-[1.08]">
                        {patron.name}
                      </h3>

                      {/* Role & Department */}
                      <div className="space-y-1">
                        <div className="text-base sm:text-lg font-bebas tracking-wide uppercase text-[#79C7E3]">
                          {patron.role}
                        </div>
                        <div className="text-sm font-geist text-zinc-300">
                          {patron.department}
                        </div>
                      </div>

                      {/* Bio Narrative */}
                      <p className="text-base text-zinc-200/90 font-geist leading-relaxed max-w-2xl">
                        {patron.bio}
                      </p>

                      {/* Numbered Directives */}
                      <div className="space-y-3.5 border-t border-white/[0.1] pt-6 max-w-2xl">
                        {patron.initiatives.map((init, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-4 text-sm text-zinc-200 font-geist group/init"
                          >
                            <span
                              className="font-bold pt-0.5 select-none"
                              style={{ color: patron.accent }}
                            >
                              {i + 1}.
                            </span>
                            <span className="leading-relaxed group-hover/init:text-white transition-colors">
                              {init}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Faculty Incharges Grid (From Official Brochure) */}
          <div className="mt-20 pt-16 border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                MENTORSHIP COUNCIL
              </div>
              <h3 className="text-2xl sm:text-4xl font-montserrat font-black tracking-tight text-white uppercase">
                Faculty Incharges <span className="font-chancery font-normal text-[#E8D4FF] lowercase text-3xl sm:text-4xl">TechSrijan</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {FACULTY_INCHARGES.map((mentor) => (
                <div
                  key={mentor.id}
                  className="group relative rounded-3xl p-6 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 text-center flex flex-col items-center"
                >
                  <div
                    className="relative w-36 h-36 rounded-full overflow-hidden mb-5 border-2 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      borderColor: pageTheme.accent,
                      boxShadow: `0 0 25px ${pageTheme.accentGlow}`,
                    }}
                  >
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      sizes="144px"
                      className="object-cover object-top filter contrast-[1.05]"
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-montserrat font-bold text-white group-hover:text-[#79C7E3] transition-colors">
                    {mentor.name}
                  </h4>
                  <div className="font-bebas text-sm tracking-wider uppercase mt-1" style={{ color: pageTheme.accent }}>
                    {mentor.role}
                  </div>
                  <div className="text-xs font-geist text-zinc-400 mt-0.5">
                    {mentor.designation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            THE CRUCIBLE OF GORAKHPUR: Full-Frame Narrative
            ============================================================ */}
        <section className="mb-36 py-12 border-t border-white/[0.08]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
            <div className="space-y-6">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                THE 354-ACRE PROVING GROUND
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
                Forging Engineers in the{" "}
                <span className="font-chancery font-normal text-[#E8D4FF]">
                  Crucible of Real Action
                </span>
              </h2>

              <div className="space-y-4 text-base text-zinc-200 font-geist leading-relaxed">
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
                  With over <span style={{ color: pageTheme.accent }} className="font-semibold transition-colors duration-300">25,000+ expected footfall</span> hailing from prestigious institutions
                  including IITs, NITs, and premier universities, TechSrijan provides a proving ground where
                  merit is sovereign and lifelong collaborations are forged.
                </p>
              </div>
            </div>

            {/* Right: Blockquote & Campus Overview */}
            <div className="space-y-8 pt-4">
              <div
                className="border-l-2 pl-8 space-y-4 transition-colors duration-300"
                style={{ borderColor: pageTheme.accent }}
              >
                <p className="font-chancery text-xl sm:text-2xl lg:text-3xl text-zinc-100 leading-relaxed">
                  “The arena does not reward passive credentials. It honors the machine that runs under stress,
                  the algorithm that executes without failure, and the resolve of students who refuse to yield.”
                </p>
                <div
                  className="text-sm font-bebas tracking-widest uppercase transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  — TechSrijan &apos;27 Convocation
                </div>
              </div>

              {/* Campus Facility Details */}
              <div className="space-y-3 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-base font-bebas tracking-wider uppercase text-white">
                  <Building2 className="h-5 w-5" style={{ color: pageTheme.accent }} />
                  <span>Campus Facilities & Arenas</span>
                </div>
                <p className="text-sm text-zinc-300 font-geist leading-relaxed">
                  Equipped with high-performance computing centers (Aryabhatta & Ramanujan), a 2,000-seat multi-purpose
                  auditorium, outdoor sports stadiums for drone arenas, and dedicated hostel quarters for visiting delegates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            THE FIVE SPECIALIST SOCIETIES: Full-Frame Showcase
            ============================================================ */}
        <section className="mb-36 py-12 border-t border-white/[0.08]">
          <div className="mb-12 max-w-3xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              PILLARS OF EXECUTION
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery font-normal text-[#E8D4FF] mr-3">
                The Five
              </span>
              <span>Specialist Societies</span>
            </h2>
            <p className="mt-4 text-base text-zinc-300 font-geist">
              Under the apex direction of the Technical Sub-Council, five specialist student societies spearhead
              individual disciplines — ensuring world-class execution across robotics, automotive, AI, and systems.
            </p>
          </div>

          {/* Clean Horizontal Tabs (Full Frame) */}
          <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-white/[0.08] pb-6">
            {ABOUT_HOUSES.map((house) => {
              const isSelected = house.id === activeHouseId;
              return (
                <button
                  key={house.id}
                  onClick={() => setActiveHouseId(house.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-montserrat font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-white text-black shadow-lg scale-105"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {house.shortName}
                </button>
              );
            })}
          </div>

          {/* Active House Full-Width Dossier */}
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-start">
            <div className="space-y-6">
              <div className="font-bebas text-sm sm:text-base tracking-widest uppercase" style={{ color: activeHouse.accentColor }}>
                {activeHouse.designation}
              </div>

              <h3 className="text-3xl sm:text-5xl font-montserrat font-black text-white tracking-tight">
                {activeHouse.fullName}
              </h3>

              <div className="text-xl sm:text-2xl font-chancery text-zinc-200">
                &ldquo;{activeHouse.motto}&rdquo;
              </div>

              <p className="text-base text-zinc-200 font-geist leading-relaxed max-w-2xl">
                {activeHouse.summary}
              </p>

              {/* Directives List */}
              <div className="pt-6 border-t border-white/[0.08]">
                <h4 className="font-bebas text-base tracking-wider text-white uppercase mb-4">
                  Core Responsibilities
                </h4>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-300 font-geist">
                  {activeHouse.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
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

            {/* Right: Flagship Arenas List */}
            <div className="space-y-6 pt-2">
              <h4 className="font-bebas text-base tracking-wider text-white uppercase mb-3">
                Flagship Events & Arenas
              </h4>
              <div className="space-y-2.5">
                {activeHouse.flagshipEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-white/[0.08] text-base text-white font-geist font-medium hover:border-[#79C7E3] transition-colors"
                  >
                    <span>{event}</span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-montserrat font-bold uppercase tracking-wider text-black transition-all hover:opacity-90 shadow-md"
                  style={{ backgroundColor: activeHouse.accentColor }}
                >
                  <span>View All {activeHouse.shortName} Events</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-montserrat font-semibold uppercase tracking-wider text-zinc-200 border border-white/[0.15] hover:bg-white/[0.08] transition-colors"
                >
                  <span>Meet Coordinators</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            HISTORICAL MILESTONES: 1962 TO 2026-27 (Full-Frame Track)
            ============================================================ */}
        <section className="mb-36 py-12 border-t border-white/[0.08]">
          <div className="mb-14 max-w-3xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              CHRONICLES OF GLORY
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery font-normal text-[#E8D4FF] mr-3">
                Milestones &
              </span>
              <span>Heritage</span>
            </h2>
            <p className="mt-4 text-base text-zinc-300 font-geist">
              Six decades of educational heritage and twenty-five years of technical fest legacy
              culminate in this year&apos;s grandest edition.
            </p>
          </div>

          {/* Full-Width Horizontal Milestone Track */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-6 border-t border-white/[0.1]">
            {ABOUT_TIMELINE.map((item) => (
              <div key={item.year} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-4xl sm:text-5xl font-montserrat font-black text-transparent bg-clip-text transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, #FFFFFF, ${pageTheme.headingTo})`,
                    }}
                  >
                    {item.year}
                  </span>
                  <span
                    className="font-bebas text-sm tracking-wider uppercase transition-colors duration-300"
                    style={{ color: pageTheme.accent }}
                  >
                    {item.era}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-montserrat font-bold text-white">
                  {item.title}
                </h3>
                <div className="font-chancery text-base text-zinc-300">
                  {item.tagline}
                </div>
                <p className="text-sm text-zinc-300 font-geist leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 space-y-1.5">
                  {item.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="text-xs text-zinc-300 font-geist flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: pageTheme.accent }}
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
            CORE PHILOSOPHY & TENETS (Full-Width Creed)
            ============================================================ */}
        <section className="mb-36 py-12 border-t border-b border-white/[0.08]">
          <div className="mb-14 max-w-3xl">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              FOUNDATIONAL PILLARS
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
              <span className="font-chancery font-normal text-[#E8D4FF] mr-3">
                The Four Tenets of
              </span>
              <span>Our Creed</span>
            </h2>
            <p className="mt-4 text-base text-zinc-300 font-geist">
              Principles guiding the arena judges, student conveners, and contestants who step onto the fest grounds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {ABOUT_TENETS.map((tenet) => (
              <div key={tenet.number} className="space-y-2">
                <div
                  className="text-4xl font-montserrat font-black mb-2 transition-colors duration-300 opacity-60"
                  style={{ color: pageTheme.accent }}
                >
                  {tenet.number}
                </div>
                <h3 className="font-bebas text-xl tracking-wider text-white uppercase">
                  {tenet.title}
                </h3>
                <div className="font-chancery text-base sm:text-lg text-zinc-200">
                  {tenet.subtitle}
                </div>
                <p className="text-sm text-zinc-300 font-geist leading-relaxed pt-1">
                  {tenet.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            CAMPUS, CONNECTIVITY & LOGISTICS (Full Frame)
            ============================================================ */}
        <section className="mb-36 py-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div
                className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                CAMPUS NAVIGATION
              </div>
              <h2 className="text-3xl sm:text-5xl font-montserrat font-black tracking-tight text-white leading-tight">
                Getting to the Campus:{" "}
                <span className="font-chancery font-normal text-[#E8D4FF]">
                  Gorakhpur, UP
                </span>
              </h2>
              <p className="text-base text-zinc-200 font-geist leading-relaxed">
                Located along Deoria Road in Gorakhpur, Madan Mohan Malaviya University of Technology is
                easily reachable from all major metro hubs across India via express railway corridors and domestic flights.
              </p>

              <div className="space-y-5 pt-4 border-t border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <Train className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                  <div>
                    <span className="font-bebas text-base tracking-wider uppercase text-white block">By Railway (Gorakhpur Junction - 9.2 KM):</span>
                    <p className="text-sm text-zinc-300 font-geist mt-0.5">
                      Major railway division headquarters situated just 9 km from the campus with 24/7 cabs and auto-rickshaws along Deoria Road.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Plane className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                  <div>
                    <span className="font-bebas text-base tracking-wider uppercase text-white block">By Air (Gorakhpur Airport - 5.4 KM):</span>
                    <p className="text-sm text-zinc-300 font-geist mt-0.5">
                      Direct domestic flights connect Gorakhpur with New Delhi, Mumbai, Kolkata, Bengaluru, and Hyderabad. Quick 12-min cab ride.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                  <div>
                    <span className="font-bebas text-base tracking-wider uppercase text-white block">On-Campus Hospitality & Security:</span>
                    <p className="text-sm text-zinc-300 font-geist mt-0.5">
                      Verified student delegate pass holders receive secure residential dorms, mess catering, and round-the-clock festival security.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Campus Overview Specs */}
            <div className="lg:col-span-5 space-y-6 pt-4 lg:border-l lg:border-white/[0.08] lg:pl-12">
              <h3 className="font-bebas text-lg tracking-wider text-white uppercase">
                Campus Overview
              </h3>

              <div className="space-y-3 text-sm font-geist">
                <div className="flex justify-between py-2 border-b border-white/[0.08]">
                  <span className="text-zinc-400">Institution</span>
                  <span className="text-white font-semibold">MMMUT Gorakhpur</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.08]">
                  <span className="text-zinc-400">Governing Body</span>
                  <span className="text-white font-semibold">Technical Sub-Council (TSC)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.08]">
                  <span className="text-zinc-400">Campus Area</span>
                  <span className="text-white font-semibold">354+ Acres</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.08]">
                  <span className="text-zinc-400">Festival Dates</span>
                  <span className="font-bold" style={{ color: pageTheme.accent }}>25 – 27 Dec 2026</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-400">Official Portal</span>
                  <span className="text-white">techsrijan.mmmut.ac.in</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/accommodation"
                  className="inline-flex items-center gap-2 text-sm font-montserrat font-semibold hover:text-white transition-colors"
                  style={{ color: pageTheme.accent }}
                >
                  <span>View Accommodation Guidelines</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FULL-FRAME CALL TO ACTION
            ============================================================ */}
        <section className="py-20 border-t border-white/[0.1] text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div
              className="font-bebas text-sm sm:text-base tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              IMPERIUM : REQUIEM CONCLAVE
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight text-white leading-tight">
              Claim Your Proving Ground at{" "}
              <span
                className="font-chancery font-normal text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(to right, #FFFFFF, ${pageTheme.headingVia}, ${pageTheme.headingTo})`,
                  filter: `drop-shadow(0 2px 25px ${pageTheme.accentGlow})`,
                }}
              >
                TechSrijan &apos;27
              </span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 font-geist leading-relaxed max-w-2xl mx-auto">
              Registrations for national competitions, hackathons, and robo-cages are now active.
              Assemble your crew, calibrate your machines, and join over 25,000+ innovators at MMMUT Gorakhpur.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-montserrat font-bold uppercase tracking-wider ${pageTheme.btnText} transition-transform duration-300 hover:scale-105`}
                style={{
                  backgroundImage: `linear-gradient(to right, ${pageTheme.headingTo}, ${pageTheme.accentBright}, ${pageTheme.headingTo})`,
                  boxShadow: `0 0 35px ${pageTheme.accentGlow}`,
                }}
              >
                <span>Register for Competitions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.22] px-8 py-3.5 text-xs font-montserrat font-semibold uppercase tracking-wider text-white transition-all backdrop-blur-xl"
              >
                <span>Meet The Council</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Clean Footer */}
        <footer className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] text-sm font-sans text-zinc-400">
          <div>
            Follow <span className="text-white font-medium">@techsrijan_mmmut</span> for live announcements and event schedules
          </div>

          <div className="flex items-center gap-3">
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
                icon: IconGithub,
                label: "GitHub",
                href: "https://github.com",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.15] transition-all"
              >
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

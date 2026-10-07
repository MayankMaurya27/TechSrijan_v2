"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Crown,
  Shield,
  Layers,
} from "lucide-react";
import {
  ABOUT_STATS,
  ABOUT_HOUSES,
  ABOUT_TIMELINE,
  ABOUT_TENETS,
  ABOUT_FAQS,
  PATRON_DIRECTORATE,
  type HouseItem,
} from "../data/about-data";
import { About3DScene } from "./about-3d-scene";
import { TechSrijanLogoScrollReveal } from "./techsrijan-logo-scroll-reveal";

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

    observer.observe(node);
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
  const [activeHouseId, setActiveHouseId] = useState<string>("tsc");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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
    <div className="relative min-h-screen bg-[#080816] text-white selection:bg-[#79C7E3] selection:text-black font-sans">
      {/* ============================================================
          BACKGROUND: User-Provided Ambient Gradient Mesh + Vignette
          ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/images/about/about-mesh-bg.jpg')",
        }}
      >
        {/* Soft vignette overlay to preserve high readability and deep contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080816]/30 via-[#080816]/50 to-[#080816]/85" />
      </div>

      {/* 3D Interactive TechSrijan Crystal Monogram & Ambient Particle Canvas */}
      <About3DScene />

      {/* Futuristic Scroll Progress HUD line at very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.08]">
        <div
          className="h-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] transition-all duration-150 shadow-[0_0_12px_rgba(121,199,227,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-36 sm:px-8 lg:px-12">
        {/* ============================================================
            BRANDING HEADER: FR*NS / TECH*SRIJAN Editorial Star Identity
            ============================================================ */}
        <div className="flex items-center justify-between pt-4 pb-12 sm:pb-16 border-b border-white/[0.1]">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-2xl sm:text-3xl tracking-wide text-white uppercase flex items-center gap-1">
              TECH<span className="text-[#79C7E3] text-xl inline-block -translate-y-0.5">✳</span>SRIJAN
            </span>
            <span className="ml-3 hidden sm:inline-block rounded-full bg-white/[0.08] border border-white/[0.15] px-3 py-1 text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
              IMPERIUM : REQUIEM &apos;27
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
            <span className="hidden md:inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#79C7E3] animate-pulse" />
              MMMUT GORAKHPUR • EST. 1962
            </span>
            <span className="rounded-full bg-white/[0.1] px-3 py-1 text-[11px] font-sans font-medium text-white border border-white/[0.15]">
              25 — 27 DEC 2026
            </span>
          </div>
        </div>

        {/* ============================================================
            HERO SECTION: High-Fashion Editorial Typography (Matching Reference)
            ============================================================ */}
        <section className="pt-12 sm:pt-20 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
            {/* Left Column: Festival Manifesto & Action Links */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.15] px-4 py-1.5 text-xs font-mono text-[#79C7E3] mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ANNUAL TECHNO-MANAGEMENT FESTIVAL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
                Eastern India&apos;s Apex{" "}
                <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#A5E5FF] via-[#E8D4FF] to-[#D4A843]">
                  Crucible of Engineers
                </span>
              </h2>

              <p className="mt-6 text-sm sm:text-base text-zinc-200/90 font-sans leading-relaxed max-w-xl">
                TechSrijan is the flagship symposium of{" "}
                <span className="text-white font-semibold">MMMUT Gorakhpur</span>, bringing over
                5,000 brilliant student engineers, makers, and innovators together. Governed by the{" "}
                <span className="text-[#A5E5FF] font-medium">Technical Sub-Council (TSC)</span> under
                the Council of Student Activities (CSA).
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] px-7 py-3 text-sm font-sans font-bold text-black shadow-[0_0_30px_rgba(121,199,227,0.4)] transition-transform duration-300 hover:scale-105"
                >
                  <span>Explore 30+ Arenas</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-6 py-3 text-sm font-sans font-medium text-white transition-all backdrop-blur-xl"
                >
                  <span>Command Roster</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Reference-Inspired Statement Typography */}
            <div className="rounded-[2.5rem] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.15] p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.35)] relative overflow-hidden group">
              {/* Subtle radiant sheen */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#CAA4CF]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#79C7E3]/20 blur-3xl pointer-events-none" />

              <div className="text-right space-y-2 sm:space-y-3">
                <div className="text-xl sm:text-2xl lg:text-3xl font-sans font-light tracking-wide text-zinc-300 uppercase">
                  HELLO ENGINEERS !
                </div>
                <div className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white uppercase leading-[1.12]">
                  WE ARE{" "}
                  <span className="font-editorial italic font-normal text-[#E8D4FF] lowercase">
                    techsrijan &apos;27
                  </span>
                </div>
                <div className="text-lg sm:text-2xl lg:text-3xl font-sans font-normal tracking-wide text-zinc-200 uppercase leading-snug">
                  AND THIS IS THE CITADEL. YES, WE DO{" "}
                  <span className="underline decoration-[#79C7E3] decoration-2 underline-offset-8 hover:text-[#79C7E3] transition-colors cursor-pointer">
                    ROBO-WARS
                  </span>
                  . YES, WE DO{" "}
                  <span className="underline decoration-[#CAA4CF] decoration-2 underline-offset-8 hover:text-[#CAA4CF] transition-colors cursor-pointer">
                    24H HACKATHONS
                  </span>
                  . YES, WE DO{" "}
                  <span className="underline decoration-[#E8D4FF] decoration-2 underline-offset-8 hover:text-[#E8D4FF] transition-colors cursor-pointer">
                    BAJA RACING
                  </span>
                  . AND YES, WE{" "}
                  <span className="underline decoration-[#D4A843] decoration-2 underline-offset-8 hover:text-[#D4A843] transition-colors cursor-pointer">
                    ENGINEER THE FUTURE
                  </span>
                  .
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TECHSRIJAN LOGO 3D SCROLL REVEAL (Dynamic Entrance on Scroll)
            ============================================================ */}
        <TechSrijanLogoScrollReveal />

        {/* ============================================================
            METRICS TELEMETRY: Pill & Capsule Rounded Cards
            ============================================================ */}
        <section className="mb-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ABOUT_STATS.map((stat) => (
              <div
                key={stat.id}
                className="relative rounded-[2.2rem] bg-white/[0.04] border border-white/[0.12] p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#79C7E3]/60 hover:bg-white/[0.07] hover:-translate-y-1 group shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#A5E5FF] via-[#E8D4FF] to-[#D4A843]">
                  <StatCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-xs font-mono font-bold tracking-[0.18em] text-zinc-200 uppercase">
                  {stat.label}
                </div>
                <p className="mt-1 text-xs text-zinc-400 font-sans leading-relaxed">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            PATRONAGE & CITADEL DIRECTORATE: High-Fashion Rounded Cards
            ============================================================ */}
        <section className="mb-32">
          {/* Centered Editorial Section Header */}
          <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.15] px-4 py-1.5 text-xs font-mono text-[#79C7E3] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#D4A843]" />
              <span>EXECUTIVE CITADEL LEADERSHIP</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              <span className="font-editorial italic font-normal text-[#E8D4FF] mr-3">
                Patronage &
              </span>
              <span>Citadel Directorate</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              Under the apex direction of university administration and the Council of Student Activities (CSA),
              TechSrijan &apos;27 operates as Northern India&apos;s most formidable proving ground for engineers.
            </p>
          </div>

          {/* Alternating Editorial Showcase (Matching User Reference) */}
          <div className="space-y-20 sm:space-y-28 lg:space-y-36">
            {PATRON_DIRECTORATE.map((patron, index) => {
              const isEven = index % 2 === 1; // Row 2 has image on right
              return (
                <div
                  key={patron.id}
                  className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                >
                  {/* Portrait Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative group mx-auto max-w-md lg:max-w-none">
                      {/* Ambient Multi-Hue Glow Bloom behind portrait */}
                      <div
                        className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: `${patron.accent}33` }}
                      />

                      {/* Framed Image Card */}
                      <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border border-white/[0.18] bg-black/40 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                        <Image
                          src={patron.image}
                          alt={patron.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.05]"
                        />

                        {/* Subtle internal vignette for luxury editorial depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Top Pill Badge */}
                        <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border bg-black/60 backdrop-blur-md"
                            style={{ borderColor: `${patron.accent}66`, color: patron.accent }}
                          >
                            {patron.title}
                          </span>
                          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: patron.accent }} />
                        </div>

                        {/* Bottom Tag on image */}
                        <div className="absolute bottom-5 left-6 right-6 pointer-events-none">
                          <div className="text-[11px] font-mono font-bold tracking-wider text-zinc-300 uppercase">
                            {patron.badge}
                          </div>
                        </div>
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
                      {/* Editorial Kicker Label (like THEME ONE in reference) */}
                      <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase">
                        <span
                          className="h-1.5 w-6 rounded-full"
                          style={{ backgroundColor: patron.accent }}
                        />
                        <span style={{ color: patron.accent }}>{patron.kicker}</span>
                      </div>

                      {/* Large Editorial Name Headline */}
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-[1.14]">
                        {patron.name}
                      </h3>

                      {/* Role and Department */}
                      <div className="space-y-1">
                        <div className="text-base sm:text-lg font-sans font-semibold text-[#79C7E3]">
                          {patron.role}
                        </div>
                        <div className="text-xs sm:text-sm font-sans text-zinc-300">
                          {patron.department}
                        </div>
                      </div>

                      {/* Bio Narrative */}
                      <p className="text-sm sm:text-base text-zinc-200/90 font-sans leading-relaxed max-w-xl">
                        {patron.bio}
                      </p>

                      {/* Numbered Directives / Initiatives (Matching Reference 1, 2, 3, 4) */}
                      <div className="space-y-3.5 border-t border-white/[0.12] pt-6 max-w-xl">
                        {patron.initiatives.map((init, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-4 text-xs sm:text-sm text-zinc-200 font-sans group/init"
                          >
                            <span
                              className="font-mono text-xs font-bold pt-0.5 select-none"
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

                      {/* University Affiliation Line */}
                      <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="text-[#D4A843]">MMMUT GORAKHPUR</span>
                        <span className="text-zinc-600">•</span>
                        <span>EST. 1962</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[#79C7E3]">AUTONOMOUS STATE UNIVERSITY</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            EDITORIAL STORY: THE CRUCIBLE OF GORAKHPUR (Rounded Capsule)
            ============================================================ */}
        <section className="mb-28">
          <div className="rounded-[2.8rem] bg-white/[0.04] border border-white/[0.12] p-8 sm:p-12 lg:p-16 backdrop-blur-3xl relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                  Forging Engineers in the{" "}
                  <span className="font-editorial italic font-normal text-[#E8D4FF]">
                    Crucible of Real Action
                  </span>
                </h2>

                <div className="mt-6 space-y-4 text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
                  <p>
                    Every year, the storied 354-acre campus of{" "}
                    <span className="text-white font-semibold">
                      Madan Mohan Malaviya University of Technology
                    </span>{" "}
                    transforms into an open arena of technological conquest. Founded in 1962 as MMMEC and
                    elevated to university status in 2013, the institution has stood as an intellectual bastion
                    in northern India for more than six decades.
                  </p>
                  <p>
                    TechSrijan was born out of a relentless belief: that true engineering begins where classroom
                    blackboards end. Over three days, students leave lecture halls behind to battle in bullet-proof
                    combat cages, debug deep-learning models in 24-hour hackathons, tear down combustion engines,
                    and stress-test structural bridges.
                  </p>
                  <p>
                    With over <span className="text-[#79C7E3] font-semibold">5,000+ delegates</span> hailing from prestigious institutions
                    including IITs, NITs, and premier state universities, TechSrijan provides a proving ground where
                    merit is sovereign and lifelong engineering collaborations are forged.
                  </p>
                </div>
              </div>

              {/* Quote & Citadel Card */}
              <div className="space-y-6">
                <div className="rounded-[2rem] bg-black/40 border border-[#79C7E3]/30 p-8 shadow-[0_0_40px_rgba(121,199,227,0.12)] relative backdrop-blur-2xl">
                  <span className="text-5xl font-editorial text-[#79C7E3]/40 absolute top-4 left-5 select-none">
                    “
                  </span>
                  <p className="font-editorial italic text-base sm:text-lg text-zinc-100 leading-relaxed pt-4">
                    The arena does not reward passive credentials. It honors the machine that runs under stress,
                    the algorithm that executes without failure, and the resolve of students who refuse to yield.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/[0.1] flex items-center justify-between text-xs font-mono text-[#79C7E3]">
                    <span>IMPERIUM: REQUIEM</span>
                    <span>TECHSRIJAN &apos;27</span>
                  </div>
                </div>

                {/* Campus Infrastructure Snippet */}
                <div className="rounded-[2rem] bg-white/[0.04] border border-white/[0.1] p-6 text-xs text-zinc-300 font-sans space-y-2 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Building2 className="h-4 w-4 text-[#79C7E3]" />
                    <span>MMMUT Campus & Citadel Facilities</span>
                  </div>
                  <p className="text-zinc-400">
                    Equipped with high-performance computing centers (Aryabhatta & Ramanujan), a 2,000-seat multi-purpose
                    auditorium, outdoor sports stadiums for drone arenas, and dedicated hostel quarters for visiting delegates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            THE FIVE PILLARS OF COMMAND: Interactive Rounded Tabs
            ============================================================ */}
        <section className="mb-28">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
              <span className="font-editorial italic font-normal text-[#E8D4FF] mr-2 sm:mr-3">
                The Five
              </span>
              <span>Houses of Command</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-300 font-sans max-w-2xl">
              Under the apex direction of the Technical Sub-Council, five specialist societies spearhead
              individual disciplines — ensuring world-class execution across robotics, automotive, AI, and systems.
            </p>
          </div>

          {/* Society Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
            {ABOUT_HOUSES.map((house) => {
              const isSelected = house.id === activeHouseId;
              return (
                <button
                  key={house.id}
                  onClick={() => setActiveHouseId(house.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-105 font-bold"
                      : "bg-white/[0.05] text-zinc-300 border border-white/[0.12] hover:bg-white/[0.1] hover:text-white"
                  }`}
                >
                  {house.shortName}
                </button>
              );
            })}
          </div>

          {/* Active House Rounded Feature Card */}
          <div
            className="rounded-[2.8rem] bg-white/[0.04] border p-8 sm:p-12 backdrop-blur-3xl transition-all duration-500 relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
            style={{
              borderColor: activeHouse.badgeBorder,
              boxShadow: `0 0 50px ${activeHouse.glowColor}`,
            }}
          >
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border"
                    style={{
                      backgroundColor: activeHouse.badgeBg,
                      borderColor: activeHouse.badgeBorder,
                      color: activeHouse.accentColor,
                    }}
                  >
                    {activeHouse.designation}
                  </span>
                  <span className="text-xs font-mono text-zinc-300">
                    {activeHouse.established}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
                  {activeHouse.fullName}
                </h3>

                <div className="mt-2 text-sm font-editorial italic text-zinc-300">
                  &ldquo;{activeHouse.motto}&rdquo;
                </div>

                <p className="mt-6 text-sm text-zinc-200 font-sans leading-relaxed">
                  {activeHouse.summary}
                </p>

                {/* Scope & Responsibilities */}
                <div className="mt-8">
                  <div className="text-xs font-mono tracking-widest text-[#79C7E3] uppercase mb-3 font-semibold">
                    OPERATIONAL DIRECTIVES
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3 text-xs text-zinc-300 font-sans">
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

              {/* Right Column: Flagship Events & Action Links */}
              <div className="rounded-[2rem] bg-black/40 border border-white/[0.1] p-6 sm:p-8 space-y-6 backdrop-blur-2xl">
                <div>
                  <div className="text-xs font-mono tracking-widest text-zinc-300 uppercase mb-3">
                    FLAGSHIP ARENAS
                  </div>
                  <div className="space-y-2.5">
                    {activeHouse.flagshipEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-xs text-white font-medium hover:border-white/25 transition-colors"
                      >
                        <span>{event}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.1] flex flex-col gap-3">
                  <Link
                    href="/events"
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-sans font-semibold text-black transition-all hover:opacity-95 shadow-lg"
                    style={{ backgroundColor: activeHouse.accentColor }}
                  >
                    <span>View All {activeHouse.shortName} Events</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/team"
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-mono text-zinc-300 border border-white/[0.15] hover:bg-white/[0.08] transition-colors"
                  >
                    <span>Meet {activeHouse.shortName} Coordinators</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHRONO TIMELINE: 1962 TO 2026-27 (Genesis to Requiem)
            ============================================================ */}
        <section className="mb-28">
          <div className="mb-12 text-center sm:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
              <span className="font-editorial italic font-normal text-[#E8D4FF] mr-2 sm:mr-3">
                From 1962 to
              </span>
              <span>Imperium: Requiem</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-300 font-sans max-w-2xl">
              Six decades of educational heritage and twenty-five years of technical fest legacy
              culminate in this year&apos;s grandest arena.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {ABOUT_TIMELINE.map((item) => (
              <div
                key={item.year}
                className="relative rounded-[2.2rem] bg-white/[0.04] border border-white/[0.12] p-6 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#79C7E3]/50 hover:-translate-y-1 group shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A5E5FF] to-[#D4A843]">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#79C7E3] border border-[#79C7E3]/30 px-2.5 py-0.5 rounded-full bg-[#79C7E3]/10">
                      {item.era}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-white group-hover:text-[#E8D4FF] transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-mono text-zinc-400 mt-1">
                    {item.tagline}
                  </div>

                  <p className="mt-4 text-xs text-zinc-300 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-1.5">
                  {item.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="text-[10px] text-zinc-300 font-mono flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#79C7E3]" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            THE FOUR TENETS OF IMPERIUM (Fest Creed)
            ============================================================ */}
        <section className="mb-28">
          <div className="mb-12 text-center sm:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
              <span className="font-editorial italic font-normal text-[#E8D4FF] mr-2 sm:mr-3">
                The Four Tenets of
              </span>
              <span>Our Creed</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-300 font-sans max-w-2xl">
              Principles guiding the arena judges, student conveners, and contestants who step onto the fest grounds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_TENETS.map((tenet) => (
              <div
                key={tenet.number}
                className="rounded-[2.2rem] bg-white/[0.04] border border-white/[0.12] p-6 backdrop-blur-2xl transition-all duration-300 hover:border-[#79C7E3]/50 hover:bg-white/[0.08] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              >
                <div>
                  <div className="text-3xl font-serif font-bold text-[#79C7E3]/70 mb-3">
                    {tenet.number}
                  </div>
                  <h3 className="text-sm font-sans font-bold tracking-wider text-white uppercase">
                    {tenet.title}
                  </h3>
                  <div className="text-xs font-editorial italic text-zinc-300 mt-1">
                    {tenet.subtitle}
                  </div>
                  <p className="mt-4 text-xs text-zinc-300 font-sans leading-relaxed">
                    {tenet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            CAMPUS, CONNECTIVITY & CITADEL LOGISTICS
            ============================================================ */}
        <section className="mb-28">
          <div className="rounded-[2.8rem] bg-white/[0.04] border border-white/[0.14] p-8 sm:p-12 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
              <div>
                <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
                  Getting to the Citadel:{" "}
                  <span className="font-editorial italic font-normal text-[#E8D4FF]">
                    Gorakhpur, UP
                  </span>
                </h2>
                <p className="mt-4 text-sm text-zinc-200 font-sans leading-relaxed">
                  Located along Deoria Road in Gorakhpur, Madan Mohan Malaviya University of Technology is
                  easily reachable from all major metro hubs across India via express railway corridors and domestic flights.
                </p>

                <div className="mt-6 space-y-4 text-xs font-sans text-zinc-200">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <MapPin className="h-4 w-4 text-[#79C7E3] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">By Railway (GKP Junction):</span>
                      Gorakhpur Junction is a major railway division headquarters, situated just 9 km from the MMMUT campus with 24/7 cab and auto connections.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <Sparkles className="h-4 w-4 text-[#E8D4FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">By Air (Mahayogi Gorakhnath Airport - GOP):</span>
                      Direct domestic flights connect Gorakhpur with New Delhi, Mumbai, Kolkata, Bengaluru, and Hyderabad. Airport is 5 km from campus.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <Shield className="h-4 w-4 text-[#D4A843] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">On-Campus Hospitality & Security:</span>
                      Verified student delegate pass holders receive secure residential dorms, mess catering, and round-the-clock festival security.
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="rounded-[2.2rem] bg-black/40 border border-white/[0.12] p-6 sm:p-8 space-y-5 backdrop-blur-2xl">
                <div className="text-xs font-mono tracking-widest text-[#79C7E3] uppercase font-bold">
                  CITADEL DIRECTORY
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-white/[0.08]">
                    <span className="text-zinc-400">INSTITUTE</span>
                    <span className="text-white font-semibold">MMMUT Gorakhpur</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.08]">
                    <span className="text-zinc-400">GOVERNING APEX</span>
                    <span className="text-white font-semibold">Technical Sub-Council (TSC)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.08]">
                    <span className="text-zinc-400">CAMPUS SPRAWL</span>
                    <span className="text-white font-semibold">354+ Acres</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.08]">
                    <span className="text-zinc-400">DATES</span>
                    <span className="text-[#79C7E3] font-bold">25 – 27 Dec 2026</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">OFFICIAL PORTAL</span>
                    <span className="text-white">techsrijan.mmmut.ac.in</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/accommodation"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.18] py-3 text-xs font-sans font-medium text-white transition-all shadow-md"
                  >
                    <span>View Accommodation Guidelines</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FREQUENTLY ASKED QUESTIONS (Accordion)
            ============================================================ */}
        <section className="mb-28">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
              <span className="font-editorial italic font-normal text-[#E8D4FF] mr-2 sm:mr-3">
                Frequently Asked
              </span>
              <span>Questions</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-300 font-sans max-w-2xl">
              Everything you need to know about registering, competing, and lodging at TechSrijan &apos;27.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {ABOUT_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white/[0.04] border border-white/[0.1] overflow-hidden transition-all duration-300 hover:border-[#79C7E3]/40 backdrop-blur-xl"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-sans font-semibold text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-[#79C7E3] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-300 font-sans leading-relaxed border-t border-white/[0.08]">
                      <div className="mb-2 text-[10px] font-mono text-[#79C7E3] tracking-widest uppercase">
                        CATEGORY: {faq.category}
                      </div>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            EXECUTIVE CALL TO ACTION: STEP INTO THE ARENA
            ============================================================ */}
        <section className="rounded-[3rem] bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05] border border-white/[0.18] p-10 sm:p-16 text-center relative overflow-hidden backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              Claim Your Proving Ground in{" "}
              <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#A5E5FF] via-[#E8D4FF] to-[#D4A843]">
                Imperium: Requiem
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
              Registrations for national competitions, hackathons, and robo-cages are now active.
              Assemble your crew, calibrate your machines, and join over 5,000 engineers at MMMUT Gorakhpur.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] px-8 py-3.5 text-sm font-sans font-bold text-black shadow-[0_0_35px_rgba(121,199,227,0.45)] transition-transform duration-300 hover:scale-105"
              >
                <span>Register for Competitions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.22] px-8 py-3.5 text-sm font-sans font-medium text-white transition-all backdrop-blur-xl"
              >
                <span>Meet The Council</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            SOCIAL TRANSMISSIONS
            ============================================================ */}
        <section className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-white/[0.1] text-xs font-mono text-zinc-300">
          <div>
            <span className="font-semibold text-white">OFFICIAL CHANNELS</span>
            <span className="block text-[11px] text-zinc-400 mt-0.5 font-sans">
              Follow @techsrijan_mmmut for real-time fixtures, rulebooks, and results
            </span>
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.15] text-zinc-200 transition-all hover:border-[#79C7E3] hover:text-[#79C7E3] hover:bg-[#79C7E3]/15"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

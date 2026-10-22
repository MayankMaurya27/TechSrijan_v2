"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  Quote,
  Clock,
  Compass,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import { GUESTS_LIST, type GuestData } from "../data/guests-data";
import { useGuestsTheme } from "../data/guests-theme";
import { cn } from "@/core";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { FestFooter } from "@/shared/layout/fest-footer";

export function GuestsView() {
  const theme = useGuestsTheme();
  const hcVermaGuest = GUESTS_LIST.find((g) => g.id === "prof-hc-verma") || GUESTS_LIST[0];
  const poonamTandonGuest =
    GUESTS_LIST.find((g) => g.id === "prof-poonam-tandon") || GUESTS_LIST[1];

  const [activeGuestId, setActiveGuestId] = useState<string>("prof-hc-verma");
  const [selectedHcPhoto, setSelectedHcPhoto] = useState<number>(0);
  const [showHcTimeline, setShowHcTimeline] = useState<boolean>(false);
  const [showTandonTimeline, setShowTandonTimeline] = useState<boolean>(false);

  // Active section tracking on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 350;
          for (const guest of GUESTS_LIST) {
            const el = document.getElementById(guest.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveGuestId(guest.id);
                break;
              }
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen text-white overflow-x-hidden transition-colors duration-500 font-sans selection:bg-[#E61E25]/30 selection:text-white bg-[#07060a]",
        theme.selectionClass
      )}
    >
      {/* ============================================================
          CINEMATIC BACKDROP LAYER
          Crisp atmospheric texture with delicate theme wash
          ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      >
        <picture className="w-full h-full">
          <source
            srcSet={getOptimizedImageUrl("/images/guests/guests-bg.webp", 1920)}
            type="image/webp"
          />
          <img
            src={getOptimizedImageUrl("/images/guests/guests-bg.webp", 1920)}
            alt=""
            className="w-full h-full object-cover object-center brightness-[1.08] contrast-[1.10]"
          />
        </picture>
        {/* Delicate atmospheric theme wash */}
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-700 pointer-events-none",
            theme.bgGradient
          )}
        />
        <div
          className={cn(
            "absolute inset-0 transition-all duration-700 pointer-events-none",
            theme.radialCenterScrim
          )}
        />
      </div>

      {/* Ambient background glow points reacting to theme */}
      <div
        className="hidden sm:block fixed top-1/4 -left-48 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700 z-[1] opacity-40 will-change-transform"
        style={{ backgroundColor: theme.accentGlow }}
      />
      <div
        className="hidden sm:block fixed bottom-1/3 -right-48 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-30 z-[1] will-change-transform"
        style={{ backgroundColor: theme.guest2Glow }}
      />

      {/* ============================================================
          PAGE HERO / MAJESTIC DIGNITARY HEADLINE
          With frosted reading plate and quick metrics bar
          ============================================================ */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Frosted Headline Plate */}
          <div className="space-y-4 p-6 sm:p-10 rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[11px] uppercase tracking-wider text-neutral-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.accent }} />
              <span>TECHSRIJAN ACADEMIC CONCLAVE · HALL OF LUMINARIES</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-montserrat font-black tracking-tight text-white uppercase leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              GUESTS OF HONOUR
            </h1>

            <div
              className="font-geist font-medium text-xl sm:text-2xl md:text-3xl text-transparent bg-clip-text leading-tight transition-all duration-300"
              style={{
                backgroundImage: theme.heroSubheadGradient,
                filter: `drop-shadow(0 2px 25px ${theme.accentGlow})`,
              }}
            >
              Voices of Scientific Wonder &amp; Academic Leadership
            </div>

            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-geist leading-relaxed max-w-2xl mx-auto pt-1">
              Honoring the legendary scientific and educational luminaries who have graced the stage of
              TechSrijan at Madan Mohan Malaviya University of Technology, Gorakhpur.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.08]">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-montserrat font-black text-lg sm:text-xl text-white">2020</div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                  Padma Shri Honor
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-montserrat font-black text-lg sm:text-xl text-white">250+</div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                  Global Publications
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-montserrat font-black text-lg sm:text-xl text-white">VOL. 1 &amp; 2</div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                  Concepts of Physics
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-montserrat font-black text-lg sm:text-xl text-white">NAAC A++</div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                  Institutional Lead
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Floating Dignitary Showcase Gateway Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
            {/* Card 1: Prof. H. C. Verma */}
            <button
              type="button"
              onClick={() => scrollToSection("prof-hc-verma")}
              className={cn(
                "group relative flex items-center gap-4 px-5 sm:px-7 py-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left w-full sm:w-auto backdrop-blur-2xl shadow-xl",
                activeGuestId === "prof-hc-verma" ? "bg-black/90" : "bg-black/70 hover:bg-black/85"
              )}
              style={{
                borderColor: activeGuestId === "prof-hc-verma" ? theme.accent : theme.border,
                boxShadow:
                  activeGuestId === "prof-hc-verma"
                    ? `0 0 35px ${theme.accentGlow}`
                    : `0 0 20px ${theme.accentMuted}`,
              }}
            >
              <div
                className="relative h-14 w-14 rounded-full overflow-hidden border-2 shrink-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  borderColor: theme.accent,
                  boxShadow: `0 0 15px ${theme.accentGlow}`,
                }}
              >
                <Image
                  src="/images/guests/hc-verma-padmashri.webp"
                  alt="Prof. H. C. Verma"
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <div
                  className="font-mono text-[11px] tracking-wider uppercase"
                  style={{ color: theme.accent }}
                >
                  PREVIOUS YEAR KEYNOTE SPEAKER
                </div>
                <div className="font-montserrat font-black text-white text-base group-hover:text-zinc-200 transition-colors leading-tight mt-0.5">
                  Prof. Harish Chandra Verma
                </div>
                <div className="font-geist text-xs text-zinc-400">
                  Padma Shri Awardee · Author of Concepts of Physics
                </div>
              </div>
              <ChevronDown
                className="h-4 w-4 ml-auto group-hover:translate-y-1 transition-all"
                style={{ color: theme.accent }}
              />
            </button>

            {/* Card 2: Prof. Poonam Tandon */}
            <button
              type="button"
              onClick={() => scrollToSection("prof-poonam-tandon")}
              className={cn(
                "group relative flex items-center gap-4 px-5 sm:px-7 py-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left w-full sm:w-auto backdrop-blur-2xl shadow-xl",
                activeGuestId === "prof-poonam-tandon" ? "bg-black/90" : "bg-black/70 hover:bg-black/85"
              )}
              style={{
                borderColor:
                  activeGuestId === "prof-poonam-tandon" ? theme.guest2Accent : theme.guest2Border,
                boxShadow:
                  activeGuestId === "prof-poonam-tandon"
                    ? `0 0 35px ${theme.guest2Glow}`
                    : `0 0 20px ${theme.accentMuted}`,
              }}
            >
              <div
                className="relative h-14 w-14 rounded-full overflow-hidden border-2 shrink-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  borderColor: theme.guest2Accent,
                  boxShadow: `0 0 15px ${theme.guest2Glow}`,
                }}
              >
                <Image
                  src="/images/guests/poonam-tandon-clean.webp"
                  alt="Prof. Poonam Tandon"
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <div
                  className="font-mono text-[11px] tracking-wider uppercase"
                  style={{ color: theme.guest2Accent }}
                >
                  KEYNOTE DIGNITARY · FORMER VC DDU
                </div>
                <div className="font-montserrat font-black text-white text-base group-hover:text-zinc-200 transition-colors leading-tight mt-0.5">
                  Prof. Poonam Tandon
                </div>
                <div className="font-geist text-xs text-zinc-400">
                  Former Vice-Chancellor · DDU Gorakhpur University
                </div>
              </div>
              <ChevronDown
                className="h-4 w-4 ml-auto group-hover:translate-y-1 transition-all"
                style={{ color: theme.guest2Accent }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: PROF. HARISH CHANDRA VERMA
          Architectural Two-Column Showcase + 4 Pillars Grid
          ============================================================ */}
      <section
        id="prof-hc-verma"
        className="relative z-10 flex flex-col justify-center border-b border-white/[0.1] py-16 sm:py-24"
      >
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          {/* Centered Headline Plate */}
          <div className="text-center max-w-3xl mx-auto space-y-3 p-6 sm:p-8 rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/[0.12] shadow-2xl">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: theme.accent }}
            >
              ✦ PREVIOUS YEAR KEYNOTE SPEAKER &amp; EXPERT TALK LUMINARY ✦
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text transition-all duration-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{
                backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${theme.accentBright} 45%, ${theme.accent} 100%)`,
                filter: `drop-shadow(0 4px 30px ${theme.accentGlow})`,
              }}
            >
              PROF. H. C. VERMA
            </h2>
            <div className="font-geist text-sm sm:text-base text-zinc-300">
              Padma Shri Awardee · Renowned Experimental Physicist · Author of &apos;Concepts of Physics&apos;
            </div>
          </div>

          {/* Two-Column Showcase */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* Left Column: Portrait, Photo Switcher & Career Highlights */}
            <div className="lg:col-span-5 space-y-6">
              {/* Portrait Frame */}
              <div className="relative group max-w-md mx-auto lg:max-w-none">
                <div
                  className="absolute -inset-5 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none"
                  style={{ backgroundColor: theme.accentGlow }}
                />

                <div
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-colors duration-300"
                  style={{ borderColor: theme.border }}
                >
                  <Image
                    src={hcVermaGuest.galleryImages[selectedHcPhoto]?.url || hcVermaGuest.primaryImage}
                    alt={hcVermaGuest.galleryImages[selectedHcPhoto]?.caption || hcVermaGuest.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                    className="object-cover object-top filter contrast-[1.04] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1.5 pointer-events-none">
                    <div className="text-xl sm:text-2xl font-montserrat font-black text-white drop-shadow-md">
                      Prof. Harish Chandra Verma
                    </div>
                    <div className="text-xs font-geist text-zinc-300">
                      {hcVermaGuest.galleryImages[selectedHcPhoto]?.caption ||
                        hcVermaGuest.primaryImageCaption}
                    </div>
                    <div
                      className="text-xs font-mono font-semibold"
                      style={{ color: theme.accent }}
                    >
                      PADMA SHRI 2020 · EX-IIT KANPUR
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Selector Switcher */}
              <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-2.5 shadow-2xl">
                <div
                  className="flex items-center justify-between font-mono text-xs uppercase tracking-wider"
                  style={{ color: theme.accent }}
                >
                  <span>ARCHIVE PHOTOGRAPHS</span>
                  <span className="text-zinc-400">
                    {selectedHcPhoto + 1} / {hcVermaGuest.galleryImages.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {hcVermaGuest.galleryImages.map((photo, pIdx) => {
                    const isSelected = selectedHcPhoto === pIdx;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setSelectedHcPhoto(pIdx)}
                        className={cn(
                          "text-left p-3 rounded-xl border text-xs transition-all cursor-pointer backdrop-blur-md",
                          isSelected
                            ? "bg-white/[0.1] text-white"
                            : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.07]"
                        )}
                        style={{
                          borderColor: isSelected ? theme.accent : undefined,
                          boxShadow: isSelected ? `0 0 15px ${theme.accentGlow}` : undefined,
                        }}
                      >
                        <div
                          className="font-montserrat font-bold text-xs"
                          style={{ color: isSelected ? theme.accent : undefined }}
                        >
                          {photo.label}
                        </div>
                        <div className="font-geist text-[10px] text-zinc-400 truncate mt-0.5">
                          {photo.caption}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career Highlights Quick Grid */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 shadow-2xl">
                <div
                  className="font-mono text-xs tracking-wider uppercase"
                  style={{ color: theme.accent }}
                >
                  CHRONICLE MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Civilian Honor</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      2020 · Padma Shri
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Magnum Opus</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      1992 · Concepts of Physics
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">IIT Kanpur Tenure</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      1994–17 · Professor
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Grassroots Labs</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      25+ NANI Centers
                    </div>
                  </div>
                </div>

                {/* Toggle Full Timeline Button */}
                <button
                  type="button"
                  onClick={() => setShowHcTimeline(!showHcTimeline)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{showHcTimeline ? "Hide Career Timeline" : "View Full Career Timeline"}</span>
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", showHcTimeline && "rotate-180")}
                  />
                </button>

                {/* Expandable Career Timeline */}
                {showHcTimeline && (
                  <div className="pt-3 space-y-3 border-t border-white/10 animate-in fade-in duration-300">
                    {hcVermaGuest.careerMilestones.map((milestone, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                      >
                        <span
                          className="font-mono text-xs font-bold shrink-0 mt-0.5"
                          style={{ color: theme.accent }}
                        >
                          {milestone.year}
                        </span>
                        <div>
                          <div className="font-montserrat font-bold text-xs text-white">
                            {milestone.title}
                          </div>
                          <div className="font-geist text-[11px] text-zinc-400 leading-snug mt-0.5">
                            {milestone.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Keynote Citation, Accolades, Bio, 4 Pillars & Quote */}
            <div className="lg:col-span-7 space-y-7">
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-[1.02]">
                    Prof. Harish Chandra Verma
                  </h3>
                </div>
                {hcVermaGuest.hindiName && (
                  <div className="font-serif text-lg text-zinc-400 italic">
                    {hcVermaGuest.hindiName}
                  </div>
                )}
                <div className="text-sm sm:text-base font-geist text-neutral-300">
                  Padma Shri Awardee · Renowned Experimental Physicist · Author of &apos;Concepts of Physics&apos;
                </div>
              </div>

              {/* Accolades Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {hcVermaGuest.accolades.slice(0, 7).map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="font-geist text-xs font-medium px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-100 hover:border-white/25 transition-colors shadow-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div
                className="p-6 sm:p-8 rounded-2xl border-2 bg-gradient-to-br from-black/85 via-black/90 to-black/95 backdrop-blur-2xl space-y-3 transition-all duration-300 shadow-2xl"
                style={{
                  borderColor: theme.border,
                  boxShadow: `0 10px 40px ${theme.accentMuted}`,
                }}
              >
                <div
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: theme.accent }}
                >
                  KEYNOTE CITATION · PREVIOUS EDITION
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;{hcVermaGuest.keynoteTitle}&rdquo;
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-geist leading-relaxed">
                  {hcVermaGuest.keynoteSubtitle}
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="p-6 sm:p-7 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3 text-sm sm:text-base text-zinc-200 font-geist leading-relaxed shadow-xl">
                <p>
                  A revered living legend whose name is etched into the intellectual DNA of every Indian
                  engineer, <strong className="text-white font-montserrat">Prof. Harish Chandra Verma</strong>{" "}
                  has transformed how physics is perceived, experienced, and loved across the subcontinent.
                  For over three decades, his seminal two-volume masterpiece,{" "}
                  <strong style={{ color: theme.accent }} className="font-montserrat">
                    &apos;Concepts of Physics&apos;
                  </strong>
                  , has been the undisputed gateway for millions navigating competitive engineering entrance
                  and scientific research.
                </p>
                <p>
                  A distinguished nuclear physicist at IIT Kanpur with over 139 research publications,
                  Prof. Verma established the National Anveshika Network of Experimental Physics (NANI) with
                  over 25 centers across India, helping students build experimental setups using simple
                  materials. Honored with the prestigious <strong className="text-white">Padma Shri</strong> by
                  the President of India in 2020, his landmark keynote address at TechSrijan ignited the
                  packed amphitheater of MMMUT Gorakhpur.
                </p>
              </div>

              {/* The 4 Pedagogical Pillars Grid */}
              <div className="space-y-3">
                <div
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: theme.accent }}
                >
                  PEDAGOGICAL &amp; SCIENTIFIC PILLARS
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {hcVermaGuest.pillars.map((pillar, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all shadow-lg space-y-1.5"
                    >
                      <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                        {pillar.title}
                      </div>
                      <div className="font-geist text-xs text-neutral-300 leading-relaxed">
                        {pillar.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Memorable Pull Quote */}
              <blockquote
                className="border-l-4 pl-5 sm:pl-6 py-4 font-geist italic text-sm sm:text-base text-neutral-200 leading-relaxed rounded-r-2xl pr-4 transition-all duration-300 backdrop-blur-xl shadow-xl"
                style={{
                  borderColor: theme.accent,
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                }}
              >
                &ldquo;{hcVermaGuest.quote}&rdquo;
                <footer
                  className="font-mono text-xs not-italic tracking-wider uppercase mt-3 transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  — Prof. H. C. Verma · TechSrijan
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TRANSITIONAL BANNER
          Continuum from Fundamental Physics to Academic Leadership
          ============================================================ */}
      <section
        className={cn(
          "relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] backdrop-blur-md transition-colors duration-500",
          theme.transitionalBg
        )}
      >
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: theme.guest2Accent }}
          >
            ✦ CONTINUUM OF ACADEMIC LEADERSHIP &amp; VISION ✦
          </div>
          <h3 className="text-2xl sm:text-4xl font-montserrat font-black text-white drop-shadow-md">
            From Fundamental Physics to Visionary Higher Education
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 font-geist max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            TechSrijan convenes India&apos;s greatest minds and mentors. Directly following Prof. H. C.
            Verma&apos;s landmark scientific discourses, we honor the visionary higher-education leader and
            physicist of Purvanchal.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: PROF. POONAM TANDON (FORMER VC, DDU GORAKHPUR)
          Architectural Two-Column Showcase + 4 Pillars Grid
          ============================================================ */}
      <section
        id="prof-poonam-tandon"
        className="relative z-10 flex flex-col justify-center border-b border-white/[0.1] py-16 sm:py-24"
      >
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          {/* Centered Headline Plate */}
          <div className="text-center max-w-3xl mx-auto space-y-3 p-6 sm:p-8 rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/[0.12] shadow-2xl">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: theme.guest2Accent }}
            >
              ✦ PREVIOUS YEAR KEYNOTE DIGNITARY · ACADEMIC VISIONARY ✦
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text transition-all duration-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{
                backgroundImage: theme.guest2HeadingGradient,
                filter: `drop-shadow(0 4px 30px ${theme.guest2Glow})`,
              }}
            >
              PROF. POONAM TANDON
            </h2>
            <div className="font-geist text-sm sm:text-base text-zinc-300">
              Former Vice-Chancellor, DDU Gorakhpur University · Senior Professor of Physics · Honorary Colonel Commandant
            </div>
          </div>

          {/* Two-Column Showcase */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* Left Column: Portrait & Career Highlights */}
            <div className="lg:col-span-5 space-y-6">
              {/* Portrait Frame */}
              <div className="relative group max-w-md mx-auto lg:max-w-none">
                <div
                  className="absolute -inset-5 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none"
                  style={{ backgroundColor: theme.guest2Glow }}
                />

                <div
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-colors duration-300"
                  style={{ borderColor: theme.guest2Border }}
                >
                  <Image
                    src={poonamTandonGuest.primaryImage}
                    alt={poonamTandonGuest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                    className="object-cover object-top filter contrast-[1.04] transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1.5 pointer-events-none">
                    <div className="text-xl sm:text-2xl font-montserrat font-black text-white drop-shadow-md">
                      Prof. Poonam Tandon
                    </div>
                    <div className="text-xs font-geist text-zinc-300">
                      Former Vice-Chancellor · DDU Gorakhpur University (2023–2026)
                    </div>
                    <div
                      className="text-xs font-mono font-semibold"
                      style={{ color: theme.guest2Accent }}
                    >
                      COLONEL COMMANDANT · 250+ PUBLICATIONS
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Highlights Quick Grid */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 shadow-2xl">
                <div
                  className="font-mono text-xs tracking-wider uppercase"
                  style={{ color: theme.guest2Accent }}
                >
                  ACADEMIC &amp; GOVERNANCE MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Vice-Chancellor</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      2023–26 · DDU Gorakhpur
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Defence Honor</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      2024 · Colonel Commandant
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Research Mastery</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      250+ Global Papers
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-mono text-zinc-400 text-[10px] uppercase">Doctorate Degree</div>
                    <div className="font-montserrat font-bold text-white text-xs sm:text-sm mt-0.5">
                      1992 · Ph.D. in Physics
                    </div>
                  </div>
                </div>

                {/* Toggle Full Timeline Button */}
                <button
                  type="button"
                  onClick={() => setShowTandonTimeline(!showTandonTimeline)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{showTandonTimeline ? "Hide Career Timeline" : "View Full Career Timeline"}</span>
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", showTandonTimeline && "rotate-180")}
                  />
                </button>

                {/* Expandable Career Timeline */}
                {showTandonTimeline && (
                  <div className="pt-3 space-y-3 border-t border-white/10 animate-in fade-in duration-300">
                    {poonamTandonGuest.careerMilestones.map((milestone, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                      >
                        <span
                          className="font-mono text-xs font-bold shrink-0 mt-0.5"
                          style={{ color: theme.guest2Accent }}
                        >
                          {milestone.year}
                        </span>
                        <div>
                          <div className="font-montserrat font-bold text-xs text-white">
                            {milestone.title}
                          </div>
                          <div className="font-geist text-[11px] text-zinc-400 leading-snug mt-0.5">
                            {milestone.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Keynote Citation, Accolades, Bio, 4 Pillars & Quote */}
            <div className="lg:col-span-7 space-y-7">
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-[1.02]">
                    Prof. Poonam Tandon
                  </h3>
                </div>
                {poonamTandonGuest.hindiName && (
                  <div className="font-serif text-lg text-zinc-400 italic">
                    {poonamTandonGuest.hindiName}
                  </div>
                )}
                <div className="text-sm sm:text-base font-geist text-neutral-300">
                  Former Vice-Chancellor, DDU Gorakhpur University · Senior Professor of Physics
                </div>
              </div>

              {/* Accolades Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {poonamTandonGuest.accolades.slice(0, 7).map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="font-geist text-xs font-medium px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-100 hover:border-white/25 transition-colors shadow-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div
                className="p-6 sm:p-8 rounded-2xl border-2 bg-gradient-to-br from-black/85 via-black/90 to-black/95 backdrop-blur-2xl space-y-3 transition-all duration-300 shadow-2xl"
                style={{
                  borderColor: theme.guest2Border,
                  boxShadow: `0 10px 40px ${theme.guest2Glow}`,
                }}
              >
                <div
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: theme.guest2Accent }}
                >
                  KEYNOTE DISCOURSE · ACADEMIC LEADERSHIP
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;{poonamTandonGuest.keynoteTitle}&rdquo;
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-geist leading-relaxed">
                  {poonamTandonGuest.keynoteSubtitle}
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="p-6 sm:p-7 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3 text-sm sm:text-base text-zinc-200 font-geist leading-relaxed shadow-xl">
                <p>
                  A distinguished academician, eminent physicist, and visionary higher-education administrator,{" "}
                  <strong className="text-white font-montserrat">Prof. Poonam Tandon</strong> served as the
                  Vice-Chancellor of Deen Dayal Upadhyaya (DDU) Gorakhpur University from 2023 to 2026. A Senior
                  Professor of Physics at the University of Lucknow with over three decades of research and teaching
                  excellence, she is widely celebrated for championing institutional governance, research culture,
                  and student welfare across Uttar Pradesh.
                </p>
                <p>
                  As an internationally recognized molecular spectroscopist with over 250 peer-reviewed research
                  papers in high-impact journals, Prof. Tandon bridges cutting-edge physical sciences with higher
                  education leadership. Conferred the prestigious honorary rank of{" "}
                  <strong style={{ color: theme.guest2Accent }}>Colonel Commandant</strong> by the Ministry of
                  Defence, her presence in Gorakhpur&apos;s academic corridors has been an immense source of
                  inspiration for aspiring technologists and researchers.
                </p>
              </div>

              {/* The 4 Academic Leadership Pillars Grid */}
              <div className="space-y-3">
                <div
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: theme.guest2Accent }}
                >
                  LEADERSHIP &amp; INSTITUTIONAL PILLARS
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {poonamTandonGuest.pillars.map((pillar, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all shadow-lg space-y-1.5"
                    >
                      <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                        {pillar.title}
                      </div>
                      <div className="font-geist text-xs text-neutral-300 leading-relaxed">
                        {pillar.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Memorable Pull Quote */}
              <blockquote
                className="border-l-4 pl-5 sm:pl-6 py-4 font-geist italic text-sm sm:text-base text-neutral-200 leading-relaxed rounded-r-2xl pr-4 transition-all duration-300 backdrop-blur-xl shadow-xl"
                style={{
                  borderColor: theme.guest2Accent,
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                }}
              >
                &ldquo;{poonamTandonGuest.quote}&rdquo;
                <footer
                  className="font-mono text-xs not-italic tracking-wider uppercase mt-3 transition-colors duration-300"
                  style={{ color: theme.guest2Accent }}
                >
                  — Prof. Poonam Tandon · Former Vice-Chancellor, DDU Gorakhpur University
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION / FEST ROSTER FOOTER
          ============================================================ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4 p-8 sm:p-10 rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/[0.1] shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black text-white uppercase drop-shadow-md">
            Join 15,000+ Innovators in the Arena
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-geist leading-relaxed max-w-2xl mx-auto">
            From the keynote dais to the high-stakes battle cages of RoboWars and 24-hour coding marathons,
            TechSrijan &apos;27 is where legendary leadership meets cutting-edge engineering.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/events"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-8 py-4 font-montserrat text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 border shadow-xl",
                theme.primaryBtnClass,
                theme.primaryBtnBorder,
                theme.primaryBtnShadow
              )}
            >
              <span>Explore 25+ Events</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-7 py-4 font-montserrat text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-xl shadow-lg border",
                theme.secondaryBtnClass
              )}
            >
              <span>About TechSrijan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Conclave Footer */}
      <FestFooter />
    </div>
  );
}

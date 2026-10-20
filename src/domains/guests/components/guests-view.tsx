"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GUESTS_LIST } from "../data/guests-data";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useGuestsTheme } from "../data/guests-theme";
import { cn } from "@/core";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { FestFooter } from "@/shared/layout/fest-footer";

export function GuestsView() {
  const theme = useGuestsTheme();
  const hcVermaGuest = GUESTS_LIST.find((g) => g.id === "prof-hc-verma") || GUESTS_LIST[0];
  const poonamTandonGuest = GUESTS_LIST.find((g) => g.id === "prof-poonam-tandon") || GUESTS_LIST[1];

  const [activeGuestId, setActiveGuestId] = useState<string>("prof-hc-verma");
  const [selectedHcPhoto, setSelectedHcPhoto] = useState<number>(0);

  // Active section tracking on scroll (Throttled with requestAnimationFrame to prevent scroll lag)
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
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen text-white overflow-x-hidden transition-colors duration-500",
        theme.selectionClass
      )}
    >
      {/* ============================================================
          CINEMATIC BACKDROP LAYER (Using @[assets/background.png])
          Vibrant, crisp, and clearly visible across the entire page
          with delicate atmospheric tinting
          ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      >
        <picture className="w-full h-full">
          <source srcSet={getOptimizedImageUrl("/images/guests/guests-bg.webp", 1920)} type="image/webp" />
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
        {/* Soft radial atmospheric blend */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-700 pointer-events-none",
            theme.radialCenterScrim
          )}
        />
      </div>

      {/* Ambient background glow points reacting to theme (Optimized for desktop, bypassed on mobile to prevent composite thrashing) */}
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
          Harmonized to standard max-w-7xl container width
          With frosted reading plate for 100% legibility over artwork
          ============================================================ */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Frosted Headline Card: Protects text contrast while showcasing background around it */}
          <div className="space-y-3 p-6 sm:p-10 rounded-3xl bg-black/55 backdrop-blur-md border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-montserrat font-black tracking-tight text-white uppercase leading-[0.94] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              GUESTS OF HONOUR
            </h1>
            <div
              className="font-geist font-medium text-xl sm:text-3xl md:text-4xl text-transparent bg-clip-text leading-tight transition-all duration-300"
              style={{
                backgroundImage: theme.heroSubheadGradient,
                filter: `drop-shadow(0 2px 25px ${theme.accentGlow})`,
              }}
            >
              Voices of Scientific Wonder &amp; Academic Leadership
            </div>
            <p className="text-sm sm:text-lg text-zinc-200 font-geist leading-relaxed max-w-2xl mx-auto pt-2 drop-shadow-md">
              Honoring the legendary academic and scientific luminaries who have graced the stage of TechSrijan at Madan Mohan Malaviya University of Technology, Gorakhpur.
            </p>
          </div>

          {/* Luxury Floating Dignitary Showcase Gateway Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
            {/* Card 1: Prof. H. C. Verma */}
            <button
              onClick={() => scrollToSection("prof-hc-verma")}
              className={cn(
                "group relative flex items-center gap-4 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left w-full sm:w-auto backdrop-blur-xl",
                activeGuestId === "prof-hc-verma" ? "bg-black/90" : "bg-black/75 hover:bg-black/85"
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
                className="relative h-12 w-12 rounded-full overflow-hidden border-2 shrink-0 transition-colors duration-300"
                style={{
                  borderColor: theme.accent,
                  boxShadow: `0 0 15px ${theme.accentGlow}`,
                }}
              >
                <Image
                  src="/images/guests/hc-verma-padmashri.webp"
                  alt="Prof. H. C. Verma"
                  fill
                  sizes="48px"
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div
                  className="font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  PREVIOUS YEAR KEYNOTE SPEAKER
                </div>
                <div className="font-montserrat font-black text-white text-sm sm:text-base group-hover:text-zinc-200 transition-colors leading-tight">
                  Prof. H. C. Verma
                </div>
                <div className="font-geist text-xs sm:text-sm text-zinc-400">
                  Padma Shri Awardee &middot; Concepts of Physics
                </div>
              </div>
              <ChevronDown
                className="h-4 w-4 ml-auto group-hover:translate-y-1 transition-all"
                style={{ color: theme.accent }}
              />
            </button>

            {/* Card 2: Prof. Poonam Tandon */}
            <button
              onClick={() => scrollToSection("prof-poonam-tandon")}
              className={cn(
                "group relative flex items-center gap-4 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left w-full sm:w-auto backdrop-blur-xl",
                activeGuestId === "prof-poonam-tandon" ? "bg-black/90" : "bg-black/75 hover:bg-black/85"
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
                className="relative h-12 w-12 rounded-full overflow-hidden border-2 shrink-0 transition-colors duration-300"
                style={{
                  borderColor: theme.guest2Accent,
                  boxShadow: `0 0 15px ${theme.guest2Glow}`,
                }}
              >
                <Image
                  src="/images/guests/poonam-tandon-clean.webp"
                  alt="Prof. Poonam Tandon"
                  fill
                  sizes="48px"
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div
                  className="font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.guest2Accent }}
                >
                  KEYNOTE DIGNITARY · FORMER VC DDU
                </div>
                <div className="font-montserrat font-black text-white text-sm sm:text-base group-hover:text-zinc-200 transition-colors leading-tight">
                  Prof. Poonam Tandon
                </div>
                <div className="font-geist text-xs sm:text-sm text-zinc-400">
                  Former Vice-Chancellor &middot; DDU Gorakhpur University
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
          SECTION 1: PROF. H. C. VERMA (PREVIOUS YEAR'S KEYNOTE SPEAKER)
          Centered Heading in Mid (Montserrat) + Photo on LEFT Side
          Harmonized to standard max-w-7xl container width & frosted cards
          ============================================================ */}
      <section
        id="prof-hc-verma"
        className="relative z-10 flex flex-col justify-center border-b border-white/[0.1] py-14 sm:py-20"
      >
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* PROMINENT CENTERED HEADLINE */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 p-5 sm:p-6 rounded-3xl bg-black/55 backdrop-blur-md border border-white/[0.12] shadow-2xl">
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text transition-all duration-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{
                backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${theme.accentBright} 45%, ${theme.accent} 100%)`,
                filter: `drop-shadow(0 4px 30px ${theme.accentGlow})`,
              }}
            >
              PREVIOUS YEAR KEYNOTE SPEAKER
            </h2>

            <div
              className="font-geist font-normal text-base sm:text-xl lg:text-2xl transition-colors duration-300 drop-shadow-md"
              style={{ color: theme.subheadColor }}
            >
              Prof. Harish Chandra Verma &middot; Padma Shri Awardee &middot; Concepts of Physics
            </div>
          </div>

          {/* TWO-COLUMN SHOWCASE (Photo on LEFT, Details on RIGHT) */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* PHOTO COLUMN: LEFT SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group max-w-md mx-auto lg:max-w-none">
                {/* Ambient Glow */}
                <div
                  className="absolute -inset-5 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: theme.accentGlow,
                  }}
                />

                {/* Portrait Frame with Clean Real Photograph */}
                <div
                  className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border-2 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-colors duration-300"
                  style={{
                    borderColor: theme.border,
                  }}
                >
                  <Image
                    src={hcVermaGuest.galleryImages[selectedHcPhoto]?.url || hcVermaGuest.primaryImage}
                    alt={hcVermaGuest.galleryImages[selectedHcPhoto]?.caption || hcVermaGuest.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                    className="object-cover object-center filter contrast-[1.04] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1 pointer-events-none">
                    <div className="text-xl sm:text-2xl font-montserrat font-black text-white drop-shadow-md">
                      Prof. H. C. Verma
                    </div>
                    <div className="text-xs sm:text-sm font-geist text-zinc-300 drop-shadow-sm">
                      {hcVermaGuest.galleryImages[selectedHcPhoto]?.caption || hcVermaGuest.primaryImageCaption}
                    </div>
                    <div
                      className="text-xs font-geist font-semibold transition-colors duration-300 drop-shadow-sm"
                      style={{ color: theme.accent }}
                    >
                      Padma Shri 2020 &middot; Author of &apos;Concepts of Physics&apos; &middot; Former IIT Kanpur
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Selector Switcher */}
              <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-2.5 shadow-2xl">
                <div
                  className="flex items-center justify-between font-bebas text-sm tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  <span>PHOTO ARCHIVE VIEW</span>
                  <span className="font-mono text-zinc-400 text-xs">
                    {selectedHcPhoto + 1} / {hcVermaGuest.galleryImages.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {hcVermaGuest.galleryImages.map((photo, pIdx) => {
                    const isSelected = selectedHcPhoto === pIdx;
                    return (
                      <button
                        key={pIdx}
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
                          className="font-bebas text-sm tracking-wide"
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

              {/* Career Highlights */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 shadow-2xl">
                <div
                  className="font-bebas text-base sm:text-lg tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Civilian Award</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">2020 · Padma Shri</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Magnum Opus</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">1992 · Concepts of Physics</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Academic Tenure</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">1994–17 · Prof. IIT Kanpur</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Grassroots Labs</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">25+ NANI Centers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-2">
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-[1.02] drop-shadow-md">
                  Prof. Harish Chandra Verma
                </h3>
                <div className="text-sm sm:text-base md:text-lg font-geist font-normal text-neutral-300 drop-shadow-sm">
                  Padma Shri Awardee &middot; Renowned Physicist &middot; Author of &apos;Concepts of Physics&apos;
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
                className="p-6 sm:p-7 rounded-2xl border-2 bg-gradient-to-br from-black/85 via-black/90 to-black/95 backdrop-blur-xl space-y-2.5 transition-all duration-300 shadow-2xl"
                style={{
                  borderColor: theme.border,
                  boxShadow: `0 10px 40px ${theme.accentMuted}`,
                }}
              >
                <div
                  className="font-bebas text-sm sm:text-base tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  KEYNOTE CITATION · PREVIOUS EDITION
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;{hcVermaGuest.keynoteTitle}&rdquo;
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-geist leading-relaxed pt-0.5">
                  {hcVermaGuest.keynoteSubtitle}
                </p>
              </div>

              {/* Concise Authentic Biography Container */}
              <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 text-sm sm:text-base text-zinc-200 font-geist leading-relaxed shadow-xl">
                <p>
                  An institution in himself and the intellectual guiding light for generations of Indian engineers, <strong className="text-white font-montserrat">Prof. H. C. Verma</strong> revolutionized science education with his timeless masterpiece, <strong style={{ color: theme.accent }} className="font-montserrat transition-colors duration-300">&apos;Concepts of Physics&apos;</strong>. Replacing rote examination drilling with joyful, intuitive wonder, his books have demystified physics for millions of students.
                </p>
                <p>
                  During his 23-year tenure as Professor of Experimental Physics at IIT Kanpur, Prof. Verma published over 139 research papers in nuclear physics and established the National Anveshika Network (NANI) with over 25 centers across India. Honored with the <strong className="text-white">Padma Shri</strong> by the President of India, his landmark address at TechSrijan ignited the amphitheater of MMMUT Gorakhpur, urging students to build inventions rooted in raw physical intuition.
                </p>
              </div>

              {/* Grand Memorable Pull Quote (Chancery font) */}
              <blockquote
                className="border-l-4 pl-5 sm:pl-6 py-4 font-geist italic text-sm sm:text-base text-neutral-200 leading-relaxed rounded-r-2xl pr-4 transition-all duration-300 backdrop-blur-xl shadow-xl"
                style={{
                  borderColor: theme.accent,
                  backgroundColor: "rgba(0, 0, 0, 0.82)",
                }}
              >
                &ldquo;{hcVermaGuest.quote}&rdquo;
                <footer
                  className="font-bebas text-xs sm:text-sm not-italic tracking-wider uppercase mt-2.5 transition-colors duration-300"
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
          Themed background gradient matching active theme atmosphere
          ============================================================ */}
      <section
        className={cn(
          "relative z-10 py-14 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] backdrop-blur-md transition-colors duration-500",
          theme.transitionalBg
        )}
      >
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div
            className="font-bebas text-sm sm:text-base tracking-wider uppercase transition-colors duration-300"
            style={{ color: theme.guest2Accent }}
          >
            CONTINUUM OF ACADEMIC LEADERSHIP
          </div>
          <h3 className="text-2xl sm:text-4xl font-montserrat font-black text-white drop-shadow-md">
            From Fundamental Physics to Visionary Higher Education
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 font-geist max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            TechSrijan gathers India&apos;s greatest minds and mentors. Directly following Prof. H. C. Verma&apos;s landmark scientific discourses, we honor the visionary higher-education leader and academician of Purvanchal.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: PROF. POONAM TANDON (FORMER VC, DDU GORAKHPUR)
          Harmonized to theme colors and standard max-w-7xl width
          ============================================================ */}
      <section
        id="prof-poonam-tandon"
        className="relative z-10 flex flex-col justify-center border-b border-white/[0.1] py-14 sm:py-20"
      >
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* PROMINENT CENTERED HEADLINE FOR PROF. POONAM TANDON */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 p-5 sm:p-6 rounded-3xl bg-black/55 backdrop-blur-md border border-white/[0.12] shadow-2xl">
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text transition-all duration-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{
                backgroundImage: theme.guest2HeadingGradient,
                filter: `drop-shadow(0 4px 30px ${theme.guest2Glow})`,
              }}
            >
              PREVIOUS YEAR KEYNOTE DIGNITARY
            </h2>

            <div
              className="font-geist font-normal text-base sm:text-xl lg:text-2xl transition-colors duration-300 drop-shadow-md"
              style={{ color: theme.guest2SubheadColor }}
            >
              Prof. Poonam Tandon &middot; Former Vice-Chancellor, DDU Gorakhpur University
            </div>
          </div>

          {/* TWO-COLUMN SHOWCASE (Photo on LEFT, Details on RIGHT) */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* PHOTO COLUMN: LEFT SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group max-w-md mx-auto lg:max-w-none">
                {/* Ambient Themed Bloom */}
                <div
                  className="absolute -inset-5 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: theme.guest2Glow,
                  }}
                />

                {/* Portrait Frame with Clean Photograph */}
                <div
                  className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border-2 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-colors duration-300"
                  style={{
                    borderColor: theme.guest2Border,
                  }}
                >
                  <Image
                    src={poonamTandonGuest.primaryImage}
                    alt={poonamTandonGuest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                    className="object-cover object-top filter contrast-[1.04] transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1 pointer-events-none">
                    <div className="text-xl sm:text-2xl font-montserrat font-black text-white drop-shadow-md">
                      Prof. Poonam Tandon
                    </div>
                    <div className="text-xs sm:text-sm font-geist text-zinc-300 drop-shadow-sm">
                      Former Vice-Chancellor &middot; DDU Gorakhpur University (2023–2026)
                    </div>
                    <div
                      className="text-xs font-geist font-semibold transition-colors duration-300 drop-shadow-sm"
                      style={{ color: theme.guest2Accent }}
                    >
                      Senior Professor of Physics &middot; Honorary Colonel Commandant
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Highlights */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 shadow-2xl">
                <div
                  className="font-bebas text-base sm:text-lg tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.guest2Accent }}
                >
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Academic Leadership</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">2023–26 · Vice-Chancellor DDU</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Defence Honor</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">2024 · Colonel Commandant</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Research Mastery</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">250+ Research Papers</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Doctorate Degree</div>
                    <div className="font-geist font-semibold text-white text-xs sm:text-sm mt-0.5">1992 · Ph.D. in Physics</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-2">
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black tracking-tight text-white leading-[1.02] drop-shadow-md">
                  Prof. Poonam Tandon
                </h3>
                <div className="text-sm sm:text-base md:text-lg font-geist font-normal text-neutral-300 drop-shadow-sm">
                  Former Vice-Chancellor, DDU Gorakhpur University &middot; Senior Professor of Physics
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
                className="p-6 sm:p-7 rounded-2xl border-2 bg-gradient-to-br from-black/85 via-black/90 to-black/95 backdrop-blur-xl space-y-2.5 transition-all duration-300 shadow-2xl"
                style={{
                  borderColor: theme.guest2Border,
                  boxShadow: `0 10px 40px ${theme.guest2Glow}`,
                }}
              >
                <div
                  className="font-bebas text-sm sm:text-base tracking-wider uppercase transition-colors duration-300"
                  style={{ color: theme.guest2Accent }}
                >
                  KEYNOTE DISCOURSE · ACADEMIC LEADERSHIP
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;{poonamTandonGuest.keynoteTitle}&rdquo;
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-geist leading-relaxed pt-0.5">
                  {poonamTandonGuest.keynoteSubtitle}
                </p>
              </div>

              {/* Concise Authentic Biography Container */}
              <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.12] space-y-3.5 text-sm sm:text-base text-zinc-200 font-geist leading-relaxed shadow-xl">
                <p>
                  A distinguished academician, eminent physicist, and visionary higher-education administrator,{" "}
                  <strong className="text-white font-montserrat">Prof. Poonam Tandon</strong> served as the Vice-Chancellor of Deen Dayal Upadhyaya (DDU) Gorakhpur University from 2023 to 2026. A Senior Professor of Physics at the University of Lucknow with over three decades of research and teaching excellence, she is widely celebrated for championing institutional governance, research culture, and student welfare across Uttar Pradesh.
                </p>
                <p>
                  As an internationally recognized molecular spectroscopist with over 250 peer-reviewed research papers in high-impact journals, Prof. Tandon bridges cutting-edge physical sciences with higher education leadership. Conferred the prestigious honorary rank of{" "}
                  <strong style={{ color: theme.guest2Accent }} className="transition-colors duration-300">Colonel Commandant</strong>{" "}
                  by the Ministry of Defence, her presence in Gorakhpur&apos;s academic corridors has been an immense source of inspiration for aspiring technologists and researchers.
                </p>
              </div>

              {/* Grand Memorable Pull Quote (Chancery font) */}
              <blockquote
                className="border-l-4 pl-5 sm:pl-6 py-4 font-geist italic text-sm sm:text-base text-neutral-200 leading-relaxed rounded-r-2xl pr-4 transition-all duration-300 backdrop-blur-xl shadow-xl"
                style={{
                  borderColor: theme.guest2Accent,
                  backgroundColor: "rgba(0, 0, 0, 0.82)",
                }}
              >
                &ldquo;{poonamTandonGuest.quote}&rdquo;
                <footer
                  className="font-bebas text-xs sm:text-sm not-italic tracking-wider uppercase mt-2.5 transition-colors duration-300"
                  style={{ color: theme.guest2Accent }}
                >
                  — Prof. Poonam Tandon &middot; Former Vice-Chancellor, DDU Gorakhpur University
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION / FEST ROSTER FOOTER
          Harmonized to standard max-w-7xl container width & buttons
          ============================================================ */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-3.5 p-6 sm:p-8 rounded-3xl bg-black/55 backdrop-blur-md border border-white/[0.1] shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black text-white drop-shadow-md">
            Join 15,000+ Innovators in the Arena
          </h2>
          <p className="text-sm sm:text-base text-zinc-200 font-geist leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            From the keynote dais to the high-stakes battle cages of RoboWars and 24-hour coding marathons, TechSrijan &apos;27 is where legendary leadership meets cutting-edge engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <Link
            href="/events"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-7 sm:px-8 py-3.5 font-montserrat text-xs font-bold transition-all duration-300 hover:scale-105 border shadow-xl",
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
              "inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3.5 font-montserrat text-xs font-medium transition-all backdrop-blur-xl shadow-lg",
              theme.secondaryBtnClass
            )}
          >
            <span>About TechSrijan</span>
          </Link>
        </div>
      </section>

      {/* Reusable Conclave Footer */}
      <FestFooter />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GUESTS_LIST } from "../data/guests-data";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { usePageTheme } from "@/core";

export function GuestsView() {
  const pageTheme = usePageTheme();
  const [activeGuestId, setActiveGuestId] = useState<string>(GUESTS_LIST[0].id);
  const [selectedHcPhoto, setSelectedHcPhoto] = useState<number>(0);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
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
    <div className="relative min-h-screen bg-[#05050A] text-white overflow-hidden selection:bg-[#79C7E3]/30 selection:text-white">
      {/* Ambient background glow points reacting to moon theme */}
      <div
        className="fixed top-1/4 -left-48 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: pageTheme.accentGlow }}
      />
      <div
        className="fixed bottom-1/3 -right-48 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-60"
        style={{ backgroundColor: pageTheme.accentGlow }}
      />

      {/* ============================================================
          PAGE HERO / MAJESTIC DIGNITARY HEADLINE
          ============================================================ */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-8 lg:px-16 max-w-[1720px] mx-auto text-center border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Majestic Grand Headline combining Montserrat & Chancery */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-montserrat font-black tracking-tight text-white uppercase leading-[0.92]">
              CHIEF GUESTS
            </h1>
            <div
              className="font-chancery text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text leading-tight transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to right, ${pageTheme.accentBright}, ${pageTheme.accent}, #E8D4FF)`,
                filter: `drop-shadow(0 2px 25px ${pageTheme.accentGlow})`,
              }}
            >
              Voices of Honor, Valor &amp; Science
            </div>
          </div>

          <p className="text-base sm:text-xl text-zinc-300 font-geist leading-relaxed max-w-3xl mx-auto pt-2">
            Honoring the legendary icons who headline Eastern India&apos;s apex techno-management conclave at Madan Mohan Malaviya University of Technology, Gorakhpur.
          </p>

          {/* Luxury Floating Dignitary Showcase Gateway Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6">
            <button
              onClick={() => scrollToSection("dr-kiran-bedi")}
              className="group relative flex items-center gap-4 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-black/80 via-black/90 to-black/95 border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left"
              style={{
                borderColor: activeGuestId === "dr-kiran-bedi" ? pageTheme.accent : pageTheme.border,
                boxShadow: activeGuestId === "dr-kiran-bedi" ? `0 0 35px ${pageTheme.accentGlow}` : `0 0 20px ${pageTheme.accentMuted}`,
              }}
            >
              <div
                className="relative h-12 w-12 rounded-full overflow-hidden border-2 shrink-0 transition-colors duration-300"
                style={{
                  borderColor: pageTheme.accent,
                  boxShadow: `0 0 15px ${pageTheme.accentGlow}`,
                }}
              >
                <Image
                  src="/images/guests/kiran-bedi-real.jpg"
                  alt="Dr. Kiran Bedi"
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div
                  className="font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  THIS YEAR&apos;S CHIEF GUEST · 2026–27
                </div>
                <div className="font-montserrat font-black text-white text-base sm:text-lg group-hover:text-zinc-200 transition-colors leading-tight">
                  Dr. Kiran Bedi
                </div>
                <div className="font-chancery text-xs sm:text-sm text-zinc-300">
                  First Woman IPS Officer of India
                </div>
              </div>
              <ChevronDown
                className="h-4 w-4 ml-2 group-hover:translate-y-1 transition-all"
                style={{ color: pageTheme.accent }}
              />
            </button>

            <button
              onClick={() => scrollToSection("prof-hc-verma")}
              className={`group relative flex items-center gap-4 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-[#79C7E3]/15 via-black/80 to-black/90 border transition-all duration-300 cursor-pointer hover:scale-[1.02] text-left ${
                activeGuestId === "prof-hc-verma"
                  ? "border-[#79C7E3] shadow-[0_0_35px_rgba(121,199,227,0.35)]"
                  : "border-[#79C7E3]/30 hover:border-[#79C7E3] shadow-[0_0_20px_rgba(121,199,227,0.15)]"
              }`}
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#79C7E3] shadow-[0_0_15px_rgba(121,199,227,0.5)] shrink-0">
                <Image
                  src="/images/guests/hc-verma-padmashri.jpg"
                  alt="Prof. H. C. Verma"
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="font-bebas text-xs sm:text-sm tracking-wider text-[#79C7E3] uppercase">
                  2025 KEYNOTE SPEAKER · EXPERT TALK
                </div>
                <div className="font-montserrat font-black text-white text-base sm:text-lg group-hover:text-[#E0F7FF] transition-colors leading-tight">
                  Prof. H. C. Verma
                </div>
                <div className="font-chancery text-xs sm:text-sm text-zinc-300">
                  Padma Shri Awardee &middot; Concepts of Physics
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[#79C7E3] ml-2 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: DR. KIRAN BEDI (THIS YEAR'S CHIEF GUEST)
          Centered Heading in Mid (Montserrat) + Photo on LEFT Side
          ============================================================ */}
      <section
        id="dr-kiran-bedi"
        className="relative min-h-screen flex flex-col justify-center border-b border-white/[0.1] py-16 sm:py-24"
      >
        {/* Full-bleed cinematic background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/guests/guest-bg-kiran-bedi.jpg"
            alt="Dr. Kiran Bedi Keynote Amphitheater"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter contrast-[1.05] brightness-90 scale-105"
          />
          <div className="absolute inset-0 bg-[#05050A]/75" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05050A] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05050A] to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 max-w-[1720px] mx-auto">
          
          {/* PROMINENT CENTERED HEADLINE FOR THIS YEAR'S GUEST */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                filter: `drop-shadow(0 4px 35px ${pageTheme.accentGlow})`,
              }}
            >
              THIS YEAR&apos;S CHIEF GUEST OF HONOUR
            </h2>
            
            <div className="font-chancery text-2xl sm:text-3xl lg:text-4xl text-[#E8D4FF]">
              Dr. Kiran Bedi &middot; First Woman IPS Officer of India
            </div>
          </div>

          {/* TWO-COLUMN SHOWCASE (Photo on LEFT, Details on RIGHT) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* PHOTO COLUMN: LEFT SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group max-w-lg mx-auto lg:max-w-none">
                {/* Ambient Golden Bloom */}
                <div
                  className="absolute -inset-6 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: pageTheme.accentGlow,
                  }}
                />

                {/* Portrait Frame with Clean Real Photograph */}
                <div
                  className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border-2 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-colors duration-300"
                  style={{
                    borderColor: pageTheme.border,
                  }}
                >
                  <Image
                    src="/images/guests/kiran-bedi-real.jpg"
                    alt="Dr. Kiran Bedi"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                    className="object-cover object-[center_top] filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1 pointer-events-none">
                    <div className="text-2xl sm:text-3xl font-montserrat font-black text-white">
                      Dr. Kiran Bedi
                    </div>
                    <div className="text-xs sm:text-sm font-geist text-zinc-300">
                      First Woman Officer in the Indian Police Service (1972)
                    </div>
                    <div
                      className="text-xs font-geist font-semibold transition-colors duration-300"
                      style={{ color: pageTheme.accent }}
                    >
                      Ramon Magsaysay Laureate &middot; 24th Lt. Governor of Puducherry
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Highlights */}
              <div className="p-6 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-4">
                <div
                  className="font-bebas text-base sm:text-lg tracking-wider uppercase transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Historic Service</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">1972 · First Woman IPS</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Civilian Honor</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">1994 · Ramon Magsaysay</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Constitutional Office</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">2016–21 · Lt. Governor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Doctorate Degree</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">Ph.D. IIT Delhi (1993)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-3">
                <h3 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight text-white leading-[1.02]">
                  Dr. Kiran Bedi
                </h3>
                <div className="text-xl sm:text-2xl font-chancery text-zinc-200">
                  First Woman IPS Officer of India &middot; 24th Lt. Governor of Puducherry
                </div>
              </div>

              {/* Accolades Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  "First Woman Officer in the IPS (1972)",
                  "24th Lt. Governor of Puducherry (2016–2021)",
                  "Ramon Magsaysay Award Laureate (1994)",
                  "United Nations Civilian Police Adviser",
                  "President's Police Medal for Gallantry",
                  "Ph.D. in Social Sciences, IIT Delhi",
                  "Author of 'Fearless Governance'",
                ].map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="font-geist text-xs font-medium px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 text-zinc-100"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div
                className="p-6 sm:p-8 rounded-2xl border-2 bg-gradient-to-br from-black/80 via-black/85 to-black/95 backdrop-blur-xl space-y-3 transition-all duration-300"
                style={{
                  borderColor: pageTheme.border,
                  boxShadow: `0 10px 40px ${pageTheme.accentMuted}`,
                }}
              >
                <div
                  className="font-bebas text-base sm:text-lg tracking-wider uppercase transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  KEYNOTE ADDRESS · TECHSRIJAN &apos;27
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;Fearless Governance, Radical Integrity & Engineering the Soul of a Nation&rdquo;
                </div>
                <p className="text-sm sm:text-base text-zinc-300 font-geist leading-relaxed pt-1">
                  Bridging Ethical Conviction, Administrative Courage and Cutting-Edge Technological Innovation for Viksit Bharat.
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="space-y-4 text-base sm:text-lg text-zinc-200 font-geist leading-relaxed">
                <p>
                  A monumental titan of Indian public administration, <strong className="text-white font-montserrat">Dr. Kiran Bedi</strong> broke historic barriers in 1972 to become India&apos;s first woman in the Indian Police Service. Internationally celebrated for transforming Delhi&apos;s Tihar Jail into a humane reformatory—earning the prestigious <strong style={{ color: pageTheme.accent }} className="transition-colors duration-300">Ramon Magsaysay Award</strong>—and her impactful tenure as Lieutenant Governor of Puducherry, she embodies uncompromising ethics and public duty.
                </p>
                <p>
                  Holding a doctorate from IIT Delhi, Dr. Bedi champions the philosophy of &ldquo;Fearless Governance&rdquo;. At TechSrijan &apos;27, she addresses over 25,000+ expected delegates at MMMUT Gorakhpur, challenging the nation&apos;s youth to build technological systems anchored in radical accountability, discipline, and compassionate nation-building.
                </p>
              </div>

              {/* Grand Memorable Pull Quote (Chancery font) */}
              <blockquote
                className="border-l-4 pl-6 py-4 font-chancery text-2xl sm:text-3xl text-zinc-100 leading-relaxed rounded-r-2xl pr-6 transition-all duration-300"
                style={{
                  borderColor: pageTheme.accent,
                  backgroundColor: `${pageTheme.accent}14`,
                }}
              >
                &ldquo;Leadership is not about commanding power; it is about taking responsibility where others falter. When youth unite technical competence with fearless character, no fortress of inertia can withstand their resolve.&rdquo;
                <footer
                  className="font-bebas text-sm sm:text-base not-italic tracking-wider uppercase mt-3 transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  — Dr. Kiran Bedi · TechSrijan &apos;27
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TRANSITIONAL BANNER
          ============================================================ */}
      <section className="relative py-16 px-4 sm:px-8 border-b border-white/[0.08] bg-gradient-to-r from-black via-[#0D0B18] to-black">
        <div className="max-w-[1720px] mx-auto text-center space-y-4">
          <div
            className="font-bebas text-base sm:text-lg tracking-wider uppercase transition-colors duration-300"
            style={{ color: pageTheme.accent }}
          >
            CONTINUUM OF INSPIRATION
          </div>
          <h3 className="text-3xl sm:text-5xl font-montserrat font-black text-white">
            From Fundamental Physics to Ethical Governance
          </h3>
          <p className="text-base sm:text-lg text-zinc-400 font-geist max-w-2xl mx-auto leading-relaxed">
            TechSrijan gathers India&apos;s greatest minds across eras. Before Dr. Kiran Bedi&apos;s address for 2027, the TechSrijan stage was honored by the legendary architect of Indian physics education.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: PROF. H. C. VERMA (PREVIOUS YEAR'S GUEST)
          Centered Heading in Mid (Montserrat) + Photo on LEFT Side
          ============================================================ */}
      <section
        id="prof-hc-verma"
        className="relative min-h-screen flex flex-col justify-center border-b border-white/[0.1] py-16 sm:py-24"
      >
        {/* Full-bleed cinematic celestial background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/guests/guest-bg-hc-verma.jpg"
            alt="Prof. H. C. Verma Celestial Physics Auditorium"
            fill
            sizes="100vw"
            className="object-cover object-center filter contrast-[1.05] brightness-90 scale-105"
          />
          <div className="absolute inset-0 bg-[#05050A]/75" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05050A] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05050A] to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 max-w-[1720px] mx-auto">
          
          {/* PROMINENT CENTERED HEADLINE FOR PREVIOUS YEAR'S GUEST */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-[#E0F7FF] via-[#79C7E3] to-[#9DE2FB]">
              PREVIOUS YEAR CHIEF GUEST OF HONOUR
            </h2>
            
            <div className="font-chancery text-2xl sm:text-3xl lg:text-4xl text-[#C3EEFF]">
              Prof. Harish Chandra Verma &middot; Padma Shri Awardee &middot; Concepts of Physics
            </div>
          </div>

          {/* TWO-COLUMN SHOWCASE (Photo on LEFT - Same side as Kiran Bedi!, Details on RIGHT) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* PHOTO COLUMN: LEFT SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group max-w-lg mx-auto lg:max-w-none">
                {/* Ambient Cyan Bloom */}
                <div className="absolute -inset-6 rounded-3xl blur-3xl bg-[#79C7E3]/20 group-hover:bg-[#79C7E3]/35 transition-all duration-700 pointer-events-none" />

                {/* Portrait Frame with Clean Real Photograph */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#79C7E3]/40 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)]">
                  <Image
                    src={GUESTS_LIST[1].galleryImages[selectedHcPhoto].url}
                    alt={GUESTS_LIST[1].galleryImages[selectedHcPhoto].caption}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                    className="object-cover object-center filter contrast-[1.04] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Clean Bottom Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-1 pointer-events-none">
                    <div className="text-2xl sm:text-3xl font-montserrat font-black text-white">
                      Prof. H. C. Verma
                    </div>
                    <div className="text-xs sm:text-sm font-geist text-zinc-300">
                      {GUESTS_LIST[1].galleryImages[selectedHcPhoto].caption}
                    </div>
                    <div className="text-xs font-geist font-semibold text-[#79C7E3]">
                      Padma Shri 2020 &middot; Author of &apos;Concepts of Physics&apos; &middot; Former IIT Kanpur
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Selector Switcher */}
              <div className="p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-2.5">
                <div className="flex items-center justify-between font-bebas text-sm tracking-wider text-[#79C7E3] uppercase">
                  <span>PHOTO ARCHIVE VIEW</span>
                  <span className="font-mono text-zinc-400 text-xs">{selectedHcPhoto + 1} / {GUESTS_LIST[1].galleryImages.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GUESTS_LIST[1].galleryImages.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setSelectedHcPhoto(pIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedHcPhoto === pIdx
                          ? "bg-[#79C7E3]/25 border-[#79C7E3] text-white shadow-[0_0_15px_rgba(121,199,227,0.3)]"
                          : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="font-bebas text-sm tracking-wide">{photo.label}</div>
                      <div className="font-geist text-[10px] text-zinc-400 truncate mt-0.5">{photo.caption}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Career Highlights */}
              <div className="p-6 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-4">
                <div className="font-bebas text-base sm:text-lg tracking-wider text-[#79C7E3] uppercase">
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Civilian Award</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">2020 · Padma Shri</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Magnum Opus</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">1992 · Concepts of Physics</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Academic Tenure</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">1994–17 · Prof. IIT Kanpur</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="font-bebas text-zinc-400 text-xs tracking-wider uppercase">Grassroots Labs</div>
                    <div className="font-geist font-semibold text-white text-sm mt-0.5">25+ NANI Centers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-3">
                <h3 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-black tracking-tight text-white leading-[1.02]">
                  Prof. Harish Chandra Verma
                </h3>
                <div className="text-xl sm:text-2xl font-chancery text-zinc-200">
                  Padma Shri Awardee &middot; Renowned Physicist &middot; Author of &apos;Concepts of Physics&apos;
                </div>
              </div>

              {/* Accolades Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  "Padma Shri Awardee (2020) by President of India",
                  "Author of 'Concepts of Physics' (Vol 1 & 2)",
                  "Former Professor of Experimental Physics, IIT Kanpur",
                  "Founder, National Anveshika Network (NANI)",
                  "Founder, Shiksha Sopan Community",
                  "Ph.D. in Experimental Nuclear Physics, IIT Kanpur",
                  "Author of 139+ International Research Papers",
                ].map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="font-geist text-xs font-medium px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 text-zinc-100"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#79C7E3]/40 bg-gradient-to-br from-[#79C7E3]/15 via-black/75 to-black/90 backdrop-blur-xl space-y-3 shadow-[0_10px_40px_rgba(121,199,227,0.12)]">
                <div className="font-bebas text-base sm:text-lg tracking-wider text-[#79C7E3] uppercase">
                  KEYNOTE CITATION · PREVIOUS EDITION
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white leading-snug">
                  &ldquo;The Symphony of Fundamental Science: Awakening Curiosity Beyond Blackboards&rdquo;
                </div>
                <p className="text-sm sm:text-base text-zinc-300 font-geist leading-relaxed pt-1">
                  Demystifying the Cosmos through Raw Physical Intuition, Grassroots Experimentation and Joyful Discovery.
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="space-y-4 text-base sm:text-lg text-zinc-200 font-geist leading-relaxed">
                <p>
                  An institution in himself and the intellectual guiding light for generations of Indian engineers, <strong className="text-white font-montserrat">Prof. H. C. Verma</strong> revolutionized science education with his timeless masterpiece, <strong className="text-[#79C7E3] font-montserrat">&apos;Concepts of Physics&apos;</strong>. Replacing rote examination drilling with joyful, intuitive wonder, his books have demystified physics for millions of students.
                </p>
                <p>
                  During his 23-year tenure as Professor of Experimental Physics at IIT Kanpur, Prof. Verma published over 139 research papers in nuclear physics and established the National Anveshika Network (NANI) with over 25 centers across India. Honored with the <strong className="text-white">Padma Shri</strong> by the President of India, his landmark address at TechSrijan ignited the amphitheater of MMMUT Gorakhpur, urging students to build inventions rooted in raw physical intuition.
                </p>
              </div>

              {/* Grand Memorable Pull Quote (Chancery font) */}
              <blockquote className="border-l-4 border-[#79C7E3] pl-6 py-4 font-chancery text-2xl sm:text-3xl text-zinc-100 leading-relaxed bg-[#79C7E3]/10 rounded-r-2xl pr-6">
                &ldquo;Science does not reside inside examination papers or algebraic symbols on a blackboard; science breathes in the flight of a sparrow, the spin of a bicycle wheel, and the relentless spark of a young student who dares to ask &apos;why&apos;. Build your machines with wonder, not with fear.&rdquo;
                <footer className="font-bebas text-sm sm:text-base not-italic tracking-wider text-[#79C7E3] uppercase mt-3">
                  — Prof. H. C. Verma · TechSrijan
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION / FEST ROSTER FOOTER
          ============================================================ */}
      <section className="py-20 px-4 sm:px-8 max-w-[1720px] mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-montserrat font-black text-white">
            Join 25,000+ Innovators in the Arena
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-geist leading-relaxed">
            From the keynote dais to the high-stakes battle cages of RoboWars and 24-hour coding marathons, TechSrijan &apos;27 is where legendary leadership meets cutting-edge engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/events"
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-montserrat text-xs font-bold ${pageTheme.btnText} transition-all duration-300 hover:scale-105`}
            style={{
              backgroundImage: `linear-gradient(to right, ${pageTheme.headingTo}, ${pageTheme.accentBright}, ${pageTheme.headingTo})`,
              boxShadow: `0 0 30px ${pageTheme.accentGlow}`,
            }}
          >
            <span>Explore 30+ Arena Events</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-7 py-3.5 font-montserrat text-xs font-medium text-white transition-all backdrop-blur-xl"
          >
            <span>Command Roster</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] px-7 py-3.5 font-montserrat text-xs font-medium text-zinc-300 transition-all"
          >
            <span>About TechSrijan</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

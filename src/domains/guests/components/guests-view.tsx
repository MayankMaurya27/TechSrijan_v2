"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GUESTS_LIST } from "../data/guests-data";
import { ArrowUpRight, ChevronDown } from "lucide-react";

export function GuestsView() {
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
    <div className="relative min-h-screen bg-[#05050A] text-white overflow-hidden selection:bg-[#D4A843]/30 selection:text-white">
      {/* Ambient background glow points */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 -right-48 w-96 h-96 bg-[#79C7E3]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Edition Selector Bar (Sticky Top) */}
      <aside aria-label="Keynote navigation" className="sticky top-20 z-40 w-full px-4 sm:px-8 py-3 bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-300">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A843] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A843]" />
            </span>
            <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-zinc-300">
              KEYNOTE GUESTS OF HONOUR
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-xs font-sans text-zinc-400 hidden sm:inline">
              TECHSRIJAN · MMMUT GORAKHPUR
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {GUESTS_LIST.map((guest) => {
              const isActive = activeGuestId === guest.id;
              return (
                <button
                  key={guest.id}
                  onClick={() => scrollToSection(guest.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs font-sans font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-white/15 text-white border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105"
                      : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                  style={{
                    borderColor: isActive ? guest.accentColor : undefined,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: guest.accentColor }}
                  />
                  <span>{guest.name}</span>
                  <span className="text-[10px] opacity-75 hidden md:inline">
                    ({guest.isCurrentEdition ? "This Year Guest" : "Previous Year Guest"})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ============================================================
          PAGE HERO / HEADER
          ============================================================ */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-16 max-w-[1720px] mx-auto text-center border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-xs sm:text-sm font-sans font-bold tracking-[0.3em] uppercase text-[#D4A843]">
            TECHSRIJAN CONCLAVE
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-white uppercase leading-[0.95]">
            VOICES OF{" "}
            <span className="block font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#E8D4FF] to-[#79C7E3]">
              Honor, Valor & Science
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Honoring the distinguished icons who headline Eastern India&apos;s apex techno-management festival at Madan Mohan Malaviya University of Technology.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => scrollToSection("dr-kiran-bedi")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider text-black bg-[#D4A843] hover:bg-[#e6bb56] shadow-[0_0_25px_rgba(212,168,67,0.3)] transition-all cursor-pointer"
            >
              <span>This Year: Dr. Kiran Bedi</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToSection("prof-hc-verma")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-all cursor-pointer"
            >
              <span>Previous Year: Prof. H. C. Verma</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: DR. KIRAN BEDI (THIS YEAR'S CHIEF GUEST)
          Centered Heading in Mid + Real Photo on LEFT Side
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
            <div className="text-xs sm:text-sm font-sans font-bold tracking-[0.3em] uppercase text-[#D4A843]">
              TECHSRIJAN &apos;27 APEX KEYNOTE
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#D4A843] to-[#ECC468]">
              THIS YEAR&apos;S CHIEF GUEST OF HONOUR
            </h2>
            
            <div className="font-editorial italic text-2xl sm:text-3xl lg:text-4xl text-[#E8D4FF]">
              Dr. Kiran Bedi &middot; First Woman IPS Officer of India
            </div>
          </div>

          {/* TWO-COLUMN SHOWCASE (Photo on LEFT, Details on RIGHT) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* PHOTO COLUMN: LEFT SIDE */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative group max-w-lg mx-auto lg:max-w-none">
                {/* Ambient Golden Bloom */}
                <div className="absolute -inset-6 rounded-3xl blur-3xl bg-[#D4A843]/20 group-hover:bg-[#D4A843]/35 transition-all duration-700 pointer-events-none" />

                {/* Portrait Frame with Clean Real Photograph */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#D4A843]/40 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)]">
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
                    <div className="text-2xl sm:text-3xl font-serif font-black text-white">
                      Dr. Kiran Bedi
                    </div>
                    <div className="text-xs sm:text-sm font-sans text-zinc-300">
                      First Woman Officer in the Indian Police Service (1972)
                    </div>
                    <div className="text-xs font-sans font-semibold text-[#D4A843]">
                      Ramon Magsaysay Laureate &middot; 24th Lt. Governor of Puducherry
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Highlights */}
              <div className="p-6 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-4">
                <div className="text-xs font-sans font-bold tracking-widest text-[#D4A843] uppercase">
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3.5 text-xs font-sans">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Historic Service</div>
                    <div className="font-bold text-white text-sm mt-0.5">1972 · First Woman IPS</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Civilian Honor</div>
                    <div className="font-bold text-white text-sm mt-0.5">1994 · Ramon Magsaysay</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Constitutional Office</div>
                    <div className="font-bold text-white text-sm mt-0.5">2016–21 · Lt. Governor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Doctorate Degree</div>
                    <div className="font-bold text-white text-sm mt-0.5">Ph.D. IIT Delhi (1993)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-3">
                <h3 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-[1.02]">
                  Dr. Kiran Bedi
                </h3>
                <div className="text-xl sm:text-2xl font-serif font-medium text-zinc-200">
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
                    className="text-xs font-sans font-semibold px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 text-zinc-100"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#D4A843]/40 bg-gradient-to-br from-[#D4A843]/15 via-black/75 to-black/90 backdrop-blur-xl space-y-3 shadow-[0_10px_40px_rgba(212,168,67,0.12)]">
                <div className="text-xs font-sans font-bold tracking-widest text-[#D4A843] uppercase">
                  KEYNOTE ADDRESS · TECHSRIJAN &apos;27
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-snug">
                  &ldquo;Fearless Governance, Radical Integrity & Engineering the Soul of a Nation&rdquo;
                </div>
                <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed pt-1">
                  Bridging Ethical Conviction, Administrative Courage and Cutting-Edge Technological Innovation for Viksit Bharat.
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="space-y-4 text-base sm:text-lg text-zinc-200 font-sans leading-relaxed">
                <p>
                  A monumental titan of Indian public administration, <strong className="text-white">Dr. Kiran Bedi</strong> broke historic barriers in 1972 to become India&apos;s first woman in the Indian Police Service. Internationally celebrated for transforming Delhi&apos;s Tihar Jail into a humane reformatory—earning the prestigious <strong className="text-[#D4A843]">Ramon Magsaysay Award</strong>—and her impactful tenure as Lieutenant Governor of Puducherry, she embodies uncompromising ethics and public duty.
                </p>
                <p>
                  Holding a doctorate from IIT Delhi, Dr. Bedi champions the philosophy of &ldquo;Fearless Governance&rdquo;. At TechSrijan &apos;27, she addresses over 5,000 engineering delegates at MMMUT Gorakhpur, challenging the nation&apos;s youth to build technological systems anchored in radical accountability, discipline, and compassionate nation-building.
                </p>
              </div>

              {/* Grand Memorable Pull Quote */}
              <blockquote className="border-l-4 border-[#D4A843] pl-6 py-4 italic font-editorial text-xl sm:text-2xl lg:text-3xl text-zinc-100 leading-relaxed bg-[#D4A843]/10 rounded-r-2xl pr-6">
                &ldquo;Leadership is not about commanding power; it is about taking responsibility where others falter. When youth unite technical competence with fearless character, no fortress of inertia can withstand their resolve.&rdquo;
                <footer className="text-xs sm:text-sm font-sans font-bold not-italic tracking-wider text-[#D4A843] uppercase mt-3">
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
          <div className="text-xs font-sans font-bold tracking-widest text-[#79C7E3] uppercase">
            CONTINUUM OF INSPIRATION
          </div>
          <h3 className="text-3xl sm:text-5xl font-serif font-black text-white">
            From Fundamental Physics to Ethical Governance
          </h3>
          <p className="text-base sm:text-lg text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed">
            TechSrijan gathers India&apos;s greatest minds across eras. Before Dr. Kiran Bedi&apos;s address for 2027, the TechSrijan stage was honored by the legendary architect of Indian physics education.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: PROF. H. C. VERMA (PREVIOUS YEAR'S GUEST)
          Centered Heading in Mid + Real Photo on LEFT Side (Same side as Kiran Bedi!)
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
            <div className="text-xs sm:text-sm font-sans font-bold tracking-[0.3em] uppercase text-[#79C7E3]">
              THE LEGACY LUMINARY CONCLAVE
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight uppercase leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-[#E0F7FF] via-[#79C7E3] to-[#9DE2FB]">
              PREVIOUS YEAR CHIEF GUEST OF HONOUR
            </h2>
            
            <div className="font-editorial italic text-2xl sm:text-3xl lg:text-4xl text-[#C3EEFF]">
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
                    <div className="text-2xl sm:text-3xl font-serif font-black text-white">
                      Prof. H. C. Verma
                    </div>
                    <div className="text-xs sm:text-sm font-sans text-zinc-300">
                      {GUESTS_LIST[1].galleryImages[selectedHcPhoto].caption}
                    </div>
                    <div className="text-xs font-sans font-semibold text-[#79C7E3]">
                      Padma Shri 2020 &middot; Author of &apos;Concepts of Physics&apos; &middot; Former IIT Kanpur
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Selector Switcher */}
              <div className="p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-sans font-bold tracking-wider text-[#79C7E3] uppercase">
                  <span>PHOTO ARCHIVE VIEW</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{selectedHcPhoto + 1} / {GUESTS_LIST[1].galleryImages.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GUESTS_LIST[1].galleryImages.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setSelectedHcPhoto(pIdx)}
                      className={`text-left p-3 rounded-xl border text-xs font-sans transition-all cursor-pointer ${
                        selectedHcPhoto === pIdx
                          ? "bg-[#79C7E3]/25 border-[#79C7E3] text-white shadow-[0_0_15px_rgba(121,199,227,0.3)]"
                          : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="font-bold text-xs">{photo.label}</div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">{photo.caption}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Career Highlights */}
              <div className="p-6 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/[0.12] space-y-4">
                <div className="text-xs font-sans font-bold tracking-widest text-[#79C7E3] uppercase">
                  CAREER MILESTONES
                </div>
                <div className="grid grid-cols-2 gap-3.5 text-xs font-sans">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Civilian Award</div>
                    <div className="font-bold text-white text-sm mt-0.5">2020 · Padma Shri</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Magnum Opus</div>
                    <div className="font-bold text-white text-sm mt-0.5">1992 · Concepts of Physics</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Academic Tenure</div>
                    <div className="font-bold text-white text-sm mt-0.5">1994–17 · Prof. IIT Kanpur</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Grassroots Labs</div>
                    <div className="font-bold text-white text-sm mt-0.5">25+ NANI Centers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS COLUMN: RIGHT SIDE */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Dignitary Name & Official Designation */}
              <div className="space-y-3">
                <h3 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-[1.02]">
                  Prof. Harish Chandra Verma
                </h3>
                <div className="text-xl sm:text-2xl font-serif font-medium text-zinc-200">
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
                    className="text-xs font-sans font-semibold px-4 py-2 rounded-full bg-white/[0.07] border border-white/15 text-zinc-100"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Keynote Address Card */}
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#79C7E3]/40 bg-gradient-to-br from-[#79C7E3]/15 via-black/75 to-black/90 backdrop-blur-xl space-y-3 shadow-[0_10px_40px_rgba(121,199,227,0.12)]">
                <div className="text-xs font-sans font-bold tracking-widest text-[#79C7E3] uppercase">
                  KEYNOTE CITATION · PREVIOUS EDITION
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-snug">
                  &ldquo;The Symphony of Fundamental Science: Awakening Curiosity Beyond Blackboards&rdquo;
                </div>
                <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed pt-1">
                  Demystifying the Cosmos through Raw Physical Intuition, Grassroots Experimentation and Joyful Discovery.
                </p>
              </div>

              {/* Concise Authentic Biography */}
              <div className="space-y-4 text-base sm:text-lg text-zinc-200 font-sans leading-relaxed">
                <p>
                  An institution in himself and the intellectual guiding light for generations of Indian engineers, <strong className="text-white">Prof. H. C. Verma</strong> revolutionized science education with his timeless masterpiece, <strong className="text-[#79C7E3]">&apos;Concepts of Physics&apos;</strong>. Replacing rote examination drilling with joyful, intuitive wonder, his books have demystified physics for millions of students.
                </p>
                <p>
                  During his 23-year tenure as Professor of Experimental Physics at IIT Kanpur, Prof. Verma published over 139 research papers in nuclear physics and established the National Anveshika Network (NANI) with over 25 centers across India. Honored with the <strong className="text-white">Padma Shri</strong> by the President of India, his landmark address at TechSrijan ignited the amphitheater of MMMUT Gorakhpur, urging students to build inventions rooted in raw physical intuition.
                </p>
              </div>

              {/* Grand Memorable Pull Quote */}
              <blockquote className="border-l-4 border-[#79C7E3] pl-6 py-4 italic font-editorial text-xl sm:text-2xl lg:text-3xl text-zinc-100 leading-relaxed bg-[#79C7E3]/10 rounded-r-2xl pr-6">
                &ldquo;Science does not reside inside examination papers or algebraic symbols on a blackboard; science breathes in the flight of a sparrow, the spin of a bicycle wheel, and the relentless spark of a young student who dares to ask &apos;why&apos;. Build your machines with wonder, not with fear.&rdquo;
                <footer className="text-xs sm:text-sm font-sans font-bold not-italic tracking-wider text-[#79C7E3] uppercase mt-3">
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
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white">
            Join 5,000+ Innovators in the Arena
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
            From the keynote dais to the high-stakes battle cages of RoboWars and 24-hour coding marathons, TechSrijan &apos;27 is where legendary leadership meets cutting-edge engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79C7E3] via-[#E8D4FF] to-[#D4A843] px-8 py-3.5 text-xs font-sans font-bold text-black shadow-[0_0_30px_rgba(212,168,67,0.35)] transition-transform duration-300 hover:scale-105"
          >
            <span>Explore 30+ Arena Events</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-7 py-3.5 text-xs font-sans font-medium text-white transition-all backdrop-blur-xl"
          >
            <span>Command Roster</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] px-7 py-3.5 text-xs font-sans font-medium text-zinc-300 transition-all"
          >
            <span>About TechSrijan</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

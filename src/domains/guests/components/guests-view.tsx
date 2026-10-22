"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { GUESTS_LIST } from "../data/guests-data";
import { cn } from "@/core";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { FestFooter } from "@/shared";

export function GuestsView() {
  const hcVerma = GUESTS_LIST.find((g) => g.id === "prof-hc-verma") || GUESTS_LIST[0];
  const poonamTandon =
    GUESTS_LIST.find((g) => g.id === "prof-poonam-tandon") || GUESTS_LIST[1];

  const [selectedHcPhoto, setSelectedHcPhoto] = useState<number>(0);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -90 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-primary,#090705)] text-[var(--text-primary,#F4ECE1)] selection:bg-[var(--accent-primary)] selection:text-white font-sans overflow-x-hidden">
      {/* Background Ambience */}
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
            className="w-full h-full object-cover object-center brightness-[0.45] contrast-[1.1] filter"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/85 via-[var(--bg-primary)]/75 to-[var(--bg-primary)]" />
      </div>

      {/* Ambient lighting bloom */}
      <div
        className="hidden sm:block fixed top-1/4 -left-36 w-96 h-96 rounded-full blur-[140px] pointer-events-none z-[1] opacity-25"
        style={{ backgroundColor: "var(--accent-glow)" }}
      />

      {/* HERO SECTION */}
      <section className="relative z-10 w-full">
        <div className="pt-24 sm:pt-32 pb-14 sm:pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-white">
              PAST GUESTS OF{" "}
              <span className="text-transparent bg-clip-text theme-heading-gradient">HONOUR</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-sans leading-relaxed">
              Honouring the eminent academicians, scientists, and past keynote speakers whose
              mentorship and addresses have guided previous editions of TechSrijan at MMMUT
              Gorakhpur.
            </p>

            {/* Jump Navigation */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("prof-hc-verma")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-montserrat font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-all cursor-pointer active:scale-95"
              >
                <span>Prof. Harish Chandra Verma</span>
                <ArrowDown className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("prof-poonam-tandon")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-montserrat font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-all cursor-pointer active:scale-95"
              >
                <span>Prof. Poonam Tandon</span>
                <ArrowDown className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GUEST 1: PROF. HARISH CHANDRA VERMA */}
      <section id="prof-hc-verma" className="relative z-10 w-full scroll-mt-20 py-14 sm:py-20">
        <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Portrait & Archival Switcher */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40 shadow-2xl">
                <Image
                  src={
                    hcVerma.galleryImages && hcVerma.galleryImages[selectedHcPhoto]
                      ? hcVerma.galleryImages[selectedHcPhoto].url
                      : hcVerma.primaryImage
                  }
                  alt={hcVerma.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                  <div className="text-xs text-neutral-300 font-sans">
                    {hcVerma.galleryImages && hcVerma.galleryImages[selectedHcPhoto]
                      ? hcVerma.galleryImages[selectedHcPhoto].caption
                      : "Prof. Harish Chandra Verma"}
                  </div>
                </div>
              </div>

              {/* Photo Selector */}
              {hcVerma.galleryImages && hcVerma.galleryImages.length > 1 && (
                <div className="flex gap-2">
                  {hcVerma.galleryImages.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedHcPhoto(idx)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-montserrat font-bold tracking-wider uppercase transition-all cursor-pointer border text-center",
                        selectedHcPhoto === idx
                          ? "bg-[var(--surface-hover)] border-[var(--border-accent)] text-white shadow-sm"
                          : "bg-black/40 border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                      )}
                    >
                      {photo.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Narrative & Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Heading */}
              <div>
                <span className="font-sans font-medium text-sm sm:text-base text-[var(--accent-primary)]">
                  {hcVerma.hindiName}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black uppercase text-white tracking-tight mt-1">
                  {hcVerma.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold">
                    {hcVerma.roleBadge}
                  </span>
                  <span className="text-sm font-sans text-[var(--text-secondary)] font-medium">
                    {hcVerma.designation}
                  </span>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                {hcVerma.bio.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="pt-2">
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] font-semibold mb-3">
                  KEY HIGHLIGHTS
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {hcVerma.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50"
                    >
                      <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                        {item.title}
                      </div>
                      <div className="font-sans text-xs text-neutral-400 mt-1 leading-snug">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="pt-2 pl-4 border-l-2 border-[var(--accent-primary)] space-y-2">
                <p className="font-sans italic text-sm sm:text-base text-neutral-200 leading-relaxed">
                  &ldquo;{hcVerma.quote}&rdquo;
                </p>
                <footer className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  — {hcVerma.quoteContext}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* GUEST 2: PROF. POONAM TANDON */}
      <section id="prof-poonam-tandon" className="relative z-10 w-full scroll-mt-20 py-14 sm:py-20">
        <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Portrait */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40 shadow-2xl">
                <Image
                  src={poonamTandon.primaryImage}
                  alt={poonamTandon.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                  <div className="text-xs text-neutral-300 font-sans">
                    Prof. Poonam Tandon, Former Vice-Chancellor, DDU Gorakhpur University
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Narrative & Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Heading */}
              <div>
                <span className="font-sans font-medium text-sm sm:text-base text-[var(--accent-primary)]">
                  {poonamTandon.hindiName}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black uppercase text-white tracking-tight mt-1">
                  {poonamTandon.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold">
                    {poonamTandon.roleBadge}
                  </span>
                  <span className="text-sm font-sans text-[var(--text-secondary)] font-medium">
                    {poonamTandon.designation}
                  </span>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                {poonamTandon.bio.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="pt-2">
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] font-semibold mb-3">
                  KEY HIGHLIGHTS
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {poonamTandon.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50"
                    >
                      <div className="font-montserrat font-bold text-xs sm:text-sm text-white">
                        {item.title}
                      </div>
                      <div className="font-sans text-xs text-neutral-400 mt-1 leading-snug">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="pt-2 pl-4 border-l-2 border-[var(--accent-primary)] space-y-2">
                <p className="font-sans italic text-sm sm:text-base text-neutral-200 leading-relaxed">
                  &ldquo;{poonamTandon.quote}&rdquo;
                </p>
                <footer className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  — {poonamTandon.quoteContext}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Official Conclave Footer */}
      <FestFooter />
    </div>
  );
}

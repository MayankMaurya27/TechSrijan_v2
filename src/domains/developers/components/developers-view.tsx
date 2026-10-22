"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Code2 } from "lucide-react";
import { DEVELOPERS, type Developer } from "../data/developers-data";

export function DevelopersView() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-primary,#090705)] text-[var(--text-primary,#F4ECE1)] flex flex-col items-center justify-center px-4 sm:px-6 py-28 sm:py-32 select-none overflow-hidden">
      {/* Background Ambient Glow & Citadel Spatial Scrims */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[var(--accent-primary,#D4AF37)]/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary,#090705)] via-transparent to-[var(--bg-primary,#090705)]/80" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[var(--text-primary,#F4ECE1)] uppercase mb-12 sm:mb-16 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          Developers
        </h1>

        {/* Developer Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 justify-items-center max-w-2xl">
          {DEVELOPERS.map((dev) => (
            <DeveloperCard key={dev.name} dev={dev} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeveloperCard({ dev }: { dev: Developer }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col items-center text-center w-full max-w-[300px] p-6 rounded-2xl border border-[var(--border-subtle,#3D3028)]/50 bg-[var(--bg-secondary,#16100C)]/40 backdrop-blur-md hover:border-[var(--accent-primary,#D4AF37)]/50 hover:bg-[var(--bg-secondary,#16100C)]/80 transition-all duration-500 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7)]">
      {/* 3D Photo Frame Chassis */}
      <div className="relative mb-6">
        {/* Ambient Halo Pool */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full blur-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-70 pointer-events-none bg-[var(--accent-primary,#D4AF37)]"
        />

        {/* Orbit Ring */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full border border-dashed border-[var(--accent-primary,#D4AF37)]/25 opacity-40 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105 pointer-events-none"
        />

        {/* Outer Metallic Frame */}
        <div className="relative h-44 w-44 sm:h-48 sm:w-48 rounded-full p-[2.5px] bg-gradient-to-b from-white/30 via-[var(--accent-primary,#D4AF37)]/50 to-white/10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.9)] group-hover:from-[var(--accent-primary,#D4AF37)] group-hover:via-[var(--text-primary,#F4ECE1)] group-hover:to-[var(--accent-primary,#D4AF37)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.35)] transition-all duration-500">
          {/* Inner Photo Frame Well */}
          <div className="relative h-full w-full rounded-full overflow-hidden bg-gradient-to-b from-[#16120e] to-[#090705] flex items-center justify-center border border-black/80">
            {dev.image && !imgError ? (
              <Image
                src={dev.image}
                alt={dev.name}
                width={192}
                height={192}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              /* Avatar Placeholder (Stylized Cyber Monogram & Icon) */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1f1710] via-[#120d09] to-[#080504] group-hover:from-[#261d14] transition-colors duration-300">
                <div className="relative flex items-center justify-center mb-1">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-[var(--accent-primary,#D4AF37)]/30 bg-[var(--accent-primary,#D4AF37)]/10 flex items-center justify-center group-hover:border-[var(--accent-primary,#D4AF37)]/60 group-hover:scale-105 transition-all duration-300 shadow-[inset_0_0_15px_rgba(212,175,55,0.15)]">
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[var(--accent-primary,#D4AF37)]">
                      {dev.initials}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <User className="w-3 h-3 text-[var(--accent-primary,#D4AF37)]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--text-secondary,#D7C4B7)]">
                    Operative
                  </span>
                </div>
              </div>
            )}

            {/* Specular Glare Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-50 group-hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Developer Name Typography */}
      <h2 className="font-sans text-lg sm:text-xl font-bold tracking-wide text-[var(--text-primary,#F4ECE1)] group-hover:text-[var(--accent-primary,#D4AF37)] transition-colors duration-300">
        {dev.name}
      </h2>

      {/* Role Pill */}
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary,#D7C4B7)] font-mono">
        <Code2 className="w-3 h-3 text-[var(--accent-primary,#D4AF37)]" />
        <span>{dev.role}</span>
      </div>
    </div>
  );
}

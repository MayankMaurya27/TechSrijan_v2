"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface Developer {
  name: string;
  initials: string;
  image?: string | null;
}

const DEVELOPERS: Developer[] = [
  {
    name: "Sarthak Agarwal",
    initials: "SA",
    image: null, // Photo will be provided later to replace avatar
  },
  {
    name: "Mayank Maurya",
    initials: "MM",
    image: null, // Photo will be provided later to replace avatar
  },
];

export default function DevelopersPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#050304] text-[#f8eed9] flex flex-col items-center justify-center px-4 sm:px-6 py-24 select-none overflow-hidden">
      {/* Background Ambient Glow & Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[var(--accent-primary,#d4a843)]/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--accent-primary,#d4a843)]/35 bg-[var(--accent-primary,#d4a843)]/10 mb-6 shadow-[0_0_20px_rgba(212,168,67,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary,#d4a843)] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[var(--accent-primary,#d4a843)] font-semibold">
            Citadel Architecture
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wider text-[#f8eed9] uppercase mb-12 sm:mb-16">
          Developers
        </h1>

        {/* Developer Cards with Photo Frames & Avatars */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 justify-items-center">
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
    <div className="group relative flex flex-col items-center text-center w-full max-w-[280px]">
      {/* 3D Photo Frame Chassis */}
      <div className="relative mb-6">
        {/* Ambient Halo Pool */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full blur-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-70 pointer-events-none bg-[var(--accent-primary,#d4a843)]"
        />

        {/* Orbit Ring */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full border border-dashed border-[var(--accent-primary,#d4a843)]/25 opacity-40 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105 pointer-events-none"
        />

        {/* Outer Metallic Frame */}
        <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full p-[2.5px] bg-gradient-to-b from-white/30 via-[var(--accent-primary,#d4a843)]/50 to-white/10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.9)] group-hover:from-[var(--accent-primary,#d4a843)] group-hover:via-[#f8eed9] group-hover:to-[var(--accent-primary,#d4a843)] group-hover:shadow-[0_0_35px_rgba(212,168,67,0.35)] transition-all duration-500">
          {/* Inner Photo Frame Well */}
          <div className="relative h-full w-full rounded-full overflow-hidden bg-gradient-to-b from-[#16120e] to-[#090705] flex items-center justify-center border border-black/80">
            {dev.image && !imgError ? (
              <img
                src={dev.image}
                alt={dev.name}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              /* Avatar Placeholder (Stylized Cyber Monogram & Icon) */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1f1710] via-[#120d09] to-[#080504] group-hover:from-[#261d14] transition-colors duration-300">
                <div className="relative flex items-center justify-center mb-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[var(--accent-primary,#d4a843)]/30 bg-[var(--accent-primary,#d4a843)]/10 flex items-center justify-center group-hover:border-[var(--accent-primary,#d4a843)]/60 group-hover:scale-105 transition-all duration-300 shadow-[inset_0_0_15px_rgba(212,168,67,0.15)]">
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[var(--accent-primary,#d4a843)]">
                      {dev.initials}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <User className="w-3 h-3 text-[var(--accent-primary,#d4a843)]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#a39480]">
                    Avatar Frame
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
      <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-wide text-[#f8eed9] group-hover:text-[var(--accent-primary,#d4a843)] transition-colors duration-300">
        {dev.name}
      </h2>
    </div>
  );
}

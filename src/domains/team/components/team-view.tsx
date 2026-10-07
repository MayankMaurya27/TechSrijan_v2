"use client";

import { useState } from "react";
import { Volume2, Play } from "lucide-react";
import { OPERATIVES_ROSTER, type Operative } from "../data/team-roster";
import { OperativeCard } from "./operative-card";
import { OperativeDossierModal } from "./operative-dossier-modal";
import { Team3DBackground } from "./team-3d-background";

export function TeamView() {
  const [selectedOperative, setSelectedOperative] = useState<Operative | null>(null);
  const [audioActive, setAudioActive] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black">
      {/* 3D Celestial Constellation & Spice Dust Background */}
      <Team3DBackground />

      {/* Atmospheric Radial Lighting Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-[15%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[140px]" />
        <div className="absolute top-[30%] right-[5%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.04] blur-[160px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[500px] w-[500px] rounded-full bg-purple-600/[0.05] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-32 sm:px-8 lg:px-12">
        {/* ============================================================
            HEADER: "Meet Our Team" Master Designer Title
            ============================================================ */}
        <div className="pt-6 sm:pt-10 mb-14 sm:mb-20">
          {/* Master Designer Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white">
            <span className="font-editorial italic font-normal text-zinc-300 mr-2 sm:mr-3.5">
              Meet
            </span>
            <span className="font-sans font-light tracking-tight text-white mr-2 sm:mr-3.5">
              Our
            </span>
            <span className="font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5E6] via-[#E8CF9A] to-[#C49B4D] drop-shadow-[0_0_30px_rgba(212,168,67,0.35)]">
              Team
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans max-w-xl leading-relaxed">
            The students, guild leads, and faculty commanders forging the directives of TechSrijan &apos;27.
          </p>
        </div>

        {/* ============================================================
            TEAM CARDS: 3-Column Responsive Grid (Clean Designer Layout)
            ============================================================ */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 sm:gap-x-12 sm:gap-y-20 justify-items-center">
            {OPERATIVES_ROSTER.map((op) => (
              <OperativeCard
                key={op.id}
                operative={op}
                onOpenDossier={setSelectedOperative}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM LEFT: Floating Ambient / Play Button (Matching Reference)
          ============================================================ */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setAudioActive(!audioActive)}
          type="button"
          aria-label={audioActive ? "Mute audio" : "Play ambient"}
          title={audioActive ? "Ambient Sound Active" : "Play Ambient Audio"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.15] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/30"
        >
          {audioActive ? (
            <Volume2 className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white/90 fill-white/80 ml-0.5" />
          )}
        </button>
      </div>

      {/* Operative Modal Dialog */}
      <OperativeDossierModal
        operative={selectedOperative}
        onClose={() => setSelectedOperative(null)}
      />
    </div>
  );
}

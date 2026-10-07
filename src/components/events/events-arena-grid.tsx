"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, X, Check, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

export function EventsArenaGrid() {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "WORKSHOPS" | "UPCOMING">("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  return (
    <section className="relative w-full z-30 pt-12 sm:pt-24 pb-24 sm:pb-36 px-3 sm:px-8 max-w-7xl mx-auto">
      {/* Tactical Section Header (Placed directly below navbar) */}
      <div className="text-center md:text-left mb-8 sm:mb-16 border-b border-white/15 pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] text-white/60 uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>// IMPERIUM COMBAT DIRECTIVES // THE ARENA ROSTER</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              ACTIVE DIRECTIVES
            </h2>
            <p className="mt-2 sm:mt-3 max-w-2xl font-mono text-[10px] sm:text-sm text-neutral-400 uppercase tracking-wider leading-relaxed">
              CHOOSE A CLASSIFIED MISSION DOSSIER TO ENGAGE OPERATIONAL PARAMETERS, CAPACITY CONSTRAINTS, AND SQUAD RESERVATIONS.
            </p>
          </div>

          {/* Category Filter Pills - scrollable on mobile */}
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-xs tracking-wider self-start sm:self-center md:self-end overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-nowrap">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-3 py-1.5 rounded-sm border transition-all whitespace-nowrap active:scale-95 ${
                selectedFilter === "ALL"
                  ? "border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-white/20 bg-black/40 text-neutral-400 hover:text-white hover:border-white/40"
              }`}
            >
              ALL (4)
            </button>
            <button
              onClick={() => setSelectedFilter("WORKSHOPS")}
              className={`px-3 py-1.5 rounded-sm border transition-all whitespace-nowrap active:scale-95 ${
                selectedFilter === "WORKSHOPS"
                  ? "border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-white/20 bg-black/40 text-neutral-400 hover:text-white hover:border-white/40"
              }`}
            >
              WORKSHOPS (1)
            </button>
            <button
              onClick={() => setSelectedFilter("UPCOMING")}
              className={`px-3 py-1.5 rounded-sm border transition-all whitespace-nowrap active:scale-95 ${
                selectedFilter === "UPCOMING"
                  ? "border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "border-white/20 bg-black/40 text-neutral-400 hover:text-white hover:border-white/40"
              }`}
            >
              OPEN SLOTS (3)
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid - 2 cols on mobile, scales up on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 lg:gap-8 justify-items-center items-start">
        {/* CARD 1: THE SIGNAL (Reference Event Card with Content) */}
        {(selectedFilter === "ALL" || selectedFilter === "WORKSHOPS") && (
          <div className="flex flex-col items-center w-full max-w-[340px]">
            {/* Status tag */}
            <div className="w-full flex items-center justify-between px-3 mb-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
              <span className="text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                // DIRECTIVE 01
              </span>
              <span className="text-white/60">30 SEATS</span>
            </div>

            {/* The Sculpted Event Box Card */}
            <div
              onClick={() => setModalOpen(true)}
              className="relative w-full aspect-[2/3] group cursor-pointer select-none transition-all duration-500 hover:-translate-y-2 hover:drop-shadow-[0_12px_35px_rgba(255,255,255,0.18)]"
            >
              {/* Outer sculpt image */}
              <img
                src="/real-event.webp"
                alt="The Signal Event Card"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
              />

              {/* Interactive hotspot over the 'RESERVE YOUR PLACE' button */}
              <div className="absolute bottom-[10.5%] inset-x-[18%] h-[5.8%] rounded-full border border-transparent group-hover:border-white/80 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.7)] group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                <span className="sr-only">Reserve Your Place</span>
              </div>

              {/* Hover Badge Pill */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white text-black font-bold shadow-lg">
                  VIEW DOSSIER ›
                </span>
              </div>
            </div>

            {/* Card Caption / Quick Actions */}
            <div className="mt-3 w-full text-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="font-mono text-xs tracking-[0.2em] text-neutral-300 hover:text-white uppercase inline-flex items-center gap-1.5 transition-colors"
              >
                <span>OPEN DOSSIER PARAMETERS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CARD 2: Empty Card 1 (As requested: remaining cards are empty with event listing in one card for reference) */}
        {(selectedFilter === "ALL" || selectedFilter === "UPCOMING") && (
          <div className="flex flex-col items-center w-full max-w-[340px]">
            <div className="w-full flex items-center justify-between px-3 mb-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
              <span className="text-neutral-500">// DIRECTIVE 02</span>
              <span className="text-neutral-600">UNASSIGNED</span>
            </div>

            <div className="relative w-full aspect-[2/3] group select-none transition-all duration-500 hover:-translate-y-1 hover:drop-shadow-[0_10px_25px_rgba(255,255,255,0.08)]">
              {/* Outer sculpt image */}
              <img
                src="/real-event.webp"
                alt="Empty Event Card Slot"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] opacity-90"
              />

              {/* Interior Slate Cover for Empty Card */}
              <div className="absolute inset-[13%] rounded-[2.8rem] bg-[#1a1b1d] flex flex-col items-center justify-between p-6 sm:p-7 text-center border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                {/* Header empty slot */}
                <div className="w-full pt-4">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/30 uppercase block">
                    FIELD DIRECTIVE
                  </span>
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mt-3" />
                </div>

                {/* Center unassigned icon & copy */}
                <div className="my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 mb-3 group-hover:scale-110 group-hover:border-white/50 transition-all">
                    <Sparkles className="w-5 h-5 text-white/30" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white/30 tracking-wider">
                    SLOT // 02
                  </h3>
                  <p className="mt-2 text-[10px] sm:text-[11px] font-sans text-white/25 max-w-[170px] leading-relaxed">
                    Sector directive pending Imperium classification.
                  </p>
                </div>

                {/* Bottom empty status */}
                <div className="w-full pb-3">
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mb-3" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase block">
                    TBA • SECTOR B-2
                  </span>
                  <div className="mt-3 mx-auto w-4/5 py-1.5 rounded-full border border-white/10 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                    AWAITING DECREE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 w-full text-center">
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-600 uppercase">
                RESERVED FOR MISSION // 02
              </span>
            </div>
          </div>
        )}

        {/* CARD 3: Empty Card 2 */}
        {(selectedFilter === "ALL" || selectedFilter === "UPCOMING") && (
          <div className="flex flex-col items-center w-full max-w-[340px]">
            <div className="w-full flex items-center justify-between px-3 mb-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
              <span className="text-neutral-500">// DIRECTIVE 03</span>
              <span className="text-neutral-600">UNASSIGNED</span>
            </div>

            <div className="relative w-full aspect-[2/3] group select-none transition-all duration-500 hover:-translate-y-1 hover:drop-shadow-[0_10px_25px_rgba(255,255,255,0.08)]">
              <img
                src="/real-event.webp"
                alt="Empty Event Card Slot"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] opacity-90"
              />

              <div className="absolute inset-[13%] rounded-[2.8rem] bg-[#1a1b1d] flex flex-col items-center justify-between p-6 sm:p-7 text-center border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="w-full pt-4">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/30 uppercase block">
                    COMBAT EXTRACTION
                  </span>
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mt-3" />
                </div>

                <div className="my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 mb-3 group-hover:scale-110 group-hover:border-white/50 transition-all">
                    <ShieldAlert className="w-5 h-5 text-white/30" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white/30 tracking-wider">
                    SLOT // 03
                  </h3>
                  <p className="mt-2 text-[10px] sm:text-[11px] font-sans text-white/25 max-w-[170px] leading-relaxed">
                    Algorithmic crucible under Arrakis planetary constraints.
                  </p>
                </div>

                <div className="w-full pb-3">
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mb-3" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase block">
                    TBA • SECTOR C-1
                  </span>
                  <div className="mt-3 mx-auto w-4/5 py-1.5 rounded-full border border-white/10 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                    AWAITING DECREE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 w-full text-center">
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-600 uppercase">
                RESERVED FOR MISSION // 03
              </span>
            </div>
          </div>
        )}

        {/* CARD 4: Empty Card 3 */}
        {(selectedFilter === "ALL" || selectedFilter === "UPCOMING") && (
          <div className="flex flex-col items-center w-full max-w-[340px]">
            <div className="w-full flex items-center justify-between px-3 mb-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
              <span className="text-neutral-500">// DIRECTIVE 04</span>
              <span className="text-neutral-600">UNASSIGNED</span>
            </div>

            <div className="relative w-full aspect-[2/3] group select-none transition-all duration-500 hover:-translate-y-1 hover:drop-shadow-[0_10px_25px_rgba(255,255,255,0.08)]">
              <img
                src="/real-event.webp"
                alt="Empty Event Card Slot"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] opacity-90"
              />

              <div className="absolute inset-[13%] rounded-[2.8rem] bg-[#1a1b1d] flex flex-col items-center justify-between p-6 sm:p-7 text-center border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="w-full pt-4">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/30 uppercase block">
                    AUTONOMOUS SWARM
                  </span>
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mt-3" />
                </div>

                <div className="my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 mb-3 group-hover:scale-110 group-hover:border-white/50 transition-all">
                    <Users className="w-5 h-5 text-white/30" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white/30 tracking-wider">
                    SLOT // 04
                  </h3>
                  <p className="mt-2 text-[10px] sm:text-[11px] font-sans text-white/25 max-w-[170px] leading-relaxed">
                    Robotics and aerial vehicle navigation protocols.
                  </p>
                </div>

                <div className="w-full pb-3">
                  <div className="w-12 h-[1px] bg-white/10 mx-auto mb-3" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase block">
                    TBA • ARENA GROUNDS
                  </span>
                  <div className="mt-3 mx-auto w-4/5 py-1.5 rounded-full border border-white/10 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                    AWAITING DECREE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 w-full text-center">
              <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-600 uppercase">
                RESERVED FOR MISSION // 04
              </span>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE DOSSIER MODAL FOR 'THE SIGNAL' */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            {/* Backdrop Dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[88dvh] overflow-y-auto overscroll-contain rounded-xl border border-white/25 bg-[#0d0d0f] p-5 sm:p-10 shadow-2xl text-white z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neutral-300 hover:text-white hover:border-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tag / Category */}
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>FIELD WORKSHOP // SECTOR ALPHA</span>
              </div>

              {/* Title & Tagline */}
              <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                THE SIGNAL
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                Systems, strategy & the future of human-machine craft.
              </p>

              {/* Meta Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg border border-white/15 bg-white/5 p-4 font-mono text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> DATE
                  </span>
                  <span className="font-bold text-white text-sm">24 OCT 2025</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> TIME
                  </span>
                  <span className="font-bold text-white text-sm">10:30 AM</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> LOCATION
                  </span>
                  <span className="font-bold text-white text-sm">AUDITORIUM I</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1">
                    <Users className="w-3 h-3" /> CAPACITY
                  </span>
                  <span className="font-bold text-white text-sm">30 SEATS MAX</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">ELIGIBILITY</span>
                  <span className="font-bold text-white text-sm">ALL STUDENTS</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">PASS PROTOCOL</span>
                  <span className="font-bold text-emerald-400 text-sm">FREE ACCESS</span>
                </div>
              </div>

              {/* Workshop Parameters */}
              <div className="mt-6 space-y-3 font-mono text-xs text-neutral-300">
                <h4 className="tracking-[0.25em] text-white uppercase text-[11px] font-bold">
                  // OPERATIONAL PARAMETERS
                </h4>
                <ul className="space-y-1.5 pl-1 text-[11px]">
                  <li className="flex items-start gap-2">
                    <span className="text-white">›</span>
                    <span>Bring Your Own Device (BYOD) with pre-configured development environment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">›</span>
                    <span>Live architectural case studies and hands-on system synthesis challenges.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">›</span>
                    <span>Verified attendee credentials issued upon workshop completion.</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400">
                  {isReserved ? "STATUS: SEAT #14 SECURED" : "LIMITED CAPACITY // STRICT CURFEW"}
                </span>

                <button
                  type="button"
                  onClick={() => setIsReserved(true)}
                  disabled={isReserved}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all cursor-pointer active:scale-95 ${
                    isReserved
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-default"
                      : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  }`}
                >
                  {isReserved ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> PLACE RESERVED
                    </span>
                  ) : (
                    "RESERVE YOUR PLACE"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

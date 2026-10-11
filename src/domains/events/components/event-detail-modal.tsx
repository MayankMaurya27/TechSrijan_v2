"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Users, MapPin, Calendar, CheckCircle2, Shield, Share2 } from "lucide-react";
import type { DetailedEvent } from "./club-events-section";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

interface EventDetailModalProps {
  event: DetailedEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  // ESC key listener to close modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [event, onClose]);

  if (!event) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Event "${event.name}" link copied to clipboard!`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window with Depth Shadow & Inner Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl my-auto text-left"
        >
          {/* Offset Shadow (matching stack card theme in deep black) */}
          <div className="absolute top-2 left-2 inset-0 bg-black border border-white/10 rounded-[1.75rem] pointer-events-none" />

          {/* Inner Content Surface in Dune Black & White Theme */}
          <div className="relative z-10 bg-[#0d0e13] border border-white/20 rounded-[1.75rem] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden max-h-[88vh] flex flex-col">
            {/* Top Silver Accent Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Header: Club Badge + Close Button */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white font-bold">
                  {event.clubName}
                </span>
                <span className="text-white/20">|</span>
                <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-neutral-400">
                  {event.category}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 text-white/70 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 pr-1 py-4 space-y-5 flex-1">
              {/* Event Image Banner */}
              {event.image && (
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 bg-black">
                  <img
                    src={getOptimizedImageUrl(event.image, 1000)}
                    alt={event.name}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/events-hero-poster.webp";
                    }}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Event Title & Tagline */}
              <div>
                <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-snug">
                  {event.name}
                </h2>
                <p className="mt-1 font-sans text-xs sm:text-sm text-neutral-400 italic">
                  &ldquo;{event.tagline}&rdquo;
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Prize Pool</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">{event.prizePool}</span>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Team Format</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">{event.teamSize}</span>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Venue</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-white truncate">{event.venue}</span>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Schedule</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-white truncate">{event.date}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Event Overview</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed bg-black/50 p-3.5 rounded-xl border border-white/10">
                  {event.description}
                </p>
              </div>

              {/* Rounds Breakdown */}
              {event.rounds && event.rounds.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    Competition Structure
                  </h3>
                  <div className="space-y-2">
                    {event.rounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-mono text-xs font-bold text-white uppercase">{round.title}</h4>
                          <p className="mt-0.5 font-sans text-xs text-neutral-400 leading-normal">{round.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Guidelines */}
              {event.rules && event.rules.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    Key Rules &amp; Regulations
                  </h3>
                  <ul className="space-y-1.5 bg-black/50 p-3.5 rounded-xl border border-white/10">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-sans text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/70 flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="/signup"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Sparkles, Users, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { AmbassadorModal } from "./ambassador-modal";

const PRIVILEGES = [
  {
    icon: Award,
    title: "Official LOR & Certificate",
    description: "Verified recommendation letter signed directly by the MMMUT Technical Sub Council.",
  },
  {
    icon: Shield,
    title: "VIP Passes & Access",
    description: "Complimentary all-access passes, speaker dinners, and backstage hospitality privileges.",
  },
  {
    icon: Sparkles,
    title: "Cash Bounties & Apparel",
    description: "Tiered cash awards, exclusive Vanguard hoodie kits, and customized fest merchandise.",
  },
  {
    icon: Users,
    title: "Priority Sponsor Leads",
    description: "Fast-track interview and internship opportunities with prominent sponsoring tech brands.",
  },
];

export function AmbassadorApply() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen for global open requests (e.g. from hero/perks buttons)
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener("open-ambassador-modal", handleOpen);

    // Also check if initial URL had #apply
    if (window.location.hash === "#apply") {
      setIsModalOpen(true);
    }

    return () => {
      window.removeEventListener("open-ambassador-modal", handleOpen);
    };
  }, []);

  return (
    <section
      id="apply"
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-18 lg:pb-20 bg-black overflow-hidden select-none"
    >
      {/* Ambient background bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-red-950/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[350px] bg-red-900/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* ========================================================
            SECTION HEADER: Matches "YOUR JOURNEY" Aesthetic
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-impact text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            JOIN THE{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              LEGION
            </span>
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Applications are officially open across Gorakhpur and Eastern UP. Claim
            your command post as a TechSrijan&apos;27 Campus Ambassador.
          </p>
        </motion.div>

        {/* ========================================================
            VANGUARD ENLISTMENT CONSOLE DECK
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-6 sm:p-9 rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-[#160407]/90 via-[#0B0204]/95 to-black/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden"
        >
          {/* Tech Corner Brackets */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 pointer-events-none" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 pointer-events-none" />

          {/* Top Live Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-red-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-red-400">
                SYSTEM: ENLISTMENT WINDOW ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-neutral-400">
              <span className="hidden sm:inline">ZERO REGISTRATION FEE</span>
              <span className="text-red-500">•</span>
              <span>48-HR VERIFICATION SLA</span>
            </div>
          </div>

          {/* 4 Command Privileges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
            {PRIVILEGES.map((priv) => (
              <div
                key={priv.title}
                className="p-4 rounded-lg border border-red-500/15 bg-black/40 hover:border-red-500/40 transition-colors flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-md bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                  <priv.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-impact text-base text-white tracking-wide uppercase">
                    {priv.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-neutral-400 font-sans leading-relaxed">
                    {priv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Enlistment Trigger Button */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase font-bold text-white bg-gradient-to-r from-[#991B1B] via-[#C51D24] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#E61924] transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_45px_rgba(255,42,54,0.8)] active:scale-[0.98] border border-red-500/60"
              style={{
                clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
              }}
            >
              {/* Shimmer light bar */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Zap className="w-4 h-4 text-white animate-pulse" />
              <span className="relative z-10">ENLIST IN THE VANGUARD</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500">
              CLICK TO LAUNCH OFFICIAL APPLICATION TERMINAL // BATCH 2026-27
            </span>
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          POPUP MODAL COMPONENT (Self-contained, Multi-step)
          ======================================================== */}
      <AmbassadorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LEADERBOARD = [
  { rank: 1, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "A" },
  { rank: 2, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "B" },
  { rank: 3, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "C" },
  { rank: 4, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "D" },
  { rank: 5, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "E" },
];

const RANK_BADGES = [
  "bg-gradient-to-r from-[#FF1E27] to-[#DC2626] text-white shadow-[0_0_12px_rgba(255,30,39,0.7)] border border-red-400",
  "bg-gradient-to-r from-[#C4131C] to-[#8A0B12] text-white border border-red-500/60",
  "bg-gradient-to-r from-[#8A0B12] to-[#5A070B] text-neutral-200 border border-red-500/40",
  "bg-[#1A0406] text-neutral-400 border border-red-950/60",
  "bg-[#1A0406] text-neutral-400 border border-red-950/60",
];

export function AmbassadorLeaderboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden select-none"
    >
      {/* Crimson bleed */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-red-950/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
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
            LIVE{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              LEADERBOARD
            </span>
          </h2>
          <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Top ambassadors climb the ranks through completed missions.
            Rankings update in real-time.
          </p>
        </motion.div>

        {/* Leaderboard table */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg border border-red-500/25 bg-gradient-to-b from-[#140406]/90 via-[#0B0204]/95 to-black/95 shadow-[0_15px_35px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[70px_1.5fr_1.5fr_120px] gap-3 px-5 sm:px-8 py-3.5 border-b border-red-500/20 font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400 bg-red-950/20">
            <span>Rank</span>
            <span>Ambassador</span>
            <span className="hidden sm:block">College</span>
            <span className="text-right">Points</span>
          </div>

          {/* Rows */}
          {LEADERBOARD.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.08 * i + 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[70px_1.5fr_1.5fr_120px] gap-3 items-center px-5 sm:px-8 py-4 border-b border-red-950/40 last:border-0 hover:bg-red-950/25 transition-colors font-sans text-sm"
            >
              {/* Rank */}
              <div>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-sm font-mono text-xs font-bold ${
                    RANK_BADGES[i] || "bg-[#1A0406] text-neutral-400 border border-red-950/60"
                  }`}
                >
                  {entry.rank}
                </span>
              </div>

              {/* Name + avatar placeholder */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center font-mono text-[10px] text-red-400 shrink-0">
                  {entry.avatar}
                </div>
                <span className="font-semibold text-white truncate text-xs sm:text-sm">
                  {entry.name}
                </span>
              </div>

              {/* College */}
              <div className="hidden sm:block text-neutral-400 truncate text-xs">
                {entry.college}
              </div>

              {/* Points */}
              <div className="text-right font-mono text-xs sm:text-sm font-bold text-red-400">
                {entry.points}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

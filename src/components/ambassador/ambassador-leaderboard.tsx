"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAmbassadorTheme } from "./ambassador-theme";

const LEADERBOARD = [
  { rank: 1, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "A" },
  { rank: 2, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "B" },
  { rank: 3, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "C" },
  { rank: 4, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "D" },
  { rank: 5, name: "To Be Announced", college: "Registration Open", points: "---", avatar: "E" },
];

export function AmbassadorLeaderboard() {
  const t = useAmbassadorTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const rankBadges = [
    t.rank1Badge,
    t.rank2Badge,
    t.rank3Badge,
    "bg-[#111317] text-neutral-400 border border-neutral-800",
    "bg-[#111317] text-neutral-400 border border-neutral-800",
  ];

  return (
    <section
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden select-none"
    >
      {/* Ambient bleed */}
      <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] ${t.leaderboardAtmosphereClass} blur-[140px] rounded-full pointer-events-none transition-colors duration-500`} />

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
            <span className={`${t.leaderboardHeaderGradient} drop-shadow-[0_0_35px_${t.accentGlow}] transition-colors duration-500`}>
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
          className={`rounded-lg border ${t.leaderboardTableBorder} bg-gradient-to-b from-[#140406]/90 via-[#0B0204]/95 to-black/95 shadow-[0_15px_35px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500`}
        >
          {/* Header */}
          <div className={`grid grid-cols-[50px_1fr_100px] sm:grid-cols-[70px_1.5fr_1.5fr_120px] gap-3 px-5 sm:px-8 py-3.5 border-b font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400 ${t.leaderboardHeaderBg} transition-colors duration-500`}>
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
              className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[70px_1.5fr_1.5fr_120px] gap-3 items-center px-5 sm:px-8 py-4 border-b border-neutral-900/60 last:border-0 hover:bg-white/[0.02] transition-colors font-sans text-sm"
            >
              {/* Rank */}
              <div>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-sm font-mono text-xs font-bold transition-all duration-300 ${
                    rankBadges[i] || "bg-[#111317] text-neutral-400 border border-neutral-800"
                  }`}
                >
                  {entry.rank}
                </span>
              </div>

              {/* Name + avatar placeholder */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-6 h-6 rounded-full bg-black/60 border flex items-center justify-center font-mono text-[10px] shrink-0 transition-colors duration-500"
                  style={{ borderColor: `${t.accent}4D`, color: t.accent }}
                >
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
              <div className={`text-right font-mono text-xs sm:text-sm font-bold ${t.leaderboardPointsColor} transition-colors duration-500`}>
                {entry.points}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

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

const RANK_COLORS = [
  "from-yellow-400 to-amber-600",   // #1 Gold
  "from-neutral-300 to-neutral-500", // #2 Silver
  "from-orange-600 to-amber-800",    // #3 Bronze
  "from-neutral-600 to-neutral-700", // #4
  "from-neutral-600 to-neutral-700", // #5
];

export function AmbassadorLeaderboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative py-14 sm:py-18 lg:py-20 bg-black overflow-hidden"
    >
      {/* Crimson bleed */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Live{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Leaderboard
            </span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            Top ambassadors climb the ranks through completed missions.
            Rankings update in real-time.
          </p>
        </motion.div>

        {/* Leaderboard table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-sm border border-white/[0.06] bg-white/[0.015] overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[60px_1fr_1fr_120px] gap-2 px-4 sm:px-6 py-3 border-b border-white/[0.06] font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
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
                duration: 0.6,
                delay: 0.1 * i + 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[60px_1fr_1fr_120px] gap-2 px-4 sm:px-6 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center"
            >
              {/* Rank badge */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-mono bg-gradient-to-br ${RANK_COLORS[i]} text-black`}
                >
                  {entry.rank}
                </span>
              </div>

              {/* Name + avatar */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center font-mono text-xs text-neutral-500">
                  {entry.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-sans font-medium">{entry.name}</div>
                  <div className="sm:hidden text-neutral-500 text-[10px] font-mono">{entry.college}</div>
                </div>
              </div>

              {/* College (desktop) */}
              <div className="hidden sm:block text-neutral-400 text-sm font-sans truncate">
                {entry.college}
              </div>

              {/* Points */}
              <div className="text-right font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                {entry.points}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-600"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Awaiting Registrations
          </span>
          <span>Season 2027</span>
        </motion.div>
      </div>
    </section>
  );
}

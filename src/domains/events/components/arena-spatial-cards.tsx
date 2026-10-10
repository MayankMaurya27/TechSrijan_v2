"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, X, Check, Sparkles, ShieldAlert, Cpu, Terminal, Trophy } from "lucide-react";

export interface ArenaSpot {
  id: string;
  slotNumber: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  prizePool: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  eligibility: string;
  icon: "cpu" | "shield" | "sparkles" | "terminal";
  rules: string[];
}

export const ARENA_SPOTS: ArenaSpot[] = [
  {
    id: "algo-warfare",
    slotNumber: "01",
    title: "ALGO WARFARE",
    category: "COMPETITIVE CODE",
    tagline: "High-frequency algorithmic warfare under planetary network latency.",
    description: "Elite competitive programming tournament. Operatives solve high-dimensional heuristic problems, dynamic graph routing, and adversarial data puzzles under strict time limits.",
    prizePool: "₹50,000 POOL",
    date: "24 OCT 2025",
    time: "10:30 AM",
    location: "AUDITORIUM I",
    capacity: "120 TEAMS",
    eligibility: "UG / PG STUDENTS",
    icon: "cpu",
    rules: [
      "Live algorithmic problems evaluated against strict time & memory bounds.",
      "Individual or team entry up to 3 operatives.",
      "Standard languages permitted: C++, Rust, Python3, Java.",
      "Real-time Giedi Prime arena leaderboard with dynamic point decay.",
    ],
  },
  {
    id: "autonomous-swarm",
    slotNumber: "02",
    title: "AUTONOMOUS SWARM",
    category: "AERIAL ROBOTICS",
    tagline: "Unmanned robotic swarm navigation through zero-visibility sandstorms.",
    description: "Build, program, and pilot autonomous rovers and aerial micro-drones through a high-friction arena with simulated dust storms, magnetic distortion, and optical jamming.",
    prizePool: "₹45,000 POOL",
    date: "24 OCT 2025",
    time: "02:00 PM",
    location: "ARENA SECTOR B",
    capacity: "45 TEAMS",
    eligibility: "ALL STUDENTS",
    icon: "shield",
    rules: [
      "Autonomous navigation track with lidar / ultrasonic obstacle avoidance.",
      "Maximum drone weight 1.5kg; custom firmware subject to pre-flight inspection.",
      "Time-trial scoring with point multiplier for full sensor-denied runs.",
      "Dual telemetry blackbox verification mandatory for final qualification.",
    ],
  },
  {
    id: "circuit-overload",
    slotNumber: "03",
    title: "CIRCUIT OVERLOAD",
    category: "HARDWARE SYNTHESIS",
    tagline: "Silicon extraction, embedded logic bypass, and sovereign hardware defense.",
    description: "Intense 24-hour hardware and embedded systems hackathon. Reverse engineer hardened micro-controllers, decode RF signals, and design custom PCB defense modules.",
    prizePool: "₹40,000 POOL",
    date: "25 OCT 2025",
    time: "09:30 AM",
    location: "HARDWARE CORE LAB",
    capacity: "60 TEAMS",
    eligibility: "ENGINEERING CADRES",
    icon: "sparkles",
    rules: [
      "Pre-packaged dev kits provided at launch; bring your logic analyzers & soldering stations.",
      "Rapid prototype milestone checkpoints evaluated every 6 hours.",
      "Final working silicon demonstrations judged on power efficiency and durability.",
      "Zero emulation permitted; physical verification required.",
    ],
  },
  {
    id: "cyber-siege",
    slotNumber: "04",
    title: "CYBER SIEGE",
    category: "OFFENSIVE INTEL",
    tagline: "Full-spectrum offensive cyber warfare, binary exploitation, and CTF duel.",
    description: "Defend sovereign systems and penetrate adversarial redoubts. Jeopardy and attack-defense format covering binary exploitation, kernel pwn, cryptography, and zero-day chains.",
    prizePool: "₹60,000 POOL",
    date: "25 OCT 2025",
    time: "01:30 PM",
    location: "TACTICAL OPS HALL",
    capacity: "80 SQUADS",
    eligibility: "GLOBAL ENLISTMENT",
    icon: "terminal",
    rules: [
      "Isolated air-gapped competition network with live scoreboard telemetry.",
      "Teams of 1 to 4 operatives; zero unauthorized external relay.",
      "Flag submission authenticated via cryptographic signature tokens.",
      "First-blood bonuses applied to hardest exploitation vectors.",
    ],
  },
];

interface ArenaSpatialCardsProps {
  isVisible: boolean;
}

function SlotIcon({ icon }: { icon: ArenaSpot["icon"] }) {
  const cls = "w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors";
  switch (icon) {
    case "sparkles": return <Sparkles className={cls} />;
    case "shield": return <ShieldAlert className={cls} />;
    case "terminal": return <Terminal className={cls} />;
    default: return <Cpu className={cls} />;
  }
}

function EventCard({ spot, idx, onClick }: { spot: ArenaSpot; idx: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
      onClick={onClick}
      className="relative w-full cursor-pointer group flex items-center justify-center select-none active:scale-95 transition-transform duration-150"
    >
      <div className="relative w-full aspect-[2/3] max-h-[38vh] sm:max-h-[48vh] md:max-h-[66vh] max-w-[280px] sm:max-w-[305px] lg:max-w-[330px] flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5">
        {/* Dark Glass Interior Backing (Ensures 100% text legibility over arena background video) */}
        <div className="absolute inset-[4%_4%] sm:inset-[4.5%_4.5%] rounded-[14px] sm:rounded-[22px] bg-black/75 sm:bg-black/80 backdrop-blur-md border border-white/10 pt-[12%] pb-[10%] sm:pt-[14%] sm:pb-[12%] px-[9%] sm:px-[11%] flex flex-col justify-between text-left z-10 transition-all duration-300 group-hover:bg-black/85 group-hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
          {/* 1. Category / Eyebrow Header (Bebas Neue Subheading) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bebas text-[11px] sm:text-xs md:text-sm tracking-wider text-neutral-300 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
              {spot.category}
            </span>
            <div className="h-[1px] flex-1 max-w-[28px] sm:max-w-[36px] bg-gradient-to-r from-white/40 to-transparent" />
          </div>

          {/* 2. Main Event Title (Montserrat) & Tagline (Chancery Italic) */}
          <div className="my-auto py-0.5 sm:py-1">
            <h3 className="font-montserrat font-black tracking-tight text-white uppercase text-xs sm:text-base md:text-xl lg:text-[22px] leading-[1.08] drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
              {spot.title}
            </h3>

            <p className="mt-0.5 sm:mt-1 font-chancery italic text-[11px] sm:text-[13px] md:text-[14px] text-neutral-200 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
              "{spot.tagline}"
            </p>
          </div>

          {/* 3. Starburst Divider Accent */}
          <div className="relative flex items-center justify-center w-full py-0.5 my-0.5">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="absolute px-1 text-white text-[8px] sm:text-[9px] drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
              ✦
            </span>
          </div>

          {/* 4. 3-Column Metadata Bar (Date, Time, Venue) */}
          <div className="grid grid-cols-3 gap-0.5 py-1 w-full border-t border-b border-white/10">
            {/* DATE */}
            <div className="flex flex-col items-center text-center px-0.5 border-r border-white/10">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/20 flex items-center justify-center mb-0.5 bg-white/5">
                <Calendar className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/90" />
              </div>
              <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.15em] text-neutral-400 uppercase font-semibold">
                DATE
              </span>
              <span className="font-sans font-bold text-[8.5px] sm:text-[9.5px] md:text-[10px] text-white leading-tight mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                {spot.date}
              </span>
            </div>

            {/* TIME */}
            <div className="flex flex-col items-center text-center px-0.5 border-r border-white/10">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/20 flex items-center justify-center mb-0.5 bg-white/5">
                <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/90" />
              </div>
              <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.15em] text-neutral-400 uppercase font-semibold">
                TIME
              </span>
              <span className="font-sans font-bold text-[8.5px] sm:text-[9.5px] md:text-[10px] text-white leading-tight mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                {spot.time}
              </span>
            </div>

            {/* VENUE */}
            <div className="flex flex-col items-center text-center px-0.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/20 flex items-center justify-center mb-0.5 bg-white/5">
                <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/90" />
              </div>
              <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.15em] text-neutral-400 uppercase font-semibold">
                VENUE
              </span>
              <span className="font-sans font-bold text-[8.5px] sm:text-[9.5px] md:text-[10px] text-white leading-tight mt-0.5 truncate max-w-full drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                {spot.location}
              </span>
            </div>
          </div>

          {/* 5. Action Pill Button (Reserve Your Place) */}
          <div className="w-full pt-1 flex justify-center">
            <div className="w-full max-w-[210px] py-1 sm:py-1.5 px-3 rounded-full border border-white/30 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-1.5 group-hover:border-white group-hover:bg-white/15 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.3)] transition-all duration-300">
              <span className="font-mono text-[7.5px] sm:text-[8.5px] md:text-[9px] tracking-[0.2em] uppercase font-bold text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                RESERVE YOUR PLACE
              </span>
              <span className="text-[10px] text-neutral-300 group-hover:translate-x-1 group-hover:text-white transition-transform">
                →
              </span>
            </div>
          </div>
        </div>

        {/* Real Event Frame: Beveled cybernetic titanium frame with precision rivets and corner contours */}
        <img
          src="/real-event.webp"
          alt={spot.title}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_36px_rgba(0,0,0,0.95)] transition-all duration-300
            group-hover:drop-shadow-[0_0_36px_rgba(255,255,255,0.4)] group-hover:scale-[1.02] z-20"
        />
      </div>
    </motion.div>
  );
}

export function ArenaSpatialCards({ isVisible }: ArenaSpatialCardsProps) {
  const [selectedSpot, setSelectedSpot] = useState<ArenaSpot | null>(null);
  const [reservedSlots, setReservedSlots] = useState<Record<string, boolean>>({});

  return (
    <>
      <div
        className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between
          transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* 4 Cards in 1 Row — Scaled and centered with rich event structure */}
        <div className="flex-1 flex flex-col justify-center items-center pb-4 sm:pb-10 pointer-events-auto w-full px-2 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 lg:gap-8 w-full max-w-[96vw] lg:max-w-6xl xl:max-w-7xl justify-items-center">
            {ARENA_SPOTS.map((spot, i) => (
              <EventCard key={spot.id} spot={spot} idx={i} onClick={() => setSelectedSpot(spot)} />
            ))}
          </div>
        </div>
      </div>

      {/* ─── DOSSIER MODAL ─── */}
      <AnimatePresence>
        {selectedSpot && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <div className="absolute inset-0" onClick={() => setSelectedSpot(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[88dvh] overflow-y-auto overscroll-contain rounded-xl border border-white/30
                bg-[#0c0c0e] p-5 sm:p-10 shadow-2xl text-white z-10"
            >
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border
                  border-white/20 bg-white/5 text-neutral-300 hover:text-white hover:border-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-bebas text-sm sm:text-base tracking-wider text-neutral-300 uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedSpot.category} // SECTOR {selectedSpot.slotNumber}</span>
              </div>

              <h2 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                {selectedSpot.title}
              </h2>
              <p className="mt-2 text-base sm:text-lg text-neutral-200 font-chancery italic leading-relaxed">
                "{selectedSpot.tagline}"
              </p>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-geist leading-relaxed">
                {selectedSpot.description}
              </p>

              {/* Event Parameters Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg border border-white/15 bg-white/5 p-4 font-mono text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1"><Calendar className="w-3 h-3" /> DATE</span>
                  <span className="font-bold text-white text-sm">{selectedSpot.date}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> TIME</span>
                  <span className="font-bold text-white text-sm">{selectedSpot.time}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1"><MapPin className="w-3 h-3" /> LOCATION</span>
                  <span className="font-bold text-white text-sm">{selectedSpot.location}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-300" /> PRIZE</span>
                  <span className="font-bold text-amber-300 text-sm">{selectedSpot.prizePool}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] flex items-center gap-1"><Users className="w-3 h-3" /> CAPACITY</span>
                  <span className="font-bold text-white text-sm">{selectedSpot.capacity}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">ELIGIBILITY</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedSpot.eligibility}</span>
                </div>
              </div>

              {/* Operational Rules */}
              <div className="mt-6 space-y-2 font-mono text-xs text-neutral-300">
                <h4 className="tracking-[0.25em] text-white uppercase text-[11px] font-bold">// OPERATIONAL PARAMETERS & RULES</h4>
                <ul className="space-y-1.5 pl-1 text-[11px]">
                  {selectedSpot.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-white font-bold">›</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

                {/* Action Bar */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400">
                    {reservedSlots[selectedSpot.id] ? "STATUS: SEAT SECURED // COMMENDATION ARMED" : "LIMITED SLOTS // STAGE CLEARANCE REQUIRED"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReservedSlots(prev => ({ ...prev, [selectedSpot.id]: true }))}
                    disabled={reservedSlots[selectedSpot.id]}
                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all cursor-pointer active:scale-95 ${
                      reservedSlots[selectedSpot.id]
                        ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-default"
                        : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    }`}
                  >
                    {reservedSlots[selectedSpot.id] ? (
                      <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> SEAT RESERVED</span>
                    ) : (
                      "RESERVE YOUR PLACE"
                    )}
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

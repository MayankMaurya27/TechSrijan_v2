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
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
      onClick={onClick}
      className="relative w-full cursor-pointer group flex items-center justify-center select-none"
    >
      <div className="relative w-full aspect-[1/1.42] max-h-[36vh] sm:max-h-[38vh] md:max-h-[42vh] flex items-center justify-center">
        {/* Outer sculpted Dune frame with dynamic glow on hover */}
        <img
          src="/Event_box.png"
          alt={spot.title}
          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] transition-all duration-300
            group-hover:drop-shadow-[0_0_32px_rgba(255,255,255,0.45)] group-hover:scale-105"
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


        {/* 4 Cards in 1 Row — Increased by 30% in size with rich mock data */}
        <div className="flex-1 flex flex-col justify-center items-center pb-6 sm:pb-10 pointer-events-auto w-full px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-[92vw] lg:max-w-6xl xl:max-w-7xl justify-items-center">
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
              className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/30
                bg-[#0c0c0e] p-6 sm:p-10 shadow-2xl text-white z-10"
            >
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border
                  border-white/20 bg-white/5 text-neutral-300 hover:text-white hover:border-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedSpot.category} // SECTOR {selectedSpot.slotNumber}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                {selectedSpot.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                {selectedSpot.tagline}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
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
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-neutral-400">
                  {reservedSlots[selectedSpot.id] ? "STATUS: SEAT SECURED // COMMENDATION ARMED" : "LIMITED SLOTS // STAGE CLEARANCE REQUIRED"}
                </span>
                <button
                  type="button"
                  onClick={() => setReservedSlots(prev => ({ ...prev, [selectedSpot.id]: true }))}
                  disabled={reservedSlots[selectedSpot.id]}
                  className={`px-6 py-2.5 rounded-full font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all cursor-pointer ${
                    reservedSlots[selectedSpot.id]
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-default"
                      : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95"
                  }`}
                >
                  {reservedSlots[selectedSpot.id] ? (
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> SEAT RESERVED</span>
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

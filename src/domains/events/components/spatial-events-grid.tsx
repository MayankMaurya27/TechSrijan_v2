"use client";

import { useState, useMemo, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Trophy, Users, Clock, MapPin, X, Copy, Check } from "lucide-react";
import { Button } from "@/shared";

export interface EventDossier {
  id: string;
  slug: string;
  coordinate: string;
  title: string;
  category: "CODING" | "ROBOTICS" | "AERO" | "CIRCUITS" | "GAMING" | "MANAGEMENT";
  tagline: string;
  description: string;
  rules: string[];
  rounds: { title: string; desc: string }[];
  coordinators: { name: string; phone: string }[];
  prize: string;
  fee: string;
  minTeam: number;
  maxTeam: number;
  duration: string;
  venue: string;
}

const EVENTS_DATABASE: EventDossier[] = [
  {
    id: "DIR-01",
    slug: "algo-exile",
    coordinate: "SECTOR A-1",
    title: "ALGO EXILE",
    category: "CODING",
    tagline: "COMPETITIVE PROGRAMMING",
    description: "Competitive algorithmic coding challenge. Solve escalating algorithmic dilemmas with strict memory and runtime constraints.",
    rules: [
      "Strict solo participation only. Collaboration results in immediate disqualification.",
      "Supported execution environments: C++, Java, Python 3, Rust.",
      "Automated plagiarism detection active across all submissions.",
      "Three rounds: Preliminary Sprint (1h), Algorithm Optimization (1h), and Advanced Challenge (1h).",
    ],
    rounds: [
      { title: "ROUND 1: PRELIMINARY SPRINT", desc: "5 Rapid algorithmic queries. 60 Minutes." },
      { title: "ROUND 2: ALGORITHM CONSTRAINTS", desc: "Memory-limited dynamic programming. 60 Minutes." },
      { title: "ROUND 3: ADVANCED OPTIMIZATION", desc: "Graph optimization and NP-hard approximations. 60 Minutes." },
    ],
    coordinators: [
      { name: "Devansh Singh", phone: "+91 98765 43210" },
      { name: "Ananya Mishra", phone: "+91 87654 32109" },
    ],
    prize: "₹50,000",
    fee: "₹150",
    minTeam: 1,
    maxTeam: 1,
    duration: "3 HOURS",
    venue: "MPH LAB 01",
  },
  {
    id: "DIR-02",
    slug: "hack-imperium",
    coordinate: "SECTOR B-4",
    title: "HACK IMPERIUM",
    category: "CODING",
    tagline: "36H FLAGSHIP HACKATHON",
    description: "The crown flagship software and hardware sprint. Build disruptive prototypes addressing defense, cybernetics, and distributed autonomous intelligence.",
    rules: [
      "Team format: 2 to 4 participants.",
      "All code must be drafted within the 36-hour operational window.",
      "Pre-built libraries and open-source models permitted; proprietary IP prohibited.",
      "Mandatory git commits every 4 hours for project tracking.",
    ],
    rounds: [
      { title: "PHASE 0: PROBLEM STATEMENT REVEAL", desc: "Problem statements released at 00:00 UTC." },
      { title: "PHASE 1: MID-SPRINT REVIEW", desc: "Architecture checkpoint and mentor evaluation." },
      { title: "PHASE 2: FINAL PITCH", desc: "5-Minute demo to grand jury panel." },
    ],
    coordinators: [
      { name: "Sarthak Agrahari", phone: "+91 99887 76655" },
      { name: "Ritika Verma", phone: "+91 88776 65544" },
    ],
    prize: "₹1,50,000",
    fee: "₹600",
    minTeam: 2,
    maxTeam: 4,
    duration: "36 HOURS",
    venue: "INNOVATION HUB",
  },
  {
    id: "DIR-03",
    slug: "robo-gladiators",
    coordinate: "SECTOR C-2",
    title: "ROBO GLADIATORS",
    category: "ROBOTICS",
    tagline: "COMBAT ROBOTICS TOURNAMENT",
    description: "Mechanized arena combat. Custom 15kg and 30kg remote combat bots clash in a reinforced polycarbonate arena with active hazards.",
    rules: [
      "Bot weight limit: 15kg or 30kg depending on weight-class registration.",
      "Weapons: Pneumatic flippers, spinning drums, blades permitted; untethered projectiles prohibited.",
      "Safety fail-safe radio frequency disconnect mandatory.",
    ],
    rounds: [
      { title: "QUALIFIERS", desc: "Mobility test and armor integrity check." },
      { title: "ELIMINATION HEATS", desc: "3-minute round robin dogfights." },
      { title: "CHAMPIONSHIP ARENA", desc: "Sudden death cage match." },
    ],
    coordinators: [
      { name: "Aman Tripathi", phone: "+91 77665 54433" },
      { name: "Vikram Chauhan", phone: "+91 66554 43322" },
    ],
    prize: "₹80,000",
    fee: "₹800",
    minTeam: 2,
    maxTeam: 5,
    duration: "2 DAYS",
    venue: "OPEN ARENA 03",
  },
  {
    id: "DIR-04",
    slug: "cadence",
    coordinate: "SECTOR D-1",
    title: "CADENCE",
    category: "CIRCUITS",
    tagline: "SILICON VLSI DESIGN",
    description: "Microelectronic layout synthesis and timing closure under non-ideal parasitic conditions.",
    rules: [
      "Solo or duo participants.",
      "Cadence Virtuoso and Verilog simulators provided.",
      "Power consumption and silicon surface area directly factored into scoring.",
    ],
    rounds: [
      { title: "STAGE 1", desc: "Schematic capture and logic simulation." },
      { title: "STAGE 2", desc: "FPGA routing and silicon floor-planning." },
    ],
    coordinators: [{ name: "Pooja Pandey", phone: "+91 99112 23344" }],
    prize: "₹35,000",
    fee: "₹200",
    minTeam: 1,
    maxTeam: 2,
    duration: "4 HOURS",
    venue: "VLSI LAB",
  },
  {
    id: "DIR-05",
    slug: "game-craft",
    coordinate: "SECTOR E-3",
    title: "GAME CRAFT",
    category: "GAMING",
    tagline: "UNREAL SPRINT 48H",
    description: "Design and ship a complete 3D prototype based on the official festival theme.",
    rules: [
      "Engine: Unreal Engine 5 or Unity 6.",
      "Theme asset requirements will be announced at kick-off.",
      "Playable Windows executable required for final submission.",
    ],
    rounds: [
      { title: "GAMEPLAY JAM", desc: "48-Hour continuous asset integration." },
      { title: "JURY PLAYTEST", desc: "Live gameplay critique and physics analysis." },
    ],
    coordinators: [{ name: "Shivam Rai", phone: "+91 88223 34455" }],
    prize: "₹60,000",
    fee: "₹400",
    minTeam: 1,
    maxTeam: 4,
    duration: "48 HOURS",
    venue: "GRAPHICS LAB",
  },
];

const CATEGORIES = ["ALL", "CODING", "ROBOTICS", "CIRCUITS", "GAMING"];

// Precomputed static category index for O(1) instantaneous lookups
const CATEGORY_MAP: Record<string, EventDossier[]> = {
  ALL: EVENTS_DATABASE,
};
for (const ev of EVENTS_DATABASE) {
  if (!CATEGORY_MAP[ev.category]) {
    CATEGORY_MAP[ev.category] = [];
  }
  CATEGORY_MAP[ev.category].push(ev);
}

export function SpatialEventsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeEvent, setActiveEvent] = useState<EventDossier | null>(null);
  const [regMode, setRegMode] = useState<"solo" | "team_create" | "team_join">("solo");
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeEvent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveEvent(null);
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEvent]);

  // O(1) Category lookup without per-render filtering or array allocation
  const filteredEvents = CATEGORY_MAP[selectedCategory] || EVENTS_DATABASE;

  const handleOpenEvent = (ev: EventDossier) => {
    setActiveEvent(ev);
    setRegMode(ev.maxTeam === 1 ? "solo" : "team_create");
    setGeneratedCode("");
    setIsCopied(false);
  };

  const handleCategorySelect = (cat: string) => {
    startTransition(() => {
      setSelectedCategory(cat);
    });
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);
    const code = "TS-" + Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
    setGeneratedCode(code);
    setIsCopied(false);
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(generatedCode)
        .then(() => {
          setIsCopied(true);
          if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
          copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-8 mb-12">
        <span className="font-mono text-xs tracking-widest text-[var(--text-muted)] mr-4">
          CATEGORY FILTER:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`font-mono text-xs tracking-[0.2em] px-4 py-2 rounded transition-all ${
              selectedCategory === cat
                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold shadow-[var(--glow)]"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Events Catalog">
        {filteredEvents.map((ev) => (
          <motion.article
            key={ev.id}
            layoutId={`card-container-${ev.id}`}
            onClick={() => handleOpenEvent(ev)}
            className="mecha-bracket group relative flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)]/90 p-7 cursor-pointer transition-all duration-300 hover:border-[var(--border-accent)] hover:shadow-[var(--glow)] hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-3 mb-4">
                <span>{ev.coordinate}</span>
                <span className="font-bold text-[var(--accent-primary)]">{ev.id}</span>
              </div>

              <span className="font-bebas text-xs sm:text-sm tracking-wider text-[var(--accent-primary)] font-bold uppercase">
                {ev.tagline}
              </span>

              <motion.h3
                layoutId={`title-${ev.id}`}
                className="mt-2 font-montserrat text-xl sm:text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors uppercase"
              >
                {ev.title}
              </motion.h3>

              <p className="mt-3 font-geist text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                {ev.description}
              </p>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-5">
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] mb-6">
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-[var(--accent-primary)]" /> PRIZE
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">{ev.prize}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="h-3 w-3 text-[var(--accent-primary)]" /> FORMAT
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">
                    {ev.maxTeam === 1 ? "SOLO" : `${ev.minTeam}-${ev.maxTeam} P`}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[var(--accent-primary)]" /> TIME
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">{ev.duration}</div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs">
                <span>VIEW DETAILS</span>
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.article>
        ))}
      </section>

      <AnimatePresence>
        {activeEvent && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActiveEvent(null);
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              layoutId={`card-container-${activeEvent.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mecha-bracket relative flex h-[90vh] w-full max-w-4xl flex-col justify-between overflow-hidden border border-[var(--border-accent)] bg-[var(--bg-primary)] p-6 sm:p-10 shadow-2xl cursor-default"
            >
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--geass-crimson)] hover:text-[var(--geass-crimson)] transition-colors z-20"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="overflow-y-auto pr-2 pb-6 space-y-8">
                <div>
                  <div className="flex items-center gap-3 font-bebas text-sm sm:text-base tracking-wider text-[var(--accent-primary)] mb-2 uppercase">
                    <span>{activeEvent.coordinate}</span>
                    <span>•</span>
                    <span>{activeEvent.tagline}</span>
                  </div>
                  <motion.h2
                    layoutId={`title-${activeEvent.id}`}
                    className="font-montserrat text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase"
                  >
                    {activeEvent.title}
                  </motion.h2>
                  <p className="mt-4 font-geist text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                    {activeEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded border border-[var(--border)] bg-[var(--surface)]/70 p-4 font-mono text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">PRIZE POOL</span>
                    <span className="font-bold text-lg text-[var(--accent-primary)]">
                      {activeEvent.prize}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">REGISTRATION FEE</span>
                    <span className="font-bold text-lg text-[var(--text-primary)]">
                      {activeEvent.fee}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">OPERATIONAL DURATION</span>
                    <span className="font-bold text-lg text-[var(--text-primary)]">
                      {activeEvent.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">DESIGNATED VENUE</span>
                    <span className="font-bold text-lg text-[var(--text-primary)]">
                      {activeEvent.venue}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bebas text-sm sm:text-base tracking-wider text-[var(--accent-primary)] uppercase mb-3">
                    RULES & GUIDELINES
                  </h4>
                  <ul className="space-y-2 font-mono text-xs text-[var(--text-secondary)]">
                    {activeEvent.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[var(--accent-primary)] font-bold">›</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bebas text-sm sm:text-base tracking-wider text-[var(--accent-primary)] uppercase mb-3">
                    EVENT STAGES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeEvent.rounds.map((rnd, idx) => (
                      <div
                        key={idx}
                        className="border border-[var(--border)] bg-[var(--surface)] p-3 rounded"
                      >
                        <div className="font-mono text-[10px] font-bold text-[var(--accent-primary)]">
                          {rnd.title}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--text-secondary)] mt-1">
                          {rnd.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-5 mt-4 bg-[var(--bg-primary)]">
                {activeEvent.maxTeam === 1 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="font-mono text-xs text-[var(--text-secondary)]">
                      <span>REGISTRATION FEE: </span>
                      <span className="font-bold text-[var(--accent-primary)]">{activeEvent.fee}</span>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto">
                      CONFIRM REGISTRATION & PAY
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-4 font-mono text-xs">
                      <button
                        onClick={() => setRegMode("team_create")}
                        className={`px-3 py-1.5 rounded transition-colors ${
                          regMode === "team_create"
                            ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold"
                            : "border border-[var(--border)] text-[var(--text-secondary)]"
                        }`}
                      >
                        CREATE TEAM
                      </button>
                      <button
                        onClick={() => setRegMode("team_join")}
                        className={`px-3 py-1.5 rounded transition-colors ${
                          regMode === "team_join"
                            ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold"
                            : "border border-[var(--border)] text-[var(--text-secondary)]"
                        }`}
                      >
                        JOIN EXISTING TEAM
                      </button>
                    </div>

                    {regMode === "team_create" ? (
                      <form onSubmit={handleCreateTeam} className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Enter Team Name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="h-11 flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-4 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                          required
                        />
                        <Button type="submit" size="default">
                          GENERATE TEAM INVITE
                        </Button>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Enter 8-Character Invite Code (e.g. TS-9A7B3X)"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          className="h-11 flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-4 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none uppercase"
                        />
                        <Button size="default">JOIN TEAM</Button>
                      </div>
                    )}

                    {generatedCode && (
                      <div className="mt-3 flex items-center gap-3 rounded border border-[var(--accent-primary)] bg-[var(--surface)] p-3 font-mono text-xs">
                        <span className="text-[var(--text-muted)]">INVITE CODE:</span>
                        <span className="font-bold text-lg text-[var(--accent-primary)] tracking-widest">
                          {generatedCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="ml-auto flex items-center gap-1 text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-400" />
                              <span className="text-green-400 font-bold">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, RotateCcw, LayoutGrid, Orbit, Sparkles, ArrowUp } from "lucide-react";
import type { ClubId } from "./arena-spatial-cards";
import { CLUBS } from "./arena-spatial-cards";
import { EventDetailModal } from "./event-detail-modal";
import { InteractiveDossierParticles } from "./interactive-dossier-particles";

// ─── Data Types ───────────────────────────────────────────────────────────────

export interface DetailedEvent {
  id: string;
  clubId: ClubId;
  clubName: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  prizePool: string;
  teamSize: string;
  venue: string;
  date: string;
  image: string;
  rounds: { title: string; desc: string }[];
  rules: string[];
}

export const ALL_EVENTS: DetailedEvent[] = [
  // ── TSC (TechSrijan Core) ─────────────────────────────────────────────────
  {
    id: "tsc-01",
    clubId: "tsc",
    clubName: "TechSrijan Core",
    name: "VAIL — UNVEIL THE COSPLAY",
    category: "CULTURAL & COSPLAY",
    tagline: "Step into the boots of iconic anime, sci-fi & Dune warriors.",
    description:
      "Vail is TechSrijan's premiere cosplay tournament. Contestants embody legendary fictional warriors, cybernetic sentinels, or Dune Fremen operatives. Judged on costume craftsmanship, stage presence, character fidelity, and thematic performance.",
    prizePool: "₹35,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "Main Amphitheatre",
    date: "Day 2 · 05:00 PM",
    image: "/images/events/tsc-vail.jpg",
    rounds: [
      { title: "ROUND 1: RUNWAY PRESENTATION", desc: "Stage walk & costume craftsmanship inspection." },
      { title: "ROUND 2: CHARACTER ACT", desc: "In-character dialogue or martial choreography (2 mins)." },
      { title: "ROUND 3: JURY SCRUTINY", desc: "Prop verification and audience engagement verdict." },
    ],
    rules: [
      "Costumes must be self-fabricated or substantially customized (min 60% crafted).",
      "No hazardous pyrotechnics or sharpened steel. Synthetic prop replicas only.",
      "Audio tracks must be submitted 24 hours prior to stage call.",
    ],
  },
  {
    id: "tsc-02",
    clubId: "tsc",
    clubName: "TechSrijan Core",
    name: "MR. & MRS. TECHSRIJAN",
    category: "PERSONALITY & REPUTE",
    tagline: "The search for the sharpest minds and most commanding stage presence.",
    description:
      "An intellectual, cultural, and situational charisma contest across four demanding rounds testing wit, crisis management, poise, and impromptu leadership before a packed audience.",
    prizePool: "₹30,000",
    teamSize: "Individual (1)",
    venue: "Golden Jubilee Auditorium",
    date: "Day 3 · 04:30 PM",
    image: "/images/events/tsc-mrandmrs.jpg",
    rounds: [
      { title: "ROUND 1: PERSONA INTRO", desc: "Monologue and high-concept attire showcase." },
      { title: "ROUND 2: CRISIS DILEMMA", desc: "Impromptu crisis simulation in front of the jury." },
      { title: "ROUND 3: RAPID FIRE CROSS", desc: "Unscripted intellectual & situational cross-examination." },
    ],
    rules: [
      "Open to all registered undergraduate and postgraduate delegates.",
      "Formal or high-concept thematic attire mandatory.",
      "Judged on eloquence, logic, humor, and composure under pressure.",
    ],
  },
  {
    id: "tsc-03",
    clubId: "tsc",
    clubName: "TechSrijan Core",
    name: "SCIENCE EXHIBITION",
    category: "INNOVATION & HARDWARE",
    tagline: "Working prototypes shaping the technological horizons of tomorrow.",
    description:
      "Showcase physical models, sustainable energy systems, autonomous automation, and applied physics solutions to industry mentors and esteemed professors.",
    prizePool: "₹40,000",
    teamSize: "2 to 4 Members",
    venue: "Central Seminar Hall Foyer",
    date: "Day 1 · 11:00 AM",
    image: "/images/events/tsc-science.jpg",
    rounds: [
      { title: "STAGE 1: POSTER & ABSTRACT", desc: "Screening of design blueprint and theoretical feasibility." },
      { title: "STAGE 2: WORKING PROTOTYPE DEMO", desc: "Live bench test and stress testing before judges." },
    ],
    rules: [
      "Prototype must be operational or demonstrate physical proof of principle.",
      "Comprehensive schematic documentation must accompany the exhibit.",
      "All commercial sponsorship or patents must be disclosed.",
    ],
  },
  {
    id: "tsc-04",
    clubId: "tsc",
    clubName: "TechSrijan Core",
    name: "INFORMALS [MMMUT GOT LATENT]",
    category: "UNFILTERED TALENT",
    tagline: "Predict your talent score, face the panel, and entertain the crucible.",
    description:
      "A high-stakes satirical talent showdown inspired by the sensational format. Contestants claim an exact score for their performance and must back it up against an unforgiving jury.",
    prizePool: "₹25,000",
    teamSize: "1 to 4 Members",
    venue: "Student Activity Center (SAC)",
    date: "Day 2 · 07:00 PM",
    image: "/images/events/tsc-informals.jpg",
    rounds: [
      { title: "STAGE 1: THE BID", desc: "Declare your predicted score percentage before starting." },
      { title: "STAGE 2: 3-MINUTE ACT", desc: "Music, comedy, magic, or unusual skills before live panel." },
      { title: "STAGE 3: THE VERDICT", desc: "Jury scoring delta calculation & cash prize allocation." },
    ],
    rules: [
      "Any performance medium permitted (music, comedy, mentalism, dance).",
      "Offensive, defamatory, or hazardous acts lead to instant disqualification.",
    ],
  },

  // ── MMMUT RESO ────────────────────────────────────────────────────────────
  {
    id: "reso-01",
    clubId: "mmmut-reso",
    clubName: "MMMUT RESO",
    name: "MANTRASTRA",
    category: "COMPETITIVE PROGRAMMING",
    tagline: "The premier algorithmic crucible testing optimization, logic & speed.",
    description:
      "Mantrastra is MMMUT RESO's flagship programming battle. Designed by ICPC regionalists, it features escalating problem sets from tricky number theory to advanced dynamic programming and segment trees.",
    prizePool: "₹50,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "Computer Center / Online",
    date: "Day 1 · 02:00 PM",
    image: "/images/events/reso-mantrastra.jpg",
    rounds: [
      { title: "ROUND 1: SPEED SPRINT", desc: "6 Algorithmic challenges over 120 minutes." },
      { title: "ROUND 2: DEATHMATCH OPTIMIZATION", desc: "Time-penalty optimization battle for the top 20 coders." },
    ],
    rules: [
      "Supported environments: C++20, Java 17, Python 3.11, Rust.",
      "Plagiarism & external LLM assistance strictly banned via automated similarity check.",
      "Standard ICPC scoring: penalties for incorrect submissions prior to AC.",
    ],
  },

  // ── IEEE-STB ──────────────────────────────────────────────────────────────
  {
    id: "ieee-01",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "ROBOKIRTI",
    category: "TERRAIN ROBOTICS",
    tagline: "Manual and semi-autonomous rovers tackling extreme obstacle hazards.",
    description:
      "Navigate steep ramps, sand dunes, gravel beds, narrow bridges, and water moats with millisecond precision against ticking stadium clocks.",
    prizePool: "₹40,000",
    teamSize: "2 to 4 Members",
    venue: "Main Quadrangle Arena",
    date: "Day 1 · 10:00 AM",
    image: "/images/events/ieee-robokirti.jpg",
    rounds: [
      { title: "ROUND 1: TIME TRIAL", desc: "Solo track run through basic obstacles for seeding." },
      { title: "ROUND 2: GAUNTLET FINALS", desc: "High-difficulty course with moving hazards and penalty pits." },
    ],
    rules: [
      "Bot dimensions must not exceed 30cm x 30cm x 30cm at start gate.",
      "Maximum allowed voltage: 24V DC.",
      "Untethered wireless RF or Bluetooth control mandatory.",
    ],
  },
  {
    id: "ieee-02",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "HYDRORACER",
    category: "AQUATIC RC VEHICLES",
    tagline: "High-speed waterproof vessels dueling in aquatic speed corridors.",
    description:
      "Build high-speed radio-controlled speedboats and maneuver through buoys, chicanes, and crosscurrents in the university aquatic arena.",
    prizePool: "₹30,000",
    teamSize: "2 to 4 Members",
    venue: "University Aquatic Center",
    date: "Day 2 · 11:30 AM",
    image: "/images/events/ieee-hydroracer.jpg",
    rounds: [
      { title: "ROUND 1: BUOY SPRINT", desc: "Timed slalom through 8 nautical gates." },
      { title: "ROUND 2: HEAD-TO-HEAD DUEL", desc: "Two boats simultaneously competing in parallel lanes." },
    ],
    rules: [
      "Pure electric propulsion only. No internal combustion engines.",
      "Vessel electronics must be 100% waterproof sealed.",
    ],
  },
  {
    id: "ieee-03",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "INCOGNITO",
    category: "CYBERSECURITY & CIPHERS",
    tagline: "Crack cryptographic puzzles, hidden steganography & secure networks.",
    description:
      "A brain-twisting security sprint spanning modern cryptography, RSA factorization weaknesses, hash collisions, and hidden steganographic payload discovery.",
    prizePool: "₹35,000",
    teamSize: "1 to 3 Members",
    venue: "ECE Computational Labs",
    date: "Day 1 · 03:00 PM",
    image: "/images/events/ieee-incognito.jpg",
    rounds: [
      { title: "LEVEL 1: CLASSICAL CIPHERS", desc: "Vigenere, substitution, and enigma matrices." },
      { title: "LEVEL 2: BINARY & STEGO", desc: "Audio spectrograms, image LSB injection, network PCAPs." },
    ],
    rules: [
      "Any scripting language (Python, Bash, JS) permitted.",
      "Attacking the judging infrastructure results in immediate disqualification.",
    ],
  },
  {
    id: "ieee-04",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "BRAINS & BRAWN",
    category: "CIRCUITS & PHYSICAL RACE",
    tagline: "Solve hardware enigmas while conquering physical obstacle checkpoints.",
    description:
      "An exhilarating relay where mental dexterity meets adrenaline. One team member solves tricky logic gates while another dashes through campus checkpoints to unlock breadboards.",
    prizePool: "₹25,000",
    teamSize: "Teams of 3",
    venue: "Campus Grounds & Labs",
    date: "Day 2 · 02:00 PM",
    image: "/images/events/ieee-brains-brawn.jpg",
    rounds: [
      { title: "LEG 1: BREADBOARD SPRINT", desc: "Sprint to obtain component packets and debug circuits." },
      { title: "LEG 2: LOGIC LOCKOUT", desc: "Oscilloscope frequency tuning to retrieve coordinate keys." },
    ],
    rules: ["Relay members must tag hand-to-hand at designated exchange zones."],
  },
  {
    id: "ieee-05",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "CODE ZILLA",
    category: "BLIND & RELAY PROGRAMMING",
    tagline: "Relay coding under pressure with monitor blinds and memory tests.",
    description:
      "The ultimate test of muscle memory and clean syntax. Write compiling algorithms with monitors turned off, or tag team partners midway through complex function logic.",
    prizePool: "₹35,000",
    teamSize: "Teams of 2",
    venue: "IT Building Lab 03",
    date: "Day 3 · 10:30 AM",
    image: "/images/events/ieee-codezilla.jpg",
    rounds: [
      { title: "ROUND 1: BLIND CODE", desc: "Write syntactically sound code with blacked-out screens." },
      { title: "ROUND 2: CODE RELAY", desc: "Swap seats every 10 minutes without vocal communication." },
    ],
    rules: ["Compilers evaluate syntax errors with heavy point deductions."],
  },
  {
    id: "ieee-06",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "BRAILLE CODE",
    category: "TACTILE ACCESSIBILITY TECH",
    tagline: "Decode tactile cipher systems without visual telemetry.",
    description:
      "A sensory-deprived engineering challenge where participants interface with custom haptic hardware to decipher binary data streams without a visual monitor.",
    prizePool: "₹20,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "Seminar Hall 2",
    date: "Day 2 · 04:00 PM",
    image: "/images/events/ieee-braillecode.jpg",
    rounds: [
      { title: "STAGE 1: TACTILE DECODING", desc: "Identify pin matrix pulses by touch alone." },
      { title: "STAGE 2: ALGORITHM MAPPING", desc: "Convert decoded signals into execution graphs." },
    ],
    rules: ["Participants wear light-tight blindfolds during decoding phases."],
  },
  {
    id: "ieee-07",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "MIND HUSTLE",
    category: "PRODUCT & VENTURE STRATEGY",
    tagline: "Architect and pitch a tech startup turnaround plan in 90 minutes.",
    description:
      "Teams receive real-world failing tech product case studies and have 90 minutes to redesign unit economics, technology stack, and go-to-market strategy before angel investors.",
    prizePool: "₹25,000",
    teamSize: "2 to 4 Members",
    venue: "MBA Conference Hall",
    date: "Day 3 · 02:00 PM",
    image: "/images/events/ieee-mindhustle.jpg",
    rounds: [
      { title: "ROUND 1: DECK COMPILATION", desc: "90-minute closed room strategy sprint." },
      { title: "ROUND 2: SHARK PITCH", desc: "5-minute pitch + 3-minute aggressive VC grilling." },
    ],
    rules: ["Decks must be original and built within the competition timer."],
  },
  {
    id: "ieee-08",
    clubId: "ieee-stb",
    clubName: "IEEE-STB MMMUT",
    name: "ROBOSOCCER",
    category: "AUTONOMOUS & RC SPORTS",
    tagline: "High-octane robotic football duel on synthetic turf.",
    description:
      "Engineered bots go head-to-head in a miniature soccer pitch. Dribble, strike, defend, and outmaneuver opponent robots with agility and high-torque motors under referee scrutiny.",
    prizePool: "₹30,000",
    teamSize: "2 to 4 Members",
    venue: "Student Activity Center Turf",
    date: "Day 3 · 12:00 PM",
    image: "/images/events/ieee-robosoccer.jpg",
    rounds: [
      { title: "MATCH 1: GROUP STAGE", desc: "Round-robin 5-minute penalty and open-play matches." },
      { title: "MATCH 2: CHAMPIONSHIP KNOCKOUT", desc: "Golden goal sudden death tournament finals." },
    ],
    rules: [
      "Maximum bot dimensions: 30cm x 30cm x 30cm, weight under 5kg.",
      "No magnetic or suction ball holding devices allowed.",
      "Kicking mechanisms must not damage the arena or opponent bots.",
    ],
  },

  // ── Robotics Club ─────────────────────────────────────────────────────────
  {
    id: "rc-01",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "SHERLOCKED",
    category: "TECH CRIME SCENE FORENSICS",
    tagline: "Unravel an interactive campus murder mystery using forensic hardware.",
    description:
      "A high-immersion live detective thriller. Inspect ultraviolet markers, reconstruct corrupt hard-drive sectors, and decode audio wiretaps to unmask the killer.",
    prizePool: "₹30,000",
    teamSize: "2 to 4 Members",
    venue: "Old Admin Block",
    date: "Day 1 · 06:00 PM",
    image: "/images/events/rc-sherlocked.jpg",
    rounds: [
      { title: "PHASE 1: THE CRIME SCENE", desc: "Evidence cataloging and digital forensic acquisition." },
      { title: "PHASE 2: THE INTERROGATION", desc: "Cross-referencing suspect alibis with cell-tower data." },
    ],
    rules: ["No evidence tampering. Discovered artifacts must remain in situ."],
  },
  {
    id: "rc-02",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "LASER STRIKE",
    category: "TACTICAL SENSORS & ARENA",
    tagline: "Laser-guided electronic tagging in a dark smoke-filled combat maze.",
    description:
      "Enter a blackout tactical maze equipped with IR combat phasers and vest-mounted photodiodes. Capture sensor nodes while dodging opposing team fire.",
    prizePool: "₹25,000",
    teamSize: "Squads of 3",
    venue: "Indoor Sports Complex",
    date: "Day 2 · 01:00 PM",
    image: "/images/events/rc-laser-strike.jpg",
    rounds: [
      { title: "MATCH 1: SEEDING SKIRMISH", desc: "Team deathmatch to determine tournament bracket." },
      { title: "MATCH 2: DOMINATION FINALS", desc: "Control three central capture beacons for points." },
    ],
    rules: ["Physical contact between players strictly forbidden."],
  },
  {
    id: "rc-03",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "CTF — CAPTURE THE FLAG",
    category: "OFFENSIVE SECURITY",
    tagline: "Infiltrate vulnerable servers, exploit binary flaws & capture secret flags.",
    description:
      "Jeopardy-style ethical hacking battleground covering web exploits (SQLi, XSS, SSRF), reverse engineering, buffer overflows, and privilege escalation.",
    prizePool: "₹40,000",
    teamSize: "1 to 3 Members",
    venue: "Server Lab 01",
    date: "Day 2 · 10:00 AM",
    image: "/images/events/rc-ctf.jpg",
    rounds: [
      { title: "SPRINT 1: WEB & OSINT", desc: "Initial credential access and web enumeration." },
      { title: "SPRINT 2: PWN & REVERSING", desc: "Binary exploitation, heap sprays, kernel flags." },
    ],
    rules: ["Dynamic scoring: points depreciate as more teams solve each flag."],
  },
  {
    id: "rc-04",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "ROBOWAR",
    category: "HEAVY COMBAT ROBOTICS",
    tagline: "Destruction, sparks, and titanium armor inside the battle cage.",
    description:
      "Custom 15kg & 30kg metal warriors duel in a bulletproof polycarbonate arena with rotating drum spinners, pneumatic flippers, and vertical discs.",
    prizePool: "₹75,000",
    teamSize: "2 to 5 Members",
    venue: "Steel Combat Cage",
    date: "Day 3 · 03:00 PM",
    image: "/images/events/rc-robowar.jpg",
    rounds: [
      { title: "BOUT 1: ELIMINATION DUELS", desc: "3-Minute arena matches scored on aggression & damage." },
      { title: "BOUT 2: THE GRAND CARNAGE", desc: "Unrestricted championship finale." },
    ],
    rules: [
      "Failsafe radio link is strictly inspected during safety checks.",
      "Untethered projectiles, fire, and liquid weapons banned.",
    ],
  },
  {
    id: "rc-05",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "ELECTRO TEKKEN",
    category: "HARDWARE ARCADE MODDING",
    tagline: "Custom hardware controllers vs competitive fighting game tourney.",
    description:
      "Build your own custom ergonomic fightstick or motion-gesture controller, hook it into arcade hardware, and compete in competitive brackets.",
    prizePool: "₹20,000",
    teamSize: "Individual (1v1)",
    venue: "Robotics Club Workshop",
    date: "Day 1 · 04:00 PM",
    image: "/images/events/rc-electro-tekken.jpg",
    rounds: [
      { title: "STAGE 1: HARDWARE SCRUTINY", desc: "Inspection of custom latency & arcade controller design." },
      { title: "STAGE 2: DOUBLE ELIMINATION", desc: "Best-of-5 tournament bracket matches." },
    ],
    rules: ["Macro buttons and turbo toggles prohibited; 1:1 hardware inputs only."],
  },
  {
    id: "rc-06",
    clubId: "robotics",
    clubName: "Robotics Club",
    name: "ELECTRO NFS",
    category: "TELEMETRY RC RACING",
    tagline: "Drive high-speed wireless rovers via telemetry cockpit & FPV goggles.",
    description:
      "Pilot high-speed rovers around an obstacle race circuit using live First-Person View (FPV) video headsets and custom steering wheel telemetry setups.",
    prizePool: "₹25,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "Robotics Arena Track",
    date: "Day 2 · 03:30 PM",
    image: "/images/events/rc-electro-nfs.jpg",
    rounds: [
      { title: "HEAT 1: QUALIFYING LAPS", desc: "Hot lap time trial on clean circuit." },
      { title: "HEAT 2: THE GRAND PRIX", desc: "4-Car simultaneous wheel-to-wheel race." },
    ],
    rules: ["Drivers must sit in cockpit simulator relying strictly on camera feeds."],
  },

  // ── SAE Collegiate Club ───────────────────────────────────────────────────
  {
    id: "sae-01",
    clubId: "sae",
    clubName: "SAE Collegiate Club",
    name: "CAD-A-THON",
    category: "3D MECHANICAL DESIGN",
    tagline: "Rapid 3D modeling and stress simulation on SolidWorks & Fusion 360.",
    description:
      "Competitors receive complex parametric mechanical drawings and must engineer flawless 3D models with FEA stress analysis and generative optimization under strict time bounds.",
    prizePool: "₹35,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "CAD / CAM Center",
    date: "Day 1 · 11:00 AM",
    image: "/images/events/sae-cadathon.jpg",
    rounds: [
      { title: "PART 1: PARAMETRIC PART", desc: "Rapid modeling of complex prismatic & turned geometries." },
      { title: "PART 2: ASSEMBLY & MOTION", desc: "Kinematic joint simulation and Von Mises stress mapping." },
    ],
    rules: [
      "Allowed software: SolidWorks, Autodesk Fusion 360, CATIA V5, Siemens NX.",
      "Strict evaluation on tolerance stack-up and geometric constraints.",
    ],
  },
  {
    id: "sae-02",
    clubId: "sae",
    clubName: "SAE Collegiate Club",
    name: "EL-TIRO",
    category: "BALLISTICS & TREBUCHETS",
    tagline: "Engineer precision catapults and mechanical projectile launch systems.",
    description:
      "Design counterweight or torsion catapults that launch standard projectiles at targets placed at variable target coordinates with pinpoint accuracy.",
    prizePool: "₹25,000",
    teamSize: "2 to 4 Members",
    venue: "Athletics Field",
    date: "Day 2 · 10:00 AM",
    image: "/images/events/sae-eltiro.jpg",
    rounds: [
      { title: "ROUND 1: RANGE ACCURACY", desc: "Hit concentric target bullseyes at 15m and 25m distance." },
      { title: "ROUND 2: LOAD VARIANCE", desc: "Rapid recalibration for variable projectile weights." },
    ],
    rules: [
      "No chemical explosives or pneumatic pressure vessels allowed.",
      "Mechanical counterweights, springs, or elastic tension systems only.",
    ],
  },
  {
    id: "sae-03",
    clubId: "sae",
    clubName: "SAE Collegiate Club",
    name: "DA-VINCI STUDIO",
    category: "AUTOMOTIVE INDUSTRIAL DESIGN",
    tagline: "Aerodynamic styling sketches and clay rendering of futuristic hypercars.",
    description:
      "Envision next-generation zero-emission hypercars. Combine package architecture, aerodynamics, styling aesthetics, and digital sketching to present before automotive designers.",
    prizePool: "₹25,000",
    teamSize: "Solo or Duo (1-2)",
    venue: "Mechanical Drawing Hall",
    date: "Day 2 · 02:30 PM",
    image: "/images/events/sae-davinci.jpg",
    rounds: [
      { title: "STAGE 1: CONCEPT SKETCHES", desc: "Ideation orthographic & 3/4 perspective line sketches." },
      { title: "STAGE 2: AERO PACKAGE PITCH", desc: "Ground-effect airflow justification and styling render." },
    ],
    rules: ["Submissions can be digital (Wacom/iPad) or traditional marker renders."],
  },
  {
    id: "sae-04",
    clubId: "sae",
    clubName: "SAE Collegiate Club",
    name: "BRIDGEKRITI",
    category: "CIVIL & TRUSS ENGINEERING",
    tagline: "Design lightweight popsicle-stick bridges tested to catastrophic destruction load.",
    description:
      "Construct high-efficiency truss bridges with standard materials. Bridges undergo hydraulic load cell testing to determine highest strength-to-weight ratio before catastrophic failure.",
    prizePool: "₹30,000",
    teamSize: "Teams of 3",
    venue: "Civil Structures Lab",
    date: "Day 3 · 11:00 AM",
    image: "/images/events/sae-bridgekriti.jpg",
    rounds: [
      { title: "STAGE 1: DIMENSIONAL AUDIT", desc: "Span, weight, clearance inspection." },
      { title: "STAGE 2: DESTRUCTION CRUSH", desc: "Live hydraulic loading with digital deflection tracking." },
    ],
    rules: [
      "Only approved materials (standard popsicles and PVA adhesive) permitted.",
      "Efficiency ratio = Maximum Load Sustained / Truss Self Weight.",
    ],
  },
];

// ─── Monochrome Streaming Rays ───────────────────────────────────────────────
function StreamingRays() {
  return (
    <div className="s__rays">
      <div className="a-rays">
        <svg
          className="a__scene"
          width="400"
          height="1200"
          viewBox="0 0 400 1200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 0 V1200" stroke="#ffffff" strokeOpacity="0.18" strokeDasharray="8 12" />
          <path d="M110 0 V1200" stroke="#ffffff" strokeOpacity="0.25" strokeDasharray="14 18" />
          <path d="M180 0 V1200" stroke="#ffffff" strokeOpacity="0.3" strokeDasharray="6 14" />
          <path d="M240 0 V1200" stroke="#ffffff" strokeOpacity="0.22" strokeDasharray="20 25" />
          <path d="M310 0 V1200" stroke="#ffffff" strokeOpacity="0.18" strokeDasharray="10 16" />
          <path d="M370 0 V1200" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="12 20" />
        </svg>
      </div>
    </div>
  );
}

// ─── 3D Circular Loop Position Calculator ─────────────────────────────────────
function getCircleCardTransform(
  index: number,
  activeIndex: number,
  total: number,
  isMobile: boolean
) {
  if (total <= 1) {
    return {
      transform: "translate3d(-50%, -50%, 0px) scale(1)",
      zIndex: 50,
      opacity: 1,
      pointerEvents: "auto" as const,
      isFront: true,
      filter: "none",
    };
  }

  // Shortest angular difference in wrapped space [-total/2, total/2]
  let diff = (index - activeIndex) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  // Angular displacement along circular orbit
  const angleStep = (2 * Math.PI) / total;
  const phi = diff * angleStep;

  // Well-calibrated orbit radii so cards never get cut off by screen edges
  const Rx = isMobile ? 120 : 260;
  const Rz = isMobile ? 140 : 220;

  const x = Math.sin(phi) * Rx;
  const z = (Math.cos(phi) - 1) * Rz; // Front card is at Z = 0, side cards recede to Z < 0
  const rotateY = -Math.sin(phi) * 26; // Gentle inward angle
  const cosFactor = Math.cos(phi);
  const scale = 0.78 + 0.22 * ((cosFactor + 1) / 2);

  // ALL cards remain visible in the orbit so no card is cut down
  const opacity = Math.max(0.35, 0.4 + 0.6 * ((cosFactor + 1) / 2));
  const zIndex = Math.round(((cosFactor + 1) / 2) * 50) + 1;
  const isFront = Math.abs(diff) < 0.1;
  const blur = isFront ? 0 : Math.min(2.5, Math.round((1 - cosFactor) * 2));

  return {
    transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(
      1
    )}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
    zIndex,
    opacity,
    pointerEvents: "auto" as const,
    isFront,
    filter: blur > 0 ? `blur(${blur}px)` : "none",
  };
}

// ─── Stack & Circle Loop Card Item Component ──────────────────────────────────
interface StackCardProps {
  event: DetailedEvent;
  index: number;
  total: number;
  isStacked: boolean;
  activeIndex: number;
  isMobile: boolean;
  onClick: () => void;
}

function StackCardItem({
  event,
  index,
  total,
  isStacked,
  activeIndex,
  isMobile,
  onClick,
}: StackCardProps) {
  const counterNumber = String(index + 1).padStart(2, "0");

  if (!isStacked) {
    // ── Grid View Card ────────────────────────────────────────────────────────
    return (
      <div className="grid-card-wrap group" onClick={onClick}>
        {/* Layer 1: .shadow offset layer */}
        <div className="shadow" />

        {/* Layer 2: .inner surface in stark Black & White */}
        <div className="inner">
          {/* Real Extracted Event Photo */}
          <div className="card-image-wrap">
            <img
              src={event.image}
              alt={event.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
              <span className="font-mono text-[9px] uppercase tracking-wider text-white font-medium">
                {event.category}
              </span>
            </div>
          </div>

          {/* Event Content */}
          <div className="px-1 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg tracking-tight uppercase leading-snug line-clamp-2 min-h-[2.75rem]">
                {event.name}
              </h3>
              <p className="mt-1 text-white/70 text-[11px] sm:text-xs line-clamp-3 leading-relaxed font-sans">
                {event.description}
              </p>
            </div>

            {/* Bottom Row - pr-12 ensures counter NEVER overlaps specs */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2 relative pr-12">
              <div className="font-mono text-[10px] text-white/80 flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-bold whitespace-nowrap">🏆 {event.prizePool}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60 whitespace-nowrap">{event.teamSize}</span>
              </div>
              <div className="counter">{counterNumber}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3D Circular Loop Stacked Card ───────────────────────────────────────────
  const circleStyle = getCircleCardTransform(index, activeIndex, total, isMobile);

  return (
    <div
      onClick={onClick}
      className={`stack-cards__item group ${circleStyle.isFront ? "is-front" : ""}`}
      style={{
        transform: circleStyle.transform,
        zIndex: circleStyle.zIndex,
        opacity: circleStyle.opacity,
        pointerEvents: circleStyle.pointerEvents,
        filter: circleStyle.filter,
      }}
    >
      {/* Layer 1: .shadow offset layer */}
      <div className="shadow" />

      {/* Layer 2: .inner surface in stark Black & White */}
      <div className="inner">
        {/* Real Extracted Event Photo */}
        <div className="card-image-wrap">
          <img
            src={event.image}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-white font-semibold">
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] uppercase tracking-wider text-white/70">
              {event.venue}
            </span>
          </div>
        </div>

        {/* Event Content & Lore */}
        <div className="px-1 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg tracking-tight uppercase leading-snug line-clamp-2 min-h-[2.75rem]">
              {event.name}
            </h3>
            <p className="mt-1 text-white/75 text-[11px] sm:text-xs line-clamp-3 leading-relaxed font-sans">
              {event.description}
            </p>
          </div>

          {/* Bottom Row & Counter - pr-12 ensures counter NEVER overlaps specs */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2 relative pr-12">
            <div className="font-mono text-[10px] text-white/80 flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-semibold whitespace-nowrap">🏆 {event.prizePool}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60 whitespace-nowrap">{event.teamSize}</span>
            </div>
            <div className="counter">{counterNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stark Monochrome Club Tab Button ────────────────────────────────────────
function ClubTab({
  club,
  isActive,
  onClick,
}: {
  club: (typeof CLUBS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-3.5 sm:px-4.5 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase transition-all duration-300 border cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-2 ${
        isActive
          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold"
          : "bg-transparent text-neutral-400 border-white/15 hover:border-white/40 hover:text-white"
      }`}
      style={{
        clipPath: isActive
          ? "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
          : undefined,
      }}
    >
      <div
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full p-0.5 flex items-center justify-center border flex-shrink-0 ${
          isActive ? "border-black/30 bg-black/10" : "border-white/20 bg-black/40"
        }`}
      >
        <img
          src={club.logo}
          alt=""
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      <span>{club.shortName}</span>
      <span className={`ml-0.5 font-normal ${isActive ? "text-black/70" : "text-neutral-500"}`}>
        {club.eventCount}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface ClubEventsSectionProps {
  activeClubId?: ClubId | null;
  onReturnToArena?: () => void;
}

export function ClubEventsSection({
  activeClubId: propActiveClubId,
  onReturnToArena,
}: ClubEventsSectionProps) {
  const [activeClubId, setActiveClubId] = useState<ClubId>("tsc");
  const [activeEventModal, setActiveEventModal] = useState<DetailedEvent | null>(null);
  const [viewMode, setViewMode] = useState<"stack" | "grid">("stack");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);

  // Detect mobile screen width for circle radius scaling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync with prop when clicked from arena cards
  useEffect(() => {
    if (propActiveClubId) {
      setActiveClubId(propActiveClubId);
      setActiveIndex(0);
    }
  }, [propActiveClubId]);

  const activeClub = CLUBS.find((c) => c.id === activeClubId) || CLUBS[0];
  const filteredEvents = ALL_EVENTS.filter((e) => e.clubId === activeClubId);

  // Reset circle index when switching clubs
  const handleTabClick = (clubId: ClubId) => {
    setActiveClubId(clubId);
    setActiveIndex(0);
    setTimeout(() => {
      const activeBtn = tabsRef.current?.querySelector(`[data-clubid="${clubId}"]`);
      activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, 50);
  };

  // Next / Prev circular navigation
  const handleNextCard = useCallback(() => {
    if (filteredEvents.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredEvents.length);
  }, [filteredEvents.length]);

  const handlePrevCard = useCallback(() => {
    if (filteredEvents.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  }, [filteredEvents.length]);

  const handleResetLoop = () => {
    setActiveIndex(0);
  };

  // Scroll on cards listener: when user scrolls over the circular stage, smoothly rotate cards
  const handleStageWheel = (e: React.WheelEvent) => {
    if (viewMode !== "stack" || filteredEvents.length <= 1) return;

    const now = Date.now();
    if (now - lastScrollTimeRef.current < 280) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 25) return;

    lastScrollTimeRef.current = now;
    if (delta > 0) {
      handleNextCard();
    } else {
      handlePrevCard();
    }
  };

  // Touch swipe support for smooth mobile circular loop rotation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        handleNextCard();
      } else {
        handlePrevCard();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="our-events-section"
      ref={sectionRef}
      className="relative w-full bg-[#030406] overflow-x-clip text-white min-h-screen"
    >
      {/* ── Interactive Cosmic Particle Field (Micro Stardust, Cyber Sparks, Floating Bokeh Orbs & Shockwaves) ── */}
      <InteractiveDossierParticles activeClubGlow={activeClub.glowColor} />

      {/* Streaming Rays Background SVG (Monochrome) */}
      <StreamingRays />

      {/* Subtle Monochrome Dune Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-8 sm:pt-12 pb-4 sm:pb-6 px-4 sm:px-8 text-center border-b border-white/10">
        {/* Dune ornament */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-white/40" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.4em] text-white/80 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-white inline" />
            TechSrijan XXVII · Dossier
          </span>
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-white/40" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-montserrat font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
        >
          OUR EVENTS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-2 font-sans italic text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed"
        >
          &ldquo;A dynamic lineup of technical, creative, and high-energy competitions designed to challenge, engage, and inspire.&rdquo;
        </motion.p>
      </div>

      {/* ── Club Filter Tabs Bar ────────────────────────────────────────────── */}
      <div className="relative z-10 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto">
          {/* Club Tabs */}
          <div
            ref={tabsRef}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none pb-0.5 flex-1"
          >
            {CLUBS.map((club) => (
              <div key={club.id} data-clubid={club.id}>
                <ClubTab
                  club={club}
                  isActive={activeClubId === club.id}
                  onClick={() => handleTabClick(club.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onReturnToArena && (
              <button
                type="button"
                onClick={onReturnToArena}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border border-white/20 bg-black/60 hover:bg-white hover:text-black text-white/80 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                title="Return to Arena Overview"
              >
                <ArrowUp className="w-3 h-3 text-white" />
                <span className="hidden sm:inline">Back to Arena</span>
                <span className="sm:hidden">Arena</span>
              </button>
            )}

            {/* View Mode Toggle: Orbit Circle vs Grid */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => setViewMode("stack")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "stack"
                    ? "bg-white text-black font-bold border border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Orbit className="w-3 h-3" />
                <span>Circle Loop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-black font-bold border border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>All Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Club Eyebrow & Subtitle ───────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-8 pt-6 sm:pt-8 pb-4 max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          {/* Active Club Seal Crest */}
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full p-1 bg-black/70 border border-white/25 flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            style={{
              boxShadow: `0 0 24px ${activeClub.glowColor || "rgba(255,255,255,0.25)"}`,
            }}
          >
            <img
              src={activeClub.logo}
              alt={activeClub.fullName}
              className="w-full h-full object-contain rounded-full drop-shadow-md"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <div className="w-4 h-[1px] bg-white" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/80 uppercase">
                {activeClub.eventCount} Competitions
              </span>
            </div>
            <h3 className="font-montserrat font-bold text-2xl sm:text-4xl tracking-tight text-white uppercase">
              {activeClub.fullName}
            </h3>
            <p className="mt-1 font-sans text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              {activeClub.tagline}
            </p>
          </div>
        </div>

        {/* Circular loop controls (visible in stack / circle mode) */}
        {viewMode === "stack" && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-white/60 mr-2">
              {activeIndex + 1} / {filteredEvents.length}
            </span>
            <button
              type="button"
              onClick={handlePrevCard}
              disabled={filteredEvents.length <= 1}
              className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Previous Event"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              disabled={filteredEvents.length <= 1}
              className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 border border-white text-black font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Rotate Circle Loop"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetLoop}
              className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Reset Loop"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Cards Presentation Area ─────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center font-mono text-sm text-neutral-600 tracking-widest uppercase">
            // DOSSIER CLASSIFIED
          </div>
        ) : viewMode === "stack" ? (
          /* 3D Circular Loop Interactive Stage with Scroll Wheel / Gesture Support */
          <div
            className="relative py-8 sm:py-12 flex flex-col items-center justify-center"
            onWheel={handleStageWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="stack-cards-stage w-full">
              <div className="stack-cards">
                {filteredEvents.map((ev, i) => (
                  <StackCardItem
                    key={ev.id}
                    event={ev}
                    index={i}
                    total={filteredEvents.length}
                    isStacked={true}
                    activeIndex={activeIndex}
                    isMobile={isMobile}
                    onClick={() => {
                      if (i === activeIndex) {
                        setActiveEventModal(ev);
                      } else {
                        setActiveIndex(i);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Circular Orbit Pagination Dots */}
            {filteredEvents.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {filteredEvents.map((ev, i) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === activeIndex
                        ? "w-7 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : "w-2 h-2 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Jump to ${ev.name}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Responsive Grid View */
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 justify-items-center">
            {filteredEvents.map((ev, i) => (
              <StackCardItem
                key={ev.id}
                event={ev}
                index={i}
                total={filteredEvents.length}
                isStacked={false}
                activeIndex={activeIndex}
                isMobile={isMobile}
                onClick={() => setActiveEventModal(ev)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detailed Event Modal ────────────────────────────────────────────── */}
      <EventDetailModal
        event={activeEventModal}
        onClose={() => setActiveEventModal(null)}
      />
    </section>
  );
}

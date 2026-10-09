export type Department =
  | "ALL"
  | "LEADERSHIP"
  | "ENGINEERING"
  | "DESIGN"
  | "ROBOTICS"
  | "OUTREACH"
  | "LOGISTICS"
  | "FACULTY";

export type HouseAffiliation =
  | "TSC CENTRAL COMMAND"
  | "RESO"
  | "IEEE"
  | "SAE"
  | "ROBOTICS CLUB"
  | "EXECUTIVE COUNCIL"
  | "DIRECTORATE";

export type ClearanceLevel = "LEVEL 5 (SUPREME)" | "LEVEL 4 (STRATEGIC)" | "LEVEL 3 (TACTICAL)" | "LEVEL 2 (FIELD OP)";

export type Operative = {
  id: string;
  name: string;
  role: string;
  category: Department;
  house: HouseAffiliation;
  callsign: string;
  clearance: ClearanceLevel;
  status: "ONLINE" | "ACTIVE" | "DISPATCHED";
  yearOrDesignation: string;
  branch?: string;
  bio: string;
  image?: string;
  keyDirectives: string[];
  weaponsOfChoice: { skill: string; proficiency: number }[];
  contacts: {
    email?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  colorTheme: {
    accent: string;
    glow: string;
    chipBg: string;
    chipBorder: string;
  };
};

/* Curated, sleek color palettes */
export const PALETTES = {
  GOLD: {
    accent: "#D4A843",
    glow: "rgba(212, 168, 67, 0.35)",
    chipBg: "rgba(212, 168, 67, 0.12)",
    chipBorder: "rgba(212, 168, 67, 0.35)",
  },
  CYAN: {
    accent: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.35)",
    chipBg: "rgba(0, 229, 255, 0.12)",
    chipBorder: "rgba(0, 229, 255, 0.35)",
  },
  MAGENTA: {
    accent: "#E100C2",
    glow: "rgba(225, 0, 194, 0.35)",
    chipBg: "rgba(225, 0, 194, 0.12)",
    chipBorder: "rgba(225, 0, 194, 0.35)",
  },
  AMBER: {
    accent: "#FF9800",
    glow: "rgba(255, 152, 0, 0.35)",
    chipBg: "rgba(255, 152, 0, 0.12)",
    chipBorder: "rgba(255, 152, 0, 0.35)",
  },
  EMERALD: {
    accent: "#00E676",
    glow: "rgba(0, 230, 118, 0.35)",
    chipBg: "rgba(0, 230, 118, 0.12)",
    chipBorder: "rgba(0, 230, 118, 0.35)",
  },
  CRIMSON: {
    accent: "#FF3344",
    glow: "rgba(255, 51, 68, 0.35)",
    chipBg: "rgba(255, 51, 68, 0.12)",
    chipBorder: "rgba(255, 51, 68, 0.35)",
  },
};

export const SOCIETY_PILLARS = [
  {
    code: "RESO",
    name: "RESEARCH SOCIETY (RESO)",
    tagline: "The Code, Algorithms & Software Foundry",
    description: "Spearheading competitive programming, modern web systems, machine learning architectures, and high-throughput hackathons.",
    leadCallsign: "CODE SYNAPSE",
    color: PALETTES.CYAN,
    operativesCount: 42,
    flagship: "Turing Code Marathon & Hackathon",
    domains: ["Fullstack Dev", "AI/ML Systems", "Competitive Coding", "Blockchain"],
  },
  {
    code: "IEEE",
    name: "IEEE STUDENT BRANCH MMMUT",
    tagline: "The Circuitry, Embedded & Silicon Guild",
    description: "Pioneering semiconductor research, IoT telemetry grids, hardware interfacing, and national technical symposiums.",
    leadCallsign: "CIRCUIT OVERLORD",
    color: PALETTES.AMBER,
    operativesCount: 38,
    flagship: "Ensilica VLSI & Hardware Expo",
    domains: ["Embedded Systems", "VLSI Design", "IoT Mesh", "Signal Analysis"],
  },
  {
    code: "SAE",
    name: "SAE COLLEGIATE CLUB",
    tagline: "The Automotive & Kinetic Fabrication Guild",
    description: "Architects of mechanical resilience, vehicular dynamics, aerodynamic simulation, and high-octane engineering showcases.",
    leadCallsign: "KINETIC FORGE",
    color: PALETTES.CRIMSON,
    operativesCount: 34,
    flagship: "CAD Masters & Aeromodelling Derby",
    domains: ["Automotive Dynamics", "CAD/SolidWorks", "Aeromodelling", "Mechatronics"],
  },
  {
    code: "ROBOTICS CLUB",
    name: "ROBOTICS CLUB (RC)",
    tagline: "The Autonomous Mechatronics & Combat League",
    description: "Builders of high-torque combat bots, autonomous maze solvers, computer-vision quadcopters, and gladiatorial arena battles.",
    leadCallsign: "MECHA WARLORD",
    color: PALETTES.EMERALD,
    operativesCount: 46,
    flagship: "RoboKriti War Arena & RoboWars",
    domains: ["Combat Robotics", "Autonomous Rovers", "Drone Aviary", "Microcontrollers"],
  },
];

export const OPERATIVES_ROSTER: Operative[] = [
  /* ================= STUDENT COMMAND COUNCIL (LEADERSHIP) ================= */
  {
    id: "TSC-01",
    name: "Aryan Singhania",
    role: "Convener, TechSrijan",
    category: "LEADERSHIP",
    house: "TSC CENTRAL COMMAND",
    callsign: "VANGUARD-01",
    clearance: "LEVEL 5 (SUPREME)",
    status: "ONLINE",
    yearOrDesignation: "Final Year",
    branch: "Computer Science & Engg",
    image: "/images/team/lead-m1.webp",
    bio: "General Secretary and central executive orchestrating TechSrijan'27 across 16 tactical squads, institutional approvals, sponsor commitments, and 35+ national competitions.",
    keyDirectives: [
      "Fest operations command and inter-society delegation",
      "Executive alignment with university administration and sponsors",
      "Floor crisis escalation management across all 3 festival days",
    ],
    weaponsOfChoice: [
      { skill: "Strategic Execution", proficiency: 98 },
      { skill: "Crisis Operations", proficiency: 96 },
      { skill: "Negotiation", proficiency: 92 },
    ],
    contacts: {
      email: "convener@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.GOLD,
  },
  {
    id: "TSC-02",
    name: "Ananya Mishra",
    role: "Co-Convener, TechSrijan",
    category: "LEADERSHIP",
    house: "IEEE",
    callsign: "STRATEGIST-02",
    clearance: "LEVEL 5 (SUPREME)",
    status: "ONLINE",
    yearOrDesignation: "Final Year",
    branch: "Electronics & Comm. Engg",
    image: "/images/team/lead-f1.webp",
    bio: "Overseeing inter-collegiate delegations, university hospitality schedules, jury panels, and technical symposiums for nationwide participants.",
    keyDirectives: [
      "Multi-track schedule synchronization and jury management",
      "National campus delegation accreditation",
      "Operational standards and protocol compliance",
    ],
    weaponsOfChoice: [
      { skill: "Operations Strategy", proficiency: 96 },
      { skill: "Collegiate Relations", proficiency: 94 },
      { skill: "Resource Allocation", proficiency: 91 },
    ],
    contacts: {
      email: "coconvener@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.AMBER,
  },
  {
    id: "TSC-03",
    name: "Mayank Maurya",
    role: "Chief Technology Officer",
    category: "ENGINEERING",
    house: "RESO",
    callsign: "ARCHITECT-PRIME",
    clearance: "LEVEL 5 (SUPREME)",
    status: "ONLINE",
    yearOrDesignation: "Pre-Final Year",
    branch: "Computer Science & Engg",
    image: "/images/team/lead-m2.webp",
    bio: "Architect behind the Imperium: Requiem web portal, 3D WebGL visuals, real-time Razorpay checkout engine, and distributed QR admission systems.",
    keyDirectives: [
      "Lead developer and architect of TechSrijan 2027 digital systems",
      "Interactive 3D Three.js pipelines and shader performance tuning",
      "High-throughput serverless Neon DB and Drizzle ORM workflows",
    ],
    weaponsOfChoice: [
      { skill: "Next.js & TypeScript", proficiency: 99 },
      { skill: "Three.js & WebGL", proficiency: 95 },
      { skill: "Cloud Architecture", proficiency: 92 },
      { skill: "PostgreSQL & Drizzle", proficiency: 90 },
    ],
    contacts: {
      email: "mayank.tech@mmmut.ac.in",
      linkedin: "https://linkedin.com/in/mayankmaurya27",
      github: "https://github.com/MayankMaurya27",
    },
    colorTheme: PALETTES.CYAN,
  },
  {
    id: "TSC-04",
    name: "Tanvi Kapoor",
    role: "Head of Design & Visuals",
    category: "DESIGN",
    house: "TSC CENTRAL COMMAND",
    callsign: "ILLUMINATOR",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ONLINE",
    yearOrDesignation: "Pre-Final Year",
    branch: "Information Technology",
    image: "/images/team/lead-f2.webp",
    bio: "Creator of the visual identity and aesthetic systems for TechSrijan'27. Directing 3D Blender modeling, brand tokens, and UI/UX ergonomics.",
    keyDirectives: [
      "Fest visual design guidelines and dark-mode color harmony",
      "Design systems for event brochures, certificates, and web HUDs",
      "Cinematic motion graphics and visual identity",
    ],
    weaponsOfChoice: [
      { skill: "Figma UI/UX", proficiency: 98 },
      { skill: "Blender 3D Modeling", proficiency: 94 },
      { skill: "Brand Typography", proficiency: 96 },
    ],
    contacts: {
      email: "design@mmmut.ac.in",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    colorTheme: PALETTES.MAGENTA,
  },
  {
    id: "TSC-05",
    name: "Vikramaditya Roy",
    role: "Commander, Robotics Club",
    category: "ROBOTICS",
    house: "ROBOTICS CLUB",
    callsign: "MECHA-WARLORD",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ACTIVE",
    yearOrDesignation: "Final Year",
    branch: "Mechanical Engineering",
    image: "/images/team/lead-m1.webp",
    bio: "Head of RoboKriti. Engineering the national 60kg RoboWars reinforced combat arena, autonomous line trackers, and obstacle navigation races.",
    keyDirectives: [
      "RoboWars bulletproof arena fabrication and safety interlocks",
      "High-torque motor and radio spectrum technical inspections",
      "Flagship mechatronics challenges and live refereeing",
    ],
    weaponsOfChoice: [
      { skill: "Combat Mechatronics", proficiency: 97 },
      { skill: "Power Electronics", proficiency: 93 },
      { skill: "Arena Safety", proficiency: 96 },
    ],
    contacts: {
      email: "robotics@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.EMERALD,
  },
  {
    id: "TSC-06",
    name: "Riddhima Saxena",
    role: "Chief Operating Officer",
    category: "LEADERSHIP",
    house: "TSC CENTRAL COMMAND",
    callsign: "ARENA-DIRECTOR",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ACTIVE",
    yearOrDesignation: "Final Year",
    branch: "Electronics & Comm. Engg",
    image: "/images/team/lead-f1.webp",
    bio: "Directing floor management, auditorium stages, judge coordination, and live event telemetry across 5 parallel campus battlezones.",
    keyDirectives: [
      "Floor directives across Auditorium, MPH, and CS labs",
      "Technical judge briefing and computerized score tabulations",
      "Rapid resolution of stage and scheduling contingencies",
    ],
    weaponsOfChoice: [
      { skill: "Floor Management", proficiency: 96 },
      { skill: "Event Logistics", proficiency: 94 },
      { skill: "Stage Operations", proficiency: 92 },
    ],
    contacts: {
      email: "coo@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.AMBER,
  },
  {
    id: "TSC-07",
    name: "Kushagra Srivastava",
    role: "Lead Systems Engineer",
    category: "ENGINEERING",
    house: "RESO",
    callsign: "BACKEND-CORE",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ONLINE",
    yearOrDesignation: "Pre-Final Year",
    branch: "Computer Science & Engg",
    image: "/images/team/lead-m2.webp",
    bio: "Engineering backend cloud infrastructure, database scaling, cryptographic pass generation, and anti-abuse registration security.",
    keyDirectives: [
      "Razorpay webhook idempotency and payment state reconciliation",
      "NextAuth v5 beta session security & token encryption",
      "Database read-replica optimization during peak traffic surges",
    ],
    weaponsOfChoice: [
      { skill: "Backend Architecture", proficiency: 95 },
      { skill: "Database Optimization", proficiency: 93 },
      { skill: "DevOps & Cloud", proficiency: 91 },
    ],
    contacts: {
      email: "kushagra@mmmut.ac.in",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.CYAN,
  },
  {
    id: "TSC-08",
    name: "Shreyansh Tiwari",
    role: "Head of Campus Ambassador Program",
    category: "OUTREACH",
    house: "TSC CENTRAL COMMAND",
    callsign: "HERALD-SUPREME",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ONLINE",
    yearOrDesignation: "Pre-Final Year",
    branch: "Chemical Engineering",
    image: "/images/team/lead-m1.webp",
    bio: "Directing the nationwide Campus Ambassador Network across 120+ universities with 1,500+ student ambassadors driving awareness and contingents.",
    keyDirectives: [
      "Campus Ambassador gamified leaderboard and milestone incentives",
      "National promotional roadshows and student council outreach",
      "Inter-state group registration discounts and logistics",
    ],
    weaponsOfChoice: [
      { skill: "National Outreach", proficiency: 97 },
      { skill: "Community Growth", proficiency: 95 },
      { skill: "Brand Partnerships", proficiency: 92 },
    ],
    contacts: {
      email: "cap@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.EMERALD,
  },
  {
    id: "TSC-09",
    name: "Isha Srivastava",
    role: "Head of Public Relations & Media",
    category: "OUTREACH",
    house: "TSC CENTRAL COMMAND",
    callsign: "MEDIA-DIRECTOR",
    clearance: "LEVEL 3 (TACTICAL)",
    status: "ONLINE",
    yearOrDesignation: "Pre-Final Year",
    branch: "Information Technology",
    image: "/images/team/lead-f2.webp",
    bio: "Leading official communications, press releases, social media channels, and real-time fest updates to over 50,000 monthly digital impressions.",
    keyDirectives: [
      "Social media narrative on Instagram, LinkedIn, and YouTube",
      "Official press releases and university media relations",
      "Live floor coverage and announcements during fest days",
    ],
    weaponsOfChoice: [
      { skill: "Digital Media", proficiency: 96 },
      { skill: "Public Relations", proficiency: 94 },
      { skill: "Brand Narrative", proficiency: 93 },
    ],
    contacts: {
      email: "media@mmmut.ac.in",
      instagram: "https://instagram.com/techsrijan_mmmut",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.MAGENTA,
  },
  {
    id: "TSC-10",
    name: "Aditya Pratap Singh",
    role: "Lead, SAE Collegiate Club",
    category: "ENGINEERING",
    house: "SAE",
    callsign: "TURBO-FAB",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "ACTIVE",
    yearOrDesignation: "Final Year",
    branch: "Mechanical Engineering",
    image: "/images/team/lead-m2.webp",
    bio: "Head of automotive design competitions, CAD drafting tournaments, and aeromodelling flight derby challenges.",
    keyDirectives: [
      "CAD SolidWorks design sprints and 3D printing inspections",
      "Aeromodelling flight endurance and precision landing challenges",
      "Mechanical prototype safety verification",
    ],
    weaponsOfChoice: [
      { skill: "SolidWorks & CAD", proficiency: 97 },
      { skill: "Automotive Dynamics", proficiency: 92 },
      { skill: "Fabrication", proficiency: 94 },
    ],
    contacts: {
      email: "sae@mmmut.ac.in",
      linkedin: "https://linkedin.com",
    },
    colorTheme: PALETTES.CRIMSON,
  },
  {
    id: "TSC-11",
    name: "Abhinav Patel",
    role: "Head of Arena Logistics & Security",
    category: "LOGISTICS",
    house: "TSC CENTRAL COMMAND",
    callsign: "CITADEL-MARSHAL",
    clearance: "LEVEL 4 (STRATEGIC)",
    status: "DISPATCHED",
    yearOrDesignation: "Final Year",
    branch: "Mechanical Engineering",
    image: "/images/team/lead-m1.webp",
    bio: "Overseeing arena entrance security, gate scan checkpoints, electrical power load distribution, and 24/7 participant safety.",
    keyDirectives: [
      "Multi-gate QR check-in infrastructure and hardware scanners",
      "High-voltage electrical compliance for combat arenas",
      "Emergency protocols and medical contingency lanes",
    ],
    weaponsOfChoice: [
      { skill: "Arena Security", proficiency: 98 },
      { skill: "Power Logistics", proficiency: 94 },
      { skill: "Safety Systems", proficiency: 96 },
    ],
    contacts: {
      email: "logistics@mmmut.ac.in",
    },
    colorTheme: PALETTES.AMBER,
  },
  {
    id: "TSC-12",
    name: "Prof. R.K. Chauhan",
    role: "Chairman, Technical Sub Council",
    category: "FACULTY",
    house: "DIRECTORATE",
    callsign: "CHAIRMAN-TSC",
    clearance: "LEVEL 5 (SUPREME)",
    status: "ONLINE",
    yearOrDesignation: "Professor & Faculty In-Charge",
    image: "/images/team/lead-m2.webp",
    bio: "Guiding the Technical Sub Council (TSC) governance, budget approvals, and executive coordination between student leads and university officers.",
    keyDirectives: [
      "Statutory approvals and council financial authorizations",
      "Inter-departmental liaison and infrastructure allocation",
      "Executive mentorship for student conveners and squad leads",
    ],
    weaponsOfChoice: [
      { skill: "Academic Leadership", proficiency: 98 },
      { skill: "Governance", proficiency: 95 },
    ],
    contacts: {
      email: "tsc@mmmut.ac.in",
    },
    colorTheme: PALETTES.GOLD,
  },
];

export const CATEGORIES_LIST: { id: Department; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "LEADERSHIP", label: "Leadership" },
  { id: "ENGINEERING", label: "Engineering" },
  { id: "DESIGN", label: "Design" },
  { id: "ROBOTICS", label: "Robotics" },
  { id: "OUTREACH", label: "Outreach" },
  { id: "LOGISTICS", label: "Logistics" },
  { id: "FACULTY", label: "Faculty" },
];

export interface StatItem {
  id: string;
  value: string;
  number: number;
  suffix: string;
  label: string;
  subtext: string;
}

export interface PatronItem {
  id: string;
  name: string;
  title: string;
  role: string;
  department: string;
  bio: string;
  badge: string;
  accent: string;
  image: string;
  kicker: string;
  initiatives: string[];
}

export interface HouseItem {
  id: string;
  shortName: string;
  fullName: string;
  designation: string;
  motto: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeBorder: string;
  summary: string;
  responsibilities: string[];
  flagshipEvents: string[];
  established: string;
}

export interface TimelineMilestone {
  year: string;
  era: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
}

export interface FestTenet {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "ELIGIBILITY" | "ACCOMMODATION" | "EVENTS" | "REGISTRATION";
}

/* =====================================================================
   FESTIVAL CORE METRICS (Per Official TechSrijan '27 Brochure)
   ===================================================================== */
export const ABOUT_STATS: StatItem[] = [
  {
    id: "events",
    value: "25+",
    number: 25,
    suffix: "+",
    label: "FLAGSHIP EXPERIENCES",
    subtext: "Robotics, Coding, Gaming & Innovation",
  },
  {
    id: "prize",
    value: "₹2.5L+",
    number: 2.5,
    suffix: "L+",
    label: "PRIZE POOL",
    subtext: "Cash awards, certificates & seed grants",
  },
  {
    id: "footfall",
    value: "25K+",
    number: 25000,
    suffix: "+",
    label: "EXPECTED FOOTFALL",
    subtext: "Engineers, coders & innovators nationwide",
  },
  {
    id: "legacy",
    value: "17+",
    number: 17,
    suffix: "+",
    label: "YEARS OF LEGACY",
    subtext: "Flagship techno-management festival of MMMUT",
  },
];

/* =====================================================================
   PATRONAGE & CITADEL DIRECTORATE (OUR MENTORS)
   ===================================================================== */
export const PATRON_DIRECTORATE: PatronItem[] = [
  {
    id: "patron-1",
    name: "Prof. Anupama Kaushik Sharma",
    title: "Hon'ble Vice Chancellor",
    role: "Hon'ble Vice Chancellor, MMMUT Gorakhpur",
    department: "Madan Mohan Malaviya University of Technology, Gorakhpur",
    bio: "Hon'ble Vice Chancellor of MMMUT. Championing academic rigor, state-of-the-art technical laboratories, and empowering student engineers to establish MMMUT at the vanguard of national innovation, research, and technical excellence.",
    badge: "HON'BLE VICE CHANCELLOR • MMMUT",
    accent: "#D4A843",
    image: "/images/about/patron-anupama.jpg",
    kicker: "CHIEF PATRON • UNIVERSITY CHANCELLERY",
    initiatives: [
      "Institutional patronage and strategic vision for TechSrijan '27",
      "Fostering cross-disciplinary engineering innovation across northern India",
      "Modernizing academic computing, AI infrastructure, and fabrication centers",
      "Inspiring inclusive leadership and student-driven technical autonomy",
    ],
  },
  {
    id: "patron-2",
    name: "Dr. Rajan Mishra",
    title: "Chairman & Vice Chairman",
    role: "Chairman, Council of Student Activities (CSA) & Vice Chairman, Technical and Sports Sub Council",
    department: "Department of Electronics and Communication Engineering, MMMUT",
    bio: "Holding apex leadership as Chairman of the Council of Student Activities (CSA) and Vice Chairman of the Technical and Sports Sub Council. Providing visionary mentorship across all student technical bodies, university delegations, and steering Eastern India's largest technical festival.",
    badge: "CHAIRMAN • CSA & VICE CHAIRMAN • TSC",
    accent: "#79C7E3",
    image: "/images/about/rajan_mishra_tight.png",
    kicker: "APEX MENTOR • CSA & SUB-COUNCILS",
    initiatives: [
      "Apex governance across Council of Student Activities (CSA) and Technical Sub-Council",
      "Administrative sanctions, strategic roadmap, and inter-council synergy",
      "Facilitating hospitality, safety, and infrastructure for 25,000+ national delegates",
      "Mentoring student conveners across IEEE, SAE, Robotics Club, and RESO",
    ],
  },
  {
    id: "patron-3",
    name: "Dr. Pallav Gupta",
    title: "Faculty Advisor",
    role: "Faculty Advisor, Technical Sub Council",
    department: "Technical Sub Council, MMMUT Gorakhpur",
    bio: "Guiding the tactical arena operations and charter mandates of the Technical Sub-Council (TSC). Coordinating IEEE, SAE, Robotics Club, and RESO to stage 25+ cutting-edge robotics combat, coding marathons, gaming arenas, and innovation challenges.",
    badge: "FACULTY ADVISOR • TECHNICAL SUB COUNCIL",
    accent: "#E8D4FF",
    image: "/images/about/pallav_gupta.png",
    kicker: "FACULTY ADVISOR • TECHNICAL SUB COUNCIL",
    initiatives: [
      "Technical rulebook validation and combat arena safety architectures",
      "Coordination across SAE, IEEE, Robotics Club, and RESO flagship arenas",
      "Mentoring central executive student organizing committees and technical conveners",
      "Facilitating national industry sponsorships, workshops, and expert juries",
    ],
  },
];

export interface FacultyInchargeItem {
  id: string;
  name: string;
  role: string;
  designation: string;
  image: string;
}

export const FACULTY_INCHARGES: FacultyInchargeItem[] = [
  {
    id: "ajeet-kumar",
    name: "Dr. Ajeet Kumar",
    role: "Faculty Incharge",
    designation: "Faculty Incharge, TechSrijan",
    image: "/images/about/ajeet_kumar.png",
  },
  {
    id: "anil-pal",
    name: "Dr. Anil Kumar Pal",
    role: "Faculty Incharge",
    designation: "Faculty Incharge, TechSrijan",
    image: "/images/about/anil_pal.png",
  },
  {
    id: "alok-shukla",
    name: "Dr. Alok Kumar Shukla",
    role: "Faculty Incharge",
    designation: "Faculty Incharge, TechSrijan",
    image: "/images/about/alok_shukla.png",
  },
];

/* =====================================================================
   THE 5 PILLAR HOUSES UNDER TECHNICAL SUB-COUNCIL (TSC)
   ===================================================================== */
export const ABOUT_HOUSES: HouseItem[] = [
  {
    id: "tsc",
    shortName: "TSC",
    fullName: "Technical Sub-Council",
    designation: "APEX GOVERNING BODY",
    motto: "In Unitate Robur — Strength in Synchrony",
    accentColor: "#D4A843",
    glowColor: "rgba(212, 168, 67, 0.45)",
    badgeBg: "rgba(212, 168, 67, 0.12)",
    badgeBorder: "rgba(212, 168, 67, 0.35)",
    summary:
      "Operating under the Council of Student Activities (CSA), the Technical Sub-Council is the central governing command of TechSrijan. TSC allocates budgets, oversees corporate alliances, coordinates institute administration, and steers all five technical societies under one unified visionary roadmap.",
    responsibilities: [
      "Master festival planning, scheduling, and protocol management",
      "National university outreach & delegate accreditation",
      "Corporate sponsorships, industrial ties & keynote guest curation",
      "Institute administrative coordination & security operations",
    ],
    flagshipEvents: ["TechSrijan Grand Inaugural", "Keynote Tech-Star Conclave", "Valedictory & Awards Ceremony"],
    established: "Chartered at MMMEC",
  },
  {
    id: "ieee",
    shortName: "IEEE MMMUT",
    fullName: "IEEE Student Branch",
    designation: "COMPUTATION & STANDARDS",
    motto: "Advancing Technology for Humanity",
    accentColor: "#00E5FF",
    glowColor: "rgba(0, 229, 255, 0.45)",
    badgeBg: "rgba(0, 229, 255, 0.12)",
    badgeBorder: "rgba(0, 229, 255, 0.35)",
    summary:
      "Affiliated with IEEE Region 10 and Uttar Pradesh Section, IEEE-SB MMMUT represents the academic and deep-computing frontier. It leads national-level hackathons, AI/ML workshops, research paper presentations, and algorithmic contests governed by IEEE standard judging matrices.",
    responsibilities: [
      "National 24-hour coding marathons & machine intelligence tracks",
      "Peer-reviewed technical research paper symposiums",
      "IEEE international standard judge accreditation",
      "Algorithmic competitive programming arenas",
    ],
    flagshipEvents: ["Codethon Hackathon", "Tech-Invenio Paper Track", "Neural Nexus AI Challenge"],
    established: "IEEE Reg. 10 UP Section",
  },
  {
    id: "sae",
    shortName: "SAE MMMUT",
    fullName: "SAE Collegiate Club",
    designation: "AUTOMOTIVE & MOBILITY",
    motto: "Driven by Passion, Engineered for Speed",
    accentColor: "#FF9800",
    glowColor: "rgba(255, 152, 0, 0.45)",
    badgeBg: "rgba(255, 152, 0, 0.12)",
    badgeBorder: "rgba(255, 152, 0, 0.35)",
    summary:
      "The official collegiate chapter of the Society of Automotive Engineers India at MMMUT. Known for engineering indigenous BAJA all-terrain vehicles, electric karts, and aerodynamic bodies, SAE commands the high-torque, combustion, and mobility engineering arenas of the fest.",
    responsibilities: [
      "Automotive mechanics, CAD design and structural chassis challenges",
      "RC Nitro speed sprints and all-terrain obstacle courses",
      "Vehicle powertrain diagnostics and IC engine teardown workshops",
      "EV conversion showcases and sustainable mobility forums",
    ],
    flagshipEvents: ["Overdrive Nitro RC", "Chassis-Craft CAD Arena", "Gear-Shift Mechanics Relay"],
    established: "SAE India Collegiate",
  },
  {
    id: "rc",
    shortName: "Robotics Club",
    fullName: "Robotics Club MMMUT",
    designation: "CYBERNETICS & BATTLE-ARENAS",
    motto: "Forged in Metal, Programmed to Conquer",
    accentColor: "#E100C2",
    glowColor: "rgba(225, 0, 194, 0.45)",
    badgeBg: "rgba(225, 0, 194, 0.12)",
    badgeBorder: "rgba(225, 0, 194, 0.35)",
    summary:
      "The premier hardware warfare wing of MMMUT. The Robotics Club fabricates steel-caged combat arenas and autonomous obstacle circuits. From spinning blade combat bots to multi-rotor autonomous drones and computer-vision rovers, RC builds the most electric spectator attractions of TechSrijan.",
    responsibilities: [
      "Heavyweight (15kg & 30kg) and lightweight combat arena fabrication",
      "Microcontroller architecture, PID tuning and sensor-fusion challenges",
      "Autonomous aerial drone agility courses and search-and-rescue grids",
      "High-speed line follower and labyrinth micromouse circuits",
    ],
    flagshipEvents: ["RoboWars Combat Arena", "RoboMaze Autonomous Sprint", "SkyVoyager Drone Challenge"],
    established: "MMMUT Robotics Wing",
  },
  {
    id: "reso",
    shortName: "RESO",
    fullName: "Resource & Engineering Society",
    designation: "SYSTEMS & DIGITAL INFRASTRUCTURE",
    motto: "Innovating Resources, Sustaining Engineering",
    accentColor: "#00E676",
    glowColor: "rgba(0, 230, 118, 0.45)",
    badgeBg: "rgba(0, 230, 118, 0.12)",
    badgeBorder: "rgba(0, 230, 118, 0.35)",
    summary:
      "The structural and operational backbone of the fest. RESO architects the live digital portals, real-time leaderboard engines, and embedded electronics hardware labs. In addition, RESO hosts creative civil, environmental, and hands-on fabrication competitions like Bridge-O-Mania.",
    responsibilities: [
      "Fest web infrastructure, real-time scoring telemetry & participant authentication",
      "Hardware prototyping inventory, fabrication labs & electrical backup systems",
      "Civil and structural load-bearing competitions and material optimization",
      "Eco-tech innovation challenges and sustainable engineering projects",
    ],
    flagshipEvents: ["Bridge-O-Mania", "Junkyard Wars", "Hardwired Circuit Sprint"],
    established: "MMMUT Engineering Wing",
  },
];

/* =====================================================================
   THE CHRONICLE: FROM MMMEC 1962 TO IMPERIUM: REQUIEM
   ===================================================================== */
export const ABOUT_TIMELINE: TimelineMilestone[] = [
  {
    year: "1962",
    era: "FOUNDATION",
    title: "Madan Mohan Malaviya Engineering College",
    tagline: "The Cornerstone of Northern Engineering",
    description:
      "Established by the Government of Uttar Pradesh on a sprawling 354-acre campus in Gorakhpur, MMMEC emerged as a flagship technical institution in northern India, nurturing generations of technocrats, researchers, and public infrastructure leaders.",
    highlights: ["354-acre lush green campus", "Pioneered core engineering disciplines in Purvanchal", "Foundation of strong alumni diaspora worldwide"],
  },
  {
    year: "1999",
    era: "INCEPTION",
    title: "Genesis of TechSrijan",
    tagline: "From Local Symposium to Regional Phenomenon",
    description:
      "A cadre of student innovators founded TechSrijan to bridge the chasm between textbook theory and practical industrial builds. Starting as an inter-branch symposium, it quickly captured the imagination of engineering colleges across Uttar Pradesh, Bihar, and Delhi-NCR.",
    highlights: ["First multi-discipline techno-fest in eastern UP", "Inauguration of student-managed battle arenas", "Introduction of autonomous machine competitions"],
  },
  {
    year: "2013",
    era: "TRANSFORMATION",
    title: "Upgradation to Technological University",
    tagline: "Act No. 22 of UP Legislature",
    description:
      "MMMEC was reconstituted as Madan Mohan Malaviya University of Technology (MMMUT), granting autonomous academic and research governance. The Technical Sub-Council (TSC) was formalized as the apex technical body to coordinate IEEE, SAE, Robotics Club, and RESO under a unified charter.",
    highlights: ["State University autonomy and research funding", "Formation of the unified Technical Sub-Council", "Expansion to 25+ inter-collegiate arenas"],
  },
  {
    year: "2026-27",
    era: "THE SUMMIT",
    title: "Imperium: Requiem",
    tagline: "The Zenith of Campus Engineering",
    description:
      "Marking 17+ years of TechSrijan legacy and the historic heritage of MMMUT, TechSrijan '27 emerges as 'Imperium: Requiem'. A 3-day spectacle featuring 25+ experiences across robotics, coding, gaming, and innovation, a ₹2.5L+ prize pool, cutting-edge tech talks, and over 25,000+ expected footfall.",
    highlights: ["₹2.5L+ official prize pool", "25+ flagship experiences, battle cages & EDM Night", "25K+ expected footfall at MMMUT Gorakhpur"],
  },
];

/* =====================================================================
   CORE TENETS OF THE FESTIVAL CREED
   ===================================================================== */
export const ABOUT_TENETS: FestTenet[] = [
  {
    number: "01",
    title: "SOVEREIGNTY OF MERIT",
    subtitle: "Absolute transparency on the judging floor",
    description:
      "Scoring sheets, algorithmic test cases, and combat brackets are published and executed without ambiguity. Every shield and prize at TechSrijan is earned through pure proof of work, rigorous execution, and demonstrable technical competence.",
  },
  {
    number: "02",
    title: "CRUCIBLE OF CODE & HARDWARE",
    subtitle: "Theory ends where the soldering iron begins",
    description:
      "We believe that real engineers are forged when circuits fail, code breaks under load, and teams rebuild at 3 AM in the pits. TechSrijan prioritizes live, working hardware demonstrations over theoretical slide decks.",
  },
  {
    number: "03",
    title: "CITADEL OF COLLABORATION",
    subtitle: "Rivals in the arena, co-founders on the road",
    description:
      "While teams compete fiercely in the arenas, the corridors of MMMUT foster lasting bonds. Over two decades, TechSrijan participants have formed startups, published joint IEEE papers, and built open-source communities.",
  },
  {
    number: "04",
    title: "OPEN GATES FOR NOVICES",
    subtitle: "No barriers between curiosity and the arena",
    description:
      "No student is treated merely as a passive spectator. Along with elite national hackathons, TechSrijan runs introductory hands-on workshops, exhibition walkthroughs, and beginner hardware tracks to mentor the next generation.",
  },
];

/* =====================================================================
   FREQUENTLY ASKED QUESTIONS
   ===================================================================== */
export const ABOUT_FAQS: FaqItem[] = [
  {
    category: "ELIGIBILITY",
    question: "Who is eligible to participate in TechSrijan '27?",
    answer:
      "TechSrijan is open to all bona fide undergraduate and postgraduate students enrolled in recognized universities, engineering institutes, polytechnics, and degree colleges across India. A valid college identification card is mandatory during physical accreditation.",
  },
  {
    category: "REGISTRATION",
    question: "How do I register my team for events?",
    answer:
      "Registration is completed online through the TechSrijan official portal. Team captains can create an account, select events, and register team members. Spot registrations on campus are also available for select exhibitions and open arenas subject to slot availability.",
  },
  {
    category: "ACCOMMODATION",
    question: "Is accommodation provided for outstation participants?",
    answer:
      "Yes. Secure, dedicated hostel accommodation within the MMMUT residential campus is provided for outstation participants upon payment of a nominal hospitality fee. This includes bedding, security, campus Wi-Fi access, and meal options.",
  },
  {
    category: "EVENTS",
    question: "Can members from different colleges form a single team?",
    answer:
      "Cross-college teams are permitted in major multi-disciplinary arenas such as Codethon (Hackathon), RoboWars, and CAD Masters. Please review individual event rulebooks for specific team constraints.",
  },
  {
    category: "EVENTS",
    question: "How and when are the prize awards disbursed?",
    answer:
      "Prize amounts and certificates of excellence are distributed during the Valedictory Ceremony on 27th December 2026. Cash awards are processed directly into the winners' verified bank accounts within 14 working days of fest conclusion.",
  },
];

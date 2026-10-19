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

export interface FacultyInchargeItem {
  id: string;
  name: string;
  role: string;
  designation: string;
  image: string;
}

export interface FacultyMentorInfo {
  name: string;
  role: string;
  designation: string;
  image?: string;
}

export interface ClubItem {
  id: string;
  shortName: string;
  fullName: string;
  tagline?: string;
  department: string;
  faculties: FacultyMentorInfo[];
  accentColor: string;
  glowColor: string;
  logo: string;
}

/* =====================================================================
   FESTIVAL CORE METRICS
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
   PATRONAGE & APEX LEADERSHIP
   ===================================================================== */
export const PATRON_DIRECTORATE: PatronItem[] = [
  {
    id: "patron-1",
    name: "Prof. Anupama Kaushik Sharma",
    title: "Hon'ble Vice Chancellor",
    role: "Hon'ble Vice Chancellor, MMMUT Gorakhpur",
    department: "Madan Mohan Malaviya University of Technology, Gorakhpur",
    bio: "Hon'ble Vice Chancellor of MMMUT. Championing academic rigor, innovation labs, and empowering student engineers to establish MMMUT at the vanguard of national technical excellence.",
    badge: "HON'BLE VICE CHANCELLOR • MMMUT",
    accent: "#D4A843",
    image: "/images/about/patron_anupama_clean.png",
    kicker: "CHIEF PATRON • UNIVERSITY CHANCELLERY",
    initiatives: [
      "Institutional patronage and strategic vision for TechSrijan '27",
      "Fostering cross-disciplinary engineering innovation nationwide",
    ],
  },
  {
    id: "patron-2",
    name: "Dr. Rajan Mishra",
    title: "Chairman CSA",
    role: "Chairman CSA",
    department: "Associate Professor, Department of Electronics & Communication Engineering, MMMUT",
    bio: "Chairman of the Council of Student Activities (CSA). Providing apex leadership and visionary mentorship across all student technical bodies and university delegations.",
    badge: "CHAIRMAN CSA",
    accent: "#FF1E27",
    image: "/images/about/rajan_mishra_tight_clean.png",
    kicker: "CHAIRMAN CSA",
    initiatives: [
      "Apex governance across the Council of Student Activities (CSA)",
      "Guiding student leadership and coordinating festival operations",
    ],
  },
  {
    id: "patron-3",
    name: "Dr. Pallav Gupta",
    title: "Faculty Advisor",
    role: "Faculty Advisor, Technical Sub Council",
    department: "Associate Professor, Department of Mechanical Engineering, MMMUT Gorakhpur",
    bio: "Guiding the operational mandates and safety architectures of the Technical Sub-Council (TSC), mentoring student organizing committees across all technical arenas.",
    badge: "FACULTY ADVISOR • TECHNICAL SUB COUNCIL",
    accent: "#D4A843",
    image: "/images/about/pallav_gupta_clean.png",
    kicker: "FACULTY ADVISOR • TECHNICAL SUB COUNCIL",
    initiatives: [
      "Technical rulebook validation and combat arena safety architectures",
      "Coordination across technical societies and student conveners",
    ],
  },
];

/* =====================================================================
   FACULTY INCHARGES (TECHNICAL SUB-COUNCIL)
   ===================================================================== */
export const FACULTY_INCHARGES: FacultyInchargeItem[] = [
  {
    id: "ajeet-kumar",
    name: "Dr. Ajeet Kumar",
    role: "Faculty Incharge",
    designation: "Assistant Professor, Department of Mechanical Engineering",
    image: "/images/about/ajeet_kumar_clean.png",
  },
  {
    id: "anil-pal",
    name: "Dr. Anil Kumar Pal",
    role: "Faculty Incharge",
    designation: "Assistant Professor, Department of Electrical Engineering",
    image: "/images/about/anil_pal_clean.png",
  },
  {
    id: "alok-shukla",
    name: "Dr. Alok Kumar Shukla",
    role: "Faculty Incharge",
    designation: "Assistant Professor, Department of Electronics & Communication Engineering",
    image: "/images/about/alok_shukla_clean.png",
  },
];

/* =====================================================================
   SPECIALIST CLUBS & FACULTY INCHARGES
   ===================================================================== */
export const ABOUT_CLUBS: ClubItem[] = [
  {
    id: "reso",
    shortName: "MMMUT RESO",
    fullName: "MMMUT RESO",
    tagline: "Playground For Problem Solvers",
    department: "Department of Computer Science & Engineering",
    faculties: [
      {
        name: "Dr. Shailendra Pratap Singh",
        role: "Faculty Incharge",
        designation: "Associate Professor, CSED",
        image: "/Faculty Images/Dr. Shailendra.jpg",
      },
      {
        name: "Dr. Swapnita Srivastava",
        role: "Faculty Incharge",
        designation: "Assistant Professor, CSED",
        image: "/Faculty Images/Dr. Swapnita.jpg",
      },
      {
        name: "Dr. Pawan Kumar Mall",
        role: "Faculty Incharge",
        designation: "Assistant Professor, CSED",
        image: "/Faculty Images/Dr. Pawan.jpg",
      },
    ],
    accentColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.45)",
    logo: "/club-logos/reso-logo.jpg",
  },
  {
    id: "robotics",
    shortName: "Robotics Club",
    fullName: "Robotics Club MMMUT",
    department: "Department of Electronics & Communication Engineering",
    faculties: [
      {
        name: "Dr. Prince Kumar Singh",
        role: "Faculty Incharge",
        designation: "Assistant Professor, ECED",
        image: "/Faculty Images/Dr. Prince.jpg",
      },
      {
        name: "Dr. Vijay Shanker Chaudhary",
        role: "Faculty Incharge",
        designation: "Assistant Professor, ECED",
        image: "/Faculty Images/Dr. Vijay.jpg",
      },
    ],
    accentColor: "#EAB308",
    glowColor: "rgba(234, 179, 8, 0.45)",
    logo: "/club-logos/robotics-logo.png",
  },
  {
    id: "sae",
    shortName: "SAE Collegiate",
    fullName: "SAE Collegiate Club",
    department: "Department of Mechanical Engineering",
    faculties: [
      {
        name: "Dr. Dheerandra Singh",
        role: "Faculty Incharge",
        designation: "Assistant Professor, MED",
        image: "/Faculty Images/Dr. Dheerandra.jpg",
      },
      {
        name: "Dr. Rabesh Kumar Singh",
        role: "Faculty Incharge",
        designation: "Assistant Professor, MED",
        image: "/Faculty Images/Dr. Rabesh.jpeg",
      },
    ],
    accentColor: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.45)",
    logo: "/club-logos/sae-logo.png",
  },
  {
    id: "ieee",
    shortName: "IEEE STB",
    fullName: "IEEE Student Branch MMMUT",
    department: "Department of Electrical Engineering",
    faculties: [
      {
        name: "Prof. Prabhakar Tiwari",
        role: "Faculty Advisor",
        designation: "Head of Department, EED",
        image: "/Faculty Images/Prof. Prabhakar.jpg",
      },
      {
        name: "Dr. Shikha Singh",
        role: "Faculty Counselor",
        designation: "Associate Professor, EED",
        image: "/Faculty Images/Dr. Shikha.jpg",
      },
    ],
    accentColor: "#00E5FF",
    glowColor: "rgba(0, 229, 255, 0.45)",
    logo: "/club-logos/ieee-logo.png",
  },
];

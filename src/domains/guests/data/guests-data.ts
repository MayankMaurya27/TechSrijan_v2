export interface GuestPhoto {
  url: string;
  caption: string;
  label: string;
}

export interface GuestData {
  id: string;
  name: string;
  hindiName?: string;
  edition: string;
  editionBadge: string;
  designation: string;
  honorificTitle: string;
  primaryRole: string;
  secondaryRole: string;
  accolades: string[];
  keynoteTitle: string;
  keynoteSubtitle: string;
  bioParagraphs: string[];
  quote: string;
  quoteContext: string;
  pillars: {
    title: string;
    description: string;
  }[];
  careerMilestones: {
    year: string;
    title: string;
    detail: string;
  }[];
  primaryImage: string;
  primaryImageCaption: string;
  galleryImages: GuestPhoto[];
  backgroundImage: string;
  accentColor: string;
  glowColor: string;
  isCurrentEdition: boolean;
}

export const GUESTS_LIST: GuestData[] = [
  {
    id: "prof-hc-verma",
    name: "Prof. Harish Chandra Verma",
    hindiName: "प्रो. हरीश चंद्र वर्मा",
    edition: "2025 KEYNOTE SPEAKER",
    editionBadge: "2025 KEYNOTE SPEAKER & EXPERT TALK LUMINARY",
    designation: "Padma Shri Awardee (Science & Engineering) · Renowned Experimental Physicist · Author of Concepts of Physics",
    honorificTitle: "LEGACY SCIENTIFIC LUMINARY",
    primaryRole: "Author of the Legendary 'Concepts of Physics' (Vol. 1 & 2)",
    secondaryRole: "Former Professor of Experimental Physics, IIT Kanpur (1994–2017)",
    accolades: [
      "Padma Shri Awardee (2020) conferred by the President of India for Science & Engineering",
      "Author of 'Concepts of Physics' (Vol. 1 & 2) — The definitive textbook for Indian engineering aspirants",
      "Former Professor of Experimental Physics, Department of Physics, IIT Kanpur (1994–2017)",
      "Founder, National Anveshika Network of Experimental Physics (NANI) — 25+ centers nationwide",
      "Founder, Shiksha Sopan — Non-profit rural educational community serving underprivileged children",
      "Author of 'Quantum Physics', 'Classical Mechanics' and 139+ peer-reviewed research papers",
      "Ph.D. in Experimental Nuclear Physics from IIT Kanpur (1980)",
      "M.Sc. in Physics, Science College, Patna University (Gold Medalist)",
    ],
    keynoteTitle: "The Symphony of Fundamental Science: Awakening Curiosity Beyond Blackboards",
    keynoteSubtitle: "Demystifying the Cosmos through Raw Physical Intuition, Grassroots Experimentation and Joyful Discovery",
    bioParagraphs: [
      "A revered living legend whose name is etched into the intellectual DNA of every Indian engineer, Prof. Harish Chandra Verma has transformed how physics is perceived, experienced, and loved across the subcontinent. For over three decades, his seminal two-volume masterpiece, 'Concepts of Physics', has been the undisputed gateway for millions of young minds navigating the rigorous labyrinths of JEE, Olympiads, and scientific research.",
      "Prof. Verma's genius lies in stripping away arcane, frightening mathematical jargon and replacing it with pure, intuitive Wonder. By rooting complex concepts—from rotational dynamics and electromagnetic fields to quantum mechanics—into the relatable mechanics of Indian daily life, bicycles, kites, and river currents, he turned abstract theory into living physical intuition.",
      "A distinguished experimental nuclear physicist at IIT Kanpur, Prof. Verma published over 139 research papers in mossbauer spectroscopy, nanomaterials, and nuclear solid-state physics. Yet his heart remained steadfastly devoted to grassroots pedagogy. He established the National Anveshika Network of Indian Association of Physics Teachers (NANI), founding over 25 Anveshika laboratories across India where students and teachers fabricate low-cost experimental apparatus using everyday household materials.",
      "In 2020, the President of India conferred upon Prof. H. C. Verma the prestigious Padma Shri in recognition of his monumental lifetime contributions to science education and national self-reliance. His landmark keynote address and expert talk at TechSrijan 2025 ignited the packed amphitheater of MMMUT Gorakhpur, remaining one of the most celebrated expert lectures associated with the festival.",
    ],
    quote:
      "Science does not reside inside examination papers or algebraic symbols on a blackboard; science breathes in the flight of a sparrow, the spin of a bicycle wheel, and the relentless spark of a young student who dares to ask 'why' until the universe surrenders its secrets. Build your machines with wonder, not with fear.",
    quoteContext: "Notable 2025 Keynote Citation · TechSrijan Expert Talk",
    pillars: [
      {
        title: "Physics as an Instinct: Wonder over Memorization",
        description:
          "Liberating science education from the suffocating grip of rote problem-solving and rekindling joyful, intuitive observation of physical reality.",
      },
      {
        title: "The Craft of Experimentation: Low-Cost Indigenous Labs",
        description:
          "Empowering grassroots schools across India to build world-class experimental setups using simple materials, mirrors, magnets, and vernier tools.",
      },
      {
        title: "Nurturing Grassroots Indian Innovators",
        description:
          "Democratizing elite scientific pedagogy so that curious minds from remote villages and small towns can compete on the world stage.",
      },
      {
        title: "The Moral Duty of Engineers: Fundamental Science to Society",
        description:
          "Urging engineers to anchor their digital and robotic creations into deep fundamental scientific principles that serve social self-reliance.",
      },
    ],
    careerMilestones: [
      {
        year: "1977",
        title: "Patna University Gold Medalist",
        detail: "Graduated with top honors in M.Sc. Physics from Science College, Patna University.",
      },
      {
        year: "1980",
        title: "Doctorate (Ph.D.) from IIT Kanpur",
        detail: "Completed cutting-edge doctoral research in experimental nuclear physics at IIT Kanpur.",
      },
      {
        year: "1992",
        title: "Publication of 'Concepts of Physics'",
        detail: "Authored the legendary two-volume text that revolutionized physics education across India.",
      },
      {
        year: "1994–17",
        title: "Professor of Physics, IIT Kanpur",
        detail: "Served for 23 years mentoring generations of IITians, supervising doctoral scholars and publishing 139+ papers.",
      },
      {
        year: "2001",
        title: "Founding of Shiksha Sopan",
        detail: "Established a grassroots non-profit upliftment center providing holistic education to underserved village children.",
      },
      {
        year: "2020",
        title: "Conferral of Padma Shri by President of India",
        detail: "Awarded India's fourth-highest civilian award for extraordinary contributions to science and engineering education.",
      },
      {
        year: "2025",
        title: "Notable Keynote Speaker · TechSrijan 2025",
        detail: "Delivered landmark expert lecture and experimental physics demonstrations at MMMUT Gorakhpur as the apex scientific speaker.",
      },
    ],
    primaryImage: "/images/guests/hc-verma-padmashri.webp",
    primaryImageCaption: "Prof. H. C. Verma receiving the Padma Shri from President Ram Nath Kovind for Science & Engineering",
    galleryImages: [
      {
        url: "/images/guests/hc-verma-padmashri.webp",
        caption: "Conferral of Padma Shri by the President of India",
        label: "Padma Shri Ceremony",
      },
      {
        url: "/images/guests/hc-verma-lecture.webp",
        caption: "Prof. H. C. Verma demonstrating physics principles in experimental lecture",
        label: "Experimental Physics Lab",
      },
    ],
    backgroundImage: "/images/guests/guest-bg-hc-verma.webp",
    accentColor: "#79C7E3",
    glowColor: "rgba(121, 199, 227, 0.45)",
    isCurrentEdition: false,
  },
  {
    id: "prof-poonam-tandon",
    name: "Prof. Poonam Tandon",
    hindiName: "प्रो. पूनम टंडन",
    edition: "NOTABLE KEYNOTE DIGNITARY",
    editionBadge: "FORMER VICE-CHANCELLOR · DDU GORAKHPUR UNIVERSITY",
    designation: "Former Vice-Chancellor, DDU Gorakhpur University · Senior Professor of Physics, University of Lucknow · Honorary Colonel Commandant",
    honorificTitle: "DISTINGUISHED ACADEMIC DIGNITARY",
    primaryRole: "Former Vice-Chancellor, Deen Dayal Upadhyaya Gorakhpur University (2023–2026)",
    secondaryRole: "Senior Professor of Physics, Department of Physics, University of Lucknow",
    accolades: [
      "Former Vice-Chancellor, Deen Dayal Upadhyaya Gorakhpur University (2023–2026)",
      "Honorary Rank of Colonel Commandant, conferred by the Ministry of Defence",
      "Senior Professor of Physics, Department of Physics, University of Lucknow",
      "Distinguished Molecular Spectroscopist with 250+ International Research Publications",
      "Former Dean of Students Welfare (DSW) & Director, IQAC, University of Lucknow",
      "Lead Architect of NAAC A++ Institutional Accreditation Frameworks",
      "Ph.D. in Physics from University of Lucknow & Recipient of Major National Research Grants",
      "Champion of Higher Education Modernization, NEP Implementation & Women in STEM",
    ],
    keynoteTitle: "Empowering Future Technocrats: Bridging Fundamental Physics, Research Rigor & Institutional Excellence",
    keynoteSubtitle: "Transforming Higher Technical Education through Interdisciplinary Innovation, Character Building, and Purvanchal's Youth",
    bioParagraphs: [
      "A distinguished academician, eminent physicist, and visionary higher-education administrator, Prof. Poonam Tandon served as the Vice-Chancellor of Deen Dayal Upadhyaya (DDU) Gorakhpur University from 2023 to 2026. A Senior Professor of Physics at the University of Lucknow with over three decades of teaching and research excellence, she is widely revered for transforming university governance, academic standards, and research ecosystems across Uttar Pradesh.",
      "In the realm of physical sciences, Prof. Tandon is an internationally recognized molecular spectroscopist. Her extensive research spanning vibrational spectroscopy, crystal structure prediction, and bioactive pharmaceutical molecules has yielded over 250 peer-reviewed research papers in high-impact international journals and guided dozens of doctoral scholars and research fellows.",
      "During her tenure as Vice-Chancellor of DDU Gorakhpur University, Prof. Tandon championed academic modernization, student-centric digital governance, National Education Policy (NEP) implementation, and holistic research infrastructure. In recognition of her exceptional leadership and contribution to youth development, she was conferred the prestigious honorary rank of Colonel Commandant by the Ministry of Defence.",
      "Having shared a strong academic connection with the Gorakhpur higher education corridor and MMMUT, Prof. Poonam Tandon has been an inspiring presence for thousands of students and researchers, encouraging young engineering minds to cultivate relentless scientific curiosity, interdisciplinary research, and integrity in public service.",
    ],
    quote:
      "Education in science and engineering is incomplete if it merely produces degree holders; its true triumph lies in igniting minds that question fearlessly, innovate ethically, and direct their scientific intellect toward national self-reliance and the upliftment of society.",
    quoteContext: "Distinguished Keynote Address · Academic Leadership Conclave",
    pillars: [
      {
        title: "Interdisciplinary Scientific Research",
        description:
          "Fostering rigorous research culture at the intersection of molecular spectroscopy, material physics, and modern engineering.",
      },
      {
        title: "Institutional Governance & NEP Alignment",
        description:
          "Pioneering student-first digital administration, transparent evaluation, and holistic curriculum modernization.",
      },
      {
        title: "Empowering Women in STEM",
        description:
          "Mentoring and championing the next generation of women researchers, scientists, and technology innovators.",
      },
      {
        title: "Purvanchal Higher Education Renaissance",
        description:
          "Catalyzing regional academic potential to compete with elite national and global scientific institutions.",
      },
    ],
    careerMilestones: [
      {
        year: "1992",
        title: "Doctorate (Ph.D.) in Physics",
        detail: "Completed doctoral research in molecular physics and spectroscopy at University of Lucknow.",
      },
      {
        year: "2006+",
        title: "Senior Professor of Physics",
        detail: "Mentored doctoral researchers and published 250+ papers in top international journals.",
      },
      {
        year: "2021",
        title: "Dean of Students Welfare & IQAC",
        detail: "Spearheaded student welfare initiatives and quality assurance frameworks at Lucknow University.",
      },
      {
        year: "2023",
        title: "Vice-Chancellor, DDU Gorakhpur",
        detail: "Appointed Vice-Chancellor of Deen Dayal Upadhyaya Gorakhpur University by the Governor of UP.",
      },
      {
        year: "2024",
        title: "Colonel Commandant Rank",
        detail: "Conferred the prestigious honorary rank of Colonel Commandant by the Ministry of Defence.",
      },
      {
        year: "2026",
        title: "Keynote Academic Dignitary",
        detail: "Celebrated visionary leader gracing the academic dais in the Gorakhpur higher education corridor.",
      },
    ],
    primaryImage: "/images/guests/poonam-tandon-clean.webp",
    primaryImageCaption: "Prof. Poonam Tandon, Former Vice-Chancellor of DDU Gorakhpur University & Senior Professor of Physics",
    galleryImages: [
      {
        url: "/images/guests/poonam-tandon-clean.webp",
        caption: "Official Portrait of Prof. Poonam Tandon",
        label: "Vice-Chancellor Portrait",
      },
    ],
    backgroundImage: "/images/guests/guests-bg.webp",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.45)",
    isCurrentEdition: false,
  },
];

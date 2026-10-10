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
    id: "dr-kiran-bedi",
    name: "Dr. Kiran Bedi",
    hindiName: "डॉ. किरण बेदी",
    edition: "TECHSRIJAN '27",
    editionBadge: "THIS YEAR'S CHIEF GUEST OF HONOUR",
    designation: "First Woman IPS Officer of India · 24th Lt. Governor of Puducherry · Ramon Magsaysay Laureate",
    honorificTitle: "APEX KEYNOTE DIGNITARY",
    primaryRole: "First Woman Officer in the Indian Police Service (1972)",
    secondaryRole: "24th Lieutenant Governor of Puducherry (2016–2021)",
    accolades: [
      "First Woman Officer in the Indian Police Service (1972)",
      "24th Lieutenant Governor of Puducherry (2016–2021)",
      "Ramon Magsaysay Award Laureate for Government Service (1994)",
      "United Nations Civilian Police Adviser (Department of Peace Operations)",
      "President's Police Medal for Gallantry (1979)",
      "Ph.D. in Social Sciences, Indian Institute of Technology (IIT) Delhi (1993)",
      "Founder, India Vision Foundation & Navjyoti India Foundation",
      "Asian Lawn Tennis Champion (1972) & All India Hardcourt Champion",
      "Author of 'Fearless Governance' & 'I Dare!'",
    ],
    keynoteTitle: "Fearless Governance, Radical Integrity & Engineering the Soul of a Nation",
    keynoteSubtitle: "Bridging Ethical Conviction, Administrative Courage and Cutting-Edge Engineering for Viksit Bharat",
    bioParagraphs: [
      "A monumental titan in the history of Indian public service, Dr. Kiran Bedi etched her name into national history in 1972 by breaking formidable gender barriers to become the first woman officer in the elite Indian Police Service (IPS). Across a stellar career spanning more than three and a half decades, she redefined law enforcement, administrative integrity, and systemic institutional accountability.",
      "Dr. Bedi earned international renown as the Inspector General of Prisons at Tihar Jail, Delhi—one of the largest prison complexes in the world. Confronted by systemic overcrowding and inhumanity, she transformed the penitentiary into an oasis of human rehabilitation through literacy programs, spiritual meditation, vocational industries, and restorative justice. Her radical humanitarian leadership was crowned with Asia's highest honor, the Ramon Magsaysay Award for Government Service in 1994.",
      "As the 24th Lieutenant Governor of Puducherry (2016–2021), Dr. Bedi championed 'Fearless Governance', pioneering direct public open-house hearings, zero-tolerance anti-corruption protocols, transparent financial administration, and water conservation missions. Holding a Ph.D. from IIT Delhi, she embodies the supreme synthesis of academic rigor, fearless ethics, and indefatigable commitment to the welfare of the Indian republic.",
      "At TechSrijan '27, Dr. Kiran Bedi addresses over 25,000+ expected technocrats, roboticists, and software architects gathered at MMMUT Gorakhpur, challenging the nation's youth to engineer systems anchored in moral courage, radical transparency, and purposeful nation-building.",
    ],
    quote:
      "Leadership is neither about the luxury of rank nor the vanity of title; it is the moral courage to take responsibility where others retreat in fear. When India's young engineers unite uncompromising integrity with technological intellect, no fortress of complacency can resist their resolve.",
    quoteContext: "Keynote Address Directive · TechSrijan '27 Inaugural Convocation",
    pillars: [
      {
        title: "Fearless Governance & Radical Accountability",
        description:
          "Dismantling bureaucratic inertia through transparent public audits, real-time civic interfaces, and fearless adherence to the rule of law.",
      },
      {
        title: "The Courage of Conviction in Systemic Reform",
        description:
          "Transforming entrenched, obsolete institutions from within by replacing status-quo fatalism with compassionate and unyielding ethical standards.",
      },
      {
        title: "Engineering for Human Dignity & Social Equity",
        description:
          "Directing state-of-the-art computational and technological architectures to uplift marginalized citizens, prison reformees, and underserved rural populations.",
      },
      {
        title: "The Crucible of Character: Integrity Precedes Code",
        description:
          "Inculcating supreme self-discipline, mental resilience, and lifelong public duty into India's emerging generation of technical leaders.",
      },
    ],
    careerMilestones: [
      {
        year: "1972",
        title: "First Woman in Indian Police Service",
        detail: "Shattered historic gender ceilings by joining the IPS, setting a precedent that inspired millions of Indian women.",
      },
      {
        year: "1979",
        title: "President's Police Medal for Gallantry",
        detail: "Awarded the highest national gallantry honors for extraordinary courage during violent communal riots in Delhi.",
      },
      {
        year: "1993",
        title: "Doctorate (Ph.D.) from IIT Delhi",
        detail: "Completed her doctoral thesis in Social Sciences at IIT Delhi, studying drug abuse and domestic violence trends.",
      },
      {
        year: "1994",
        title: "Ramon Magsaysay Award Laureate",
        detail: "Honored with Asia's Nobel equivalent for revolutionary humanitarian and educational transformation of Tihar Jail.",
      },
      {
        year: "2003",
        title: "United Nations Police Adviser",
        detail: "Appointed Civilian Police Adviser in the UN Department of Peace Operations, directing peacekeeping missions globally.",
      },
      {
        year: "2016–21",
        title: "24th Lt. Governor of Puducherry",
        detail: "Instituted direct open-house grievance redressal, fiscal prudence, and 'Water Rich Puducherry' sustainability drives.",
      },
      {
        year: "2027",
        title: "Chief Guest of Honour · TechSrijan '27",
        detail: "Delivering the Apex Keynote address to 25,000+ expected national student delegates at MMMUT Gorakhpur.",
      },
    ],
    primaryImage: "/images/guests/kiran-bedi-real.jpg",
    primaryImageCaption: "Dr. Kiran Bedi in formal keynote address attire",
    galleryImages: [
      {
        url: "/images/guests/kiran-bedi-real.jpg",
        caption: "Official Portrait of Dr. Kiran Bedi",
        label: "Dignitary Portrait",
      },
    ],
    backgroundImage: "/images/guests/guest-bg-kiran-bedi.jpg",
    accentColor: "#D4A843",
    glowColor: "rgba(212, 168, 67, 0.45)",
    isCurrentEdition: true,
  },
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
    primaryImage: "/images/guests/hc-verma-padmashri.jpg",
    primaryImageCaption: "Prof. H. C. Verma receiving the Padma Shri from President Ram Nath Kovind for Science & Engineering",
    galleryImages: [
      {
        url: "/images/guests/hc-verma-padmashri.jpg",
        caption: "Conferral of Padma Shri by the President of India",
        label: "Padma Shri Ceremony",
      },
      {
        url: "/images/guests/hc-verma-lecture.jpg",
        caption: "Prof. H. C. Verma demonstrating physics principles in experimental lecture",
        label: "Experimental Physics Lab",
      },
    ],
    backgroundImage: "/images/guests/guest-bg-hc-verma.jpg",
    accentColor: "#79C7E3",
    glowColor: "rgba(121, 199, 227, 0.45)",
    isCurrentEdition: false,
  },
];

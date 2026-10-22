export interface GuestPhoto {
  url: string;
  caption: string;
  label: string;
}

export interface GuestData {
  id: string;
  name: string;
  hindiName: string;
  designation: string;
  roleBadge: string;
  bio: string[];
  highlights: {
    title: string;
    description: string;
  }[];
  quote: string;
  quoteContext: string;
  primaryImage: string;
  galleryImages?: GuestPhoto[];
}

export const GUESTS_LIST: GuestData[] = [
  {
    id: "prof-hc-verma",
    name: "Prof. Harish Chandra Verma",
    hindiName: "प्रो. हरीश चंद्र वर्मा",
    roleBadge: "PAST KEYNOTE SPEAKER",
    designation:
      "Past Keynote Speaker · Padma Shri Awardee (2020) · Author of 'Concepts of Physics'",
    bio: [
      "Former Professor of Experimental Physics at IIT Kanpur, Prof. H. C. Verma is celebrated across India for transforming physics education. His seminal two-volume textbook, 'Concepts of Physics', has guided millions of engineering aspirants by grounding abstract principles in everyday observations.",
      "Conferred the Padma Shri in 2020 by the President of India for science and engineering, Prof. Verma founded the National Anveshika Network of Experimental Physics (NANI) and Shiksha Sopan. At a past edition of TechSrijan, his keynote address and experimental demonstrations inspired thousands of students across MMMUT Gorakhpur.",
    ],
    highlights: [
      {
        title: "Padma Shri (2020)",
        description: "Conferred by the President of India for Science & Engineering",
      },
      {
        title: "Concepts of Physics",
        description: "The seminal textbook for Indian engineering and science aspirants",
      },
      {
        title: "IIT Kanpur (1994–2017)",
        description: "23 years of teaching, nuclear solid-state research, and experimental pedagogy",
      },
      {
        title: "NANI & Shiksha Sopan",
        description: "Established 25+ grassroots physics labs and educational outreach initiatives",
      },
    ],
    quote:
      "Science does not reside inside examination papers; it breathes in the flight of a sparrow, the spin of a bicycle wheel, and the relentless spark of a student who dares to ask 'why'.",
    quoteContext: "Prof. H. C. Verma · Past TechSrijan Address",
    primaryImage: "/images/guests/hc-verma-padmashri.webp",
    galleryImages: [
      {
        url: "/images/guests/hc-verma-padmashri.webp",
        label: "Padma Shri Conferral",
        caption: "Conferral of Padma Shri by the President of India (2020)",
      },
      {
        url: "/images/guests/hc-verma-lecture.webp",
        label: "Physics Demonstration",
        caption: "Demonstrating physics principles in an experimental lecture",
      },
    ],
  },
  {
    id: "prof-poonam-tandon",
    name: "Prof. Poonam Tandon",
    hindiName: "प्रो. पूनम टंडन",
    roleBadge: "PAST DIGNITARY",
    designation:
      "Past Keynote Speaker · Former Vice-Chancellor, DDU Gorakhpur University · Senior Professor of Physics",
    bio: [
      "An eminent molecular spectroscopist and higher education leader, Prof. Poonam Tandon served as the Vice-Chancellor of Deen Dayal Upadhyaya Gorakhpur University (2023–2026) and Senior Professor of Physics at the University of Lucknow. Her research spans vibrational spectroscopy, crystal structure prediction, and bioactive materials, resulting in over 250 peer-reviewed international publications.",
      "Conferred the honorary rank of Colonel Commandant by the Ministry of Defence in 2024, Prof. Tandon has been a leading voice for academic excellence in eastern Uttar Pradesh. Addressing a past edition of TechSrijan, she highlighted the importance of research rigor, interdisciplinary innovation, and youth-led technical development.",
    ],
    highlights: [
      {
        title: "Vice-Chancellor (2023–2026)",
        description: "Deen Dayal Upadhyaya Gorakhpur University",
      },
      {
        title: "250+ Research Papers",
        description: "Pioneering contributions to molecular spectroscopy and physical chemistry",
      },
      {
        title: "Colonel Commandant (2024)",
        description: "Honorary rank conferred by the Ministry of Defence",
      },
    ],
    quote:
      "Education in science and engineering is incomplete if it merely produces degree holders; its true triumph lies in igniting minds that question fearlessly and innovate for society.",
    quoteContext: "Prof. Poonam Tandon · Past Conclave Address",
    primaryImage: "/images/guests/poonam-tandon-clean.webp",
  },
];

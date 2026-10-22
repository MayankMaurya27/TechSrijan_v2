export interface Developer {
  name: string;
  role: string;
  initials: string;
  image?: string | null;
  github?: string;
  linkedin?: string;
}

export const DEVELOPERS: Developer[] = [
  {
    name: "Sarthak Agarwal",
    role: "Core Developer",
    initials: "SA",
    image: null,
  },
  {
    name: "Mayank Maurya",
    role: "Lead Architect & Developer",
    initials: "MM",
    image: "/Developers/Mayank.jpg",
  },
];

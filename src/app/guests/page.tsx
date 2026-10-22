import type { Metadata } from "next";
import { GuestsView } from "@/domains/guests";

export const metadata: Metadata = {
  title: "Past Guests of Honour — Prof. H. C. Verma & Prof. Poonam Tandon | TechSrijan'27",
  description:
    "Honouring distinguished past dignitaries of TechSrijan at MMMUT Gorakhpur. Featuring Previous Edition Luminaries Prof. Harish Chandra Verma (Padma Shri Awardee, Author of Concepts of Physics) and Prof. Poonam Tandon (Former Vice-Chancellor, DDU Gorakhpur University).",
  keywords: [
    "TechSrijan Guests",
    "Past Guests TechSrijan",
    "H C Verma TechSrijan",
    "Poonam Tandon TechSrijan",
    "TechSrijan MMMUT Keynotes",
    "Concepts of Physics",
    "Padma Shri HC Verma",
    "DDU Vice Chancellor",
    "Prof Poonam Tandon",
    "MMMUT Gorakhpur Technical Fest",
  ],
  alternates: {
    canonical: "/guests",
  },
  openGraph: {
    title: "Past Guests of Honour — TechSrijan | MMMUT Gorakhpur",
    description:
      "Prof. H. C. Verma (Padma Shri, Concepts of Physics) and Prof. Poonam Tandon (Former Vice-Chancellor, DDU Gorakhpur University) at TechSrijan.",
    images: [
      {
        url: "/images/guests/hc-verma-padmashri.jpg",
        width: 1200,
        height: 630,
        alt: "Prof. H. C. Verma - Past Keynote Dignitary TechSrijan",
      },
    ],
  },
};

export default function GuestsPage() {
  return <GuestsView />;
}

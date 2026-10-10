import type { Metadata } from "next";
import { GuestsView } from "@/domains/guests/components/guests-view";

export const metadata: Metadata = {
  title: "Keynote Guests of Honour — Dr. Kiran Bedi & Prof. H. C. Verma | TechSrijan'27",
  description:
    "Meet the distinguished keynote dignitaries of TechSrijan '27 at MMMUT Gorakhpur. Featuring Chief Guest of Honour Dr. Kiran Bedi (First Woman IPS Officer, former Lt. Governor of Puducherry, Ramon Magsaysay Laureate) and Previous Edition Luminary Prof. Harish Chandra Verma (Padma Shri, Author of Concepts of Physics).",
  keywords: [
    "TechSrijan Guests",
    "Kiran Bedi TechSrijan",
    "H C Verma TechSrijan",
    "TechSrijan MMMUT Keynotes",
    "Concepts of Physics",
    "Padma Shri HC Verma",
    "Dr Kiran Bedi IPS",
    "MMMUT Gorakhpur Technical Fest",
  ],
  openGraph: {
    title: "Keynote Guests of Honour — TechSrijan '27 | MMMUT Gorakhpur",
    description:
      "Dr. Kiran Bedi (Chief Guest of Honour) and Prof. H. C. Verma (Padma Shri, Concepts of Physics) at TechSrijan '27.",
    images: [
      {
        url: "/images/guests/kiran-bedi-real.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Kiran Bedi - Chief Guest of Honour TechSrijan '27",
      },
    ],
  },
};

export default function GuestsPage() {
  return <GuestsView />;
}

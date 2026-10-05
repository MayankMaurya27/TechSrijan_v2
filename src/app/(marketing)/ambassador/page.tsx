import type { Metadata } from "next";
import {
  AmbassadorHero,
  AmbassadorPerks,
  AmbassadorJourney,
  AmbassadorColleges,
  AmbassadorLeaderboard,
  AmbassadorApply,
} from "@/components/ambassador";

export const metadata: Metadata = {
  title: "Campus Ambassador Program | TechSrijan'27 MMMUT Gorakhpur",
  description:
    "Join the Campus Ambassador Program for TechSrijan'27, the flagship technical fest of MMMUT Gorakhpur. Represent your campus, earn exclusive perks, cash rewards, LORs, and lead Eastern UP's biggest tech festival.",
  alternates: {
    canonical: "/ambassador",
  },
  openGraph: {
    title: "Campus Ambassador Program | TechSrijan'27",
    description:
      "Become the official Campus Ambassador of TechSrijan'27 MMMUT Gorakhpur. Win cash prizes, exclusive merchandise, certificates, and free event passes.",
    url: "/ambassador",
    images: [
      {
        url: "/images/redmoon2.png",
        width: 1672,
        height: 941,
        alt: "TechSrijan'27 Campus Ambassador",
      },
    ],
  },
};

export default function AmbassadorPage() {
  return (
    <div className="relative min-h-screen bg-black text-[#f8eed9] overflow-x-hidden -mt-16">
      {/* Cinematic Hero: Red Moon 1 background + Character spawn from below */}
      <AmbassadorHero />

      {/* Perks & Benefits */}
      <div id="perks">
        <AmbassadorPerks />
      </div>

      {/* 4-Step CA Journey Timeline */}
      <AmbassadorJourney />

      {/* Target Engineering Colleges: MMMUT, Gorakhpur, Eastern UP & Beyond */}
      <AmbassadorColleges />

      {/* Live Gamified Leaderboard */}
      <AmbassadorLeaderboard />

      {/* Interactive Application Form */}
      <AmbassadorApply />
    </div>
  );
}

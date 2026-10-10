import type { Metadata } from "next";
import { TeamView } from "@/domains/team";

export const metadata: Metadata = {
  title: "Developers & Operatives Roster | TechSrijan'27",
  description:
    "Meet the students and developers behind TechSrijan'27 — the Technical Sub Council (TSC) command council, squad leads and departments of MMMUT RESO, SAE MMMUT, IEEE MMMUT and RC (Robotics Club) MMMUT.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Developers | TechSrijan'27",
    description:
      "The operatives and developer roster — council, squads and departments powering TechSrijan'27 at MMMUT Gorakhpur.",
    url: "/developers",
  },
};

export default function DevelopersPage() {
  return <TeamView titleWord="Developers" />;
}


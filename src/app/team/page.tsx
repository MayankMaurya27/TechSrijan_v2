import type { Metadata } from "next";
import { TeamView } from "@/domains/team";

export const metadata: Metadata = {
  title: "Team — The Operatives Roster | TechSrijan'27",
  description:
    "Meet the students behind TechSrijan'27 — the Technical Sub Council (TSC) command council, squad leads and departments of MMMUT RESO, SAE MMMUT, IEEE MMMUT and RC (Robotics Club) MMMUT.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Team | TechSrijan'27",
    description:
      "The operatives roster — council, squads and departments powering TechSrijan'27 at MMMUT Gorakhpur.",
    url: "/team",
  },
};

export default function TeamPage() {
  return <TeamView />;
}

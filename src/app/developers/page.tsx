import type { Metadata } from "next";
import { DevelopersView } from "@/domains/developers";

export const metadata: Metadata = {
  title: "Architects & Developers — TechSrijan'27 | MMMUT Gorakhpur",
  description:
    "Meet the system architects and engineers behind TechSrijan'27, the annual technical festival of Madan Mohan Malaviya University of Technology, Gorakhpur.",
  alternates: {
    canonical: "/developers",
  },
};

export default function DevelopersPage() {
  return <DevelopersView />;
}

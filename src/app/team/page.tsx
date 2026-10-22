import type { Metadata } from "next";
import { TeamView } from "@/domains/team";

export const metadata: Metadata = {
  title: "Guild Operatives & Council — TechSrijan'27 | MMMUT Gorakhpur",
  description:
    "Meet the student conveners, society pillar leads, guild operatives, and faculty commanders forging the directives of TechSrijan'27 at MMMUT Gorakhpur.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Guild Operatives & Council | TechSrijan'27",
    description:
      "Meet the student conveners, society pillar leads, guild operatives, and faculty commanders forging the directives of TechSrijan'27 at MMMUT Gorakhpur.",
    url: "/team",
    images: ["/opengraph-image.jpg"],
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guild Operatives & Council | TechSrijan'27",
    description:
      "Meet the student conveners, society pillar leads, guild operatives, and faculty commanders forging the directives of TechSrijan'27 at MMMUT Gorakhpur.",
  },
};

export default function TeamPage() {
  return <TeamView titleWord="Team" />;
}

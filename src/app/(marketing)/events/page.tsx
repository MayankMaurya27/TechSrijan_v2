import type { Metadata } from "next";
import { EventsPageView } from "@/domains/events";

export const metadata: Metadata = {
  title: "Flagship Events & Arena Competitions",
  description: "Browse all competitive arenas, coding challenges, robotics battles, hackathons, and symposiums at TechSrijan'27 MMMUT.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Flagship Events & Arena Competitions | TechSrijan'27",
    description: "Browse all competitive arenas, coding challenges, robotics battles, hackathons, and symposiums at TechSrijan'27 MMMUT.",
    url: "/events",
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flagship Events & Arena Competitions | TechSrijan'27",
    description: "Browse all competitive arenas, coding challenges, robotics battles, hackathons, and symposiums at TechSrijan'27 MMMUT.",
  },
};

export default function EventsPage() {
  return <EventsPageView />;
}

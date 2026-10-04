import type { Metadata } from "next";
import { SpatialEventsGrid } from "@/domains/events";

export const metadata: Metadata = {
  title: "Events & Directives Directory",
  description: "Browse 24+ technical competitions across Coding, Robotics, Aero, Circuits, Gaming, and Management at TechSrijan'27, MMMUT Gorakhpur.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events Directory | TechSrijan'27",
    description: "Browse 24+ technical competitions across Coding, Robotics, Aero, Circuits, and Gaming.",
    url: "/events",
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-20">
      <header className="mx-auto max-w-7xl px-6 pt-12 lg:px-12 text-center md:text-left border-b border-[var(--border)] pb-8">
        <span className="font-mono text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase">
          EVENTS DIRECTORY · TECHNICAL COMPETITIONS
        </span>
        <h1 className="mt-3 font-mono text-4xl sm:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight">
          EVENTS DIRECTORY
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-xs sm:text-sm text-[var(--text-secondary)]">
          SELECT AN EVENT TO VIEW COMPETITION GUIDELINES, TEAM REQUIREMENTS, AND CASH PRIZES.
        </p>
      </header>

      <SpatialEventsGrid />
    </div>
  );
}

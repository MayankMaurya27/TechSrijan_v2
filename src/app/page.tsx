import type { Metadata } from "next";
import Link from "next/link";
import { ScrollJourney } from "@/domains/landing";

// Title/description/OG come from the root layout (they are written for the home page)
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const LINKS = [
  ["/events", "Events & Competitions"],
  ["/ambassador", "Campus Ambassador"],
  ["/accommodation", "Accommodation"],
  ["/guests", "Guests"],
  ["/sponsors", "Sponsors"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

export default function LandingPage() {
  return (
    <>
      {/* Pure Full-Screen Scroll-Driven Cinematic Flight through Imperium Citadel */}
      <ScrollJourney />

      {/* Server-rendered copy + internal links: the scroll journey above is all video/canvas, so this is the
          text search engines index for the home page */}
      <section className="relative z-10 bg-black border-t border-white/10 px-6 pt-16 pb-32 lg:py-20 text-white/70">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-montserrat font-black text-lg sm:text-2xl tracking-[0.18em] uppercase text-white">
            TechSrijan — the Techfest of MMMUT Gorakhpur
          </h2>
          <p className="mt-5 text-sm sm:text-base leading-relaxed">
            TechSrijan is the annual technical festival of Madan Mohan Malaviya University of Technology
            (MMMUT), Gorakhpur. TechSrijan&apos;27 — <em>Imperium: Requiem</em> — runs from 25 to 27 December
            2026 on the MMMUT campus, bringing students from colleges across Uttar Pradesh and India to
            Gorakhpur for three days of competitions, workshops and talks.
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed">
            The fest is organised by the Technical Sub Council (TSC) of MMMUT together with MMMUT RESO, SAE
            MMMUT, IEEE MMMUT and the Robotics Club, with events in robotics, coding, hackathons, design and
            management. Registration, campus accommodation and the Campus Ambassador program are open on
            this site.
          </p>

          <nav aria-label="TechSrijan pages" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm font-mono uppercase tracking-widest">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="text-white/80 hover:text-white underline-offset-4 hover:underline">
                {label}
              </Link>
            ))}
          </nav>

          <p className="mt-10 text-[11px] sm:text-xs text-white/40 leading-relaxed">
            Technical Sub Council (TSC), Madan Mohan Malaviya University of Technology, Deoria Road,
            Gorakhpur, Uttar Pradesh 273010 ·{" "}
            <a href="mailto:techsrijan@mmmut.ac.in" className="hover:text-white/70">techsrijan@mmmut.ac.in</a>
          </p>
        </div>
      </section>
    </>
  );
}

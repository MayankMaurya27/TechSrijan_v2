"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_EVENTS = [
  {
    slug: "algo-exile",
    title: "ALGO EXILE",
    tagline: "COMPETITIVE CODING",
    description: "Algorithmic speed runs in isolated sandboxes with escalating resource constraints.",
    prize: "₹50,000",
    teamSize: "SOLO",
    duration: "3 HOURS",
  },
  {
    slug: "hack-imperium",
    title: "HACK IMPERIUM",
    tagline: "36H FLAGSHIP SPRINT",
    description: "Build cutting-edge full stack, AI, and hardware prototypes under strict time pressure.",
    prize: "₹1,50,000",
    teamSize: "2 - 4 MEMBERS",
    duration: "36 HOURS",
  },
  {
    slug: "robo-gladiators",
    title: "ROBO GLADIATORS",
    tagline: "COMBAT ROBOTICS",
    description: "High-octane mechanized arena warfare. Destroy opponents in direct physical combat.",
    prize: "₹80,000",
    teamSize: "UP TO 5",
    duration: "TOURNAMENT",
  },
];

export function FlagshipHighlights() {
  return (
    <section id="events" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[var(--border)] pb-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase">
            // SECTOR 01
          </span>
          <h2 className="mt-2 font-mono text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            FLAGSHIP DIRECTIVES
          </h2>
        </div>
        <Link href="/events" className="mt-4 md:mt-0 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] tracking-widest flex items-center gap-1">
          VIEW ALL 24+ EVENTS <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED_EVENTS.map((event, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col justify-between rounded border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-[var(--glow)]"
          >
            <div>
              {/* Event Badge */}
              <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[var(--text-muted)] mb-4">
                <span>{event.tagline}</span>
                <span className="text-[var(--accent-primary)] font-bold">0{idx + 1}</span>
              </div>

              {/* Title */}
              <h3 className="font-mono text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {event.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                {event.description}
              </p>
            </div>

            <div className="mt-8">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 mb-6 font-mono text-[10px]">
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-[var(--accent-primary)]" /> PRIZE
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">{event.prize}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="h-3 w-3 text-[var(--accent-primary)]" /> TEAM
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">{event.teamSize}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[var(--accent-primary)]" /> TIME
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mt-1">{event.duration}</div>
                </div>
              </div>

              <Link href={`/events/${event.slug}`}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <span>ENGAGE DIRECTIVE</span>
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { SOCIETY_PILLARS } from "../data/team-roster";
import { Shield, ChevronRight, Users, Sparkles } from "lucide-react";

interface SocietyPillarsProps {
  activeHouse: string | null;
  onSelectHouse: (houseCode: string | null) => void;
}

export function SocietyPillars({ activeHouse, onSelectHouse }: SocietyPillarsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 lg:px-12">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] font-mono text-[var(--text-muted)]">
            <span className="text-[var(--accent-primary)]">[01]</span>
            <span className="uppercase">THE FOUR CORNERSTONE HOUSES</span>
            <span className="h-px w-16 bg-[var(--border)]" />
          </div>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight uppercase text-[var(--text-primary)]">
            The Pillars of TechSrijan
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] font-sans">
            Under the Technical Sub Council (TSC) umbrella, four student societies power the arena directives, hardware battles, coding sprints, and vehicle engineering.
          </p>
        </div>

        {activeHouse && (
          <button
            onClick={() => onSelectHouse(null)}
            type="button"
            className="self-start md:self-auto rounded border border-[var(--border-accent)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] tracking-widest text-[var(--accent-primary)] uppercase transition-all hover:bg-[var(--surface-hover)]"
          >
            RESET PILLAR FILTER
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SOCIETY_PILLARS.map((pillar) => {
          const isSelected = activeHouse === pillar.code;

          return (
            <div
              key={pillar.code}
              onClick={() => onSelectHouse(isSelected ? null : pillar.code)}
              className={`mecha-bracket group relative cursor-pointer overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                isSelected
                  ? "border-[var(--accent-primary)] bg-[#1F150B]/90 shadow-xl"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-hover)] hover:-translate-y-1"
              }`}
              style={{
                boxShadow: isSelected
                  ? `0 0 30px ${pillar.color.glow}, 0 20px 40px -15px rgba(0,0,0,0.8)`
                  : undefined,
              }}
            >
              {/* Top Row: Guild Code & Operatives Counter */}
              <div className="flex items-center justify-between">
                <span
                  className="rounded px-2.5 py-1 font-mono text-[10px] font-black tracking-[0.2em] uppercase"
                  style={{
                    backgroundColor: pillar.color.chipBg,
                    color: pillar.color.accent,
                    borderColor: pillar.color.chipBorder,
                    borderWidth: 1,
                  }}
                >
                  {pillar.code}
                </span>

                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                  <Users className="h-3 w-3" style={{ color: pillar.color.accent }} />
                  {pillar.operativesCount} OPERATIVES
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="mt-5">
                <h3 className="text-base font-black tracking-wide text-[var(--text-primary)] uppercase group-hover:text-white">
                  {pillar.name}
                </h3>
                <div
                  className="mt-1 font-mono text-[10px] tracking-wider uppercase font-semibold"
                  style={{ color: pillar.color.accent }}
                >
                  {pillar.tagline}
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)] font-sans line-clamp-3">
                {pillar.description}
              </p>

              {/* Domain Pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {pillar.domains.slice(0, 3).map((domain) => (
                  <span
                    key={domain}
                    className="rounded bg-[#140E08] px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)] border border-[var(--border)]"
                  >
                    {domain}
                  </span>
                ))}
              </div>

              {/* Footer Flagship callout & Filter cue */}
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-3 text-[10px] font-mono">
                <span className="text-[var(--text-muted)] truncate max-w-[150px]">
                  {pillar.flagship}
                </span>

                <span
                  className="inline-flex items-center gap-1 font-bold tracking-wider uppercase transition-transform group-hover:translate-x-1"
                  style={{ color: pillar.color.accent }}
                >
                  {isSelected ? "FILTERED" : "EXPLORE"}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

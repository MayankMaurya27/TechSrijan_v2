"use client";

import { ImperiumPass3D } from "./imperium-pass-3d";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export function StudentDashboard() {
  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-sans">
      <div className="border-b border-[var(--border)] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase font-semibold">
            STUDENT PORTAL
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            STUDENT DASHBOARD
          </h1>
        </div>
        <div className="mt-4 md:mt-0 text-xs text-[var(--text-muted)] tracking-wider uppercase font-medium">
          ACTIVE SESSION
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="text-xs tracking-widest text-[var(--text-muted)] self-start mb-2 uppercase font-medium">
            OFFICIAL EVENT PASS (INTERACTIVE 3D BADGE)
          </span>
          <ImperiumPass3D />
        </div>

        <div className="lg:col-span-6 space-y-8">
          <section aria-labelledby="registered-events-heading">
            <h2 id="registered-events-heading" className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold mb-4">
              REGISTERED EVENTS
            </h2>

            <div className="space-y-3">
              <article className="mecha-bracket flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    HACK IMPERIUM
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 tracking-wide">
                    TEAM: BLACK KNIGHTS 01 · 36 HOURS
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CONFIRMED</span>
                </div>
              </article>

              <article className="mecha-bracket flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    ALGO EXILE
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 tracking-wide">
                    INDIVIDUAL PARTICIPANT · 3 HOURS
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CONFIRMED</span>
                </div>
              </article>

              <article className="mecha-bracket flex items-center justify-between border border-[var(--geass-crimson)]/50 bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    ROBO GLADIATORS
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 tracking-wide">
                    PAYMENT PENDING RECONCILIATION · TOURNAMENT
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--geass-crimson)] font-bold">
                  <ShieldAlert className="h-4 w-4 animate-pulse" />
                  <span>PENDING REVIEW</span>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="team-rosters-heading">
            <h2 id="team-rosters-heading" className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold mb-4">
              TEAM ROSTERS
            </h2>

            <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <div className="text-sm font-black text-[var(--text-primary)]">
                    TEAM: BLACK KNIGHTS 01
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] tracking-wide">
                    EVENT: HACK IMPERIUM
                  </div>
                </div>
                <div className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--bg-primary)] px-2.5 py-1 rounded border border-[var(--border)]">
                  LEADER
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/40 text-[var(--text-primary)]">
                  <span>Aarav Sharma (You)</span>
                  <span className="text-[10px] text-[var(--accent-primary)]">CAPTAIN</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/40 text-[var(--text-secondary)]">
                  <span>Priya Varma</span>
                  <span className="text-[10px] text-[var(--text-muted)]">MEMBER</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/40 text-[var(--text-secondary)]">
                  <span>Rohan Gupta</span>
                  <span className="text-[10px] text-[var(--text-muted)]">MEMBER</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[var(--text-secondary)]">
                  <span>Ananya Dixit</span>
                  <span className="text-[10px] text-[var(--text-muted)]">MEMBER</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

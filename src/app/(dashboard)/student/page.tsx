"use client";

import { ImperiumPass3D } from "@/components/dashboard/imperium-pass-3d";
import { ShieldAlert, CheckCircle2, Clock, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="font-mono text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase">
            // OPERATIVE CONSOLE // SECTOR 09
          </span>
          <h1 className="mt-2 font-mono text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            STUDENT DASHBOARD
          </h1>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-xs text-[var(--text-muted)]">
          TELEMETRY // ACTIVE SESSION // ZERO COMMAND
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Holographic 3D Pass (5 Columns) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="font-mono text-xs tracking-widest text-[var(--text-muted)] self-start mb-2">
            // OFFICIAL ACCESS BADGE (TILT TO REVEAL FOIL)
          </span>
          <ImperiumPass3D />
        </div>

        {/* Right Column: Mission Ledger & Squads (6 Columns) */}
        <div className="lg:col-span-6 space-y-8">
          {/* Mission Ledger */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-4">
              // REGISTERED MISSION DIRECTIVES
            </h3>

            <div className="space-y-3">
              {/* Event 1: Confirmed */}
              <div className="mecha-bracket flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    HACK IMPERIUM
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5">
                    SQUAD: BLACK_KNIGHTS_01 // 36 HOURS
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent-primary)] font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CONFIRMED</span>
                </div>
              </div>

              {/* Event 2: Confirmed */}
              <div className="mecha-bracket flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    ALGO EXILE
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5">
                    SOLO OPERATIVE // 3 HOURS
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent-primary)] font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CONFIRMED</span>
                </div>
              </div>

              {/* Event 3: Pending Manual Review Alert */}
              <div className="mecha-bracket flex items-center justify-between border border-[var(--geass-crimson)]/50 bg-[var(--surface)] p-4 rounded">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    ROBO GLADIATORS
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5">
                    PAYMENT UNDER RECONCILIATION // TOURNAMENT
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--geass-crimson)] font-bold">
                  <ShieldAlert className="h-4 w-4 animate-pulse" />
                  <span>PENDING REVIEW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Squads Hub */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-4">
              // ACTIVE SQUAD ROSTERS
            </h3>

            <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <div className="font-mono text-sm font-black text-[var(--text-primary)]">
                    SQUAD: BLACK_KNIGHTS_01
                  </div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">
                    EVENT: HACK IMPERIUM
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-[var(--accent-primary)] bg-[var(--bg-primary)] px-2.5 py-1 rounded border border-[var(--border)]">
                  INVITE: TS-8K2F9A
                </div>
              </div>

              <div className="font-mono text-xs text-[var(--text-secondary)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>1. Lelouch vi Britannia (Leader)</span>
                  <span className="text-[var(--accent-primary)]">READY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>2. Kallen Kouzuki</span>
                  <span className="text-[var(--accent-primary)]">READY</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>3. [ Slot Open ]</span>
                  <span>PENDING</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>4. [ Slot Open ]</span>
                  <span>PENDING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

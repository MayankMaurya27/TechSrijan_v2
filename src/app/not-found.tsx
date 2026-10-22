import React from "react";
import Link from "next/link";
import { Compass, Home, Radio, ArrowRight, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* React 19 Native Head Title */}
      <title>404 — Void Sector Unmapped | TechSrijan&apos;27</title>

      {/* Atmospheric Ghost Watermark */}
      <div
        className="pointer-events-none absolute select-none font-bebas text-[8rem] sm:text-[14rem] md:text-[18rem] font-black tracking-widest text-[var(--accent-primary)] opacity-[0.03] leading-none"
        aria-hidden="true"
      >
        404
      </div>

      {/* Main Tactical Citadel Dossier Panel */}
      <div className="mecha-bracket relative z-10 w-full max-w-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
        {/* Top HUD Telemetry Coordinates */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span>SECTOR // UNCHARTED</span>
          </div>
          <span className="text-[var(--accent-primary)] font-semibold">STATUS: VOID</span>
        </div>

        {/* Heraldic Sigil */}
        <div className="my-6 sm:my-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center border border-[var(--accent-primary)]/40 bg-[var(--surface)] shadow-[var(--glow)]">
            <Compass className="h-7 w-7 text-[var(--accent-primary)] animate-[spin_24s_linear_infinite]" />
            <div className="absolute -top-1 -left-1 h-1.5 w-1.5 border-t border-l border-[var(--accent-primary)]" />
            <div className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border-b border-r border-[var(--accent-primary)]" />
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-2">
            // ERROR 404 — NULL TRANSMISSION
          </span>

          <h1 className="font-bebas text-4xl sm:text-6xl uppercase tracking-wider text-[var(--text-primary)] leading-tight mb-3">
            LOST IN THE VOID
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
            The spatial coordinates you requested do not correlate with any registered Imperial
            frequency or active festival protocol. The citadel scanners detect only cosmic static.
          </p>
        </div>

        {/* Telemetry Stamp */}
        <div className="mb-8 border-y border-[var(--border)]/60 py-2.5 font-mono text-[10px] sm:text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
          RADAR ANCHOR // 26.7465° N, 83.4446° E · TS27_SECTOR_NULL
        </div>

        {/* Recovery Action Matrix */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/"
            className="mecha-bracket group relative inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 border border-[var(--accent-primary)] bg-[var(--surface)] px-6 py-2.5 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] transition-all duration-200 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] shadow-[var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            <span>RETURN TO CITADEL</span>
          </Link>

          <Link
            href="/events"
            className="mecha-bracket group relative inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 border border-[var(--border)] bg-transparent px-5 py-2.5 font-mono text-xs font-bold tracking-[0.18em] uppercase text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] active:scale-[0.98]"
          >
            <span>ACTIVE PROTOCOLS</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-primary)] transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-1.5 px-3 py-2 font-mono text-xs tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>RELAY HELP</span>
          </Link>
        </div>

        {/* Footer Lore Line */}
        <div className="mt-8 text-center font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase">
          TECHSRIJAN 2027 · IMPERIUM: REQUIEM ARCHIVES
        </div>
      </div>
    </main>
  );
}

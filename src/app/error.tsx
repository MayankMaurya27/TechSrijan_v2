"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Radio, Terminal } from "lucide-react";

export default function RootError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Log exception to client console with telemetry prefix
    console.error("[Citadel Telemetry] Route Exception Captured:", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24"
    >
      {/* Background Ambience Scrim */}
      <div
        className="pointer-events-none absolute inset-0 bg-radial-gradient from-[var(--geass-crimson,#e61924)]/5 via-transparent to-transparent opacity-50"
        aria-hidden="true"
      />

      {/* Main Tactical Error Panel */}
      <div className="mecha-bracket relative z-10 w-full max-w-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Top HUD Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--geass-crimson,#e61924)] animate-pulse" />
            <span>CITADEL // TELEMETRY ANOMALY</span>
          </div>
          <div className="flex items-center gap-3">
            <span>FREQ // 27.26 MHz</span>
            <span className="text-[var(--geass-crimson,#e61924)] font-bold">STATUS: CRITICAL</span>
          </div>
        </div>

        {/* Central Icon & Alert Badge */}
        <div className="my-6 sm:my-8 flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center border border-[var(--geass-crimson,#e61924)]/50 bg-[var(--geass-crimson,#e61924)]/10 shadow-[0_0_25px_rgba(230,25,36,0.25)]">
            <AlertTriangle className="h-8 w-8 text-[var(--geass-crimson,#e61924)]" />
            <div className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-[var(--geass-crimson,#e61924)]" />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-[var(--geass-crimson,#e61924)]" />
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-2">
            // PROTOCOL DESYNCHRONIZATION DETECTED
          </span>

          <h1 className="font-bebas text-3xl sm:text-5xl uppercase tracking-wider text-[var(--text-primary)] leading-none mb-3">
            SYSTEM ANOMALY DETECTED
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
            A neural transmission fault has disrupted this sector&apos;s data stream. The imperial
            relay encountered an unexpected operational exception while synthesizing the requested
            protocol.
          </p>
        </div>

        {/* Diagnostic Telemetry Dossier */}
        <div className="mb-8 border border-[var(--border)] bg-[var(--bg-primary)]/80 p-4 font-mono text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 mb-2 text-[var(--accent-primary)] text-[11px] font-bold tracking-wider">
            <Terminal className="h-3.5 w-3.5" />
            <span>DIAGNOSTIC TELEMETRY LOG</span>
          </div>
          <div className="space-y-1 overflow-x-auto touch-pan-y text-[11px]">
            <p>
              <span className="text-[var(--text-secondary)]">EXCEPTION_TYPE:</span>{" "}
              {error.name || "RuntimeExecutionFailure"}
            </p>
            {error.digest && (
              <p>
                <span className="text-[var(--text-secondary)]">DIGEST_HASH:</span>{" "}
                <span className="text-[var(--accent-primary)] font-semibold">{error.digest}</span>
              </p>
            )}
            <p className="text-[var(--text-muted)] break-words">
              <span className="text-[var(--text-secondary)]">MESSAGE:</span>{" "}
              {error.message || "An unhandled route error occurred during execution."}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="mecha-bracket group relative inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2.5 border border-[var(--accent-primary)] bg-[var(--surface)] px-6 py-2.5 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] transition-all duration-200 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] active:scale-[0.98] disabled:opacity-50"
          >
            <RotateCcw
              className={`h-4 w-4 transition-transform duration-500 ${
                isRetrying ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span>{isRetrying ? "RE-INITIALIZING..." : "RE-INITIALIZE PROTOCOL"}</span>
          </button>

          <Link
            href="/"
            className="mecha-bracket group relative inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 border border-[var(--border)] bg-transparent px-6 py-2.5 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] active:scale-[0.98]"
          >
            <Home className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>RETURN TO CITADEL</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>COMMAND RELAY</span>
          </Link>
        </div>

        {/* Bottom Coordinates Timestamp */}
        <div className="mt-8 pt-4 border-t border-[var(--border)]/60 text-center font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase">
          CITADEL PROTOCOL GATEWAY · GORAKHPUR [26.7465° N, 83.4446° E]
        </div>
      </div>
    </div>
  );
}

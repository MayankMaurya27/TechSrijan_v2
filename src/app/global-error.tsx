"use client";

import React, { useEffect } from "react";
import "@/styles/globals.css";

export default function GlobalError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  useEffect(() => {
    console.error("[Citadel Root Emergency] Catastrophic Layout Exception:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    }
  };

  const handleHardReload = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <html lang="en" data-theme="arrakis-day" className="dark bg-[#1A1D21] text-[#F0EAE1]">
      <head>
        <title>Emergency Substrate Failure | TechSrijan&apos;27</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#1A1D21] text-[#F0EAE1] font-sans antialiased flex items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-[#C47D48] selection:text-[#1A1D21]">
        <div
          role="alert"
          aria-live="assertive"
          className="relative z-10 w-full max-w-lg border border-red-500/40 bg-[#121518]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center"
        >
          {/* Emergency Beacon Header */}
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-red-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              EMERGENCY ROOT PROTOCOL
            </span>
            <span className="font-bold">SEVERITY // FATAL</span>
          </div>

          {/* Warning Glyph */}
          <div className="my-6 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border-2 border-red-500/60 bg-red-500/10 shadow-[0_0_30px_rgba(230,25,36,0.3)]">
              <span className="text-3xl text-red-500 font-mono font-bold" aria-hidden="true">
                ⚠
              </span>
            </div>

            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-red-400 uppercase mb-1">
              // CITADEL SUBSTRATE COLLAPSE
            </span>

            <h1 className="font-bebas text-3xl sm:text-5xl uppercase tracking-wider text-[#FFFFFF] leading-none mb-3">
              CRITICAL SYSTEM FAILURE
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#D7DBE2] leading-relaxed max-w-md mx-auto">
              A catastrophic neural synchronization fault has compromised the root Citadel
              architecture. Standard interface routines have been suspended to prevent substrate
              corruption.
            </p>
          </div>

          {/* Diagnostic Log */}
          <div className="mb-6 border border-red-500/20 bg-[#0A0708] p-3 text-left font-mono text-[11px] text-[#A0A8B5]">
            <p className="text-red-400 font-bold mb-1">DIAGNOSTIC EXCEPTION:</p>
            {error.digest && (
              <p className="mb-1">
                <span className="text-[#D7DBE2]">DIGEST:</span> {error.digest}
              </p>
            )}
            <p className="text-[10px] text-[#778292] break-words">
              {error.message || "An unhandled exception occurred in the root layout shell."}
            </p>
          </div>

          {/* Dual Recovery Triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-red-500/60 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs font-bold tracking-[0.18em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-[0.98]"
            >
              REBOOT CITADEL PROTOCOL
            </button>

            <button
              type="button"
              onClick={handleHardReload}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-[#F0EAE1] font-mono text-xs font-bold tracking-[0.18em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]"
            >
              PURGE &amp; HARD RELOAD
            </button>
          </div>

          <div className="mt-6 pt-3 border-t border-red-500/20 font-mono text-[9px] tracking-widest text-[#778292] uppercase">
            TECHSRIJAN 2027 · EMERGENCY FAILSAFE ROUTINE
          </div>
        </div>
      </body>
    </html>
  );
}

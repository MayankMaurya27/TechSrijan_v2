"use client";

import { useEffect, useState } from "react";
import { Crosshair } from "lucide-react";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export function CountdownHUD() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target Fest Date (November 14, 2026)
    const targetDate = new Date("2026-11-14T00:00:00Z").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="h-36 rounded border border-[var(--border)] bg-[var(--surface)] opacity-40 animate-pulse" />
      </div>
    );
  }

  const segments = [
    { label: "SOLAR DAYS", value: timeLeft.days, sub: "ORBITAL CYCLES" },
    { label: "STANDARD HOURS", value: timeLeft.hours, sub: "TERRESTRIAL T-MINUS" },
    { label: "MINUTES", value: timeLeft.minutes, sub: "CHRONO SYNC" },
    { label: "SECONDS", value: timeLeft.seconds, sub: "REAL-TIME TICK" },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-6 py-12">
      {/* Tactical Framing Container */}
      <div className="mecha-bracket relative rounded border border-[var(--border)] bg-[var(--surface)]/70 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        {/* Header Telemetry */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-[10px] tracking-[0.25em] text-[var(--text-secondary)] gap-2">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--geass-crimson)] animate-pulse" />
            SYNCHRONIZED ZERO COMMAND CLOCK
          </span>
          <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Crosshair className="h-3 w-3 text-[var(--accent-primary)]" />
            COORDINATES // 26.7381° N, 83.4332° E // MMMUT
          </span>
        </div>

        {/* 4-Digit Numeric Counter Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              className="mecha-bracket group relative flex flex-col items-center justify-center border border-[var(--border)] bg-[var(--bg-primary)]/80 py-5 px-3 transition-colors hover:border-[var(--border-accent)]"
            >
              <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {segment.value}
              </span>
              <span className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-primary)] font-bold">
                {segment.label}
              </span>
              <span className="font-mono text-[8px] tracking-widest text-[var(--text-muted)] mt-0.5">
                {segment.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

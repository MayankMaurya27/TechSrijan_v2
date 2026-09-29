"use client";

import { useEffect, useState } from "react";

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
    // Target Fest Date (e.g. November 14, 2026)
    const targetDate = new Date("2026-11-14T00:00:00Z").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-28 rounded border border-[var(--border)] bg-[var(--surface)] opacity-50 animate-pulse" />
      </div>
    );
  }

  const segments = [
    { label: "SOLAR DAYS", value: timeLeft.days },
    { label: "STANDARD HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-6 py-12">
      {/* Container with Chamfered Tech Framing */}
      <div className="relative rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        {/* Corner HUD Brackets */}
        <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-[var(--accent-primary)]" />
        <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-[var(--accent-primary)]" />
        <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-[var(--accent-primary)]" />
        <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[var(--accent-primary)]" />

        {/* Header Telemetry */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-[10px] tracking-[0.25em] text-[var(--text-secondary)]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            SYNCHRONIZED T-MINUS CLOCK
          </span>
          <span className="hidden sm:inline">COORDINATES: 26.7381° N, 83.4332° E</span>
        </div>

        {/* Numeric Counter Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-primary)]/70 py-4 px-2"
            >
              <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-[var(--text-primary)]">
                {segment.value}
              </span>
              <span className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-primary)] font-bold">
                {segment.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

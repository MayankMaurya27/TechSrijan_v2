"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * Countdown Box Particle Reservoir Component
 * - Arrakis (Amber) theme: Microscopic minute sand grains (1.0px - 1.5px) in the lower bed.
 * - Giedi Prime (Dark / Monochrome) theme: Very sparse glowing red particles drifting downward,
 *   with occasional particles fading out mid-flight into the dark void.
 */
function MinuteSandBed({ isHovered }: { isHovered?: boolean }) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = !!isHovered;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // -------------------------------------------------------------
    // 1. ARRAKIS THEME: MINUTE SPICE SAND GRAINS
    // -------------------------------------------------------------
    const SAND_COLORS = [
      "#ffe8a3", // Silica Gold Glint
      "#f3ce7a", // Bleached Sand
      "#d4a843", // Melange Spice Gold
      "#ffffff", // Quartz Crystal Specks
      "#c79c3e", // Ochre Sand Grain
    ];

    interface SandGrain {
      x: number;
      y: number;
      baseY: number;
      size: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      driftSpeed: number;
      driftOffset: number;
      type: "bed" | "air" | "trickle";
    }

    let sandGrains: SandGrain[] = [];

    const initSandGrains = (w: number, h: number) => {
      sandGrains = [];
      const dpr = window.devicePixelRatio || 1;

      // Bed grains along the floor (70-95 fine microscopic grains)
      const bedCount = Math.floor(w / 3.2);
      for (let i = 0; i < bedCount; i++) {
        const x = (i / bedCount) * w + (Math.random() - 0.5) * 5;
        const normalizedX = x / w;
        const duneCurve =
          Math.sin(normalizedX * Math.PI) * 1.5 +
          Math.cos(normalizedX * Math.PI * 2) * 1.0;
        const baseY = h - 1.5 - Math.random() * 4.5 + duneCurve;
        sandGrains.push({
          x,
          y: baseY,
          baseY,
          size: Math.round((1.0 + (Math.random() > 0.65 ? 0.4 : 0)) * dpr),
          color: SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)],
          alpha: 0.7 + Math.random() * 0.28,
          baseAlpha: 0.7 + Math.random() * 0.28,
          twinkleSpeed: 0.02 + Math.random() * 0.035,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.015 + Math.random() * 0.02,
          driftOffset: Math.random() * Math.PI * 2,
          type: "bed",
        });
      }

      // Airborne sand specks (floating in lower 18px)
      const airCount = 20;
      for (let i = 0; i < airCount; i++) {
        const x = Math.random() * w;
        const baseY = h - 4 - Math.random() * 16;
        sandGrains.push({
          x,
          y: baseY,
          baseY,
          size: Math.round(1.0 * dpr),
          color: SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)],
          alpha: 0.6 + Math.random() * 0.35,
          baseAlpha: 0.6 + Math.random() * 0.35,
          twinkleSpeed: 0.03 + Math.random() * 0.04,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.02 + Math.random() * 0.025,
          driftOffset: Math.random() * Math.PI * 2,
          type: "air",
        });
      }

      // Hourglass micro-trickle grains
      for (let i = 0; i < 3; i++) {
        sandGrains.push({
          x: w * 0.5 + (Math.random() - 0.5) * 8,
          y: Math.random() * (h - 8),
          baseY: 0,
          size: Math.round(1.0 * dpr),
          color: SAND_COLORS[Math.floor(Math.random() * 3)],
          alpha: 0.85,
          baseAlpha: 0.85,
          twinkleSpeed: 0.05,
          twinkleOffset: i * 2,
          driftSpeed: 0.01,
          driftOffset: 0,
          type: "trickle",
        });
      }
    };

    // -------------------------------------------------------------
    // 2. GIEDI PRIME THEME: MINUTE RED EMBERS ACCUMULATED AT BOTTOM
    //    + SPARSE PARTICLES DRIFTING DOWNWARD WITH OCCASIONAL FADE OUT
    // -------------------------------------------------------------
    const RED_BED_COLORS = [
      "#ff1e27", // Primary Geass Crimson
      "#ff333d", // Infrared Scarlet
      "#e61924", // Deep Crimson
      "#ff6b72", // Glowing Hot Micro-Ember
      "#ffffff", // Occasional Quartz Spark
      "#c4151e", // Obsidian Basalt Red
    ];

    interface RedBedGrain {
      x: number;
      y: number;
      baseY: number;
      size: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      driftSpeed: number;
      driftOffset: number;
    }

    interface RedDriftParticle {
      x: number;
      y: number;
      radius: number;
      vy: number;
      swaySpeed: number;
      swayAmp: number;
      swayOffset: number;
      alpha: number;
      targetAlpha: number;
      fadeState: "fade-in" | "alive" | "fading-out" | "dormant";
      fadeSpeed: number;
      dormantFrames: number;
      life: number;
      maxLife: number;
      glowBlur: number;
      color: string;
      hasCore: boolean;
    }

    let redBedGrains: RedBedGrain[] = [];
    let redAirGrains: RedBedGrain[] = [];
    let redDriftParticles: RedDriftParticle[] = [];

    const initRedParticles = (w: number, h: number) => {
      redBedGrains = [];
      redAirGrains = [];
      redDriftParticles = [];
      const dpr = window.devicePixelRatio || 1;

      // 2A. Accumulated minute red embers at the bottom floor (strictly minute 1.0px - 1.35px)
      const bedCount = Math.floor(w / 3.2); // ~70-90 microscopic specks resting along floor
      for (let i = 0; i < bedCount; i++) {
        const x = (i / bedCount) * w + (Math.random() - 0.5) * 5;
        const normalizedX = x / w;
        // Subtle sediment curve along the bottom floor
        const duneCurve =
          Math.sin(normalizedX * Math.PI) * 1.5 +
          Math.cos(normalizedX * Math.PI * 2) * 1.0;
        const baseY = h - 1.5 - Math.random() * 4.5 + duneCurve;
        redBedGrains.push({
          x,
          y: baseY,
          baseY,
          // Strictly minute: 1.0px to 1.35px max (sharp pinpoint pixels)
          size: Math.round((1.0 + (Math.random() > 0.7 ? 0.35 : 0)) * dpr),
          color: RED_BED_COLORS[Math.floor(Math.random() * RED_BED_COLORS.length)],
          alpha: 0.7 + Math.random() * 0.28,
          baseAlpha: 0.7 + Math.random() * 0.28,
          twinkleSpeed: 0.02 + Math.random() * 0.035,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.015 + Math.random() * 0.02,
          driftOffset: Math.random() * Math.PI * 2,
        });
      }

      // 2B. Minute suspended airborne ember specks in the lower accumulation zone (lower 16px)
      const airCount = 14;
      for (let i = 0; i < airCount; i++) {
        const x = Math.random() * w;
        const baseY = h - 4 - Math.random() * 14;
        redAirGrains.push({
          x,
          y: baseY,
          baseY,
          size: Math.round(1.0 * dpr), // Exactly 1px pinprick
          color: RED_BED_COLORS[Math.floor(Math.random() * RED_BED_COLORS.length)],
          alpha: 0.6 + Math.random() * 0.35,
          baseAlpha: 0.6 + Math.random() * 0.35,
          twinkleSpeed: 0.03 + Math.random() * 0.04,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.02 + Math.random() * 0.025,
          driftOffset: Math.random() * Math.PI * 2,
        });
      }

      // 2C. Very sparse glowing red particles drifting downward from above (exactly 7 specks)
      const driftCount = 7;
      for (let i = 0; i < driftCount; i++) {
        const hasCore = Math.random() > 0.65;
        const targetAlpha = 0.65 + Math.random() * 0.32;
        const x = w * 0.08 + Math.random() * (w * 0.84);
        const y = Math.random() * (h * 0.8);
        const maxLife = Math.floor(190 + Math.random() * 260);

        redDriftParticles.push({
          x,
          y,
          radius: (1.1 + Math.random() * 0.6) * dpr,
          vy: 0.26 + Math.random() * 0.22,
          swaySpeed: 0.012 + Math.random() * 0.016,
          swayAmp: 0.18 + Math.random() * 0.15,
          swayOffset: Math.random() * Math.PI * 2,
          alpha: targetAlpha * Math.random(),
          targetAlpha,
          fadeState: Math.random() > 0.35 ? "alive" : "fade-in",
          fadeSpeed: 0.016 + Math.random() * 0.014,
          dormantFrames: 0,
          life: Math.floor(Math.random() * maxLife * 0.7),
          maxLife,
          glowBlur: 4.5 + Math.random() * 3.5,
          color: RED_BED_COLORS[Math.floor(Math.random() * 4)],
          hasCore,
        });
      }
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        width = Math.round(rect.width * dpr);
        height = Math.round(rect.height * dpr);
        canvas.width = width;
        canvas.height = height;
        if (theme === "arrakis") {
          initSandGrains(width, height);
        } else {
          initRedParticles(width, height);
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    let time = 0;
    // Frame count until next occasional particle triggers mid-air fade out
    let nextOccasionalFadeOutFrame = 80 + Math.floor(Math.random() * 90);

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const isHovered = isHoveredRef.current;

      if (theme === "arrakis") {
        // --- ARRAKIS: Fine Minute Sand Bed ---
        const grad = ctx.createLinearGradient(0, height - 10, 0, height);
        grad.addColorStop(0, "rgba(212, 168, 67, 0)");
        grad.addColorStop(1, "rgba(212, 168, 67, 0.16)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, height - 10, width, 10);

        const hoverLift = isHovered ? -2.0 : 0;
        ctx.shadowBlur = 0;

        for (const g of sandGrains) {
          if (g.type === "bed") {
            const shimmer = Math.sin(time * g.twinkleSpeed + g.twinkleOffset);
            const alpha = Math.max(0.45, Math.min(1.0, g.baseAlpha + shimmer * 0.25));
            const swayY = Math.sin(time * g.driftSpeed + g.driftOffset) * 0.5 + hoverLift;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = g.color;
            ctx.fillRect(Math.round(g.x), Math.round(g.y + swayY), g.size, g.size);
          } else if (g.type === "air") {
            const swayX = Math.sin(time * g.driftSpeed + g.driftOffset) * 2.2;
            const swayY =
              Math.cos(time * g.driftSpeed * 0.8 + g.driftOffset) * 1.8 + hoverLift * 1.2;
            const shimmer = Math.sin(time * g.twinkleSpeed + g.twinkleOffset);
            const alpha = Math.max(0.35, Math.min(1.0, g.baseAlpha + shimmer * 0.3));
            ctx.globalAlpha = alpha;
            ctx.fillStyle = g.color;
            ctx.fillRect(Math.round(g.x + swayX), Math.round(g.y + swayY), g.size, g.size);
          } else if (g.type === "trickle") {
            g.y += 0.55;
            if (g.y >= height - 3) {
              g.y = 0;
              g.x = width * 0.5 + (Math.random() - 0.5) * 8;
            }
            ctx.globalAlpha = g.alpha;
            ctx.fillStyle = g.color;
            ctx.fillRect(Math.round(g.x), Math.round(g.y), g.size, g.size);
          }
        }
      } else {
        // --- GIEDI PRIME: Accumulated Minute Red Embers at Floor + Sparse Downward Drift ---
        // Subtle infrared bottom floor haze
        const grad = ctx.createLinearGradient(0, height - 12, 0, height);
        grad.addColorStop(0, "rgba(255, 30, 39, 0)");
        grad.addColorStop(
          1,
          isHovered ? "rgba(255, 30, 39, 0.24)" : "rgba(255, 30, 39, 0.14)"
        );
        ctx.fillStyle = grad;
        ctx.fillRect(0, height - 12, width, 12);

        const hoverLift = isHovered ? -2.0 : 0;

        // 1. Render accumulated minute red embers at the bottom (strictly minute 1.0px - 1.35px)
        // Explicitly NO shadowBlur so grains stay microscopic pinpricks
        ctx.shadowBlur = 0;

        for (const g of redBedGrains) {
          const shimmer = Math.sin(time * g.twinkleSpeed + g.twinkleOffset);
          const alpha = Math.max(0.45, Math.min(1.0, g.baseAlpha + shimmer * 0.25));
          const swayY = Math.sin(time * g.driftSpeed + g.driftOffset) * 0.5 + hoverLift;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = g.color;
          ctx.fillRect(Math.round(g.x), Math.round(g.y + swayY), g.size, g.size);
        }

        // 2. Render airborne minute ember specks floating in lower accumulation zone
        for (const g of redAirGrains) {
          const swayX = Math.sin(time * g.driftSpeed + g.driftOffset) * 2.0;
          const swayY =
            Math.cos(time * g.driftSpeed * 0.8 + g.driftOffset) * 1.6 + hoverLift * 1.2;
          const shimmer = Math.sin(time * g.twinkleSpeed + g.twinkleOffset);
          const alpha = Math.max(0.35, Math.min(1.0, g.baseAlpha + shimmer * 0.3));
          ctx.globalAlpha = alpha;
          ctx.fillStyle = g.color;
          ctx.fillRect(Math.round(g.x + swayX), Math.round(g.y + swayY), g.size, g.size);
        }

        // 3. Render very sparse glowing red particles drifting downward from above
        // Occasional particle fade-out trigger: pick an active particle to dissolve mid-drift
        if (time >= nextOccasionalFadeOutFrame) {
          nextOccasionalFadeOutFrame = time + 110 + Math.floor(Math.random() * 120);
          const aliveParticles = redDriftParticles.filter(
            (p) => p.fadeState === "alive" && p.y > height * 0.2 && p.y < height * 0.75
          );
          if (aliveParticles.length > 0) {
            const chosen =
              aliveParticles[Math.floor(Math.random() * aliveParticles.length)];
            chosen.fadeState = "fading-out";
          }
        }

        const speedMultiplier = isHovered ? 1.25 : 1.0;

        for (const p of redDriftParticles) {
          p.life += 1;

          // State Machine
          if (p.fadeState === "fade-in") {
            p.alpha += p.fadeSpeed;
            if (p.alpha >= p.targetAlpha) {
              p.alpha = p.targetAlpha;
              p.fadeState = "alive";
            }
          } else if (p.fadeState === "alive") {
            const pulse = Math.sin(time * 0.04 + p.swayOffset) * 0.12;
            p.alpha = Math.max(0.4, Math.min(1.0, p.targetAlpha + pulse));

            // Natural lifecycle expiration or settling into bottom accumulated bed
            if (p.life >= p.maxLife || p.y >= height - 6) {
              p.fadeState = "fading-out";
            }
          } else if (p.fadeState === "fading-out") {
            // Smoothly decay alpha to 0
            p.alpha -= p.fadeSpeed * 1.15;
            if (p.alpha <= 0.01) {
              p.alpha = 0;
              p.fadeState = "dormant";
              // Dormant delay keeps drift field very sparse
              p.dormantFrames = Math.floor(40 + Math.random() * 80);
            }
          } else if (p.fadeState === "dormant") {
            p.dormantFrames -= 1;
            if (p.dormantFrames <= 0) {
              // Respawn at top to drift downward again
              p.x = width * 0.08 + Math.random() * (width * 0.84);
              p.y = -4 - Math.random() * 8;
              p.life = 0;
              p.maxLife = Math.floor(190 + Math.random() * 260);
              p.targetAlpha = 0.65 + Math.random() * 0.32;
              p.alpha = 0;
              p.fadeState = "fade-in";
              p.vy = 0.26 + Math.random() * 0.22;
            }
          }

          // Downward Drift & Atmospheric Sway (when not dormant)
          if (p.fadeState !== "dormant") {
            p.y += p.vy * speedMultiplier;
            p.x += Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmp;

            // Render glowing red particle
            if (p.alpha > 0.02) {
              ctx.save();
              ctx.shadowColor = "rgba(255, 30, 39, 0.95)";
              ctx.shadowBlur = (p.glowBlur + (isHovered ? 3 : 0)) * dpr;
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();

              // Microscopic high-energy photon core
              if (p.hasCore) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 0.75));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
                ctx.fill();
              }

              ctx.restore();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [theme]);

  return (
    <div
      data-particle-container={theme}
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Hairline baseline along the bottom floor */}
      <div
        className={`absolute inset-x-2 bottom-0 h-px transition-colors duration-300 ${
          theme === "arrakis"
            ? "bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-[var(--geass-crimson)]/50 to-transparent"
        }`}
      />
    </div>
  );
}


export function CountdownHUD() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="mecha-bracket group relative flex flex-col items-center justify-center border border-[var(--border)] bg-[var(--bg-primary)]/80 py-5 px-3 transition-colors hover:border-[var(--border-accent)] overflow-hidden"
            >
              {/* Digit Counter Value */}
              <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors relative z-10">
                {segment.value}
              </span>
              <span className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-primary)] font-bold relative z-10">
                {segment.label}
              </span>
              <span className="font-mono text-[8px] tracking-widest text-[var(--text-muted)] mt-0.5 relative z-10">
                {segment.sub}
              </span>

              {/* Truly Minute Sand Particles Reservoir */}
              <MinuteSandBed isHovered={hoveredIdx === idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

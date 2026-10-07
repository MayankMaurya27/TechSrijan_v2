"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Operative } from "../data/team-roster";

const MAX_TILT = 9; // degrees

interface OperativeCardProps {
  operative: Operative;
  onOpenDossier: (op: Operative) => void;
}

export function OperativeCard({ operative, onOpenDossier }: OperativeCardProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = circleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({
        rx: (0.5 - py) * 2 * MAX_TILT,
        ry: (px - 0.5) * 2 * MAX_TILT,
        mx: px * 100,
        my: py * 100,
        active: true,
      });
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));
  };

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return (
    <div
      onClick={() => onOpenDossier(operative)}
      className="group cursor-pointer select-none flex flex-col items-center text-center [perspective:1000px]"
    >
      {/* ============================================================
          CIRCULAR 3D PORTRAIT MEDALLION
          ============================================================ */}
      <div
        ref={circleRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex items-center justify-center rounded-full will-change-transform"
        style={{
          transform: tilt.active
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-8px) scale(1.03)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Subtle Ambient Halo Pool */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-70 pointer-events-none"
          style={{ background: operative.colorTheme.glow }}
        />

        {/* Orbit Ring (Fine Dashed Halo) */}
        <div
          aria-hidden="true"
          className="absolute -inset-2.5 rounded-full border border-dashed border-white/10 opacity-30 transition-all duration-300 group-hover:opacity-80 group-hover:scale-105 pointer-events-none"
          style={{ borderColor: tilt.active ? operative.colorTheme.accent : undefined }}
        />

        {/* Circular Frame Container */}
        <div
          className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-full p-[2px] bg-gradient-to-b from-white/25 via-white/5 to-transparent transition-all duration-500 group-hover:from-[#D4A843] group-hover:via-[#F5E6C8] group-hover:to-[#D4A843]/40 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.9)] group-hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.95)]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0E1017]">
            {/* Specular Glare Follows Pointer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(160px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.22), transparent 65%)`,
              }}
            />

            {/* Member Photo */}
            {operative.image ? (
              <img
                src={operative.image}
                alt={operative.name}
                className="h-full w-full rounded-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#181B26] to-[#0A0B0E] text-3xl font-bold text-white/90">
                {operative.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
            )}

            {/* Subtle bottom gradient shade */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50"
            />

            {/* Arrow Glyph floating badge */}
            <div className="absolute right-3 bottom-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 backdrop-blur-md border border-white/20 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110">
              <ArrowUpRight className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          DESIGNER MEMBER TYPOGRAPHY (Artistic, High-End Styling)
          ============================================================ */}
      <div className="mt-5 max-w-[260px] flex flex-col items-center">
        {/* Designer Name with Metallic Shimmer */}
        <h3 className="text-lg sm:text-xl font-bold tracking-[-0.015em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#F5EADB] to-[#E3D1B8] transition-all duration-300 group-hover:from-[#FFFFFF] group-hover:via-[#F5E6C8] group-hover:to-[#D4A843] group-hover:drop-shadow-[0_0_16px_rgba(212,168,67,0.35)]">
          {operative.name}
        </h3>

        {/* Professional Role Title */}
        <p className="mt-1 text-xs sm:text-[13px] text-zinc-400 font-normal leading-snug transition-colors duration-200 group-hover:text-zinc-200">
          {operative.role}
        </p>

        {/* Elevated Society/Affiliation Capsule */}
        <div className="mt-2.5 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#11131C]/90 border border-white/[0.08] px-3 py-0.5 text-[10px] font-mono tracking-[0.18em] text-zinc-400 uppercase transition-all duration-300 group-hover:border-[var(--accent-primary)]/50 group-hover:text-zinc-300 shadow-sm">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: operative.colorTheme.accent,
                boxShadow: `0 0 6px ${operative.colorTheme.accent}`,
              }}
            />
            {operative.house}
          </span>
        </div>
      </div>
    </div>
  );
}

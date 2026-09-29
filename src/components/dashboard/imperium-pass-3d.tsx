"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImperiumPass3DProps {
  userName?: string;
  college?: string;
  passCode?: string;
  events?: { title: string; status: "confirmed" | "pending_manual_review" }[];
}

export function ImperiumPass3D({
  userName = "Lelouch vi Britannia",
  college = "MMMUT Gorakhpur",
  passCode = "TS26-7F4B-9E1A",
  events = [
    { title: "HACK IMPERIUM", status: "confirmed" },
    { title: "ALGO EXILE", status: "confirmed" },
    { title: "ROBO GLADIATORS", status: "pending_manual_review" },
  ],
}: ImperiumPass3DProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Generate QR Code data URL on mount
  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        pass: passCode,
        user: userName,
        college: college,
        authority: "TECHSRIJAN_2026_MMMUT",
      }),
      {
        width: 180,
        margin: 1,
        color: {
          dark: "#090704",
          light: "#F8EED9",
        },
      }
    ).then(setQrDataUrl);
  }, [passCode, userName, college]);

  // Desktop Pointer Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -14;
    const rY = ((x - centerX) / centerX) * 14;

    setRotateX(rX);
    setRotateY(rY);

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  // Mobile Gyroscope Parallax Tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const rX = Math.min(Math.max((e.beta - 45) * 0.4, -14), 14);
      const rY = Math.min(Math.max(e.gamma * 0.4, -14), 14);
      setRotateX(-rX);
      setRotateY(rY);
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* 3D Perspective Card Wrapper */}
      <div
        className="w-full max-w-xl py-6"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="mecha-bracket relative h-[320px] sm:h-[350px] w-full rounded-lg border border-[var(--border-accent)] bg-gradient-to-br from-[#24180D] via-[#160F08] to-[#090704] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-150 ease-out overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {/* Holographic Iridescent Shimmer Foil Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(212,168,67,0.4) 30%, rgba(255,30,39,0.3) 60%, transparent 80%)`,
            }}
          />

          {/* Card Body */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-[var(--border-accent)] bg-[var(--surface)] font-mono text-xs font-black text-[var(--accent-primary)]">
                  TS
                </div>
                <div>
                  <div className="font-mono text-xs font-black tracking-widest text-[var(--text-primary)]">
                    TECHSRIJAN 2026
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[var(--text-secondary)]">
                    OFFICIAL IMPERIUM ACCESS PASS
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[var(--accent-primary)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span>AUTHENTICATED</span>
              </div>
            </div>

            {/* Card Middle: Operative Details & QR */}
            <div className="flex items-center justify-between my-auto gap-4">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] block">
                  OPERATIVE IDENTITY
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-wide">
                  {userName}
                </span>

                <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] block mt-3">
                  INSTITUTIONAL AFFILIATION
                </span>
                <span className="font-mono text-xs font-bold text-[var(--text-secondary)]">
                  {college}
                </span>

                <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] block mt-3">
                  SIGNED SECURITY CODE
                </span>
                <span className="font-mono text-xs font-bold tracking-widest text-[var(--accent-primary)]">
                  {passCode}
                </span>
              </div>

              {/* High-Contrast Optical QR Code */}
              <div className="flex flex-col items-center">
                <div className="rounded border-2 border-[var(--accent-primary)] p-1 bg-[#F8EED9] shadow-[var(--glow)]">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Security Check-in QR" className="h-24 w-24 sm:h-28 sm:w-28 object-contain" />
                  ) : (
                    <div className="h-24 w-24 sm:h-28 sm:w-28 bg-[#24180D] animate-pulse" />
                  )}
                </div>
                <span className="font-mono text-[8px] tracking-widest text-[var(--text-muted)] mt-1.5">
                  GATE CHECK-IN
                </span>
              </div>
            </div>

            {/* Card Footer: Event Badges */}
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-2.5 font-mono text-[9px]">
              <span className="text-[var(--text-muted)] mr-1">REGISTERED:</span>
              {events.map((ev, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded border text-[8px] font-bold ${
                    ev.status === "confirmed"
                      ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--surface)]"
                      : "border-[var(--geass-crimson)] text-[var(--geass-crimson)] bg-[var(--surface)]"
                  }`}
                >
                  {ev.title} {ev.status === "confirmed" ? "✓" : "⚠"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pass Actions */}
      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
          <Printer className="mr-2 h-3.5 w-3.5" />
          <span>PRINT ADMIT PASS</span>
        </Button>
      </div>
    </div>
  );
}

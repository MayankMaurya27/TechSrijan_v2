"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/shared";
import { useTheme, cn } from "@/core";

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
  const { theme } = useTheme();
  const isGiediOrGeass = theme === "giedi-prime" || theme === "geass-moon";
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    QRCode.toDataURL(
      JSON.stringify({
        pass: passCode,
        user: userName,
        college: college,
        authority: "TECHSRIJAN_27_TSC_MMMUT",
      }),
      {
        width: 180,
        margin: 1,
        color: {
          dark: isGiediOrGeass ? "#000000" : "#090704",
          light: isGiediOrGeass ? "#FFFFFF" : "#F8EED9",
        },
      }
    )
      .then((url) => {
        if (isSubscribed) setQrDataUrl(url);
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [passCode, userName, college, isGiediOrGeass]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    setIsHovered(true);
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    setGlarePosition({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  useEffect(() => {
    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const updateOrientation = () => {
      setRotateX(-targetX);
      setRotateY(targetY);
      rafId = null;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      setIsHovered(true);
      targetX = Math.min(Math.max((e.beta - 45) * 0.4, -12), 12);
      targetY = Math.min(Math.max(e.gamma * 0.4, -12), 12);
      if (!rafId) {
        rafId = requestAnimationFrame(updateOrientation);
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
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
      <div
        className="w-full max-w-xl py-6"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "mecha-bracket relative h-[320px] sm:h-[350px] w-full rounded-lg border border-[var(--border-accent)] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-200 ease-out overflow-hidden",
            isGiediOrGeass
              ? "bg-gradient-to-br from-[#160a0d] via-[#090709] to-[#020102]"
              : "bg-gradient-to-br from-[#24180D] via-[#160F08] to-[#090704]"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  isGiediOrGeass
                    ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 30, 39, 0.16) 0%, rgba(255, 30, 39, 0.04) 50%, transparent 80%)"
                    : "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 168, 67, 0.18) 0%, rgba(212, 168, 67, 0.04) 50%, transparent 80%)",
              }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-[var(--accent-primary)]/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-dashed border-[var(--accent-primary)]/15 pointer-events-none" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-[0.06] pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d="M50 20 C35 38 10 44 5 48 C18 52 38 48 50 68 C62 48 82 52 95 48 C90 44 65 38 50 20 Z"
                  fill="var(--accent-primary)"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="46" r="6" fill="var(--accent-primary)" />
              </svg>
            </div>
          </div>

          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-20 mix-blend-screen transition-opacity duration-300",
              isHovered ? "opacity-65" : "opacity-0"
            )}
            style={{
              background:
                isGiediOrGeass
                  ? `radial-gradient(circle 260px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.26) 0%, rgba(255,40,50,0.18) 30%, rgba(168,85,247,0.1) 55%, transparent 75%)`
                  : `radial-gradient(circle 260px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, rgba(243,206,122,0.22) 30%, rgba(212,168,67,0.12) 55%, transparent 75%)`,
            }}
          />

          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-20 mix-blend-overlay transition-opacity duration-300",
              isHovered ? "opacity-50" : "opacity-0"
            )}
            style={{
              background:
                isGiediOrGeass
                  ? `linear-gradient(115deg, transparent 30%, rgba(255,30,39,0.12) 46%, rgba(255,255,255,0.22) 50%, rgba(255,30,39,0.12) 54%, transparent 70%)`
                  : `linear-gradient(115deg, transparent 30%, rgba(212,168,67,0.12) 46%, rgba(255,255,255,0.22) 50%, rgba(212,168,67,0.12) 54%, transparent 70%)`,
              transform: `translateX(${(glarePosition.x - 50) * 1.2}%)`,
              transition: "transform 0.1s ease-out",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-[var(--border-accent)] bg-[var(--surface)] font-mono text-xs font-black text-[var(--accent-primary)]">
                  TS
                </div>
                <div>
                  <div className="font-mono text-xs font-black tracking-widest text-[var(--text-primary)]">
                    TECHSRIJAN&apos;27
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[var(--text-secondary)]">
                    TSC MMMUT • OFFICIAL ACCESS PASS
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[var(--accent-primary)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span>AUTHENTICATED</span>
              </div>
            </div>

            <div className="flex items-center justify-between my-auto gap-4">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] block">
                  PARTICIPANT NAME
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

              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "rounded border-2 border-[var(--accent-primary)] p-1 shadow-[var(--glow)]",
                    isGiediOrGeass ? "bg-white" : "bg-[#F8EED9]"
                  )}
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Security Check-in QR"
                      className="h-24 w-24 sm:h-28 sm:w-28 object-contain"
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-24 w-24 sm:h-28 sm:w-28 animate-pulse",
                        isGiediOrGeass ? "bg-[#18181b]" : "bg-[#24180D]"
                      )}
                    />
                  )}
                </div>
                <span className="font-mono text-[8px] tracking-widest text-[var(--text-muted)] mt-1.5">
                  GATE CHECK-IN
                </span>
              </div>
            </div>

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

      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
          <Printer className="mr-2 h-3.5 w-3.5" />
          <span>PRINT ADMIT PASS</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowUpRight, Compass, Shield, Eye, Layers } from "lucide-react";
import { Contact3DStage } from "./contact-3d-stage";

interface ContactHeroCinematicProps {
  onScrollToForm: () => void;
}

export function ContactHeroCinematic({ onScrollToForm }: ContactHeroCinematicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show3dSimulator, setShow3dSimulator] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Floating Golden Spice / Ember particles animation on canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.4) * 0.45,
      speedY: -Math.random() * 0.6 - 0.25,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? "rgba(226, 168, 80," : "rgba(255, 120, 50,",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulse * 0.02) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(226, 168, 80, 0.7)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Parallax subtle tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 4, y: -y * 4 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[2.5rem] overflow-hidden border border-[#d4a843]/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] bg-[#090708] min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] transition-transform duration-500 ease-out"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
    >
      {/* 1. CINEMATIC BACKGROUND ARTWORK (Exact Uploaded Reference) */}
      {!show3dSimulator ? (
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-hero.png"
            alt="TechSrijan '27 Contact Citadel & Zero Imperium"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1600px"
            className="object-cover object-[65%_center] sm:object-center transform scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Diagonal atmospheric shadow slice matching the reference image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090606]/95 via-[#090606]/85 to-transparent w-full lg:w-[62%] pointer-events-none" />

          {/* Subtle bottom and top vignetting */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-transparent to-black/50 pointer-events-none" />
        </div>
      ) : (
        /* 2. 3D PROCEDURAL DUNE SIMULATOR (Accessible via toggle) */
        <div className="absolute inset-0 z-0 bg-black">
          <Contact3DStage theme="dune" onToggleTheme={() => {}} />
        </div>
      )}

      {/* 3. FLOATING SPICE / EMBER PARTICLES CANVAS OVERLAY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none opacity-85"
      />

      {/* 4. TOP HUD TELEMETRY BAR */}
      <div className="relative z-20 px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 text-[10px] sm:text-xs font-mono tracking-widest text-[#e2a850]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SECURE COMMS • IMPERIUM REQUIEM</span>
        </div>

        {/* Interactive View Switcher */}
        <button
          type="button"
          onClick={() => setShow3dSimulator((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-black/65 hover:bg-[#d4a843]/20 border border-[#d4a843]/40 hover:border-[#d4a843] px-4 py-1.5 text-[10px] sm:text-xs font-mono font-medium text-white transition-all cursor-pointer backdrop-blur-xl shadow-lg"
        >
          {show3dSimulator ? (
            <>
              <Eye className="h-3.5 w-3.5 text-[#e2a850]" />
              <span>RETURN TO CINEMATIC VISTA</span>
            </>
          ) : (
            <>
              <Layers className="h-3.5 w-3.5 text-[#e2a850]" />
              <span>SWITCH TO 3D DUNE SIMULATOR</span>
            </>
          )}
        </button>
      </div>

      {/* 5. HERO FOREGROUND CONTENT (Exact Match to User Reference Layout) */}
      <div className="relative z-20 px-6 sm:px-12 lg:px-16 pt-8 sm:pt-14 pb-12 sm:pb-16 flex flex-col justify-between min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] max-w-2xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Top Star Accent + Badge (Matching Reference Image) */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-5 w-5 text-[#f5c26b]">
              <Compass className="h-4 w-4 animate-[spin_18s_linear_infinite]" />
            </div>
            <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#e8d4b8] uppercase font-medium">
              CONTACT US
            </span>
            <span className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-[#d4a843]/80 to-transparent" />
          </div>

          {/* Big Majestic Serif Typography: GET IN TOUCH with orbital light trail */}
          <div className="relative space-y-0 select-none">
            {/* Luminous orbital trajectory ring behind TOUCH */}
            <svg
              className="absolute -right-6 top-8 sm:top-10 w-72 sm:w-96 h-28 sm:h-36 pointer-events-none opacity-45"
              viewBox="0 0 400 150"
              fill="none"
            >
              <ellipse
                cx="200"
                cy="75"
                rx="180"
                ry="45"
                stroke="url(#orbitalGold)"
                strokeWidth="1.2"
                transform="rotate(-15 200 75)"
              />
              <circle cx="360" cy="40" r="3" fill="#ffe4aa">
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <defs>
                <linearGradient id="orbitalGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4a843" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ffe4aa" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-black tracking-tight uppercase leading-[0.9] text-white">
              <span className="block bg-gradient-to-r from-[#ffffff] via-[#f7e6c4] to-[#e2a850] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(226,168,80,0.35)]">
                GET IN
              </span>
              <span className="block bg-gradient-to-r from-[#e2a850] via-[#ffd68a] to-[#c7882d] bg-clip-text text-transparent mt-1 sm:mt-2 drop-shadow-[0_4px_35px_rgba(226,168,80,0.45)]">
                TOUCH
              </span>
            </h1>
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-sans leading-relaxed max-w-lg">
            Have a question, collaboration idea or just want to say hi? We would love to hear from you.
          </p>

          {/* Action Button: CONTACT US ↗ (Matching Reference Image) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onScrollToForm}
              className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[#d4a843]/90 hover:border-[#ffe4aa] bg-black/40 hover:bg-[#d4a843] text-[#f5c26b] hover:text-black font-mono text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,168,67,0.15)] hover:shadow-[0_0_35px_rgba(212,168,67,0.5)] cursor-pointer active:scale-95"
            >
              <span>CONTACT US</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom Ticker: PEOPLE • IDEAS • IMPACT (Matching Reference Image) */}
        <div className="pt-10 sm:pt-14 border-t border-white/[0.08] flex items-center gap-3 text-[10px] sm:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase select-none">
          <span className="hover:text-white transition-colors">PEOPLE</span>
          <span className="text-[#d4a843] font-bold">•</span>
          <span className="hover:text-white transition-colors">IDEAS</span>
          <span className="text-[#d4a843] font-bold">•</span>
          <span className="hover:text-white transition-colors">IMPACT</span>
        </div>
      </div>

      {/* Decorative Far-Left Star Line Track (From Reference) */}
      <div className="absolute left-3 top-24 bottom-24 hidden lg:flex flex-col items-center justify-between pointer-events-none opacity-40">
        <span className="text-[#e2a850] text-xs">✦</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#e2a850] to-transparent" />
        <span className="text-[#e2a850] text-[8px]">◆</span>
        <div className="w-[1px] h-20 bg-white/20" />
        <span className="text-[#e2a850] text-[8px]">◆</span>
      </div>
    </div>
  );
}

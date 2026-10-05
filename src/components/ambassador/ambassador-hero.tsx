"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

export function AmbassadorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"moon" | "character" | "ready">("moon");
  const [mounted, setMounted] = useState(false);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 28 });

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const moonScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);
  const moonY = useTransform(scrollYProgress, [0, 0.6], [0, -25]);
  const characterScrollY = useTransform(scrollYProgress, [0, 0.6], [0, 18]);
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.8], [0, 0.9]);
  const contentFadeOut = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Subtle 3D parallax layers on mouse move
  const moonSpringX = useTransform(springX, (v) => v * 0.35);
  const moonSpringY = useTransform(springY, (v) => v * 0.35);
  const charSpringX = useTransform(springX, (v) => v * 0.75);
  const charSpringY = useTransform(springY, (v) => v * 0.5);
  const leftSpringX = useTransform(springX, (v) => v * 1.1);
  const rightSpringX = useTransform(springX, (v) => v * -1.0);
  const cardRotateY = useTransform(springX, (v) => v * 0.4);
  const cardRotateX = useTransform(springY, (v) => -v * 0.4);

  useEffect(() => {
    setMounted(true);
    // Smooth cinematic sequence:
    // 0ms: Moon background displays full-screen edge-to-edge
    // 250ms: Character begins rising smoothly from downward
    // 1100ms: Left title and Right HUD Card smoothly glide in together
    const t1 = setTimeout(() => setPhase("character"), 250);
    const t2 = setTimeout(() => setPhase("ready"), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden bg-black select-none"
    >
      {/* ========================================================
          FULL-SCREEN SCENE LAYERS (Moon + Character + Atmospherics)
          ======================================================== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1: Crimson Desert & Blood Moon (Original Untouched Artwork) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: moonScale, y: moonY, x: moonSpringX }}
        >
          <motion.img
            src="/images/redmoon1.png"
            alt="TechSrijan Crimson Moon"
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
          />
        </motion.div>

        {/* Layer 2: Deep Crimson Radial Glow (Breathing Core Pulse behind dunes) */}
        <motion.div
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] lg:w-[900px] h-[500px] sm:h-[750px] lg:h-[900px] rounded-full bg-red-600/15 blur-[140px] pointer-events-none z-[1]"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.58, 0.35],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Layer 3: Character Rising from Downward (Cutout aligned with moon center) */}
        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ y: characterScrollY, x: charSpringX }}
        >
          <motion.img
            src="/images/ambassador-character.png"
            alt="TechSrijan Campus Ambassador"
            className="w-full h-full object-cover object-center"
            initial={{ y: "24%", opacity: 0 }}
            animate={
              phase !== "moon"
                ? { y: "0%", opacity: 1 }
                : { y: "24%", opacity: 0 }
            }
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            draggable={false}
          />
        </motion.div>

        {/* Layer 4: Black Vignette near bottom around legs of character */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 z-[3] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />

        {/* Layer 5: Subtle atmospheric edge gradients on desktop to give high readability */}
        <div className="absolute inset-y-0 left-0 w-[35vw] bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none z-[3] hidden lg:block" />
        <div className="absolute inset-y-0 right-0 w-[35vw] bg-gradient-to-l from-black/55 via-black/20 to-transparent pointer-events-none z-[3] hidden lg:block" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-transparent via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* ========================================================
          FLOATING SAND EMBERS & STARDUST PARTICLES
          ======================================================== */}
      {mounted && (
        <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 4.3 + (i % 7) * 3.8) % 98;
            const top = (i * 5.2 + 18) % 90;
            const isAmber = i % 3 === 0;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: isAmber
                    ? "rgba(245, 158, 11, 0.75)"
                    : "rgba(239, 68, 68, 0.7)",
                  boxShadow: isAmber
                    ? "0 0 8px rgba(245, 158, 11, 0.9)"
                    : "0 0 8px rgba(239, 68, 68, 0.85)",
                }}
                animate={{
                  y: [0, -32 - (i % 20), 0],
                  x: [0, i % 2 === 0 ? 12 : -12, 0],
                  opacity: [0.15, 0.85, 0.15],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 4.2 + (i % 4),
                  repeat: Infinity,
                  delay: (i * 0.28) % 3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================
          DESKTOP & LARGE SCREEN COMPOSITION (Matches Image 3 & Image 4)
          - Left of Moon (Image 4): Monogram + "CAMPUS AMBASSADOR" + Dot & Line
          - Center: Moon & Character (Clear visual runway)
          - Right of Moon (Image 3): Glass HUD Card with Dot & Line, Title, Description, Divider & Buttons
          ======================================================== */}
      <motion.div
        className="hidden lg:block absolute inset-0 z-[5] pointer-events-none"
        style={{ opacity: contentFadeOut }}
      >
        {/* ----- LEFT OF MOON: EDITORIAL TITLE & ACCENTS (Image 4) ----- */}
        <motion.div
          className="absolute left-6 xl:left-12 top-[46%] -translate-y-1/2 w-max max-w-[34vw] pointer-events-auto"
          style={{ x: leftSpringX }}
          initial={{ opacity: 0, x: -35 }}
          animate={
            phase === "ready"
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -35 }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Top Line: TECHSRIJAN'27 — MMMUT GORAKHPUR ─────── */}
          <div className="flex items-center gap-2 mb-2 xl:mb-3">
            <span className="font-mono text-[9px] xl:text-[10px] tracking-[0.26em] uppercase font-bold text-[#E5983A] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
              TECHSRIJAN&apos;27
            </span>
            <span className="text-[#E5983A]/60 font-mono text-xs">—</span>
            <span className="font-mono text-[9px] xl:text-[10px] tracking-[0.26em] uppercase font-bold text-[#E5983A] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
              MMMUT GORAKHPUR
            </span>
            <div className="h-[1px] w-12 xl:w-20 bg-gradient-to-r from-[#E5983A]/70 to-transparent ml-1" />
          </div>

          {/* Main Title: CAMPUS AMBASSADOR */}
          <h1 className="font-editorial text-[clamp(2.4rem,3.4vw,4.1rem)] font-extrabold leading-[0.94] tracking-tight whitespace-nowrap">
            <span className="block text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              CAMPUS
            </span>
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B20] via-[#FF8533] to-[#FFA726] drop-shadow-[0_0_35px_rgba(255,60,32,0.45)]">
              AMBASSADOR
            </span>
          </h1>

          {/* Bottom Dot and Horizontal Line (From Image 4) */}
          <div className="mt-3.5 xl:mt-4 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5983A] shadow-[0_0_10px_#E5983A]" />
            <div className="h-[1px] w-48 sm:w-64 lg:w-72 xl:w-80 bg-gradient-to-r from-[#E5983A]/80 via-[#E5983A]/30 to-transparent" />
          </div>
        </motion.div>

        {/* ----- RIGHT OF MOON: SCI-FI HUD GLASS CARD (Image 3) ----- */}
        <motion.div
          className="absolute right-6 xl:right-12 top-[46%] -translate-y-1/2 w-full max-w-[320px] xl:max-w-[360px] pointer-events-auto"
          style={{
            x: rightSpringX,
            rotateY: cardRotateY,
            rotateX: cardRotateX,
            transformPerspective: 1000,
          }}
          initial={{ opacity: 0, x: 35 }}
          animate={
            phase === "ready"
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: 35 }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* Futuristic HUD Card Container with Chamfered Top-Right Corner */}
          <div
            className="group relative p-6 sm:p-7 rounded-sm bg-black/55 backdrop-blur-xl border border-[rgba(212,168,67,0.26)] shadow-[0_16px_50px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[rgba(212,168,67,0.45)] hover:shadow-[0_20px_60px_rgba(220,38,38,0.25)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
            }}
          >
            {/* Ambient inner gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-amber-950/15 pointer-events-none" />

            {/* Glowing Corner Notch Accent on Top-Right Chamfer */}
            <div className="absolute top-0 right-0 w-7 h-7 pointer-events-none">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                className="w-full h-full text-amber-500/80"
              >
                <path
                  d="M0 0 L6 0 L28 22 L28 28 Z"
                  fill="currentColor"
                  fillOpacity="0.4"
                />
                <line
                  x1="6"
                  y1="0"
                  x2="28"
                  y2="22"
                  stroke="#E5983A"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Top Amber Dot & Horizontal Line (From Image 3) */}
            <div className="relative z-10 flex items-center gap-2.5 mb-4">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5983A] shadow-[0_0_12px_#E5983A]" />
                <span className="absolute w-5 h-5 rounded-full border border-amber-400/60 animate-ping" />
              </div>
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#E5983A]/80 to-transparent" />
            </div>

            {/* Headline (Editorial Serif in Title Case matching Image 3) */}
            <h2 className="relative z-10 font-editorial text-[#FAF6EE] text-lg xl:text-[21px] font-normal leading-[1.32] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Be the vanguard of Eastern UP&apos;s grandest technical festival.
            </h2>

            {/* Description (Clean Sans matching Image 3) */}
            <p className="relative z-10 mt-3 text-neutral-400 font-sans text-xs sm:text-[13px] font-light leading-relaxed">
              Represent your college, lead the revolution, and claim glory.
            </p>

            {/* Horizontal Divider Line (From Image 3) */}
            <div className="relative z-10 my-5 h-[1px] w-full bg-gradient-to-r from-neutral-800 via-neutral-700/60 to-neutral-800" />

            {/* Action Buttons Stack (From Image 3) */}
            <div className="relative z-10 flex flex-col gap-3">
              {/* Primary Action: APPLY NOW */}
              <a
                href="#apply"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 w-full py-3 px-5 font-mono text-xs tracking-[0.24em] uppercase font-bold text-white bg-gradient-to-r from-[#8B0000] via-[#B91C1C] to-[#8B0000] hover:from-[#991B1B] hover:to-[#DC2626] transition-all duration-300 shadow-[0_0_20px_rgba(185,28,28,0.45)] hover:shadow-[0_0_32px_rgba(239,68,68,0.65)] active:scale-[0.98] border border-red-500/40 rounded-[3px]"
              >
                {/* Diagonal light sweep effect on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">APPLY NOW</span>
                <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </a>

              {/* Secondary Action: EXPLORE PERKS */}
              <a
                href="#perks"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 w-full py-3 px-5 font-mono text-xs tracking-[0.24em] uppercase font-medium text-neutral-300 hover:text-white bg-black/40 hover:bg-neutral-900/60 border border-[rgba(212,168,67,0.32)] hover:border-red-500/50 backdrop-blur-md transition-all duration-300 active:scale-[0.98] rounded-[3px]"
              >
                <span className="relative z-10">EXPLORE PERKS</span>
                <span className="relative z-10 text-sm text-neutral-400 group-hover:text-red-400 transition-all duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          MOBILE & TABLET ADAPTIVE LAYOUT (< 1024px)
          Seamlessly stacks to preserve full moon and character visibility
          ======================================================== */}
      <motion.div
        className="block lg:hidden absolute inset-0 z-[5] pointer-events-none flex flex-col justify-between pt-20 pb-8 px-4 sm:px-6"
        style={{ opacity: contentFadeOut }}
      >
        {/* Mobile Top Header: Title */}
        <motion.div
          className="w-full text-center pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={
            phase === "ready"
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -20 }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-black/60 backdrop-blur-md mb-2 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5983A] animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-[#E5983A] font-semibold">
              TechSrijan&apos;27 — MMMUT
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold leading-[0.95] tracking-tight">
            <span className="block text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              CAMPUS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B20] via-[#FF8533] to-[#FFA726] drop-shadow-[0_0_25px_rgba(255,60,32,0.4)]">
              AMBASSADOR
            </span>
          </h1>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5983A]" />
            <div className="h-[1px] w-24 bg-gradient-to-r from-[#E5983A]/70 to-transparent" />
          </div>
        </motion.div>

        {/* Mobile Bottom HUD Card */}
        <motion.div
          className="w-full max-w-sm mx-auto pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase === "ready"
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="p-4 sm:p-5 rounded-sm bg-black/65 backdrop-blur-xl border border-[rgba(212,168,67,0.25)] shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E5983A] shadow-[0_0_10px_#E5983A]" />
              <div className="h-[1px] w-8 bg-gradient-to-r from-amber-400/70 to-transparent" />
            </div>

            <p className="font-editorial text-[#FAF6EE] text-sm sm:text-base font-normal leading-snug">
              Be the vanguard of Eastern UP&apos;s grandest technical festival.
            </p>

            <div className="mt-4 flex gap-2.5">
              <a
                href="#apply"
                className="flex-1 py-2.5 px-3 inline-flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase font-bold text-white bg-gradient-to-r from-[#8B0000] via-[#B91C1C] to-[#8B0000] border border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95 rounded-[3px]"
              >
                <span>APPLY NOW</span>
                <span>→</span>
              </a>

              <a
                href="#perks"
                className="flex-1 py-2.5 px-3 inline-flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase font-medium text-neutral-300 hover:text-white bg-black/50 border border-[rgba(212,168,67,0.3)] active:scale-95 rounded-[3px]"
              >
                <span>PERKS</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          SCROLL TO DISCOVER INDICATOR (Bottom Center)
          ======================================================== */}
      <motion.div
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[6] pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={phase === "ready" ? { opacity: 0.6 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ opacity: contentFadeOut }}
      >
        <a
          href="#perks"
          className="flex flex-col items-center gap-1 group text-neutral-400 hover:text-red-400 transition-colors"
        >
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] uppercase">
            Scroll to Discover
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-3.5 h-3.5 text-red-400/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </a>
      </motion.div>

      {/* ========================================================
          SCROLL-DRIVEN FADE OVERLAY
          ======================================================== */}
      <motion.div
        className="absolute inset-0 z-[7] bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </section>
  );
}

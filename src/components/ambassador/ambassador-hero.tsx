"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

export function AmbassadorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"moon" | "character" | "ready">("moon");
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const moonScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.2]);
  const moonY = useTransform(scrollYProgress, [0, 0.6], [0, -35]);
  const characterScrollY = useTransform(scrollYProgress, [0, 0.6], [0, 25]);
  const overlayOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0, 0.85]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  // Character slight parallax against background
  const charSpringX = useTransform(springX, (v) => v * 1.35);

  useEffect(() => {
    setMounted(true);
    // Smooth cinematic sequence:
    // 0ms: Moon background displays crisp and majestic
    // 400ms: Character rises smoothly from below
    // 1700ms: Titles and CTA unlock
    const t1 = setTimeout(() => setPhase("character"), 400);
    const t2 = setTimeout(() => setPhase("ready"), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden bg-[#050101] select-none"
    >
      {/* Layer 1: Crimson Desert & Blood Moon (Static Majestic Background) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: moonScale, y: moonY, x: springX }}
      >
        <motion.img
          src="/images/redmoon1.png"
          alt="TechSrijan Crimson Moon"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          draggable={false}
          priority-component="true"
        />
      </motion.div>

      {/* Layer 2: Subtle Atmospheric Red Mist & Glow Behind Character */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />

      {/* Layer 3: Character Spawning Upward (ONLY the character figure with zero moon or sky) */}
      <motion.div
        className="absolute inset-0 z-[2] flex items-end justify-center pointer-events-none"
        style={{ y: characterScrollY, x: charSpringX }}
      >
        <motion.img
          src="/images/ambassador-character.png"
          alt="TechSrijan Ambassador Character"
          className="w-full h-full object-cover object-bottom"
          initial={{ y: "30%", opacity: 0 }}
          animate={
            phase !== "moon"
              ? { y: "0%", opacity: 1 }
              : { y: "30%", opacity: 0 }
          }
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          draggable={false}
        />
      </motion.div>

      {/* Layer 4: Deep ground fade for readability and seamless floor blend */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] sm:h-[50%] z-[3] bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />

      {/* Layer 5: Floating Sand Embers (Client-rendered only) */}
      {mounted && (
        <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 4.4 + (i % 5) * 3) % 100;
            const top = (i * 6.8 + 22) % 94;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                  background:
                    i % 2 === 0
                      ? "rgba(239, 68, 68, 0.65)"
                      : "rgba(249, 115, 22, 0.55)",
                  boxShadow: "0 0 6px rgba(239, 68, 68, 0.8)",
                }}
                animate={{
                  y: [0, -32 - (i % 18), 0],
                  x: [0, i % 2 === 0 ? 10 : -10, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 4.5 + (i % 3),
                  repeat: Infinity,
                  delay: (i * 0.3) % 3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Layer 6: Hero Content & Typography */}
      <motion.div
        className="absolute inset-0 z-[5] flex flex-col items-center justify-end pb-[7vh] sm:pb-[9vh] px-4 text-center pointer-events-none"
        style={{ y: titleY }}
      >
        {/* Monogram tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md mb-3 sm:mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-red-300 font-semibold">
            TechSrijan&apos;27 — MMMUT Gorakhpur
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-serif text-[clamp(2.4rem,8.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
        >
          <span className="block">CAMPUS</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.4)]">
            AMBASSADOR
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "ready" ? { opacity: 0.9, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-3 sm:mt-4 max-w-lg text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light drop-shadow"
        >
          Become the vanguard of Eastern UP&apos;s grandest technical festival.
          Represent your college, lead the revolution, and claim glory.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-orange-600 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.45)] hover:shadow-[0_0_50px_rgba(239,68,68,0.7)] active:scale-95 border border-red-400/40"
            style={{ clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
          >
            <span>Apply Now</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <a
            href="#perks"
            className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-red-500/60 bg-black/50 backdrop-blur-md transition-all duration-300 active:scale-95"
            style={{ clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
          >
            <span>Explore Perks</span>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase === "ready" ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors pointer-events-auto"
        >
          <a href="#perks" className="flex flex-col items-center gap-1 group">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Scroll to Discover</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-4 h-4 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>

      {/* Layer 7: Scroll-driven fade into content */}
      <motion.div
        className="absolute inset-0 z-[6] bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </section>
  );
}

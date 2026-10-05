"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

export function AmbassadorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"moon" | "character" | "ready">("moon");
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 30 });

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const moonScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.12]);
  const moonY = useTransform(scrollYProgress, [0, 0.6], [0, -25]);
  const characterScrollY = useTransform(scrollYProgress, [0, 0.6], [0, 18]);
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 0.85]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -35]);

  // Subtle 3D parallax on mouse move
  const charSpringX = useTransform(springX, (v) => v * 1.25);

  useEffect(() => {
    setMounted(true);
    // Smooth cinematic sequence:
    // 0ms: Moon background appears below the navbar
    // 250ms: Person begins rising smoothly from downward
    // 1400ms: Title and CTA smoothly glide in
    const t1 = setTimeout(() => setPhase("character"), 250);
    const t2 = setTimeout(() => setPhase("ready"), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      mouseX.set(x);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden bg-black select-none"
    >
      {/* Scene Wrapper: Starts cleanly below the navbar (top-14 sm:top-18) so moon is never cut off */}
      <div className="absolute inset-x-0 top-14 sm:top-18 bottom-0 overflow-hidden">
        {/* Layer 1: Crimson Desert & Blood Moon (Original Untouched Artwork) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: moonScale, y: moonY, x: springX }}
        >
          <motion.img
            src="/images/redmoon1.png"
            alt="TechSrijan Crimson Moon"
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
            priority-component="true"
          />
        </motion.div>

        {/* Layer 2: Atmospheric Red Mist & Glow Behind Person */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] rounded-full bg-red-600/10 blur-[130px] pointer-events-none" />

        {/* Layer 3: Person Rising from Downward (User-provided image.png) */}
        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ y: characterScrollY, x: charSpringX }}
        >
          <motion.img
            src="/images/ambassador-character.png"
            alt="TechSrijan Ambassador"
            className="w-full h-full object-cover object-center"
            initial={{ y: "24%", opacity: 0 }}
            animate={
              phase !== "moon"
                ? { y: "0%", opacity: 1 }
                : { y: "24%", opacity: 0 }
            }
            transition={{
              duration: 1.4, // Normal cinematic duration
              ease: [0.16, 1, 0.3, 1], // Smooth deceleration curve
            }}
            draggable={false}
          />
        </motion.div>

        {/* Layer 4: Lower gradient vignette to ensure high text contrast while keeping moon and character clear */}
        <div className="absolute inset-x-0 bottom-0 h-[48%] sm:h-[42%] z-[3] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
      </div>

      {/* Layer 5: Floating Sand Embers (Client-only to avoid hydration mismatch) */}
      {mounted && (
        <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 4.8 + (i % 5) * 3) % 100;
            const top = (i * 6.5 + 25) % 92;
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
                  y: [0, -28 - (i % 16), 0],
                  x: [0, i % 2 === 0 ? 8 : -8, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 4.8 + (i % 3),
                  repeat: Infinity,
                  delay: (i * 0.35) % 3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Layer 6: Hero Content & Typography (Placed in lower third with high breathing room) */}
      <motion.div
        className="absolute inset-0 z-[5] flex flex-col items-center justify-end pb-[4vh] sm:pb-[5vh] px-4 text-center pointer-events-none"
        style={{ y: titleY }}
      >
        {/* Monogram tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-black/60 backdrop-blur-md mb-2 sm:mb-3 shadow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-red-300 font-semibold">
            TechSrijan&apos;27 — MMMUT Gorakhpur
          </span>
        </motion.div>

        {/* Main Title - Proportioned to sit gracefully without occluding the person's head & shoulders */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-serif text-[clamp(1.9rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
        >
          <span className="block">CAMPUS</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            AMBASSADOR
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={phase === "ready" ? { opacity: 0.9, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-2.5 max-w-md text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          Become the vanguard of Eastern UP&apos;s grandest technical festival.
          Represent your college, lead the revolution, and claim glory.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={phase === "ready" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 font-mono text-xs tracking-[0.2em] uppercase font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-orange-600 transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.45)] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] active:scale-95 border border-red-400/40"
            style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
          >
            <span>Apply Now</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <a
            href="#perks"
            className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-xs tracking-[0.2em] uppercase font-medium text-neutral-300 hover:text-white border border-neutral-700/80 hover:border-red-500/60 bg-black/50 backdrop-blur-md transition-all duration-300 active:scale-95"
            style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
          >
            <span>Explore Perks</span>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase === "ready" ? { opacity: 0.55 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-5 flex flex-col items-center gap-1 text-neutral-400 hover:text-red-400 transition-colors pointer-events-auto"
        >
          <a href="#perks" className="flex flex-col items-center gap-0.5 group">
            <span className="font-mono text-[8px] tracking-[0.3em] uppercase">Scroll to Discover</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-3.5 h-3.5 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

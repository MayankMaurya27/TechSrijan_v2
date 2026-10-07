"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useAmbassadorTheme } from "./ambassador-theme";

export function AmbassadorHero() {
  const t = useAmbassadorTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  // Phase sequence:
  // 1. "moon": Desert background appears, Moon descends smoothly from upward
  // 2. "character": Character materializes from backward in front of the moon
  // 3. "ready": Left title & Right HUD Card glide into position
  const [phase, setPhase] = useState<"moon" | "character" | "ready">("moon");
  const [mounted, setMounted] = useState(false);
  const [isMoonHovered, setIsMoonHovered] = useState(false);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 26 });

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const desertScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.05]);
  const desertY = useTransform(scrollYProgress, [0, 0.6], [0, -15]);
  const moonScrollY = useTransform(scrollYProgress, [0, 0.6], [0, -32]);
  const moonScrollScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);
  const characterScrollY = useTransform(scrollYProgress, [0, 0.6], [0, 16]);
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.8], [0, 0.9]);
  const contentFadeOut = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Layered 3D parallax offsets
  // Distant Moon: moves slightly (0.35x)
  const moonParallaxX = useTransform(springX, (v) => v * 0.35);
  const moonParallaxY = useTransform(springY, (v) => v * 0.35);
  const moonTiltX = useTransform(springY, (v) => -v * 0.6);
  const moonTiltY = useTransform(springX, (v) => v * 0.6);

  // Foreground Character: moves significantly more (0.95x) so character feels forward in space away from moon
  // Shift very little bit left (-6px) so character head aligns perfectly with the center vertical axis
  const charParallaxX = useTransform(springX, (v) => v * 0.95 - 6);
  const charParallaxY = useTransform(springY, (v) => v * 0.65);
  const charTiltY = useTransform(springX, (v) => v * 0.35);

  // UI elements parallax
  const leftSpringX = useTransform(springX, (v) => v * 1.1);
  const rightSpringX = useTransform(springX, (v) => v * -1.0);
  const cardRotateY = useTransform(springX, (v) => v * 0.35);
  const cardRotateX = useTransform(springY, (v) => -v * 0.35);

  useEffect(() => {
    setMounted(true);
    // Smooth cinematic sequence:
    // 0ms: Desert background displays, Moon descends smoothly from upward into the sky
    // 650ms: Character begins materializing from backward in front of the moon
    // 1450ms: Editorial title and HUD Card smoothly glide in together
    const t1 = setTimeout(() => setPhase("character"), 650);
    const t2 = setTimeout(() => setPhase("ready"), 1450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[660px] overflow-hidden bg-black select-none touch-pan-y"
    >
      {/* ========================================================
          FULL-SCREEN SCENE LAYERS (Desert + Moon + Character)
          ======================================================== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1: Desert Landscape without Moon (Image 1) */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ scale: desertScale, y: desertY }}
        >
          <picture className="w-full h-full">
            <source srcSet="/images/ambassador-desert-bg.webp" type="image/webp" />
            <img
              src="/images/ambassador-desert-bg.png"
              alt="TechSrijan Arrakis Crimson Dunes"
              className="w-full h-full object-cover object-bottom"
              draggable={false}
            />
          </picture>
        </motion.div>

        {/* Layer 2: Deep Theme Radial Atmosphere behind Celestial Body */}
        <motion.div
          className={`absolute top-[28%] sm:top-[30%] lg:top-[33%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] lg:w-[680px] h-[340px] sm:h-[520px] lg:h-[680px] rounded-full ${t.moonAtmosphereClass} blur-[90px] sm:blur-[120px] pointer-events-none z-[1] transition-colors duration-700`}
          animate={{
            scale: [1, 1.09, 1],
            opacity: [0.45, 0.72, 0.45],
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ========================================================
            Layer 3: 3D INTERACTIVE CELESTIAL BODY (Blood Moon / Dune Sun / Krelln Moon)
            - Elevated higher in the sky, tucked gracefully under navbar
            - Solid & Opaque rich artwork responding to theme
            - Clean, premium hover glow and subtle scale expansion
            - 3D perspective tilt reacting smoothly to cursor / touch
            ======================================================== */}
        <motion.div
          className="absolute top-[26px] sm:top-[32px] md:top-[36px] lg:top-[40px] left-1/2 -translate-x-1/2 z-[2] flex items-center justify-center pointer-events-auto cursor-pointer"
          style={{
            x: moonParallaxX,
            y: moonScrollY,
            scale: moonScrollScale,
            perspective: 1200,
          }}
          onMouseEnter={() => setIsMoonHovered(true)}
          onMouseLeave={() => setIsMoonHovered(false)}
          title="TechSrijan Celestial Body — Hover to illuminate"
        >
          {/* Main Moon Container with 3D Tilt and Smooth Spawn Animation */}
          <motion.div
            className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[430px] xl:h-[430px] rounded-full flex items-center justify-center"
            style={{
              rotateX: moonTiltX,
              rotateY: moonTiltY,
              transformStyle: "preserve-3d",
            }}
            initial={{ y: -90, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: isMoonHovered ? 1.035 : 1.0,
            }}
            transition={{
              y: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.35, ease: "easeOut" },
            }}
          >
            {/* Solid backing disc to guarantee zero background show-through */}
            <div className="absolute inset-0 rounded-full bg-black pointer-events-none" />

            {/* Outer Luminous Atmospheric Corona Rim */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
              style={{
                boxShadow: isMoonHovered
                  ? t.moonHoverCoronaShadow
                  : t.moonCoronaShadow,
              }}
            />

            {/* High-Resolution Celestial Texture (Themed filter & dynamic glowing aura) */}
            <picture className="w-full h-full pointer-events-none">
              <source srcSet="/images/ambassador-moon.webp" type="image/webp" />
              <img
                src="/images/ambassador-moon.png"
                alt="TechSrijan Celestial Body"
                className="w-full h-full object-contain rounded-full transition-all duration-700"
                style={{
                  filter: isMoonHovered ? t.moonHoverFilter : t.moonFilter,
                }}
                draggable={false}
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* ========================================================
            Layer 4: CHARACTER SPAWN FROM BACKWARD
            - Emerges from backward (depth scale + translateZ + fade)
            - Upper 70-75% visible with feathered bottom leg fade
            - Head centered directly on vertical screen/moon axis
            - Positioned slightly higher for balanced, heroic framing
            ======================================================== */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[4] pointer-events-none flex items-end justify-center"
          style={{
            x: charParallaxX,
            y: characterScrollY,
            perspective: 1000,
          }}
        >
          {/* Character Container: Elevated slightly higher & Balanced */}
          <motion.div
            className="relative w-[260px] sm:w-[340px] md:w-[390px] lg:w-[440px] xl:w-[475px] flex items-end justify-center bottom-5 sm:bottom-7 md:bottom-8 lg:bottom-9"
            style={{
              rotateY: charTiltY,
              transformStyle: "preserve-3d",
              // Silky smooth mask fading the bottom 25-30% from the leg side
              maskImage:
                "linear-gradient(to top, transparent 0%, transparent 6%, rgba(0,0,0,0.4) 14%, black 26%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, transparent 6%, rgba(0,0,0,0.4) 14%, black 26%, black 100%)",
            }}
            initial={{ scale: 0.84, opacity: 0, y: 38 }}
            animate={
              phase !== "moon"
                ? { scale: 1.0, opacity: 1, y: 0 }
                : { scale: 0.84, opacity: 0, y: 38 }
            }
            transition={{
              duration: 1.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Atmospheric Ground Contact Shadow */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-[24px] rounded-[50%] pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.45) 60%, transparent 80%)",
                filter: "blur(10px)",
              }}
            />

            {/* Character Cutout showing Upper 70-75% with Centered Head */}
            <picture className="w-full h-auto flex justify-center">
              <source srcSet="/images/ambassador-character-upper.webp" type="image/webp" />
              <img
                src="/images/ambassador-character-upper.png"
                alt="TechSrijan Campus Ambassador Hero"
                className={`w-full h-auto max-h-[50vh] sm:max-h-[55vh] lg:max-h-[62vh] object-contain object-bottom ${t.characterDropShadow} transition-all duration-700`}
                draggable={false}
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* Layer 5: Bottom Dune Horizon Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 z-[5] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        {/* Layer 6: Atmospheric Lateral Framing Gradients on Desktop */}
        <div className="absolute inset-y-0 left-0 w-[35vw] bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-[5] hidden lg:block" />
        <div className="absolute inset-y-0 right-0 w-[35vw] bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none z-[5] hidden lg:block" />
        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-transparent via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* ========================================================
          FLOATING STARDUST & THEMED EMBERS
          ======================================================== */}
      {mounted && (
        <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 4.6 + (i % 7) * 4.2) % 98;
            const top = (i * 5.4 + 14) % 88;
            const isSecondary = i % 3 === 0;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full transition-colors duration-700"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: isSecondary
                    ? t.embers.secondaryBg
                    : t.embers.primaryBg,
                  boxShadow: isSecondary
                    ? t.embers.secondaryShadow
                    : t.embers.primaryShadow,
                }}
                animate={{
                  y: [0, -30 - (i % 18), 0],
                  x: [0, i % 2 === 0 ? 10 : -10, 0],
                  opacity: [0.15, 0.85, 0.15],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 4.5 + (i % 4),
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
          DESKTOP & LARGE SCREEN COMPOSITION
          - Left: Editorial Title & Gold Accents
          - Center: Clear runway for 3D Moon & Forward Character
          - Right: Futuristic HUD Glass Card with Apply & Explore actions
          ======================================================== */}
      <motion.div
        className="hidden lg:block absolute inset-0 z-[7] pointer-events-none"
        style={{ opacity: contentFadeOut }}
      >
        {/* ----- LEFT OF MOON: EDITORIAL TITLE & ACCENTS ----- */}
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
          {/* Top Line: TECHSRIJAN'27 — MMMUT GORAKHPUR */}
          <div className="flex items-center gap-2 mb-2 xl:mb-3">
            <span
              className="font-mono text-[9px] xl:text-[10px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap transition-colors duration-500"
              style={{ color: t.heroTopDash }}
            >
              TECHSRIJAN&apos;27
            </span>
            <span className="font-mono text-xs opacity-60" style={{ color: t.heroTopDash }}>—</span>
            <span
              className="font-mono text-[9px] xl:text-[10px] tracking-[0.26em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap transition-colors duration-500"
              style={{ color: t.heroTopDash }}
            >
              MMMUT GORAKHPUR
            </span>
            <div
              className="h-[1px] w-12 xl:w-20 ml-1 transition-all duration-500"
              style={{ background: `linear-gradient(to right, ${t.heroTopDash}B3, transparent)` }}
            />
          </div>

          {/* Main Title: CAMPUS AMBASSADOR */}
          <h1 className="font-editorial text-[clamp(2.4rem,3.4vw,4.1rem)] font-extrabold leading-[0.94] tracking-tight whitespace-nowrap">
            <span className="block text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              CAMPUS
            </span>
            <span
              className={`block mt-1 text-transparent bg-clip-text bg-gradient-to-r ${t.heroTitleGradient} drop-shadow-[0_0_35px_${t.accentGlow}] transition-all duration-700`}
            >
              AMBASSADOR
            </span>
          </h1>

          {/* Bottom Theme Dot and Horizontal Line */}
          <div className="mt-3.5 xl:mt-4 flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{ background: t.accent, boxShadow: `0 0 10px ${t.accent}` }}
            />
            <div
              className="h-[1px] w-48 sm:w-64 lg:w-72 xl:w-80 transition-all duration-500"
              style={{
                background: `linear-gradient(to right, ${t.accent}CC, ${t.accent}4D, transparent)`,
              }}
            />
          </div>
        </motion.div>

        {/* ----- RIGHT OF MOON: SCI-FI HUD GLASS CARD ----- */}
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
            className={`group relative p-6 sm:p-7 rounded-sm bg-black/60 backdrop-blur-xl border ${t.hudCardBorder} shadow-[0_16px_50px_rgba(0,0,0,0.85)] transition-all duration-500 ${t.hudCardHoverBorder} ${t.hudCardHoverShadow}`}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
            }}
          >
            {/* Ambient inner gradient glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${t.hudInnerGradient} pointer-events-none transition-colors duration-700`}
            />

            {/* Glowing Corner Notch Accent on Top-Right Chamfer */}
            <div className="absolute top-0 right-0 w-7 h-7 pointer-events-none">
              <svg
                viewBox="0 0 28 28"
                fill="none"
                className="w-full h-full transition-all duration-500"
              >
                <path
                  d="M0 0 L6 0 L28 22 L28 28 Z"
                  fill={t.hudCornerFill}
                />
                <line
                  x1="6"
                  y1="0"
                  x2="28"
                  y2="22"
                  stroke={t.hudCornerSvgStroke}
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Top Themed Dot & Horizontal Line */}
            <div className="relative z-10 flex items-center gap-2.5 mb-4">
              <div className="relative flex items-center justify-center">
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                  style={{ background: t.accent, boxShadow: `0 0 12px ${t.accent}` }}
                />
                <span
                  className="absolute w-5 h-5 rounded-full border animate-ping"
                  style={{ borderColor: `${t.accent}99` }}
                />
              </div>
              <div
                className="h-[1px] w-20 transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${t.accent}CC, transparent)` }}
              />
            </div>

            {/* Headline */}
            <h2 className="relative z-10 font-editorial text-[#FAF6EE] text-lg xl:text-[21px] font-normal leading-[1.32] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Be the vanguard of Eastern UP&apos;s grandest technical festival.
            </h2>

            {/* Description */}
            <p className="relative z-10 mt-3 text-neutral-400 font-sans text-xs sm:text-[13px] font-light leading-relaxed">
              Represent your college, lead the revolution, and claim glory.
            </p>

            {/* Horizontal Divider Line */}
            <div className="relative z-10 my-5 h-[1px] w-full bg-gradient-to-r from-neutral-800 via-neutral-700/60 to-neutral-800" />

            {/* Action Buttons Stack */}
            <div className="relative z-10 flex flex-col gap-3">
              {/* Primary Action: APPLY NOW */}
              <a
                href="#apply"
                className={`group relative overflow-hidden inline-flex items-center justify-center gap-2 w-full py-3 px-5 font-mono text-xs tracking-[0.24em] uppercase font-bold text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} transition-all duration-300 ${t.primaryBtnShadow} ${t.primaryBtnHoverShadow} active:scale-[0.98] border ${t.primaryBtnBorder} rounded-[3px]`}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">APPLY NOW</span>
                <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </a>

              {/* Secondary Action: EXPLORE PERKS */}
              <a
                href="#perks"
                className={`group relative overflow-hidden inline-flex items-center justify-center gap-2 w-full py-3 px-5 font-mono text-xs tracking-[0.24em] uppercase font-medium text-neutral-300 hover:text-white bg-black/40 hover:bg-neutral-900/60 border ${t.secondaryBtnBorder} ${t.secondaryBtnHoverBorder} backdrop-blur-md transition-all duration-300 active:scale-[0.98] rounded-[3px]`}
              >
                <span className="relative z-10">EXPLORE PERKS</span>
                <span
                  className="relative z-10 text-sm text-neutral-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-1.5"
                  style={{ color: undefined }}
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          MOBILE & TABLET ADAPTIVE LAYOUT (< 1024px)
          Seamlessly stacks to preserve full 3D moon and character visibility
          ======================================================== */}
      <motion.div
        className="block lg:hidden absolute inset-0 z-[7] pointer-events-none flex flex-col justify-between pt-20 pb-8 px-4 sm:px-6"
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
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-black/60 backdrop-blur-md mb-2 shadow-lg transition-all duration-500"
            style={{ borderColor: `${t.accent}4D` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: t.accent }}
            />
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-[0.24em] uppercase font-semibold transition-colors duration-500"
              style={{ color: t.heroTopDash }}
            >
              TechSrijan&apos;27 — MMMUT
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold leading-[0.95] tracking-tight">
            <span className="block text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              CAMPUS
            </span>
            <span
              className={`block text-transparent bg-clip-text bg-gradient-to-r ${t.heroTitleGradient} drop-shadow-[0_0_25px_${t.accentGlow}] transition-all duration-700`}
            >
              AMBASSADOR
            </span>
          </h1>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: t.accent }}
            />
            <div
              className="h-[1px] w-24"
              style={{ background: `linear-gradient(to right, ${t.accent}B3, transparent)` }}
            />
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
            className={`p-4 sm:p-5 rounded-sm bg-black/70 backdrop-blur-xl border ${t.hudCardBorder} shadow-[0_12px_40px_rgba(0,0,0,0.9)] transition-all duration-500`}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: t.accent, boxShadow: `0 0 10px ${t.accent}` }}
              />
              <div
                className="h-[1px] w-8"
                style={{ background: `linear-gradient(to right, ${t.accent}B3, transparent)` }}
              />
            </div>

            <p className="font-editorial text-[#FAF6EE] text-sm sm:text-base font-normal leading-snug">
              Be the vanguard of Eastern UP&apos;s grandest technical festival.
            </p>

            <div className="mt-4 flex gap-2.5">
              <a
                href="#apply"
                className={`flex-1 py-2.5 px-3 inline-flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase font-bold text-white ${t.primaryBtnBg} border ${t.primaryBtnBorder} ${t.primaryBtnShadow} active:scale-95 rounded-[3px] transition-all duration-300`}
              >
                <span>APPLY NOW</span>
                <span>→</span>
              </a>

              <a
                href="#perks"
                className={`flex-1 py-2.5 px-3 inline-flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase font-medium text-neutral-300 hover:text-white bg-black/50 border ${t.secondaryBtnBorder} active:scale-95 rounded-[3px] transition-all duration-300`}
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
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[8] pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={phase === "ready" ? { opacity: 0.6 } : {}}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ opacity: contentFadeOut }}
      >
        <a
          href="#perks"
          className="flex flex-col items-center gap-1 group text-neutral-400 hover:text-white transition-colors"
        >
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] uppercase">
            Scroll to Discover
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-3.5 h-3.5 transition-colors duration-500"
              style={{ color: t.accent }}
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
        className="absolute inset-0 z-[9] bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </section>
  );
}

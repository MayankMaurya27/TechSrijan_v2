"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { FileText, ShieldCheck, Zap, Trophy } from "lucide-react";
import { useAmbassadorTheme } from "./ambassador-theme";

interface JourneyStep {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Register",
    description:
      "Fill out the application form with your college details. Open to students from any recognized university.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Get Verified",
    description:
      "Our team reviews your application within 48 hours. Receive your official CA ID, welcome kit, and portal access.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Complete Missions",
    description:
      "Take on campus outreach, event promotion, and creative tasks to earn points, unlock milestones, and boost your campus ranking.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Lead & Earn",
    description:
      "Climb the ranks to unlock free event passes, exclusive merchandise, cash rewards, and an official LOR from MMMUT.",
    icon: Trophy,
  },
];

export function AmbassadorJourney() {
  const t = useAmbassadorTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Scroll-linked glowing laser progress:
  // Starts when the timeline enters the comfortable view band (65%) and tracks to completion
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 65%"],
  });

  // Snappy, low-mass spring (0.1 mass, 450 stiffness):
  // Eliminates all CSS transition conflicts and lag, moving the circle in real-time with the scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 450,
    damping: 38,
    mass: 0.1,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Moderated Lenis scroll speed when inside the Journey section for optimal UX
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const updateLenisSpeed = () => {
      const lenis = window.__lenis as any;
      if (!lenis) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;

      if (inView) {
        // Moderated wheel multiplier (0.55) so the user experiences the journey at a steady, controlled pace
        if (lenis.options) lenis.options.wheelMultiplier = 0.55;
        if (lenis.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 0.55;
        }
      } else {
        // Restore standard full-speed scrolling outside this section
        if (lenis.options) lenis.options.wheelMultiplier = 1.05;
        if (lenis.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 1.05;
        }
      }
    };

    window.addEventListener("scroll", updateLenisSpeed, { passive: true });
    updateLenisSpeed();

    return () => {
      window.removeEventListener("scroll", updateLenisSpeed);
      const lenis = window.__lenis as any;
      if (lenis) {
        if (lenis.options) lenis.options.wheelMultiplier = 1.05;
        if (lenis.virtualScroll?.options) {
          lenis.virtualScroll.options.wheelMultiplier = 1.05;
        }
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 bg-black overflow-hidden select-none"
    >
      {/* Ambient Theme Radial Bloom */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] ${t.journeyNodeBloom} blur-[160px] rounded-full pointer-events-none transition-colors duration-500`}
      />

      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none transition-all duration-500"
        style={{
          backgroundImage: `radial-gradient(${t.accent} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ========================================================
            SECTION HEADER: Clean & Impactful (No pill badge)
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl tracking-wider uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            YOUR{" "}
            <span
              className={`${t.journeyHeaderGradient} drop-shadow-[0_0_35px_${t.accentGlow}] transition-colors duration-500`}
            >
              JOURNEY
            </span>
          </h2>
          <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-neutral-400 font-geist leading-relaxed">
            Four steps from application to campus legend.
          </p>
        </motion.div>

        {/* ========================================================
            TIMELINE TRACK & SCROLL-LINKED CIRCLE LINE (Image 2)
            ======================================================== */}
        <div ref={timelineRef} className="relative">
          {/* Base Guide Track: Dim Line */}
          <div
            className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 rounded-full pointer-events-none transition-colors duration-500"
            style={{ background: `${t.accent}26` }}
          />

          {/* Active Glowing Laser Line with Concentric Circle End (Image 2) driven by scroll */}
          <div className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-[3px] -translate-x-1/2 pointer-events-none z-10 overflow-visible">
            <motion.div
              style={{ height: lineHeight }}
              className={`relative w-full rounded-full bg-gradient-to-b ${t.journeyLaserGradient} ${t.journeyLaserShadow}`}
            >
              {/* Concentric Circle Tracer Head matching Image 2 */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
                {/* Outer Ambient Glow */}
                <div
                  className="absolute w-12 h-12 rounded-full blur-[10px] pointer-events-none opacity-80"
                  style={{ background: t.accent }}
                />

                {/* Outer Ring (Image 2) */}
                <div
                  className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: `${t.accent}65`,
                    boxShadow: `0 0 12px ${t.accent}45`,
                    background: "rgba(0, 0, 0, 0.45)",
                  }}
                >
                  {/* Middle Ring (Image 2) */}
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: `${t.accent}B5`,
                      boxShadow: `0 0 8px ${t.accent}70`,
                    }}
                  >
                    {/* Inner Solid Glowing Core (Image 2) */}
                    <div
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white flex items-center justify-center"
                      style={{
                        boxShadow: `0 0 8px #FFFFFF, 0 0 16px ${t.accent}`,
                      }}
                    >
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ======================================================
              STEPS LIST: Glowing Neon Badges + Concise Modern Cards
              ====================================================== */}
          <div className="space-y-14 sm:space-y-20 lg:space-y-24">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.12 * i + 0.15,
                  }}
                  className={`relative flex flex-col sm:flex-row items-center ${
                    !isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* ------------------------------------------------
                      THEMED NEON NUMBER NODE (Glowing Beacon)
                      ------------------------------------------------ */}
                  <div className="absolute left-[28px] sm:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group cursor-pointer">
                      {/* Intense Radial Ambient Bloom */}
                      <div
                        className={`absolute inset-0 rounded-full ${t.journeyNodeBloom} blur-lg animate-pulse pointer-events-none transition-colors duration-500`}
                      />
                      <div
                        className={`absolute -inset-1 rounded-full bg-gradient-to-br ${t.journeyNodeGlowGradient} opacity-80 blur-sm pointer-events-none transition-all duration-500`}
                      />

                      {/* Outer Rotating Sci-Fi Reticle Ring */}
                      <div
                        className={`absolute -inset-2 rounded-full border border-dashed ${t.journeyNodeReticleBorder} animate-[spin_20s_linear_infinite] pointer-events-none transition-colors duration-500`}
                      />

                      {/* Glowing Core Badge */}
                      <div
                        className={`relative w-full h-full rounded-full border-2 ${t.journeyNodeBorder} bg-gradient-to-b ${t.journeyNodeBg} flex items-center justify-center ${t.journeyNodeShadow} transition-all duration-300 group-hover:scale-110`}
                      >
                        {/* Technical Crosshairs */}
                        <span
                          className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 ${t.journeyCrosshairs}`}
                        />
                        <span
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 ${t.journeyCrosshairs}`}
                        />
                        <span
                          className={`absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 ${t.journeyCrosshairs}`}
                        />
                        <span
                          className={`absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 ${t.journeyCrosshairs}`}
                        />

                        {/* Number Text */}
                        <span className="font-mono text-base sm:text-lg font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                          {step.number}
                        </span>
                      </div>

                      {/* Orbiting Theme Beacon Dot */}
                      <span
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white/70 transition-all duration-500"
                        style={{
                          background: t.accent,
                          boxShadow: `0 0 8px ${t.accent}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* ------------------------------------------------
                      CARD CONTAINER: Concise, Human-written & Clean
                      ------------------------------------------------ */}
                  <div
                    className={`ml-16 w-[calc(100%-64px)] sm:ml-0 sm:w-[calc(50%-44px)] lg:w-[calc(50%-56px)] ${
                      isEven ? "sm:mr-auto" : "sm:ml-auto"
                    }`}
                  >
                    <div
                      className={`relative p-5 sm:p-7 rounded-lg border ${t.journeyCardBorder} bg-gradient-to-br from-[#140406]/90 via-[#0B0204]/95 to-black/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] ${t.journeyCardHoverBorder} ${t.journeyCardHoverShadow} transition-all duration-300 group overflow-hidden`}
                    >
                      {/* Tech Corner Brackets */}
                      <div
                        className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 ${t.journeyCardCornerBracket} transition-colors duration-500`}
                      />
                      <div
                        className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 ${t.journeyCardCornerBracket} transition-colors duration-500`}
                      />
                      <div
                        className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 ${t.journeyCardCornerBracket} transition-colors duration-500`}
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 ${t.journeyCardCornerBracket} transition-colors duration-500`}
                      />

                      {/* Title & Icon Header */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3
                          className={`font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase leading-tight group-hover:${t.accentTextClass} transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
                        >
                          {step.title}
                        </h3>

                        <div
                          className={`w-7 h-7 rounded-md ${t.journeyIconBoxBg} border ${t.journeyIconBoxBorder} flex items-center justify-center ${t.journeyIconColor} transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] shrink-0`}
                        >
                          <step.icon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Concise, Human-written Description (Geist Sans) */}
                      <p className="text-xs sm:text-sm text-neutral-300 font-geist leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

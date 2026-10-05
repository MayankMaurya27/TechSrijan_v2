"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { FileText, ShieldCheck, Zap, Trophy } from "lucide-react";

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
      "Take on campus outreach, event promotion, and creative tasks to earn points on the live leaderboard.",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Scroll-linked glowing bloody red laser progress
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 75%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden select-none"
    >
      {/* Ambient Sci-Fi Radial Bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-red-950/15 blur-[160px] rounded-full pointer-events-none" />

      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,42,54,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* ========================================================
            SECTION HEADER: Clean & Impactful (No pill badge)
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-11"
        >
          <h2 className="font-impact text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            YOUR{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              JOURNEY
            </span>
          </h2>
          <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Four steps from application to campus legend.
          </p>
        </motion.div>

        {/* ========================================================
            TIMELINE TRACK & SCROLL-LINKED BLOODY RED NEON LASER
            ======================================================== */}
        <div ref={timelineRef} className="relative">
          
          {/* Base Guide Track: Dim Crimson Line */}
          <div className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-[2px] bg-red-950/40 -translate-x-1/2 rounded-full pointer-events-none" />

          {/* Active Glowing Bloody Red Laser Line driven by scroll */}
          <div className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-[3px] -translate-x-1/2 pointer-events-none z-10 overflow-visible">
            <motion.div
              style={{ height: lineHeight }}
              className="relative w-full rounded-full bg-gradient-to-b from-[#800000] via-[#DC2626] to-[#FF1E27] shadow-[0_0_14px_#FF1E27,0_0_28px_rgba(255,30,39,0.9),0_0_45px_rgba(220,38,38,0.7)]"
            >
              {/* Blooming laser spark at the leading tip of the glowing line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_24px_#FF1E27,0_0_48px_#FF1E27] z-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/80 animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </motion.div>
          </div>

          {/* ======================================================
              STEPS LIST: Glowing Neon Badges + Concise Modern Cards
              ====================================================== */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
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
                      NEON BLOODY RED NUMBER NODE (Glowing Beacon)
                      ------------------------------------------------ */}
                  <div className="absolute left-[28px] sm:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group cursor-pointer">
                      
                      {/* Intense Radial Bloody Red Ambient Bloom */}
                      <div className="absolute inset-0 rounded-full bg-[#FF1E27]/40 blur-lg animate-pulse pointer-events-none" />
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#FF1E27] via-[#DC2626] to-[#7F0909] opacity-80 blur-sm pointer-events-none" />

                      {/* Outer Rotating Sci-Fi Reticle Ring */}
                      <div className="absolute -inset-2 rounded-full border border-dashed border-red-500/50 animate-[spin_20s_linear_infinite] pointer-events-none" />

                      {/* Bloody Red Glowing Core Badge */}
                      <div className="relative w-full h-full rounded-full border-2 border-[#FF1E27] bg-gradient-to-b from-[#1E0407] via-[#0E0102] to-black flex items-center justify-center shadow-[0_0_20px_rgba(255,30,39,0.95),inset_0_0_12px_rgba(220,38,38,0.7)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,30,39,1)]">
                        {/* Technical Crosshairs */}
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />

                        {/* Number Text: Bold, Crisp, Bloody Red Glow */}
                        <span className="font-mono text-base sm:text-lg font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,42,54,1)]">
                          {step.number}
                        </span>
                      </div>

                      {/* Orbiting Red Beacon Dot */}
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#FF1E27] border border-white/70" />
                    </div>
                  </div>

                  {/* ------------------------------------------------
                      CARD CONTAINER: Concise, Human-written & Clean
                      ------------------------------------------------ */}
                  <div
                    className={`ml-16 w-[calc(100%-64px)] sm:ml-0 sm:w-[calc(50%-48px)] ${
                      isEven ? "sm:mr-auto" : "sm:ml-auto"
                    }`}
                  >
                    <div className="relative p-5 sm:p-6 rounded-lg border border-red-500/25 bg-gradient-to-br from-[#140406]/90 via-[#0B0204]/95 to-black/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] hover:border-red-500/60 hover:shadow-[0_0_28px_rgba(220,38,38,0.25)] transition-all duration-300 group overflow-hidden">
                      
                      {/* Tech Corner Brackets */}
                      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500/60" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-red-500/60" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-red-500/60" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-red-500/60" />

                      {/* Title & Icon Header */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-impact text-xl sm:text-2xl text-white tracking-wide uppercase leading-tight group-hover:text-red-400 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          {step.title}
                        </h3>

                        <div className="w-7 h-7 rounded-md bg-red-950/50 border border-red-500/25 flex items-center justify-center text-red-400/90 group-hover:text-white group-hover:border-red-500/60 transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.15)] shrink-0">
                          <step.icon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Concise, Human-written Description */}
                      <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed">
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

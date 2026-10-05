"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { FileText, ShieldCheck, Zap, Trophy } from "lucide-react";

interface JourneyStep {
  number: string;
  phase: string;
  title: string;
  tagline: string;
  description: string;
  perks: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: JourneyStep[] = [
  {
    number: "01",
    phase: "PHASE 01 // ENLISTMENT",
    title: "Register & Deploy",
    tagline: "Begin Your Vanguard Dossier",
    description:
      "Submit your student credentials and college affiliation through the encrypted Vanguard portal. Open to ambitious innovators across B.Tech, BCA, MCA, and M.Tech from all recognized institutions.",
    perks: ["Instant Portal Access", "Digital Dossier ID", "Zero Fee Application"],
    icon: FileText,
  },
  {
    number: "02",
    phase: "PHASE 02 // CLEARANCE",
    title: "Verification & Kit Delivery",
    tagline: "48-Hour Rapid Review",
    description:
      "Our core operations team reviews and validates your application within 48 hours. Receive your official CA credentials, exclusive Vanguard ambassador kit, and dedicated coordinator link.",
    perks: ["Official CA ID Card", "Physical Welcome Kit", "Operations Briefing"],
    icon: ShieldCheck,
  },
  {
    number: "03",
    phase: "PHASE 03 // OPERATIONS",
    title: "Execute Gamified Missions",
    tagline: "Earn Live XP on the Grid",
    description:
      "Take charge of high-impact missions across campus outreach, hackathon mobilization, workshop registrations, and digital engagement. Each milestone unlocks XP and boosts your live rank.",
    perks: ["Live Points Multiplier", "Weekly Sprint Bounties", "Leaderboard Surge"],
    icon: Zap,
  },
  {
    number: "04",
    phase: "PHASE 04 // ASCENSION",
    title: "Lead, Ascend & Reap Rewards",
    tagline: "The Pinnacle of Campus Leadership",
    description:
      "Climb to the summit of Eastern UP's biggest tech network. Secure paid internship leads, VIP festival access, exclusive branded merchandise, cash awards, and an official LOR directly from MMMUT.",
    perks: ["Official LOR & Certificate", "VIP Event Passes", "Sponsor Internships"],
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-red-950/15 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,42,54,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* ========================================================
            SECTION HEADER: Bold, Modern & Tactical
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          {/* Cyber Overline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 mb-3 shadow-[0_0_14px_rgba(220,38,38,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-red-400">
              TRAJECTORY PROTOCOL // 4 PHASES
            </span>
          </div>

          <h2 className="font-impact text-4xl sm:text-6xl lg:text-7xl tracking-wide uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            YOUR{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              JOURNEY
            </span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed">
            Four calibrated phases from initial enlistment to campus legend. Follow
            the verified pathway to earn recognition, rewards, and leadership status.
          </p>
        </motion.div>

        {/* ========================================================
            TIMELINE TRACK & SCROLL-LINKED BLOODY RED NEON LASER
            ======================================================== */}
        <div ref={timelineRef} className="relative">
          
          {/* Base Guide Track: Dim Crimson Line */}
          <div className="absolute left-[28px] sm:left-1/2 top-6 bottom-6 w-[2px] bg-red-950/40 -translate-x-1/2 rounded-full pointer-events-none" />

          {/* Active Glowing Bloody Red Laser Line driven by scroll */}
          <div className="absolute left-[28px] sm:left-1/2 top-6 bottom-6 w-[3px] -translate-x-1/2 pointer-events-none z-10 overflow-visible">
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
              STEPS LIST: Glowing Neon Badges + Modern HUD Cards
              ====================================================== */}
          <div className="space-y-10 sm:space-y-14 lg:space-y-16">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 35 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 * i + 0.15,
                  }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    !isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* ------------------------------------------------
                      NEON BLOODY RED NUMBER NODE (Glowing Beacon)
                      ------------------------------------------------ */}
                  <div className="absolute left-[28px] sm:left-1/2 -translate-x-1/2 top-4 sm:top-6 z-20">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group cursor-pointer">
                      
                      {/* Intense Radial Bloody Red Ambient Bloom */}
                      <div className="absolute inset-0 rounded-full bg-[#FF1E27]/40 blur-xl animate-pulse pointer-events-none" />
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#FF1E27] via-[#DC2626] to-[#7F0909] opacity-80 blur-md pointer-events-none" />

                      {/* Outer Rotating Sci-Fi Reticle Ring */}
                      <div className="absolute -inset-2 rounded-full border border-dashed border-red-500/60 animate-[spin_20s_linear_infinite] pointer-events-none" />

                      {/* Bloody Red Glowing Core Badge */}
                      <div className="relative w-full h-full rounded-full border-2 border-[#FF1E27] bg-gradient-to-b from-[#1E0407] via-[#0E0102] to-black flex items-center justify-center shadow-[0_0_22px_rgba(255,30,39,0.95),inset_0_0_14px_rgba(220,38,38,0.7)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(255,30,39,1),inset_0_0_20px_rgba(255,42,54,0.9)]">
                        {/* Technical Crosshairs */}
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-2 bg-red-400 shadow-[0_0_6px_#FF1E27]" />
                        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-2 bg-red-400 shadow-[0_0_6px_#FF1E27]" />

                        {/* Number Text: Bold, Crisp, Bloody Red Glow */}
                        <span className="font-mono text-lg sm:text-xl font-black text-white tracking-widest drop-shadow-[0_0_12px_rgba(255,42,54,1)]">
                          {step.number}
                        </span>
                      </div>

                      {/* Orbiting Red Beacon Dot */}
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#FF1E27] border border-white/70" />
                    </div>
                  </div>

                  {/* ------------------------------------------------
                      CARD CONTAINER: Modern, Large, Prominent Heading
                      ------------------------------------------------ */}
                  <div
                    className={`ml-20 w-[calc(100%-80px)] sm:ml-0 sm:w-[calc(50%-52px)] ${
                      isEven ? "sm:mr-auto" : "sm:ml-auto"
                    }`}
                  >
                    <div className="relative p-6 sm:p-7 rounded-xl border border-red-500/30 bg-gradient-to-br from-[#160407]/90 via-[#0B0204]/95 to-black/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] hover:border-red-500/75 hover:shadow-[0_0_35px_rgba(220,38,38,0.35)] transition-all duration-500 group overflow-hidden">
                      
                      {/* Tech Corner Brackets */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/70" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/70" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/70" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/70" />

                      {/* Header Row: Phase Tag + Icon Badge */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] animate-pulse" />
                          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-red-400 drop-shadow-[0_0_6px_rgba(255,42,54,0.6)]">
                            {step.phase}
                          </span>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:text-white group-hover:border-red-500 group-hover:bg-red-600/30 transition-all duration-300 shadow-[0_0_12px_rgba(220,38,38,0.2)]">
                          <step.icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Main Title: Proper, Modern & Prominent */}
                      <h3 className="font-impact text-2xl sm:text-3xl lg:text-[2rem] text-white tracking-wide uppercase leading-tight group-hover:text-red-100 transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        {step.title}
                      </h3>

                      {/* Sub-tagline */}
                      <p className="mt-1 text-xs sm:text-sm font-mono tracking-wider uppercase text-red-400/90 font-medium">
                        {step.tagline}
                      </p>

                      {/* Description: Highly Readable & Engaging */}
                      <p className="mt-3 text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed">
                        {step.description}
                      </p>

                      {/* Milestones / Perks Badges */}
                      <div className="mt-5 pt-4 border-t border-red-900/30 flex flex-wrap gap-2">
                        {step.perks.map((perk) => (
                          <span
                            key={perk}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#1B0508]/80 border border-red-500/25 text-xs font-mono font-medium text-neutral-200 group-hover:border-red-500/40 transition-colors shadow-[inset_0_0_8px_rgba(220,38,38,0.15)]"
                          >
                            <span className="text-[#FF2A36] font-bold text-xs">✓</span>
                            <span>{perk}</span>
                          </span>
                        ))}
                      </div>

                      {/* Ambient Bottom Glow */}
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-600/10 blur-2xl rounded-full pointer-events-none group-hover:bg-red-600/20 transition-all duration-500" />
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

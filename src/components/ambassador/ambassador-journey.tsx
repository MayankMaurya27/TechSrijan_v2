"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Register",
    description:
      "Fill out the application form with your college details. Registration is open to all B.Tech, BCA, MCA, M.Tech students from any recognized institution.",
    accent: "from-red-500 to-orange-500",
  },
  {
    number: "02",
    title: "Get Verified",
    description:
      "Our team reviews your application within 48 hours. Receive your official CA ID, welcome kit, and access to the exclusive Ambassador portal.",
    accent: "from-orange-500 to-amber-500",
  },
  {
    number: "03",
    title: "Complete Missions",
    description:
      "Complete gamified tasks across marketing, design, outreach, and content creation. Each task earns you points on the live leaderboard.",
    accent: "from-amber-500 to-yellow-500",
  },
  {
    number: "04",
    title: "Lead & Earn",
    description:
      "Climb the leaderboard, unlock exclusive rewards, earn your certificate and LOR, and represent MMMUT at the grandest tech fest of Eastern UP.",
    accent: "from-yellow-500 to-red-500",
  },
];

export function AmbassadorJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden"
    >
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Journey
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            Four steps from application to campus legend.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/40 via-red-500/20 to-transparent sm:-translate-x-px" />

          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15 * i + 0.3,
                }}
                className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 ${
                  i % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Number node */}
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 z-10">
                  <div className="relative w-[45px] h-[45px] flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.accent} opacity-20 blur-sm`} />
                    <div className="relative w-[45px] h-[45px] rounded-full border border-red-500/40 bg-black flex items-center justify-center">
                      <span className="font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-400">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`ml-[60px] sm:ml-0 sm:w-[calc(50%-40px)] ${
                    i % 2 === 0 ? "sm:pr-4" : "sm:pl-4"
                  }`}
                >
                  <div className="p-5 sm:p-6 rounded-sm border border-white/[0.06] bg-white/[0.02] hover:border-red-500/20 transition-all duration-500">
                    <h3 className="text-white text-lg sm:text-xl font-semibold tracking-tight font-sans">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-neutral-400 text-sm leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

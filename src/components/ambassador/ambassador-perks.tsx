"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Users, Trophy, Star, Zap, Shield, Award } from "lucide-react";

const PERKS = [
  {
    icon: Award,
    title: "Certificate & LOR",
    description:
      "Receive an official Certificate of Recognition and Letter of Recommendation from TechSrijan, MMMUT Gorakhpur.",
  },
  {
    icon: Users,
    title: "Exclusive Network",
    description:
      "Join a network of 200+ Campus Ambassadors from 50+ colleges across Eastern UP, Bihar, Jharkhand and beyond.",
  },
  {
    icon: Trophy,
    title: "Leaderboard Rewards",
    description:
      "Top-performing ambassadors receive exclusive merchandise, free event passes, and special recognition at the fest.",
  },
  {
    icon: Zap,
    title: "Leadership Growth",
    description:
      "Sharpen your event management, public speaking, and marketing skills. Real experience that transforms your resume.",
  },
  {
    icon: Shield,
    title: "Mentorship Access",
    description:
      "Direct mentorship from TechSrijan core team members and access to exclusive workshops on campus branding.",
  },
  {
    icon: Star,
    title: "Priority Internships",
    description:
      "High-performing CAs receive priority referrals for internship opportunities at our sponsor companies.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function AmbassadorPerks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top crimson bleed */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Why Become an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Ambassador
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            More than a title. A launchpad for your career, a badge of leadership,
            and your gateway into Eastern UP&apos;s biggest tech movement.
          </p>
        </motion.div>

        {/* Perks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                variants={cardVariants}
                className="group relative p-6 sm:p-7 rounded-sm border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-red-500/20 transition-all duration-500"
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-red-500/30 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-red-500/30 pointer-events-none" />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded bg-red-600/10 border border-red-500/20 group-hover:bg-red-600/20 group-hover:border-red-500/40 transition-all duration-500">
                    <Icon className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white text-sm sm:text-base font-semibold tracking-tight font-sans">
                      {perk.title}
                    </h3>
                    <p className="mt-1.5 text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
                      {perk.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

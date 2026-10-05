"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

const TARGET_COLLEGES = [
  // MMMUT & Gorakhpur
  {
    name: "MMMUT Gorakhpur",
    full: "Madan Mohan Malaviya University of Technology",
    city: "Gorakhpur",
    tier: "host" as const,
  },
  // Eastern UP Engineering Colleges
  {
    name: "BIT Gorakhpur",
    full: "Buddha Institute of Technology",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "KIPM Gorakhpur",
    full: "KIPM College of Engineering and Technology",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "ITM Gorakhpur",
    full: "Institute of Technology and Management",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "DDU Gorakhpur",
    full: "Deen Dayal Upadhyaya Gorakhpur University",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  // Broader UP & Nearby
  {
    name: "KNIT Sultanpur",
    full: "Kamala Nehru Institute of Technology",
    city: "Sultanpur",
    tier: "secondary" as const,
  },
  {
    name: "HBTU Kanpur",
    full: "Harcourt Butler Technical University",
    city: "Kanpur",
    tier: "secondary" as const,
  },
  {
    name: "MNNIT Allahabad",
    full: "Motilal Nehru National Institute of Technology",
    city: "Prayagraj",
    tier: "secondary" as const,
  },
  {
    name: "IET Lucknow",
    full: "Institute of Engineering and Technology",
    city: "Lucknow",
    tier: "secondary" as const,
  },
  {
    name: "BHU (IIT BHU)",
    full: "Indian Institute of Technology (BHU)",
    city: "Varanasi",
    tier: "secondary" as const,
  },
  {
    name: "NIET Greater Noida",
    full: "Noida Institute of Engineering and Technology",
    city: "Greater Noida",
    tier: "secondary" as const,
  },
  {
    name: "BBDNITM Lucknow",
    full: "Babu Banarasi Das Northern India Institute of Technology",
    city: "Lucknow",
    tier: "secondary" as const,
  },
  // Bihar & Jharkhand
  {
    name: "NIT Patna",
    full: "National Institute of Technology Patna",
    city: "Patna",
    tier: "secondary" as const,
  },
  {
    name: "BIT Mesra",
    full: "Birla Institute of Technology",
    city: "Ranchi",
    tier: "secondary" as const,
  },
  {
    name: "Chandigarh University",
    full: "Chandigarh University",
    city: "Mohali",
    tier: "secondary" as const,
  },
];

const TIER_LABELS = {
  host: { label: "HOST", color: "text-red-400 border-red-500/40 bg-red-600/10" },
  primary: { label: "GORAKHPUR", color: "text-orange-400 border-orange-500/30 bg-orange-600/8" },
  secondary: { label: "REGIONAL", color: "text-amber-400/70 border-amber-500/20 bg-amber-600/5" },
};

export function AmbassadorColleges() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [showAll, setShowAll] = useState(false);

  const displayColleges = showAll ? TARGET_COLLEGES : TARGET_COLLEGES.slice(0, 8);

  return (
    <section
      ref={ref}
      className="relative py-14 sm:py-18 lg:py-20 bg-black overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-900/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Target{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Colleges
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            We&apos;re building a network across Eastern UP, Bihar, Jharkhand and beyond.
            Represent your campus at TechSrijan&apos;27.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12 sm:mb-16"
        >
          {[
            { value: "50+", label: "Colleges" },
            { value: "200+", label: "Ambassadors" },
            { value: "5", label: "States" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-500">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* College Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayColleges.map((college, i) => {
            const tier = TIER_LABELS[college.tier];
            return (
              <motion.div
                key={college.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.05 * i + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-4 sm:p-5 rounded-sm border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04] hover:border-red-500/20 transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] tracking-[0.2em] uppercase border ${tier.color}`}>
                    {tier.label}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0 mt-0.5" />
                </div>
                <h3 className="text-white text-sm font-semibold tracking-tight font-sans mt-2">
                  {college.name}
                </h3>
                <p className="text-neutral-500 text-[11px] leading-snug font-sans mt-1 line-clamp-2">
                  {college.full}
                </p>
                <p className="text-neutral-600 text-[10px] font-mono tracking-wider uppercase mt-1.5">
                  {college.city}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Show more / less toggle */}
        {TARGET_COLLEGES.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-8"
          >
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-all duration-300"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  View All Colleges <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

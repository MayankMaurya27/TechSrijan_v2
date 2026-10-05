"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

const TARGET_COLLEGES = [
  // Gorakhpur (Host & Local Engineering Colleges)
  {
    name: "MMMUT Gorakhpur",
    full: "Madan Mohan Malaviya University of Technology",
    city: "Gorakhpur",
    tier: "host" as const,
  },
  {
    name: "KIPM Gorakhpur",
    full: "KIPM College of Engineering and Technology",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "BIT Gorakhpur",
    full: "Buddha Institute of Technology, GIDA",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "ITM Gorakhpur",
    full: "Institute of Technology and Management, GIDA",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "UIET DDU Gorakhpur",
    full: "Institute of Engineering & Technology, DDUGU",
    city: "Gorakhpur",
    tier: "primary" as const,
  },
  {
    name: "Suyash Institute (SIIT)",
    full: "Suyash Institute of Information Technology",
    city: "Gorakhpur",
    tier: "primary" as const,
  },

  // Nearby Eastern UP Engineering Colleges (Strictly No IIT, NIT, IIIT)
  {
    name: "REC Azamgarh",
    full: "Rajkiya Engineering College, Azamgarh",
    city: "Azamgarh",
    tier: "secondary" as const,
  },
  {
    name: "REC Ambedkar Nagar",
    full: "Rajkiya Engineering College, Ambedkar Nagar",
    city: "Ambedkar Nagar",
    tier: "secondary" as const,
  },
  {
    name: "KNIT Sultanpur",
    full: "Kamla Nehru Institute of Technology",
    city: "Sultanpur",
    tier: "secondary" as const,
  },
  {
    name: "UNSIET VBSPU Jaunpur",
    full: "Uma Nath Singh Institute of Engineering & Technology",
    city: "Jaunpur",
    tier: "secondary" as const,
  },
  {
    name: "Prasad Institute (PIT)",
    full: "Prasad Institute of Technology",
    city: "Jaunpur",
    tier: "secondary" as const,
  },
  {
    name: "Ashoka Institute (AITM)",
    full: "Ashoka Institute of Technology and Management",
    city: "Varanasi",
    tier: "secondary" as const,
  },
  {
    name: "Kashi Institute (KIT)",
    full: "Kashi Institute of Technology",
    city: "Varanasi",
    tier: "secondary" as const,
  },
  {
    name: "SMS Institute of Tech",
    full: "School of Management Sciences (Technical Campus)",
    city: "Varanasi",
    tier: "secondary" as const,
  },
  {
    name: "REC Sonbhadra",
    full: "Rajkiya Engineering College, Sonbhadra",
    city: "Sonbhadra",
    tier: "secondary" as const,
  },
  {
    name: "BBDITM Lucknow",
    full: "Babu Banarasi Das Northern India Institute of Technology",
    city: "Lucknow",
    tier: "secondary" as const,
  },
];

const TIER_LABELS = {
  host: {
    label: "HOST UNIVERSITY",
    color: "text-red-400 border-red-500/50 bg-red-950/40 shadow-[0_0_12px_rgba(255,30,39,0.3)]",
  },
  primary: {
    label: "GORAKHPUR",
    color: "text-red-400/90 border-red-500/30 bg-red-950/25",
  },
  secondary: {
    label: "EASTERN UP",
    color: "text-red-300/80 border-red-500/20 bg-red-950/15",
  },
};

export function AmbassadorColleges() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [showAll, setShowAll] = useState(false);

  const displayColleges = showAll ? TARGET_COLLEGES : TARGET_COLLEGES.slice(0, 8);

  return (
    <section
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden select-none"
    >
      {/* Ambient bloody red glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-950/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* ========================================================
            SECTION HEADER: Matches "YOUR JOURNEY" Aesthetic
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-impact text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            TARGET{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              COLLEGES
            </span>
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Represent your engineering campus at TechSrijan&apos;27. Connect with
            peers across Gorakhpur and Eastern UP.
          </p>
        </motion.div>

        {/* Stats bar (States removed, strictly focused metrics) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-10 sm:mb-12"
        >
          {[
            { value: "25+", label: "Campus Hubs" },
            { value: "250+", label: "Ambassadors" },
            { value: "10K+", label: "Student Network" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-impact text-3xl sm:text-4xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FF2A36] to-[#DC2626] drop-shadow-[0_0_15px_rgba(255,42,54,0.5)]">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Colleges grid in Bloody Red theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayColleges.map((college, i) => {
            const tierInfo = TIER_LABELS[college.tier];
            return (
              <motion.div
                key={college.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.04 * i + 0.15 }}
                className="group relative p-5 rounded-lg border border-red-500/20 bg-gradient-to-br from-[#140406]/90 via-[#0B0203]/95 to-black/95 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`font-mono text-[9px] font-bold tracking-[0.2em] px-2 py-0.5 rounded border ${tierInfo.color}`}
                    >
                      {tierInfo.label}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
                      <MapPin className="w-2.5 h-2.5 text-red-500" />
                      {college.city}
                    </span>
                  </div>
                  <h3 className="font-impact text-lg sm:text-xl text-white tracking-wide uppercase group-hover:text-red-400 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {college.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2">
                    {college.full}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expand / Collapse Button */}
        {TARGET_COLLEGES.length > 8 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm font-mono text-xs tracking-[0.2em] uppercase text-white border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 hover:border-red-500/70 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
            >
              <span>
                {showAll
                  ? "Show Less"
                  : `View All (${TARGET_COLLEGES.length}) Colleges`}
              </span>
              {showAll ? (
                <ChevronUp className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-red-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

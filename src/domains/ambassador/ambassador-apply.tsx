"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AmbassadorModal } from "./ambassador-modal";
import { useAmbassadorTheme } from "./ambassador-theme";

export function AmbassadorApply() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useAmbassadorTheme();

  // Global trigger listener
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener("open-ambassador-modal", handleOpen);

    if (window.location.hash === "#apply") {
      setIsModalOpen(true);
    }

    return () => {
      window.removeEventListener("open-ambassador-modal", handleOpen);
    };
  }, []);

  return (
    <section
      id="apply"
      ref={ref}
      className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 bg-[#050304] overflow-hidden select-none"
    >
      {/* ========================================================
          BACKGROUND LAYER: Cinematic Razor Edges, Gradients & Vignettes
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient theme glows */}
        <div
          className={`absolute top-1/4 -left-32 w-[600px] h-[600px] ${t.applyAtmosphereClass} blur-[160px] rounded-full transition-colors duration-500`}
        />
        <div
          className={`absolute bottom-0 right-0 w-[500px] h-[500px] ${t.applyAtmosphereClass} blur-[150px] rounded-full transition-colors duration-500`}
        />

        {/* Subtle noise / grunge texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(${t.accent} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Diagonal Razor Slice (Matches Angled Plate Architecture) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          {/* Top-left angled armor frame */}
          <path
            d="M-50,0 L180,0 L90,180 L-50,180 Z"
            fill="#0F0305"
            stroke={t.applyArmorStroke}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* Bottom diagonal razor cutting line */}
          <line
            x1="0"
            y1="780"
            x2="850"
            y2="380"
            stroke={t.applyRazorLinePrimary}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <line
            x1="850"
            y1="380"
            x2="1500"
            y2="750"
            stroke={t.applyRazorLineSecondary}
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
          {/* Bottom right beveled plate */}
          <path
            d="M1200,900 L1440,720 L1440,900 Z"
            fill="#0A0203"
            stroke={t.applyArmorStroke}
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* ========================================================
          MAIN CONTENT CONTAINER
          ======================================================== */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-start">
          
          {/* ----------------------------------------------------
              LEFT COLUMN: "TAKE YOUR PLACE" Hero Callout
              ---------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div>
              {/* Overline with Theme Dot */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs sm:text-[13px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                  TECHSRIJAN &apos;27
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: t.accent,
                    boxShadow: `0 0 8px ${t.accent}`,
                  }}
                />
                <span className="font-mono text-xs sm:text-[13px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                  MMMUT GORAKHPUR
                </span>
              </div>

              {/* Massive Industrial Headline */}
              <h2 className="font-bebas text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] leading-[0.88] tracking-wider uppercase">
                <span className="block text-[#FAF6EE] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  TAKE YOUR
                </span>
                <span
                  className={`block ${t.applyHeaderGradient} transition-colors duration-300`}
                  style={{
                    filter: `drop-shadow(0 0 35px ${t.accentGlow})`,
                  }}
                >
                  PLACE
                </span>
              </h2>

              {/* Accent Dash */}
              <div
                className="w-8 h-[3px] mt-4 mb-4 sm:mt-5 sm:mb-5 transition-all duration-300"
                style={{
                  backgroundColor: t.accent,
                  boxShadow: `0 0 10px ${t.accent}`,
                }}
              />

              {/* Mission Statement Paragraph */}
              <p className="text-neutral-300 text-sm sm:text-base font-sans font-light leading-relaxed max-w-md">
                Applications are open across Gorakhpur and Eastern UP.
                <br className="hidden sm:block" />
                Represent your campus at Techsrijan &apos;27.
              </p>

              {/* Primary Chamfered Themed CTA Button */}
              <div className="mt-6 sm:mt-7">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`group relative inline-flex items-center justify-center px-8 sm:px-11 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} transition-all duration-300 ${t.primaryBtnShadow} ${t.primaryBtnHoverShadow} active:scale-[0.98] border ${t.primaryBtnBorder}`}
                  style={{
                    clipPath:
                      "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                  }}
                >
                  {/* Subtle diagonal light shimmer */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">APPLY AS AMBASSADOR</span>
                </button>
              </div>

              {/* Sub-caption below CTA */}
              <p className="mt-3 text-xs text-neutral-400 font-sans tracking-wide">
                No registration fee{" "}
                <span className="mx-2 text-neutral-600">•</span> Verification
                within 48 hours
              </p>
            </div>

            {/* --------------------------------------------------
                BOTTOM FACETED GEOMETRIC CREST
                -------------------------------------------------- */}
            <div className="mt-8 sm:mt-12 lg:mt-14 w-32 sm:w-44 select-none">
              <svg
                viewBox="0 0 200 100"
                fill="none"
                className="w-full h-auto transition-all duration-500"
                style={{
                  filter: `drop-shadow(0 0 20px ${t.accentGlow})`,
                }}
              >
                <defs>
                  <linearGradient id="crest-center" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={t.applyCrestCenter0} />
                    <stop offset="100%" stopColor={t.applyCrestCenter100} />
                  </linearGradient>
                  <linearGradient id="crest-wing-l" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={t.applyCrestWing0} />
                    <stop offset="100%" stopColor={t.applyCrestWing100} />
                  </linearGradient>
                  <linearGradient id="crest-wing-r" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={t.applyCrestWing0} />
                    <stop offset="100%" stopColor={t.applyCrestWing100} />
                  </linearGradient>
                  <linearGradient id="crest-flank-l" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={t.applyCrestFlank0} />
                    <stop offset="100%" stopColor={t.applyCrestFlank100} />
                  </linearGradient>
                  <linearGradient id="crest-flank-r" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={t.applyCrestFlank0} />
                    <stop offset="100%" stopColor={t.applyCrestFlank100} />
                  </linearGradient>
                </defs>

                {/* Central Vertical Spear Blade */}
                <polygon
                  points="100,5 106,60 100,95 94,60"
                  fill="url(#crest-center)"
                />
                {/* Center Core Ridge Highlight */}
                <line
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="90"
                  stroke={t.applyCrestHighlight}
                  strokeWidth="1.2"
                  opacity="0.8"
                />

                {/* Mid Wings */}
                <polygon
                  points="100,45 130,22 120,70 100,65"
                  fill="url(#crest-wing-r)"
                />
                <polygon
                  points="100,45 70,22 80,70 100,65"
                  fill="url(#crest-wing-l)"
                />

                {/* Outer Stealth Facets */}
                <polygon
                  points="130,22 170,40 145,75 120,70"
                  fill="url(#crest-flank-r)"
                />
                <polygon
                  points="70,22 30,40 55,75 80,70"
                  fill="url(#crest-flank-l)"
                />

                {/* Sharp Bottom Dagger Ticks */}
                <polygon
                  points="100,65 115,82 100,88"
                  fill={t.applyCrestCenter100}
                />
                <polygon
                  points="100,65 85,82 100,88"
                  fill={t.applyCrestWing100}
                />
              </svg>
            </div>
          </motion.div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: "HOW TO JOIN" 3-Step Timeline
              ---------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 pt-2"
          >
            {/* Top Accent Dash */}
            <div
              className="w-10 h-1 mb-3 transition-all duration-300"
              style={{
                backgroundColor: t.accent,
                boxShadow: `0 0 10px ${t.accent}`,
              }}
            />

            {/* Headline */}
            <h2 className="font-bebas text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.9] text-white tracking-wider uppercase mb-10 sm:mb-12">
              HOW TO JOIN
            </h2>

            {/* Vertical Steps Timeline */}
            <div className="relative pl-1 sm:pl-2">
              
              {/* Vertical Continuous Themed Laser Spine */}
              <div className={`absolute left-[13px] sm:left-[15px] top-4 bottom-4 w-[2px] ${t.applyTimelineSpine} transition-all duration-500`} />

              <div className="space-y-9 sm:space-y-11">
                
                {/* ----------------------------------------------
                    STEP 01: APPLY (Active Glowing State)
                    ---------------------------------------------- */}
                <div className="relative flex items-center group">
                  {/* Glowing Active Outer/Inner Node */}
                  <div
                    className={`absolute left-0 -translate-x-[4px] sm:-translate-x-[3px] w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 bg-black flex items-center justify-center z-10 transition-all duration-300 ${t.applyStepActiveNode}`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: t.accent,
                        boxShadow: `0 0 8px ${t.accent}`,
                      }}
                    />
                  </div>

                  {/* Step Item Content */}
                  <div className="flex items-center gap-4 sm:gap-6 ml-12 sm:ml-14">
                    <span
                      className={`font-bebas text-4xl sm:text-5xl ${t.applyStepActiveNumber} tracking-wider shrink-0 transition-colors duration-300`}
                    >
                      01
                    </span>

                    {/* Vertical Divider */}
                    <span className="h-8 sm:h-10 w-[1.5px] bg-neutral-700/80 shrink-0" />

                    <div>
                      <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase leading-none">
                        APPLY
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm font-geist mt-1 leading-snug">
                        Complete the online ambassador form.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ----------------------------------------------
                    STEP 02: GET VERIFIED
                    ---------------------------------------------- */}
                <div className="relative flex items-center group">
                  {/* Ring Circle Node */}
                  <div className="absolute left-0 -translate-x-[4px] sm:-translate-x-[3px] w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-neutral-600 bg-black z-10 group-hover:border-neutral-400 transition-colors" />

                  {/* Step Item Content */}
                  <div className="flex items-center gap-4 sm:gap-6 ml-12 sm:ml-14">
                    <span className="font-bebas text-4xl sm:text-5xl text-[#FAF6EE] tracking-wider shrink-0">
                      02
                    </span>

                    {/* Vertical Divider */}
                    <span className="h-8 sm:h-10 w-[1.5px] bg-neutral-700/80 shrink-0" />

                    <div>
                      <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase leading-none">
                        GET VERIFIED
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm font-geist mt-1 leading-snug">
                        The Techsrijan team reviews your application within 48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ----------------------------------------------
                    STEP 03: REPRESENT
                    ---------------------------------------------- */}
                <div className="relative flex items-center group">
                  {/* Ring Circle Node */}
                  <div className="absolute left-0 -translate-x-[4px] sm:-translate-x-[3px] w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-neutral-600 bg-black z-10 group-hover:border-neutral-400 transition-colors" />

                  {/* Step Item Content */}
                  <div className="flex items-center gap-4 sm:gap-6 ml-12 sm:ml-14">
                    <span className="font-bebas text-4xl sm:text-5xl text-[#FAF6EE] tracking-wider shrink-0">
                      03
                    </span>

                    {/* Vertical Divider */}
                    <span className="h-8 sm:h-10 w-[1.5px] bg-neutral-700/80 shrink-0" />

                    <div>
                      <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase leading-none">
                        REPRESENT
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm font-geist mt-1 leading-snug">
                        Bring Techsrijan to your campus.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ========================================================
          FULL FUTURISTIC APPLICATION POPUP MODAL
          ======================================================== */}
      <AmbassadorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}


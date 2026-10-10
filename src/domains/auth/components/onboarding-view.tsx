"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingView() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "",
    college: "",
    course: "",
    year: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Persist profile data so /profile immediately displays submitted details
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "ts27_user_profile",
          JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            course: formData.course,
            year: formData.year,
            city: formData.city,
          })
        );
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050303] text-[#f8eed9] overflow-x-hidden flex flex-col justify-center pt-20 sm:pt-22 md:pt-24 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-12 select-none">
      {/* ========================================================
          BACKGROUND LAYER: Citadel Desert Horizon with Red Moon
          ======================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <picture className="w-full h-full">
          <source srcSet="/images/auth/onboarding_bg.png" type="image/png" />
          <img
            src="/images/auth/onboarding_bg.png"
            alt="TechSrijan Imperial Landscape"
            className="w-full h-full object-cover object-[72%_center] md:object-center brightness-[1.03] contrast-[1.12]"
            draggable={false}
          />
        </picture>
        {/* Cinematic Vignettes: darker on left to keep form readable; open on right so moon & citadel shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/85" />
      </div>

      {/* ========================================================
          FLOATING THEMATIC EMBERS & STARDUST
          ======================================================== */}
      {mounted && (
        <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden mix-blend-screen">
          {Array.from({ length: 20 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 4.9 + 5) % 94;
            const top = (i * 5.7 + 12) % 85;
            const isRed = i % 2 === 0;
            const emberColor = isRed ? "#ef4444" : "#caa462";
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: emberColor,
                  boxShadow: `0 0 10px ${emberColor}`,
                }}
                animate={{
                  y: [0, -32 - (i % 24), 0],
                  x: [0, i % 2 === 0 ? 8 : -8, 0],
                  opacity: [0.15, 0.85, 0.15],
                }}
                transition={{
                  duration: 4.5 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i * 0.25) % 3,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================
          ROBOT WARRIOR LAYER (robosign_flipped.png)
          - Sized & positioned on far right so the RED MOON remains visible
          - Cinematic incoming materialization animation
          - Soft terrain feathering at bottom
          ======================================================== */}
      <motion.div
        className="fixed -right-6 sm:-right-4 md:-right-3 lg:-right-1 xl:right-1 2xl:right-4 bottom-0 z-10 pointer-events-none select-none flex items-end justify-end hidden md:flex"
        initial={{
          opacity: 0,
          y: 65,
          scale: 0.93,
          filter: "brightness(0.25) blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "brightness(1) blur(0px)",
        }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div
          className="relative w-[280px] sm:w-[330px] md:w-[380px] lg:w-[420px] xl:w-[460px] h-[64vh] sm:h-[68vh] md:h-[73vh] lg:h-[78vh] max-h-[880px] flex items-end justify-center"
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 5%, black 18%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 5%, black 18%, black 100%)",
          }}
        >
          {/* Ground Arrival Aura (Pulses gently beneath warrior's boots) */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[24px] rounded-[50%] blur-[28px] bg-red-600/35 pointer-events-none"
            animate={{
              opacity: [0.25, 0.55, 0.25],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <picture className="w-full h-full flex items-end justify-center">
            <source srcSet="/images/auth/robosign_flipped.png" type="image/png" />
            <img
              src="/images/auth/robosign_flipped.png"
              alt="Knightmare Vanguard Guardian"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]"
              draggable={false}
            />
          </picture>
        </div>
      </motion.div>

      {/* ========================================================
          MAIN CONTENT CONTAINER: Form Chassis & Clean Header
          - Centered horizontally, biased to left/center on desktop
          - Smooth entry animation
          ======================================================== */}
      <motion.div
        className="relative z-20 w-full max-w-[690px] md:mr-auto md:ml-4 lg:ml-12 xl:ml-24 2xl:ml-36 my-auto flex flex-col items-center -mt-3 sm:-mt-5 md:-mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ========================================================
            PREMIUM REFINED HEADER AREA (Below Floating Navbar)
            ======================================================== */}
        <div className="flex flex-col items-center text-center w-full mb-4 sm:mb-5">
          {/* Tactical Protocol Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#140e10]/85 border border-[#caa462]/40 shadow-[0_4px_20px_rgba(0,0,0,0.7)] backdrop-blur-md mb-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
            </span>
            <span className="font-mono text-[10.5px] sm:text-[11px] font-bold tracking-[0.28em] text-[#e8dac7] uppercase">
              TECHSRIJAN &apos;27
            </span>
            <span className="text-[#caa462]/40 text-xs">•</span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-[#caa462] font-semibold uppercase">
              {step === 1 ? "ONBOARDING PROTOCOL" : "CLEARANCE PASS"}
            </span>
          </div>

          {/* Sleek Segmented Step Progression */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-2.5 select-none">
            {/* Step 1 Node */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  step === 1
                    ? "bg-red-600/90 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)] border border-red-400/60"
                    : "bg-emerald-950/80 text-emerald-400 border border-emerald-500/60"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span
                className={`font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
                  step === 1 ? "text-[#f7f2ea]" : "text-[#8e8272]"
                }`}
              >
                Profile Setup
              </span>
            </div>

            {/* Glowing Tactical Rail Connector */}
            <div className="relative w-14 sm:w-20 h-[2px] bg-[#2a1d18] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-[#caa462]"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step 2 Node */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  step === 2
                    ? "bg-[#caa462] text-black shadow-[0_0_14px_rgba(202,164,98,0.7)] border border-amber-300"
                    : "bg-[#181113] text-[#7a6f62] border border-[#382a24]"
                }`}
              >
                2
              </div>
              <span
                className={`font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors ${
                  step === 2 ? "text-[#caa462]" : "text-[#7a6f62]"
                }`}
              >
                Pass Activation
              </span>
            </div>
          </div>

          {/* Main Title (Montserrat Heading) */}
          <h1 className="font-montserrat text-[26px] sm:text-[34px] md:text-[38px] font-black text-[#f7f2ea] tracking-tight text-center leading-[1.08] mb-1.5 drop-shadow-[0_2px_15px_rgba(0,0,0,0.85)]">
            {step === 1 ? "Complete your profile" : "Profile Confirmed"}
          </h1>

          {/* Subtext (Geist) */}
          <p className="font-geist text-xs sm:text-[13px] text-[#9e9282] text-center max-w-md">
            {step === 1
              ? "A few details help us set up your event account."
              : "Your registration has been logged for TechSrijan '27 competitions."}
          </p>
        </div>

        {/* ========================================================
            THE FORM CHASSIS CARD
            - 45-degree beveled cut corners
            - Double hairline metallic gold border
            - Deep obsidian glass background
            ======================================================== */}
        <div
          className="relative w-full bg-[#0a0708]/92 backdrop-blur-xl pt-7 pb-6 sm:pb-7 px-5 sm:px-8 md:px-10 border border-[#caa462]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95)] transition-all duration-500"
          style={{
            clipPath:
              "polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)",
            boxShadow:
              "0 0 32px rgba(202, 164, 98, 0.12), 0 25px 70px rgba(0, 0, 0, 0.95), inset 0 0 35px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Subtle Tactical Blueprint Grid Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(202, 164, 98, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(202, 164, 98, 0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top Center Protruding Diamond Finial */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 pointer-events-none z-10 text-[#caa462] text-[10px] leading-none">
            ◇
          </div>

          {/* Top-Right Quick Skip Action */}
          {step === 1 && (
            <div className="absolute top-2.5 right-4 sm:right-6 z-20">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#160e10]/80 hover:bg-[#251518] border border-[#3e2e28] hover:border-[#caa462]/60 text-[10.5px] font-mono tracking-wider text-[#9e9282] hover:text-[#f7f2ea] transition-all"
                title="Skip onboarding for now"
              >
                <span>SKIP FOR NOW</span>
                <span className="text-[#caa462] group-hover:translate-x-0.5 transition-transform text-xs">→</span>
              </Link>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                onSubmit={handleSubmit}
                className="relative z-10"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5">
                  {/* Field 1: FULL NAME */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] placeholder:text-[#6a5e52] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Field 2: EMAIL ADDRESS (Pre-filled Google Email + Badges) */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-3.5 pr-14 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] focus:outline-none cursor-default font-sans"
                      />
                      {/* Google G Logo & Green Verified Check */}
                      <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/70 text-emerald-400 flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field 3: PHONE NUMBER */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] placeholder:text-[#6a5e52] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Field 4: COLLEGE / INSTITUTION */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      COLLEGE / INSTITUTION
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="Enter your college or institution"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] placeholder:text-[#6a5e52] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Field 5: COURSE / DEPARTMENT */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      COURSE / DEPARTMENT
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Enter your course or department"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] placeholder:text-[#6a5e52] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Field 6: YEAR OF STUDY */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      YEAR OF STUDY
                    </label>
                    <div className="relative">
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200 appearance-none pr-9 cursor-pointer"
                      >
                        <option value="" className="bg-[#130d0e] text-[#6a5e52]">
                          Select year
                        </option>
                        <option value="1" className="bg-[#130d0e] text-[#f7f2ea]">
                          1st Year
                        </option>
                        <option value="2" className="bg-[#130d0e] text-[#f7f2ea]">
                          2nd Year
                        </option>
                        <option value="3" className="bg-[#130d0e] text-[#f7f2ea]">
                          3rd Year
                        </option>
                        <option value="4" className="bg-[#130d0e] text-[#f7f2ea]">
                          4th Year
                        </option>
                        <option value="5" className="bg-[#130d0e] text-[#f7f2ea]">
                          5th Year / Dual Degree
                        </option>
                        <option value="other" className="bg-[#130d0e] text-[#f7f2ea]">
                          Postgraduate / Other
                        </option>
                      </select>
                      {/* Custom Chevron Down */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e8272]">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Field 7: CITY (Span 2 columns) */}
                  <div className="flex flex-col sm:col-span-2">
                    <label className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#9e9282] mb-1.5 font-semibold">
                      CITY
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#130d0e]/90 border border-[#382a24]/90 text-sm text-[#f7f2ea] placeholder:text-[#6a5e52] focus:border-[#caa462] focus:bg-[#1a1113] focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* ========================================================
                    SAVE AND CONTINUE BUTTON (Beveled Hexagonal Pill)
                    ======================================================== */}
                <div className="mt-6 sm:mt-7">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full py-3.5 px-6 font-mono text-xs sm:text-[13px] font-bold tracking-[0.26em] uppercase text-[#f7f2ea] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
                    style={{
                      clipPath:
                        "polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)",
                      background:
                        "linear-gradient(90deg, #420a0d 0%, #7f171d 50%, #420a0d 100%)",
                      border: "1px solid rgba(239, 68, 68, 0.85)",
                      boxShadow:
                        "0 0 20px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <span className="relative z-10 group-hover:tracking-[0.28em] transition-all">
                      {isSubmitting ? "SAVING CREDENTIALS..." : "SAVE AND CONTINUE"}
                    </span>
                    {!isSubmitting && (
                      <span className="relative z-10 text-sm group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    )}
                  </button>
                </div>

                {/* Skip / Onboard Later + Notice Bar */}
                <div className="mt-3.5 pt-3 border-t border-[#caa462]/15 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-[#8e8272] text-[11px] sm:text-xs">
                    <svg
                      className="w-3.5 h-3.5 text-[#caa462]/80 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Details can be updated anytime in account settings.</span>
                  </div>

                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wider text-[#9e9282] hover:text-[#f7f2ea] transition-colors py-0.5"
                  >
                    <span>Skip &amp; Onboard Later</span>
                    <span className="text-[#caa462] group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                className="relative z-10 flex flex-col items-center text-center py-4 sm:py-6"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Checkmark Crest */}
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h3 className="font-montserrat text-2xl sm:text-3xl text-white font-black mb-1">
                  Access Key Activated
                </h3>
                <p className="font-geist text-xs sm:text-sm text-[#9e9282] max-w-sm mb-6 leading-relaxed">
                  Welcome aboard, <span className="text-[#f7f2ea] font-medium">{formData.fullName}</span>! Your profile is linked with <span className="text-[#caa462]">{formData.email}</span>.
                </p>

                {/* Event Clearance Credentials Card */}
                <div className="w-full max-w-md p-4 rounded-xl border border-[#caa462]/30 bg-[#140e0e]/90 text-left mb-6 space-y-2">
                  <div className="flex justify-between items-center text-xs border-b border-[#382a24]/60 pb-2">
                    <span className="font-mono text-[#8e8272] uppercase tracking-wider text-[10px]">
                      PARTICIPANT ID
                    </span>
                    <span className="font-mono text-[#caa462] font-bold tracking-widest text-[11px]">
                      TS27-EXT-{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#382a24]/60 pb-2">
                    <span className="font-mono text-[#8e8272] uppercase tracking-wider text-[10px]">
                      INSTITUTION
                    </span>
                    <span className="font-sans text-[#f7f2ea] font-medium text-[11px]">
                      {formData.college || "External Institution"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#8e8272] uppercase tracking-wider text-[10px]">
                      CLEARANCE STATUS
                    </span>
                    <span className="font-mono text-emerald-400 font-bold tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AUTHENTICATED
                    </span>
                  </div>
                </div>

                {/* Primary CTA: View Profile Dashboard */}
                <Link
                  href="/profile"
                  className="relative w-full max-w-md py-3.5 px-6 font-mono text-xs sm:text-[13px] font-bold tracking-[0.24em] uppercase text-[#f7f2ea] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2 group mb-3"
                  style={{
                    clipPath:
                      "polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)",
                    background:
                      "linear-gradient(90deg, #420a0d 0%, #7f171d 50%, #420a0d 100%)",
                    border: "1px solid rgba(239, 68, 68, 0.85)",
                    boxShadow:
                      "0 0 20px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <span className="relative z-10 group-hover:tracking-[0.26em] transition-all">
                    PROCEED TO PROFILE DASHBOARD
                  </span>
                  <span className="relative z-10 text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                {/* Secondary CTA: Explore Events */}
                <Link
                  href="/events"
                  className="w-full max-w-md py-2.5 px-6 font-mono text-xs tracking-[0.18em] uppercase text-[#caa462] hover:text-[#f8eed9] transition-colors border border-[#caa462]/30 hover:border-[#caa462]/60 rounded bg-[#140d0f]/60 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Events &amp; Arenas</span>
                  <span className="text-xs">→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-3.5 text-xs font-mono text-[#8e8272] hover:text-[#caa462] transition-colors"
                >
                  ← Edit Profile Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

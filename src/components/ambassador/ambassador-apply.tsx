"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, User, Mail, BookOpen, GraduationCap, Phone, Loader2 } from "lucide-react";

export function AmbassadorApply() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section
      id="apply"
      ref={ref}
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-18 lg:pb-20 bg-black overflow-hidden select-none"
    >
      {/* Atmospheric effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-950/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
        
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
            JOIN THE{" "}
            <span className="text-[#FF2A36] drop-shadow-[0_0_35px_rgba(255,42,54,0.7)]">
              LEGION
            </span>
          </h2>
          <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
            Applications are open. Fill in your details and begin your
            journey as a TechSrijan&apos;27 Campus Ambassador.
          </p>
        </motion.div>

        {submitted ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-8 sm:p-10 rounded-lg border border-red-500/30 bg-gradient-to-b from-[#140406] to-black text-center shadow-[0_0_30px_rgba(220,38,38,0.2)]"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(255,42,54,0.3)]">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-impact text-2xl text-white uppercase tracking-wide">
              Application Transmitted
            </h3>
            <p className="mt-2 text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
              Our team will review your application and send your official CA ID
              within 48 hours. Watch your inbox.
            </p>
            <div className="mt-6 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400 border border-red-500/20 bg-red-950/30 py-2 px-4 rounded-sm inline-block">
              STATUS: UNDER REVIEW
            </div>
          </motion.div>
        ) : (
          /* Form */
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
          >
            <div className="p-6 sm:p-8 rounded-lg border border-red-500/25 bg-gradient-to-br from-[#140406]/90 via-[#0B0204]/95 to-black/95 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <User className="w-3 h-3 text-red-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <Mail className="w-3 h-3 text-red-500" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@college.edu"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <Phone className="w-3 h-3 text-red-500" /> Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>

                {/* College */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <GraduationCap className="w-3 h-3 text-red-500" /> College
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your college name"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>

                {/* Year / Branch */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <BookOpen className="w-3 h-3 text-red-500" /> Year & Branch
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Year CSE"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>

                {/* Why you? */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                    <Send className="w-3 h-3 text-red-500" /> Why you?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="One line about yourself"
                    className="w-full px-4 py-2.5 bg-black/60 border border-red-950/60 rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/70 focus:shadow-[0_0_12px_rgba(255,42,54,0.25)] transition-all font-sans"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-3 px-10 py-3.5 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-white border border-red-500/60 bg-gradient-to-r from-[#991B1B] via-[#C51D24] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#E61924] disabled:opacity-50 transition-all duration-300 shadow-[0_0_24px_rgba(220,38,38,0.4)] hover:shadow-[0_0_36px_rgba(255,42,54,0.65)] active:scale-95"
                  style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-500">
                  Registrations close 15 Dec 2026
                </span>
              </div>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}

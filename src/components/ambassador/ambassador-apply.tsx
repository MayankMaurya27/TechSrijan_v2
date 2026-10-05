"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, User, Mail, BookOpen, GraduationCap, Phone, Loader2 } from "lucide-react";

export function AmbassadorApply() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
      className="relative py-24 sm:py-32 bg-black overflow-hidden"
    >
      {/* Atmospheric effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-800/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Legion
            </span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            Applications are open. Fill in your details and begin your
            journey as a TechSrijan&apos;27 Campus Ambassador.
          </p>
        </motion.div>

        {submitted ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-8 sm:p-10 rounded-sm border border-red-500/20 bg-red-600/5 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold font-sans">Application Received</h3>
            <p className="mt-3 text-neutral-400 text-sm font-sans leading-relaxed">
              Our team will review your application within 48 hours.
              Check your email for your official CA ID and welcome kit.
            </p>
            <div className="mt-6 font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
              IMPERIUM AWAITS YOU
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
            <div className="p-6 sm:p-8 rounded-sm border border-white/[0.06] bg-white/[0.015]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@college.edu"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>

                {/* College */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <GraduationCap className="w-3 h-3" /> College
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your college name"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>

                {/* Year / Branch */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <BookOpen className="w-3 h-3" /> Year & Branch
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Year CSE"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>

                {/* Why you? */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    <Send className="w-3 h-3" /> Why you?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="One line about yourself"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-sm text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/40 transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-3 px-10 py-3.5 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-white border border-red-500/60 bg-red-600/15 hover:bg-red-600/30 disabled:opacity-50 transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] active:scale-95"
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
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-600">
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

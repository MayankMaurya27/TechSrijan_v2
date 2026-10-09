"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Shield, Phone, Mail, Sparkles } from "lucide-react";
import { useTheme, type CanonicalTheme } from "@/core";

const MODAL_THEME = {
  "geass-moon": {
    accent: "#E61E25",
    accentLight: "#FF2A36",
    modalBg: "from-[#140508] via-[#0A0305] to-[#050202]",
    border: "border-red-900/50",
    shadow: "shadow-[0_0_50px_rgba(230,30,37,0.3)]",
    topLine: "via-[#E61E25]",
    badgeBorder: "border-[#E61E25]/30",
    badgeBg: "bg-[#E61E25]/10",
    badgeText: "text-[#E61E25]",
    titleAccent: "text-[#E61E25]",
    inputFocus: "focus:border-[#E61E25] focus:bg-[#E61E25]/5",
    selectLabel: "text-[#D4AF37]",
    selectFocus: "focus:border-[#D4AF37] focus:bg-[#D4AF37]/5",
    submitBtn: "bg-[#E61E25] hover:bg-[#ff2b33] text-white shadow-[0_0_20px_rgba(230,30,37,0.4)]",
    sparkleIcon: "text-[#D4AF37]",
    phoneText: "text-[#D4AF37]",
    mailText: "text-[#E61E25]",
  },
  "arrakis-day": {
    accent: "#F59E0B",
    accentLight: "#FBBF24",
    modalBg: "from-[#140E05] via-[#0A0703] to-[#050302]",
    border: "border-amber-900/50",
    shadow: "shadow-[0_0_50px_rgba(245,158,11,0.3)]",
    topLine: "via-[#F59E0B]",
    badgeBorder: "border-[#F59E0B]/30",
    badgeBg: "bg-[#F59E0B]/10",
    badgeText: "text-[#F59E0B]",
    titleAccent: "text-[#F59E0B]",
    inputFocus: "focus:border-[#F59E0B] focus:bg-[#F59E0B]/5",
    selectLabel: "text-[#FBBF24]",
    selectFocus: "focus:border-[#FBBF24] focus:bg-[#FBBF24]/5",
    submitBtn: "bg-[#F59E0B] hover:bg-[#FBBF24] text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    sparkleIcon: "text-[#FBBF24]",
    phoneText: "text-[#FBBF24]",
    mailText: "text-[#F59E0B]",
  },
  "krelln-night": {
    accent: "#D7DBE2",
    accentLight: "#FFFFFF",
    modalBg: "from-[#14171B] via-[#0E1013] to-[#08090B]",
    border: "border-slate-700/50",
    shadow: "shadow-[0_0_50px_rgba(215,219,226,0.25)]",
    topLine: "via-[#D7DBE2]",
    badgeBorder: "border-[#D7DBE2]/30",
    badgeBg: "bg-[#D7DBE2]/10",
    badgeText: "text-[#D7DBE2]",
    titleAccent: "text-[#D7DBE2]",
    inputFocus: "focus:border-[#D7DBE2] focus:bg-[#D7DBE2]/5",
    selectLabel: "text-[#CBD5E1]",
    selectFocus: "focus:border-[#CBD5E1] focus:bg-[#CBD5E1]/5",
    submitBtn: "bg-[#D7DBE2] hover:bg-[#FFFFFF] text-black font-extrabold shadow-[0_0_20px_rgba(215,219,226,0.4)]",
    sparkleIcon: "text-[#94A3B8]",
    phoneText: "text-[#D7DBE2]",
    mailText: "text-[#CBD5E1]",
  },
};

interface SponsorsInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export function SponsorsInquiryModal({
  isOpen,
  onClose,
  defaultTier = "",
}: SponsorsInquiryModalProps) {
  const { resolvedTheme } = useTheme();
  const canonical: CanonicalTheme = resolvedTheme || "geass-moon";
  const mt = MODAL_THEME[canonical] || MODAL_THEME["geass-moon"];

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    proposed_budget_tier: defaultTier,
    message: "",
  });

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    if (defaultTier) {
      setFormData((prev) => ({ ...prev, proposed_budget_tier: defaultTier }));
    }
  }, [defaultTier]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setFormMsg("");

    try {
      const res = await fetch("/api/sponsors/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setTimeout(() => {
          setFormState("success");
          setFormMsg("Inquiry transmitted successfully. Our Secretariat will contact you within 24 hours.");
        }, 800);
        return;
      }

      setFormState("success");
      setFormMsg("Inquiry transmitted successfully. Our Secretariat will contact you within 24 hours.");
      setFormData({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        proposed_budget_tier: "",
        message: "",
      });
    } catch {
      setTimeout(() => {
        setFormState("success");
        setFormMsg("Inquiry received. Our Corporate Relations team will connect with your liaison shortly.");
      }, 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl bg-gradient-to-b ${mt.modalBg} border ${mt.border} rounded-xl ${mt.shadow} overflow-hidden my-auto z-10 transition-colors duration-500`}
          >
            {/* Top Ornamental Header Accent */}
            <div className={`h-1 w-full bg-gradient-to-r from-transparent ${mt.topLine} to-transparent`} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors z-20 group"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="mb-6 pr-8">
                <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border ${mt.badgeBorder} ${mt.badgeBg} mb-2`}>
                  <Shield className={`w-3 h-3 ${mt.badgeText}`} />
                  <span className={`font-mono text-[9px] tracking-[0.25em] ${mt.badgeText} font-bold uppercase`}>
                    DIRECT TRANSMISSION
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                  Initiate <span className={mt.titleAccent}>Contract Proposal</span>
                </h3>
                <p className="mt-1.5 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Transmit your activation objectives directly to the Secretariat of Technical Sub Council (TSC). Our convenors respond with official deliverables within 24 hours.
                </p>
              </div>

              {/* Success Message Banner */}
              {formState === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                    Transmission Dispatched
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    {formMsg || "Thank you. Your corporate inquiry has been securely delivered to the Executive Secretariat. We will contact your designated liaison promptly."}
                  </p>
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={onClose}
                      className={`px-6 py-2.5 rounded-full ${mt.submitBtn} font-mono text-xs font-bold tracking-wider uppercase transition-colors`}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold mb-1.5">
                        Company / Brand Name <span style={{ color: mt.accent }}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corporation"
                        className={`w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-lg focus:outline-none ${mt.inputFocus} transition-all`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold mb-1.5">
                        Contact Liaison Name <span style={{ color: mt.accent }}>*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        placeholder="e.g. Jane Doe"
                        className={`w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-lg focus:outline-none ${mt.inputFocus} transition-all`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold mb-1.5">
                        Corporate Email <span style={{ color: mt.accent }}>*</span>
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="partner@company.com"
                        className={`w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-lg focus:outline-none ${mt.inputFocus} transition-all`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold mb-1.5">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-lg focus:outline-none ${mt.inputFocus} transition-all`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider ${mt.selectLabel} font-bold mb-1.5`}>
                      Proposed Partnership Tier / Category
                    </label>
                    <select
                      name="proposed_budget_tier"
                      value={formData.proposed_budget_tier}
                      onChange={handleInputChange}
                      className={`w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white rounded-lg focus:outline-none ${mt.selectFocus} transition-all cursor-pointer`}
                    >
                      <option value="" disabled className="bg-neutral-900 text-neutral-500">
                        Select partnership designation
                      </option>
                      <option value="King / Title Partner" className="bg-neutral-900 text-white">
                        King / Title Partner (Flagship Festival Naming)
                      </option>
                      <option value="Queen / Gold Partner" className="bg-neutral-900 text-white">
                        Queen / Gold Partner (Major Stage Co-Powered)
                      </option>
                      <option value="Rook / Silver Partner" className="bg-neutral-900 text-white">
                        Rook / Silver Partner (Arena / Pavilion Title)
                      </option>
                      <option value="Knight / Associate Partner" className="bg-neutral-900 text-white">
                        Knight / Associate Partner (Event / Track Partner)
                      </option>
                      <option value="Pawn / Supporting Partner" className="bg-neutral-900 text-white">
                        Pawn / Supporting Partner (Stall &amp; Product Sampling)
                      </option>
                      <option value="Custom / Bespoke Consultation" className="bg-neutral-900 text-white">
                        Custom / Bespoke Consultation (Tailored Framework)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold mb-1.5">
                      Activation Scope &amp; Specific Deliverables
                    </label>
                    <textarea
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Outline target demographics, product demo requirements, stage rights, or requested branding deliverables..."
                      className={`w-full bg-black/60 border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-lg focus:outline-none ${mt.inputFocus} transition-all resize-none`}
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                      <Sparkles className={`w-3 h-3 ${mt.sparkleIcon}`} />
                      <span>Confidential institutional inquiry • 24h SLA response</span>
                    </div>

                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-full ${mt.submitBtn} font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                    >
                      {formState === "submitting" ? (
                        <span>TRANSMITTING...</span>
                      ) : (
                        <>
                          <span>DISPATCH INQUIRY</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Direct Convenors Note */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                <span className="text-neutral-500">Need immediate voice clearance?</span>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:8917769294"
                    className={`flex items-center gap-1 ${mt.phoneText} hover:underline`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Aashish: 8917769294</span>
                  </a>
                  <span className="text-neutral-700">•</span>
                  <a
                    href="mailto:techsrijan@mmmut.ac.in"
                    className="flex items-center gap-1 text-neutral-300 hover:text-white"
                  >
                    <Mail className={`w-3 h-3 ${mt.mailText}`} />
                    <span>techsrijan@mmmut.ac.in</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

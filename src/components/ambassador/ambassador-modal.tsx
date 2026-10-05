"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  QrCode,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
} from "lucide-react";

const GORAKHPUR_COLLEGES = [
  "MMMUT Gorakhpur (Madan Mohan Malaviya Univ. of Tech)",
  "KIPM College of Engineering & Technology, Gorakhpur",
  "Buddha Institute of Technology (BIT), Gorakhpur",
  "Institute of Technology & Management (ITM), Gorakhpur",
  "UIET, Deen Dayal Upadhyaya Gorakhpur University",
  "Suyash Institute of Information Technology (SIIT), Gorakhpur",
  "Rajkiya Engineering College (REC), Azamgarh",
  "Rajkiya Engineering College (REC), Ambedkar Nagar",
  "Kamla Nehru Institute of Technology (KNIT), Sultanpur",
  "UNSIET, VBS Purvanchal University, Jaunpur",
  "Prasad Institute of Technology (PIT), Jaunpur",
  "Ashoka Institute of Technology & Management, Varanasi",
  "Kashi Institute of Technology (KIT), Varanasi",
  "SMS Institute of Technology, Varanasi",
  "Rajkiya Engineering College (REC), Sonbhadra",
  "BBDITM Lucknow",
  "Other College / University",
];

interface AmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AmbassadorModal({ isOpen, onClose }: AmbassadorModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [operativeId, setOperativeId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Gorakhpur",
    college: GORAKHPUR_COLLEGES[0],
    otherCollege: "",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    year: "2nd Year",
    rollNo: "",
    socialLink: "",
    experience: "Club Core Member / PR Lead",
    statement: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required";
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errs.email = "Valid email address is required";
      }
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        errs.phone = "10-digit WhatsApp number required";
      }
      if (!formData.city.trim()) errs.city = "City / District is required";
    }

    if (currentStep === 2) {
      if (!formData.college) errs.college = "Select your college";
      if (
        formData.college === "Other College / University" &&
        !formData.otherCollege.trim()
      ) {
        errs.otherCollege = "Please specify your college name";
      }
      if (!formData.branch.trim()) errs.branch = "Branch is required";
    }

    if (currentStep === 3) {
      if (!formData.statement.trim() || formData.statement.trim().length < 10) {
        errs.statement = "Please write at least 1-2 lines on why you wish to join";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generated = `TS27-OP-${Math.floor(1000 + Math.random() * 9000)}`;
      setOperativeId(generated);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  const handleCopyId = () => {
    if (operativeId) {
      navigator.clipboard.writeText(operativeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop with intense blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Modal Chassis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-auto rounded-2xl border border-red-500/40 bg-gradient-to-br from-[#160406]/98 via-[#0B0204]/98 to-black/98 shadow-[0_0_60px_rgba(255,30,39,0.3),0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Ambient Bloody Red Top Scanning Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent shadow-[0_0_12px_#FF1E27]" />

            {/* Corner Tech Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500 pointer-events-none" />

            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-red-900/30 flex items-center justify-between bg-red-950/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-red-400">
                  VANGUARD OPERATIVE ENLISTMENT // TECHSRIJAN&apos;27
                </span>
              </div>
              <button
                onClick={resetAndClose}
                className="w-8 h-8 rounded-md border border-red-500/30 bg-red-950/40 hover:bg-red-900/50 hover:border-red-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1">
              {!submitted ? (
                <>
                  {/* Step Progress Indicators */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase mb-2">
                      <span className={step >= 1 ? "text-red-400 font-bold" : "text-neutral-500"}>
                        01 // Identity
                      </span>
                      <span className={step >= 2 ? "text-red-400 font-bold" : "text-neutral-500"}>
                        02 // Academics
                      </span>
                      <span className={step >= 3 ? "text-red-400 font-bold" : "text-neutral-500"}>
                        03 // Motivation
                      </span>
                    </div>
                    {/* Glowing progress track */}
                    <div className="h-1.5 w-full bg-red-950/50 rounded-full overflow-hidden border border-red-900/30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#FF1E27] shadow-[0_0_12px_#FF1E27]"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ================= STEP 1: IDENTITY ================= */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div className="border-b border-red-900/30 pb-2 mb-3">
                          <h3 className="font-impact text-xl text-white tracking-wide uppercase">
                            Step 1: Operative Identity
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans">
                            Official contact details for ambassador credentials and correspondence.
                          </p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            <User className="w-3 h-3 text-red-500" /> Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="e.g. Sarthak Agarwal"
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_12px_rgba(255,30,39,0.25)] transition-all font-sans"
                          />
                          {errors.fullName && (
                            <span className="text-[11px] text-red-400 font-mono">{errors.fullName}</span>
                          )}
                        </div>

                        {/* Email & Phone Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              <Mail className="w-3 h-3 text-red-500" /> Email Address *
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleChange("email", e.target.value)}
                              placeholder="name@college.edu"
                              className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_12px_rgba(255,30,39,0.25)] transition-all font-sans"
                            />
                            {errors.email && (
                              <span className="text-[11px] text-red-400 font-mono">{errors.email}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              <Phone className="w-3 h-3 text-red-500" /> WhatsApp Mobile *
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              placeholder="10-digit number"
                              className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_12px_rgba(255,30,39,0.25)] transition-all font-sans"
                            />
                            {errors.phone && (
                              <span className="text-[11px] text-red-400 font-mono">{errors.phone}</span>
                            )}
                          </div>
                        </div>

                        {/* City / District */}
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            Home City / District *
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="e.g. Gorakhpur, Azamgarh, Varanasi"
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_12px_rgba(255,30,39,0.25)] transition-all font-sans"
                          />
                          {errors.city && (
                            <span className="text-[11px] text-red-400 font-mono">{errors.city}</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ================= STEP 2: ACADEMICS ================= */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div className="border-b border-red-900/30 pb-2 mb-3">
                          <h3 className="font-impact text-xl text-white tracking-wide uppercase">
                            Step 2: Campus & Academic Dossier
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans">
                            Select your engineering institute in Gorakhpur or Eastern UP.
                          </p>
                        </div>

                        {/* College Dropdown */}
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            <GraduationCap className="w-3 h-3 text-red-500" /> College Name *
                          </label>
                          <select
                            value={formData.college}
                            onChange={(e) => handleChange("college", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-black/80 border border-red-900/50 rounded-md text-sm text-white focus:outline-none focus:border-red-500/80 font-sans"
                          >
                            {GORAKHPUR_COLLEGES.map((col) => (
                              <option key={col} value={col} className="bg-[#120406] text-white">
                                {col}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Other College Text field */}
                        {formData.college === "Other College / University" && (
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              Specify Institute Name *
                            </label>
                            <input
                              type="text"
                              value={formData.otherCollege}
                              onChange={(e) => handleChange("otherCollege", e.target.value)}
                              placeholder="Full name of your college"
                              className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 font-sans"
                            />
                            {errors.otherCollege && (
                              <span className="text-[11px] text-red-400 font-mono">
                                {errors.otherCollege}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Degree, Branch & Year Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              Degree
                            </label>
                            <select
                              value={formData.degree}
                              onChange={(e) => handleChange("degree", e.target.value)}
                              className="w-full px-3 py-2.5 bg-black/80 border border-red-900/50 rounded-md text-sm text-white focus:outline-none focus:border-red-500/80 font-sans"
                            >
                              <option value="B.Tech" className="bg-[#120406]">B.Tech</option>
                              <option value="BCA" className="bg-[#120406]">BCA</option>
                              <option value="MCA" className="bg-[#120406]">MCA</option>
                              <option value="M.Tech" className="bg-[#120406]">M.Tech</option>
                              <option value="B.Sc" className="bg-[#120406]">B.Sc</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              Year of Study
                            </label>
                            <select
                              value={formData.year}
                              onChange={(e) => handleChange("year", e.target.value)}
                              className="w-full px-3 py-2.5 bg-black/80 border border-red-900/50 rounded-md text-sm text-white focus:outline-none focus:border-red-500/80 font-sans"
                            >
                              <option value="1st Year" className="bg-[#120406]">1st Year</option>
                              <option value="2nd Year" className="bg-[#120406]">2nd Year</option>
                              <option value="3rd Year" className="bg-[#120406]">3rd Year</option>
                              <option value="Final Year" className="bg-[#120406]">Final Year</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              Roll No / ID
                            </label>
                            <input
                              type="text"
                              value={formData.rollNo}
                              onChange={(e) => handleChange("rollNo", e.target.value)}
                              placeholder="e.g. 2023021045"
                              className="w-full px-3 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 font-sans"
                            />
                          </div>
                        </div>

                        {/* Branch */}
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            <BookOpen className="w-3 h-3 text-red-500" /> Branch / Department *
                          </label>
                          <input
                            type="text"
                            value={formData.branch}
                            onChange={(e) => handleChange("branch", e.target.value)}
                            placeholder="e.g. Computer Science, Information Technology, ECE"
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 font-sans"
                          />
                          {errors.branch && (
                            <span className="text-[11px] text-red-400 font-mono">{errors.branch}</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ================= STEP 3: MOTIVATION & OUTREACH ================= */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div className="border-b border-red-900/30 pb-2 mb-3">
                          <h3 className="font-impact text-xl text-white tracking-wide uppercase">
                            Step 3: Leadership & Impact
                          </h3>
                          <p className="text-xs text-neutral-400 font-sans">
                            Tell us about your campus reach and why you want to lead the Vanguard.
                          </p>
                        </div>

                        {/* Prior Experience */}
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            Campus Leadership / Club Experience
                          </label>
                          <select
                            value={formData.experience}
                            onChange={(e) => handleChange("experience", e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-black/80 border border-red-900/50 rounded-md text-sm text-white focus:outline-none focus:border-red-500/80 font-sans"
                          >
                            <option value="Club Core Member / PR Lead" className="bg-[#120406]">
                              Club Core Member / PR Lead
                            </option>
                            <option value="Class Representative / CR" className="bg-[#120406]">
                              Class Representative (CR)
                            </option>
                            <option value="Technical Society Member" className="bg-[#120406]">
                              Technical Society / Coding Club Member
                            </option>
                            <option value="Event Volunteer" className="bg-[#120406]">
                              Event Organizer / College Volunteer
                            </option>
                            <option value="First-Time Campus Ambassador" className="bg-[#120406]">
                              First-Time Campus Ambassador (Aspirant)
                            </option>
                          </select>
                        </div>

                        {/* Statement / Why Vanguard */}
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                            <Send className="w-3 h-3 text-red-500" /> Why represent TechSrijan&apos;27 on your campus? *
                          </label>
                          <textarea
                            rows={3}
                            value={formData.statement}
                            onChange={(e) => handleChange("statement", e.target.value)}
                            placeholder="Briefly share how you plan to represent and mobilize students from your college..."
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_12px_rgba(255,30,39,0.25)] transition-all font-sans resize-none"
                          />
                          {errors.statement && (
                            <span className="text-[11px] text-red-400 font-mono">{errors.statement}</span>
                          )}
                        </div>

                        {/* Social Link & Referral Code */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              LinkedIn or Instagram Link (Optional)
                            </label>
                            <input
                              type="url"
                              value={formData.socialLink}
                              onChange={(e) => handleChange("socialLink", e.target.value)}
                              placeholder="https://linkedin.com/in/..."
                              className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/90">
                              Referral Code (Optional)
                            </label>
                            <input
                              type="text"
                              value={formData.referralCode}
                              onChange={(e) => handleChange("referralCode", e.target.value)}
                              placeholder="e.g. TS27-VANGUARD"
                              className="w-full px-3.5 py-2.5 bg-black/60 border border-red-900/50 rounded-md text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500/80 font-sans uppercase"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="pt-4 border-t border-red-900/30 flex items-center justify-between gap-3">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-red-900/40 hover:border-red-500/40 bg-black/40 transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs tracking-[0.2em] uppercase font-bold text-white bg-gradient-to-r from-[#991B1B] via-[#C51D24] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#E61924] rounded-md transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_28px_rgba(255,42,54,0.6)]"
                        >
                          <span>Proceed</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2.5 px-7 py-2.5 font-mono text-xs tracking-[0.2em] uppercase font-bold text-white bg-gradient-to-r from-[#B91C1C] via-[#E61924] to-[#B91C1C] hover:from-[#DC2626] hover:to-[#FF2A36] rounded-md transition-all shadow-[0_0_25px_rgba(255,42,54,0.5)] hover:shadow-[0_0_35px_rgba(255,42,54,0.75)] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Transmitting Dossier...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Enlist in Vanguard</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </>
              ) : (
                /* ================= SUCCESS STATE: DIGITAL OPERATIVE PASS ================= */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-4 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(255,30,39,0.45)]">
                    <CheckCircle2 className="w-7 h-7 text-[#FF1E27]" />
                  </div>

                  <h3 className="font-impact text-3xl sm:text-4xl text-white tracking-wide uppercase">
                    DOSSIER TRANSMITTED
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto">
                    Welcome to the Legion. Your provisional ambassador record has been logged in the TechSrijan&apos;27 operations register.
                  </p>

                  {/* Holographic Operative Card Pass */}
                  <div className="mt-5 p-5 max-w-md mx-auto rounded-xl border-2 border-red-500/50 bg-gradient-to-b from-[#1C0508] via-[#0E0203] to-black text-left shadow-[0_0_35px_rgba(255,30,39,0.25)] relative overflow-hidden">
                    {/* Watermark / Logo */}
                    <div className="absolute top-2 right-3 font-mono text-[9px] tracking-widest text-red-400/40 uppercase">
                      TECHSRIJAN&apos;27 // VANGUARD
                    </div>

                    <div className="flex items-start gap-4">
                      {/* QR Mockup */}
                      <div className="w-16 h-16 rounded-md bg-black border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                        <QrCode className="w-10 h-10" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] tracking-widest text-red-400 font-bold uppercase">
                          OPERATIVE ID
                        </div>
                        <div className="font-mono text-xl font-black text-white tracking-wider flex items-center gap-2">
                          <span>{operativeId}</span>
                          <button
                            onClick={handleCopyId}
                            className="p-1 hover:text-red-400 transition-colors"
                            title="Copy ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copied && (
                          <span className="text-[10px] text-green-400 font-mono block">Copied to clipboard!</span>
                        )}

                        <div className="mt-2 text-xs font-semibold text-neutral-200 truncate">
                          {formData.fullName || "Candidate"}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {formData.college === "Other College / University"
                            ? formData.otherCollege
                            : formData.college}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-red-950/60 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>STATUS: PENDING 48-HR SLA</span>
                      <span className="text-red-400 font-bold">LEVEL 1 APPLICANT</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-mono text-xs tracking-wider uppercase font-bold text-white bg-gradient-to-r from-[#991B1B] via-[#C51D24] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#E61924] shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Join Vanguard WhatsApp HQ</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <button
                      onClick={resetAndClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-md font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white border border-red-900/40 hover:border-red-500/40 bg-black/40 transition-colors"
                    >
                      Close Terminal
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

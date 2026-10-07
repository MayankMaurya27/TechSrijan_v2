"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Share2,
  Check,
} from "lucide-react";
import { useAmbassadorTheme } from "./ambassador-theme";

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
];

const COURSE_YEAR_OPTIONS = [
  "B.Tech - 1st Year",
  "B.Tech - 2nd Year",
  "B.Tech - 3rd Year",
  "B.Tech - Final Year",
  "BCA - 1st / 2nd / 3rd Year",
  "MCA - 1st / 2nd Year",
  "M.Tech - 1st / 2nd Year",
  "Other Course & Year",
];

interface AmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AmbassadorModal({ isOpen, onClose }: AmbassadorModalProps) {
  const t = useAmbassadorTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [operativeId, setOperativeId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    courseYear: COURSE_YEAR_OPTIONS[1],
    city: "Gorakhpur",
    agreeContact: true,
    branch: "",
    rollNo: "",
    experience: "Club Core Member / PR Lead",
    statement: "",
    socialLink: "",
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Please enter your full name";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.college.trim()) errs.college = "Please enter your college or university";
    if (!formData.city.trim()) errs.city = "Please enter your city";
    if (!formData.agreeContact) errs.agreeContact = "Please agree to be contacted";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.branch.trim()) errs.branch = "Please specify your branch/department";
    if (!formData.statement.trim() || formData.statement.trim().length < 8) {
      errs.statement = "Please share a short reason why you want to represent Techsrijan";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generated = `TS27-OP-${Math.floor(1000 + Math.random() * 9000)}`;
      setOperativeId(generated);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop with dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Modal Card Chassis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto rounded-2xl border border-neutral-800 bg-[#0C0D10] overflow-hidden flex flex-col max-h-[92vh] transition-shadow duration-500"
            style={{
              boxShadow: `0 0 80px ${t.accentGlow}, 0 30px 70px rgba(0,0,0,0.95)`,
            }}
          >
            {/* ====================================================
                CORNER ARMOR PLATES & RAZOR ACCENTS
                ==================================================== */}
            {/* Top-Left Beveled Armor Plate */}
            <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none overflow-hidden z-10">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <path
                  d="M0,0 L70,0 L0,70 Z"
                  fill="#15171C"
                  stroke={t.modalArmorFillStroke}
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <line
                  x1="0"
                  y1="70"
                  x2="70"
                  y2="0"
                  stroke={t.modalArmorLineStroke}
                  strokeWidth="2"
                  style={{
                    filter: `drop-shadow(0 0 8px ${t.accent})`,
                  }}
                />
              </svg>
            </div>

            {/* Bottom-Right Beveled Armor Plate */}
            <div className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none overflow-hidden z-30">
              <svg viewBox="0 0 140 140" fill="none" className="w-full h-full">
                <path
                  d="M140,50 L140,140 L50,140 Z"
                  fill="#15171C"
                  stroke={t.modalArmorFillStroke}
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <line
                  x1="50"
                  y1="140"
                  x2="140"
                  y2="50"
                  stroke={t.modalArmorLineStroke}
                  strokeWidth="2"
                  style={{
                    filter: `drop-shadow(0 0 8px ${t.accent})`,
                  }}
                />
              </svg>
            </div>

            {/* Subtle Close Button Top Right */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500 flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ====================================================
                MAIN CONTENT BODY
                ==================================================== */}
            {!submitted ? (
              <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Step Progress Bar (Pinned at top) */}
                <div className="px-6 sm:px-9 pt-5 sm:pt-6 pb-3 shrink-0">
                  <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono tracking-[0.25em] uppercase text-neutral-400 font-medium mb-2.5 pr-8">
                    <span>
                      APPLICATION &nbsp;•&nbsp; STEP {step === 1 ? "01 OF 02" : "02 OF 02"}
                    </span>
                    <span className="text-neutral-400 font-mono text-xs">
                      {step === 1 ? "50%" : "100%"}
                    </span>
                  </div>

                  {/* Progress Track */}
                  <div className="h-[3px] w-full bg-[#24262B] rounded-full overflow-hidden flex">
                    <motion.div
                      className={`h-full ${t.modalProgressBarBg} transition-colors duration-300`}
                      initial={{ width: "50%" }}
                      animate={{ width: step === 1 ? "50%" : "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* ==================================================
                    STEP 1: YOUR DETAILS
                    ================================================== */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleContinue}
                    className="flex flex-col flex-1 min-h-0 overflow-hidden"
                  >
                    {/* Scrollable Form Body */}
                    <div className="flex-1 overflow-y-auto px-6 sm:px-9 py-2 custom-scrollbar overscroll-contain">
                      {/* Big Headline */}
                      <h2 className="font-impact text-4xl sm:text-5xl lg:text-6xl leading-none uppercase tracking-wide">
                        <span className="text-white">YOUR </span>
                        <span className={`${t.accentTextClass} transition-colors duration-300`}>DETAILS</span>
                      </h2>

                      {/* Accent Dash */}
                      <div
                        className="w-8 h-[3.5px] mt-2 mb-4 sm:mb-5 transition-all duration-300"
                        style={{
                          backgroundColor: t.accent,
                          boxShadow: `0 0 8px ${t.accent}`,
                        }}
                      />

                      {/* 2-Column Form Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 sm:gap-y-4">
                        {/* 1. Full name */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            Full name
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          {errors.fullName && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        {/* 2. Email address */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          {errors.email && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.email}
                            </span>
                          )}
                        </div>

                        {/* 3. Mobile number */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            Mobile number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Enter your mobile number"
                            className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          {errors.phone && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.phone}
                            </span>
                          )}
                        </div>

                        {/* 4. College / university */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            College / university
                          </label>
                          <input
                            type="text"
                            list="colleges-list"
                            value={formData.college}
                            onChange={(e) => handleChange("college", e.target.value)}
                            placeholder="Enter your college or university name"
                            className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          <datalist id="colleges-list">
                            {GORAKHPUR_COLLEGES.map((col) => (
                              <option key={col} value={col} />
                            ))}
                          </datalist>
                          {errors.college && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.college}
                            </span>
                          )}
                        </div>

                        {/* 5. Course and year dropdown */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            Course and year
                          </label>
                          <div className="relative">
                            <select
                              value={formData.courseYear}
                              onChange={(e) => handleChange("courseYear", e.target.value)}
                              className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white focus:outline-none ${t.modalInputFocusBorder} transition-all font-sans appearance-none pr-10 cursor-pointer`}
                            >
                              {COURSE_YEAR_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-[#121316] text-white">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* 6. City */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[14px] font-medium mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Enter your city"
                            className={`w-full px-4 py-2.5 sm:py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          {errors.city && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.city}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Checkbox: I agree to be contacted */}
                      <div className="mt-4 mb-3">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div
                            onClick={() => handleChange("agreeContact", !formData.agreeContact)}
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                              formData.agreeContact
                                ? `${t.modalCheckboxCheckedBg}`
                                : "border-neutral-500 bg-transparent"
                            }`}
                          >
                            {formData.agreeContact && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                          <span className="text-neutral-300 text-xs sm:text-sm font-sans">
                            I agree to be contacted about my application.
                          </span>
                        </label>
                        {errors.agreeContact && (
                          <span className="text-xs text-red-400 mt-1 block font-sans">
                            {errors.agreeContact}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pinned Action Footer */}
                    <div className="shrink-0 px-6 sm:px-9 py-3.5 bg-[#0C0D10]/95 backdrop-blur-md border-t border-neutral-800/80 flex items-center justify-end z-20">
                      <button
                        type="submit"
                        className={`group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} transition-all duration-300 ${t.primaryBtnShadow} ${t.primaryBtnHoverShadow} active:scale-[0.98] border ${t.primaryBtnBorder}`}
                        style={{
                          clipPath:
                            "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>CONTINUE TO CAMPUS DETAILS</span>
                          <span className="text-base font-sans leading-none">→</span>
                        </span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* ==================================================
                    STEP 2: CAMPUS DETAILS & MOTIVATION
                    ================================================== */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 min-h-0 overflow-hidden"
                  >
                    {/* Scrollable Form Body */}
                    <div className="flex-1 overflow-y-auto px-6 sm:px-9 py-2 custom-scrollbar overscroll-contain">
                      {/* Big Headline */}
                      <h2 className="font-impact text-4xl sm:text-5xl lg:text-6xl leading-none uppercase tracking-wide">
                        <span className="text-white">CAMPUS </span>
                        <span className={`${t.accentTextClass} transition-colors duration-300`}>DETAILS</span>
                      </h2>

                      {/* Accent Dash */}
                      <div
                        className="w-8 h-[3.5px] mt-2 mb-3.5 sm:mb-4 transition-all duration-300"
                        style={{
                          backgroundColor: t.accent,
                          boxShadow: `0 0 8px ${t.accent}`,
                        }}
                      />

                      {/* 2-Column Form Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-3.5">
                        {/* Branch / Department */}
                        <div>
                          <label className="block text-white font-sans text-xs sm:text-[14px] font-medium mb-1.5">
                            Branch / Department
                          </label>
                          <input
                            type="text"
                            value={formData.branch}
                            onChange={(e) => handleChange("branch", e.target.value)}
                            placeholder="e.g. Computer Science, IT, ECE"
                            className={`w-full px-4 py-2 sm:py-2.5 bg-[#111215] border border-neutral-700/60 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans`}
                          />
                          {errors.branch && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.branch}
                            </span>
                          )}
                        </div>

                        {/* College Roll No / Student ID */}
                        <div>
                          <label className="block text-white font-sans text-xs sm:text-[14px] font-medium mb-1.5">
                            Roll number or Student ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.rollNo}
                            onChange={(e) => handleChange("rollNo", e.target.value)}
                            placeholder="Enter your roll number"
                            className={`w-full px-4 py-2 sm:py-2.5 bg-[#111215] border border-neutral-700/60 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} transition-all font-sans`}
                          />
                        </div>

                        {/* Leadership experience */}
                        <div>
                          <label className="block text-white font-sans text-xs sm:text-[14px] font-medium mb-1.5">
                            Leadership or club experience
                          </label>
                          <div className="relative">
                            <select
                              value={formData.experience}
                              onChange={(e) => handleChange("experience", e.target.value)}
                              className={`w-full px-4 py-2 sm:py-2.5 bg-[#111215] border border-neutral-700/60 rounded-md text-sm text-white focus:outline-none ${t.modalInputFocusBorder} transition-all font-sans appearance-none pr-10 cursor-pointer`}
                            >
                              <option value="Club Core Member / PR Lead" className="bg-[#121316]">
                                Club Core Member / PR Lead
                              </option>
                              <option value="Class Representative (CR)" className="bg-[#121316]">
                                Class Representative (CR)
                              </option>
                              <option value="Technical Society Member" className="bg-[#121316]">
                                Technical Society Member
                              </option>
                              <option value="Event Organizer / Volunteer" className="bg-[#121316]">
                                Event Organizer / Volunteer
                              </option>
                              <option value="First-time Ambassador Aspirant" className="bg-[#121316]">
                                First-time Ambassador Aspirant
                              </option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Social Link */}
                        <div>
                          <label className="block text-white font-sans text-xs sm:text-[14px] font-medium mb-1.5">
                            Social profile link (Optional)
                          </label>
                          <input
                            type="url"
                            value={formData.socialLink}
                            onChange={(e) => handleChange("socialLink", e.target.value)}
                            placeholder="LinkedIn or Instagram profile URL"
                            className={`w-full px-4 py-2 sm:py-2.5 bg-[#111215] border border-neutral-700/60 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} transition-all font-sans`}
                          />
                        </div>
                      </div>

                      {/* Statement / Why Vanguard */}
                      <div className="mt-3 sm:mt-3.5 mb-3">
                        <label className="block text-white font-sans text-xs sm:text-[14px] font-medium mb-1.5">
                          Why do you want to represent Techsrijan on your campus?
                        </label>
                        <textarea
                          rows={2}
                          value={formData.statement}
                          onChange={(e) => handleChange("statement", e.target.value)}
                          placeholder="Tell us briefly how you plan to mobilize your campus..."
                          className={`w-full px-4 py-2 bg-[#111215] border border-neutral-700/60 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} ${t.modalInputFocusShadow} transition-all font-sans resize-none`}
                        />
                        {errors.statement && (
                          <span className="text-xs text-red-400 mt-1 block font-sans">
                            {errors.statement}
                          </span>
                        )}
                      </div>

                      {/* Referral Code (Optional) */}
                      <div className="max-w-xs mb-2">
                        <label className="block text-white font-sans text-xs sm:text-[13px] font-medium mb-1">
                          Referral code (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => handleChange("referralCode", e.target.value)}
                          placeholder="e.g. TS27-VANGUARD"
                          className={`w-full px-3.5 py-1.5 sm:py-2 bg-[#111215] border border-neutral-700/60 rounded-md text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none ${t.modalInputFocusBorder} font-mono uppercase`}
                        />
                      </div>
                    </div>

                    {/* Pinned Action Footer */}
                    <div className="shrink-0 px-6 sm:px-9 py-3.5 bg-[#0C0D10]/95 backdrop-blur-md border-t border-neutral-800/80 flex items-center justify-between z-20">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors flex items-center gap-1.5"
                      >
                        <span className="leading-none font-sans">←</span>
                        <span>BACK</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`group relative inline-flex items-center justify-center px-8 sm:px-11 py-3 font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} transition-all duration-300 ${t.primaryBtnShadow} ${t.primaryBtnHoverShadow} active:scale-[0.98] disabled:opacity-50 border ${t.primaryBtnBorder}`}
                        style={{
                          clipPath:
                            "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                        }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>TRANSMITTING...</span>
                          </span>
                        ) : (
                          <span className="relative z-10 flex items-center gap-2">
                            <span>SUBMIT APPLICATION</span>
                            <span className="text-base font-sans leading-none">✓</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>
            ) : (
              /* ==================================================
                  SUCCESS STATE: DIGITAL OPERATIVE PASS
                  ================================================== */
              <div className="relative z-10 p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="py-4 text-center"
                >
                  <div
                    className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      borderColor: `${t.accent}80`,
                      boxShadow: `0 0 24px ${t.accentGlow}`,
                    }}
                  >
                    <CheckCircle2 className="w-7 h-7" style={{ color: t.accent }} />
                  </div>

                  <h3 className="font-impact text-3xl sm:text-4xl text-white tracking-wide uppercase">
                    APPLICATION SUBMITTED
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto">
                    Welcome to the Vanguard. Your provisional record has been generated for TechSrijan&apos;27.
                  </p>

                  {/* Operative Card Pass */}
                  <div
                    className="mt-6 p-6 max-w-md mx-auto rounded-xl border border-neutral-700/80 bg-[#111215] text-left relative overflow-hidden transition-all duration-300"
                    style={{
                      boxShadow: `0 0 35px ${t.accentGlow}`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* QR Mockup */}
                      <div
                        className="w-16 h-16 rounded-md bg-black border flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          borderColor: `${t.accent}50`,
                          color: t.accent,
                        }}
                      >
                        <QrCode className="w-10 h-10" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className="font-mono text-[10px] tracking-widest font-bold uppercase transition-colors"
                          style={{ color: t.accent }}
                        >
                          OPERATIVE ID
                        </div>
                        <div className="font-mono text-xl font-black text-white tracking-wider flex items-center gap-2">
                          <span>{operativeId}</span>
                          <button
                            onClick={handleCopyId}
                            className="p-1 hover:opacity-80 transition-opacity"
                            title="Copy ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copied && (
                          <span className="text-[10px] text-green-400 font-mono block">
                            Copied to clipboard!
                          </span>
                        )}

                        <div className="mt-2 text-xs font-semibold text-neutral-200 truncate">
                          {formData.fullName}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {formData.college}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>STATUS: PENDING 48-HR SLA</span>
                      <span className="font-bold" style={{ color: t.accent }}>
                        LEVEL 1 APPLICANT
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-mono text-xs tracking-wider uppercase font-bold text-white ${t.primaryBtnBg} ${t.primaryBtnHoverBg} ${t.primaryBtnShadow} transition-all duration-300 border ${t.primaryBtnBorder}`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Join Vanguard WhatsApp HQ</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <button
                      onClick={resetAndClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-md font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-black/40 transition-colors"
                    >
                      Close Terminal
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop with dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Modal Card Chassis (Matches Image 1 Exact Theme) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto rounded-2xl border border-neutral-800 bg-[#0C0D10] shadow-[0_0_80px_rgba(220,38,38,0.25),0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* ====================================================
                IMAGE 1 CORNER ARMOR PLATES & RED RAZOR ACCENTS
                ==================================================== */}
            {/* Top-Left Beveled Armor Plate with Red Slice */}
            <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <path
                  d="M0,0 L70,0 L0,70 Z"
                  fill="#15171C"
                  stroke="#FF1E27"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <line
                  x1="0"
                  y1="70"
                  x2="70"
                  y2="0"
                  stroke="#FF2A36"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_#FF1E27]"
                />
              </svg>
            </div>

            {/* Bottom-Right Beveled Armor Plate with Red Slice */}
            <div className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none overflow-hidden z-0">
              <svg viewBox="0 0 140 140" fill="none" className="w-full h-full">
                <path
                  d="M140,50 L140,140 L50,140 Z"
                  fill="#15171C"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <line
                  x1="50"
                  y1="140"
                  x2="140"
                  y2="50"
                  stroke="#FF2A36"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_#FF1E27]"
                />
              </svg>
            </div>

            {/* Subtle Close Button Top Right */}
            <button
              onClick={resetAndClose}
              className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-700/60 text-neutral-400 hover:text-white hover:border-red-500/60 flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ====================================================
                MAIN CONTENT BODY
                ==================================================== */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex-1">
              {!submitted ? (
                <>
                  {/* Step Progress Bar (Matches Image 1 Exact Layout) */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs sm:text-[13px] font-mono tracking-[0.25em] uppercase text-neutral-400 font-medium mb-3">
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
                        className="h-full bg-[#E61924] shadow-[0_0_10px_#FF1E27]"
                        initial={{ width: "50%" }}
                        animate={{ width: step === 1 ? "50%" : "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* ==================================================
                      STEP 1: YOUR DETAILS (Matches Image 1 Exactly)
                      ================================================== */}
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleContinue}
                    >
                      {/* Big Headline */}
                      <h2 className="font-impact text-5xl sm:text-6xl lg:text-7xl leading-none uppercase tracking-wide">
                        <span className="text-white">YOUR </span>
                        <span className="text-[#E61924]">DETAILS</span>
                      </h2>

                      {/* Red Accent Dash */}
                      <div className="w-8 h-[3.5px] bg-[#E61924] mt-2.5 mb-7 sm:mb-8 shadow-[0_0_8px_#FF1E27]" />

                      {/* 2-Column Form Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        
                        {/* 1. Full name */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Full name
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
                          />
                          {errors.fullName && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        {/* 2. Email address */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
                          />
                          {errors.email && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.email}
                            </span>
                          )}
                        </div>

                        {/* 3. Mobile number */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Mobile number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Enter your mobile number"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
                          />
                          {errors.phone && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.phone}
                            </span>
                          )}
                        </div>

                        {/* 4. College / university (with auto-suggest datalist) */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            College / university
                          </label>
                          <input
                            type="text"
                            list="colleges-list"
                            value={formData.college}
                            onChange={(e) => handleChange("college", e.target.value)}
                            placeholder="Enter your college or university name"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
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
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Course and year
                          </label>
                          <div className="relative">
                            <select
                              value={formData.courseYear}
                              onChange={(e) => handleChange("courseYear", e.target.value)}
                              className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white focus:outline-none focus:border-red-500/80 transition-all font-sans appearance-none pr-10 cursor-pointer"
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
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Enter your city"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
                          />
                          {errors.city && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.city}
                            </span>
                          )}
                        </div>

                      </div>

                      {/* Checkbox: I agree to be contacted */}
                      <div className="mt-6 mb-7">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div
                            onClick={() => handleChange("agreeContact", !formData.agreeContact)}
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                              formData.agreeContact
                                ? "bg-[#E61924] border-[#E61924]"
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

                      {/* Chamfered Red Button (Matches Image 1) */}
                      <div>
                        <button
                          type="submit"
                          className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-white bg-gradient-to-r from-[#C51D24] via-[#E61924] to-[#C51D24] hover:from-[#DC2626] hover:to-[#FF2A36] transition-all duration-300 shadow-[0_0_24px_rgba(220,38,38,0.45)] hover:shadow-[0_0_36px_rgba(255,42,54,0.7)] active:scale-[0.98]"
                          style={{
                            clipPath:
                              "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                          }}
                        >
                          <span className="relative z-10">CONTINUE TO CAMPUS DETAILS</span>
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
                    >
                      {/* Big Headline */}
                      <h2 className="font-impact text-5xl sm:text-6xl lg:text-7xl leading-none uppercase tracking-wide">
                        <span className="text-white">CAMPUS </span>
                        <span className="text-[#E61924]">DETAILS</span>
                      </h2>

                      {/* Red Accent Dash */}
                      <div className="w-8 h-[3.5px] bg-[#E61924] mt-2.5 mb-7 sm:mb-8 shadow-[0_0_8px_#FF1E27]" />

                      {/* 2-Column Form Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        
                        {/* Branch / Department */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Branch / Department
                          </label>
                          <input
                            type="text"
                            value={formData.branch}
                            onChange={(e) => handleChange("branch", e.target.value)}
                            placeholder="e.g. Computer Science, IT, ECE"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans"
                          />
                          {errors.branch && (
                            <span className="text-xs text-red-400 mt-1 block font-sans">
                              {errors.branch}
                            </span>
                          )}
                        </div>

                        {/* College Roll No / Student ID */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Roll number or Student ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.rollNo}
                            onChange={(e) => handleChange("rollNo", e.target.value)}
                            placeholder="Enter your roll number"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 transition-all font-sans"
                          />
                        </div>

                        {/* Leadership experience */}
                        <div>
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Leadership or club experience
                          </label>
                          <div className="relative">
                            <select
                              value={formData.experience}
                              onChange={(e) => handleChange("experience", e.target.value)}
                              className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white focus:outline-none focus:border-red-500/80 transition-all font-sans appearance-none pr-10 cursor-pointer"
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
                          <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                            Social profile link (Optional)
                          </label>
                          <input
                            type="url"
                            value={formData.socialLink}
                            onChange={(e) => handleChange("socialLink", e.target.value)}
                            placeholder="LinkedIn or Instagram profile URL"
                            className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 transition-all font-sans"
                          />
                        </div>

                      </div>

                      {/* Statement / Why Vanguard */}
                      <div className="mt-5 mb-5">
                        <label className="block text-white font-sans text-sm sm:text-[15px] font-medium mb-2">
                          Why do you want to represent Techsrijan on your campus?
                        </label>
                        <textarea
                          rows={3}
                          value={formData.statement}
                          onChange={(e) => handleChange("statement", e.target.value)}
                          placeholder="Tell us briefly how you plan to mobilize your campus..."
                          className="w-full px-4 py-3 bg-[#111215] border border-neutral-700/60 rounded-md text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(255,30,39,0.2)] transition-all font-sans resize-none"
                        />
                        {errors.statement && (
                          <span className="text-xs text-red-400 mt-1 block font-sans">
                            {errors.statement}
                          </span>
                        )}
                      </div>

                      {/* Referral Code (Optional) */}
                      <div className="max-w-xs mb-8">
                        <label className="block text-white font-sans text-xs sm:text-sm font-medium mb-1.5">
                          Referral code (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => handleChange("referralCode", e.target.value)}
                          placeholder="e.g. TS27-VANGUARD"
                          className="w-full px-3.5 py-2.5 bg-[#111215] border border-neutral-700/60 rounded-md text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/80 font-mono uppercase"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-5 py-3 rounded-md font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
                        >
                          Back
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative inline-flex items-center justify-center px-8 sm:px-11 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-white bg-gradient-to-r from-[#C51D24] via-[#E61924] to-[#C51D24] hover:from-[#DC2626] hover:to-[#FF2A36] transition-all duration-300 shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:shadow-[0_0_36px_rgba(255,42,54,0.7)] active:scale-[0.98] disabled:opacity-50"
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
                            <span className="relative z-10">SUBMIT APPLICATION</span>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </>
              ) : (
                /* ==================================================
                    SUCCESS STATE: DIGITAL OPERATIVE PASS
                    ================================================== */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="py-4 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(255,30,39,0.45)]">
                    <CheckCircle2 className="w-7 h-7 text-[#FF1E27]" />
                  </div>

                  <h3 className="font-impact text-3xl sm:text-4xl text-white tracking-wide uppercase">
                    APPLICATION SUBMITTED
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto">
                    Welcome to the Vanguard. Your provisional record has been generated for TechSrijan&apos;27.
                  </p>

                  {/* Operative Card Pass */}
                  <div className="mt-6 p-6 max-w-md mx-auto rounded-xl border border-neutral-700/80 bg-[#111215] text-left shadow-[0_0_35px_rgba(220,38,38,0.25)] relative overflow-hidden">
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
                      className="w-full sm:w-auto px-5 py-2.5 rounded-md font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-black/40 transition-colors"
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../context/auth-modal-context";
import { useAuth } from "@/core";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";

interface SignInRouteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isPageMode?: boolean;
}

export function SignInRouteModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  isPageMode = false,
}: SignInRouteModalProps) {
  const router = useRouter();
  const authModal = useAuthModal();
  const { login, register } = useAuth();

  const isOpen = propIsOpen !== undefined ? propIsOpen : authModal.isAuthModalOpen;
  const handleClose = propOnClose !== undefined ? propOnClose : authModal.closeAuthModal;

  // View routing: "choose" gateway, or direct forms "mmmut" / "external"
  const [view, setView] = useState<"choose" | "mmmut" | "external">("choose");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    password: "",
    name: "",
    mobile: "",
    collegeName: "",
    gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
    rollNumber: "",
  });

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setView("choose");
      setAuthMode("login");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Close on ESC key when active
  useEffect(() => {
    if (!isOpen || isPageMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPageMode, handleClose]);

  // Lock body scroll when overlay modal is open
  useEffect(() => {
    if (isOpen && !isPageMode) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isPageMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleMmmutSelect = () => {
    setView("mmmut");
    setAuthMode("login");
    setError(null);
    setFormData((prev) => ({
      ...prev,
      collegeName: "Madan Mohan Malaviya University of Technology, Gorakhpur",
    }));
  };

  const handleExternalSelect = () => {
    setView("external");
    setAuthMode("login");
    setError(null);
    setFormData((prev) => ({
      ...prev,
      collegeName: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === "login") {
        const identifierVal = formData.identifier.trim() || formData.email.trim();
        if (!identifierVal) {
          throw new Error("Please enter your email or university roll number.");
        }
        if (!formData.password) {
          throw new Error("Please enter your password.");
        }

        const user = await login({
          identifier: identifierVal,
          password: formData.password,
        });

        handleClose();
        if (!user.isOnboarded) {
          router.push("/onboarding");
        } else {
          router.push("/profile");
        }
      } else {
        // Register Mode
        if (!formData.name.trim()) throw new Error("Full name is required.");
        if (!formData.email.trim() || !formData.email.includes("@")) {
          throw new Error("Valid email is required.");
        }
        if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim())) {
          throw new Error("Mobile must be a valid 10-digit number.");
        }
        if (formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }

        const isMmmut = view === "mmmut";
        const college = isMmmut
          ? "Madan Mohan Malaviya University of Technology, Gorakhpur"
          : formData.collegeName.trim();

        if (!college) throw new Error("College or University name is required.");

        const user = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          mobile: formData.mobile.trim(),
          collegeName: college,
          gender: formData.gender,
          rollNumber: formData.rollNumber.trim() || undefined,
          isMmmutStudent: isMmmut,
          studentType: isMmmut ? "MMMUT" : "OUTSIDER",
        });

        handleClose();
        if (!user.isOnboarded) {
          router.push("/onboarding");
        } else {
          router.push("/profile");
        }
      }
    } catch (err: any) {
      console.warn("Auth error:", err);
      setError(err.message || "Authentication directive failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isPageMode) {
    return null;
  }

  const modalContent = (
    <div className="relative w-full max-w-[840px] mx-auto select-none">
      {/* THE EYE ASSET CREST */}
      <div className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 w-44 sm:w-56 md:w-64 pointer-events-none z-30 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-40 h-14 sm:h-18 bg-red-600/35 blur-xl rounded-full pointer-events-none" />
        <picture className="relative w-full h-auto">
          <source srcSet="/images/auth/eye_asset.webp" type="image/webp" />
          <img
            src="/images/auth/eye_asset.webp"
            alt="TechSrijan All-Seeing Eye Crest"
            className="w-full h-auto object-contain drop-shadow-[0_4px_25px_rgba(220,38,38,0.85)]"
            draggable={false}
          />
        </picture>
      </div>

      {/* MAIN MODAL CHASSIS FRAME */}
      <div
        className="relative w-full bg-[#0a0708] pt-14 sm:pt-16 md:pt-18 pb-7 sm:pb-8 px-5 sm:px-10 md:px-14 shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-[#caa462]/75"
        style={{
          clipPath:
            "polygon(24px 0%, calc(100% - 24px) 0%, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0% calc(100% - 24px), 0% 24px)",
          boxShadow:
            "0 0 35px rgba(202, 164, 98, 0.15), 0 20px 80px rgba(0, 0, 0, 0.95), inset 0 0 40px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Tactical Blueprint Grid Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(202, 164, 98, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(202, 164, 98, 0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Radial Spotlight Highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 25%, rgba(202, 164, 98, 0.09), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(220, 38, 38, 0.07), transparent 70%)",
          }}
        />

        {/* Inner Secondary Concentric Border Line */}
        <div
          className="absolute inset-[5px] pointer-events-none border border-[#caa462]/20 z-0"
          style={{
            clipPath:
              "polygon(22px 0%, calc(100% - 22px) 0%, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0% calc(100% - 22px), 0% 22px)",
          }}
        />

        {/* Top-Left Corner Bracket */}
        <div className="absolute top-0 left-0 w-9 h-9 pointer-events-none z-20">
          <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
            <path
              d="M 0 24 L 24 0 L 34 0 L 0 34 Z"
              fill="#181111"
              stroke="#caa462"
              strokeWidth="1.4"
            />
            <polygon
              points="14,14 17,10 20,14 17,18"
              fill="#ef4444"
              style={{ filter: "drop-shadow(0 0 5px #ef4444)" }}
            />
          </svg>
        </div>

        {/* Top-Right Corner Bracket */}
        <div className="absolute top-0 right-0 w-9 h-9 pointer-events-none z-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -scale-x-100" fill="none">
            <path
              d="M 0 24 L 24 0 L 34 0 L 0 34 Z"
              fill="#181111"
              stroke="#caa462"
              strokeWidth="1.4"
            />
            <polygon
              points="14,14 17,10 20,14 17,18"
              fill="#ef4444"
              style={{ filter: "drop-shadow(0 0 5px #ef4444)" }}
            />
          </svg>
        </div>

        {/* Close Button */}
        {!isPageMode && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full border border-[#caa462]/40 bg-black/60 text-[#caa462] hover:text-[#f7f2ea] hover:border-[#caa462] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close Authentication Modal"
          >
            ✕
          </button>
        )}

        {/* HEADER SECTION */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#caa462]/30 bg-[#caa462]/5 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#caa462] uppercase">
              TECHSRIJAN // CLEARANCE PROTOCOL
            </span>
          </div>

          <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-black text-[#f7f2ea] tracking-tight uppercase">
            {view === "choose"
              ? "CHOOSE YOUR GATEWAY"
              : view === "mmmut"
                ? "MMMUT CAMPUS DIRECTIVE"
                : "EXTERNAL PARTICIPANT ACCESS"}
          </h2>

          <p className="font-geist text-xs sm:text-sm text-[#a09484] mt-1.5 max-w-md mx-auto">
            {view === "choose"
              ? "Select your affiliation portal to authenticate and manage registrations."
              : view === "mmmut"
                ? "University single sign-on with your roll number or student email."
                : "Register or sign in with your institutional credentials."}
          </p>
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {error && (
          <div className="relative z-20 mb-5 p-3 rounded-lg border border-red-500/60 bg-red-950/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ── VIEW 1: GATEWAY SELECTOR ───────────────────────────────────────── */}
        {view === "choose" && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-2">
            {/* CARD 1: MMMUT STUDENT */}
            <div
              onClick={handleMmmutSelect}
              className="group relative rounded-2xl border border-[#caa462]/35 bg-[#120c0c]/85 hover:border-[#caa462]/75 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[285px] sm:min-h-[305px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.15)] cursor-pointer"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="w-14 h-14 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#caa462]/10 blur-xl rounded-full pointer-events-none" />
                  <svg
                    className="w-12 h-12 text-[#caa462] group-hover:scale-105 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>

                <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3.5 mb-1.5 tracking-tight">
                  MMMUT Student
                </h3>

                <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[210px]">
                  Sign in or register with university roll number &amp; institutional credentials.
                </p>
              </div>

              <button
                type="button"
                className="w-full max-w-[250px] mt-6 py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-red-500/85 bg-gradient-to-r from-[#200608]/90 via-[#2d0a0d]/90 to-[#200608]/90 group-hover:from-[#380e13] group-hover:to-[#380e13] group-hover:border-red-400 shadow-[0_0_16px_rgba(230,25,36,0.38)] group-hover:shadow-[0_0_26px_rgba(230,25,36,0.7)] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue as MMMUT Student</span>
                <span>→</span>
              </button>
            </div>

            {/* CARD 2: OTHER INSTITUTION */}
            <div
              onClick={handleExternalSelect}
              className="group relative rounded-2xl border border-[#caa462]/35 bg-[#120c0c]/85 hover:border-[#caa462]/75 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[285px] sm:min-h-[305px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.15)] cursor-pointer"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="w-14 h-14 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-full pointer-events-none" />
                  <svg
                    className="w-12 h-12 text-[#caa462] group-hover:scale-105 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>

                <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3.5 mb-1.5 tracking-tight">
                  External Participant
                </h3>

                <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[210px]">
                  Attendees from IITs, NITs, and other colleges across India.
                </p>
              </div>

              <button
                type="button"
                className="w-full max-w-[250px] mt-6 py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-red-500/85 bg-gradient-to-r from-[#200608]/90 via-[#2d0a0d]/90 to-[#200608]/90 group-hover:from-[#380e13] group-hover:to-[#380e13] group-hover:border-red-400 shadow-[0_0_16px_rgba(230,25,36,0.38)] group-hover:shadow-[0_0_26px_rgba(230,25,36,0.7)] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue as External Attendee</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW 2: INTERACTIVE FORM (MMMUT OR EXTERNAL) ──────────────────── */}
        {view !== "choose" && (
          <div className="relative z-10 my-2">
            {/* Top Bar: Back Button & Mode Tabs */}
            <div className="flex items-center justify-between mb-4 border-b border-[#caa462]/20 pb-3">
              <button
                type="button"
                onClick={() => setView("choose")}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#caa462] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Gateway</span>
              </button>

              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-[#caa462]/30">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`px-3 py-1 font-mono text-[11px] rounded transition-all cursor-pointer ${
                    authMode === "login"
                      ? "bg-[#caa462] text-black font-bold shadow-[0_0_10px_rgba(202,164,98,0.4)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`px-3 py-1 font-mono text-[11px] rounded transition-all cursor-pointer ${
                    authMode === "register"
                      ? "bg-[#caa462] text-black font-bold shadow-[0_0_10px_rgba(202,164,98,0.4)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  REGISTER
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Aarav Sharma"
                        required
                        className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                        10-Digit Mobile *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-[#100b0c] border border-[#caa462]/30 text-sm text-white focus:border-[#caa462] focus:outline-none cursor-pointer"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {view === "mmmut" ? (
                      <div>
                        <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                          University Roll Number *
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          placeholder="e.g. 2024CS001"
                          required
                          className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                          College / University *
                        </label>
                        <input
                          type="text"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. IIT Kanpur / NIT Kurukshetra"
                          required
                          className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Email / Identifier */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                  {authMode === "login"
                    ? view === "mmmut"
                      ? "Email or University Roll Number *"
                      : "Registered Email Address *"
                    : view === "mmmut"
                      ? "Institutional Email (@mmmut.ac.in) *"
                      : "Email Address *"}
                </label>
                <input
                  type={authMode === "login" ? "text" : "email"}
                  name={authMode === "login" ? "identifier" : "email"}
                  value={authMode === "login" ? formData.identifier : formData.email}
                  onChange={handleChange}
                  placeholder={
                    authMode === "login"
                      ? view === "mmmut"
                        ? "student@mmmut.ac.in or 2024CS001"
                        : "participant@college.edu"
                      : view === "mmmut"
                        ? "username@mmmut.ac.in"
                        : "your.name@gmail.com"
                  }
                  required
                  className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-[#a09484] mb-1">
                  Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3 py-2 rounded bg-white/[0.04] border border-[#caa462]/30 text-sm text-white placeholder:text-neutral-600 focus:border-[#caa462] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-[#f7f2ea] border border-red-500/85 bg-gradient-to-r from-[#200608] via-[#481216] to-[#200608] hover:from-[#5e161b] hover:to-[#5e161b] hover:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      <span>AUTHENTICATING DIRECTIVE...</span>
                    </>
                  ) : authMode === "login" ? (
                    <span>PROCEED TO ENTER →</span>
                  ) : (
                    <span>CREATE CLEARANCE ACCOUNT →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL FOOTER AREA */}
        <div className="relative z-20 flex flex-col items-center justify-center mt-6">
          <div className="text-[#caa462] text-[9px] mb-1.5 leading-none opacity-80">
            ◇
          </div>
          <a
            href="/contact"
            className="font-sans text-[12px] sm:text-[13px] text-[#caa462] hover:text-[#f7f2ea] border-b border-dotted border-[#caa462]/60 hover:border-[#f7f2ea] pb-0.5 tracking-wide transition-colors duration-200 cursor-pointer"
          >
            Need help signing in or contacting the secretariat?
          </a>
        </div>
      </div>
    </div>
  );

  if (isPageMode) {
    return modalContent;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full my-auto flex justify-center py-10"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

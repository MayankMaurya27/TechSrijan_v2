"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../context/auth-modal-context";
import { useAuth } from "@/core";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

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

  const handleMmmutSSORedirect = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.techsrijan.org";
    if (typeof window !== "undefined") {
      const returnPath =
        window.location.pathname !== "/signin" && window.location.pathname !== "/signup"
          ? window.location.pathname + window.location.search
          : "/profile";
      localStorage.setItem("ts27_auth_return_url", returnPath);
    }
    const ssoPortal =
      process.env.NEXT_PUBLIC_MMMUT_SSO_PORTAL_URL || "https://mmmut.xyz/auth/Login";
    const clientId =
      process.env.NEXT_PUBLIC_MMMUT_SSO_CLIENT_ID || "techsrijan";
    const callbackUrl = `${origin}/auth/callback?provider=mmmut`;
    window.location.href = `${ssoPortal}?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(callbackUrl)}&callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
  };

  const handleGoogleSignIn = () => {
    if (typeof window !== "undefined") {
      const returnPath =
        window.location.pathname !== "/signin" && window.location.pathname !== "/signup"
          ? window.location.pathname + window.location.search
          : "/profile";
      localStorage.setItem("ts27_auth_return_url", returnPath);
      window.location.href = "/api/auth/google";
    }
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
          <source srcSet={getOptimizedImageUrl("/images/auth/eye_asset.webp", 1200)} type="image/webp" />
          <img
            src={getOptimizedImageUrl("/images/auth/eye_asset.webp", 1200)}
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
          

          <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-black text-[#f7f2ea] tracking-tight uppercase">
            {view === "choose"
              ? "CHOOSE YOUR GATEWAY"
              : view === "mmmut"
                ? "MMMUT CAMPUS DIRECTIVE"
                : "EXTERNAL PARTICIPANT ACCESS"}
          </h2>

          {view !== "choose" && (
            <p className="font-geist text-xs sm:text-sm text-[#a09484] mt-1.5 max-w-md mx-auto">
              {view === "mmmut"
                ? "University single sign-on with your roll number or student email."
                : "Register or sign in with your institutional credentials."}
            </p>
          )}
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
            {/* CARD 1: OWN STUDENT (MMMUT) */}
            <div
              className="group relative rounded-2xl border border-[#caa462]/35 bg-[#120c0c]/85 hover:border-[#caa462]/75 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[310px] sm:min-h-[330px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.15)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              <div className="flex flex-col items-center justify-center pt-2 w-full">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#caa462] uppercase px-2.5 py-0.5 rounded-full border border-[#caa462]/30 bg-[#caa462]/10 mb-3 font-semibold">
                  MMMUT CAMPUS DIRECTIVE
                </span>

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

                <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3 mb-1.5 tracking-tight">
                  Own Student
                </h3>

                <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[220px]">
                  Sign in through institutional portal (<span className="text-[#caa462]">mmmut.xyz</span>). Instant campus verification.
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={handleMmmutSSORedirect}
                  className="w-full max-w-[260px] py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-red-500/85 bg-gradient-to-r from-[#200608]/90 via-[#2d0a0d]/90 to-[#200608]/90 hover:from-[#380e13] hover:to-[#380e13] hover:border-red-400 shadow-[0_0_16px_rgba(230,25,36,0.38)] hover:shadow-[0_0_26px_rgba(230,25,36,0.7)] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Sign In via mmmut.xyz</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* CARD 2: OUTSIDER (GOOGLE BASED) */}
            <div
              className="group relative rounded-2xl border border-[#caa462]/35 bg-[#120c0c]/85 hover:border-[#caa462]/75 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[310px] sm:min-h-[330px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.15)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              <div className="flex flex-col items-center justify-center pt-2 w-full">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#caa462] uppercase px-2.5 py-0.5 rounded-full border border-[#caa462]/30 bg-[#caa462]/10 mb-3 font-semibold">
                  NATIONAL PARTICIPANT
                </span>

                <div className="w-14 h-14 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full pointer-events-none" />
                  <svg className="w-11 h-11 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
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
                </div>

                <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3 mb-1.5 tracking-tight">
                  Outsider
                </h3>

                <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[220px]">
                  Attendees from universities and engineering institutions across India. One-click sign-in.
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full max-w-[260px] py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-[#4285F4]/60 bg-gradient-to-r from-[#101b2b]/95 via-[#18263d]/95 to-[#101b2b]/95 hover:from-[#1e3250] hover:to-[#1e3250] hover:border-[#4285F4] shadow-[0_0_16px_rgba(66,133,244,0.3)] hover:shadow-[0_0_24px_rgba(66,133,244,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </button>
              </div>
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

            {/* QUICK OAUTH / SSO ACCESS SHORTCUT */}
            {view === "mmmut" && (
              <div className="mb-4 p-3 rounded-lg border border-[#caa462]/30 bg-[#160c0e]/80 flex items-center justify-between gap-3">
                <div className="text-left">
                  <div className="font-montserrat text-xs font-bold text-[#f7f2ea]">MMMUT Direct Portal</div>
                  <div className="font-geist text-[11px] text-[#a09484]">Skip manual entry with university single sign-on</div>
                </div>
                <button
                  type="button"
                  onClick={handleMmmutSSORedirect}
                  className="py-1.5 px-3 rounded text-[11px] font-mono font-medium text-[#f7f2ea] border border-red-500/70 bg-red-950/40 hover:bg-red-900/60 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Open mmmut.xyz →
                </button>
              </div>
            )}

            {view === "external" && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-lg font-sans text-xs font-medium text-[#f7f2ea] border border-[#4285F4]/60 bg-[#101b2b]/95 hover:bg-[#18263d] shadow-[0_0_12px_rgba(66,133,244,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </button>
                <div className="relative my-3.5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#caa462]/20"></div>
                  </div>
                  <span className="relative bg-[#120c0c] px-3 font-mono text-[10px] uppercase tracking-wider text-[#a09484]">
                    Or manual credentials
                  </span>
                </div>
              </div>
            )}

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
                          placeholder="e.g. University / Engineering Institute Name"
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

"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../context/auth-modal-context";

interface SignInRouteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  // If true, behaves like a standalone view rather than an overlay modal
  isPageMode?: boolean;
}

export function SignInRouteModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  isPageMode = false,
}: SignInRouteModalProps) {
  const authModal = useAuthModal();
  const isOpen = propIsOpen !== undefined ? propIsOpen : authModal.isAuthModalOpen;
  const handleClose = propOnClose !== undefined ? propOnClose : authModal.closeAuthModal;

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

  const handleMmmutSignIn = () => {
    // In production, this can route to MMMUT SSO or portal URL
    // Redirect directly to the new participant profile
    window.location.href = "/profile";
  };

  const handleGoogleSignIn = () => {
    // Redirect other institution students to onboarding profile completion
    window.location.href = "/onboarding";
  };

  if (!isOpen && !isPageMode) {
    return null;
  }

  const modalContent = (
    <div className="relative w-full max-w-[840px] mx-auto select-none">
      {/* ========================================================
          THE EYE ASSET CREST (Mounted proudly on top edge)
          - Centered horizontally
          - Sits right at the top border notch
          - Ambient crimson glow and gold specular lighting
          ======================================================== */}
      <div className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 w-44 sm:w-56 md:w-64 pointer-events-none z-30 flex items-center justify-center">
        {/* Ambient Crimson Halo behind the eye */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-40 h-14 sm:h-18 bg-red-600/35 blur-xl rounded-full pointer-events-none" />
        <picture className="relative w-full h-auto">
          <source srcSet="/images/auth/eye_asset.png" type="image/png" />
          <img
            src="/images/auth/eye_asset.png"
            alt="TechSrijan All-Seeing Eye Crest"
            className="w-full h-auto object-contain drop-shadow-[0_4px_25px_rgba(220,38,38,0.85)]"
            draggable={false}
          />
        </picture>
      </div>

      {/* ========================================================
          MAIN MODAL CHASSIS FRAME
          - Cut / beveled 45-degree corners
          - Double-line metallic gold border
          - Subtle red & gold edge glow
          - Tactical blueprint grid texture
          ======================================================== */}
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

        {/* ========================================================
            MODULAR ORNAMENTAL CORNER & SIDE BRACKETS (Non-distorting)
            ======================================================== */}
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

        {/* Bottom-Left Corner Bracket */}
        <div className="absolute bottom-0 left-0 w-9 h-9 pointer-events-none z-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -scale-y-100" fill="none">
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

        {/* Bottom-Right Corner Bracket */}
        <div className="absolute bottom-0 right-0 w-9 h-9 pointer-events-none z-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -scale-x-100 -scale-y-100" fill="none">
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

        {/* Left Midpoint Bracket with Red Diamond Jewel */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-20">
          <svg viewBox="0 0 14 32" className="w-3.5 h-8" fill="none">
            <polygon points="0,0 12,16 0,32" fill="#181111" stroke="#caa462" strokeWidth="1.3" />
            <polygon
              points="5,16 8,12 11,16 8,20"
              fill="#ef4444"
              style={{ filter: "drop-shadow(0 0 6px #ef4444)" }}
            />
          </svg>
        </div>

        {/* Right Midpoint Bracket with Red Diamond Jewel */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20">
          <svg viewBox="0 0 14 32" className="w-3.5 h-8 -scale-x-100" fill="none">
            <polygon points="0,0 12,16 0,32" fill="#181111" stroke="#caa462" strokeWidth="1.3" />
            <polygon
              points="5,16 8,12 11,16 8,20"
              fill="#ef4444"
              style={{ filter: "drop-shadow(0 0 6px #ef4444)" }}
            />
          </svg>
        </div>

        {/* Bottom Center Protruding Diamond Finial */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none z-20">
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
            <polygon
              points="10,0 20,10 10,20 0,10"
              fill="#caa462"
              stroke="#efd28d"
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 0 6px rgba(202,164,98,0.8))" }}
            />
          </svg>
        </div>

        {/* ========================================================
            TOP-RIGHT CLOSE BUTTON (✕)
            ======================================================== */}
        <button
          type="button"
          onClick={isPageMode ? () => (window.location.href = "/") : handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 z-30 p-1.5 text-[#9e9282] hover:text-[#f8eed9] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Close dialog"
        >
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ========================================================
            MODAL HEADER AREA
            - TECHSRIJAN '27 · ACCOUNT ACCESS
            - Gold Diamond Separator ◇
            - Choose your sign-in route (Playfair Display)
            - Select the option that matches your college.
            ======================================================== */}
        <div className="relative z-20 flex flex-col items-center text-center">
          {/* Overline Tag */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-[0.28em] uppercase text-[#caa462]">
              TECHSRIJAN &apos;27 &nbsp;·&nbsp; ACCOUNT ACCESS
            </span>
          </div>

          {/* Small Gold Diamond */}
          <div className="text-[#caa462] text-[9px] mb-2 leading-none opacity-90">
            ◇
          </div>

          {/* Main Title: Choose your sign-in route (Montserrat Heading) */}
          <h2 className="font-montserrat text-[26px] sm:text-[34px] md:text-[38px] font-black tracking-tight text-[#f7f2ea] leading-[1.08] mb-2 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            Choose your sign-in route
          </h2>

          {/* Subtitle (Geist) */}
          <p className="font-geist text-[13px] sm:text-[14px] text-[#a09484] font-normal tracking-wide max-w-md mx-auto mb-7 sm:mb-9">
            Select the option that matches your college.
          </p>
        </div>

        {/* ========================================================
            THE TWO ROUTE CARDS (MMMUT vs Other Institution)
            ======================================================== */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[700px] mx-auto">
          {/* ────────────────────────────────────────────────────────
              CARD 1: MMMUT STUDENT
              ──────────────────────────────────────────────────────── */}
          <div
            className="group relative rounded-2xl border border-[#caa462]/30 bg-[#120c0c]/85 hover:border-[#caa462]/65 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[285px] sm:min-h-[305px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.12)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            {/* Top Icon: MMMUT Campus Gate Architectural Line-Art */}
            <div className="flex flex-col items-center justify-center pt-2">
              <svg
                viewBox="0 0 160 80"
                className="w-28 sm:w-32 h-14 sm:h-16 transition-transform duration-300 group-hover:scale-105"
                fill="none"
              >
                {/* Horizontal Red Laser / Base Beam */}
                <line
                  x1="12"
                  y1="72"
                  x2="148"
                  y2="72"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  style={{ filter: "drop-shadow(0 0 6px #ef4444)" }}
                />

                {/* Gate Architectural Structure */}
                <g
                  stroke="#d8b05c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Ground Plinth */}
                  <line x1="20" y1="72" x2="140" y2="72" />

                  {/* Center Main Triumphal Archway */}
                  <path d="M 62 72 L 62 48 A 18 18 0 0 1 98 48 L 98 72" />
                  <path d="M 67 72 L 67 50 A 13 13 0 0 1 93 50 L 93 72" />
                  {/* Keystone */}
                  <path d="M 78 30 L 82 30 L 81 35 L 79 35 Z" />

                  {/* Horizontal Lintel Bar */}
                  <rect x="58" y="38" width="44" height="5" />
                  <line
                    x1="64"
                    y1="40.5"
                    x2="96"
                    y2="40.5"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />

                  {/* Center Pediment & Dome */}
                  <rect x="66" y="32" width="28" height="6" />
                  <path d="M 72 32 A 8 8 0 0 1 88 32 Z" />
                  {/* Central Finial Spire */}
                  <line x1="80" y1="24" x2="80" y2="16" />
                  <circle cx="80" cy="15" r="1.5" fill="#d8b05c" />

                  {/* Left Guard Tower */}
                  <rect x="44" y="36" width="14" height="36" />
                  <rect x="42" y="32" width="18" height="4" />
                  <path d="M 45 32 L 51 25 L 57 32 Z" />
                  <line x1="51" y1="25" x2="51" y2="20" />
                  <path d="M 48 52 L 48 44 A 3 3 0 0 1 54 44 L 54 52 Z" />
                  <line x1="44" y1="60" x2="58" y2="60" strokeWidth="1" />

                  {/* Right Guard Tower */}
                  <rect x="102" y="36" width="14" height="36" />
                  <rect x="100" y="32" width="18" height="4" />
                  <path d="M 103 32 L 109 25 L 115 32 Z" />
                  <line x1="109" y1="25" x2="109" y2="20" />
                  <path d="M 106 52 L 106 44 A 3 3 0 0 1 112 44 L 112 52 Z" />
                  <line x1="102" y1="60" x2="116" y2="60" strokeWidth="1" />

                  {/* Left Wing Arch */}
                  <path d="M 28 72 L 28 54 L 44 54" />
                  <path d="M 32 72 L 32 60 A 4 4 0 0 1 40 60 L 40 72" />
                  <rect x="24" y="50" width="5" height="22" />
                  <line x1="26.5" y1="50" x2="26.5" y2="45" />

                  {/* Right Wing Arch */}
                  <path d="M 132 72 L 132 54 L 116 54" />
                  <path d="M 128 72 L 128 60 A 4 4 0 0 0 120 60 L 120 72" />
                  <rect x="131" y="50" width="5" height="22" />
                  <line x1="133.5" y1="50" x2="133.5" y2="45" />
                </g>
              </svg>

              {/* Title (Montserrat) */}
              <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3.5 mb-1.5 tracking-tight">
                MMMUT student
              </h3>

              {/* Subtext (Geist) */}
              <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[210px]">
                Continue with your university account.
              </p>
            </div>

            {/* Glowing Red CTA Button */}
            <button
              type="button"
              onClick={handleMmmutSignIn}
              className="w-full max-w-[250px] mt-6 py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-red-500/85 bg-gradient-to-r from-[#200608]/90 via-[#2d0a0d]/90 to-[#200608]/90 hover:from-[#380e13] hover:to-[#380e13] hover:border-red-400 shadow-[0_0_16px_rgba(239,68,68,0.38)] hover:shadow-[0_0_26px_rgba(239,68,68,0.7)] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <span>Continue to MMMUT portal</span>
              <svg
                className="w-3.5 h-3.5 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>

          {/* ────────────────────────────────────────────────────────
              CARD 2: OTHER INSTITUTION (Google Sign-In)
              ──────────────────────────────────────────────────────── */}
          <div
            className="group relative rounded-2xl border border-[#caa462]/30 bg-[#120c0c]/85 hover:border-[#caa462]/65 hover:bg-[#181010]/95 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-between text-center min-h-[285px] sm:min-h-[305px] shadow-[0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_40px_rgba(202,164,98,0.12)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            {/* Top Icon: Google Authentic Multi-Color Logo */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-14 h-14 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full pointer-events-none" />
                <svg
                  className="w-11 h-11 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  viewBox="0 0 24 24"
                >
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

              {/* Title (Montserrat) */}
              <h3 className="font-montserrat text-lg sm:text-xl font-bold text-[#f7f2ea] mt-3.5 mb-1.5 tracking-tight">
                Other institution
              </h3>

              {/* Subtext (Geist) */}
              <p className="font-geist text-xs sm:text-[13px] text-[#a09484] leading-relaxed max-w-[210px]">
                Sign in with Google, then complete your profile.
              </p>
            </div>

            {/* Glowing Red CTA Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full max-w-[250px] mt-6 py-2.5 sm:py-3 px-4 rounded-lg font-sans text-xs sm:text-[13px] font-medium text-[#f7f2ea] tracking-wide border border-red-500/85 bg-gradient-to-r from-[#200608]/90 via-[#2d0a0d]/90 to-[#200608]/90 hover:from-[#380e13] hover:to-[#380e13] hover:border-red-400 shadow-[0_0_16px_rgba(239,68,68,0.38)] hover:shadow-[0_0_26px_rgba(239,68,68,0.7)] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            MODAL FOOTER AREA
            - Diamond Separator ◇
            - Need help signing in? Link
            ======================================================== */}
        <div className="relative z-20 flex flex-col items-center justify-center mt-7 sm:mt-8">
          <div className="text-[#caa462] text-[9px] mb-2 leading-none opacity-80">
            ◇
          </div>
          <a
            href="/contact"
            className="font-sans text-[12px] sm:text-[13px] text-[#caa462] hover:text-[#f7f2ea] border-b border-dotted border-[#caa462]/60 hover:border-[#f7f2ea] pb-0.5 tracking-wide transition-colors duration-200 cursor-pointer"
          >
            Need help signing in?
          </a>
        </div>
      </div>
    </div>
  );

  // If in page mode, render directly without fullscreen fixed backdrop
  if (isPageMode) {
    return modalContent;
  }

  // Overlay modal mode
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          {/* Backdrop Blur + Dark Atmospheric Veil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Chassis Motion Wrapper */}
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

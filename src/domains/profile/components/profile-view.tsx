"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Landmark,
  GraduationCap,
  Phone,
  Calendar,
  MapPin,
  Ticket,
  User,
  CheckCircle2,
  Edit3,
  Building2,
  Trophy,
  Sparkles,
  Shield,
  ArrowRight,
  X,
  Save,
  Check,
} from "lucide-react";

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  city: string;
  participantId: string;
  isProfileComplete: boolean;
  // Accommodation info
  accommodationBooked: boolean;
  bookingRef: string;
  hallName: string;
  roomBed: string;
  duration: string;
  // Event & Points info
  eventPoints: number;
  rankTier: string;
  registeredEventsCount: number;
}

const DEFAULT_PROFILE: UserProfileData = {
  fullName: "Aarav Sharma",
  email: "aarav.sharma@gmail.com",
  phone: "+91 98765 43210",
  college: "MMMUT Gorakhpur",
  course: "B.Tech · Computer Science",
  year: "2nd year",
  city: "Gorakhpur, Uttar Pradesh",
  participantId: "TS27-EXT-4891",
  isProfileComplete: true,
  accommodationBooked: true,
  bookingRef: "TS27-RES-482910",
  hallName: "Subhash Bhavan · Boys Wing B",
  roomBed: "Bed #24",
  duration: "3 Nights (Full Fest)",
  eventPoints: 550,
  rankTier: "Silver Vanguard · Tier II",
  registeredEventsCount: 0,
};

export function ProfileView() {
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Hydrate from localStorage if user completed onboarding
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ts27_user_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          const merged: UserProfileData = {
            ...DEFAULT_PROFILE,
            fullName: parsed.fullName || DEFAULT_PROFILE.fullName,
            email: parsed.email || DEFAULT_PROFILE.email,
            phone: parsed.phone || DEFAULT_PROFILE.phone,
            college: parsed.college || DEFAULT_PROFILE.college,
            course: parsed.course || DEFAULT_PROFILE.course,
            year: parsed.year || DEFAULT_PROFILE.year,
            city: parsed.city || DEFAULT_PROFILE.city,
          };
          setProfile(merged);
          setEditForm(merged);
        }
      } catch {
        // use default fallback
      }
    }
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    if (typeof window !== "undefined") {
      localStorage.setItem("ts27_user_profile", JSON.stringify(editForm));
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  // Generate initials for avatar (e.g., Aarav Sharma -> AS)
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "TS";

  return (
    <div className="relative min-h-screen w-full bg-[#050303] text-[#f8eed9] overflow-x-hidden pt-16 sm:pt-18 md:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 select-none">
      {/* ========================================================
          BACKGROUND LAYER: Imperial Landscape with Red Moon (profileland.png)
          ======================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <picture className="w-full h-full">
          <source srcSet="/images/profile/profileland.png" type="image/png" />
          <img
            src="/images/profile/profileland.png"
            alt="TechSrijan Citadel Desert"
            className="w-full h-full object-cover object-[78%_center] md:object-center brightness-[1.02] contrast-[1.14]"
            draggable={false}
          />
        </picture>

        {/* Ambient Dark Vignettes & Warm Crimson Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/75" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/80" />
      </div>

      {/* Floating Stardust / Tactical Embers */}
      {mounted && (
        <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden mix-blend-screen">
          {Array.from({ length: 18 }).map((_, i) => {
            const size = (i % 3) + 2;
            const left = (i * 5.3 + 4) % 94;
            const top = (i * 6.1 + 10) % 86;
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
                  y: [0, -40, 0],
                  opacity: [0.2, 0.75, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4.5 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 5) * 0.4,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT CONTAINER
          - Lifted slightly higher to ensure Row 2 is immediately visible
          ======================================================== */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-start w-full -mt-2 sm:-mt-4 md:-mt-5">
        {/* ========================================================
            HEADER: "Welcome, Aarav" + Creative Top Points HUD Widget
            ======================================================== */}
        <motion.div
          className="w-full mb-3.5 sm:mb-4.5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 w-full">
            {/* Title & Imperial Divider */}
            <div className="flex flex-col items-start">
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-[44px] font-normal text-[#f8eed9] tracking-tight leading-none mb-2 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
                Welcome, {profile.fullName.split(" ")[0]}
              </h1>

              {/* Imperial Divider with Diamond Finial */}
              <div className="relative flex items-center w-40 sm:w-52">
                <div className="h-[1px] w-full bg-gradient-to-r from-[#caa462]/70 via-[#caa462]/30 to-transparent" />
                <span className="mx-2 text-[#caa462] text-[9.5px] leading-none select-none">
                  ◇
                </span>
                <div className="h-[1px] w-10 bg-gradient-to-r from-[#caa462]/30 to-transparent" />
              </div>
            </div>

            {/* CREATIVE TOP POINTS BADGE / TACTICAL MERIT HUD */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#241508]/90 via-[#190d10]/90 to-[#100709]/90 border border-[#caa462]/65 shadow-[0_0_18px_rgba(202,164,98,0.25)] backdrop-blur-md group hover:border-[#caa462] transition-all">
                <div className="w-5 h-5 rounded-full bg-[#caa462]/20 border border-[#caa462]/60 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-[#caa462] animate-pulse" />
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-[9.5px] text-[#9e9282] uppercase tracking-wider font-semibold">ARENA POINTS</span>
                  <span className="text-sm sm:text-base font-bold text-[#f8eed9] tracking-widest drop-shadow-[0_0_8px_rgba(202,164,98,0.6)]">
                    {profile.eventPoints}
                  </span>
                  <span className="text-[9.5px] text-[#caa462] font-bold">PTS</span>
                </div>
                <span className="text-[#caa462]/40 text-xs">|</span>
                <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VANGUARD II
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            TOP BANNER CARD: Profile Identity Chassis
            - 45° beveled cut corners
            - Double hairline gold border
            - Compact vertical height to pull lower cards into view
            ======================================================== */}
        <motion.div
          className="relative w-full bg-[#0a0708]/90 backdrop-blur-xl border border-[#caa462]/55 p-4 sm:p-5 md:p-5.5 shadow-[0_20px_60px_rgba(0,0,0,0.92)] mb-3.5 sm:mb-4.5 transition-all duration-300"
          style={{
            clipPath:
              "polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)",
            boxShadow:
              "0 0 28px rgba(202, 164, 98, 0.12), 0 25px 70px rgba(0, 0, 0, 0.95), inset 0 0 40px rgba(0, 0, 0, 0.85)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle Blueprint Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(202, 164, 98, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(202, 164, 98, 0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Tactical Corner Chevrons */}
          <div className="absolute top-1.5 left-2 pointer-events-none z-10 text-[9px] font-mono text-[#caa462]/40">
            ◤
          </div>
          <div className="absolute bottom-1.5 right-2 pointer-events-none z-10 text-[9px] font-mono text-[#caa462]/40">
            ◢
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Left & Middle: Avatar + Participant Meta */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-5 text-center sm:text-left w-full md:w-auto">
              {/* Circular Monogram Avatar */}
              <div className="relative w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-full border-2 border-[#caa462]/75 bg-gradient-to-br from-[#1b1416] via-[#120b0d] to-[#0a0607] shadow-[0_0_22px_rgba(202,164,98,0.35)] flex items-center justify-center flex-shrink-0 group overflow-hidden">
                {/* Avatar Radial Sheen */}
                <div className="absolute inset-0 bg-radial-gradient from-[#caa462]/20 via-transparent to-black/60 pointer-events-none" />
                <span className="font-editorial text-xl sm:text-2xl text-[#f8eed9] tracking-wider relative z-10 font-normal">
                  {initials}
                </span>
                {/* Subtle border highlight ring */}
                <div className="absolute inset-1 rounded-full border border-[#caa462]/25 pointer-events-none" />
              </div>

              {/* Personal Details & Institution Meta */}
              <div className="flex flex-col items-center sm:items-start space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#f8eed9] tracking-tight leading-tight">
                    {profile.fullName}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#caa462]/90 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#a99c8d]">
                  <Landmark className="w-3.5 h-3.5 text-[#caa462]/70 flex-shrink-0" />
                  <span>{profile.college}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#a99c8d]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#caa462]/70 flex-shrink-0" />
                  <span>
                    {profile.course} &nbsp;·&nbsp; {profile.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Points Pill + Profile Complete Badge + Eye Crest */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                {/* Compact Tactical Points Badge inside card */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201408]/85 border border-[#caa462]/60 text-[#caa462] font-mono text-[10px] sm:text-[10.5px] font-bold tracking-wider shadow-[0_0_12px_rgba(202,164,98,0.25)]">
                  <Trophy className="w-3.5 h-3.5 text-[#caa462]" />
                  <span>{profile.eventPoints} PTS</span>
                </div>

                {/* Profile Complete Status Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071910]/80 border border-emerald-500/70 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[10px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase">
                    PROFILE COMPLETE
                  </span>
                </div>
              </div>

              {/* Eye Emblem Insignia Crest */}
              <div className="relative w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-full border border-red-600/75 bg-gradient-to-br from-[#2a080c] via-[#140305] to-[#0a0203] shadow-[0_0_24px_rgba(239,68,68,0.5)] flex items-center justify-center flex-shrink-0">
                {/* Radiating Crimson Halo */}
                <div className="absolute inset-0 rounded-full bg-red-600/25 blur-md pointer-events-none animate-pulse" />
                <div className="relative w-16 h-16 sm:w-[74px] sm:h-[74px] scale-125 flex items-center justify-center">
                  <Image
                    src="/images/profile/eye_asset.png"
                    alt="Imperium Eye Crest"
                    fill
                    sizes="(max-width: 640px) 64px, 74px"
                    className="object-contain drop-shadow-[0_0_14px_rgba(239,68,68,0.95)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            ROW 1: TWO CORE CARDS (Event Registration & Account Details)
            Exactly as shown in Image 1
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4.5 w-full mb-3.5 sm:mb-4">
          {/* ========================================================
              CARD 1: Event Registration
              ======================================================== */}
          <motion.div
            className="relative w-full bg-[#0a0708]/90 backdrop-blur-xl border border-[#caa462]/50 p-4 sm:p-4.5 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
              boxShadow:
                "0 0 22px rgba(202, 164, 98, 0.08), 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.8)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header: Octagonal Ticket Badge + Title */}
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className="w-9 h-9 flex items-center justify-center bg-[#2b080b] border border-red-500/70 shadow-[0_0_14px_rgba(239,68,68,0.4)] flex-shrink-0"
                  style={{
                    clipPath:
                      "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                  }}
                >
                  <Ticket className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg sm:text-[19px] font-normal text-[#f8eed9] leading-tight">
                    Event registration
                  </h3>
                  <p className="font-sans text-xs text-[#9e9282]">
                    {profile.registeredEventsCount > 0
                      ? `${profile.registeredEventsCount} competition(s) confirmed`
                      : "You haven't registered for any events yet."}
                  </p>
                </div>
              </div>

              {/* Inner Framing Box: Not Started */}
              <div className="w-full bg-[#120b0d]/80 border border-[#302022] rounded-xl p-3.5 sm:p-4 flex items-start gap-3.5 mb-3.5">
                <div className="w-9 h-9 rounded-full border border-[#caa462]/40 bg-[#1a1012] flex items-center justify-center flex-shrink-0 text-[#caa462]/80">
                  <Calendar className="w-4.5 h-4.5 text-[#caa462]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium text-[#f8eed9] mb-0.5">
                    Not started
                  </span>
                  <p className="font-sans text-xs text-[#9e9282] leading-relaxed">
                    Explore our exciting lineup of events and be a part of Techsrijan &apos;27.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button: EXPLORE EVENTS */}
            <Link
              href="/events"
              className="relative w-full py-2.5 sm:py-3 px-6 font-mono text-xs sm:text-[12px] font-bold tracking-[0.22em] uppercase text-[#f7f2ea] transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group mt-1"
              style={{
                clipPath:
                  "polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)",
                background:
                  "linear-gradient(90deg, #420a0d 0%, #7f171d 50%, #420a0d 100%)",
                border: "1px solid rgba(239, 68, 68, 0.85)",
                boxShadow:
                  "0 0 18px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
              }}
            >
              <span className="relative z-10 group-hover:tracking-[0.26em] transition-all">
                EXPLORE EVENTS
              </span>
              <span className="relative z-10 text-sm group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </motion.div>

          {/* ========================================================
              CARD 2: Account Details
              ======================================================== */}
          <motion.div
            className="relative w-full bg-[#0a0708]/90 backdrop-blur-xl border border-[#caa462]/50 p-4 sm:p-4.5 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
              boxShadow:
                "0 0 22px rgba(202, 164, 98, 0.08), 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.8)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header: Octagonal User Badge + Title */}
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className="w-9 h-9 flex items-center justify-center bg-[#2b080b] border border-red-500/70 shadow-[0_0_14px_rgba(239,68,68,0.4)] flex-shrink-0"
                  style={{
                    clipPath:
                      "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                  }}
                >
                  <User className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg sm:text-[19px] font-normal text-[#f8eed9] leading-tight">
                    Account details
                  </h3>
                  <p className="font-sans text-xs text-[#9e9282]">
                    Your personal information and academic details.
                  </p>
                </div>
              </div>

              {/* Detail Items List */}
              <div className="space-y-2 text-xs sm:text-[12.5px] mb-3.5">
                {/* Phone */}
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <div className="flex items-center gap-2.5 text-[#9e9282]">
                    <Phone className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                    <span>Phone</span>
                  </div>
                  <span className="font-mono text-[#f8eed9] font-medium">
                    {profile.phone || "—"}
                  </span>
                </div>

                {/* College */}
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <div className="flex items-center gap-2.5 text-[#9e9282]">
                    <Landmark className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                    <span>College</span>
                  </div>
                  <span className="font-sans text-[#f8eed9] font-medium text-right truncate max-w-[210px]">
                    {profile.college}
                  </span>
                </div>

                {/* Course */}
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <div className="flex items-center gap-2.5 text-[#9e9282]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                    <span>Course</span>
                  </div>
                  <span className="font-sans text-[#f8eed9] font-medium text-right truncate max-w-[210px]">
                    {profile.course}
                  </span>
                </div>

                {/* Year */}
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <div className="flex items-center gap-2.5 text-[#9e9282]">
                    <Calendar className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                    <span>Year</span>
                  </div>
                  <span className="font-sans text-[#f8eed9] font-medium">
                    {profile.year}
                  </span>
                </div>

                {/* City */}
                <div className="flex items-center justify-between pb-0.5">
                  <div className="flex items-center gap-2.5 text-[#9e9282]">
                    <MapPin className="w-3.5 h-3.5 text-[#caa462]/75 flex-shrink-0" />
                    <span>City</span>
                  </div>
                  <span className="font-sans text-[#f8eed9] font-medium text-right truncate max-w-[210px]">
                    {profile.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button: EDIT PROFILE */}
            <button
              type="button"
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
              className="relative w-full py-2.5 px-5 font-mono text-xs tracking-[0.2em] uppercase text-[#caa462] hover:text-[#f8eed9] transition-all duration-300 border border-[#caa462]/40 hover:border-[#caa462] bg-[#140e10]/80 hover:bg-[#201518] rounded flex items-center justify-center gap-2 group mt-1"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#caa462] group-hover:scale-110 transition-transform" />
              <span>EDIT PROFILE</span>
            </button>
          </motion.div>
        </div>

        {/* ========================================================
            ROW 2: ACCOMMODATION & EVENT POINTS (User Requested Additions)
            Seamlessly matching the exact same aesthetic & grid geometry
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4.5 w-full">
          {/* ========================================================
              CARD 3: Campus Accommodation Details
              ======================================================== */}
          <motion.div
            className="relative w-full bg-[#0a0708]/90 backdrop-blur-xl border border-[#caa462]/50 p-4 sm:p-4.5 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
              boxShadow:
                "0 0 22px rgba(202, 164, 98, 0.08), 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.8)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center bg-[#2b080b] border border-red-500/70 shadow-[0_0_14px_rgba(239,68,68,0.4)] flex-shrink-0"
                    style={{
                      clipPath:
                        "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                    }}
                  >
                    <Building2 className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg sm:text-[19px] font-normal text-[#f8eed9] leading-tight">
                      Campus accommodation
                    </h3>
                    <p className="font-sans text-xs text-[#9e9282]">
                      Residence allotment credentials & fest stay status.
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#091f13] border border-emerald-500/70 text-emerald-400 font-mono text-[10px] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CONFIRMED
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-2 text-xs sm:text-[12.5px] mb-3.5">
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <span className="text-[#9e9282]">Booking Ref</span>
                  <span className="font-mono text-[#caa462] font-bold tracking-wider">
                    {profile.bookingRef}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <span className="text-[#9e9282]">Hostel Allotment</span>
                  <span className="font-sans text-[#f8eed9] font-medium text-right">
                    {profile.hallName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <span className="text-[#9e9282]">Bed & Room</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {profile.roomBed}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-0.5">
                  <span className="text-[#9e9282]">Duration</span>
                  <span className="font-sans text-[#f8eed9] font-medium">
                    {profile.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button: VIEW STAY PASS */}
            <Link
              href="/accommodation"
              className="relative w-full py-2.5 px-5 font-mono text-xs tracking-[0.2em] uppercase text-[#caa462] hover:text-[#f8eed9] transition-all duration-300 border border-[#caa462]/40 hover:border-[#caa462] bg-[#140e10]/80 hover:bg-[#201518] rounded flex items-center justify-center gap-2 group mt-1"
            >
              <span>MANAGE ACCOMMODATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#caa462] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* ========================================================
              CARD 4: Event Points & Imperial Standing
              ======================================================== */}
          <motion.div
            className="relative w-full bg-[#0a0708]/90 backdrop-blur-xl border border-[#caa462]/50 p-4 sm:p-4.5 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)",
              boxShadow:
                "0 0 22px rgba(202, 164, 98, 0.08), 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.8)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center bg-[#2b080b] border border-red-500/70 shadow-[0_0_14px_rgba(239,68,68,0.4)] flex-shrink-0"
                    style={{
                      clipPath:
                        "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
                    }}
                  >
                    <Trophy className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg sm:text-[19px] font-normal text-[#f8eed9] leading-tight">
                      Event points & standing
                    </h3>
                    <p className="font-sans text-xs text-[#9e9282]">
                      Merit points gained across TechSrijan &apos;27 arena challenges.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2b1b0e] border border-[#caa462]/60 text-[#caa462] font-mono text-[10px] tracking-wider uppercase font-bold">
                  <Sparkles className="w-3 h-3 text-[#caa462]" />
                  ACTIVE RANK
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-2 text-xs sm:text-[12.5px] mb-3.5">
                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <span className="text-[#9e9282]">Total Points Gained</span>
                  <span className="font-mono text-lg text-[#caa462] font-bold tracking-widest drop-shadow-[0_0_10px_rgba(202,164,98,0.5)]">
                    {profile.eventPoints} PTS
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#281c1f]/80 pb-1.5">
                  <span className="text-[#9e9282]">Vanguard Tier</span>
                  <span className="font-sans text-[#f8eed9] font-medium">
                    {profile.rankTier}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-0.5">
                  <div className="flex justify-between items-center text-[10.5px] font-mono text-[#9e9282]">
                    <span>TIER PROGRESSION</span>
                    <span className="text-[#caa462]">550 / 750 PTS (73%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1c1214] border border-[#3e292c] overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-600 via-red-500 to-[#caa462] rounded-full shadow-[0_0_8px_rgba(202,164,98,0.6)]"
                      initial={{ width: 0 }}
                      animate={{ width: "73%" }}
                      transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: VIEW LEADERBOARD */}
            <Link
              href="/events"
              className="relative w-full py-2.5 px-5 font-mono text-xs tracking-[0.2em] uppercase text-[#caa462] hover:text-[#f8eed9] transition-all duration-300 border border-[#caa462]/40 hover:border-[#caa462] bg-[#140e10]/80 hover:bg-[#201518] rounded flex items-center justify-center gap-2 group mt-1"
            >
              <span>VIEW EVENT LEADERBOARD</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#caa462] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ========================================================
          MODAL: EDIT PROFILE INFORMATION
          ======================================================== */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              className="relative w-full max-w-lg bg-[#0e090b] border border-[#caa462]/70 p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
              style={{
                clipPath:
                  "polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 18px), 0% 16px)",
                boxShadow: "0 0 30px rgba(202, 164, 98, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.9)",
              }}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-[#caa462]/20 pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  <h3 className="font-editorial text-xl text-[#f8eed9]">
                    Edit Account Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[#9e9282] hover:text-[#f8eed9] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                      City, State
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                    College / Institution
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={editForm.college}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                      Course / Department
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={editForm.course}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#9e9282] mb-1">
                      Year of Study
                    </label>
                    <select
                      name="year"
                      value={editForm.year}
                      onChange={handleEditChange}
                      className="w-full px-3.5 py-2 rounded bg-[#160e10] border border-[#3e292c] text-sm text-[#f8eed9] focus:border-[#caa462] focus:outline-none transition-all"
                    >
                      <option value="1st year">1st year</option>
                      <option value="2nd year">2nd year</option>
                      <option value="3rd year">3rd year</option>
                      <option value="4th year">4th year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#caa462]/20">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 font-mono text-xs uppercase text-[#9e9282] hover:text-[#f8eed9] transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-gradient-to-r from-red-700 to-red-600 border border-red-500 font-mono text-xs font-bold tracking-wider text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-2 hover:brightness-110 transition-all"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>SAVED!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>SAVE CHANGES</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

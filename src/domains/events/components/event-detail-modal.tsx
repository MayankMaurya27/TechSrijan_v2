"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Shield,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import type { DetailedEvent } from "./club-events-section";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { useAuth } from "@/core";
import { useAuthModal } from "@/domains/auth";
import { api } from "@/lib/api";

interface EventDetailModalProps {
  event: DetailedEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  const [regMode, setRegMode] = useState<"idle" | "create_squad" | "join_squad" | "success">("idle");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Reset state when event changes
  useEffect(() => {
    setRegMode("idle");
    setTeamName("");
    setTeamCode("");
    setGeneratedCode("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setCodeCopied(false);
  }, [event]);

  // ESC key listener to close modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [event, onClose]);

  if (!event) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Event "${event.name}" link copied to clipboard!`);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard && generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleSoloRegister = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.events.registerSolo(event.id);
      setSuccessMessage("Solo registration confirmed! Your pass is activated.");
      setRegMode("success");
    } catch (err: any) {
      console.warn("Solo register error:", err);
      setErrorMessage(err.message || "Failed to register for this event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!teamName.trim() || teamName.trim().length < 3) {
      setErrorMessage("Squad name must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.events.createSquad(event.id, teamName.trim());
      setGeneratedCode(res.teamCode || res.code || "SQUAD-READY");
      setSuccessMessage(`Squad "${teamName}" created! Share the squad code with your teammates.`);
      setRegMode("success");
    } catch (err: any) {
      console.warn("Create squad error:", err);
      setErrorMessage(err.message || "Failed to create squad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!teamCode.trim()) {
      setErrorMessage("Please enter a valid Squad Code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.events.joinSquad(teamCode.trim());
      setSuccessMessage(`Joined squad "${res.teamName || teamCode}" successfully!`);
      setRegMode("success");
    } catch (err: any) {
      console.warn("Join squad error:", err);
      setErrorMessage(err.message || "Failed to join squad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeamEvent =
    event.teamSize.toLowerCase().includes("team") ||
    event.teamSize.toLowerCase().includes("squad") ||
    event.teamSize.includes("2") ||
    event.teamSize.includes("3") ||
    event.teamSize.includes("4") ||
    event.teamSize.includes("5");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window with Depth Shadow & Inner Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl my-auto text-left"
        >
          {/* Offset Shadow */}
          <div className="absolute top-2 left-2 inset-0 bg-black border border-white/10 rounded-[1.75rem] pointer-events-none" />

          {/* Inner Content Surface */}
          <div className="relative z-10 bg-[#0d0e13] border border-white/20 rounded-[1.75rem] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden max-h-[88vh] flex flex-col">
            {/* Top Silver Accent Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Header: Club Badge + Close Button */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white font-bold">
                  {event.clubName}
                </span>
                <span className="text-white/20">|</span>
                <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-neutral-400">
                  {event.category}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 text-white/70 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 pr-1 py-4 space-y-5 flex-1">
              {/* Event Image Banner */}
              {event.image && (
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 bg-black">
                  <img
                    src={getOptimizedImageUrl(event.image, 1000)}
                    alt={event.name}
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/events-hero-poster.webp";
                    }}
                    className="w-full h-full object-cover object-center brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-transparent to-transparent" />
                </div>
              )}

              {/* Title & Tagline */}
              <div>
                <h2 className="font-montserrat text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  {event.name}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 mt-1 italic">
                  &ldquo;{event.tagline}&rdquo;
                </p>
              </div>

              {/* Status & Error Badges */}
              {errorMessage && (
                <div className="p-3 rounded-xl border border-red-500/50 bg-red-950/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Banner */}
              {regMode === "success" && (
                <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>REGISTRATION SUCCESSFUL</span>
                  </div>
                  <p>{successMessage}</p>
                  {generatedCode && (
                    <div className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-emerald-500/40 mt-2">
                      <span className="font-mono text-neutral-400 text-[11px]">SQUAD CODE:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm tracking-widest">
                          {generatedCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="p-1 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase">
                    <Trophy className="w-3.5 h-3.5 text-white" />
                    <span>Prize Pool</span>
                  </div>
                  <span className="text-white font-bold text-sm mt-1">{event.prizePool}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase">
                    <Users className="w-3.5 h-3.5 text-white" />
                    <span>Team Size</span>
                  </div>
                  <span className="text-white font-bold mt-1 text-xs">{event.teamSize}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span>Date &amp; Time</span>
                  </div>
                  <span className="text-white font-bold mt-1 text-xs truncate">{event.date}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>Venue</span>
                  </div>
                  <span className="text-white font-bold mt-1 text-xs truncate">{event.venue}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                  Event Briefing
                </h3>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
                  {event.description}
                </p>
              </div>

              {/* Interactive Squad Actions Drawer */}
              {regMode === "create_squad" && (
                <form onSubmit={handleCreateSquad} className="p-4 rounded-xl bg-white/[0.04] border border-white/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      CREATE NEW SQUAD
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegMode("idle")}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter squad name (e.g. Apex Predators)"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "CONFIRM & GENERATE SQUAD CODE"}
                  </button>
                </form>
              )}

              {regMode === "join_squad" && (
                <form onSubmit={handleJoinSquad} className="p-4 rounded-xl bg-white/[0.04] border border-white/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      JOIN EXISTING SQUAD
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegMode("idle")}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                    placeholder="Enter squad code (e.g. TS-A4B2)"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none uppercase font-mono tracking-widest"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "VERIFY & JOIN SQUAD"}
                  </button>
                </form>
              )}

              {/* Tournament Rounds */}
              {event.rounds && event.rounds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    Format &amp; Rounds
                  </h3>
                  <div className="space-y-2">
                    {event.rounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="bg-black/50 p-3 rounded-xl border border-white/10 flex items-start gap-2.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-white/70 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-mono text-xs text-white font-bold tracking-wide">
                            {round.title}
                          </div>
                          <div className="font-sans text-xs text-neutral-400 mt-0.5">
                            {round.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Guidelines */}
              {event.rules && event.rules.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    Key Rules &amp; Regulations
                  </h3>
                  <ul className="space-y-1.5 bg-black/50 p-3.5 rounded-xl border border-white/10">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-sans text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/70 flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {user?.isOnboarded && regMode === "idle" && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-[10px] font-mono text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  Fast Registration active · Onboarded as {user.name} ({user.collegeName || user.city || "Verified"})
                </span>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>

                {regMode === "idle" && (
                  <>
                    {isTeamEvent ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRegMode("create_squad")}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
                        >
                          Create Squad
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegMode("join_squad")}
                          className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                        >
                          Join Squad
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSoloRegister}
                        disabled={isSubmitting}
                        className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>{user?.isOnboarded ? "⚡ 1-Click Register" : "Register Solo"}</span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

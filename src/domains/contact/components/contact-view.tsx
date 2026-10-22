"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  MessageSquare,
  PenLine,
  Send,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  HelpCircle,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Shield,
  Plane,
  Train,
  Navigation,
  Copy,
  Check,
  Radio,
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
} from "lucide-react";
import { usePageTheme, type PageThemeConfig, type CanonicalTheme } from "@/core";
import { api } from "@/lib/api";
import { FestFooter } from "@/shared/layout/fest-footer";

/* ─── THEME ACTION BUTTON TOKENS ─────────────────────────────────────── */
const CONTACT_BTN_THEMES: Record<
  CanonicalTheme,
  {
    bg: string;
    border: string;
    shadow: string;
    text: string;
    badgeBg: string;
    badgeBorder: string;
  }
> = {
  "arrakis-day": {
    bg: "linear-gradient(135deg, #E2B755 0%, #D4A843 50%, #9E6B12 100%)",
    border: "rgba(243, 201, 106, 0.75)",
    shadow:
      "0 0 25px rgba(212, 168, 67, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-[#0a0702] font-black",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
  },
  "geass-moon": {
    bg: "linear-gradient(135deg, #FF2E36 0%, #D4141C 50%, #8A070B 100%)",
    border: "rgba(255, 82, 89, 0.75)",
    shadow:
      "0 0 25px rgba(255, 30, 39, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/30",
  },
  "krelln-night": {
    bg: "linear-gradient(135deg, #64748B 0%, #475569 50%, #1E293B 100%)",
    border: "rgba(203, 213, 225, 0.65)",
    shadow:
      "0 0 25px rgba(148, 163, 184, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    badgeBg: "bg-slate-500/10",
    badgeBorder: "border-slate-500/30",
  },
};

/* ─── FULL-FRAME ATMOSPHERIC PARTICLES CANVAS ───────────────────────── */
function ContactFullFrameAtmosphere({ theme }: { theme: PageThemeConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.65 + 0.25,
      color: Math.random() > 0.4 ? theme.particlePrimary : theme.particleSecondary,
    }));

    let mouseX = width * 0.5;
    let mouseY = height * 0.5;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createRadialGradient(mouseX, mouseY, 30, mouseX, mouseY, width * 0.45);
      grad.addColorStop(0, `rgba(${theme.particlePrimary}, 0.07)`);
      grad.addColorStop(0.5, `rgba(${theme.particleSecondary}, 0.02)`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [theme.particlePrimary, theme.particleSecondary]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
}

type FormStatus = "idle" | "sending" | "sent" | "error";

/* ─── TACTICAL DESKS & LIAISONS DATA ─────────────────────────────────── */
interface LiaisonDesk {
  id: string;
  callsign: string;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  sla: string;
  tags: string[];
}

const LIAISON_DESKS: LiaisonDesk[] = [
  {
    id: "secretariat",
    callsign: "DESK-01 / CONVENE",
    title: "Central Fest Secretariat",
    subtitle: "Technical Sub-Council (TSC) · Council of Student Activities (CSA)",
    description:
      "Apex governance, festival administration, university proctorial liaison, and general queries regarding TechSrijan conclaves.",
    email: "techsrijan@mmmut.ac.in",
    sla: "24–48h SLA",
    tags: ["CORE CONCLAVE", "UNIVERSITY RELAY"],
  },
  {
    id: "sponsorship",
    callsign: "DESK-02 / ALLIANCES",
    title: "Corporate & Brand Alliances",
    subtitle: "Industry Partnerships, Stage Branding & Pitch Decks",
    description:
      "Strategic corporate sponsorships, executive stall spaces, product activations, hackathon problem statements, and recruitment drives.",
    email: "sponsorship.techsrijan@mmmut.ac.in",
    sla: "12–24h Priority SLA",
    tags: ["BRAND SPONSORS", "EXHIBITION"],
  },
  {
    id: "hospitality",
    callsign: "DESK-03 / LOGISTICS",
    title: "Hospitality & Outstation Delegation",
    subtitle: "Residential Hostels, Security Clearance & Meal Passports",
    description:
      "Comfortable on-campus residential accommodation inside MMMUT's 354-acre campus, bus station & rail transit reception desks.",
    email: "hospitality.techsrijan@mmmut.ac.in",
    sla: "24h SLA",
    tags: ["CAMPUS LODGING", "OUTSTATION PASSES"],
  },
  {
    id: "media",
    callsign: "DESK-04 / BROADCAST",
    title: "Media, Press & Public Relations",
    subtitle: "Accreditation, Press Releases & Photography Clearance",
    description:
      "Journalistic accreditations, media coverage requests, broadcast clearances, and social influencer partnerships across festival arenas.",
    email: "media.techsrijan@mmmut.ac.in",
    sla: "24–48h SLA",
    tags: ["PRESS CLEARANCE", "PUBLIC RELATIONS"],
  },
];

/* ─── FREQUENTLY ASKED QUESTIONS DATA ─────────────────────────────────── */
const FAQ_CATEGORIES = ["ALL", "REGISTRATION", "ACCOMMODATION", "EVENTS", "SPONSORSHIP"] as const;
type FaqCategory = (typeof FAQ_CATEGORIES)[number];

interface FaqItem {
  category: FaqCategory;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    category: "REGISTRATION",
    q: "Who is eligible to participate in TechSrijan '27?",
    a: "Any enrolled student with a valid college identity card from any recognized university, institute, or polytechnic across India. Cross-college teams are permitted and encouraged in flagship events such as RoboWars, Codethon, and CAD Masters.",
  },
  {
    category: "ACCOMMODATION",
    q: "How does outstation campus accommodation work?",
    a: "Visiting teams receive dedicated hostel accommodation within the 354-acre residential campus of MMMUT Gorakhpur upon payment of a nominal hospitality token. This includes security clearance, high-speed Wi-Fi, bedding, and mess meal coupons.",
  },
  {
    category: "REGISTRATION",
    q: "Can we register on-spot upon arriving at the campus?",
    a: "Yes. Physical on-spot registration and badge counters operate at the University Main Gate and Student Activity Centre (SAC) during festival days. However, early online portal registration is strongly advised as arena brackets fill fast.",
  },
  {
    category: "EVENTS",
    q: "What security and identification protocols are required at the gate?",
    a: "Every attendee must present their official TechSrijan digital participant badge (generated on this portal) alongside a valid institute photo ID card at the security checkpoint for entry clearance.",
  },
  {
    category: "SPONSORSHIP",
    q: "How can brands or technology companies partner as sponsors?",
    a: "Contact our Corporate Alliances team directly via sponsorship.techsrijan@mmmut.ac.in or through the transmission terminal below. The secretariat delivers customized pitch decks, booth allocations, and branding packages within 24 hours.",
  },
  {
    category: "EVENTS",
    q: "Whom should I contact in case of emergency during fest days?",
    a: "The central Command Post at the Student Activity Centre (SAC) operates 24/7 with on-ground student conveners, faculty proctors, and a physical medical aid center. You can also dial our central desk at techsrijan@mmmut.ac.in.",
  },
];

/* ─── SUBJECT PRESETS FOR MESSAGE FORM ────────────────────────────────── */
const SUBJECT_OPTIONS = [
  { id: "General Inquiry", label: "General Festival Inquiry" },
  { id: "Events & Arena Competitions", label: "Events & Arena Competitions" },
  { id: "Corporate & Brand Sponsorship", label: "Corporate Alliances & Sponsorship" },
  { id: "Campus Accommodation & Stays", label: "Campus Passes & Outstation Stay" },
  { id: "Media & Press Clearance", label: "Media & Press Accreditation" },
];

export function ContactView() {
  const pageTheme = usePageTheme();
  const currentTheme: CanonicalTheme = pageTheme.id || "arrakis-day";
  const btnTheme = CONTACT_BTN_THEMES[currentTheme] || CONTACT_BTN_THEMES["arrakis-day"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [copiedDesk, setCopiedDesk] = useState<string | null>(null);

  // FAQ State
  const [activeFaqCategory, setActiveFaqCategory] = useState<FaqCategory>("ALL");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const formSectionRef = useRef<HTMLElement>(null);

  const scrollToForm = (subjectPreset?: string) => {
    if (subjectPreset) {
      setFormData((prev) => ({ ...prev, subject: subjectPreset }));
    }
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopy = (text: string, deskId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedDesk(deskId);
      setTimeout(() => setCopiedDesk(null), 2000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus("error");
      setStatusMessage("Please provide your name, valid email address, and transmission message.");
      return;
    }

    setFormStatus("sending");
    setStatusMessage("");

    try {
      const res = await api.contact.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setFormStatus("sent");
      setStatusMessage(
        res?.message ||
          "Transmission Received: Our central secretariat will review and dispatch a response within 24–48 hours."
      );
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err: any) {
      setFormStatus("error");
      setStatusMessage(
        err?.message || "Transmission could not be dispatched. Please reach out via direct email."
      );
    }
  };

  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "ALL") return FAQS;
    return FAQS.filter((f) => f.category === activeFaqCategory);
  }, [activeFaqCategory]);

  return (
    <div className="relative min-h-screen w-full bg-[#07060a] text-white selection:bg-[#E61E25]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Ambient Embers & Lighting Animation */}
      <ContactFullFrameAtmosphere theme={pageTheme} />

      {/* Floating Status Notification Toast */}
      {formStatus === "sent" && (
        <div role="alert" aria-live="assertive" className="fixed top-24 right-6 z-50 max-w-md rounded-2xl border border-emerald-500/60 bg-emerald-950/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex items-start gap-3.5 text-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
          <div className="flex-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              TRANSMISSION DISPATCHED
            </div>
            <p className="text-xs sm:text-sm mt-1 text-emerald-100/90 leading-relaxed">
              {statusMessage}
            </p>
          </div>
          <button
            onClick={() => setFormStatus("idle")}
            className="text-emerald-400 hover:text-white text-xs font-bold cursor-pointer p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {formStatus === "error" && (
        <div role="alert" aria-live="assertive" className="fixed top-24 right-6 z-50 max-w-md rounded-2xl border border-red-500/60 bg-red-950/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex items-start gap-3.5 text-red-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-red-300">
              DISPATCH FAILED
            </div>
            <p className="text-xs sm:text-sm mt-1 text-red-100/90 leading-relaxed">
              {statusMessage}
            </p>
          </div>
          <button
            onClick={() => setFormStatus("idle")}
            className="text-red-400 hover:text-white text-xs font-bold cursor-pointer p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================
          SECTION 1: HERO — CITADEL COMMAND RELAY
          Atmospheric Artwork Backdrop + Tactical Telemetry HUD
          ============================================================ */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[96vh] flex items-center overflow-hidden bg-[#07060a]">
        {/* Full-Frame Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact/contact-bg-citadel.webp"
            alt="TechSrijan Citadel Commander overlooking the metropolis"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.08] brightness-90"
          />

          {/* Deep dark multi-gradient for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/90 to-transparent w-full lg:w-[68%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060a] via-[#07060a]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-24 lg:py-32">
          <div className="max-w-3xl space-y-7">
            {/* Tactical HUD Header Pip */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: pageTheme.accent }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: pageTheme.accent }}
                />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300">
                CITADEL TRANSMISSION RELAY · ONLINE
              </span>
              <span className="text-white/20">|</span>
              <span className="font-mono text-[11px] text-zinc-400 hidden sm:inline">
                SLA: 24–48 HOURS
              </span>
            </div>

            {/* Grand Headline: GET IN TOUCH */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-montserrat font-black tracking-tight text-white leading-[0.92] uppercase">
              <span
                className="block text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                  filter: `drop-shadow(0 4px 35px ${pageTheme.accentGlow})`,
                }}
              >
                CITADEL
              </span>
              <span
                className="block text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                  filter: `drop-shadow(0 4px 35px ${pageTheme.accentGlow})`,
                }}
              >
                COMMAND RELAY
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-neutral-300 text-sm sm:text-base md:text-lg font-geist font-normal leading-relaxed max-w-2xl">
              Official communication relays, campus transit vectors, and secretarial support channels for
              TechSrijan &apos;27 at Madan Mohan Malaviya University of Technology, Gorakhpur.
            </p>

            {/* Interactive Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToForm()}
                className={`group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-xs font-montserrat font-bold uppercase tracking-wider ${btnTheme.text} hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border shadow-xl`}
                style={{
                  background: btnTheme.bg,
                  borderColor: btnTheme.border,
                  boxShadow: btnTheme.shadow,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out"
                />
                <PenLine className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12" />
                <span>OPEN TRANSMISSION TERMINAL</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="mailto:techsrijan@mmmut.ac.in"
                className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-4 text-xs font-montserrat font-bold tracking-wider uppercase text-zinc-300 hover:text-white bg-black/60 hover:bg-black/85 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] border border-white/10 hover:border-white/25 shadow-xl"
              >
                <Mail
                  className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: pageTheme.accent }}
                />
                <span>techsrijan@mmmut.ac.in</span>
              </a>
            </div>

            {/* Quick Slogan Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono tracking-widest text-zinc-400 uppercase">
              <span className="flex items-center gap-1.5">
                <span style={{ color: pageTheme.accent }}>✦</span> COORDINATES: 26.7314° N, 83.4331° E
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <span style={{ color: pageTheme.accent }}>✦</span> MMMUT GORAKHPUR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: TACTICAL LIAISON OUTPOSTS (4 DESKS GRID)
          Secretariat, Alliances, Accommodation, Media Desks
          ============================================================ */}
      <section className="relative w-full py-20 lg:py-28 px-6 sm:px-12 lg:px-20 border-t border-white/10 bg-[#07060a]">
        <div className="relative z-10 w-full max-w-[1720px] mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400">
                <span style={{ color: pageTheme.accent }}>✦</span>
                <span>TACTICAL DIRECTIVES · CHANNELS OF AUTHORITY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black tracking-tight text-white uppercase">
                COMMUNICATION DESKS
              </h2>
            </div>
            <p className="text-sm font-geist text-neutral-400 max-w-md">
              Route your query directly to the responsible secretarial desk for priority SLA turnaround.
            </p>
          </div>

          {/* 4 Desks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {LIAISON_DESKS.map((desk) => {
              const isCopied = copiedDesk === desk.id;
              return (
                <div
                  key={desk.id}
                  className="group relative rounded-2xl bg-black/60 backdrop-blur-2xl p-6 sm:p-7 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
                  style={{
                    boxShadow: `0 15px 40px rgba(0, 0, 0, 0.7)`,
                  }}
                >
                  {/* Subtle top corner chamfer glow */}
                  <div
                    className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-300"
                    style={{ borderColor: pageTheme.accent }}
                  />
                  <div
                    className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 rounded-tr-xl transition-colors duration-300"
                    style={{ borderColor: pageTheme.accent }}
                  />

                  {/* Card Content Top */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-md">
                        {desk.callsign}
                      </span>
                      <span
                        className="font-mono text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${pageTheme.accentMuted}`,
                          color: pageTheme.accent,
                        }}
                      >
                        {desk.sla}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-white group-hover:text-zinc-100 transition-colors">
                        {desk.title}
                      </h3>
                      <div className="text-xs font-geist text-zinc-400 mt-1 leading-snug">
                        {desk.subtitle}
                      </div>
                    </div>

                    <p className="text-xs font-geist text-neutral-300 leading-relaxed">
                      {desk.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {desk.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="pt-6 border-t border-white/[0.08] mt-6 flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${desk.email}`}
                      className="flex-1 truncate font-mono text-xs text-white hover:underline flex items-center gap-2 group-hover:text-zinc-200"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: pageTheme.accent }} />
                      <span className="truncate">{desk.email}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(desk.email, desk.id)}
                      className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                      title="Copy email to clipboard"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CYBERNETIC TRANSMISSION TERMINAL (LIVE FORM)
          Blood-Moon Desert Backdrop + Interactive HUD Form Dispatch
          ============================================================ */}
      <section
        ref={formSectionRef}
        id="transmission-terminal"
        className="relative w-full min-h-[95vh] lg:min-h-[105vh] flex items-center overflow-hidden bg-[#07060a] border-t border-white/10"
      >
        {/* Full-Frame Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact/contact-bg-worm.webp"
            alt="Citadel spires glowing beneath desert sand dunes"
            fill
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.05] brightness-90"
          />

          {/* Deep dark gradient on left for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/90 to-transparent w-full lg:w-[68%]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07060a] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Transmission Terminal Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form Section Eyebrow */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400">
                  <span style={{ color: pageTheme.accent }}>✦</span>
                  <span>TERMINAL 01 · DIRECT DISPATCH ENCRYPTED RELAY</span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white leading-tight uppercase">
                  TRANSMISSION
                  <span
                    className="block text-transparent bg-clip-text transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                      filter: `drop-shadow(0 4px 30px ${pageTheme.accentGlow})`,
                    }}
                  >
                    DISPATCH CONSOLE
                  </span>
                </h2>

                <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-geist font-normal max-w-xl">
                  Submit your directive or inquiry below. Encrypted dispatch is logged directly into the
                  conclave command post.
                </p>
              </div>

              {/* HUD Form Console Box */}
              <div
                className="relative rounded-2xl bg-black/75 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 border transition-all duration-500 shadow-2xl"
                style={{
                  borderColor: pageTheme.border,
                  boxShadow: `0 20px 70px rgba(0,0,0,0.85), 0 0 30px ${pageTheme.accentMuted}`,
                }}
              >
                {/* HUD Corner Chamfer Brackets */}
                <div
                  className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 rounded-tl-xl"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 rounded-tr-xl"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 rounded-bl-xl"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 rounded-br-xl"
                  style={{ borderColor: pageTheme.accent }}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Pill Switcher */}
                  <div className="space-y-2">
                    <label
                      className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400"
                    >
                      DIRECTIVE VECTOR / CATEGORY
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_OPTIONS.map((sub) => {
                        const isSelected = formData.subject === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, subject: sub.id }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-white/10 text-white border-white/40 shadow-md font-semibold"
                                : "bg-white/[0.03] text-neutral-400 border-white/[0.08] hover:text-white hover:bg-white/[0.06]"
                            }`}
                            style={isSelected ? { borderColor: pageTheme.accent, color: pageTheme.accentBright } : {}}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 1: Name and Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-sender-name"
                        className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400"
                      >
                        OFFICER / SENDER NAME <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-sender-name"
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Aryan Sharma"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3.5 text-sm font-geist text-white placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-sender-email"
                        className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400"
                      >
                        EMAIL ADDRESS <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-sender-email"
                          type="email"
                          name="email"
                          required
                          placeholder="officer@institute.ac.in"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3.5 text-sm font-geist text-white placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Message */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-sender-message"
                        className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400"
                      >
                        TRANSMISSION CONTENT <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {formData.message.length} / 500 CHARACTERS
                      </span>
                    </div>
                    <div className="relative">
                      <PenLine className="h-4 w-4 text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        id="contact-sender-message"
                        name="message"
                        required
                        maxLength={500}
                        rows={4}
                        placeholder="Detail your inquiry, collegiate delegation roster, or corporate alliance proposal..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3.5 text-sm font-geist text-white placeholder:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Submit Button & Visual HUD Line */}
                  <div className="flex items-center pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className={`group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-xs font-montserrat font-bold uppercase tracking-wider ${btnTheme.text} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-60 overflow-hidden border shadow-xl`}
                      style={{
                        background: btnTheme.bg,
                        borderColor: btnTheme.border,
                        boxShadow: btnTheme.shadow,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out"
                      />
                      {formStatus === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>DISPATCHING TRANSMISSION...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          <span>TRANSMIT DISPATCH</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>

                    <div className="hidden sm:flex items-center flex-1 ml-6">
                      <div
                        className="h-px flex-1 transition-all duration-300"
                        style={{
                          background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                        }}
                      />
                      <span style={{ color: pageTheme.accent }} className="text-sm px-3">
                        ◇
                      </span>
                      <div
                        className="h-px w-12 transition-all duration-300"
                        style={{
                          backgroundColor: pageTheme.border,
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Central Registry & Telemetry Feed */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Official University Secretariat */}
              <div
                className="relative rounded-2xl bg-black/75 backdrop-blur-2xl p-6 sm:p-8 border transition-all duration-300 shadow-2xl space-y-5"
                style={{
                  borderColor: pageTheme.border,
                  boxShadow: `0 15px 45px rgba(0,0,0,0.7), 0 0 20px ${pageTheme.accentMuted}`,
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                    style={{ color: pageTheme.accent }}
                  >
                    <span>✦</span>
                    <span>CENTRAL GOVERNANCE CITADEL</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded">
                    ESTD. 1962
                  </span>
                </div>

                <div className="space-y-4 font-geist text-xs sm:text-sm text-neutral-300">
                  <div className="flex items-start gap-3.5">
                    <Building2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div>
                      <div className="font-montserrat font-bold text-white text-base">
                        Technical Sub-Council (TSC)
                      </div>
                      <div className="text-neutral-400 text-xs">
                        Council of Student Activities (CSA)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div className="text-xs leading-relaxed text-neutral-300">
                      Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur, UP – 273010,
                      India
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div className="text-xs text-neutral-300">
                      Response SLA:{" "}
                      <span className="text-white font-semibold">24–48 Hours Turnaround</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=MMMUT+Gorakhpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" style={{ color: pageTheme.accent }} />
                    <span>LAUNCH CAMPUS SATELLITE MAP</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* Card 2: Social Totem & Channels */}
              <div className="relative rounded-2xl bg-black/75 backdrop-blur-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  OFFICIAL CHANNELS &amp; MEDIA FEEDS
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/techsrijan_mmmut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center font-mono text-xs uppercase tracking-wider text-neutral-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/techsrijan-mmmut/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-center font-mono text-xs uppercase tracking-wider text-neutral-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CAMPUS COORDINATES & LOGISTICS RADAR
          Transit Vectors for Outstation Delegations
          ============================================================ */}
      <section className="relative w-full py-20 lg:py-28 px-6 sm:px-12 lg:px-20 border-t border-white/10 bg-[#07060a]">
        <div className="relative z-10 w-full max-w-[1720px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400">
                <span style={{ color: pageTheme.accent }}>✦</span>
                <span>DELEGATION NAVIGATION · TRANSIT ARTERIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black tracking-tight text-white uppercase">
                CAMPUS COORDINATES &amp; ACCESS
              </h2>
            </div>
            <p className="text-sm font-geist text-neutral-400 max-w-md">
              Gorakhpur is an apex junction connecting eastern Uttar Pradesh, Bihar, and Nepal.
              Here is how outstation contingents reach our arena gates.
            </p>
          </div>

          {/* Transit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Rail Corridor */}
            <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-6 sm:p-7 space-y-4 hover:border-white/25 transition-all shadow-xl">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-xl bg-white/[0.04] border border-white/10"
                  style={{ color: pageTheme.accent }}
                >
                  <Train className="h-6 w-6" />
                </div>
                <span className="font-mono text-xs text-zinc-400">DISTANCE: ~5.2 KM</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-white">
                Gorakhpur Junction (GKP)
              </h3>
              <p className="text-xs sm:text-sm font-geist text-neutral-300 leading-relaxed">
                Direct rail connections from Delhi, Kolkata, Mumbai, Patna, and Lucknow. Auto-rickshaws
                and app cabs operate 24/7 directly to the MMMUT Main Gate.
              </p>
              <div className="font-mono text-[11px] text-zinc-400 pt-2 border-t border-white/[0.06]">
                EST. TRAVEL TIME: ~15 MINUTES
              </div>
            </div>

            {/* Card 2: Air Vector */}
            <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-6 sm:p-7 space-y-4 hover:border-white/25 transition-all shadow-xl">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-xl bg-white/[0.04] border border-white/10"
                  style={{ color: pageTheme.accent }}
                >
                  <Plane className="h-6 w-6" />
                </div>
                <span className="font-mono text-xs text-zinc-400">DISTANCE: ~8.0 KM</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-white">
                Mahayogi Gorakhnath Airport (GOP)
              </h3>
              <p className="text-xs sm:text-sm font-geist text-neutral-300 leading-relaxed">
                Daily flights linking Gorakhpur with New Delhi, Mumbai, Bengaluru, and Hyderabad. Prepaid
                taxis and campus shuttles are readily available outside the terminal.
              </p>
              <div className="font-mono text-[11px] text-zinc-400 pt-2 border-t border-white/[0.06]">
                EST. TRAVEL TIME: ~20 MINUTES
              </div>
            </div>

            {/* Card 3: Arena Ground Post */}
            <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-6 sm:p-7 space-y-4 hover:border-white/25 transition-all shadow-xl">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-xl bg-white/[0.04] border border-white/10"
                  style={{ color: pageTheme.accent }}
                >
                  <Shield className="h-6 w-6" />
                </div>
                <span className="font-mono text-xs text-zinc-400">STATUS: RECEPTION ACTIVE</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-white">
                Student Activity Centre (SAC)
              </h3>
              <p className="text-xs sm:text-sm font-geist text-neutral-300 leading-relaxed">
                The central nerve hub for physical badge pickup, hostel keys, meal vouchers, and security
                clearances. Proceed here immediately upon clearing the main gate.
              </p>
              <div className="font-mono text-[11px] text-zinc-400 pt-2 border-t border-white/[0.06]">
                OPEN 24/7 DURING FESTIVAL DAYS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ MATRIX)
          Categorized Accordions with Responsive Pills
          ============================================================ */}
      <section className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-white/10 bg-[#07060a] overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] opacity-20 transition-all duration-500"
          style={{ background: pageTheme.accentGlow }}
        />

        <div className="relative z-10 w-full max-w-[1720px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="flex items-center gap-3">
              <span style={{ color: pageTheme.accent }} className="text-base leading-none">
                ✦
              </span>
              <span
                style={{ color: pageTheme.accent }}
                className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase"
              >
                TACTICAL INTELLIGENCE &amp; GUIDELINES
              </span>
              <div
                className="h-px w-20"
                style={{
                  background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white leading-tight uppercase">
              <span
                className="text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                  filter: `drop-shadow(0 4px 30px ${pageTheme.accentGlow})`,
                }}
              >
                FREQUENTLY ASKED QUESTIONS
              </span>
            </h2>

            <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-geist font-normal max-w-2xl leading-relaxed">
              Common inquiries on registration, arena guidelines, outstation lodging, and security clearance.
            </p>

            {/* Filter Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeFaqCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveFaqCategory(cat);
                      setOpenFaqIndex(null);
                    }}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-montserrat font-bold tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer border overflow-hidden ${
                      isActive
                        ? `${btnTheme.text} shadow-lg scale-105`
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10 hover:border-white/25 hover:scale-[1.02]"
                    }`}
                    style={
                      isActive
                        ? {
                            background: btnTheme.bg,
                            borderColor: btnTheme.border,
                            boxShadow: btnTheme.shadow,
                          }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accordion List */}
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={`${faq.category}-${idx}`}
                  className="rounded-2xl bg-black/60 backdrop-blur-xl border transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: isOpen ? pageTheme.border : "rgba(255, 255, 255, 0.08)",
                    boxShadow: isOpen
                      ? `0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${pageTheme.accentMuted}`
                      : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <HelpCircle
                        className="h-4 w-4 shrink-0 transition-colors duration-300"
                        style={{ color: isOpen ? pageTheme.accent : "#71717a" }}
                      />
                      <span className="text-sm sm:text-base font-montserrat font-bold text-white tracking-wide group-hover:text-zinc-200 transition-colors">
                        {faq.q}
                      </span>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full border border-white/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      style={
                        isOpen
                          ? {
                              backgroundColor: pageTheme.accent,
                              borderColor: pageTheme.accent,
                              color: "#000000",
                            }
                          : {
                              color: "#ffffff",
                            }
                      }
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 font-geist leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-300 pl-14">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official Conclave Footer */}
      <FestFooter />
    </div>
  );
}

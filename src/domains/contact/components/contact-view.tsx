"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { usePageTheme, type PageThemeConfig, type CanonicalTheme } from "@/core";
import { api } from "@/lib/api";
import { FestFooter } from "@/shared/layout/fest-footer";

const CONTACT_BTN_THEMES: Record<
  CanonicalTheme,
  {
    bg: string;
    border: string;
    shadow: string;
    text: string;
  }
> = {
  "arrakis-day": {
    bg: "linear-gradient(135deg, #E2B755 0%, #D4A843 50%, #9E6B12 100%)",
    border: "rgba(243, 201, 106, 0.75)",
    shadow:
      "0 0 25px rgba(212, 168, 67, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-[#0a0702] font-black",
  },
  "geass-moon": {
    bg: "linear-gradient(135deg, #FF2E36 0%, #D4141C 50%, #8A070B 100%)",
    border: "rgba(255, 82, 89, 0.75)",
    shadow:
      "0 0 25px rgba(255, 30, 39, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
  },
  "krelln-night": {
    bg: "linear-gradient(135deg, #64748B 0%, #475569 50%, #1E293B 100%)",
    border: "rgba(203, 213, 225, 0.65)",
    shadow:
      "0 0 25px rgba(148, 163, 184, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0, 0, 0, 0.5)",
    text: "text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
  },
};

/**
 * Full-Frame Atmospheric Canvas Animation (Dynamic Moon Embers & Ambient Light Blooms)
 * Automatically reacts to the active moon theme color (Gold, Crimson, Cyan).
 */
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

      // Ambient radial warm glow following cursor across full screen
      const grad = ctx.createRadialGradient(mouseX, mouseY, 30, mouseX, mouseY, width * 0.45);
      grad.addColorStop(0, `rgba(${theme.particlePrimary}, 0.07)`);
      grad.addColorStop(0.5, `rgba(${theme.particleSecondary}, 0.02)`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating embers
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

/* FAQ Data from official conclave guidelines */
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
    a: "Any enrolled student with a valid college identity card from any recognized university, institute, or polytechnic. Cross-college teams are permitted and encouraged in flagship events such as RoboWars, Codethon, and CAD Masters.",
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
    a: "Contact our Corporate Alliances team directly via sponsorship.techsrijan@mmmut.ac.in or through the message form above. The secretariat delivers customized pitch decks, booth allocations, and branding packages within 24 hours.",
  },
  {
    category: "EVENTS",
    q: "Whom should I contact in case of emergency during fest days?",
    a: "The central Command Post at the Student Activity Centre (SAC) operates 24/7 with on-ground student conveners, faculty proctors, and a physical medical aid center. You can also dial our central desk at techsrijan@mmmut.ac.in.",
  },
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

  // FAQ State
  const [activeFaqCategory, setActiveFaqCategory] = useState<FaqCategory>("ALL");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const formSectionRef = useRef<HTMLElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      setStatusMessage("Please provide your name, email address, and message.");
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
        res?.message || "Message Received: Our core council will respond within 24–48 hours."
      );
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err: any) {
      setFormStatus("error");
      setStatusMessage(
        err?.message || "Message failed to send. Please reach out via direct email."
      );
    }
  };


  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "ALL") return FAQS;
    return FAQS.filter((f) => f.category === activeFaqCategory);
  }, [activeFaqCategory]);

  return (
    <div className="relative min-h-screen w-full bg-[#07060a] text-white selection:bg-[#79C7E3]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Full-Frame Ambient Embers & Lighting Animation */}
      <ContactFullFrameAtmosphere theme={pageTheme} />

      {/* Floating Status Notification Toast */}
      {formStatus === "sent" && (
        <div className="fixed top-24 right-6 z-50 max-w-md rounded-xl border border-emerald-500/60 bg-emerald-950/90 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] flex items-start gap-3 text-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Message Sent</div>
            <p className="text-xs sm:text-sm mt-0.5">{statusMessage}</p>
          </div>
          <button
            onClick={() => setFormStatus("idle")}
            className="ml-auto text-emerald-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {formStatus === "error" && (
        <div className="fixed top-24 right-6 z-50 max-w-md rounded-xl border border-red-500/60 bg-red-950/90 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] flex items-start gap-3 text-red-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-300">Attention</div>
            <p className="text-xs sm:text-sm mt-0.5">{statusMessage}</p>
          </div>
          <button
            onClick={() => setFormStatus("idle")}
            className="ml-auto text-red-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================
          SECTION 1: FULL-FRAME TOP HERO (GET IN TOUCH)
          Clean 1080p Artwork Background + Dynamic Theme Vector Typography
          ============================================================ */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-[#07060a]">
        {/* Full-Frame Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact/contact-bg-citadel.webp"
            alt="TechSrijan Citadel Commander overlooking the metropolis"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.05] brightness-90"
          />

          {/* Deep dark gradient on left for crystal-clear typography readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/80 to-transparent w-full lg:w-[65%]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6 sm:space-y-8">

            {/* Grand Headline: GET IN TOUCH */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-montserrat font-black tracking-tight text-white leading-[0.92]">
              <span
                className="block text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                  filter: `drop-shadow(0 4px 35px ${pageTheme.accentGlow})`,
                }}
              >
                GET IN
              </span>
              <span
                className="block text-transparent bg-clip-text transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                  filter: `drop-shadow(0 4px 35px ${pageTheme.accentGlow})`,
                }}
              >
                TOUCH
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-neutral-300 text-sm sm:text-base md:text-lg font-geist font-normal leading-relaxed max-w-xl">
              Have a question, collaboration idea or just want to say hi? We would love to hear from you.
            </p>

            {/* Interactive Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className={`group relative inline-flex items-center gap-2.5 rounded-lg px-8 py-3.5 text-xs font-montserrat font-bold uppercase tracking-wider ${btnTheme.text} hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border`}
                style={{
                  background: btnTheme.bg,
                  borderColor: btnTheme.border,
                  boxShadow: btnTheme.shadow,
                }}
              >
                {/* Subtle reflective light sheen on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out"
                />
                <PenLine className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-12" />
                <span>SEND A MESSAGE</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="mailto:techsrijan@mmmut.ac.in"
                className="group inline-flex items-center gap-2.5 rounded-lg px-6 py-3.5 text-xs font-montserrat font-bold tracking-wider uppercase text-zinc-300 hover:text-white bg-black/60 hover:bg-black/85 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] border shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                style={{
                  borderColor: pageTheme.border,
                }}
              >
                <Mail className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: pageTheme.accent }} />
                <span>techsrijan@mmmut.ac.in</span>
              </a>
            </div>

            {/* Quick Slogan Bar */}
            <div className="pt-8 flex items-center gap-6 text-xs font-bebas tracking-[0.25em] text-zinc-400 uppercase">
              <span>PEOPLE</span>
              <span style={{ color: pageTheme.accent }}>✦</span>
              <span>IDEAS</span>
              <span style={{ color: pageTheme.accent }}>✦</span>
              <span>IMPACT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: FULL-FRAME MESSAGE TRANSMISSION (FORM)
          Clean Blood-Moon Night Artwork + Live Interactive HUD Form
          ============================================================ */}
      <section
        ref={formSectionRef}
        id="transmission-form"
        className="relative w-full min-h-[95vh] lg:min-h-[105vh] flex items-center overflow-hidden bg-[#07060a]"
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

          {/* Deep dark gradient on left for crystal-clear HUD form readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/85 to-transparent w-full lg:w-[68%]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07060a] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Form Header & Live Form */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Form Section Eyebrow */}
              <div className="space-y-3">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-black tracking-tight text-white leading-tight">
                  <span
                    className="text-transparent bg-clip-text transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.headingVia} 45%, ${pageTheme.headingTo} 100%)`,
                      filter: `drop-shadow(0 4px 30px ${pageTheme.accentGlow})`,
                    }}
                  >
                    SEND US A MESSAGE
                  </span>
                </h2>

                <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-geist font-normal max-w-lg">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              {/* HUD Form Box with Dynamic Moon Border & Glowing Accents */}
              <div
                className="relative rounded-2xl bg-black/60 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] max-w-2xl transition-all duration-500"
                style={{
                  border: `1px solid ${pageTheme.border}`,
                  boxShadow: `0 20px 70px rgba(0,0,0,0.85), 0 0 30px ${pageTheme.accentMuted}`,
                }}
              >
                {/* Subtle corner notches */}
                <div
                  className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-500"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 rounded-tr-xl transition-colors duration-500"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 rounded-bl-xl transition-colors duration-500"
                  style={{ borderColor: pageTheme.accent }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 rounded-br-xl transition-colors duration-500"
                  style={{ borderColor: pageTheme.accent }}
                />

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name and Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        className="block font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                        style={{ color: pageTheme.accent }}
                      >
                        YOUR NAME
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-black/70 pl-10 pr-3.5 py-3 text-sm font-geist text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                          style={{
                            outlineColor: pageTheme.accent,
                          }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        className="block font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                        style={{ color: pageTheme.accent }}
                      >
                        YOUR EMAIL
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-black/70 pl-10 pr-3.5 py-3 text-sm font-geist text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                          style={{
                            outlineColor: pageTheme.accent,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Subject */}
                  <div className="space-y-1.5">
                    <label
                      className="block font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                      style={{ color: pageTheme.accent }}
                    >
                      SUBJECT
                    </label>
                    <div className="relative">
                      <MessageSquare className="h-4 w-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-black/70 pl-10 pr-4 py-3 text-sm font-geist text-white focus:outline-none transition-colors cursor-pointer [&>option]:bg-[#120f17] [&>option]:text-white"
                        style={{
                          outlineColor: pageTheme.accent,
                        }}
                      >
                        <option value="General Inquiry">What is this about? (General Inquiry)</option>
                        <option value="Events & Battle Arenas">Events &amp; Arena Competitions</option>
                        <option value="Corporate Sponsorships">Corporate Alliances &amp; Sponsorship</option>
                        <option value="Campus Accommodation">Campus Passes &amp; Delegation Stay</option>
                        <option value="Media & Press">Media &amp; Press Accreditation</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="block font-bebas text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300"
                        style={{ color: pageTheme.accent }}
                      >
                        MESSAGE
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.message.length} / 500
                      </span>
                    </div>
                    <div className="relative">
                      <PenLine className="h-4 w-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        name="message"
                        required
                        maxLength={500}
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-black/70 pl-10 pr-4 py-3 text-sm font-geist text-white placeholder:text-zinc-500 focus:outline-none transition-colors resize-none"
                        style={{
                          outlineColor: pageTheme.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Submit Button with Trailing Dynamic Moon Line */}
                  <div className="flex items-center pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className={`group relative inline-flex items-center gap-2.5 rounded-lg px-8 py-3.5 text-xs font-montserrat font-bold uppercase tracking-wider ${btnTheme.text} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-60 overflow-hidden border`}
                      style={{
                        background: btnTheme.bg,
                        borderColor: btnTheme.border,
                        boxShadow: btnTheme.shadow,
                      }}
                    >
                      {/* Subtle reflective light sheen on hover */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out"
                      />
                      {formStatus === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          <span>SEND MESSAGE</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>

                    {/* Trailing Dynamic Line with Diamond Accent */}
                    <div className="hidden sm:flex items-center flex-1 ml-6">
                      <div
                        className="h-px flex-1 transition-all duration-300"
                        style={{
                          background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                        }}
                      />
                      <span style={{ color: pageTheme.accent }} className="text-sm px-3 transition-colors duration-300">◇</span>
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
            {/* Right Column: Official Registry, Secretariat & Network Directives */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Official University Secretariat */}
              <div
                className="relative rounded-2xl bg-black/60 backdrop-blur-2xl p-6 sm:p-7 border transition-all duration-300 shadow-xl"
                style={{
                  borderColor: pageTheme.border,
                  boxShadow: `0 15px 45px rgba(0,0,0,0.7), 0 0 20px ${pageTheme.accentMuted}`,
                }}
              >
                <div className="flex items-center gap-2 font-bebas text-xs sm:text-sm tracking-[0.2em] uppercase transition-colors" style={{ color: pageTheme.accent }}>
                  <span>✦</span>
                  <span>CENTRAL SECRETARIAT</span>
                </div>

                <div className="mt-3 space-y-3 font-geist text-xs sm:text-sm text-neutral-300">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div>
                      <div className="font-semibold text-white">Technical Sub-Council (TSC)</div>
                      <div className="text-neutral-400 text-xs">Council of Student Activities (CSA)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div className="text-xs leading-relaxed text-neutral-300">
                      Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur, UP - 273010, India
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 shrink-0 mt-0.5" style={{ color: pageTheme.accent }} />
                    <div className="text-xs text-neutral-300">
                      Response SLA: <span className="text-white font-medium">24–48 Hours Turnaround</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Direct Desks & Emergency */}
              <div className="relative rounded-2xl bg-black/60 backdrop-blur-2xl p-6 sm:p-7 border border-white/10 transition-all duration-300 shadow-xl space-y-4">
                <div className="font-bebas text-xs sm:text-sm tracking-[0.2em] uppercase text-neutral-400">
                  DIRECT DESK CONTACTS
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-geist">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">General Inquiries</div>
                      <a href="mailto:techsrijan@mmmut.ac.in" className="text-white font-medium hover:underline">
                        techsrijan@mmmut.ac.in
                      </a>
                    </div>
                    <a href="mailto:techsrijan@mmmut.ac.in" aria-label="Email General Inquiries" className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 transition-colors">
                      <Mail className="h-3.5 w-3.5 text-neutral-300" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">Corporate &amp; Alliances</div>
                      <a href="mailto:sponsorship.techsrijan@mmmut.ac.in" className="text-white font-medium hover:underline">
                        sponsorship.techsrijan@mmmut.ac.in
                      </a>
                    </div>
                    <a href="mailto:sponsorship.techsrijan@mmmut.ac.in" aria-label="Email Sponsorship" className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 transition-colors">
                      <Mail className="h-3.5 w-3.5 text-neutral-300" />
                    </a>
                  </div>
                </div>

                {/* Social Connect Pills */}
                <div className="pt-2 border-t border-white/[0.07] flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/techsrijan_mmmut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center font-mono text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="h-2.5 w-2.5 text-neutral-400" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/techsrijan-mmmut/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center font-mono text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="h-2.5 w-2.5 text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FULL-WIDTH FREQUENTLY ASKED QUESTIONS (FAQ)
          Spanning Full Width with Responsive Categorization & Accordions
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
              <span style={{ color: pageTheme.accent }} className="text-base leading-none transition-colors duration-300">✦</span>
              <span
                style={{ color: pageTheme.accent }}
                className="font-bebas text-base sm:text-lg tracking-[0.25em] uppercase transition-colors duration-300"
              >
                COMMON INQUIRIES
              </span>
              <div
                className="h-px w-20 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-black tracking-tight text-white leading-tight">
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

          {/* Full-Width Accordion List */}
          <div className="w-full max-w-5xl mx-auto space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={`${faq.category}-${idx}`}
                  className="rounded-2xl bg-black/60 backdrop-blur-xl border transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: isOpen ? pageTheme.border : "rgba(255, 255, 255, 0.08)",
                    boxShadow: isOpen ? `0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${pageTheme.accentMuted}` : "none",
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

      {/* Reusable Conclave Footer */}
      <FestFooter />
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { usePageTheme, type PageThemeConfig } from "@/core";

/* Social Icon SVGs */
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

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

    let time = 0;
    const render = () => {
      time += 0.01;
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

export function ContactView() {
  const pageTheme = usePageTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

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
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setFormStatus("sent");
      setStatusMessage("Transmission Received: Our core council will respond within 24–48 hours.");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      setFormStatus("error");
      setStatusMessage("Transmission failed. Please dispatch via direct email.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07060a] text-white selection:bg-[#79C7E3]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Full-Frame Ambient Embers & Lighting Animation */}
      <ContactFullFrameAtmosphere theme={pageTheme} />

      {/* Floating Status Notification Toast */}
      {formStatus === "sent" && (
        <div className="fixed top-24 right-6 z-50 max-w-md rounded-xl border border-emerald-500/60 bg-emerald-950/90 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] flex items-start gap-3 text-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Transmission Logged</div>
            <p className="text-xs sm:text-sm mt-0.5">{statusMessage}</p>
          </div>
          <button
            onClick={() => setFormStatus("idle")}
            className="ml-auto text-emerald-400 hover:text-white text-xs font-bold"
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
            className="ml-auto text-red-400 hover:text-white text-xs font-bold"
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
            src="/images/contact/contact-hero-bg-clean.jpg"
            alt="TechSrijan Citadel Commander overlooking the alien metropolis"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.05] brightness-90"
          />

          {/* Deep dark gradient on left for crystal-clear typography readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/80 to-transparent w-full lg:w-[65%]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content (Full-Frame Edge Spacing) */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6 sm:space-y-8">
            {/* Eyebrow Label with Compass Star & Trailing Line */}
            <div className="flex items-center gap-3">
              <span style={{ color: pageTheme.accent }} className="text-base leading-none transition-colors duration-300">✦</span>
              <span
                style={{ color: pageTheme.accent }}
                className="font-bebas text-base sm:text-lg tracking-[0.25em] uppercase transition-colors duration-300"
              >
                CONTACT US
              </span>
              <div
                className="h-px w-28 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                }}
              />
            </div>

            {/* Grand Headline: GET IN TOUCH (Montserrat with Moon Theme Dynamic Gradient) */}
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

            {/* Editorial Subtitle (Chancery Italic) */}
            <p className="text-zinc-200 text-lg sm:text-xl md:text-2xl font-chancery leading-relaxed max-w-xl">
              Have a question, collaboration idea or just want to say hi? We would love to hear from you.
            </p>

            {/* Thematic Directives (Bebas Neue) */}
            <div
              className="flex items-center gap-3 pt-4 font-bebas text-sm sm:text-base tracking-[0.35em] uppercase transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              <span>PEOPLE</span>
              <span>•</span>
              <span>IDEAS</span>
              <span>•</span>
              <span>IMPACT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: FULL-FRAME MESSAGE TRANSMISSION (FORM)
          Clean Blood-Moon Night Artwork + Live Interactive HUD Form
          ============================================================ */}
      <section className="relative w-full min-h-[95vh] lg:min-h-[105vh] flex items-center overflow-hidden bg-[#07060a]">
        {/* Full-Frame Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact/contact-form-bg-clean.jpg"
            alt="Blood moon night citadel with commander on the parapet"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.08] brightness-90"
          />

          {/* Deep dark gradient on left for the form area */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/85 to-transparent w-full lg:w-[65%]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07060a] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Form Header & Live Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form Section Eyebrow */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span style={{ color: pageTheme.accent }} className="text-base leading-none transition-colors duration-300">✦</span>
                  <span
                    style={{ color: pageTheme.accent }}
                    className="font-bebas text-base sm:text-lg tracking-[0.25em] uppercase transition-colors duration-300"
                  >
                    CONTACT US
                  </span>
                  <div
                    className="h-px w-28 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, ${pageTheme.accent}, transparent)`,
                    }}
                  />
                </div>

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

                <p className="text-zinc-300 text-base sm:text-lg font-chancery max-w-lg">
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
                          placeholder="Enter your full name"
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
                          placeholder="you@domain.com"
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
                        <option value="Events & Battle Arenas">Events & Arena Competitions</option>
                        <option value="Corporate Sponsorships">Corporate Alliances & Sponsorship</option>
                        <option value="Campus Accommodation">Campus Passes & Delegation Stay</option>
                        <option value="Media & Press">Media & Press Accreditation</option>
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
                        placeholder="Write your message here..."
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
                      className={`inline-flex items-center gap-2.5 rounded-lg px-8 py-3.5 text-xs font-montserrat font-bold uppercase tracking-wider ${pageTheme.btnText} hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60`}
                      style={{
                        backgroundImage: `linear-gradient(to right, ${pageTheme.headingTo}, ${pageTheme.accentBright}, ${pageTheme.headingTo})`,
                        boxShadow: `0 0 30px ${pageTheme.accentGlow}`,
                      }}
                    >
                      {formStatus === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>SEND MESSAGE</span>
                          <ArrowUpRight className="h-4 w-4" />
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

            {/* Right Column: Floating Slogan in Front of the Citadel Art */}
            <div className="lg:col-span-5 flex flex-col justify-end items-end text-right space-y-4 pt-10 lg:pt-0">
              <div
                className="space-y-1.5 font-bebas text-lg sm:text-2xl tracking-[0.25em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                <div>IDEAS</div>
                <div>PEOPLE</div>
                <div>IMPACT</div>
                <div className="text-white pt-2">LET&apos;S BUILD</div>
                <div className="text-white">TOGETHER.</div>
              </div>
              <div style={{ color: pageTheme.accent }} className="text-lg transition-colors duration-300">✦</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FULL-FRAME PANORAMIC FOOTER & DIRECTIVES
          Clean Sunset Mountain Artwork + Live Vector Links & Brand
          ============================================================ */}
      <footer className="relative w-full overflow-hidden bg-[#07060a]">
        {/* Full-Frame Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact/contact-footer-bg-clean.jpg"
            alt="Panoramic sunset desert canyon and glowing citadel towers"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full filter contrast-[1.05] brightness-90"
          />

          {/* Deep dark gradient on left for crystal-clear navigation legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/85 to-transparent w-full lg:w-[65%]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07060a] to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 pt-20 sm:pt-28 pb-10">
          {/* Main 4-Column Navigation Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b transition-colors duration-300"
            style={{ borderColor: pageTheme.border }}
          >
            {/* Col 1: Brand & Socials (4.5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <span className="font-montserrat font-black text-2xl sm:text-3xl tracking-wider text-white uppercase">
                    TECH<span style={{ color: pageTheme.accent }} className="text-xl inline-block -translate-y-0.5 transition-colors duration-300">✳</span>SRIJAN
                  </span>
                </Link>
                <div
                  className="font-bebas text-sm tracking-[0.25em] uppercase mt-1 transition-colors duration-300"
                  style={{ color: pageTheme.accent }}
                >
                  IMPERIUM : REQUIEM
                </div>
              </div>

              <p className="text-base text-zinc-300 font-chancery leading-relaxed max-w-sm">
                A confluence of ideas, innovation and impact. Building a tomorrow that dares to be different.
              </p>

              {/* Social Icons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {[
                    {
                      icon: IconInstagram,
                      label: "Instagram",
                      href: "https://www.instagram.com/techsrijan_mmmut",
                    },
                    {
                      icon: IconLinkedin,
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/school/mmmutgorakhpur",
                    },
                    {
                      icon: IconX,
                      label: "X (Twitter)",
                      href: "https://twitter.com",
                    },
                    {
                      icon: IconYoutube,
                      label: "YouTube",
                      href: "https://youtube.com",
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/15 text-zinc-300 hover:scale-105 transition-all"
                      style={{
                        borderColor: "rgba(255,255,255,0.15)",
                      }}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <div className="font-bebas text-xs tracking-[0.25em] text-zinc-400 uppercase">
                  FOLLOW OUR JOURNEY
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links (2.5 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="flex items-center gap-2 font-bebas text-base tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                <span>✦</span>
                <span>QUICK LINKS</span>
              </div>
              <ul className="space-y-2.5 text-sm font-geist text-zinc-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-white transition-colors">Events</Link>
                </li>
                <li>
                  <Link href="/sponsors" className="hover:text-white transition-colors">Sponsors</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors text-white font-medium">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Useful Links (2.5 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="flex items-center gap-2 font-bebas text-base tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                <span>✦</span>
                <span>USEFUL LINKS</span>
              </div>
              <ul className="space-y-2.5 text-sm font-geist text-zinc-300">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About TechSrijan</Link>
                </li>
                <li>
                  <Link href="/rules" className="hover:text-white transition-colors">Code of Conduct</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/team" className="hover:text-white transition-colors">Core Team Roster</Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Get In Touch (2.5 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div
                className="flex items-center gap-2 font-bebas text-base tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                <span>✦</span>
                <span>GET IN TOUCH</span>
              </div>
              
              <div className="space-y-2 text-sm font-geist text-zinc-300">
                <a
                  href="mailto:techsrijan@mmmut.ac.in"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                  style={{ color: pageTheme.accent }}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="font-medium underline underline-offset-4 group-hover:decoration-white">
                    techsrijan@mmmut.ac.in
                  </span>
                </a>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  For general queries and collaborations.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  Stay connected for updates, announcements and more.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip with Central Imperial Insignia */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-zinc-400">
            <div>
              © 2026 TechSrijan. All Rights Reserved.
            </div>

            {/* Central Imperial Winged Crest Marker */}
            <div className="hidden md:flex items-center gap-4 transition-colors duration-300" style={{ color: pageTheme.accent }}>
              <div
                className="h-px w-20"
                style={{
                  background: `linear-gradient(to right, transparent, ${pageTheme.accent})`,
                }}
              />
              <span className="text-sm font-serif">❖</span>
              <div
                className="h-px w-20"
                style={{
                  background: `linear-gradient(to left, transparent, ${pageTheme.accent})`,
                }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span>MADE WITH PASSION AT MMMUT</span>
              <span style={{ color: pageTheme.accent }}>✦</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

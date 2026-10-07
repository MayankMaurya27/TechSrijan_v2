"use client";

import { useState } from "react";
import {
  Target,
  Trophy,
  Cpu,
  Tv,
  Building2,
  Layers,
  Download,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Radio,
  Flame,
} from "lucide-react";
import { Button } from "@/shared";

// ─── Telemetry Strip Metrics ────────────────────────────────────────────────
const TELEMETRY_STATS = [
  { value: "60+ YRS", label: "INSTITUTIONAL LEGACY", sub: "ESTD. 1962 MMMUT" },
  { value: "NAAC 'A'", label: "ACCREDITED RIGOR", sub: "UGC / NBA RANKED" },
  { value: "25,000+", label: "CAMPUS FOOTFALL", sub: "NORTH INDIA HUB" },
  { value: "120+", label: "COLLEGES JOINING", sub: "IITS, NITS & IIITS" },
];

// ─── Compact Narrative ROI Deliverables ─────────────────────────────────────
const ROI_PILLARS = [
  {
    icon: Target,
    code: "ROI-01",
    title: "Direct Talent Pipeline",
    brief: "Access verified engineering resumes, host on-spot hiring booths, and recruit hackathon finalists.",
    chips: ["RESUME REPO", "ON-SPOT INTERVIEWS", "DEVELOPER HIRES"],
  },
  {
    icon: Building2,
    code: "ROI-02",
    title: "Campus Arena Presence",
    brief: "High-density physical experiential zones and canopy booths across the 300+ acre university campus.",
    chips: ["EXPERIENCE STALLS", "AVENUE ARCHES", "CAMPUS DOMINANCE"],
  },
  {
    icon: Trophy,
    code: "ROI-03",
    title: "Flagship Challenge Title",
    brief: "Co-brand marquee hackathons or Robo-Wars. Pose custom technical problem statements to top builders.",
    chips: ["TRACK TITLE", "CUSTOM PROBLEMS", "JURY CITATION"],
  },
  {
    icon: Cpu,
    code: "ROI-04",
    title: "Developer Evangelism",
    brief: "Conduct hands-on masterclasses and distribute cloud credits / APIs directly to student innovators.",
    chips: ["HANDS-ON WORKSHOPS", "API ADOPTION", "TECH TALKS"],
  },
  {
    icon: Tv,
    code: "ROI-05",
    title: "Main Stage Pro-Nights",
    brief: "Massive headline exposure across stadium LED walls during celebrity and musical evenings.",
    chips: ["STADIUM LED WALLS", "8,000+ NIGHTLY", "PR AFTERMOVIE"],
  },
  {
    icon: Layers,
    code: "ROI-06",
    title: "Digital Ecosystem Reach",
    brief: "Multi-channel branding across 3D holographic passes, event web app, badges, and social media blitz.",
    chips: ["1.5M+ IMPRESSIONS", "3D PASS LOGO", "OFFICIAL MERCH"],
  },
];

// ─── Compact Geass-Themed Collaboration Tracks ──────────────────────────────
const COLLABORATION_TRACKS = [
  {
    id: "TITLE",
    tierCode: "GEASS // T-01",
    title: "Title Partner",
    badge: "SUPREME PATRON",
    summary: "Ultimate marquee prominence. 'TechSrijan'27 Presented by [Your Brand]' across all national media, stadium arches, and passes.",
    chips: ["MARQUEE HEADLINE", "STADIUM LED", "TALENT ACCESS", "VIP SUITE"],
    glowClass: "border-[#FF1E27]/50 shadow-[0_0_20px_rgba(255,30,39,0.2)] bg-[#180509]/80",
    badgeColor: "text-[#FF1E27] border-[#FF1E27]/60 bg-[#FF1E27]/10",
  },
  {
    id: "POWERED_BY",
    tierCode: "GEASS // T-02",
    title: "Powered-By Partner",
    badge: "CO-HEADLINE",
    summary: "High-tier co-branding on flagship competitive arenas, secondary main-stage backdrops, and premier campus pavilion allocation.",
    chips: ["CO-HEADLINE", "ARENA BRANDING", "PR SPOTLIGHT", "PREMIUM STALL"],
    glowClass: "border-red-900/40 hover:border-[#FF1E27]/60 bg-[#120407]/70",
    badgeColor: "text-red-400 border-red-500/40 bg-red-950/40",
  },
  {
    id: "HACKATHON",
    tierCode: "GEASS // T-03",
    title: "Arena & Hackathon Host",
    badge: "CHALLENGE TITLE",
    summary: "Exclusive track ownership for 36-hour national hackathon or Robo-Wars. Pose proprietary problem statements directly to teams.",
    chips: ["CHALLENGE TITLE", "CUSTOM BRIEF", "SCOUTING CONDUIT"],
    glowClass: "border-red-900/40 hover:border-[#FF1E27]/60 bg-[#120407]/70",
    badgeColor: "text-red-400 border-red-500/40 bg-red-950/40",
  },
  {
    id: "TECH_INKIND",
    tierCode: "GEASS // T-04",
    title: "Technology & In-Kind",
    badge: "STACK PARTNER",
    summary: "Empower participants with developer tool licenses, cloud credits, compute, hardware kits, or logistics support.",
    chips: ["DEV ADOPTION", "API EVANGELISM", "CREDIT SPONSOR"],
    glowClass: "border-red-900/40 hover:border-[#FF1E27]/60 bg-[#120407]/70",
    badgeColor: "text-red-400 border-red-500/40 bg-red-950/40",
  },
  {
    id: "WORKSHOP",
    tierCode: "GEASS // T-05",
    title: "Symposium & Keynote",
    badge: "KNOWLEDGE TRACK",
    summary: "Host corporate developer keynotes, tech talks, panel discussions, and masterclasses for 300+ developers per session.",
    chips: ["KEYNOTE SLOT", "PRODUCT DEMO", "DEVELOPER WORKSHOP"],
    glowClass: "border-red-900/40 hover:border-[#FF1E27]/60 bg-[#120407]/70",
    badgeColor: "text-red-400 border-red-500/40 bg-red-950/40",
  },
  {
    id: "ASSOCIATE",
    tierCode: "GEASS // T-06",
    title: "Ecosystem Partner",
    badge: "BRAND ALLIANCE",
    summary: "Strategic logo placement across fest merchandise (hoodies, lanyards, kits), digital web presence, and participation certificates.",
    chips: ["LANYARD LOGO", "SWAG INCLUSION", "CERTIFICATE CREDS"],
    glowClass: "border-red-900/40 hover:border-[#FF1E27]/60 bg-[#120407]/70",
    badgeColor: "text-red-400 border-red-500/40 bg-red-950/40",
  },
];

// ─── Executive Secretariat Direct Contacts ────────────────────────────────────
const SECRETARIAT_CONTACTS = [
  {
    title: "CORPORATE PARTNERSHIP CELL",
    name: "Corporate Relations Secretariat",
    council: "Technical Sub Council (TSC) MMMUT",
    email: "techsrijan@mmmut.ac.in",
    phone: "+91 551 227 3958",
  },
  {
    title: "FESTIVAL CONVENER LIAISON",
    name: "Executive Convener Office",
    council: "TSC Executive Committee",
    email: "support.techsrijan@mmmut.ac.in",
    phone: "+91 94500 00000",
  },
];

export function SponsorsPageView() {
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    workEmail: "",
    contactPhone: "",
    collaborationTrack: "Title Partner",
    strategicNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(
      `TechSrijan 2026 Sponsorship Inquiry: ${formData.companyName} [${formData.collaborationTrack}]`
    );
    const body = encodeURIComponent(
      `Organization: ${formData.companyName}\n` +
        `Representative: ${formData.representativeName}\n` +
        `Work Email: ${formData.workEmail}\n` +
        `Phone/WhatsApp: ${formData.contactPhone}\n` +
        `Interested Track: ${formData.collaborationTrack}\n\n` +
        `Strategic Objectives / Custom Requirements:\n${formData.strategicNotes}\n`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.location.href = `mailto:techsrijan@mmmut.ac.in?subject=${subject}&body=${body}`;
    }, 500);
  };

  const handleTrackSelect = (trackTitle: string) => {
    setFormData((prev) => ({ ...prev, collaborationTrack: trackTitle }));
    const element = document.getElementById("inquiry-terminal");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-10 mx-auto max-w-7xl font-sans pb-24 text-[var(--text-primary)]">
      {/* ─── 1. Compact Geass Hero Header ─── */}
      <div className="relative border-b border-red-900/30 pb-8 mb-10 overflow-hidden">
        {/* Subtle Ambient Geass Crimson Glow in Background */}
        <div className="pointer-events-none absolute -top-20 right-0 w-96 h-96 rounded-full bg-[#FF1E27]/10 blur-[100px] -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Geass Live Radar Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF1E27]/40 bg-[#FF1E27]/10 text-[#FF1E27] font-mono text-[10px] tracking-[0.25em] uppercase mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1E27]" />
              </span>
              <span>GEASS DIRECTIVE // CORPORATE PROSPECTUS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              PARTNER WITH THE <span className="text-[#FF1E27] drop-shadow-[0_0_20px_rgba(255,30,39,0.5)]">IMPERIUM</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-mono max-w-xl">
              Annual Technical Fest of Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur. Connect with 25,000+ student engineers across North India through bespoke engagement tracks.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 font-mono">
            <a href="#inquiry-terminal">
              <Button size="sm" className="bg-[#C80014] hover:bg-[#FF1E27] text-white border border-[#FF1E27] font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(200,0,20,0.4)]">
                <span>CONNECT WITH US</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
            <a href="mailto:techsrijan@mmmut.ac.in?subject=Request%20TechSrijan%202026%20Sponsorship%20Brochure">
              <Button variant="outline" size="sm" className="border-red-900/60 hover:border-red-500 font-bold text-xs tracking-widest uppercase text-white bg-black/40">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                <span>BROCHURE (PDF)</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 2. Compact Telemetry Strip (Replacing bulky 4-card block) ─── */}
      <section className="mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-red-950/60 bg-[#0e0407]/90 rounded-md p-3 sm:p-4 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.5)] font-mono">
          {TELEMETRY_STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`p-2.5 ${idx !== 0 ? "md:border-l md:border-red-900/30" : ""} flex flex-col justify-center`}
            >
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                <span className="text-[#FF1E27] drop-shadow-[0_0_8px_rgba(255,30,39,0.4)]">›</span>
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-red-200/90 tracking-widest uppercase mt-0.5">
                {stat.label}
              </div>
              <div className="text-[9px] text-[var(--text-muted)] tracking-wider uppercase">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. Narrative ROI Matrix (Compact & Punchy) ─── */}
      <section className="mb-14">
        <div className="flex items-center justify-between border-b border-red-900/30 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#FF1E27] animate-pulse" />
            <h2 className="text-xs font-mono tracking-[0.25em] uppercase font-bold text-white">
              NARRATIVE RETURN ON INVESTMENT <span className="text-neutral-500">// DELIVERABLES</span>
            </h2>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-red-400/80 tracking-widest uppercase">
            // MEASURABLE STRATEGIC IMPACT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROI_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded border border-red-950/70 bg-[#0e0407]/80 hover:border-[#FF1E27]/50 p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,30,39,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="h-8 w-8 rounded border border-red-500/30 bg-red-950/40 flex items-center justify-center text-[#FF1E27] group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-neutral-500 group-hover:text-red-400 transition-colors">
                      [{item.code}]
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-1.5 group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {item.brief}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-red-950/60 font-mono">
                  {item.chips.map((chip, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[9px] tracking-wider uppercase bg-white/5 border border-white/10 text-neutral-300"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. Geass-Themed Collaboration Tracks (Redesigned & Catchy) ─── */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-red-900/30 pb-3 mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#FF1E27]" />
              <h2 className="text-xs font-mono tracking-[0.25em] uppercase font-bold text-white">
                CUSTOM COLLABORATION TRACKS
              </h2>
            </div>
            <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-1">
              Commercial scopes are customized person-to-person to match your hiring, brand, or technology roadmap.
            </p>
          </div>
          <div className="font-mono text-[9px] tracking-widest text-[#FF1E27] uppercase">
            // NO FIXED AMOUNTS · DISCUSSIONS IN-PERSON
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLLABORATION_TRACKS.map((track) => (
            <div
              key={track.id}
              className={`group relative rounded border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between ${track.glowClass}`}
            >
              {/* Corner Geass Laser Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF1E27]/60 group-hover:bg-[#FF1E27] transition-colors" />
              </div>

              <div>
                {/* Header Tag & Tier Code */}
                <div className="flex items-center justify-between mb-2 font-mono">
                  <span className="text-[9px] tracking-widest text-neutral-500 font-bold group-hover:text-red-400 transition-colors">
                    {track.tierCode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase border ${track.badgeColor}`}
                  >
                    {track.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-black text-base text-white uppercase tracking-wider mb-2 group-hover:text-red-300 transition-colors">
                  {track.title}
                </h3>

                {/* Compact 1-line Summary */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {track.summary}
                </p>

                {/* Tactical Feature Chips */}
                <div className="flex flex-wrap gap-1.5 mb-5 font-mono">
                  {track.chips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-[9px] tracking-widest uppercase px-2 py-0.5 rounded bg-black/60 border border-red-900/30 text-neutral-300"
                    >
                      + {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleTrackSelect(track.title)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded border border-red-800/40 bg-black/50 hover:bg-[#C80014] hover:border-[#FF1E27] hover:text-white font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 text-neutral-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <span>SELECT TRACK</span>
                <ArrowRight className="h-3 w-3 text-[#FF1E27] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. Interactive Transmission Terminal (Inquiry + Secretariat) ─── */}
      <section id="inquiry-terminal" className="mb-14 scroll-mt-24">
        <div className="border-b border-red-900/30 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF1E27] animate-pulse" />
            <h2 className="text-xs font-mono tracking-[0.25em] uppercase font-bold text-white">
              TRANSMISSION TERMINAL <span className="text-neutral-500">// INQUIRY CONDUIT</span>
            </h2>
          </div>
          <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-1">
            Initiate communication with the Corporate Relations Secretariat for MoUs or tailored scopes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Terminal Form (7 cols) */}
          <div className="lg:col-span-7 rounded border border-red-900/40 bg-[#0e0407]/90 p-5 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
            {isSubmitted ? (
              <div className="py-10 text-center flex flex-col items-center font-mono">
                <div className="h-12 w-12 rounded-full border border-[#FF1E27] bg-red-950/40 flex items-center justify-center text-[#FF1E27] mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  TRANSMISSION INITIALIZED
                </h3>
                <p className="mt-2 text-xs text-neutral-400 max-w-md leading-relaxed">
                  Your inquiry has been formulated. If your mail client did not launch, send directly to{" "}
                  <a href="mailto:techsrijan@mmmut.ac.in" className="text-[#FF1E27] underline font-bold">
                    techsrijan@mmmut.ac.in
                  </a>
                  .
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-5 uppercase font-bold text-[10px] tracking-widest border-red-800 text-white"
                >
                  TRANSMIT ANOTHER INQUIRY
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                      ORGANIZATION / BRAND *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corporation"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded border border-red-950/80 bg-black/70 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                      REPRESENTATIVE NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe (VP Partnerships)"
                      value={formData.representativeName}
                      onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                      className="w-full rounded border border-red-950/80 bg-black/70 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                      WORK EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full rounded border border-red-950/80 bg-black/70 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                      PHONE / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full rounded border border-red-950/80 bg-black/70 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                    COLLABORATION TRACK OF INTEREST
                  </label>
                  <select
                    value={formData.collaborationTrack}
                    onChange={(e) => setFormData({ ...formData, collaborationTrack: e.target.value })}
                    className="w-full rounded border border-red-950/80 bg-black/80 px-3 py-2 text-xs text-white focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all"
                  >
                    {COLLABORATION_TRACKS.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title} ({t.tierCode})
                      </option>
                    ))}
                    <option value="Custom Partnership Scope">Custom Partnership (Bespoke Scope)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
                    STRATEGIC OBJECTIVES (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specific deliverables, recruitment focus, or custom event ideas..."
                    value={formData.strategicNotes}
                    onChange={(e) => setFormData({ ...formData, strategicNotes: e.target.value })}
                    className="w-full rounded border border-red-950/80 bg-black/70 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/50 focus:outline-none transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="default"
                  className="w-full bg-[#C80014] hover:bg-[#FF1E27] text-white border border-[#FF1E27] uppercase font-bold tracking-widest text-xs shadow-[0_0_15px_rgba(200,0,20,0.3)] transition-all cursor-pointer"
                >
                  <Send className="mr-2 h-3.5 w-3.5" />
                  <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT INQUIRY DIRECTIVE"}</span>
                </Button>
              </form>
            )}
          </div>

          {/* Direct Relays & Secretariat (5 cols) */}
          <div className="lg:col-span-5 space-y-3 font-mono">
            <div className="rounded border border-red-900/30 bg-[#0e0407]/90 p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <span className="text-[9px] tracking-[0.25em] text-[#FF1E27] uppercase font-bold flex items-center gap-1.5 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF1E27]" />
                EXECUTIVE RELAYS
              </span>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
                SECRETARIAT CHANNELS
              </h3>

              <div className="space-y-3">
                {SECRETARIAT_CONTACTS.map((sec, idx) => (
                  <div key={idx} className="rounded border border-red-950/80 bg-black/50 p-3 text-xs">
                    <span className="text-[8px] font-bold tracking-widest uppercase text-red-400">
                      {sec.title}
                    </span>
                    <h4 className="font-bold text-xs text-white mt-0.5">{sec.name}</h4>
                    <p className="text-[9px] text-neutral-400">{sec.council}</p>

                    <div className="mt-2 pt-2 border-t border-red-950/60 flex flex-col gap-1 text-[11px]">
                      <a
                        href={`mailto:${sec.email}`}
                        className="flex items-center gap-2 text-neutral-300 hover:text-[#FF1E27] transition-colors"
                      >
                        <Mail className="h-3 w-3 text-[#FF1E27]" />
                        <span>{sec.email}</span>
                      </a>
                      <a
                        href={`tel:${sec.phone}`}
                        className="flex items-center gap-2 text-neutral-300 hover:text-[#FF1E27] transition-colors"
                      >
                        <Phone className="h-3 w-3 text-[#FF1E27]" />
                        <span>{sec.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-red-950/80 bg-[#0e0407]/80 p-3.5 text-[11px] text-neutral-400 flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#FF1E27] flex-shrink-0 mt-0.5" />
              <p className="leading-snug">
                Technical Sub Council (TSC), MMMUT Gorakhpur, Deoria Road, Singhariya, UP 273010, India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Compact Bottom Action Banner ─── */}
      <div className="rounded border border-red-900/40 bg-gradient-to-r from-[#180509]/80 via-black/90 to-[#180509]/80 p-6 sm:p-8 text-center flex flex-col items-center shadow-[0_0_30px_rgba(200,0,20,0.15)] font-mono">
        <span className="text-[9px] tracking-[0.3em] text-[#FF1E27] uppercase font-bold mb-2">
          COMPREHENSIVE PROSPECTUS (PDF)
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight max-w-lg">
          REQUEST THE OFFICIAL PARTNERSHIP DOSSIER
        </h2>
        <p className="mt-2 text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
          Complete metrics on past editions, flagship celebrity nights, arena specifications, and custom branding allocations.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="mailto:techsrijan@mmmut.ac.in?subject=Request%20TechSrijan%202026%20Corporate%20Brochure">
            <Button size="sm" className="bg-[#C80014] hover:bg-[#FF1E27] text-white border border-[#FF1E27] font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(200,0,20,0.3)]">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              <span>REQUEST DOSSIER (PDF)</span>
            </Button>
          </a>
          <a href="#inquiry-terminal">
            <Button variant="outline" size="sm" className="border-red-900/60 hover:border-red-500 font-bold text-xs tracking-widest uppercase text-white bg-black/40">
              <span>SCHEDULE CALL</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

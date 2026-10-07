"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  Shield,
  ChevronDown,
  Train,
  Plane,
  Bus,
  Compass,
  Building2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { ContactHeroCinematic } from "./contact-hero-cinematic";

type FormStatus = "idle" | "sending" | "sent" | "error";

const CHANNELS = [
  {
    id: "comms-email",
    label: "DIRECT TRANSMISSION",
    value: "techsrijan@mmmut.ac.in",
    href: "mailto:techsrijan@mmmut.ac.in",
    note: "24–48h response window",
  },
  {
    id: "comms-hotline",
    label: "HOTLINE UPLINK",
    value: "+91 90000 00000",
    href: "tel:+919000000000",
    note: "Mon–Sun · 09:00 – 21:00 IST",
  },
  {
    id: "comms-hq",
    label: "CITADEL HEADQUARTERS",
    value: "MMMUT Gorakhpur, UP 273010",
    href: "https://maps.google.com/?q=MMMUT+Gorakhpur",
    note: "Deoria Road, Northern India",
  },
];

const ROUTING_DESKS = [
  {
    id: "DESK-01",
    sector: "ARENA OPERATIONS",
    title: "Events & Competitions Desk",
    email: "events.techsrijan@mmmut.ac.in",
    description:
      "Direct channel for rulebooks, registration queries, team formation guidelines, and battle arena slot assignments across 30+ technical events.",
    sla: "24 Hours SLA",
    accent: "#e2a850",
  },
  {
    id: "DESK-02",
    sector: "CORPORATE ALLIANCE",
    title: "Sponsorship & Partnerships",
    email: "sponsorship.techsrijan@mmmut.ac.in",
    description:
      "Corporate alliances, booth allocations, title sponsorships, hackathon problem-statement curation, and industrial exhibition tie-ups.",
    sla: "24 Hours SLA",
    accent: "#79c7e3",
  },
  {
    id: "DESK-03",
    sector: "CAMPUS HOSPITALITY",
    title: "Accommodation & Passes",
    email: "stay.techsrijan@mmmut.ac.in",
    description:
      "Hostel allotment passes, dining tokens, security clearance, and local transportation coordination for visiting outstation delegates.",
    sla: "48 Hours SLA",
    accent: "#e8d4ff",
  },
  {
    id: "DESK-04",
    sector: "COMMUNICATIONS",
    title: "Media & Accreditation Desk",
    email: "media.techsrijan@mmmut.ac.in",
    description:
      "Campus journalism accreditation, photographer press passes, keynote interview requests, and media organization collaboration.",
    sla: "24 Hours SLA",
    accent: "#d4a843",
  },
];

const CAMPUS_TRANSIT = [
  {
    icon: Train,
    label: "Gorakhpur Junction (GKP)",
    sublabel: "Railway Station",
    distance: "9.2 km",
    time: "20 mins",
    accent: "#e2a850",
    details:
      "Direct auto-rickshaws, cabs, and e-rickshaws available 24/7 along Deoria Road Highway directly to MMMUT Main Gate.",
  },
  {
    icon: Plane,
    label: "Mahayogi Gorakhnath Airport (GOP)",
    sublabel: "Civil Terminal",
    distance: "5.4 km",
    time: "12 mins",
    accent: "#79c7e3",
    details:
      "Daily flight connectivity with New Delhi, Mumbai, Kolkata, and Hyderabad. Quick 10–12 minute cab transit to campus.",
  },
  {
    icon: Bus,
    label: "Interstate Bus Terminus (Roadways)",
    sublabel: "Bus Station",
    distance: "8.5 km",
    time: "18 mins",
    accent: "#e8d4ff",
    details:
      "Frequent state and AC express buses connecting Lucknow, Varanasi, Prayagraj, Ayodhya, and Patna to Gorakhpur.",
  },
];

const CAMPUS_VENUES = [
  {
    name: "Multi-Purpose Hall (MPH)",
    purpose: "Inaugural Ceremony, Keynotes & Mega Pro-Nites",
  },
  {
    name: "Student Activity Centre (SAC)",
    purpose: "RoboWars Sandpit, Helpdesk & Central Control",
  },
  {
    name: "Aryabhatta Computing Lab",
    purpose: "Codethon, 36hr Hackathon & Web3 Challenges",
  },
  {
    name: "Mechanical & SAE Circuit",
    purpose: "Baja Demonstrations & Autonomous Buggy Arena",
  },
];

const FAQ_CATEGORIES = ["ALL", "REGISTRATION", "ACCOMMODATION", "EVENTS", "SPONSORSHIP"] as const;

const FAQS = [
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
    a: "Contact our Corporate Alliances team directly via sponsorship.techsrijan@mmmut.ac.in or through the transmission console above. The secretariat delivers customized pitch decks, booth allocations, and branding packages within 24 hours.",
  },
  {
    category: "EVENTS",
    q: "Whom should I contact in case of emergency during fest days?",
    a: "The central Command Post at the Student Activity Centre (SAC) operates 24/7 with on-ground student conveners, faculty proctors, and a physical medical aid center. You can also dial our emergency hotline +91 90000 00000.",
  },
];

export function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("events");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  // FAQ Accordion & Category State
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("ALL");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please state your identity — enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Invalid comms address — enter a valid email.");
      return;
    }
    if (message.trim().length < 15) {
      setError("Transmission payload too brief — minimum 15 characters.");
      return;
    }

    setStatus("sending");
    try {
      await new Promise((resolve) => setTimeout(resolve, 950));
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Transmission uplink failed. Please try again or write directly to techsrijan@mmmut.ac.in.");
    }
  };

  const filteredFaqs =
    activeFaqCategory === "ALL"
      ? FAQS
      : FAQS.filter((f) => f.category === activeFaqCategory);

  return (
    <div className="min-h-screen w-full bg-[#08070b] text-white selection:bg-[#d4a843]/30 selection:text-white">
      {/* ============================================================
          SECTION 1: MAJESTIC HERO (Matching User's Reference Image)
          ============================================================ */}
      <section className="pt-24 sm:pt-28 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-10 max-w-[1700px] mx-auto">
        <ContactHeroCinematic onScrollToForm={scrollToForm} />
      </section>

      {/* ============================================================
          SECTION 2: COUNCIL TRANSMISSION CONSOLE (Minimalist Underline Form)
          ============================================================ */}
      <section
        ref={formSectionRef}
        id="transmission-form"
        className="scroll-mt-24 py-16 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto"
      >
        <div className="relative rounded-[2.5rem] bg-[#0c090c]/85 border border-[#d4a843]/30 p-8 sm:p-12 lg:p-14 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] space-y-8">
          {/* Top telemetry bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#e2a850] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DIRECT DISPATCH CONSOLE</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              COUNCIL OF STUDENT ACTIVITIES
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white uppercase">
              DISPATCH A TRANSMISSION
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed max-w-xl">
              Fill out the parameters below to open an encrypted ticket with the Technical Sub-Council (TSC)
              secretariat for events, sponsorship, lodging, or technical inquiries.
            </p>
          </div>

          {/* Form / Success Screen */}
          {status === "sent" ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] backdrop-blur-xl p-8 text-center space-y-5 animate-in fade-in duration-500">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-sans font-bold uppercase tracking-wide text-white">
                  Transmission Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed max-w-md mx-auto">
                  Your transmission has been queued at the Citadel Secretariat. An operative will respond to{" "}
                  <span className="text-[#e2a850] font-mono">{email}</span> within 24–48 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setName("");
                  setEmail("");
                  setMessage("");
                }}
                className="mt-4 px-8 py-2.5 bg-white text-black text-xs font-mono font-semibold tracking-wider uppercase transition-transform hover:scale-105 cursor-pointer shadow-lg"
              >
                SEND ANOTHER DISPATCH
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7" noValidate>
              {/* 1. Full Name (Underline style) */}
              <div className="space-y-1.5 group">
                <label
                  htmlFor="contact-fullname"
                  className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium block group-focus-within:text-[#e2a850] transition-colors"
                >
                  FULL NAME
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-2.5 pt-1 text-sm text-white placeholder:text-zinc-500 focus:border-[#d4a843] focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Email Address (Underline style) */}
              <div className="space-y-1.5 group">
                <label
                  htmlFor="contact-email"
                  className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium block group-focus-within:text-[#e2a850] transition-colors"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-2.5 pt-1 text-sm text-white placeholder:text-zinc-500 focus:border-[#d4a843] focus:outline-none transition-colors"
                />
              </div>

              {/* 3. Transmission Topic / Category (Underline style) */}
              <div className="space-y-1.5 group">
                <label
                  htmlFor="contact-topic"
                  className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium block group-focus-within:text-[#e2a850] transition-colors"
                >
                  SUBJECT / ARENA SECTOR
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-2.5 pt-1 text-sm text-white focus:border-[#d4a843] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="events" className="bg-[#0b0d17] text-white">
                    Events & Battle Arenas (30+ Competitions)
                  </option>
                  <option value="sponsorship" className="bg-[#0b0d17] text-white">
                    Corporate Sponsorship & Title Partnerships
                  </option>
                  <option value="accommodation" className="bg-[#0b0d17] text-white">
                    Hostel Accommodation & Campus Access
                  </option>
                  <option value="media" className="bg-[#0b0d17] text-white">
                    Media, Photography & Campus Coverage
                  </option>
                  <option value="general" className="bg-[#0b0d17] text-white">
                    General Council Inquiry
                  </option>
                </select>
              </div>

              {/* 4. Message Payload (Underline style with right status badge) */}
              <div className="space-y-1.5 relative group">
                <label
                  htmlFor="contact-message"
                  className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium block group-focus-within:text-[#e2a850] transition-colors"
                >
                  MESSAGE PAYLOAD
                </label>
                <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message..."
                    className="w-full bg-transparent border-0 border-b border-white/20 pb-2.5 pt-1 pr-10 text-sm leading-relaxed text-white placeholder:text-zinc-500 focus:border-[#d4a843] focus:outline-none transition-colors resize-none"
                  />

                  {/* Encryption checkmark indicator matching reference UI */}
                  <div className="absolute right-0 bottom-4 pointer-events-none flex items-center gap-1.5">
                    <span
                      title="Encryption Active"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold"
                    >
                      ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-mono text-red-300 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* 5. Minimalist SEND Button (Matching Reference Image) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-12 py-3 bg-[#52565e] hover:bg-white text-white hover:text-black font-sans text-xs tracking-[0.2em] font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <span>SEND</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Comms Strip (Bottom coordinates) */}
          <div className="pt-6 border-t border-white/[0.08] grid sm:grid-cols-3 gap-5 text-[11px] font-mono text-zinc-400">
            {CHANNELS.map((ch) => (
              <div key={ch.id} className="space-y-0.5">
                <div className="text-[9px] tracking-wider text-zinc-500 uppercase">{ch.label}</div>
                <a
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-white hover:text-[#d4a843] transition-colors block truncate font-medium"
                >
                  {ch.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: DEPARTMENT ROUTING DESKS
          ============================================================ */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto border-t border-white/[0.1]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-[0.25em] text-[#79c7e3] uppercase mb-3 font-semibold">
            CENTRAL COUNCIL DIRECTORY
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            <span className="font-editorial italic font-normal text-[#e8d4ff] mr-3">Department</span>
            <span>Routing Desks</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-300 font-sans">
            Need direct communication with a specific council wing? Reach out to our dedicated secretariats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROUTING_DESKS.map((desk) => (
            <div
              key={desk.id}
              className="rounded-[2.2rem] bg-white/[0.03] border border-white/[0.12] p-7 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#d4a843]/60 hover:bg-white/[0.06] hover:-translate-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(212,168,67,0.15)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border bg-black/40"
                    style={{ borderColor: `${desk.accent}55`, color: desk.accent }}
                  >
                    {desk.sector}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{desk.sla}</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#e8d4ff] transition-colors leading-snug">
                  {desk.title}
                </h3>

                <p className="mt-3 text-xs text-zinc-300 font-sans leading-relaxed">
                  {desk.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <a
                  href={`mailto:${desk.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#79c7e3] hover:text-[#d4a843] transition-colors truncate w-full"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{desk.email}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 ml-auto" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CAMPUS LOCATION & LIVE GOOGLE MAP (MMMUT GORAKHPUR)
          ============================================================ */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto border-t border-white/[0.1]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-[0.25em] text-[#e2a850] uppercase mb-3 font-semibold">
            CAMPUS LOCATION & TRANSIT
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            <span className="font-editorial italic font-normal text-[#e8d4ff] mr-3">Campus Location</span>
            <span>& Travel Guide</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-300 font-sans leading-relaxed">
            Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur.
            A 354-acre residential campus situated on Deoria Road Highway.
          </p>
        </div>

        {/* Live Map + Transit Cards Grid */}
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-stretch">
          {/* Live Interactive Google Map Frame */}
          <div className="relative rounded-[2rem] overflow-hidden border border-[#d4a843]/30 shadow-[0_25px_60px_rgba(0,0,0,0.65)] min-h-[480px] sm:min-h-[540px] bg-black/80 flex flex-col justify-between group">
            <iframe
              title="MMMUT Gorakhpur Live Campus Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.8180424565787!2d83.4310574761408!3d26.738144267732895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39915ca3e2aa136b%3A0xc039b27521c77e74!2sMadan%20Mohan%20Malaviya%20University%20Of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg) contrast(110%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Tactical Location Overlay Badge at Top Left */}
            <div className="absolute top-5 left-5 z-10 pointer-events-none max-w-[calc(100%-2.5rem)]">
              <div className="rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 px-4 py-2.5 shadow-2xl space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-white uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-[#e2a850]" />
                  <span>MMMUT GORAKHPUR CITADEL</span>
                </div>
                <div className="text-[11px] font-sans text-zinc-300">
                  Deoria Road, Kunraghat, Gorakhpur, UP 273010
                </div>
                <div className="text-[10px] font-mono text-[#e2a850]">
                  26.7381° N, 83.4332° E
                </div>
              </div>
            </div>

            {/* Direct Open in Google Maps Link at Bottom Right */}
            <div className="absolute bottom-5 right-5 z-10">
              <a
                href="https://maps.google.com/?q=Madan+Mohan+Malaviya+University+Of+Technology+Gorakhpur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#d4a843] text-black px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-2xl cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Transit Proximity Cards Column */}
          <div className="flex flex-col justify-between gap-4">
            {CAMPUS_TRANSIT.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.1] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#d4a843]/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border bg-black/40"
                      style={{ borderColor: `${item.accent}40`, color: item.accent }}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-sans font-semibold text-white leading-snug">
                        {item.label}
                      </h4>
                      <div className="text-[11px] font-sans text-zinc-400">{item.sublabel}</div>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-mono font-semibold text-[#e2a850] bg-[#e2a850]/10 border border-[#e2a850]/25 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {item.distance} • {item.time}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed pl-12">
                  {item.details}
                </p>
              </div>
            ))}

            {/* Campus Landmark Coordinates Card */}
            <div className="rounded-2xl bg-black/50 border border-white/[0.12] p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#e2a850] uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Primary Fest Venues On Campus</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5 text-xs font-sans">
                {CAMPUS_VENUES.map((venue, vIdx) => (
                  <div key={vIdx} className="space-y-0.5">
                    <div className="font-medium text-white">{venue.name}</div>
                    <div className="text-[11px] text-zinc-400">{venue.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: IMPERIAL ARCHIVES • FREQUENTLY ASKED QUESTIONS
          ============================================================ */}
      <section className="relative py-24 sm:py-28 px-6 sm:px-12 lg:px-16 max-w-6xl mx-auto border-t border-white/[0.1] overflow-hidden">
        {/* Thematic Ambient Background: Council Archives */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <Image
            src="/council-archives-faq.jpg"
            alt="Council FAQ Archives Background"
            fill
            className="object-cover object-center filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08070b] via-[#08070b]/90 to-[#08070b]" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono tracking-[0.25em] text-[#e8d4ff] uppercase mb-3 font-semibold">
            TRANSMISSION RESOLUTION
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            <span className="font-editorial italic font-normal text-[#e8d4ff] mr-3">Frequently</span>
            <span>Asked Questions</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-300 font-sans">
            Common inquiries on registration, arena guidelines, outstation lodging, and security clearance.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveFaqCategory(cat);
                  setOpenFaqIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all cursor-pointer ${
                  activeFaqCategory === cat
                    ? "bg-[#d4a843] text-black font-bold shadow-[0_0_15px_rgba(212,168,67,0.35)]"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordions List */}
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[2rem] bg-[#0c090c]/80 border transition-all duration-300 backdrop-blur-2xl overflow-hidden ${
                  isOpen
                    ? "border-[#d4a843]/60 shadow-[0_10px_35px_rgba(212,168,67,0.12)]"
                    : "border-white/[0.12] hover:border-white/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-sans font-bold text-white tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={`h-8 w-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#d4a843] text-black border-transparent" : "text-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SECTION 6: IMMEDIATE ASSISTANCE ACTION BANNER
          ============================================================ */}
      <section className="pb-28 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="rounded-[2.8rem] bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-black/60 border border-[#d4a843]/30 p-8 sm:p-14 backdrop-blur-3xl text-center space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#d4a843]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#79c7e3]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white uppercase">
              Immediate Assistance Required?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed">
              Our operative desk at the Technical Sub-Council (TSC) is available around the clock during tournament dates.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="mailto:techsrijan@mmmut.ac.in"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#79c7e3] via-[#e8d4ff] to-[#e2a850] px-7 py-3 text-xs font-sans font-bold text-black shadow-[0_0_30px_rgba(226,168,80,0.35)] transition-transform duration-300 hover:scale-105"
            >
              <Mail className="h-4 w-4" />
              <span>Email Central Council</span>
            </a>
            <a
              href="tel:+919000000000"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.2] px-6 py-3 text-xs font-sans font-medium text-white transition-all backdrop-blur-xl"
            >
              <Phone className="h-4 w-4" />
              <span>Dial Hotline (+91 90000 00000)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

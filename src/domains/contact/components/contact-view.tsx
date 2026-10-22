"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/core";
import { api } from "@/lib/api";
import { FestFooter } from "@/shared";

type FormStatus = "idle" | "sending" | "sent" | "error";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Who is eligible to participate in TechSrijan?",
    a: "Enrolled students from any recognized college, university, or institute in India are eligible. A valid college student ID card is required for entry and verification.",
  },
  {
    q: "How do I register for events and competitions?",
    a: "Create an account on the portal using the Sign In button. Once registered, browse the Events section to view schedules, guidelines, and join individual or team events.",
  },
  {
    q: "Is accommodation available for outstation participants?",
    a: "Yes. On-campus hostel accommodation at MMMUT Gorakhpur is provided for registered outstation participants. Check the Stay section on our portal for guidelines and booking details.",
  },
  {
    q: "How can brands or organizations collaborate with TechSrijan?",
    a: "Organizations interested in sponsorships, exhibition spaces, or event partnerships can reach us at techsrijan@mmmut.ac.in or submit an inquiry using the form on this page.",
  },
];

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Events & Competitions",
  "Sponsorship & Partnerships",
  "Accommodation & Hospitality",
  "Other",
];

export function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("techsrijan@mmmut.ac.in");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus("error");
      setStatusMessage("Please provide your name, email, and message.");
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
      setStatusMessage(res?.message || "Thank you! Your message has been received.");
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err: any) {
      setFormStatus("error");
      setStatusMessage(
        err?.message || "Failed to send message. Please reach out to techsrijan@mmmut.ac.in directly."
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-primary,#090705)] text-[var(--text-primary,#F4ECE1)] selection:bg-[var(--accent-primary)] selection:text-white font-sans overflow-x-hidden">
      {/* Ambient background bloom */}
      <div
        className="hidden sm:block fixed top-1/3 -right-36 w-96 h-96 rounded-full blur-[140px] pointer-events-none z-[1] opacity-20"
        style={{ backgroundColor: "var(--accent-glow)" }}
      />

      {/* UNIFIED CONTACT SECTION */}
      <section className="relative z-10 w-full pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-10 sm:space-y-12">
          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-montserrat font-black tracking-tight uppercase leading-[0.95] text-white">
              CONTACT <span className="text-transparent bg-clip-text theme-heading-gradient">US</span>
            </h1>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Essential Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              {/* Official Email */}
              <div className="flex items-center gap-3">
                <a
                  href="mailto:techsrijan@mmmut.ac.in"
                  className="text-base sm:text-lg font-montserrat font-bold text-white hover:text-[var(--accent-primary)] transition-colors"
                >
                  techsrijan@mmmut.ac.in
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Campus Venue */}
              <div className="text-sm sm:text-base font-sans text-neutral-200 leading-relaxed">
                <div className="font-montserrat font-bold text-white">
                  Madan Mohan Malaviya University of Technology (MMMUT)
                </div>
                <div className="text-neutral-400 mt-0.5">
                  Deoria Road, Gorakhpur, Uttar Pradesh – 273010, India
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/techsrijan_mmmut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-montserrat font-bold uppercase tracking-wider text-white transition-all"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="h-3 w-3 text-neutral-400" />
                </a>
                <a
                  href="https://www.linkedin.com/company/techsrijan-mmmut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-montserrat font-bold uppercase tracking-wider text-white transition-all"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3 text-neutral-400" />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-montserrat font-black uppercase text-white tracking-tight">
                    SEND A MESSAGE
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
                    Fill out the form below and the team will get back to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name and Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-xs uppercase tracking-wider text-neutral-400"
                      >
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-[var(--border)] bg-black/50 pl-10 pr-3.5 py-2.5 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-xs uppercase tracking-wider text-neutral-400"
                      >
                        Your Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          required
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-[var(--border)] bg-black/50 pl-10 pr-3.5 py-2.5 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="block font-mono text-xs uppercase tracking-wider text-neutral-400"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[var(--border)] bg-black/50 px-3.5 py-2.5 text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all cursor-pointer"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-neutral-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-message"
                        className="block font-mono text-xs uppercase tracking-wider text-neutral-400"
                      >
                        Your Message <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {formData.message.length} / 1500
                      </span>
                    </div>
                    <div className="relative">
                      <MessageSquare className="h-4 w-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        maxLength={1500}
                        rows={5}
                        placeholder="Write your message or inquiry here..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[var(--border)] bg-black/50 pl-10 pr-3.5 py-2.5 text-sm font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Status Alerts */}
                  {formStatus === "sent" && (
                    <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-montserrat font-bold text-white text-xs uppercase tracking-wider">
                          Message Sent
                        </div>
                        <p className="mt-0.5 text-emerald-200/90 font-sans text-xs">
                          {statusMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {formStatus === "error" && (
                    <div className="p-3.5 rounded-lg border border-red-500/40 bg-red-950/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <div className="font-montserrat font-bold text-white text-xs uppercase tracking-wider">
                          Error
                        </div>
                        <p className="mt-0.5 text-red-200/90 font-sans text-xs">{statusMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg theme-btn-gradient text-xs font-montserrat font-bold uppercase tracking-wider text-white hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      {formStatus === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 w-full py-16 sm:py-20">
        <div className="px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto space-y-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] font-semibold mb-2">
              FREQUENT QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-montserrat font-black uppercase text-white tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-1">
              Quick answers about participation, registration, and accommodation.
            </p>
          </div>

          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="font-montserrat font-bold text-sm sm:text-base text-white group-hover:text-[var(--accent-primary)] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-[var(--accent-primary)]"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-3 pr-8 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed animate-in fade-in duration-200">
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

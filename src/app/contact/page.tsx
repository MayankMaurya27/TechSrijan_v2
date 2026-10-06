import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Directives & Support",
  description: "Official contact directives, venue coordinates, and secretarial support channels for TechSrijan'27 MMMUT Gorakhpur.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Directives & Support | TechSrijan'27",
    description: "Official contact directives, venue coordinates, and secretarial support channels for TechSrijan'27 MMMUT Gorakhpur.",
    url: "/contact",
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Directives & Support | TechSrijan'27",
    description: "Official contact directives, venue coordinates, and secretarial support channels for TechSrijan'27 MMMUT Gorakhpur.",
  },
};

const CONTACT_POINTS = [
  {
    role: "FESTIVAL SECRETARIAT",
    name: "Technical Sub Council (TSC)",
    email: "techsrijan@mmmut.ac.in",
    phone: "+91 551 227 3958",
  },
  {
    role: "REGISTRATION & ADMISSIONS",
    name: "Student Support Desk",
    email: "support.techsrijan@mmmut.ac.in",
    phone: "+91 94500 00000",
  },
  {
    role: "HOSPITALITY & STAY",
    name: "Accommodation Cell",
    email: "hospitality.techsrijan@mmmut.ac.in",
    phone: "+91 94511 11111",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-mono pb-24">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase font-semibold">
          COMMUNICATION RELAY · DIRECT CONTACT DIRECTIVES
        </span>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
          CONTACT US
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Need assistance with event registration, accommodations, or sponsorship inquiries? Reach out through our official communication channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Coordinates */}
        <div className="lg:col-span-1 space-y-6">
          <div className="mecha-bracket rounded border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] tracking-widest uppercase font-bold mb-4">
              <MapPin className="h-4 w-4" />
              <span>HEADQUARTERS</span>
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">
              Madan Mohan Malaviya University of Technology
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Deoria Road, Singhariya, Kunraghat, Gorakhpur, Uttar Pradesh 273010, India
            </p>
          </div>

          <div className="mecha-bracket rounded border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] tracking-widest uppercase font-bold mb-4">
              <Clock className="h-4 w-4" />
              <span>OFFICE HOURS</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Monday – Saturday: 09:00 AM – 06:00 PM IST<br />
              Emergency festival helplines active 24/7 during December 25–27, 2026.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Cards */}
        <div className="lg:col-span-2 space-y-4">
          {CONTACT_POINTS.map((cp, idx) => (
            <div
              key={idx}
              className="mecha-bracket rounded border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-[var(--accent-primary)]"
            >
              <div>
                <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase">
                  {cp.role}
                </span>
                <h4 className="mt-1 font-bold text-base text-[var(--text-primary)]">
                  {cp.name}
                </h4>
                <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    {cp.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    {cp.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

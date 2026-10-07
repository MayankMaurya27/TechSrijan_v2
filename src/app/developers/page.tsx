import type { Metadata } from "next";
import { Code2, Terminal, Cpu, Shield, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Guild & Developers",
  description: "The core engineering guild and developer architects behind TechSrijan'27 IMPERIUM: REQUIEM platform at MMMUT Gorakhpur.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Engineering Guild & Developers | TechSrijan'27",
    description: "The core engineering guild and developer architects behind TechSrijan'27 IMPERIUM: REQUIEM platform at MMMUT Gorakhpur.",
    url: "/developers",
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Guild & Developers | TechSrijan'27",
    description: "The core engineering guild and developer architects behind TechSrijan'27 IMPERIUM: REQUIEM platform at MMMUT Gorakhpur.",
  },
};

const GUILDS = [
  {
    icon: Terminal,
    name: "MMMUT RESO",
    role: "Core Software Architecture & Full-Stack Systems",
    desc: "Engineered the next-generation Next.js App Router client architecture, WebGL state sync, and real-time registration conduits.",
  },
  {
    icon: Code2,
    name: "TSC WEB & DEV CELL",
    role: "User Experience, Identity & Database Design",
    desc: "Designed the 3D Imperium holographic pass credentials, multi-theme dynamic styling, and admin reconciliation portal.",
  },
  {
    icon: Cpu,
    name: "ROBOTICS CLUB & SAE MMMUT",
    role: "Hardware & Operational Integrations",
    desc: "Coordinated arena specifications, hardware competition rulesets, and arena spatial card data.",
  },
  {
    icon: Shield,
    name: "IEEE MMMUT STUDENT BRANCH",
    role: "Technical Quality & Standards",
    desc: "Ensured competitive standards across flagship coding tournaments, hackathons, and research symposiums.",
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-mono pb-24">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase font-semibold">
          SYSTEM ARCHITECTS · CORE ENGINEERING GUILD
        </span>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
          DEVELOPERS
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Crafted with obsession by the student developers of Technical Sub Council (TSC) and MMMUT RESO. Built for speed, security, and cinematic fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {GUILDS.map((guild, idx) => {
          const Icon = guild.icon;
          return (
            <div
              key={idx}
              className="mecha-bracket rounded border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded border border-[var(--border-accent)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent-primary)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">
                    {guild.name}
                  </h3>
                  <span className="text-[10px] text-[var(--accent-primary)] tracking-widest uppercase">
                    {guild.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {guild.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--text-muted)]">
        TECHNICAL SUB COUNCIL // MMMUT GORAKHPUR · ALL SYSTEMS OPERATIONAL
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers | TechSrijan'27",
  description: "The developers behind TechSrijan'27.",
  alternates: {
    canonical: "/developers",
  },
};

const DEVELOPERS = [
  { name: "Sarthak Agarwal" },
  { name: "Mayank Maurya" },
];

export default function DevelopersPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#050304] text-[#f8eed9] flex flex-col items-center justify-center px-4 sm:px-6 py-24 select-none overflow-hidden">
      {/* Background Ambient Glow & Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--accent-primary,#d4a843)]/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {/* Header Directive */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-primary,#d4a843)]/30 bg-[var(--accent-primary,#d4a843)]/5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary,#d4a843)] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[var(--accent-primary,#d4a843)] font-semibold">
            Citadel Architecture
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wider text-[#f8eed9] uppercase mb-12 sm:mb-16">
          Developers
        </h1>

        {/* Minimal 2 Names Display */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {DEVELOPERS.map((dev) => (
            <div
              key={dev.name}
              className="group relative flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-[var(--accent-primary,#d4a843)]/30 bg-black/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:border-[var(--accent-primary,#d4a843)] hover:shadow-[0_0_30px_rgba(212,168,67,0.25)] transition-all duration-300"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary,#d4a843)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <span className="relative z-10 font-sans text-xl sm:text-2xl font-bold tracking-wide text-[#f8eed9] group-hover:text-[var(--accent-primary,#d4a843)] transition-colors duration-300">
                {dev.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

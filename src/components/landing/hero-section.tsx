"use client";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-[var(--border)]">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--bg-secondary)_0%,_var(--bg-primary)_100%)] opacity-50" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center rounded-full border border-[var(--accent-primary)] bg-[var(--surface)] px-3 py-1 text-sm font-mono text-[var(--accent-primary)] mb-8">
          <span className="flex h-2 w-2 rounded-full bg-[var(--accent-primary)] mr-2 animate-pulse" />
          SYSTEM ONLINE
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[var(--text-primary)] uppercase">
          Tech<span className="text-[var(--accent-primary)]">Srijan</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg md:text-xl font-mono text-[var(--text-secondary)]">
          IMPERIUM: REQUIEM // ANNUAL TECHNICAL SYMPOSIUM
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="w-full sm:w-auto">
            ENTER SYSTEM
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            VIEW DIRECTIVES
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Terminal, Crosshair, Shield } from "lucide-react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
    }
  }, []);

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center">
      {/* Cinematic Looping Background Asset (Optimized for Mobile & Low-End Devices) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/landing-hero-poster.jpg"
          preload="auto"
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-45 scale-105 transition-opacity duration-1000"
          style={{ willChange: "transform" }}
        >
          <source src="/landing-bg.mp4" type="video/mp4" />
        </video>

        {/* Atmospheric gradients & vignette for sharp typography contrast & seamless edge blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/85 via-transparent to-[var(--bg-primary)]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-75" />
      </div>

      {/* Tactical Chessboard Grid Corners */}
      <div className="pointer-events-none absolute left-6 top-28 hidden font-mono text-[10px] tracking-[0.3em] text-[var(--text-muted)] lg:block text-left select-none">
        <div className="flex items-center gap-2 text-[var(--accent-primary)]">
          <Crosshair className="h-3 w-3" />
          <span>COORDINATE // A-1</span>
        </div>
        <div className="mt-1">SYS // IMPERIUM_CORE</div>
        <div>OPTIC // GEASS_SIGIL</div>
      </div>

      <div className="pointer-events-none absolute right-6 top-28 hidden font-mono text-[10px] tracking-[0.3em] text-[var(--text-muted)] lg:block text-right select-none">
        <div className="flex items-center justify-end gap-2 text-[var(--geass-crimson)]">
          <span>GRID // H-8</span>
          <Shield className="h-3 w-3" />
        </div>
        <div className="mt-1">FACTION // ZERO_COMMAND</div>
        <div>DEFENSE // LVL_4</div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        {/* Animated Conic Gradient Badge */}
        <div className="border-glow-conic mb-8 inline-flex items-center px-4 py-1.5 shadow-[var(--glow)]">
          <span className="flex h-2 w-2 rounded-full bg-[var(--geass-crimson)] animate-ping mr-2.5" />
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-[var(--accent-primary)] uppercase">
            ABSOLUTE DIRECTIVE // IMPERIUM ONLINE
          </span>
        </div>

        {/* Main Display Typography */}
        <h1 className="font-mono text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl uppercase text-[var(--text-primary)]">
          TECH<span className="text-[var(--accent-primary)] drop-shadow-[0_0_40px_var(--accent-glow)]">SRIJAN</span>
        </h1>

        {/* Cinematic Subheading with Solar Flare Lines */}
        <div className="mt-6 flex items-center gap-3 font-mono text-sm tracking-[0.35em] text-[var(--text-secondary)] sm:text-lg md:text-xl">
          <span className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent to-[var(--border-accent)]" />
          <span>IMPERIUM: REQUIEM</span>
          <span className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent to-[var(--border-accent)]" />
        </div>

        <p className="mt-5 max-w-2xl font-mono text-xs text-[var(--text-muted)] tracking-wider sm:text-sm">
          ANNUAL TECHNICAL SYMPOSIUM // MADAN MOHAN MALAVIYA UNIVERSITY OF TECHNOLOGY
        </p>

        {/* Interactive Action Cluster */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <Link href="/events" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group">
              <span>ENGAGE DIRECTIVES</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Terminal className="mr-2 h-4 w-4 text-[var(--accent-primary)]" />
              <span>CLAIM IMPERIUM PASS</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

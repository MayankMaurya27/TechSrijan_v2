"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TwinSunsToggle } from "./twin-suns-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldAlert } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/85 backdrop-blur-md border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Left: Brand Crest & Chessboard Coordinate */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="mecha-bracket flex h-10 w-10 items-center justify-center border border-[var(--border-accent)] bg-[var(--surface)] font-mono text-base font-black text-[var(--accent-primary)] shadow-[var(--glow)] transition-transform group-hover:scale-105">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-black tracking-widest text-[var(--text-primary)]">
                TECH<span className="text-[var(--accent-primary)]">SRIJAN</span>
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--text-secondary)]">
                IMPERIUM: REQUIEM
              </span>
            </div>
          </Link>

          {/* Tactical Chess Coordinate Marker */}
          <span className="hidden xl:inline-block font-mono text-[10px] text-[var(--text-muted)] tracking-widest border-l border-[var(--border)] pl-4">
            GRID // E-4 // COMMAND
          </span>
        </div>

        {/* Center: Tactical Navigation Nodes */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.2em]">
          <Link
            href="/events"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] relative group"
          >
            <span>// DIRECTIVES</span>
            <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[var(--accent-primary)] transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/accommodation"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] relative group"
          >
            <span>// ACCOMMODATION</span>
            <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[var(--accent-primary)] transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#schedule"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] relative group"
          >
            <span>// TIMELINE</span>
            <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[var(--accent-primary)] transition-all group-hover:w-full" />
          </Link>
        </nav>

        {/* Right: Twin Suns Celestial Switcher & Enter System CTA */}
        <div className="hidden md:flex items-center gap-5">
          {/* Celestial Twin Suns Toggle */}
          <TwinSunsToggle />

          {/* Enter System Primary CTA */}
          <Link href="/dashboard">
            <Button size="sm" className="font-mono text-xs">
              INITIALIZE PASS
            </Button>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <TwinSunsToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg-primary)] px-6 py-8 shadow-2xl">
          <div className="flex flex-col gap-6 font-mono text-sm tracking-widest">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
            >
              // DIRECTIVES CATALOGUE
            </Link>
            <Link
              href="/accommodation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
            >
              // ACCOMMODATION
            </Link>
            <Link
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
            >
              // TIMELINE
            </Link>
            <div className="pt-4">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">INITIALIZE PASS</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

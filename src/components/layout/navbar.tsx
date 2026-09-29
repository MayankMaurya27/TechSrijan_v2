"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sun, Crosshair, Menu, X, ShieldAlert } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "arrakis" ? "giedi-prime" : "arrakis");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/85 backdrop-blur-md border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border-accent)] bg-[var(--surface)] font-mono text-lg font-black text-[var(--accent-primary)] shadow-[var(--glow)] transition-transform group-hover:scale-105">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.2em]">
          <Link
            href="/events"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
          >
            // EVENTS
          </Link>
          <Link
            href="/accommodation"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
          >
            // ACCOMMODATION
          </Link>
          <Link
            href="#schedule"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
          >
            // TIMELINE
          </Link>
          <Link
            href="#sponsors"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
          >
            // FACTIONS
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme Matrix"
            className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[var(--glow)]"
            title={`Current: ${theme === "arrakis" ? "Arrakis Twin Sun" : "Giedi Prime Infrared"}`}
          >
            {theme === "arrakis" ? (
              <Sun className="h-4 w-4 text-[var(--accent-primary)]" />
            ) : (
              <Crosshair className="h-4 w-4 text-[var(--accent-secondary)]" />
            )}
          </button>

          {/* Primary Action Button */}
          <Link href="/dashboard">
            <Button size="sm" className="font-mono text-xs">
              ENTER SYSTEM
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"
          >
            {theme === "arrakis" ? (
              <Sun className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            ) : (
              <Crosshair className="h-3.5 w-3.5 text-[var(--accent-secondary)]" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg-primary)] px-6 py-8 shadow-2xl">
          <div className="flex flex-col gap-6 font-mono text-sm tracking-widest">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
            >
              // EVENTS DIRECTORY
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
                <Button className="w-full">ENTER SYSTEM</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

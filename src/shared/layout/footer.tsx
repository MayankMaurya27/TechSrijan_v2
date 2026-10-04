"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-6 py-12 text-center sm:text-left font-mono text-xs text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-bold text-[var(--text-primary)] tracking-widest uppercase">
            TECHSRIJAN&apos;27 — IMPERIUM: REQUIEM
          </span>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Technical Sub Council (TSC) • Madan Mohan Malaviya University of Technology, Gorakhpur
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
            Conducted under TSC by MMMUT RESO • SAE MMMUT • IEEE MMMUT • RC (Robotics Club) MMMUT
          </p>
        </div>

        <div className="flex items-center gap-6 tracking-widest text-[11px]">
          <Link href="/events" className="hover:text-[var(--accent-primary)]">
            EVENTS
          </Link>
          <Link href="/accommodation" className="hover:text-[var(--accent-primary)]">
            ACCOMMODATION
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--accent-primary)]">
            PORTAL
          </Link>
        </div>

        <div className="text-[10px] text-[var(--text-muted)] text-center md:text-right">
          © 2026 Technical Sub Council (TSC), MMMUT Gorakhpur.
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-6 py-12 text-center sm:text-left font-mono text-xs text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-bold text-[var(--text-primary)] tracking-widest uppercase">
            TECHSRIJAN // IMPERIUM: REQUIEM
          </span>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Madan Mohan Malaviya University of Technology, Gorakhpur (U.P.)
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

        <div className="text-[10px] text-[var(--text-muted)]">
          © 2026 IEEE SB MMMUT. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

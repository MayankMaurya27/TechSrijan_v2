"use client";

interface MarqueeProps {
  items?: string[];
  reverse?: boolean;
}

export function MarqueeTicker({
  items = [
    "TECHSRIJAN 2026",
    "IMPERIUM: REQUIEM",
    "MMMUT GORAKHPUR",
    "THE SPICE MUST FLOW",
    "ALL HAIL LELOUCH",
    "ALGORITHMIC WARFARE",
    "NEURAL CONQUEST",
    "CYBERNETIC ARENA",
  ],
  reverse = false,
}: MarqueeProps) {
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
      {/* Side Vignettes for Infinite Blend */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />

      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center mx-6 gap-6">
            <span className="text-[var(--text-primary)] font-bold">{item}</span>
            <span className="text-[var(--accent-primary)] opacity-60 font-black">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useTheme } from "@/components/providers/theme-provider";

export function TwinSunsToggle() {
  const { theme, setTheme } = useTheme();
  const isArrakis = theme === "arrakis";

  const handleToggle = () => {
    setTheme(isArrakis ? "giedi-prime" : "arrakis");
  };

  return (
    <button
      onClick={handleToggle}
      className="group relative flex h-11 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 transition-all duration-300 hover:border-[var(--border-accent)] hover:shadow-[var(--glow)] focus:outline-none"
      title={`Active Celestial Body: ${isArrakis ? "Arrakis Solar Prime" : "Giedi Eclipse Infrared"}`}
      aria-label="Toggle Celestial Twin Suns"
    >
      {/* Orbital Arena */}
      <div className="relative flex h-6 w-12 items-center">
        {/* Orbital Trajectory Line */}
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />

        {/* Sun 1: Arrakis Golden Solar Flare */}
        <div
          className={`absolute h-5 w-5 rounded-full transition-all duration-500 ease-out flex items-center justify-center ${
            isArrakis
              ? "left-0 scale-110 bg-gradient-to-br from-[#F3CE7A] to-[#D4A843] shadow-[0_0_12px_#D4A843]"
              : "left-6 scale-75 opacity-40 bg-[#6B5944]"
          }`}
        >
          {isArrakis && (
            <div className="h-full w-full rounded-full animate-ping opacity-30 bg-[#F3CE7A]" />
          )}
        </div>

        {/* Sun 2: Giedi Infrared Eclipse */}
        <div
          className={`absolute h-5 w-5 rounded-full transition-all duration-500 ease-out flex items-center justify-center border ${
            !isArrakis
              ? "left-6 scale-110 bg-[#000000] border-[#FF1E27] shadow-[0_0_12px_#FF1E27]"
              : "left-0 scale-75 opacity-40 bg-[#121212] border-[#444]"
          }`}
        >
          {!isArrakis && (
            <div className="h-1.5 w-1.5 rounded-full bg-[#FF1E27] animate-pulse" />
          )}
        </div>
      </div>

      {/* State Label */}
      <div className="hidden sm:flex flex-col text-left font-mono text-[9px] leading-tight tracking-widest">
        <span className="text-[var(--text-muted)]">SOLAR STATE</span>
        <span className="font-bold text-[var(--accent-primary)] uppercase">
          {isArrakis ? "ARRAKIS // 1.0" : "GIEDI // ECLIPSE"}
        </span>
      </div>
    </button>
  );
}

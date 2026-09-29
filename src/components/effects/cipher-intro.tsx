"use client";

import { useEffect, useState } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@%&";
const TARGET_TEXT = "IMPERIUM: REQUIEM";
const SUB_TARGET_TEXT = "PROTOCOL // TECHSRIJAN 2026 INITIATED";

export function CipherIntro({ onComplete }: { onComplete: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [subText, setSubText] = useState("");
  const [isWiping, setIsWiping] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = 28;

    const interval = setInterval(() => {
      // Main text scramble decode
      setDisplayText(() =>
        TARGET_TEXT.split("")
          .map((char, index) => {
            if (index < iteration / (maxIterations / TARGET_TEXT.length)) {
              return char;
            }
            if (char === " " || char === ":") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      // Subtitle scramble decode
      setSubText(() =>
        SUB_TARGET_TEXT.split("")
          .map((char, index) => {
            if (index < iteration / (maxIterations / SUB_TARGET_TEXT.length)) {
              return char;
            }
            if (char === " " || char === "/") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration++;
      setProgress(Math.min(100, Math.round((iteration / maxIterations) * 100)));

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(TARGET_TEXT);
        setSubText(SUB_TARGET_TEXT);

        // Initiate cinematic wipe-up
        setTimeout(() => {
          setIsWiping(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 600);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6 transition-all duration-700 ease-in-out ${
        isWiping ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Background Matrix Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4a84315_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Protocol Telemetry */}
      <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent-primary)]">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[var(--accent-primary)]" />
        SECURE LINK // AUTHORIZATION_GRANTED // 0x7E3F
      </div>

      {/* Primary Decrypted Title */}
      <div className="relative">
        <h1 className="text-center font-mono text-3xl font-black tracking-[0.25em] text-[var(--text-primary)] sm:text-5xl md:text-7xl lg:text-8xl">
          {displayText}
        </h1>
        <div className="absolute -inset-x-6 -bottom-3 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-70" />
      </div>

      {/* Subtitle Directive */}
      <p className="mt-8 text-center font-mono text-xs tracking-[0.4em] text-[var(--text-secondary)] sm:text-sm">
        {subText}
      </p>

      {/* Progress Bar & Frame Counter */}
      <div className="mt-12 w-64 max-w-full">
        <div className="flex justify-between font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-1.5">
          <span>DECRYPTING CORE</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden bg-[var(--surface)] rounded-full">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-75 shadow-[0_0_10px_var(--accent-primary)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

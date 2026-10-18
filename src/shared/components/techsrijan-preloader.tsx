"use client";

import { useEffect, useState, useRef } from "react";

export function TechSrijanPreloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  // Rendered in the server HTML so it covers the page from first paint (no page-then-overlay flash).
  // Returning visitors: the inline <head> script sets html[data-booted], which hides it via CSS before hydration.
  const [isMounted, setIsMounted] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Check if initial boot preloader has already completed during this session
    const sessionKey = "techsrijan_site_booted";
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      setIsMounted(false);
      return;
    }

    // First time entering the site: initiate the boot sequence
    document.body.style.overflow = "hidden";

    let targetProgress = 20;

    // 1. Font readiness check
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        targetProgress = Math.max(targetProgress, 40);
      }).catch(() => {});
    }

    // 2. Document ready state check (pages load their own images; pre-fetching here only duplicated them)
    if (document.readyState === "complete") {
      targetProgress = Math.max(targetProgress, 90);
    } else {
      window.addEventListener(
        "load",
        () => {
          targetProgress = Math.max(targetProgress, 90);
        },
        { once: true }
      );
    }

    // 3. Smooth progress animation ticker
    const minDisplayTime = 950; // Premium cinematic entry rhythm for initial landing
    const maxSafetyTimeout = 1800; // Safety cap: never stall the user beyond 1.8s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      setProgress((prev) => {
        const next = Math.min(
          100,
          Math.max(
            prev + 4,
            Math.min(targetProgress, Math.round((elapsed / minDisplayTime) * 100))
          )
        );

        if (next >= 100 || elapsed >= maxSafetyTimeout) {
          clearInterval(interval);
          finishLoading();
          return 100;
        }

        return next;
      });
    }, 28);

    const safetyTimer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      finishLoading();
    }, maxSafetyTimeout);

    function finishLoading() {
      sessionStorage.setItem(sessionKey, "true");
      setTimeout(() => {
        setIsDone(true);
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("techsrijan-assets-loaded"));
      }, 250);

      setTimeout(() => {
        setIsMounted(false);
      }, 700);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, []); // Run strictly once on initial site visit, never on route changes!

  if (!isMounted) return null;

  return (
    <div
      aria-hidden={isDone}
      className={`ts-boot-loader fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030406] select-none transition-all duration-500 ease-out ${
        isDone ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* Background Subtle Cybernetic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,transparent_50%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

      {/* Center Emblem Container */}
      <div className="relative flex flex-col items-center justify-center px-6 max-w-sm w-full text-center z-10">
        {/* Animated TechSrijan Emblem Beacon */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulsing Backlight Halo */}
          <div className="absolute w-28 h-28 rounded-full bg-white/10 blur-2xl animate-pulse pointer-events-none" />

          {/* Rotating Sci-Fi Hex / Circle Orbit */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/20 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] bg-black/60 backdrop-blur-md">
            <div className="w-full h-full rounded-full border border-dashed border-white/40 flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>

            {/* Central Monogram / Insignia */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bebas text-2xl sm:text-3xl text-white tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                TS&apos;27
              </span>
            </div>
          </div>
        </div>

        {/* Festival Eyebrow & Headline */}
        <div className="space-y-1.5 mb-8">
          <h2 className="font-montserrat font-black text-xl sm:text-2xl tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
            TECHSRIJAN &apos;27
          </h2>
          <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
            IMPERIUM: REQUIEM
          </p>
        </div>

        {/* Progress Bar & Numerical Counter */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-end font-mono text-[10px] tracking-[0.2em] text-neutral-400">
            <span className="font-bold text-white tabular-nums">
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>

          {/* Cybernetic Progress Bar with Glowing Head */}
          <div className="relative h-[3px] w-full bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_0_6px_rgba(0,0,0,0.8)]">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-neutral-500 via-white to-white transition-all duration-100 ease-out shadow-[0_0_12px_#ffffff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

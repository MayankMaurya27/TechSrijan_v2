"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      // Mobile Touch Devices: bypass Lenis completely to use 120Hz native momentum scrolling
      const isTouch = window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);
      if (isTouch) {
        return;
      }
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false,
    });

    window.__lenis = lenis;

    lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      lenis.scrollTo(0, { immediate: true });
    };

    window.addEventListener("pageshow", resetToTop);
    window.addEventListener("load", resetToTop);
    window.addEventListener("beforeunload", resetToTop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pageshow", resetToTop);
      window.removeEventListener("load", resetToTop);
      window.removeEventListener("beforeunload", resetToTop);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}

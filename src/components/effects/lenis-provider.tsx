"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isMobileDevice } from "@/lib/device-tier";

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
    }

    const mobile = isMobileDevice() || (typeof window !== "undefined" && window.innerWidth < 1024);

    // On mobile devices, native touch scroll has zero JS overhead and 120Hz hardware momentum.
    // Hijacking touch with Lenis adds input lag on low-end mobile phones.
    if (mobile) {
      window.scrollTo(0, 0);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    window.__lenis = lenis;

    // Immediately anchor scroll to top
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

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

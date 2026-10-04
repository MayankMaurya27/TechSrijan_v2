"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "desktop-high" | "desktop-low" | "mobile";

/** Detect device tier once and cache it. Re-evaluates on resize. */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("desktop-high");

  useEffect(() => {
    const evaluateDevice = (): DeviceTier => {
      if (typeof window === "undefined") return "desktop-high";
      const width = window.innerWidth;
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      const cores = navigator.hardwareConcurrency || 2;

      // Mobile screens or touch devices below 1024px (phones & tablets)
      if (width < 768 || (isTouch && width < 1024)) {
        return "mobile";
      }
      if (width < 1024 || cores < 4) {
        return "desktop-low";
      }
      return "desktop-high";
    };

    setTier(evaluateDevice());

    const handleResize = () => {
      setTier(evaluateDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return tier;
}

/** One-shot check (no re-render, no state). Use in effects or outside React. */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;
  return width < 768 || (isTouch && width < 1024);
}

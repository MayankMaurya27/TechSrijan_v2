"use client";

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

/**
 * Synchronous, SSR-safe check for user prefers-reduced-motion accessibility preference.
 * Safe to call in browser environments, requestAnimationFrame callbacks, and setup logic.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

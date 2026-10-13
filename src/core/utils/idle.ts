/**
 * Run `fn` once the window has finished loading and the main thread is idle,
 * so heavy work (three.js, big videos, canvas loops) never competes with first paint.
 * `delayMs` pushes the work further past load (e.g. for expensive init like WebGL setup).
 * Returns a cancel function for effect cleanup.
 */
export function whenIdleAfterLoad(fn: () => void, delayMs = 0): () => void {
  let cancelled = false;
  const run = () => {
    if (!cancelled) fn();
  };
  const idle = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2000 });
    else setTimeout(run, 200); // Safari
  };
  const schedule = () => {
    if (delayMs > 0) setTimeout(idle, delayMs);
    else idle();
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
  };
}

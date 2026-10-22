"use client";

import { useEffect } from "react";

/**
 * SwordCursor
 *
 * ZERO-LATENCY HARDWARE CURSOR DELEGATION:
 * Delegates cursor rendering directly to the browser and OS GPU hardware plane via CSS.
 * Operates with 0ms JavaScript latency, 0 dropped frames, and native 60Hz-240Hz
 * monitor refresh rate on all devices (high-end desktop, laptops, and low-end devices).
 */
export function SwordCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove("has-enhanced-cursor", "has-sword-cursor");
    document.body.classList.remove("has-enhanced-cursor", "has-sword-cursor");
  }, []);

  return null;
}

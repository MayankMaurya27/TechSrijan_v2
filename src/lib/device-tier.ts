"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "desktop-high" | "desktop-low" | "mobile";

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("mobile");

  useEffect(() => {
    const evaluateDevice = () => {
      const width = window.innerWidth;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const cores = navigator.hardwareConcurrency || 2;

      if (width >= 1024 && isFinePointer && cores >= 4) {
        return "desktop-high";
      }
      if (width >= 768 && isFinePointer) {
        return "desktop-low";
      }
      return "mobile";
    };

    setTier(evaluateDevice());
  }, []);

  return tier;
}

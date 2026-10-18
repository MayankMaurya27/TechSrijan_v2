"use client";

import { useState, useEffect } from "react";
import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

/**
 * High-performance active canonical theme hook with 0ms DOM reactivity.
 * Listens to ThemeContext, inline head script mutation attributes on <html>,
 * and custom 'techsrijan-theme-change' broadcast events.
 */
export function useActiveCanonicalTheme(): CanonicalTheme {
  const themeContext = useTheme();
  const [currentTheme, setCurrentTheme] = useState<CanonicalTheme>(() =>
    normalizeTheme(themeContext?.resolvedTheme)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveCurrent = (): CanonicalTheme => {
      const domTheme = document.documentElement.getAttribute("data-theme");
      return normalizeTheme(domTheme || themeContext?.resolvedTheme);
    };

    const apply = () => {
      setCurrentTheme(resolveCurrent());
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("techsrijan-theme-change", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("techsrijan-theme-change", apply);
    };
  }, [themeContext?.resolvedTheme]);

  return currentTheme;
}

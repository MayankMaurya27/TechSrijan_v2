"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export type CanonicalTheme =
  | "arrakis-day"
  | "krelln-night"
  | "geass-moon";

export type Theme =
  | CanonicalTheme
  | "arrakis"
  | "giedi-prime"
  | "kelln-night"
  | "geass";

export function normalizeTheme(raw: string | null | undefined): CanonicalTheme {
  if (!raw) return "arrakis-day";
  const lower = raw.trim().toLowerCase();
  if (lower === "arrakis" || lower === "arrakis-day") return "arrakis-day";
  if (lower === "krelln-night" || lower === "kelln-night" || lower === "krelln") return "krelln-night";
  if (lower === "geass-moon" || lower === "giedi-prime" || lower === "geass") return "geass-moon";
  return "arrakis-day";
}

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: CanonicalTheme;
  isArrakis: boolean;
  isGeass: boolean;
  setTheme: (theme: Theme) => void;
}

const defaultContext: ThemeContextType = {
  theme: "arrakis-day",
  resolvedTheme: "arrakis-day",
  isArrakis: true,
  isGeass: false,
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

const STORAGE_KEY = "techsrijan-theme";
const LEGACY_STORAGE_KEY = "imperium-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CanonicalTheme>("arrakis-day");

  // Synchronize DOM attribute and dispatch telemetry events
  const applyThemeToDOM = useCallback((canonical: CanonicalTheme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", canonical);
      // Dual-tag arrakis and giedi-prime to ensure legacy stylesheet selectors resolve instantly
      if (canonical === "arrakis-day") {
        document.documentElement.dataset.themeAlias = "arrakis";
      } else if (canonical === "geass-moon") {
        document.documentElement.dataset.themeAlias = "giedi-prime";
      } else {
        delete document.documentElement.dataset.themeAlias;
      }
      window.dispatchEvent(
        new CustomEvent("techsrijan-theme-change", { detail: { theme: canonical } })
      );
    }
  }, []);

  // Stabilized theme setter
  const setTheme = useCallback(
    (newTheme: Theme) => {
      const resolved = normalizeTheme(newTheme);
      setThemeState(resolved);
      applyThemeToDOM(resolved);

      try {
        localStorage.setItem(STORAGE_KEY, resolved);
      } catch {
        // Handle private browsing quota exceptions gracefully
      }
    },
    [applyThemeToDOM]
  );

  // Initialize from storage or pre-rendered DOM attribute
  useEffect(() => {
    let initial: CanonicalTheme = "arrakis-day";
    try {
      const domTheme = document.documentElement.getAttribute("data-theme");
      const stored =
        localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      initial = normalizeTheme(stored || domTheme);
    } catch {
      initial = "arrakis-day";
    }

    setThemeState(initial);
    applyThemeToDOM(initial);

    // Cross-tab theme synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        const next = normalizeTheme(e.newValue);
        setThemeState(next);
        applyThemeToDOM(next);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [applyThemeToDOM]);

  const value = useMemo<ThemeContextType>(() => {
    const isArrakis = theme === "arrakis-day";
    const isGeass = theme === "geass-moon";
    return {
      theme,
      resolvedTheme: theme,
      isArrakis,
      isGeass,
      setTheme,
    };
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultContext;
  }
  return context;
}

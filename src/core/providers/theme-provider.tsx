"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme =
  | "arrakis-day"
  | "krelln-night"
  | "avron-night"
  | "geass-moon"
  | "arrakis"
  | "giedi-prime"
  | "kelln-night"
  | "arvon-night";

function normalizeTheme(raw: string | null): Theme {
  if (!raw) return "arrakis-day";
  if (raw === "arrakis" || raw === "arrakis-day") return "arrakis-day";
  if (raw === "krelln-night" || raw === "kelln-night" || raw === "krelln") return "krelln-night";
  if (raw === "avron-night" || raw === "arvon-night" || raw === "avron") return "avron-night";
  if (raw === "geass-moon" || raw === "giedi-prime" || raw === "geass") return "geass-moon";
  return "arrakis-day";
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultContext: ThemeContextType = {
  theme: "arrakis-day",
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("arrakis-day");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("techsrijan-theme") || localStorage.getItem("imperium-theme");
      const resolved = normalizeTheme(stored);
      setThemeState(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    } catch {
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    const resolved = normalizeTheme(newTheme);
    setThemeState(resolved);
    try {
      localStorage.setItem("techsrijan-theme", resolved);
    } catch {
    }
    document.documentElement.setAttribute("data-theme", resolved);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

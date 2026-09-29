"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Sandworm3D = dynamic(
  () => import("./sandworm-3d").then((mod) => mod.Sandworm3D),
  { ssr: false }
);

const SESSION_KEY = "imperium_sandworm_shown";

export function IntroGate() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasShown = sessionStorage.getItem(SESSION_KEY);
    // If not shown yet, trigger the 3D WebGL Sandworm emergence
    if (!hasShown) {
      setShouldPlay(true);
    }
  }, []);

  if (!mounted || !shouldPlay) return null;

  return (
    <Sandworm3D
      onComplete={() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShouldPlay(false);
      }}
    />
  );
}

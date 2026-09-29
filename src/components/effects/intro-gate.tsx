"use client";

import { useEffect, useState } from "react";
import { CipherIntro } from "./cipher-intro";

const SESSION_KEY = "imperium_intro_executed_v2";

export function IntroGate() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasPlayed = sessionStorage.getItem(SESSION_KEY);
    if (!hasPlayed) {
      setShouldPlay(true);
    }
  }, []);

  if (!mounted || !shouldPlay) return null;

  return (
    <CipherIntro
      onComplete={() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShouldPlay(false);
      }}
    />
  );
}

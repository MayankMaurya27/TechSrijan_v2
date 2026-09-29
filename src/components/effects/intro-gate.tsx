"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeviceTier } from "@/lib/device-tier";

const SandwormIntro = dynamic(() => import("./sandworm-intro"), {
  ssr: false,
});

const SESSION_KEY = "imperium_intro_executed";

export function IntroGate() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const tier = useDeviceTier();

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem(SESSION_KEY);
    if (!hasPlayed && tier === "desktop-high") {
      setShouldPlay(true);
    }
  }, [tier]);

  if (!shouldPlay) return null;

  return (
    <SandwormIntro
      onComplete={() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShouldPlay(false);
      }}
    />
  );
}

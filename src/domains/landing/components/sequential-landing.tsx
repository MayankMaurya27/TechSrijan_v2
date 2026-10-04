"use client";

import { useState, useEffect, useCallback } from "react";
import { IntroVideo } from "./intro-video";
import { ScrollJourney } from "@/components/landing/scroll-journey";

export type LandingFlowState =
  | "01_INTRO_SEQUENCE"
  | "02_TRANSITION_PHASE"
  | "03_LANDING_ACTIVE";

const SESSION_KEY = "techsrijan_intro_video_played";

export function SequentialLanding() {
  const [flowState, setFlowState] = useState<LandingFlowState>("01_INTRO_SEQUENCE");
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    let hasPlayed = false;
    try {
      hasPlayed = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      hasPlayed = false;
    }

    if (hasPlayed) {
      setFlowState("03_LANDING_ACTIVE");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("intro-complete"));
        window.dispatchEvent(new CustomEvent("intro-sequence-active"));
      }
    } else {
      setFlowState("01_INTRO_SEQUENCE");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("intro-sequence-start"));
      }
    }

    setHasCheckedSession(true);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setFlowState("02_TRANSITION_PHASE");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("intro-sequence-transition"));
    }

    setTimeout(() => {
      setFlowState("03_LANDING_ACTIVE");
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(SESSION_KEY, "true");
        } catch {}
        window.dispatchEvent(new CustomEvent("intro-complete"));
        window.dispatchEvent(new CustomEvent("intro-sequence-active"));
      }
    }, 700);
  }, []);

  if (!hasCheckedSession) {
    return <div className="fixed inset-0 bg-black z-50" />;
  }

  const isIntroSequence = flowState === "01_INTRO_SEQUENCE";
  const isTransitionPhase = flowState === "02_TRANSITION_PHASE";
  const isLandingActive = flowState === "03_LANDING_ACTIVE";

  return (
    <div className="relative w-full bg-black min-h-screen">
      {(isIntroSequence || isTransitionPhase) && (
        <IntroVideo
          onComplete={handleVideoEnded}
          isFading={isTransitionPhase}
        />
      )}

      {(isTransitionPhase || isLandingActive) && (
        <div
          className={`relative w-full transition-opacity duration-700 ease-in-out ${
            isTransitionPhase ? "opacity-0 animate-fade-in" : "opacity-100"
          }`}
        >
          <ScrollJourney />
        </div>
      )}
    </div>
  );
}

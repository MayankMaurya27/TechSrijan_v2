"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isMobileDevice } from "@/core";

const SESSION_KEY = "techsrijan_intro_video_played";

export interface IntroVideoProps {
  src?: string;
  poster?: string;
  onComplete?: () => void;
  isFading?: boolean;
}

export function IntroVideo({
  src = "/intro.mp4",
  poster = "/intro-poster.jpg",
  onComplete,
  isFading: externalIsFading,
}: IntroVideoProps) {
  // Initialize to true so initial SSR markup and first client paint covers the viewport completely with zero flash
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  // Guarantee instant scroll reset to top of landing page
  const forceScrollTop = useCallback(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if ((window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis) {
        (window as unknown as { __lenis: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis.scrollTo(0, { immediate: true });
      }
    }
  }, []);

  // Per-tab check: if already watched in this tab, dismiss instantly with zero flash
  useEffect(() => {
    forceScrollTop();
    if (isMobileDevice()) {
      setActiveSrc("/intro-mobile.mp4");
    }
    if (typeof window !== "undefined") {
      try {
        const hasPlayedInTab = sessionStorage.getItem(SESSION_KEY);
        if (hasPlayedInTab) {
          // Already played in this tab: unmount immediately and trigger landing animations
          setShouldRender(false);
          document.documentElement.setAttribute("data-intro-played", "true");
          window.dispatchEvent(new CustomEvent("intro-complete"));
          return;
        }
      } catch {
        // Fallback if sessionStorage is disabled
      }
    }
  }, [forceScrollTop]);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Save flag for this browser tab
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
        document.documentElement.setAttribute("data-intro-played", "true");
      } catch {
        // Storage access error handling
      }
    }

    // Immediately anchor to top
    forceScrollTop();
    setIsFading(true);

    // Notify landing page and navbar components to animate in with the landing page
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("intro-complete"));
    }
    onComplete?.();

    setTimeout(() => {
      setShouldRender(false);
      forceScrollTop();
    }, 700);
  }, [forceScrollTop, onComplete]);

  // Robust muted autoplay attempt
  useEffect(() => {
    if (!shouldRender) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent handling if browser requires user touch
        });
      }
    };

    attemptPlay();

    video.addEventListener("canplay", attemptPlay, { once: true });
    return () => {
      video.removeEventListener("canplay", attemptPlay);
    };
  }, [shouldRender]);

  // Listen for Escape key to skip intro
  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, handleComplete]);

  // Lock body scroll while intro is visible, and enforce top scroll on unmount
  useEffect(() => {
    if (shouldRender) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      forceScrollTop();
      return () => {
        document.body.style.overflow = originalOverflow;
        forceScrollTop();
      };
    }
  }, [shouldRender, forceScrollTop]);

  if (!shouldRender) return null;

  return (
    <div
      id="techsrijan-intro-video"
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden select-none transition-opacity duration-700 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleComplete}
        onError={handleComplete}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

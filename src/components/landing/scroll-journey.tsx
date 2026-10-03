"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDeviceTier } from "@/lib/device-tier";
import { HeroTitle } from "./hero-title";

interface ScrollJourneyProps {
  landingSrc?: string;
  scrollSrc?: string;
}

export function ScrollJourney({
  landingSrc = "/landing-bg.mp4",
  scrollSrc,
}: ScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollVideoRef = useRef<HTMLVideoElement>(null);
  const landingVideoRef = useRef<HTMLVideoElement>(null);

  const deviceTier = useDeviceTier();
  // Automatically choose 720p lightweight stream on mobile/low-end devices, 1080p on desktop
  const activeScrollSrc =
    scrollSrc ||
    (deviceTier === "mobile"
      ? "/scrolling-mobile.mp4"
      : "/scrolling-hd.mp4");

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  // Attempt to seek scroll video smoothly without piling up seek requests
  const attemptSeek = useCallback(() => {
    const video = scrollVideoRef.current;
    if (!video || !video.duration || isSeekingRef.current) return;

    const target = targetTimeRef.current;
    if (Math.abs(video.currentTime - target) > 0.02) {
      isSeekingRef.current = true;
      const vid = video as HTMLVideoElement & { fastSeek?: (t: number) => void };
      if (typeof vid.fastSeek === "function") {
        try {
          vid.fastSeek(target);
          return;
        } catch {
          // fallback to standard currentTime
        }
      }
      video.currentTime = target;
    }
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = scrollVideoRef.current;
    if (video && video.duration) {
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
        attemptSeek();
      }
    }
  }, [attemptSeek]);

  // Synchronize and lock scroll to top on mount and when intro video completes
  useEffect(() => {
    const resetToTop = () => {
      setScrollProgress(0);
      targetTimeRef.current = 0;
      if (scrollVideoRef.current) {
        scrollVideoRef.current.currentTime = 0;
      }
      if (landingVideoRef.current) {
        landingVideoRef.current.currentTime = 0;
        landingVideoRef.current.play().catch(() => {});
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
      }
    };

    resetToTop();

    window.addEventListener("intro-complete", resetToTop);
    return () => {
      window.removeEventListener("intro-complete", resetToTop);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalDistance = rect.height - windowHeight;

          if (totalDistance <= 0) {
            ticking = false;
            return;
          }

          // Calculate normalized progress (0.0 to 1.0)
          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalDistance;
          const progress = Math.max(0, Math.min(1, rawProgress));

          setScrollProgress(progress);

          // Hardware optimization: pause ambient video while user is scrolling down
          // to conserve GPU decode channels on low-end devices
          if (progress > 0.08) {
            if (landingVideoRef.current && !landingVideoRef.current.paused) {
              landingVideoRef.current.pause();
            }
          } else {
            if (landingVideoRef.current && landingVideoRef.current.paused) {
              landingVideoRef.current.play().catch(() => {});
            }
          }

          const video = scrollVideoRef.current;
          if (video && video.duration) {
            targetTimeRef.current = progress * video.duration;
            attemptSeek();
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [attemptSeek]);

  // Smooth crossfade from ambient landing loop to scroll-driven video as user scrolls
  const scrollVideoOpacity = Math.min(1, scrollProgress * 15);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[450vh] bg-black -mt-16"
    >
      {/* Sticky Fullscreen Video Window - 100% natural brightness, pure & clear */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        {/* Layer 1: Ambient Landing Background Loop (landing_asset.mp4) - Continuous, Alive, Seamless */}
        <video
          ref={landingVideoRef}
          src={landingSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />

        {/* Layer 2: Interactive Scroll Journey Video (scrolling_asset.mp4) - Controlled by user scroll */}
        <video
          ref={scrollVideoRef}
          src={activeScrollSrc}
          playsInline
          muted
          preload="auto"
          onSeeked={handleSeeked}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-150"
          style={{
            opacity: scrollVideoOpacity,
            willChange: "transform, opacity",
          }}
        />

        {/* Layer 3: TechSrijan '27 Main Landing Hero Title (enters on intro end, fades on scroll) */}
        <HeroTitle scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}

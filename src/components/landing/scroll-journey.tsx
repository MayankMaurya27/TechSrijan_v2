"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDeviceTier } from "@/lib/device-tier";
import { HeroTitle } from "./hero-title";
import { Paul3D } from "./paul-3d";

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
  const isMobileOrTablet = deviceTier === "mobile" || deviceTier === "desktop-low";

  // Use the ultra-optimized GOP=2 mobile stream on mobile/tablets, 1080p stream on high-end desktop
  const activeScrollSrc =
    scrollSrc ||
    (isMobileOrTablet ? "/scrolling-mobile.mp4" : "/scrolling-hd.mp4");

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekWatchdogRef = useRef<NodeJS.Timeout | null>(null);
  const isPrimedRef = useRef(false);

  // Attempt to seek scroll video smoothly without piling up seek requests or deadlocking
  const attemptSeek = useCallback(() => {
    const video = scrollVideoRef.current;
    if (!video || !video.duration || isSeekingRef.current) return;

    // Safety: Clamp strictly to duration - 0.12s on all devices
    // Reaching exact video.duration fires 'ended' and wipes mobile video frames to black!
    const maxSafeTime = Math.max(0, video.duration - 0.12);
    const safeTarget = Math.max(0, Math.min(maxSafeTime, targetTimeRef.current));

    if (Math.abs(video.currentTime - safeTarget) > 0.03) {
      isSeekingRef.current = true;
      video.currentTime = safeTarget;

      // Watchdog: Mobile browsers often drop the 'seeked' event under touch-scroll load.
      // Force unlock after 80ms so seeking NEVER deadlocks.
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        const v = scrollVideoRef.current;
        if (v && v.duration) {
          const m = Math.max(0, v.duration - 0.12);
          const st = Math.max(0, Math.min(m, targetTimeRef.current));
          if (Math.abs(v.currentTime - st) > 0.03) {
            attemptSeek();
          }
        }
      }, 80);
    }
  }, []);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) {
      clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = null;
    }
    isSeekingRef.current = false;
    const video = scrollVideoRef.current;
    if (video && video.duration) {
      const maxSafeTime = Math.max(0, video.duration - 0.12);
      const safeTarget = Math.max(0, Math.min(maxSafeTime, targetTimeRef.current));
      if (Math.abs(video.currentTime - safeTarget) > 0.03) {
        attemptSeek();
      }
    }
  }, [attemptSeek]);

  // Prime mobile video decoder on first touch/interaction to unlock GPU scrubbing
  const primeMobileVideo = useCallback(() => {
    if (isPrimedRef.current) return;
    isPrimedRef.current = true;
    const v = scrollVideoRef.current;
    if (v && v.paused) {
      v.play()
        .then(() => {
          v.pause();
        })
        .catch(() => {});
    }
  }, []);

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

          // Mobile hardware optimization:
          // Mobile GPUs have strict limits on concurrent active video decoders.
          // Pause and detach landingVideo while user is scrolling down to give scrollVideo exclusive GPU pipeline.
          if (progress > 0.04) {
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
            const maxSafeTime = Math.max(0, video.duration - 0.12);
            targetTimeRef.current = Math.min(maxSafeTime, Math.max(0, progress * video.duration));
            attemptSeek();
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", primeMobileVideo, { passive: true, once: true });
    window.addEventListener("pointerdown", primeMobileVideo, { passive: true, once: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", primeMobileVideo);
      window.removeEventListener("pointerdown", primeMobileVideo);
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
    };
  }, [attemptSeek, primeMobileVideo]);

  // Smooth crossfade from ambient landing loop to scroll-driven video as user scrolls
  const scrollVideoOpacity = Math.min(1, scrollProgress * 15);
  // Atmospheric citadel avenue backdrop opacity (fades in as gate is entered)
  const citadelBackdropOpacity =
    scrollProgress > 0.50 ? Math.min(1, (scrollProgress - 0.50) * 6) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[360vh] sm:min-h-[400vh] md:min-h-[450vh] bg-black -mt-16"
    >
      {/* Sticky Fullscreen Video Window - 100% natural brightness, pure & clear */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-black">
        {/* Layer 1: Ambient Landing Background Loop (landing_asset.mp4) */}
        <video
          ref={landingVideoRef}
          src={landingSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-300"
          style={{
            opacity: scrollProgress > 0.08 ? 0 : 1,
            visibility: scrollProgress > 0.15 ? "hidden" : "visible",
          }}
        />

        {/* Layer 1.5: Citadel Avenue Fallback Backdrop (Guarantees screen NEVER blacks out on mobile during gate entry) */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: "url('/citadel-poster.jpg')",
            opacity: citadelBackdropOpacity,
          }}
        />

        {/* Layer 2: Interactive Scroll Journey Video (scrolling-hd.mp4 or scrolling-mobile.mp4) */}
        <video
          ref={scrollVideoRef}
          src={activeScrollSrc}
          poster="/citadel-poster.jpg"
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

        {/* Layer 4: Paul Atreides 3D Model with interactive sideways rotation */}
        <Paul3D scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}

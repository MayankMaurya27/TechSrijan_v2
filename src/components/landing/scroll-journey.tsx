"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isMobileDevice } from "@/lib/device-tier";
import { HeroTitle } from "./hero-title";
import { Paul3D } from "./paul-3d";
import { SocialConstellation } from "./social-constellation";
import { CitadelArchive } from "./citadel-archive";

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

  // Hardware Canvas for mobile (immune to mobile browser seek blanking)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeekTimeRef = useRef(0);
  const throttledSeekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPrimedRef = useRef(false);
  const isMobileRef = useRef(false);
  const rafIdRef = useRef<number>(0);
  const lastPaintedTimeRef = useRef(-1);

  // Intense temporal millisecond flash burst state
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const lastPulseTimeRef = useRef(0);
  const prevProgressRef = useRef(0);

  // Device detection: active for mobile devices OR viewport width < 1024px
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024 || isMobileDevice();
  }, []);

  // Choose video source based on device (1080x1920 all-intra mobile_asset on mobile, scrolling-hd on laptop)
  const activeScrollSrc =
    scrollSrc || (isMobile ? "/scrolling-mobile.mp4" : "/scrolling-hd.mp4");

  useEffect(() => {
    const mobile = checkIsMobile();
    setIsMobile(mobile);
    isMobileRef.current = mobile;
  }, [checkIsMobile]);

  // ─── Canvas Frame Painting (Mobile Only) ────────────────────────
  const paintCanvas = useCallback((force = false) => {
    if (!isMobileRef.current) return;
    const canvas = canvasRef.current;
    const video = scrollVideoRef.current;
    if (!canvas || !video) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // CRITICAL: NEVER paint while video is actively seeking or doesn't have current frame data!
    // Drawing during seeking is what causes mobile WebKit/Chrome to paint solid black frames.
    if (video.seeking || video.readyState < 2) return;

    // Avoid redundant repaints of the exact same frame timestamp unless forced
    if (!force && Math.abs(video.currentTime - lastPaintedTimeRef.current) < 0.005) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    const canvasAspect = cW / cH;
    const videoAspect = vW / vH;

    let drawW = cW;
    let drawH = cH;
    let offX = 0;
    let offY = 0;

    if (canvasAspect > videoAspect) {
      drawW = cW;
      drawH = cW / videoAspect;
      offY = (cH - drawH) / 2;
    } else {
      drawH = cH;
      drawW = cH * videoAspect;
      offX = (cW - drawW) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    ctx.drawImage(video, offX, offY, drawW, drawH);
    lastPaintedTimeRef.current = video.currentTime;
  }, []);

  // Size canvas to viewport bounding rect with crisp clarity (capped at 1.25x DPR for optimal low-end mobile fill rate)
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round((rect.width || window.innerWidth) * dpr);
    const h = Math.round((rect.height || window.innerHeight) * dpr);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  // Paint initial baseline poster onto canvas so it is never blank on mount
  useEffect(() => {
    if (!isMobile) return;
    syncCanvasSize();

    const poster = new Image();
    poster.src = "/scrolling-mobile-poster.jpg";
    poster.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const cW = canvas.width;
      const cH = canvas.height;
      const pW = poster.naturalWidth;
      const pH = poster.naturalHeight;
      const canvasAspect = cW / cH;
      const posterAspect = pW / pH;
      let dW = cW, dH = cH, oX = 0, oY = 0;
      if (canvasAspect > posterAspect) {
        dW = cW;
        dH = cW / posterAspect;
        oY = (cH - dH) / 2;
      } else {
        dH = cH;
        dW = cH * posterAspect;
        oX = (cW - dW) / 2;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(poster, oX, oY, dW, dH);
    };

    const onResize = () => {
      const mobile = checkIsMobile();
      setIsMobile(mobile);
      isMobileRef.current = mobile;
      syncCanvasSize();
      paintCanvas(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [checkIsMobile, isMobile, paintCanvas, syncCanvasSize]);

  // ─── Precision Video Seeking & Queue Chaining ────────────────────
  const attemptSeek = useCallback(() => {
    const video = scrollVideoRef.current;
    if (!video || !video.duration) return;
    if (isSeekingRef.current) return;

    // Mobile hardware decoder optimization: throttle rapid seek flooding
    if (isMobileRef.current) {
      const now = performance.now();
      const elapsed = now - lastSeekTimeRef.current;
      if (elapsed < 40) {
        if (!throttledSeekTimerRef.current) {
          throttledSeekTimerRef.current = setTimeout(() => {
            throttledSeekTimerRef.current = null;
            attemptSeek();
          }, 40 - elapsed);
        }
        return;
      }
    }

    // Desktop: clamp to 3.65s (Image 2) so Image 3 (end plaza) is never reached!
    // Mobile: keep full mobile video duration.
    const maxSafe = isMobileRef.current
      ? Math.max(0, video.duration - 0.05)
      : Math.min(3.65, Math.max(0, video.duration - 0.05));
    const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));
    const minDelta = isMobileRef.current ? 0.045 : 0.015;

    if (Math.abs(video.currentTime - target) > minDelta) {
      isSeekingRef.current = true;
      lastSeekTimeRef.current = performance.now();

      // Use fastSeek on supported mobile browsers (instant hardware keyframe seek)
      const v = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
      if (typeof v.fastSeek === "function") {
        v.fastSeek(target);
      } else {
        video.currentTime = target;
      }

      // Watchdog: If browser drops `seeked` event, unlock after 150ms
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        attemptSeek();
      }, 150);
    }
  }, []);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) {
      clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = null;
    }
    isSeekingRef.current = false;

    // Immediately paint decoded frame to canvas on mobile
    paintCanvas();

    // If user scrolled while the previous seek was executing, chain to latest target
    const video = scrollVideoRef.current;
    if (video && video.duration) {
      const maxSafe = isMobileRef.current
        ? Math.max(0, video.duration - 0.05)
        : Math.min(3.65, Math.max(0, video.duration - 0.05));
      const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));
      const minDelta = isMobileRef.current ? 0.045 : 0.015;
      if (Math.abs(video.currentTime - target) > minDelta) {
        attemptSeek();
      }
    }
  }, [attemptSeek, paintCanvas]);

  // Prime mobile video decoder on first user gesture
  const primeMobileVideo = useCallback(() => {
    if (isPrimedRef.current) return;
    isPrimedRef.current = true;
    const v = scrollVideoRef.current;
    if (v && v.paused) {
      v.play().then(() => v.pause()).catch(() => {});
    }
  }, []);

  // ─── Scroll Reset ────────────────────────────────────────────────
  useEffect(() => {
    const resetToTop = () => {
      setScrollProgress(0);
      targetTimeRef.current = 0;
      if (scrollVideoRef.current) scrollVideoRef.current.currentTime = 0;
      if (landingVideoRef.current) {
        landingVideoRef.current.currentTime = 0;
        landingVideoRef.current.play().catch(() => {});
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      }
    };

    resetToTop();
    window.addEventListener("intro-complete", resetToTop);
    return () => window.removeEventListener("intro-complete", resetToTop);
  }, []);

  // ─── Scroll Listener ─────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        if (!containerRef.current) {
          ticking = false;
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const winH = window.innerHeight;
        const totalDist = rect.height - winH;
        if (totalDist <= 0) {
          ticking = false;
          return;
        }

        const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
        setScrollProgress(progress);

        // Manage landing loop playback to free mobile GPU decoder
        if (progress > 0.005) {
          if (landingVideoRef.current && !landingVideoRef.current.paused) {
            landingVideoRef.current.pause();
          }
        } else {
          if (landingVideoRef.current && landingVideoRef.current.paused) {
            landingVideoRef.current.play().catch(() => {});
          }
        }

        // Calculate target video timestamp
        const video = scrollVideoRef.current;
        if (video && video.duration) {
          if (isMobileRef.current) {
            // Mobile: keep full mobile video duration intact
            const maxDuration = Math.max(0, video.duration - 0.05);
            const arrivalProgress = 0.80;
            const scaled = Math.min(1, progress / arrivalProgress);
            targetTimeRef.current = Math.min(maxDuration, scaled * maxDuration);
          } else {
            // Desktop/laptop: park precisely at 3.42s (Image 2 - open citadel avenue)
            // so Image 3 (end plaza) never appears!
            const image2Time = Math.min(3.42, Math.max(0, video.duration - 0.05));
            const arrivalProgress = 0.82;
            const scaled = Math.min(1, progress / arrivalProgress);
            targetTimeRef.current = Math.min(image2Time, scaled * image2Time);
          }
          attemptSeek();
        }

        ticking = false;
      });
      ticking = true;
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
      if (throttledSeekTimerRef.current) clearTimeout(throttledSeekTimerRef.current);
    };
  }, [attemptSeek, primeMobileVideo]);

  // Trigger a blinding temporal solar burst on desktop as the user traverses the gate portal
  useEffect(() => {
    if (isMobile) return; // Prevent 60fps React state re-renders on mobile CPU/GPU
    const gateThreshold = 0.68;
    if (
      scrollProgress >= gateThreshold &&
      scrollProgress <= gateThreshold + 0.18 &&
      prevProgressRef.current < gateThreshold
    ) {
      const now = performance.now();
      if (now - lastPulseTimeRef.current > 850) {
        lastPulseTimeRef.current = now;
        setPulseIntensity(1);

        let start: number | null = null;
        const duration = 1450; // Sustained solar brilliance (~1450ms) so light lingers as character materializes
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          const p = Math.min(1, elapsed / duration);
          // Blinding hold for ~420ms, then silky-smooth dissipation as Paul spawns
          const intensity = p < 0.29 ? 1 : Math.max(0, 1 - Math.pow((p - 0.29) / 0.71, 1.2));
          setPulseIntensity(intensity);
          if (p < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }
    }
    prevProgressRef.current = scrollProgress;
  }, [scrollProgress, isMobile]);

  // ─── Derived Layer Opacities ─────────────────────────────────────
  const landingOpacity = Math.max(0, 1 - scrollProgress * 12);
  const scrollVideoOpacity = Math.min(1, scrollProgress * 14);

  // Gate Solar Flash Light curve (fires as the gate opens and lingers as Paul 3D spawns)
  const flashStart = isMobile ? 0.48 : 0.62;
  const flashPeak = isMobile ? 0.60 : 0.73;
  const flashEnd = isMobile ? 0.80 : 0.86; // Light gently concludes right as Paul finishes materializing

  let scrollFlash = 0;
  if (scrollProgress >= flashStart && scrollProgress <= flashEnd) {
    if (scrollProgress < flashPeak) {
      // Fast exponential flare build-up as gates open
      const t = (scrollProgress - flashStart) / (flashPeak - flashStart);
      scrollFlash = Math.sin((t * Math.PI) / 2);
    } else {
      // Smooth decay that gently blankets Paul's spawn at 0.77-0.85
      const t = (scrollProgress - flashPeak) / (flashEnd - flashPeak);
      scrollFlash = Math.cos((t * Math.PI) / 2);
    }
  }

  // Combined high-intensity solar flash (more intense, radiant, sustained)
  const totalFlashIntensity = isMobile
    ? Math.min(1, scrollFlash * 1.4)
    : Math.min(1, Math.max(scrollFlash * 1.55, pulseIntensity));

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[250vh] sm:min-h-[340vh] md:min-h-[440vh] bg-black -mt-16"
    >
      {/* Sticky Fullscreen Video Window with dynamic viewport support */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden select-none bg-black">
        {/* Layer 0: Static baseline poster (never pitch black) */}
        <div
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{
            backgroundImage: isMobile
              ? "url('/scrolling-mobile-poster.jpg')"
              : "url('/scrolling-hd-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* === MOBILE PATH: Hardware Canvas (immune to browser seek blanking) === */}
        {isMobile && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        {/* === DESKTOP PATH: Direct video element === */}
        {!isMobile && (
          <video
            ref={scrollVideoRef}
            src={activeScrollSrc}
            poster="/scrolling-hd-poster.jpg"
            playsInline
            muted
            preload="auto"
            onSeeked={handleSeeked}
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-150"
            style={{
              opacity: scrollVideoOpacity,
              zIndex: 1,
            }}
          />
        )}

        {/* === MOBILE: Decoder video element (kept active in layout tree for hardware acceleration) === */}
        {isMobile && (
          <video
            ref={scrollVideoRef}
            src={activeScrollSrc}
            playsInline
            muted
            preload="auto"
            onSeeked={handleSeeked}
            onLoadedData={() => paintCanvas(true)}
            onLoadedMetadata={() => {
              if (targetTimeRef.current > 0) attemptSeek();
            }}
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.001,
              zIndex: -1,
            }}
          />
        )}

        {/* Layer 1.2: Ambient Landing Background Loop */}
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
            opacity: landingOpacity,
            visibility: scrollProgress > 0.12 ? "hidden" : "visible",
            zIndex: 2,
          }}
        />

        {/* Layer 3: TechSrijan Main Landing Hero Title */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <HeroTitle scrollProgress={scrollProgress} />
        </div>


        {/* Layer 3.8: Cinematic Solar Gate Flash & Flare (Natural Volumetric Illumination) */}
        {totalFlashIntensity > 0.001 && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-75"
            style={{
              opacity: totalFlashIntensity,
              zIndex: 14,
              mixBlendMode: isMobile ? "normal" : "screen",
            }}
          >
            {/* 1. Full-screen warm solar exposure wash */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: isMobile
                  ? "radial-gradient(ellipse 95% 85% at 50% 46%, rgba(255, 252, 225, 0.82) 0%, rgba(255, 220, 120, 0.40) 45%, rgba(240, 145, 45, 0.15) 75%, transparent 100%)"
                  : "radial-gradient(ellipse 95% 85% at 50% 46%, rgba(255, 252, 225, 0.95) 0%, rgba(255, 220, 120, 0.70) 35%, rgba(240, 145, 45, 0.32) 68%, transparent 100%)",
              }}
            />

            {/* Desktop only: Multi-pass heavy blur bloom to avoid mobile GPU stall */}
            {!isMobile && (
              <>
                {/* 2. Intense center portal gateway solar bloom (Deep volumetric spherical core) */}
                <div
                  className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88vw] h-[80vh] max-w-[1150px] rounded-full blur-[44px]"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255, 255, 255, 1.0) 0%, rgba(255, 235, 160, 0.85) 28%, rgba(250, 165, 50, 0.45) 62%, transparent 100%)",
                  }}
                />

                {/* 2.5. Blinding white-hot gateway epicenter surge */}
                <div
                  className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48vw] h-[48vh] max-w-[580px] rounded-full blur-[26px]"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255, 255, 255, 0.98) 0%, rgba(255, 245, 205, 0.65) 45%, transparent 80%)",
                  }}
                />

                {/* 3. Soft broad horizontal atmospheric light halo (Extremely feathered, zero line artifact) */}
                <div
                  className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[240px] max-h-[38vh] blur-[52px]"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 70% at center, rgba(255, 252, 235, 0.85) 0%, rgba(255, 215, 120, 0.45) 45%, rgba(240, 140, 40, 0.18) 75%, transparent 100%)",
                  }}
                />

                {/* 4. Broad vertical volumetric sunlight pouring down through the portal opening */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] sm:w-[520px] h-full blur-[36px] opacity-85"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 252, 230, 0.88) 0%, rgba(255, 215, 110, 0.50) 40%, rgba(240, 140, 35, 0.20) 75%, transparent 95%)",
                  }}
                />
              </>
            )}
          </div>
        )}

        {/* Layer 4: Paul Atreides 3D Model (Materializes as the gate opens, visual anchor in lower-left foreground) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 22 }}>
          <Paul3D scrollProgress={scrollProgress} />
        </div>

        {/* Layer 5: Citadel Archive (Monumental 3D information slabs revealing systems of the citadel) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
          <CitadelArchive scrollProgress={scrollProgress} />
        </div>

        {/* Layer 5.5: Celestial Social Constellation Hologram (Anchored on the far right end) */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 28 }}>
            <SocialConstellation scrollProgress={scrollProgress} />
          </div>
        )}
      </div>
    </div>
  );
}

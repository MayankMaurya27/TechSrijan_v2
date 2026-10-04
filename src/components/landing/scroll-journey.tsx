"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isMobileDevice } from "@/lib/device-tier";
import { HeroTitle } from "./hero-title";
import { Paul3D } from "./paul-3d";
import { SocialConstellation } from "./social-constellation";

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
  const isPrimedRef = useRef(false);
  const isMobileRef = useRef(false);
  const rafIdRef = useRef<number>(0);
  const lastPaintedTimeRef = useRef(-1);

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

    // Desktop: clamp to 3.65s (Image 2) so Image 3 (end plaza) is never reached!
    // Mobile: keep full mobile video duration.
    const maxSafe = isMobileRef.current
      ? Math.max(0, video.duration - 0.05)
      : Math.min(3.65, Math.max(0, video.duration - 0.05));
    const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));

    if (Math.abs(video.currentTime - target) > 0.015) {
      isSeekingRef.current = true;

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
      if (Math.abs(video.currentTime - target) > 0.015) {
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
          // On desktop/laptop: cap at 3.65s (Image 2) so Image 3 (end plaza) never appears!
          // On mobile phones: keep full mobile video duration intact.
          const maxDuration = isMobileRef.current
            ? Math.max(0, video.duration - 0.05)
            : Math.min(3.65, Math.max(0, video.duration - 0.05));

          targetTimeRef.current = Math.max(
            0,
            Math.min(maxDuration, progress * maxDuration)
          );
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
    };
  }, [attemptSeek, primeMobileVideo]);

  // ─── Derived Layer Opacities ─────────────────────────────────────
  const landingOpacity = Math.max(0, 1 - scrollProgress * 12);
  const scrollVideoOpacity = Math.min(1, scrollProgress * 14);

  // Gate Solar Flash Light curve (fires as the gate opens from Image 1 to Image 2)
  const flashStart = isMobile ? 0.46 : 0.70;
  const flashPeak = isMobile ? 0.58 : 0.78;
  const flashEnd = isMobile ? 0.70 : 0.88;

  let flashOpacity = 0;
  if (scrollProgress >= flashStart && scrollProgress <= flashEnd) {
    if (scrollProgress < flashPeak) {
      // Exponential flare build-up as gates open
      const t = (scrollProgress - flashStart) / (flashPeak - flashStart);
      flashOpacity = t * t;
    } else {
      // Smooth Hermite decay into the open citadel
      const t = (scrollProgress - flashPeak) / (flashEnd - flashPeak);
      flashOpacity = Math.max(0, 1 - t * t * (3 - 2 * t));
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[260vh] sm:min-h-[320vh] md:min-h-[420vh] bg-black -mt-16"
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

        {/* Layer 3.5: Celestial Social Constellation Hologram on the Rock (Desktop Only) */}
        {!isMobile && <SocialConstellation scrollProgress={scrollProgress} />}

        {/* Layer 3.8: Cinematic Solar Gate Flash & Anamorphic Flare (When gate opens from Image 1 to Image 2) */}
        {flashOpacity > 0.001 && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-75"
            style={{
              opacity: flashOpacity,
              zIndex: 14,
              mixBlendMode: "screen",
            }}
          >
            {/* 1. Full-screen warm solar atmospheric flash */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255, 240, 200, 0.95) 0%, rgba(255, 185, 75, 0.75) 30%, rgba(215, 115, 25, 0.35) 60%, transparent 100%)",
              }}
            />

            {/* 2. Intense center portal light bloom */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[65vh] max-w-[950px] rounded-full blur-[35px]"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 225, 140, 0.9) 35%, rgba(245, 150, 45, 0.45) 70%, transparent 100%)",
              }}
            />

            {/* 3. Cinematic anamorphic horizontal lens flare streak */}
            <div
              className="absolute top-1/2 left-0 w-full h-[6px] -translate-y-1/2 blur-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 195, 90, 0.3) 15%, rgba(255, 245, 220, 0.95) 50%, rgba(255, 195, 90, 0.3) 85%, transparent 100%)",
                boxShadow:
                  "0 0 25px 8px rgba(255, 200, 90, 0.8), 0 0 60px 20px rgba(230, 130, 30, 0.4)",
              }}
            />

            {/* 4. Secondary vertical light shaft piercing through the portal */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] sm:w-[280px] h-full blur-[22px] opacity-80"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 245, 210, 0.65) 0%, rgba(255, 190, 75, 0.4) 50%, transparent 100%)",
              }}
            />
          </div>
        )}

        {/* Layer 4: Paul Atreides 3D Model (Materializes as the gate opens into the Citadel) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
          <Paul3D scrollProgress={scrollProgress} />
        </div>
      </div>
    </div>
  );
}

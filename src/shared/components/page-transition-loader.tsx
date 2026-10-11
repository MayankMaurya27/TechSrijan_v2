"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import cloudinaryLoader from "@/shared/utils/cloudinary-loader";

// Critical assets mapped per route for guaranteed pre-caching during the transition window
const ROUTE_ASSETS_MAP: Record<string, string[]> = {
  "/": [
    "/hero-logo-arrakis-day.webp",
    "/hero-logo-geass-moon.webp",
    "/hero-logo-krelln-night.webp",
    "/images/citadel-frame.webp",
    "/club-logos/techrijan-logo.png",
    "/club-logos/reso-logo.png",
    "/club-logos/ieee-logo.png",
    "/club-logos/robotics-logo.png",
    "/club-logos/sae-logo-white.png",
  ],
  "/events": [
    "/events-hero-poster.webp",
    "/events-mid-poster.webp",
    "/events-arena-poster.webp",
    "/images/events/tsc-vail.jpg",
    "/images/events/tsc-science.jpg",
    "/images/events/tsc-informals.jpg",
    "/images/events/tsc-mrandmrs.jpg",
    "/images/events/reso-mantrastra.jpg",
    "/images/events/ieee-codezilla.jpg",
    "/images/events/ieee-incognito.jpg",
    "/images/events/ieee-robosoccer.jpg",
    "/images/events/rc-robowar.jpg",
    "/images/events/rc-laser-strike.jpg",
    "/images/events/sae-bridgekriti.jpg",
    "/images/events/sae-cadathon.jpg",
  ],
  "/sponsors": [
    "/images/sponsors/spons_land.webp",
    "/images/sponsors/spons_robot.webp",
    "/images/sponsors/spons_robot_arrakis.webp",
    "/images/sponsors/spons_robot_krelln.webp",
    "/images/sponsors/3-sigil.webp",
    "/images/sponsors/3-sigil_arrakis.webp",
    "/images/sponsors/3-sigil_krelln.webp",
    "/images/sponsors/cp-1.webp",
    "/images/sponsors/cp-2.webp",
    "/images/sponsors/cp-4.webp",
    "/images/sponsors/cp-5.webp",
    "/images/sponsors/cp-6.webp",
  ],
  "/about": [
    "/images/about/about-bg.webp",
    "/images/about/ajeet_kumar_clean.png",
    "/images/about/alok_shukla_clean.png",
    "/images/about/anil_pal_clean.png",
    "/images/about/pallav_gupta_clean.png",
    "/images/about/patron_anupama_clean.png",
    "/images/about/rajan_mishra_tight.png",
  ],
  "/accommodation": [
    "/images/accommodation-city-bg.webp",
    "/images/lelouch-character.webp",
    "/images/lelouch-tactical-left.webp",
    "/images/lelouch-tactical-right.webp",
  ],
  "/guests": [
    "/images/guests/guests-bg.webp",
    "/images/guests/guest-bg-hc-verma.webp",
    "/images/guests/guest-bg-kiran-bedi.webp",
  ],
  "/ambassador": [
    "/images/ambassador-character-arrakis.webp",
    "/images/ambassador-character-geass.webp",
    "/images/ambassador-character-krelln.webp",
    "/images/ambassador-desert-bg.webp",
    "/images/ambassador-moon.webp",
  ],
  "/profile": [
    "/images/profile/profileland.webp",
    "/images/profile/eye_asset.webp",
  ],
  "/contact": [
    "/images/citadel-frame.webp",
    "/images/contact/contact-bg-citadel.webp",
    "/images/contact/contact-bg-worm.webp",
  ],
  "/signin": [
    "/images/auth/onboarding_bg.webp",
    "/images/auth/robosign_flipped.webp",
    "/images/auth/eye_asset.webp",
  ],
  "/signup": [
    "/images/auth/onboarding_bg.webp",
    "/images/auth/robosign_flipped.webp",
    "/images/auth/eye_asset.webp",
  ],
};

const ROUTE_SECTOR_NAMES: Record<string, string> = {
  "/": "NEXUS // MAIN GATEWAY",
  "/events": "ARENA // COMPETITIONS & CONCLAVE",
  "/about": "CHRONICLE // LEGACY & PATRONS",
  "/sponsors": "PATRONS // CORPORATE ALLIANCES",
  "/accommodation": "CITADEL // GUEST RESIDENCE",
  "/guests": "APEX // DISTINGUISHED DIGNITARIES",
  "/ambassador": "CADRE // CAMPUS AMBASSADOR",
  "/profile": "IDENTITY // CITIZEN DOSSIER",
  "/developers": "ARCHITECTS // TECHNICAL COUNCIL",
  "/contact": "TRANSMISSION // DISPATCH & SUPPORT",
  "/signin": "AUTHENTICATION // CITIZEN LOGIN",
  "/signup": "REGISTRATION // NEW RECRUIT",
};

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [targetSector, setTargetSector] = useState("SYNCHRONIZING SECTOR...");
  const currentPathRef = useRef(pathname);
  const transitionStartRef = useRef<number>(0);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inFlightPromiseRef = useRef<Promise<void> | null>(null);

  // Preloads high-res assets into browser memory and returns a Promise that settles only when loaded
  const preloadRouteAssets = useCallback((targetRoute: string): Promise<void> => {
    const matchedRoute = Object.keys(ROUTE_ASSETS_MAP).find(
      (route) => route === targetRoute || (route !== "/" && targetRoute.startsWith(route))
    );
    const assets = matchedRoute ? ROUTE_ASSETS_MAP[matchedRoute] : [];
    if (assets.length === 0) return Promise.resolve();

    const promises = assets.map((assetPath) => {
      return new Promise<void>((resolve) => {
        let settled = false;
        const settle = () => {
          if (!settled) {
            settled = true;
            resolve();
          }
        };

        try {
          const cdnUrl = cloudinaryLoader({ src: assetPath, width: 1200, quality: 85 });
          const img = new Image();
          img.onload = settle;
          img.onerror = settle;
          img.src = cdnUrl;

          // If image is already in browser cache
          if (img.complete) {
            settle();
          }
        } catch {
          const img = new Image();
          img.onload = settle;
          img.onerror = settle;
          img.src = assetPath;
          if (img.complete) {
            settle();
          }
        }
      });
    });

    return Promise.all(promises).then(() => {});
  }, []);

  const finishTransition = useCallback(() => {
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    setIsFadingOut(true);
    document.body.style.overflow = "";

    setTimeout(() => {
      setIsActive(false);
      setIsFadingOut(false);
      inFlightPromiseRef.current = null;
    }, 320);
  }, []);

  const startTransition = useCallback(
    (targetHref: string) => {
      // Don't trigger if initial boot preloader hasn't finished yet
      if (typeof window !== "undefined" && !sessionStorage.getItem("techsrijan_site_booted")) {
        return;
      }

      const cleanPath = targetHref.split("?")[0].split("#")[0];
      if (cleanPath === currentPathRef.current && isActive) return;

      const matchedSectorKey = Object.keys(ROUTE_SECTOR_NAMES).find(
        (route) => route === cleanPath || (route !== "/" && cleanPath.startsWith(route))
      );
      setTargetSector(matchedSectorKey ? ROUTE_SECTOR_NAMES[matchedSectorKey] : "SYNCHRONIZING SECTOR...");

      // Start pre-caching target route's high-res media immediately and store promise
      inFlightPromiseRef.current = preloadRouteAssets(cleanPath);

      transitionStartRef.current = Date.now();
      setIsActive(true);
      setIsFadingOut(false);
      document.body.style.overflow = "hidden";

      // Safety timeout: never trap user beyond 3500ms even on degraded 2G connections
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        finishTransition();
      }, 3500);
    },
    [isActive, preloadRouteAssets, finishTransition]
  );

  // 1. Intercept internal link clicks across the entire app
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      const cleanPath = href.split("?")[0].split("#")[0];
      if (cleanPath && cleanPath !== currentPathRef.current) {
        startTransition(cleanPath);
      }
    };

    const handlePopState = () => {
      const currentUrlPath = window.location.pathname;
      if (currentUrlPath !== currentPathRef.current) {
        startTransition(currentUrlPath);
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [startTransition]);

  // 2. Respond to pathname change completion AND wait for assets to actually finish loading
  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname;

      if (!isActive) {
        if (typeof window !== "undefined" && sessionStorage.getItem("techsrijan_site_booted")) {
          startTransition(pathname);
        }
      }

      // Wait for destination page assets to finish loading before dissolving
      const assetsPromise = inFlightPromiseRef.current || preloadRouteAssets(pathname);

      assetsPromise.finally(() => {
        const elapsed = Date.now() - transitionStartRef.current;
        // Minimum visual display duration (650ms) to ensure smooth, non-jarring rhythm
        const minDuration = 650;
        const remaining = Math.max(0, minDuration - elapsed);

        const timer = setTimeout(() => {
          finishTransition();
        }, remaining);

        return () => clearTimeout(timer);
      });
    }
  }, [pathname, isActive, preloadRouteAssets, startTransition, finishTransition]);

  if (!isActive) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-[#000000] select-none transition-opacity duration-300 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Subtle radial ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Center Eclipse Container */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Soft atmospheric backlight halo */}
        <div className="absolute w-44 h-44 rounded-full bg-white/[0.05] blur-2xl pointer-events-none animate-pulse" />

        {/* Ethereal Dual Crescent Portal (Matching Image 2) */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <svg
            viewBox="-60 -60 120 120"
            className="w-full h-full animate-[spin_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            fill="#ffffff"
            style={{
              filter:
                "drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 22px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 42px rgba(255, 255, 255, 0.25))",
            }}
          >
            {/* Top-Right Glowing Crescent Blade */}
            <path d="M 26.79 -34.91 A 44 44 0 0 1 26.79 34.91 A 62.25 62.25 0 0 0 26.79 -34.91 Z" />

            {/* Bottom-Left Symmetrical Crescent Blade (180deg Orbit) */}
            <path
              d="M 26.79 -34.91 A 44 44 0 0 1 26.79 34.91 A 62.25 62.25 0 0 0 26.79 -34.91 Z"
              transform="rotate(180)"
            />
          </svg>
        </div>

        {/* Minimalist Sci-Fi Telemetry */}
        <div className="mt-8 flex flex-col items-center space-y-1.5 pointer-events-none">
          <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] text-white/50 uppercase">
            {targetSector}
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

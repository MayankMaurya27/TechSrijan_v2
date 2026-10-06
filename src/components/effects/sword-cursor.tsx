"use client";

import { useEffect, useRef, useState } from "react";

export function SwordCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setIsEnabled(true);
    document.body.classList.add("has-sword-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number | null = null;

    const updatePosition = () => {
      if (cursorRef.current) {
        // Offset so the sword blade tip at (2, 2) aligns exactly with (mouseX, mouseY)
        cursorRef.current.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      updatePosition();

      // Check if hovering clickable/interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            'a, button, [role="button"], input, select, textarea, label, .cursor-pointer, [tabindex="0"]'
          )
        );
        setIsPointer(interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("has-sword-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] transition-opacity duration-100 ease-out will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {isPointer ? (
        // Hovering interactive elements: Glowing energized sword pointer
        <div className="relative filter drop-shadow-[0_0_8px_rgba(255,30,39,0.7)] transition-transform duration-100 scale-105">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ACTIVE VIBRO-FREQUENCY BURST AURA */}
            <circle cx="17.5" cy="17.5" r="9" fill="#FF1E27" fillOpacity="0.25" />
            <path d="M2 2 L23 15 L15 23 Z" fill="#FF1E27" fillOpacity="0.4" />
            <path d="M2 2 L22.5 15.5 L15.5 22.5 Z" stroke="#FF1E27" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
            <path d="M2 2 L21 16 L16 21 Z" stroke="#FF5E68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

            {/* BLADE BLACK SILHOUETTE OUTLINE */}
            <path d="M2 2 L20 16.2 L18.5 18.5 L16.2 20 Z" fill="#050203" stroke="#050203" strokeWidth="1.6" strokeLinejoin="round" />

            {/* BLADE RED VIBRO-FACETS (OVERLOADED ENERGY) */}
            <path d="M2.4 2.4 L19.4 16.4 L18.2 18.2 Z" fill="#FF2632" />
            <path d="M2.4 2.4 L19.4 16.4" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M2.4 2.4 L18.2 18.2 L16.4 19.4 Z" fill="#D40010" />

            {/* WHITE LASER ENERGY CORE */}
            <path d="M2.4 2.4 L17.5 17.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

            {/* HILT / GRIP */}
            <path d="M18.5 18.5 L26 26" stroke="#0D0B08" strokeWidth="3.2" strokeLinecap="square" />
            <path d="M19.5 19.5 L25.5 25.5" stroke="#42372A" strokeWidth="2.2" strokeLinecap="square" />
            <path d="M20.5 21.5 L21.5 20.5" stroke="#FFE58F" strokeWidth="1.4" />
            <path d="M22.5 23.5 L23.5 22.5" stroke="#FFE58F" strokeWidth="1.4" />
            <path d="M24.5 25.5 L25.5 24.5" stroke="#FFE58F" strokeWidth="1.4" />

            {/* GOLD POMMEL */}
            <path d="M25 27 L27 25 L31 29 L29 31 Z" fill="#050203" />
            <path d="M25.5 26.5 L26.5 25.5 L30 29 L29 30 Z" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="0.6" />

            {/* GOLD CROSSGUARD (FORWARD-SWEEPING WINGS WITH RADIANT GLOW) */}
            <path d="M17.5 15.5 L24 10 L22.5 7.5 L18.5 13.5 L13.5 18.5 L7.5 22.5 L10 24 L15.5 17.5 Z" fill="#050203" stroke="#050203" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M18 15.5 L23.5 10.5 L22.2 8.5 L19 13.8 Z" fill="#F59E0B" />
            <path d="M18 15.5 L23.2 10.8" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M15.5 18 L10.5 23.5 L8.5 22.2 L13.8 19 Z" fill="#D97706" />
            <path d="M15.5 18 L10.8 23.2" stroke="#FFFFFF" strokeWidth="1" />

            {/* Center Crest */}
            <circle cx="17.5" cy="17.5" r="3.4" fill="#F59E0B" stroke="#050203" strokeWidth="0.8" />

            {/* RADIANT SAKURADITE GEM FLASH */}
            <circle cx="17.5" cy="17.5" r="4.5" fill="#00E676" fillOpacity="0.4" />
            <polygon points="17.5,14.8 20.2,17.5 17.5,20.2 14.8,17.5" fill="#00E676" stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="17.5,15.8 19.2,17.5 17.5,19.2 15.8,17.5" fill="#E8FFF3" />
            <circle cx="17.5" cy="17.5" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>
      ) : (
        // Resting state: The EXACT authentic Vibro-blade sword cursor matching Image
        <div className="relative filter drop-shadow-[0_0_5px_rgba(255,30,39,0.45)]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* MVS VIBRATION GLOW AURA (HIGH FREQUENCY OSCILLATION) */}
            <path d="M2 2 L20.5 16.5 L16.5 20.5 Z" fill="#FF1E27" fillOpacity="0.25" />
            <path d="M2 2 L21 16 L16 21 Z" stroke="#FF1E27" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
            <path d="M2 2 L20 16.2 L16.2 20 Z" stroke="#FF404A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />

            {/* BLADE BLACK SILHOUETTE OUTLINE FOR MAXIMUM CONTRAST */}
            <path d="M2 2 L20 16.2 L18.5 18.5 L16.2 20 Z" fill="#050203" stroke="#050203" strokeWidth="1.5" strokeLinejoin="round" />

            {/* BLADE RED VIBRO-FACETS (UPPER LIT / LOWER SHADOW) */}
            <path d="M2.4 2.4 L19.4 16.4 L18.2 18.2 Z" fill="#FF2632" />
            <path d="M2.4 2.4 L19.4 16.4" stroke="#FFA6AC" strokeWidth="0.75" strokeLinecap="round" />
            <path d="M2.4 2.4 L18.2 18.2 L16.4 19.4 Z" fill="#B8000C" />

            {/* WHITE-HOT HIGH FREQUENCY BLADE CORE */}
            <path d="M2.4 2.4 L17.5 17.5" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />

            {/* HILT / GRIP */}
            <path d="M18.5 18.5 L26 26" stroke="#0D0B08" strokeWidth="3.2" strokeLinecap="square" />
            <path d="M19.5 19.5 L25.5 25.5" stroke="#42372A" strokeWidth="2.2" strokeLinecap="square" />
            {/* Grip gold bands */}
            <path d="M20.5 21.5 L21.5 20.5" stroke="#D4A843" strokeWidth="1.2" />
            <path d="M22.5 23.5 L23.5 22.5" stroke="#D4A843" strokeWidth="1.2" />
            <path d="M24.5 25.5 L25.5 24.5" stroke="#D4A843" strokeWidth="1.2" />

            {/* GOLD POMMEL */}
            <path d="M25 27 L27 25 L31 29 L29 31 Z" fill="#050203" />
            <path d="M25.5 26.5 L26.5 25.5 L30 29 L29 30 Z" fill="#D4A843" stroke="#FFE58F" strokeWidth="0.5" />

            {/* GOLD CROSSGUARD (FORWARD-SWEEPING WINGS) */}
            <path d="M17.5 15.5 L23.5 10.5 L22 8 L18.5 13.5 L13.5 18.5 L8 22 L10.5 23.5 L15.5 17.5 Z" fill="#050203" stroke="#050203" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M18 15.5 L23 11 L21.8 9 L19 13.8 Z" fill="#D4A843" />
            <path d="M18 15.5 L22.8 11.2" stroke="#FFF1BA" strokeWidth="0.8" />
            <path d="M15.5 18 L11 23 L9 21.8 L13.8 19 Z" fill="#B88A27" />
            <path d="M15.5 18 L11.2 22.8" stroke="#FFF1BA" strokeWidth="0.8" />

            {/* Guard Center Crest */}
            <circle cx="17.5" cy="17.5" r="3.2" fill="#D4A843" stroke="#050203" strokeWidth="0.8" />

            {/* EMERALD SAKURADITE CORE GEM */}
            <polygon points="17.5,15.2 19.8,17.5 17.5,19.8 15.2,17.5" fill="#00E676" stroke="#050203" strokeWidth="0.6" />
            <polygon points="17.5,16 19,17.5 17.5,19 16,17.5" fill="#B9F6CA" />
            <circle cx="17.5" cy="17.5" r="0.6" fill="#FFFFFF" />
          </svg>
        </div>
      )}
    </div>
  );
}

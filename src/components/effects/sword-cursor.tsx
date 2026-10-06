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
        // Offset so the sword blade tip at (3, 3) aligns exactly with (mouseX, mouseY)
        cursorRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
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
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] transition-opacity duration-150 ease-out will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {isPointer ? (
        // Hovering interactive elements: Glowing energized sword pointer
        <div className="relative filter drop-shadow-[0_0_10px_rgba(240,201,108,0.95)]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-100 ease-out scale-110"
          >
            {/* Outer golden energy aura */}
            <path
              d="M3 3L10.5 19.5L13.5 13.5L19.5 10.5L3 3Z"
              fill="#F0C96C"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Extended energized laser hilt trail */}
            <path
              d="M13.5 13.5L21 21"
              stroke="#F0C96C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Radiant core gem */}
            <circle cx="13.5" cy="13.5" r="2" fill="#FFFFFF" />
          </svg>
        </div>
      ) : (
        // Default resting state: Sharp golden blade sword pointer
        <div className="relative filter drop-shadow-[0_0_6px_rgba(212,168,67,0.65)]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* High-contrast black outline & golden blade facets */}
            <path
              d="M3 3L10.5 19.5L13.5 13.5L19.5 10.5L3 3Z"
              fill="#D4A843"
              stroke="#0D0904"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Center crystalline gem */}
            <circle cx="13.5" cy="13.5" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      )}
    </div>
  );
}

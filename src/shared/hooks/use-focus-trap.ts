"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  /** Whether the modal is actively visible / open */
  isOpen: boolean;
  /** Callback invoked when the user presses Escape */
  onClose?: () => void;
  /** Optional container ref if the caller already created one */
  containerRef?: RefObject<T | null>;
  /** Optional element ref to receive focus when opened (defaults to first focusable element) */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Optional element ref to receive focus when closed (defaults to the element that was focused before opening) */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Whether to prevent locking document.body scroll (default: false) */
  disableScrollLock?: boolean;
  /** Whether to disable the Escape key dismissal (default: false) */
  disableEscape?: boolean;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([aria-hidden="true"]), ' +
  '[href]:not([aria-hidden="true"]), ' +
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"]), ' +
  'select:not([disabled]):not([aria-hidden="true"]), ' +
  'textarea:not([disabled]):not([aria-hidden="true"]), ' +
  '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])';

/**
 * Enterprise-grade Focus Trapping & Modal Accessibility Hook
 * Enforces WAI-ARIA 1.2 modal dialog requirements:
 * 1. Traps Tab and Shift+Tab inside the modal boundary (wrapping last->first and first->last)
 * 2. Sets initial focus to initialFocusRef or the first interactive element
 * 3. Restores focus to the triggering element upon close
 * 4. Listens for the Escape key to close the modal
 * 5. Locks body scroll while the modal is open
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  containerRef: externalContainerRef,
  initialFocusRef,
  returnFocusRef,
  disableScrollLock = false,
  disableEscape = false,
}: UseFocusTrapOptions<T>): RefObject<T | null> {
  const internalContainerRef = useRef<T | null>(null);
  const containerRef = externalContainerRef || internalContainerRef;
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Snapshot the previously focused element to restore focus on dismiss
    if (typeof document !== "undefined") {
      previousActiveElement.current = (returnFocusRef?.current ||
        document.activeElement) as HTMLElement | null;
    }

    // 2. Lock body scroll
    let originalOverflow = "";
    if (!disableScrollLock && typeof document !== "undefined") {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    // 3. Set Initial Focus (next tick to accommodate Framer Motion / animation entry)
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      if (containerRef.current) {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          // If no focusable elements inside, ensure container itself has focus
          if (!containerRef.current.hasAttribute("tabIndex")) {
            containerRef.current.setAttribute("tabIndex", "-1");
          }
          containerRef.current.focus();
        }
      }
    }, 32);

    // 4. Keyboard Listener: Escape & Tab Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape Dismissal
      if (!disableEscape && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
        return;
      }

      // Tab Trapping
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;

        // Shift + Tab: wrapping from first to last
        if (e.shiftKey) {
          if (activeEl === firstElement || activeEl === containerRef.current || !containerRef.current.contains(activeEl)) {
            e.preventDefault();
            lastElement.focus();
          }
        }
        // Tab: wrapping from last to first
        else {
          if (activeEl === lastElement || !containerRef.current.contains(activeEl)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 5. Cleanup: Restore body scroll, remove listener, and restore focus
    return () => {
      clearTimeout(focusTimer);
      if (!disableScrollLock && typeof document !== "undefined") {
        document.body.style.overflow = originalOverflow;
      }
      window.removeEventListener("keydown", handleKeyDown);

      // Return focus to the initiating element
      const targetElement = returnFocusRef?.current || previousActiveElement.current;
      if (targetElement && typeof targetElement.focus === "function") {
        // Small delay to allow unmount animation to complete
        setTimeout(() => {
          try {
            targetElement.focus();
          } catch {
            // Ignore focus failures if element was removed from DOM
          }
        }, 16);
      }
    };
  }, [
    isOpen,
    onClose,
    disableScrollLock,
    disableEscape,
    initialFocusRef,
    returnFocusRef,
    containerRef,
  ]);

  return containerRef;
}

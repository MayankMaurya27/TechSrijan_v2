"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuthModal } from "../context/auth-modal-context";

const loadModal = () => import("./sign-in-route-modal").then((m) => m.SignInRouteModal);
const SignInRouteModal = dynamic(loadModal, { ssr: false });

/**
 * Global sign-in modal, kept out of every page's initial bundle (it pulls in framer-motion).
 * The chunk is prefetched on the user's first pointer/key press (just ahead of the click that
 * opens it), and the modal stays mounted after its first open so its exit animation still plays.
 */
export function LazySignInRouteModal() {
  const { isAuthModalOpen } = useAuthModal();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const prefetch = () => void loadModal();
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", prefetch, opts);
    window.addEventListener("keydown", prefetch, opts);
    return () => {
      window.removeEventListener("pointerdown", prefetch);
      window.removeEventListener("keydown", prefetch);
    };
  }, []);
  useEffect(() => {
    if (isAuthModalOpen) setHasOpened(true);
  }, [isAuthModalOpen]);

  return hasOpened ? <SignInRouteModal /> : null;
}

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const toggleAuthModal = useCallback(() => {
    setIsAuthModalOpen((prev) => !prev);
  }, []);

  // Listen to custom window events or ESC if needed
  useEffect(() => {
    const handleOpenEvent = () => setIsAuthModalOpen(true);
    const handleCloseEvent = () => setIsAuthModalOpen(false);

    window.addEventListener("techsrijan:open-auth-modal", handleOpenEvent);
    window.addEventListener("techsrijan:close-auth-modal", handleCloseEvent);

    return () => {
      window.removeEventListener("techsrijan:open-auth-modal", handleOpenEvent);
      window.removeEventListener("techsrijan:close-auth-modal", handleCloseEvent);
    };
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        toggleAuthModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

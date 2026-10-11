"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MonochromeTransitionOverlayProps {
  isActive: boolean;
}

export function MonochromeTransitionOverlay({ isActive }: MonochromeTransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-black select-none"
        >
          {/* Stark high-contrast scanlines & noise */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,#fff_2px,#fff_3px)] mix-blend-overlay pointer-events-none" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_90%)]" />

          {/* Anamorphic white laser beam expanding horizontally */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.8, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_30px_#ffffff,0_0_60px_rgba(255,255,255,0.8)]"
          />

          {/* Central Stark Monochrome Flash Graphic */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, letterSpacing: "0.1em" }}
            animate={{ scale: 1, opacity: 1, letterSpacing: "0.35em" }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-white/30 bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/90">
                TRANSITIONING TO ARENA
              </span>
            </div>

            <h2 className="font-montserrat font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-widest text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.7)] leading-none">
              OUR EVENTS
            </h2>

            <p className="mt-3 font-mono text-[10px] sm:text-xs text-neutral-400 tracking-[0.4em] uppercase">
              // TECHSRIJAN XXVII · IMPERIUM DOSSIER
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

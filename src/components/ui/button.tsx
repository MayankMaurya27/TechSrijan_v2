"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * Sand Animation Texture Overlay
 * Activates on hover, displaying streaming Arrakis spice sand grains,
 * a sweeping sunlight dune wave, and an animated sediment baseline.
 * ONLY active in Arrakis (Amber) view, completely disabled in Giedi Prime (Red / Dark) view.
 */
export function ButtonSandEffect({ className }: { className?: string }) {
  const { theme } = useTheme();

  if (theme !== "arrakis") {
    return null;
  }

  return (
    <span
      data-sand-effect="true"
      className={cn(
        "sand-only-effect button-sand-effect pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className
      )}
      aria-hidden="true"
    >
      {/* Streaming Granular Desert Sand Grains */}
      <span className="absolute inset-0 sand-grain-texture opacity-75 mix-blend-screen" />

      {/* Sweeping Sunlight Dune Shimmer Wave */}
      <span className="absolute inset-0 sand-shimmer-wave" />

      {/* Crystalline Micro-Particles */}
      <span
        className="absolute rounded-full w-1 h-1 bg-[var(--accent-secondary)]"
        style={{
          left: "22%",
          top: "35%",
          boxShadow: "0 0 4px var(--accent-secondary)",
          animation: "sand-particle-flutter 2.2s ease-in-out infinite",
        }}
      />
      <span
        className="absolute rounded-full w-1.5 h-1.5 bg-[var(--accent-primary)]"
        style={{
          left: "58%",
          top: "55%",
          boxShadow: "0 0 5px var(--accent-primary)",
          animation: "sand-particle-flutter 2.7s ease-in-out infinite 0.6s",
        }}
      />
      <span
        className="absolute rounded-full w-1 h-1 bg-[#ffffff]"
        style={{
          left: "82%",
          top: "28%",
          boxShadow: "0 0 4px #ffffff",
          animation: "sand-particle-flutter 1.9s ease-in-out infinite 1.1s",
        }}
      />

      {/* Dune Sediment Hairline at the Bottom */}
      <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-90" />
    </span>
  );
}


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, onClick, ...props }, ref) => {
    const baseStyles = "mecha-bracket group relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-accent)] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

    const variants = {
      default: "border border-[var(--accent-primary)] bg-[var(--surface)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] shadow-[var(--glow)]",
      outline: "border border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]",
      ghost: "hover:bg-[var(--surface-hover)] text-[var(--text-primary)]",
      danger: "border border-[var(--geass-crimson)] bg-[var(--surface)] text-[var(--geass-crimson)] hover:bg-[var(--geass-crimson)] hover:text-white shadow-[0_0_20px_rgba(230,25,36,0.3)]",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-[10px]",
      lg: "h-13 px-8 text-sm tracking-[0.25em]",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        onClick={onClick}
        {...props}
      >
        {/* Sand / Ember Texture on Hover */}
        <ButtonSandEffect />

        {isLoading ? (
          <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, onClick, ...props }, ref) => {
    const [flashActive, setFlashActive] = React.useState(false);
    const [clickCoords, setClickCoords] = React.useState({ x: 0, y: 0 });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setClickCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 450);

      if (onClick) onClick(e);
    };

    const baseStyles = "mecha-bracket relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-accent)] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

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
        onClick={handleClick}
        {...props}
      >
        {/* Code Geass Eye-Sigil Optic Flare upon Click */}
        {flashActive && (
          <span
            className="pointer-events-none absolute z-20 geass-flash-active"
            style={{
              left: clickCoords.x - 20,
              top: clickCoords.y - 20,
              width: 40,
              height: 40,
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
              {/* Geass Winged Bird Sigil */}
              <path
                d="M50 20 C35 38 10 44 5 48 C18 52 38 48 50 68 C62 48 82 52 95 48 C90 44 65 38 50 20 Z"
                fill="var(--geass-crimson)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle cx="50" cy="46" r="6" fill="#FFFFFF" />
            </svg>
          </span>
        )}

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

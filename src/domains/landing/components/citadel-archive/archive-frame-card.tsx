import React from "react";
import { CITADEL_FRAME, type CitadelThemeConfig } from "./types";

interface ArchiveFrameCardProps {
  theme: CitadelThemeConfig;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  contentTranslateZ?: number;
  paddingClassName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}

export function ArchiveFrameCard({
  theme,
  className = "",
  style,
  children,
  contentTranslateZ = 18,
  paddingClassName = "pt-[18%] pb-[17%] px-[13%]",
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}: ArchiveFrameCardProps) {
  return (
    <div
      className={`archive-card pointer-events-auto transition-transform duration-300 relative ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Themed backing */}
      <div
        className={`absolute inset-[8%] ${theme.cardBacking} ${theme.cardInnerBorder} backdrop-blur-[3px] rounded-2xl pointer-events-none z-0 transition-all duration-500`}
      />

      {/* Citadel Frame Asset */}
      <img
        src={CITADEL_FRAME}
        alt=""
        className="archive-frame pointer-events-none absolute inset-0 w-full h-full object-fill z-20 select-none transition-[filter] duration-500"
        style={{ filter: theme.frameFilter }}
        loading="eager"
      />

      {/* Content Safely Padded Inside Frame */}
      <div
        className={`archive-content relative z-10 w-full h-full flex flex-col justify-between ${paddingClassName} pointer-events-auto text-[#F0EAE1]`}
        style={contentTranslateZ ? { transform: `translateZ(${contentTranslateZ}px)` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CitadelThemeConfig, DirectiveItem } from "./types";

interface CardEventsProps {
  theme: CitadelThemeConfig;
  events: DirectiveItem[];
  isMobile?: boolean;
  hoveredEvent?: string | null;
  onHoverEvent?: (id: string | null) => void;
}

export function CardEvents({
  theme,
  events,
  isMobile = false,
  hoveredEvent,
  onHoverEvent,
}: CardEventsProps) {
  return (
    <>
      {/* Header Info */}
      <div className="flex-shrink-0">
        <h3
          className={`font-montserrat font-black tracking-[0.15em] uppercase text-[#F0EAE1] leading-tight transition-all duration-300 ${
            isMobile ? "text-[13px] sm:text-[14px]" : "text-base sm:text-lg lg:text-xl"
          }`}
          style={{ textShadow: theme.headingShadow }}
        >
          FEATURED EVENTS
        </h3>
        <p
          className={`font-mono mt-0.5 leading-tight truncate transition-colors duration-300 ${
            isMobile ? "text-[7.5px] sm:text-[8px]" : "text-[10px] sm:text-[11px] tracking-wide"
          }`}
          style={{ color: theme.subtext }}
        >
          Choose your route into Techsrijan’27.
        </p>
      </div>

      {/* 4 Categorized Event Rows */}
      <div
        className={`flex-1 flex flex-col justify-evenly min-h-0 ${
          isMobile ? "py-1 gap-0.5 sm:gap-1" : "py-2 gap-1.5 sm:gap-2"
        }`}
      >
        {events.map((ev) => {
          const isHover = hoveredEvent === ev.id;
          return (
            <Link
              key={ev.id}
              href={ev.link}
              onMouseEnter={() => onHoverEvent?.(ev.id)}
              onMouseLeave={() => onHoverEvent?.(null)}
              className={`group relative flex items-center justify-between rounded border transition-all duration-200 ${
                isMobile ? "py-1 px-2" : "py-2 px-2.5"
              } ${theme.eventItemBorder} ${theme.eventItemBg} ${theme.eventItemHoverBg} ${theme.eventItemHoverBorder}`}
              style={{
                transform: !isMobile && isHover ? "translateZ(8px) scale(1.01)" : "translateZ(0)",
                boxShadow: !isMobile && isHover ? theme.rowHoverShadow : "none",
              }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <span
                  className={`font-mono font-bold transition-colors duration-300 ${
                    isMobile ? "text-[9px]" : "text-[10px] sm:text-[11px]"
                  }`}
                  style={{ color: theme.eventNumber }}
                >
                  {ev.id}
                </span>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-montserrat font-semibold tracking-wider text-[#F0EAE1] truncate transition-colors ${
                      isMobile ? "text-[9.5px]" : "text-[11px] sm:text-xs"
                    }`}
                    style={{ color: isHover ? theme.accentBright : undefined }}
                  >
                    {ev.title}
                  </span>
                  <span
                    className={`font-mono text-[#a89b88] tracking-wider truncate ${
                      isMobile ? "text-[6.5px] sm:text-[7px]" : "text-[8px] sm:text-[9px]"
                    }`}
                  >
                    {ev.meta}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                {!isMobile && (
                  <span
                    className={`hidden xs:inline-block text-[7px] sm:text-[8px] font-mono tracking-widest px-1 py-0.5 rounded border uppercase transition-colors duration-300 ${theme.eventCategoryBorder} ${theme.eventCategoryBg}`}
                    style={{ color: theme.eventCategoryText }}
                  >
                    {ev.category}
                  </span>
                )}
                <ArrowRight
                  className={`opacity-60 flex-shrink-0 transition-all ${
                    isMobile
                      ? "h-2.5 w-2.5 ml-1"
                      : "h-3 w-3 group-hover:opacity-100 group-hover:translate-x-1"
                  }`}
                  style={{ color: theme.accent }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Action Button */}
      <div className={`flex-shrink-0 ${isMobile ? "pt-0.5" : "pt-1"}`}>
        <Link
          href="/events"
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 w-full rounded border font-mono uppercase transition-all duration-300 ${
            isMobile
              ? "py-1 px-2.5 text-[8px] tracking-[0.2em]"
              : "py-1.5 px-3 text-[9px] sm:text-[10px] tracking-[0.22em]"
          } ${theme.btnBorder} ${theme.btnBg} ${theme.btnHoverBg} ${theme.btnHoverBorder} ${theme.btnText} ${theme.btnShadow}`}
        >
          <span>EXPLORE ALL EVENTS</span>
          <ArrowRight
            className={`transition-transform group-hover:translate-x-1 ${
              isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
            }`}
            style={{ color: theme.accent }}
          />
        </Link>
      </div>
    </>
  );
}

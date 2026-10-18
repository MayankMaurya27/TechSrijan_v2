import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CitadelThemeConfig, TransmissionItem } from "./types";

interface CardTestimonialsProps {
  theme: CitadelThemeConfig;
  transmissions: TransmissionItem[];
  activeQuoteIndex: number;
  onSelectQuote: (index: number) => void;
  onPrevQuote: () => void;
  onNextQuote: () => void;
  isMobile?: boolean;
}

export function CardTestimonials({
  theme,
  transmissions,
  activeQuoteIndex,
  onSelectQuote,
  onPrevQuote,
  onNextQuote,
  isMobile = false,
}: CardTestimonialsProps) {
  const activeQuote = transmissions[activeQuoteIndex] || transmissions[0];

  return (
    <>
      {/* Header Info - "TESTIMONIALS" overline removed per user request */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3
            className={`font-montserrat font-bold tracking-[0.14em] uppercase text-[#F0EAE1] leading-none transition-all duration-300 ${
              isMobile ? "text-[13px] sm:text-sm" : "text-sm sm:text-base"
            }`}
            style={{ textShadow: theme.headingShadow }}
          >
            VOICES FROM WITHIN
          </h3>
          <span
            className="text-[7.5px] sm:text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded border transition-colors duration-300"
            style={{
              color: theme.accent,
              borderColor: `${theme.accent}40`,
              backgroundColor: `${theme.accent}12`,
            }}
          >
            {activeQuote.id} / 05
          </span>
        </div>
        <p
          className={`font-mono mt-0.5 leading-tight truncate transition-colors duration-300 ${
            isMobile ? "text-[7px] sm:text-[7.5px]" : "text-[8px] sm:text-[8.5px] tracking-wide"
          }`}
          style={{ color: theme.subtext }}
        >
          Echoes from the citadel pilgrims.
        </p>
      </div>

      {/* Quote Body */}
      <div className="my-auto py-1 flex flex-col justify-center min-h-[46px]">
        <p
          className={`font-geist tracking-normal text-[#FAF6EE] leading-relaxed italic pl-2.5 line-clamp-3 transition-colors duration-300 ${
            theme.quoteBorder
          } ${isMobile ? "text-[11px] sm:text-[12px]" : "text-[12.5px] sm:text-[13.5px]"}`}
        >
          “{activeQuote.quote}”
        </p>
        <div className="mt-1.5 pl-2.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`font-bebas font-normal tracking-wider uppercase transition-colors duration-300 ${
              isMobile ? "text-[8.5px] sm:text-[9px]" : "text-[10px] sm:text-[11px]"
            }`}
            style={{ color: theme.accent }}
          >
            — {activeQuote.author}
          </span>
          <span
            className={`font-geist text-[#a89b88] tracking-wider uppercase truncate ${
              isMobile ? "text-[7px] sm:text-[7.5px]" : "text-[8px] sm:text-[9px]"
            }`}
          >
            · {activeQuote.dept}
          </span>
        </div>
      </div>

      {/* Carousel Navigation Footer */}
      <div className="flex-shrink-0 pt-0.5 flex items-center justify-between border-t border-white/10">
        <button
          type="button"
          onClick={onPrevQuote}
          className="p-1 rounded opacity-75 hover:opacity-100 transition-opacity"
          style={{ color: theme.accent }}
          aria-label="Previous transmission"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {transmissions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectQuote(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeQuoteIndex ? `w-3.5 ${theme.dotActive}` : `w-1 ${theme.dotInactive}`
              }`}
              aria-label={`Go to transmission ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNextQuote}
          className="p-1 rounded opacity-75 hover:opacity-100 transition-opacity"
          style={{ color: theme.accent }}
          aria-label="Next transmission"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </>
  );
}

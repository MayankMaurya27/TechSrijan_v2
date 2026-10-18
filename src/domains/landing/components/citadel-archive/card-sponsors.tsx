import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CitadelThemeConfig, SponsorItem } from "./types";

interface CardSponsorsProps {
  theme: CitadelThemeConfig;
  sponsors: SponsorItem[];
  activeSponsorIndex: number;
  onSelectSponsor: (index: number) => void;
  isMobile?: boolean;
}

export function CardSponsors({
  theme,
  sponsors,
  activeSponsorIndex,
  onSelectSponsor,
  isMobile = false,
}: CardSponsorsProps) {
  const activeSponsor = sponsors[activeSponsorIndex] || sponsors[0];

  return (
    <>
      {/* Header Info - "OFFICIAL PATRONS" overline removed per user request */}
      <div className="flex-shrink-0 text-center">
        <h3
          className={`font-montserrat font-bold tracking-[0.15em] uppercase text-[#F0EAE1] leading-tight transition-all duration-300 ${
            isMobile ? "text-[13px] sm:text-[14px]" : "text-sm sm:text-base"
          }`}
          style={{ textShadow: theme.headingShadow }}
        >
          OUR SPONSORS
        </h3>
        <p
          className={`font-mono mt-0.5 leading-tight truncate transition-colors duration-300 ${
            isMobile ? "text-[7.5px] sm:text-[8px]" : "text-[8px] sm:text-[9px] tracking-wide"
          }`}
          style={{ color: theme.subtext }}
        >
          Powering the awakening.
        </p>
      </div>

      {/* Center Sponsor Showcase with Keyframe Animation */}
      <div className="relative my-auto w-full flex-1 flex flex-col items-center justify-center py-1 overflow-hidden">
        {activeSponsor && (
          <div
            key={activeSponsor.id}
            className="flex flex-col items-center text-center animate-sponsor-fade transition-all duration-500 w-full"
          >
            {/* Sponsor Tier Badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-bold uppercase mb-1 shadow-sm ${
                isMobile
                  ? "px-2 py-0.5 text-[7.5px] tracking-[0.15em]"
                  : "px-2.5 py-0.5 text-[8px] tracking-[0.18em]"
              }`}
              style={{
                borderColor: `${activeSponsor.accent}80`,
                backgroundColor: `${activeSponsor.accent}15`,
                color: activeSponsor.accent,
                boxShadow: `0 0 10px ${activeSponsor.accent}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: activeSponsor.accent }}
              />
              <span>{activeSponsor.tier}</span>
            </div>

            {/* Sponsor Circle */}
            <div className="relative group cursor-pointer my-1">
              <div
                className="absolute -inset-2 rounded-full blur-md opacity-60 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, ${activeSponsor.glow} 0%, transparent 70%)`,
                }}
              />
              <div
                className={`relative rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105 ${
                  isMobile
                    ? "w-14 h-14 sm:w-16 sm:h-16"
                    : "w-16 h-16 sm:w-[72px] sm:h-[72px]"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${activeSponsor.accent}, ${theme.sponsorRingSecondary}, ${activeSponsor.accent}40)`,
                  boxShadow: `0 0 16px ${activeSponsor.glow}`,
                }}
              >
                <div
                  className={`w-full h-full rounded-full ${theme.sponsorInnerBg} flex items-center justify-center overflow-hidden p-2.5 border border-black/80 transition-colors duration-500`}
                >
                  <img
                    src={activeSponsor.image}
                    alt={activeSponsor.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            {/* Sponsor Name & Tagline */}
            <h4
              className={`font-montserrat font-extrabold tracking-[0.14em] text-[#F0EAE1] mt-1 leading-none ${
                isMobile ? "text-[11.5px] sm:text-[12px]" : "text-[12px] sm:text-[13px]"
              }`}
            >
              {activeSponsor.name}
            </h4>
            <p
              className={`font-mono text-[#a89b88] tracking-wider mt-0.5 truncate ${
                isMobile
                  ? "text-[7px] sm:text-[7.5px] max-w-[180px]"
                  : "text-[7.5px] sm:text-[8px] max-w-[200px]"
              }`}
            >
              {activeSponsor.tagline}
            </p>
          </div>
        )}

        {/* Carousel Dots Indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          {sponsors.map((sp, idx) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => onSelectSponsor(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeSponsorIndex
                  ? `w-4 h-1 ${theme.dotActive}`
                  : `w-1.5 h-1 ${theme.dotInactive}`
              }`}
              aria-label={`Show ${sp.name}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className={`flex-shrink-0 ${isMobile ? "pt-0.5" : "pt-1"}`}>
        <Link
          href="/sponsors"
          className={`group flex items-center justify-center gap-1.5 w-full rounded border font-mono uppercase transition-all duration-200 ${
            isMobile
              ? "py-1 px-2 text-[7.5px] sm:text-[8px] tracking-[0.2em]"
              : "py-1 px-2 text-[8px] sm:text-[9px] tracking-[0.2em]"
          } ${theme.btnBorder} ${theme.btnBg} ${theme.btnHoverBg} ${theme.btnHoverBorder} ${theme.btnText}`}
        >
          <span>VIEW ALL SPONSORS</span>
          <ArrowRight
            className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform"
            style={{ color: theme.accent }}
          />
        </Link>
      </div>
    </>
  );
}

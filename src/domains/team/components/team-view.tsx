"use client";

import { useState, useMemo } from "react";
import { Volume2, Play, LayoutGrid, List, RotateCcw } from "lucide-react";
import {
  OPERATIVES_ROSTER,
  CATEGORIES_LIST,
  type Operative,
  type Department,
} from "../data/team-roster";
import { OperativeCard } from "./operative-card";
import { OperativeDossierModal } from "./operative-dossier-modal";
import { SocietyPillars } from "./society-pillars";
import { TacticalTableView } from "./tactical-table-view";
import { Team3DBackground } from "./team-3d-background";
import { FestFooter } from "@/shared";

interface TeamViewProps {
  titleWord?: string;
  subtitle?: string;
}

export function TeamView({
  titleWord = "Team",
  subtitle = "The student conveners, guild leads, society pillars, and faculty commanders forging the directives of TechSrijan '27.",
}: TeamViewProps = {}) {
  const [selectedOperative, setSelectedOperative] = useState<Operative | null>(null);
  const [activeHouse, setActiveHouse] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Department>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [audioActive, setAudioActive] = useState(false);

  const filteredOperatives = useMemo(() => {
    return OPERATIVES_ROSTER.filter((op) => {
      if (activeHouse && op.house !== activeHouse) return false;
      if (activeCategory !== "ALL" && op.category !== activeCategory) return false;
      return true;
    });
  }, [activeHouse, activeCategory]);

  const hasActiveFilters = activeHouse !== null || activeCategory !== "ALL";

  const handleResetFilters = () => {
    setActiveHouse(null);
    setActiveCategory("ALL");
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary,#090705)] text-[var(--text-primary,#F4ECE1)] selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
      <Team3DBackground />

      {/* Atmospheric Subtle Ambient Scrims */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[10%] h-[450px] w-[450px] rounded-full bg-[var(--accent-primary)]/[0.04] blur-[100px]" />
        <div className="absolute top-[35%] right-[5%] h-[500px] w-[500px] rounded-full bg-[var(--accent-primary)]/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="pt-6 sm:pt-10 mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-[var(--text-primary)]">
            <span className="font-chancery italic text-3xl sm:text-5xl lg:text-6xl text-[var(--text-secondary)] mr-2 sm:mr-3.5">
              Meet
            </span>
            <span className="font-montserrat font-light tracking-tight text-[var(--text-primary)] mr-2 sm:mr-3.5">
              Our
            </span>
            <span className="font-montserrat font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5E6] via-[#E8CF9A] to-[#C49B4D] drop-shadow-[0_0_30px_rgba(212,168,67,0.35)]">
              {titleWord}
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] font-geist max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Section 01: Society Pillars */}
        <SocietyPillars
          activeHouse={activeHouse}
          onSelectHouse={setActiveHouse}
        />

        {/* Section 02: Council & Operatives Roster */}
        <section className="mt-20 pt-8 border-t border-[var(--border)]">
          {/* Controls Bar: Category Tabs & View Switcher */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            {/* Department Categories */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES_LIST.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    type="button"
                    className={`rounded-lg px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                      isActive
                        ? "bg-[var(--accent-primary)] text-black font-bold shadow-md"
                        : "bg-[var(--surface,#18120c)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover,#241b12)] border border-[var(--border)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle & Reset Filter */}
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  type="button"
                  className="flex items-center gap-1.5 rounded border border-[var(--border-accent)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-mono tracking-wider text-[var(--accent-primary)] hover:bg-[var(--surface-hover)] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Filters</span>
                </button>
              )}

              <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  type="button"
                  aria-label="Grid view"
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)] ${
                    viewMode === "grid"
                      ? "bg-[var(--accent-primary)] text-black"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)] ${
                    viewMode === "table"
                      ? "bg-[var(--accent-primary)] text-black"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Roster Counter */}
          <div className="mb-6 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>
              DISPLAYING {filteredOperatives.length} OF {OPERATIVES_ROSTER.length} OPERATIVES
              {activeHouse && ` · FILTERED BY ${activeHouse}`}
            </span>
          </div>

          {/* View Body */}
          {filteredOperatives.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
              <p className="text-sm font-geist text-[var(--text-secondary)]">
                No operatives match the selected house and department criteria.
              </p>
              <button
                onClick={handleResetFilters}
                type="button"
                className="mt-4 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-mono font-bold uppercase text-black hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 sm:gap-x-12 sm:gap-y-20 justify-items-center">
              {filteredOperatives.map((op) => (
                <OperativeCard
                  key={op.id}
                  operative={op}
                  onOpenDossier={setSelectedOperative}
                />
              ))}
            </div>
          ) : (
            <TacticalTableView
              operatives={filteredOperatives}
              onOpenDossier={setSelectedOperative}
            />
          )}
        </section>
      </div>

      {/* Floating Ambient / Audio Toggle Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setAudioActive(!audioActive)}
          type="button"
          aria-label={audioActive ? "Mute ambient audio" : "Play ambient audio"}
          title={audioActive ? "Ambient Sound Active" : "Play Ambient Audio"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.15] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          {audioActive ? (
            <Volume2 className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white/90 fill-white/80 ml-0.5" />
          )}
        </button>
      </div>

      {/* Operative Modal Dialog */}
      <OperativeDossierModal
        operative={selectedOperative}
        onClose={() => setSelectedOperative(null)}
      />

      {/* Site Footer */}
      <FestFooter />
    </div>
  );
}

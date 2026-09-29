import { SpatialEventsGrid } from "@/components/events/spatial-events-grid";

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header Banner */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-12 text-center md:text-left border-b border-[var(--border)] pb-8">
        <span className="font-mono text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase">
          // IMPERIUM ARCHIVES // CLASSIFIED DIRECTIVES
        </span>
        <h1 className="mt-3 font-mono text-4xl sm:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight">
          EVENTS DIRECTORY
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-xs sm:text-sm text-[var(--text-secondary)]">
          SELECT A MISSION DOSSIER TO ENGAGE OPERATIONAL PARAMETERS, SQUAD PROTOCOLS, AND CASH BOUNTIES.
        </p>
      </div>

      {/* Interactive Spatial Grid with FLIP Morphing */}
      <SpatialEventsGrid />
    </div>
  );
}

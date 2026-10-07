"use client";

import { Activity, Radio, Terminal, Send, ChevronRight } from "lucide-react";
import type { Operative } from "../data/team-roster";

interface TacticalTableViewProps {
  operatives: Operative[];
  onOpenDossier: (op: Operative) => void;
}

export function TacticalTableView({ operatives, onOpenDossier }: TacticalTableViewProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[#120D08]/90">
      <table className="w-full text-left font-sans text-xs">
        <thead className="border-b border-[var(--border)] bg-[#18110A] font-mono text-[9px] tracking-[0.25em] text-[var(--text-muted)] uppercase">
          <tr>
            <th className="px-5 py-4">ID</th>
            <th className="px-5 py-4">OPERATIVE</th>
            <th className="px-5 py-4">ROLE & WING</th>
            <th className="px-5 py-4">HOUSE</th>
            <th className="px-5 py-4">CALLSIGN / CLEARANCE</th>
            <th className="px-5 py-4">STATUS</th>
            <th className="px-5 py-4 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {operatives.map((op) => {
            return (
              <tr
                key={op.id}
                onClick={() => onOpenDossier(op)}
                className="group cursor-pointer transition-colors hover:bg-[var(--surface-hover)]"
              >
                {/* ID */}
                <td className="whitespace-nowrap px-5 py-4 font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                  {op.id}
                </td>

                {/* Operative Name & Branch */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold"
                      style={{
                        background: op.colorTheme.chipBg,
                        color: op.colorTheme.accent,
                        border: `1px solid ${op.colorTheme.chipBorder}`,
                      }}
                    >
                      {op.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] group-hover:text-white">
                        {op.name}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {op.yearOrDesignation} {op.branch ? `· ${op.branch}` : ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role & Category */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className="inline-block rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: op.colorTheme.chipBg,
                      color: op.colorTheme.accent,
                      border: `1px solid ${op.colorTheme.chipBorder}`,
                    }}
                  >
                    {op.role}
                  </span>
                  <div className="mt-0.5 font-mono text-[9px] text-[var(--text-muted)] uppercase">
                    {op.category}
                  </div>
                </td>

                {/* House */}
                <td className="whitespace-nowrap px-5 py-4 font-mono text-[10px] text-[var(--text-secondary)]">
                  {op.house}
                </td>

                {/* Callsign & Clearance */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: op.colorTheme.accent }}>
                    <Radio className="h-3 w-3" />
                    <span>{op.callsign}</span>
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-muted)]">
                    {op.clearance}
                  </div>
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                    <Activity className="h-2.5 w-2.5 animate-pulse" />
                    {op.status}
                  </span>
                </td>

                {/* Action button */}
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDossier(op);
                    }}
                    type="button"
                    className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[#171009] px-2.5 py-1 font-mono text-[9px] font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-white"
                  >
                    <Terminal className="h-3 w-3 text-[var(--accent-primary)]" />
                    DOSSIER
                    <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

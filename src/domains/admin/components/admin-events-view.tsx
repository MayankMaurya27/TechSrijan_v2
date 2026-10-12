"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Search,
  CheckCircle,
  Calendar,
  MapPin,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Award,
} from "lucide-react";
import { api, BackendEvent } from "@/lib/api";
import { Button } from "@/shared";

export function AdminEventsView() {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [podiumModalOpen, setPodiumModalOpen] = useState(false);
  const [podiumPositions, setPodiumPositions] = useState<{ [pos: number]: string }>({});
  const [submittingPodium, setSubmittingPodium] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.events.list();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load events:", err);
      setError(err?.message || "Failed to load events from High Command registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = async (event: BackendEvent) => {
    setSelectedEvent(event);
    setLoadingParticipants(true);
    try {
      const data = await api.admin.events.getParticipants(event.id);
      setParticipants(Array.isArray(data?.registrations) ? data.registrations : Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch participants:", err);
      alert(`Could not fetch roster: ${err?.message || "Unknown error"}`);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleMarkAttendance = async (registrationId: string, currentStatus: boolean) => {
    if (!selectedEvent) return;
    try {
      await api.admin.events.markAttendance(selectedEvent.id, [
        { registrationId, attended: !currentStatus },
      ]);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === registrationId || p.registrationId === registrationId
            ? { ...p, attended: !currentStatus }
            : p
        )
      );
    } catch (err: any) {
      alert(`Attendance update failed: ${err?.message}`);
    }
  };

  const handleDeclarePodium = async () => {
    if (!selectedEvent) return;
    const podiumPayload: Array<{ position: 1 | 2 | 3; registrationId: string }> = [];
    if (podiumPositions[1]) podiumPayload.push({ position: 1, registrationId: podiumPositions[1] });
    if (podiumPositions[2]) podiumPayload.push({ position: 2, registrationId: podiumPositions[2] });
    if (podiumPositions[3]) podiumPayload.push({ position: 3, registrationId: podiumPositions[3] });

    if (podiumPayload.length === 0) {
      alert("Please select at least 1 podium winner.");
      return;
    }

    setSubmittingPodium(true);
    try {
      await api.admin.events.declarePodium(selectedEvent.id, podiumPayload);
      alert("🏆 Podium successfully declared and points allocated to winners!");
      setPodiumModalOpen(false);
      setPodiumPositions({});
    } catch (err: any) {
      alert(`Podium declaration failed: ${err?.message}`);
    } finally {
      setSubmittingPodium(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      ev.title?.toLowerCase().includes(q) ||
      ev.category?.toLowerCase().includes(q) ||
      ev.organizingClub?.toLowerCase().includes(q) ||
      ev.venue?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 font-mono">
      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
            COMPETITION DIRECTIVE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            EVENTS & PODIUM RECONCILIATION
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading} className="text-xs">
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>SYNC EVENTS</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* SEARCH INPUT */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Filter by title, category, club, or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full pl-10 pr-4 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
        />
      </div>

      {/* EVENTS GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[var(--accent-primary)] animate-spin mb-3" />
          <span className="text-xs text-[var(--text-muted)] tracking-widest uppercase">
            LOADING EVENTS REGISTRY...
          </span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-10 rounded border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)]">
          NO MATCHING COMPETITIVE EVENTS FOUND.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            return (
              <div
                key={ev.id}
                className={`mecha-bracket rounded border p-5 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[var(--accent-primary)] bg-[var(--surface-hover)] shadow-[0_0_20px_rgba(212,168,67,0.2)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent-primary)]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                      {ev.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border border-white/10 text-white/70">
                      {ev.organizingClub}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)] mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                      <span>{ev.venue || "Campus Arena"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span>Prize Pool: ₹{Number(ev.prizePool).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-blue-400" />
                      <span>
                        Registrations: {ev.currentRegistrations || 0}
                        {ev.maxCapacity ? ` / ${ev.maxCapacity}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectEvent(ev)}
                    className="text-[10px] w-full"
                  >
                    <span>{isSelected ? "VIEWING ROSTER" : "SELECT ROSTER"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED EVENT PARTICIPANTS ROSTER */}
      {selectedEvent && (
        <div className="mt-12 rounded border border-[var(--accent-primary)]/50 bg-[var(--surface)] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-[10px] text-[var(--accent-primary)] tracking-widest uppercase">
                ACTIVE ROSTER VIEW
              </span>
              <h3 className="text-lg font-black text-[var(--text-primary)] uppercase">
                {selectedEvent.title} — PARTICIPANTS ({participants.length})
              </h3>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setPodiumModalOpen(true)}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              <Award className="mr-1.5 h-4 w-4" />
              <span>DECLARE PODIUM</span>
            </Button>
          </div>

          {loadingParticipants ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-6 w-6 text-[var(--accent-primary)] animate-spin" />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              NO CONFIRMED PARTICIPANTS YET FOR THIS EVENT.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
                    <th className="py-3 px-3">Participant / Leader</th>
                    <th className="py-3 px-3">Institution</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Team / Code</th>
                    <th className="py-3 px-3 text-center">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40">
                  {participants.map((p: any) => {
                    const regId = p.id || p.registrationId;
                    const name = p.userName || p.user?.name || p.name || "N/A";
                    const email = p.userEmail || p.user?.email || p.email || "";
                    const college = p.collegeName || p.user?.collegeName || "N/A";
                    const mobile = p.userMobile || p.user?.mobile || p.mobile || "N/A";
                    const teamName = p.teamName || p.team?.teamName || "Solo";
                    const attended = Boolean(p.attended);

                    return (
                      <tr key={regId} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[var(--text-primary)]">{name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{email}</div>
                        </td>
                        <td className="py-3 px-3 text-[var(--text-secondary)]">{college}</td>
                        <td className="py-3 px-3 text-[var(--text-secondary)]">{mobile}</td>
                        <td className="py-3 px-3 font-mono text-[var(--accent-primary)]">{teamName}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleMarkAttendance(regId, attended)}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                              attended
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                            }`}
                          >
                            {attended ? "ATTENDED ✓" : "MARK PRESENT"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PODIUM DECLARATION MODAL */}
      {podiumModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-amber-500/60 rounded-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 border-b border-[var(--border)] pb-3">
              <Trophy className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                DECLARE OFFICIAL PODIUM: {selectedEvent.title}
              </h3>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Allocates official championship merit points to winners and notifies team accounts. Select registrations below:
            </p>

            <div className="space-y-4">
              {[1, 2, 3].map((pos) => (
                <div key={pos} className="flex items-center gap-3">
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      pos === 1
                        ? "bg-amber-400 text-black"
                        : pos === 2
                        ? "bg-slate-300 text-black"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    #{pos}
                  </span>
                  <select
                    value={podiumPositions[pos] || ""}
                    onChange={(e) =>
                      setPodiumPositions((prev) => ({ ...prev, [pos]: e.target.value }))
                    }
                    className="flex-1 h-9 rounded bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs text-[var(--text-primary)] focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Select Winner / Team --</option>
                    {participants.map((p: any) => {
                      const regId = p.id || p.registrationId;
                      const name = p.userName || p.user?.name || p.name;
                      const team = p.teamName || p.team?.teamName || "Solo";
                      return (
                        <option key={regId} value={regId}>
                          {name} ({team})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPodiumModalOpen(false)}
                disabled={submittingPodium}
              >
                <span>CANCEL</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDeclarePodium}
                disabled={submittingPodium}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                <span>{submittingPodium ? "ALLOCATING..." : "CONFIRM PODIUM"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Search,
  Plus,
  RefreshCw,
  Loader2,
  Trash2,
  Edit,
  Award,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  MapPin,
  Calendar,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { api, BackendEvent } from "@/lib/api";
import { Button } from "@/shared";
import { useAuth } from "@/core/providers/auth-provider";

const CLUBS = ["TSC", "RC", "IEEE", "SAE", "RESO"] as const;
const CATEGORIES = ["TECHNICAL", "GAMING", "MANAGEMENT", "WORKSHOP", "ROBOTICS"] as const;

export function AdminEventsView() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "BOSS";
  const userClub = user?.club || "TSC";

  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState<string>(isSuperAdmin ? "ALL" : userClub);

  // Selected event & roster
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [attendanceUpdatingId, setAttendanceUpdatingId] = useState<string | null>(null);

  // Podium Modal
  const [podiumModalOpen, setPodiumModalOpen] = useState(false);
  const [podiumPositions, setPodiumPositions] = useState<{ [pos: number]: string }>({});
  const [submittingPodium, setSubmittingPodium] = useState(false);

  // Create / Edit Modal
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    slug: "",
    category: "TECHNICAL" as (typeof CATEGORIES)[number],
    organizingClub: userClub as (typeof CLUBS)[number],
    venue: "",
    prizePool: 0,
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationFee: 0,
    maxCapacity: "",
    isOpen: true,
    attendanceOpen: false,
    winnersOpen: false,
    rulesText: "",
  });
  const [savingEvent, setSavingEvent] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsData = await api.admin.events.list();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err: any) {
      console.error("Failed to load events:", err);
      setError(err?.message || "Failed to load events list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on role and selection
  const filteredEvents = events.filter((ev) => {
    // If club admin, only show own club
    if (!isSuperAdmin && ev.organizingClub !== userClub) {
      return false;
    }
    // If super admin filtered by club
    if (isSuperAdmin && clubFilter !== "ALL" && ev.organizingClub !== clubFilter) {
      return false;
    }
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      ev.title?.toLowerCase().includes(q) ||
      ev.category?.toLowerCase().includes(q) ||
      ev.organizingClub?.toLowerCase().includes(q) ||
      ev.venue?.toLowerCase().includes(q)
    );
  });

  const handleSelectEvent = async (event: BackendEvent) => {
    setSelectedEvent(event);
    setLoadingParticipants(true);
    try {
      const data = await api.admin.events.getParticipants(event.id);
      setParticipants(Array.isArray(data?.participants) ? data.participants : Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(`Could not fetch roster: ${err?.message || "Unknown error"}`);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingEventId(null);
    setEventForm({
      title: "",
      slug: "",
      category: "TECHNICAL",
      organizingClub: isSuperAdmin ? "TSC" : (userClub as any),
      venue: "",
      prizePool: 0,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationFee: 0,
      maxCapacity: "",
      isOpen: true,
      attendanceOpen: false,
      winnersOpen: false,
      rulesText: "",
    });
  };

  const handleOpenEdit = (ev: BackendEvent) => {
    setModalMode("edit");
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title || "",
      slug: ev.slug || "",
      category: (ev.category as any) || "TECHNICAL",
      organizingClub: (ev.organizingClub as any) || userClub,
      venue: ev.venue || "",
      prizePool: Number(ev.prizePool) || 0,
      minTeamSize: ev.minTeamSize || 1,
      maxTeamSize: ev.maxTeamSize || 1,
      registrationFee: ev.registrationFee || 0,
      maxCapacity: ev.maxCapacity ? String(ev.maxCapacity) : "",
      isOpen: ev.isOpen !== false,
      attendanceOpen: Boolean(ev.attendanceOpen),
      winnersOpen: Boolean(ev.winnersOpen),
      rulesText: ev.rulesText || "",
    });
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      alert("Event title is required.");
      return;
    }

    const slug =
      eventForm.slug.trim() ||
      eventForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    setSavingEvent(true);
    try {
      const payload: any = {
        title: eventForm.title.trim(),
        slug,
        category: eventForm.category,
        organizingClub: isSuperAdmin ? eventForm.organizingClub : userClub,
        venue: eventForm.venue.trim() || undefined,
        prizePool: Number(eventForm.prizePool) || 0,
        minTeamSize: Number(eventForm.minTeamSize) || 1,
        maxTeamSize: Number(eventForm.maxTeamSize) || 1,
        registrationFee: Number(eventForm.registrationFee) || 0,
        maxCapacity: eventForm.maxCapacity ? Number(eventForm.maxCapacity) : null,
        isOpen: Boolean(eventForm.isOpen),
        rulesText: eventForm.rulesText.trim() || undefined,
      };

      if (isSuperAdmin) {
        payload.attendanceOpen = Boolean(eventForm.attendanceOpen);
        payload.winnersOpen = Boolean(eventForm.winnersOpen);
      }

      if (modalMode === "create") {
        await api.admin.events.create(payload);
        alert("Event created successfully.");
      } else if (modalMode === "edit" && editingEventId) {
        await api.admin.events.update(editingEventId, payload);
        alert("Event updated successfully.");
      }

      setModalMode(null);
      fetchEvents();
    } catch (err: any) {
      alert(`Operation failed: ${err?.message || "Unknown error"}`);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (ev: BackendEvent) => {
    if (!confirm(`Are you sure you want to permanently delete '${ev.title}'?`)) {
      return;
    }
    try {
      await api.admin.events.delete(ev.id);
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
      if (selectedEvent?.id === ev.id) {
        setSelectedEvent(null);
        setParticipants([]);
      }
      alert("Event deleted successfully.");
    } catch (err: any) {
      alert(`Delete failed: ${err?.message || "Unknown error"}`);
    }
  };

  const handleToggleAttendance = async (event: BackendEvent) => {
    if (!isSuperAdmin) return;
    const nextVal = !Boolean(event.attendanceOpen);
    try {
      await api.admin.events.update(event.id, { attendanceOpen: nextVal });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, attendanceOpen: nextVal } : e))
      );
      if (selectedEvent?.id === event.id) {
        setSelectedEvent((prev) => (prev ? { ...prev, attendanceOpen: nextVal } : prev));
      }
    } catch (err: any) {
      alert(`Failed to update attendance toggle: ${err?.message || "Unknown error"}`);
    }
  };

  const handleToggleWinners = async (event: BackendEvent) => {
    if (!isSuperAdmin) return;
    const nextVal = !Boolean(event.winnersOpen);
    try {
      await api.admin.events.update(event.id, { winnersOpen: nextVal });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, winnersOpen: nextVal } : e))
      );
      if (selectedEvent?.id === event.id) {
        setSelectedEvent((prev) => (prev ? { ...prev, winnersOpen: nextVal } : prev));
      }
    } catch (err: any) {
      alert(`Failed to update winner declaration toggle: ${err?.message || "Unknown error"}`);
    }
  };

  // Attendance check per event
  const canMarkAttendance = isSuperAdmin || Boolean(selectedEvent?.attendanceOpen);
  const canDeclareWinners = isSuperAdmin || Boolean(selectedEvent?.winnersOpen);

  const handleMarkAttendance = async (registrationId: string, currentStatus: boolean) => {
    if (!selectedEvent) return;
    if (!canMarkAttendance) {
      alert("Attendance marking is locked for this event.");
      return;
    }

    setAttendanceUpdatingId(registrationId);
    try {
      await api.admin.events.markAttendance(selectedEvent.id, [
        { registrationId, attended: !currentStatus },
      ]);
      setParticipants((prev) =>
        prev.map((p) =>
          (p.registrationId === registrationId || p.id === registrationId)
            ? { ...p, attended: !currentStatus }
            : p
        )
      );
    } catch (err: any) {
      alert(`Attendance update failed: ${err?.message || "Unknown error"}`);
    } finally {
      setAttendanceUpdatingId(null);
    }
  };

  const handleDeclarePodium = async () => {
    if (!selectedEvent) return;
    if (!canDeclareWinners) {
      alert("Winner declaration is locked for this event.");
      return;
    }

    const podiumPayload: Array<{ position: 1 | 2 | 3; registrationId: string }> = [];
    if (podiumPositions[1]) podiumPayload.push({ position: 1, registrationId: podiumPositions[1] });
    if (podiumPositions[2]) podiumPayload.push({ position: 2, registrationId: podiumPositions[2] });
    if (podiumPositions[3]) podiumPayload.push({ position: 3, registrationId: podiumPositions[3] });

    if (podiumPayload.length === 0) {
      alert("Please select at least 1 winner position.");
      return;
    }

    setSubmittingPodium(true);
    try {
      await api.admin.events.declarePodium(selectedEvent.id, podiumPayload);
      alert("Podium winners declared successfully!");
      setPodiumModalOpen(false);
      setPodiumPositions({});
    } catch (err: any) {
      alert(`Winner declaration failed: ${err?.message || "Unknown error"}`);
    } finally {
      setSubmittingPodium(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
            {isSuperAdmin ? "Events Management" : `Events Management · ${userClub}`}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isSuperAdmin
              ? "Manage festival events, participant rosters, attendance, and winners."
              : `Create and edit events for ${userClub}, monitor registered participants, and record attendance.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEvents}
            disabled={loading}
            className="text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* FILTER & SEARCH STRIP */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by event title, category, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {isSuperAdmin && (
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Organizing Clubs</option>
            {CLUBS.map((c) => (
              <option key={c} value={c}>
                Club: {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* EVENTS GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          No events found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            return (
              <div
                key={ev.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-amber-500/80 bg-zinc-900/90 shadow-md ring-1 ring-amber-500/50"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {ev.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Club: {ev.organizingClub}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 mb-2">{ev.title}</h3>

                  <div className="space-y-1.5 text-xs text-zinc-400 mb-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{ev.venue || "Campus Venue TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Prize Pool: ₹{Number(ev.prizePool).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>
                        Registrations: {ev.currentRegistrations || 0}
                        {ev.maxCapacity ? ` / ${ev.maxCapacity}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* PER-EVENT CONTROLS */}
                  {isSuperAdmin ? (
                    <div className="flex items-center gap-2 mb-4 pt-2.5 border-t border-zinc-800/60">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAttendance(ev);
                        }}
                        className={`flex-1 py-1 px-2 rounded border flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px] font-semibold ${
                          ev.attendanceOpen
                            ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/50"
                            : "bg-zinc-950/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title="Click to toggle attendance marking for this event"
                      >
                        {ev.attendanceOpen ? (
                          <Unlock className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-zinc-500" />
                        )}
                        <span>Attendance: {ev.attendanceOpen ? "Open" : "Locked"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWinners(ev);
                        }}
                        className={`flex-1 py-1 px-2 rounded border flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px] font-semibold ${
                          ev.winnersOpen
                            ? "bg-amber-950/40 border-amber-700/50 text-amber-400 hover:bg-amber-900/50"
                            : "bg-zinc-950/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title="Click to toggle winner declaration for this event"
                      >
                        {ev.winnersOpen ? (
                          <Unlock className="h-3 w-3 text-amber-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-zinc-500" />
                        )}
                        <span>Winners: {ev.winnersOpen ? "Open" : "Locked"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-4 pt-2.5 border-t border-zinc-800/60 text-[10px] font-semibold">
                      <span
                        className={`flex-1 py-1 px-2 rounded border flex items-center justify-center gap-1.5 ${
                          ev.attendanceOpen
                            ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        {ev.attendanceOpen ? (
                          <Unlock className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-zinc-500" />
                        )}
                        <span>Attendance: {ev.attendanceOpen ? "Open" : "Locked"}</span>
                      </span>

                      <span
                        className={`flex-1 py-1 px-2 rounded border flex items-center justify-center gap-1.5 ${
                          ev.winnersOpen
                            ? "bg-amber-950/30 border-amber-800/40 text-amber-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        {ev.winnersOpen ? (
                          <Unlock className="h-3 w-3 text-amber-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-zinc-500" />
                        )}
                        <span>Winners: {ev.winnersOpen ? "Open" : "Locked"}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectEvent(ev)}
                    className={`h-8 px-3 text-xs flex-1 ${
                      isSelected
                        ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                        : "border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    <span>{isSelected ? "Viewing Roster" : "View Participants"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(ev)}
                    className="h-8 px-2.5 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                    title="Edit Event"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEvent(ev)}
                    className="h-8 px-2.5 text-xs border-red-900/50 hover:bg-red-900/30 text-red-400"
                    title="Delete Event"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED EVENT PARTICIPANTS ROSTER */}
      {selectedEvent && (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Event Roster
                </span>
                <span className="text-zinc-600">·</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    selectedEvent.attendanceOpen
                      ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                >
                  Attendance: {selectedEvent.attendanceOpen ? "Open" : "Locked"}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    selectedEvent.winnersOpen
                      ? "bg-amber-950/40 border-amber-700/50 text-amber-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                >
                  Winners: {selectedEvent.winnersOpen ? "Open" : "Locked"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mt-0.5">
                {selectedEvent.title} — {participants.length} Participant
                {participants.length === 1 ? "" : "s"}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isSuperAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAttendance(selectedEvent)}
                    className="text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                  >
                    {selectedEvent.attendanceOpen ? (
                      <Unlock className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                    )}
                    Attendance: {selectedEvent.attendanceOpen ? "Open" : "Locked"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleWinners(selectedEvent)}
                    className="text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                  >
                    {selectedEvent.winnersOpen ? (
                      <Unlock className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <Lock className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                    )}
                    Winners: {selectedEvent.winnersOpen ? "Open" : "Locked"}
                  </Button>
                </>
              )}
              <Button
                size="sm"
                onClick={() => setPodiumModalOpen(true)}
                disabled={!canDeclareWinners}
                className={`text-xs font-semibold ${
                  canDeclareWinners
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                }`}
                title={
                  !canDeclareWinners
                    ? "Winner declaration is locked for this event"
                    : "Declare winners"
                }
              >
                <Award className="mr-1.5 h-4 w-4" />
                {canDeclareWinners ? "Declare Winners" : "Winner Declaration Locked"}
              </Button>
            </div>
          </div>

          {loadingParticipants ? (
            <div className="py-12 flex justify-center text-zinc-400">
              <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">
              No confirmed participants have registered for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-3">Participant</th>
                    <th className="py-3 px-3">College</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Team</th>
                    <th className="py-3 px-3 text-center">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {participants.map((p: any) => {
                    const regId = p.registrationId || p.id;
                    const name = p.name || p.userName || p.user?.name || "Participant";
                    const email = p.email || p.userEmail || p.user?.email || "";
                    const college = p.collegeName || p.user?.collegeName || "N/A";
                    const mobile = p.mobile || p.userMobile || p.user?.mobile || "N/A";
                    const teamName = p.teamName || p.team?.teamName || "Solo";
                    const attended = Boolean(p.attended);
                    const isUpdating = attendanceUpdatingId === regId;

                    return (
                      <tr key={regId} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-zinc-100">{name}</div>
                          <div className="text-[11px] text-zinc-400">{email}</div>
                        </td>
                        <td className="py-3 px-3 text-zinc-300">{college}</td>
                        <td className="py-3 px-3 text-zinc-300 font-mono">{mobile}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-medium">
                            {teamName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            disabled={!canMarkAttendance || isUpdating}
                            onClick={() => handleMarkAttendance(regId, attended)}
                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                              !canMarkAttendance
                                ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
                                : attended
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                            }`}
                            title={
                              !canMarkAttendance
                                ? "Attendance marking is locked for this event"
                                : attended
                                ? "Click to mark Absent"
                                : "Click to mark Present"
                            }
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                            ) : attended ? (
                              "Present ✓"
                            ) : (
                              "Absent"
                            )}
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

      {/* CREATE / EDIT EVENT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">
                {modalMode === "create" ? "Create New Event" : "Edit Event"}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RoboWars 2027"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Organizing Club</label>
                  {isSuperAdmin ? (
                    <select
                      value={eventForm.organizingClub}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          organizingClub: e.target.value as any,
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                    >
                      {CLUBS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={userClub}
                      className="w-full h-9 px-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-400 cursor-not-allowed"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={eventForm.prizePool}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, prizePool: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Min Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={eventForm.minTeamSize}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, minTeamSize: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Max Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={eventForm.maxTeamSize}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, maxTeamSize: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Registration Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={eventForm.registrationFee}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, registrationFee: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Max Capacity (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Unlimited if empty"
                    value={eventForm.maxCapacity}
                    onChange={(e) => setEventForm({ ...eventForm, maxCapacity: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Rules & Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter details, rules, eligibility criteria..."
                  value={eventForm.rulesText}
                  onChange={(e) => setEventForm({ ...eventForm, rulesText: e.target.value })}
                  className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="eventIsOpen"
                    checked={eventForm.isOpen}
                    onChange={(e) => setEventForm({ ...eventForm, isOpen: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-800 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="eventIsOpen" className="text-zinc-300 font-medium cursor-pointer">
                    Open for participant registrations
                  </label>
                </div>

                {isSuperAdmin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="eventAttendanceOpen"
                        checked={eventForm.attendanceOpen}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, attendanceOpen: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-zinc-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="eventAttendanceOpen"
                        className="text-zinc-300 font-medium cursor-pointer"
                      >
                        Open attendance marking
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="eventWinnersOpen"
                        checked={eventForm.winnersOpen}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, winnersOpen: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-zinc-800 text-amber-500 focus:ring-amber-500"
                      />
                      <label
                        htmlFor="eventWinnersOpen"
                        className="text-zinc-300 font-medium cursor-pointer"
                      >
                        Open winner declaration
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMode(null)}
                  disabled={savingEvent}
                  className="border-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingEvent}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {savingEvent ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </span>
                  ) : modalMode === "create" ? (
                    "Create Event"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PODIUM DECLARATION MODAL */}
      {podiumModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-amber-400">
                <Trophy className="h-5 w-5" />
                <h3 className="text-base font-bold text-zinc-100">
                  Declare Winners: {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPodiumModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Select 1st, 2nd, and 3rd place winners from the confirmed participants.
            </p>

            <div className="space-y-3 text-xs">
              {[1, 2, 3].map((pos) => (
                <div key={pos} className="flex items-center gap-3">
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      pos === 1
                        ? "bg-amber-400 text-black"
                        : pos === 2
                        ? "bg-zinc-300 text-black"
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
                    className="flex-1 h-9 rounded-lg bg-zinc-950 border border-zinc-800 px-3 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">-- Select Winner --</option>
                    {participants.map((p: any) => {
                      const regId = p.registrationId || p.id;
                      const name = p.name || p.userName || p.user?.name || "Participant";
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

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPodiumModalOpen(false)}
                disabled={submittingPodium}
                className="border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeclarePodium}
                disabled={submittingPodium}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {submittingPodium ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Confirm Winners"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

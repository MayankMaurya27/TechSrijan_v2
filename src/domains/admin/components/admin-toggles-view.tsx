"use client";

import { useState, useEffect } from "react";
import { Sliders, CheckCircle2, Lock, Unlock, RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/shared";

export function AdminTogglesView() {
  const [settings, setSettings] = useState<{ attendanceOpen: boolean; winnersOpen: boolean }>({
    attendanceOpen: false,
    winnersOpen: false,
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.settings.get();
      if (data) {
        setSettings({
          attendanceOpen: Boolean(data.attendanceOpen),
          winnersOpen: Boolean(data.winnersOpen),
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch settings:", err);
      setError(err?.message || "Failed to load toggle settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (key: "attendanceOpen" | "winnersOpen") => {
    const newValue = !settings[key];
    setSavingKey(key);
    try {
      const updated = await api.admin.settings.update({
        [key]: newValue,
      });
      setSettings({
        attendanceOpen: Boolean(updated.attendanceOpen),
        winnersOpen: Boolean(updated.winnersOpen),
      });
    } catch (err: any) {
      alert(`Failed to update setting: ${err?.message || "Unknown error"}`);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Permissions & Toggles</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Higher & Boss Admin controls: Turn club coordinator permissions on or off festival-wide.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
          disabled={loading}
          className="text-xs border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchSettings} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading permissions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ATTENDANCE TOGGLE CARD */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Event Attendance
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    settings.attendanceOpen
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {settings.attendanceOpen ? (
                    <>
                      <Unlock className="h-3 w-3" />
                      Unlocked for Clubs
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      Locked for Clubs
                    </>
                  )}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                Club Admin Attendance Marking
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When enabled, Club Admins can mark participants Present or Absent in their event
                rosters. When disabled, only Higher Admins and Boss Admins can mark attendance.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">
                Status: {settings.attendanceOpen ? "Active (Open)" : "Disabled (Locked)"}
              </span>

              <button
                type="button"
                disabled={savingKey === "attendanceOpen"}
                onClick={() => handleToggle("attendanceOpen")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceOpen ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceOpen ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* WINNERS TOGGLE CARD */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Podium & Points
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    settings.winnersOpen
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {settings.winnersOpen ? (
                    <>
                      <Unlock className="h-3 w-3" />
                      Unlocked for Clubs
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      Locked for Clubs
                    </>
                  )}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                Club Admin Winner Declaration
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When enabled, Club Admins can submit 1st, 2nd, and 3rd place winners for their
                events to allocate points. When disabled, only Higher Admins and Boss Admins can set
                winners.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">
                Status: {settings.winnersOpen ? "Active (Open)" : "Disabled (Locked)"}
              </span>

              <button
                type="button"
                disabled={savingKey === "winnersOpen"}
                onClick={() => handleToggle("winnersOpen")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.winnersOpen ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.winnersOpen ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

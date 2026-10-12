"use client";

import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Loader2, CheckCircle, XCircle, Award, MapPin } from "lucide-react";
import { api, CampusAmbassador } from "@/lib/api";
import { Button } from "@/shared";

export function AdminAmbassadorsView() {
  const [ambassadors, setAmbassadors] = useState<CampusAmbassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED">("ALL");

  const fetchAmbassadors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.ambassadors.list();
      setAmbassadors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load ambassadors:", err);
      setError(err?.message || "Failed to load ambassador roster from Directorate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED"
  ) => {
    setActionLoadingId(id);
    try {
      await api.admin.ambassadors.updateStatus(id, newStatus);
      setAmbassadors((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      alert(`Status update failed: ${err?.message || "Unknown error"}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = ambassadors.filter((a) => {
    const matchesFilter = statusFilter === "ALL" || a.status === statusFilter;
    if (!matchesFilter) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.fullName?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.college?.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q) ||
      a.operativeCode?.toLowerCase().includes(q)
    );
  });

  const pendingCount = ambassadors.filter((a) => a.status === "PENDING").length;
  const activeCount = ambassadors.filter((a) => a.status === "ACTIVE" || a.status === "APPROVED").length;

  return (
    <div className="space-y-8 font-mono">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
            OUTREACH & REGIONAL EMBASSIES
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            CAMPUS AMBASSADORS DIRECTORATE
          </h2>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAmbassadors} disabled={loading} className="text-xs">
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>SYNC AMBASSADORS</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchAmbassadors} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            TOTAL APPLICANTS
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
            {ambassadors.length}
          </div>
          <div className="mt-1 text-[9px] text-[var(--accent-primary)]">
            REGIONAL APPLICANTS
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--geass-crimson)]/50 bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--geass-crimson)] tracking-widest uppercase font-bold">
            PENDING APPROVAL
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--geass-crimson)]">
            {pendingCount}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-muted)]">
            AWAITING CLEARANCE
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            ACTIVE DIPLOMATS
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {activeCount}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            PROMOTING FIESTA
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            TOTAL CONVERSIONS
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--accent-primary)]">
            {ambassadors.reduce((acc, a) => acc + (a.referralCount || 0), 0)}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            STUDENT REFERRALS
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["ALL", "PENDING", "APPROVED", "ACTIVE", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs tracking-widest transition-colors ${
                statusFilter === tab
                  ? tab === "PENDING"
                    ? "bg-[var(--geass-crimson)] text-white font-bold"
                    : tab === "ACTIVE" || tab === "APPROVED"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-[var(--accent-primary)] text-black font-bold"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab === "PENDING" ? `PENDING (${pendingCount})` : tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search ambassadors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full pl-9 pr-3 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* AMBASSADOR TABLE */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[var(--accent-primary)] animate-spin mb-3" />
          <span className="text-xs text-[var(--text-muted)] uppercase">LOADING AMBASSADORS...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)]">
          NO AMBASSADORS MATCHING CRITERIA.
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
                <th className="py-3 px-4">Ambassador</th>
                <th className="py-3 px-4">Institution & City</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4 text-center">Referrals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {filtered.map((a) => {
                const isLoading = actionLoadingId === a.id;
                return (
                  <tr key={a.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--text-primary)]">{a.fullName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{a.email} • {a.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[var(--text-secondary)]">{a.college}</div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{a.city || "India"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--accent-primary)]">
                      {a.operativeCode}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      {a.referralCount || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          a.status === "ACTIVE" || a.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : a.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {a.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(a.id, "APPROVED")}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                          >
                            APPROVE
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(a.id, "REJECTED")}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                          >
                            REJECT
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(a.id, a.status === "REJECTED" ? "ACTIVE" : "REJECTED")
                          }
                          disabled={isLoading}
                          className="text-[10px] text-[var(--text-muted)] hover:text-white underline"
                        >
                          {a.status === "REJECTED" ? "RE-ENABLE" : "REVOKE"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

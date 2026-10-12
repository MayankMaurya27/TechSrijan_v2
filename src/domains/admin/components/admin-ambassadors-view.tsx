"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Check,
  X,
} from "lucide-react";
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
      setError(err?.message || "Failed to load campus ambassadors.");
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
  const approvedCount = ambassadors.filter((a) => a.status === "APPROVED" || a.status === "ACTIVE").length;
  const rejectedCount = ambassadors.filter((a) => a.status === "REJECTED").length;

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Campus Ambassadors</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Higher & Boss Admin: Review, approve, or reject student ambassador applications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAmbassadors}
          disabled={loading}
          className="text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200"
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchAmbassadors} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
          <div className="text-[11px] text-zinc-400 uppercase font-semibold">Total Applicants</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{ambassadors.length}</div>
        </div>

        <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 shadow-sm">
          <div className="text-[11px] text-amber-400 uppercase font-semibold">Pending Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 shadow-sm">
          <div className="text-[11px] text-emerald-400 uppercase font-semibold">Approved</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
        </div>

        <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/10 shadow-sm">
          <div className="text-[11px] text-red-400 uppercase font-semibold">Rejected</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* SEARCH AND STATUS FILTER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by student name, college, city, or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === filter
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading campus ambassadors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          No campus ambassador applications match the criteria.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">College & City</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((amb) => {
                  const isPending = amb.status === "PENDING";
                  const isApproved = amb.status === "APPROVED" || amb.status === "ACTIVE";
                  const isRejected = amb.status === "REJECTED";
                  const isProcessing = actionLoadingId === amb.id;

                  return (
                    <tr key={amb.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-100">{amb.fullName}</div>
                        <div className="text-[11px] text-zinc-400">{amb.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-200">{amb.college}</div>
                        <div className="text-[11px] text-zinc-500">{amb.city || "N/A"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-mono">
                        {amb.phone || "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {amb.operativeCode || "N/A"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isApproved
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : isRejected
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {amb.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 text-amber-500 animate-spin ml-auto" />
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {!isApproved && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(amb.id, "APPROVED")}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </button>
                            )}
                            {!isRejected && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(amb.id, "REJECTED")}
                                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-900/60 text-zinc-300 hover:text-red-300 font-medium text-[11px] flex items-center gap-1 border border-zinc-700 transition-colors"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

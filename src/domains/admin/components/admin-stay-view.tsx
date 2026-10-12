"use client";

import { useState, useEffect } from "react";
import { Hotel, Users, Search, RefreshCw, Loader2, BedDouble, CheckCircle2 } from "lucide-react";
import { api, InventoryTier } from "@/lib/api";
import { Button } from "@/shared";

export function AdminStayView() {
  const [inventory, setInventory] = useState<InventoryTier[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invData, bookingsData] = await Promise.all([
        api.stay.getInventory(),
        api.admin.stay.listBookings().catch(() => []),
      ]);
      setInventory(Array.isArray(invData) ? invData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err: any) {
      console.error("Failed to load stay data:", err);
      setError(err?.message || "Failed to load stay inventory from hostel registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const boysTier = inventory.find((i) => i.gender === "boys");
  const girlsTier = inventory.find((i) => i.gender === "girls");

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      b.userName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.collegeName?.toLowerCase().includes(q) ||
      b.bookingId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 font-mono">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
            CAMPUS RESIDENCE & LOGISTICS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            HOSTEL ACCOMMODATION & STAY ROSTER
          </h2>
        </div>

        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="text-xs">
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>SYNC HOSTELS</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchData} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* INVENTORY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BOYS HOSTEL */}
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase flex items-center justify-between">
            <span>BOYS HOSTEL BEDS</span>
            <BedDouble className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
            {boysTier ? boysTier.totalCapacity - boysTier.confirmedCount : 0} Available
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            Total Capacity: {boysTier?.totalCapacity || 0} Beds
          </div>
        </div>

        {/* GIRLS HOSTEL */}
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase flex items-center justify-between">
            <span>GIRLS HOSTEL BEDS</span>
            <BedDouble className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
            {girlsTier ? girlsTier.totalCapacity - girlsTier.confirmedCount : 0} Available
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            Total Capacity: {girlsTier?.totalCapacity || 0} Beds
          </div>
        </div>

        {/* CONFIRMED GUESTS */}
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase flex items-center justify-between">
            <span>CONFIRMED GUESTS</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {(boysTier?.confirmedCount || 0) + (girlsTier?.confirmedCount || 0)}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            ACCOMMODATION ISSUED
          </div>
        </div>

        {/* TOTAL STAY BOOKINGS */}
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase flex items-center justify-between">
            <span>TOTAL BOOKING FILES</span>
            <Hotel className="h-4 w-4 text-[var(--accent-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--accent-primary)]">
            {bookings.length}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            LEDGER REGISTRATIONS
          </div>
        </div>
      </div>

      {/* BOOKINGS ROSTER TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by participant, email, college, or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full pl-10 pr-4 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[var(--accent-primary)] animate-spin mb-3" />
            <span className="text-xs text-[var(--text-muted)] uppercase">LOADING STAY ROSTER...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-10 rounded border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)]">
            NO STAY BOOKINGS FOUND IN REGISTRY.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/40">
                {filteredBookings.map((b: any) => (
                  <tr key={b.bookingId || b.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-[var(--accent-primary)]">
                      {b.bookingId || b.referenceId || "TS27-STAY"}
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                      {b.userName || b.fullName || "Guest"}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{b.collegeName || "N/A"}</td>
                    <td className="py-3 px-4 uppercase text-[10px]">{b.gender || "Boys"}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{b.mobile || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {b.status || "CONFIRMED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

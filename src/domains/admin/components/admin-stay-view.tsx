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
        api.stay.getInventory().catch(() => []),
        api.admin.stay.listBookings().catch(() => []),
      ]);
      setInventory(Array.isArray(invData) ? invData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err: any) {
      console.error("Failed to load stay data:", err);
      setError(err?.message || "Failed to load accommodation data.");
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
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Accommodation & Stay</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor campus hostel capacity and guest bookings.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
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
          <Button variant="outline" size="sm" onClick={fetchData} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* INVENTORY / HOSTEL CAPACITY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
          <div className="text-[11px] text-zinc-400 uppercase font-semibold">Total Bookings</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">{bookings.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Festival guests registered</div>
        </div>

        <div className="p-4 rounded-xl border border-blue-900/30 bg-blue-950/10 shadow-sm">
          <div className="text-[11px] text-blue-400 uppercase font-semibold">Boys Hostel</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">
            {boysTier ? `${boysTier.totalCapacity - boysTier.availableBeds} / ${boysTier.totalCapacity}` : "Active"}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {boysTier?.availableBeds || 0} beds remaining
          </div>
        </div>

        <div className="p-4 rounded-xl border border-purple-900/30 bg-purple-950/10 shadow-sm">
          <div className="text-[11px] text-purple-400 uppercase font-semibold">Girls Hostel</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">
            {girlsTier ? `${girlsTier.totalCapacity - girlsTier.availableBeds} / ${girlsTier.totalCapacity}` : "Active"}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {girlsTier?.availableBeds || 0} beds remaining
          </div>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative max-w-md">
        <label htmlFor="admin-stay-search" className="sr-only">
          Search Bookings
        </label>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          id="admin-stay-search"
          type="text"
          aria-label="Search Bookings"
          placeholder="Search by guest name, college, email, or booking ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* BOOKINGS TABLE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading hostel bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          No accommodation bookings found.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
          <div className="overflow-x-auto touch-pan-y">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">College</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredBookings.map((b: any, idx: number) => {
                  const name = b.userName || b.user?.name || "Guest";
                  const email = b.userEmail || b.user?.email || "";
                  const college = b.collegeName || b.user?.collegeName || "N/A";
                  const gender = b.gender || b.user?.gender || "N/A";
                  const mobile = b.userMobile || b.user?.mobile || "N/A";
                  const checkIn = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : "Day 1";
                  const checkOut = b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : "Day 3";
                  const isConfirmed = b.status === "CONFIRMED" || b.status === "COMPLETED";

                  return (
                    <tr key={b.id || idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-100">{name}</div>
                        <div className="text-[11px] text-zinc-400">{email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{college}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{gender}</td>
                      <td className="py-3.5 px-4 text-zinc-300 font-mono">{mobile}</td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {checkIn} → {checkOut}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isConfirmed
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {b.status || "CONFIRMED"}
                        </span>
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

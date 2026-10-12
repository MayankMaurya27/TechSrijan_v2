"use client";

import { useState, useEffect } from "react";
import {
  Handshake,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  ExternalLink,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { api, Sponsor } from "@/lib/api";
import { Button } from "@/shared";

const SPONSOR_TIERS = ["TITLE", "ASSOCIATE", "POWERED_BY", "GOLD", "SILVER", "PARTNER"] as const;

export function AdminSponsorsView() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Create / Edit modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "PARTNER" as Sponsor["category"],
    logoUrl: "",
    websiteUrl: "",
    displayOrder: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.sponsors.list();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load sponsors:", err);
      setError(err?.message || "Failed to load sponsors list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingSponsorId(null);
    setFormData({
      name: "",
      category: "PARTNER",
      logoUrl: "",
      websiteUrl: "",
      displayOrder: sponsors.length + 1,
    });
  };

  const handleOpenEdit = (sponsor: Sponsor) => {
    setModalMode("edit");
    setEditingSponsorId(sponsor.id);
    setFormData({
      name: sponsor.name,
      category: sponsor.category,
      logoUrl: sponsor.logoUrl || "",
      websiteUrl: sponsor.websiteUrl || "",
      displayOrder: sponsor.displayOrder || 1,
    });
  };

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Sponsor name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        logoUrl: formData.logoUrl.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined,
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (modalMode === "create") {
        const created = await api.admin.sponsors.create(payload);
        setSponsors((prev) => [...prev, created]);
        alert("Sponsor created successfully.");
      } else if (modalMode === "edit" && editingSponsorId) {
        const updated = await api.admin.sponsors.update(editingSponsorId, payload);
        setSponsors((prev) => prev.map((s) => (s.id === editingSponsorId ? updated : s)));
        alert("Sponsor updated successfully.");
      }

      setModalMode(null);
    } catch (err: any) {
      alert(`Operation failed: ${err?.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSponsor = async (sponsor: Sponsor) => {
    if (!confirm(`Are you sure you want to delete ${sponsor.name}?`)) return;
    try {
      await api.admin.sponsors.delete(sponsor.id);
      setSponsors((prev) => prev.filter((s) => s.id !== sponsor.id));
      alert("Sponsor deleted successfully.");
    } catch (err: any) {
      alert(`Deletion failed: ${err?.message || "Unknown error"}`);
    }
  };

  const filtered = sponsors.filter((s) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Sponsors Management</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Add, edit, or remove festival partners and brand logos.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSponsors}
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
            Add Sponsor
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchSponsors} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by sponsor name or tier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* SPONSORS GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading sponsors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          No sponsors found. Click &quot;Add Sponsor&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {s.category.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-zinc-500">Order #{s.displayOrder}</span>
                </div>

                {s.logoUrl ? (
                  <div className="h-16 w-full flex items-center justify-center bg-zinc-950 rounded-lg p-2 mb-3 border border-zinc-800/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-full flex items-center justify-center bg-zinc-950 rounded-lg text-zinc-600 text-xs mb-3 border border-zinc-800/60 font-semibold">
                    No Logo
                  </div>
                )}

                <h3 className="font-bold text-sm text-zinc-100">{s.name}</h3>

                {s.websiteUrl && (
                  <a
                    href={s.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1 mt-1 truncate"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{s.websiteUrl}</span>
                  </a>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(s)}
                  className="h-7 px-2.5 text-[11px] border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSponsor(s)}
                  className="h-7 px-2.5 text-[11px] border-red-900/50 hover:bg-red-900/30 text-red-400"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">
                {modalMode === "create" ? "Add New Sponsor" : "Edit Sponsor"}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Sponsor / Partner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Sponsorship Tier</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  {SPONSOR_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Logo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://sponsor.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) })
                  }
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMode(null)}
                  disabled={submitting}
                  className="border-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </span>
                  ) : modalMode === "create" ? (
                    "Add Sponsor"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

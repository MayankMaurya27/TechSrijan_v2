"use client";

import { useState, useEffect } from "react";
import { Handshake, Plus, Search, RefreshCw, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { api, Sponsor } from "@/lib/api";
import { Button } from "@/shared";

export function AdminSponsorsView() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
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

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      const newSponsor = await api.admin.sponsors.create({
        name: formData.name.trim(),
        category: formData.category,
        logoUrl: formData.logoUrl.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined,
        displayOrder: formData.displayOrder,
      });
      setSponsors((prev) => [...prev, newSponsor]);
      setCreateModalOpen(false);
      setFormData({
        name: "",
        category: "PARTNER",
        logoUrl: "",
        websiteUrl: "",
        displayOrder: 1,
      });
    } catch (err: any) {
      alert(`Failed to add sponsor: ${err?.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Are you sure you want to remove this sponsor?")) return;
    try {
      await api.admin.sponsors.delete(id);
      setSponsors((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(`Deletion failed: ${err?.message}`);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
            PARTNERSHIPS & ALLIANCES
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            SPONSORS DIRECTORATE
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchSponsors} disabled={loading} className="text-xs">
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>SYNC SPONSORS</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs bg-[var(--accent-primary)] text-black font-bold"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            <span>ADD SPONSOR</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchSponsors} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* SPONSORS GRID */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[var(--accent-primary)] animate-spin mb-3" />
          <span className="text-xs text-[var(--text-muted)] uppercase">LOADING SPONSORS...</span>
        </div>
      ) : sponsors.length === 0 ? (
        <div className="p-10 rounded border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)]">
          NO SPONSORS REGISTERED. CLICK "ADD SPONSOR" TO CREATE ONE.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="mecha-bracket rounded border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between hover:border-[var(--accent-primary)]/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                    {s.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSponsor(s.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete Sponsor"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="h-10 w-10 object-contain rounded bg-black/40 p-1 border border-white/10"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase">
                      {s.name}
                    </h3>
                    {s.websiteUrl && (
                      <a
                        href={s.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] text-[9px] text-[var(--text-muted)] flex items-center justify-between">
                <span>Display Priority: #{s.displayOrder}</span>
                <span className="text-emerald-400">ACTIVE PARTNER</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SPONSOR MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--accent-primary)]/60 rounded-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black uppercase text-[var(--text-primary)] tracking-wider border-b border-[var(--border)] pb-2">
              REGISTER NEW FESTIVAL PARTNER
            </h3>

            <form onSubmit={handleCreateSponsor} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  Sponsor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud, Intel, SBI"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 rounded bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs text-white focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  Partnership Tier *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full h-9 rounded bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs text-white focus:border-[var(--accent-primary)] focus:outline-none"
                >
                  <option value="TITLE">TITLE SPONSOR</option>
                  <option value="POWERED_BY">POWERED BY</option>
                  <option value="ASSOCIATE">ASSOCIATE PARTNER</option>
                  <option value="MEDIA">MEDIA PARTNER</option>
                  <option value="PARTNER">EVENT PARTNER</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full h-9 rounded bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs text-white focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full h-9 rounded bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs text-white focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={submitting}
                >
                  <span>CANCEL</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  type="submit"
                  disabled={submitting}
                  className="bg-[var(--accent-primary)] text-black font-bold"
                >
                  <span>{submitting ? "SAVING..." : "ADD PARTNER"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

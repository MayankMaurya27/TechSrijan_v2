"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Loader2,
  Trash2,
  Edit2,
  KeyRound,
  UserCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/shared";

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  rollNumber?: string | null;
  role: "ADMIN" | "SUPER_ADMIN" | "BOSS";
  club?: string | null;
  createdAt?: string;
}

export function AdminCredentialsView() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    username: "",
    password: "",
    adminType: "CLUB_ADMIN" as "CLUB_ADMIN" | "SUPER_ADMIN" | "HIGHER_ADMIN",
    club: "TSC" as "TSC" | "RC" | "IEEE" | "SAE" | "RESO",
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit / Change Password Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    password: "",
    adminType: "CLUB_ADMIN" as "CLUB_ADMIN" | "SUPER_ADMIN",
    club: "TSC" as "TSC" | "RC" | "IEEE" | "SAE" | "RESO",
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.credentials.list();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch admin accounts:", err);
      setError(err?.message || "Failed to load admin accounts list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUsername = createForm.username.trim();
    if (!createForm.name.trim() || !rawUsername || !createForm.password) {
      alert("Please fill in full name, username, and password.");
      return;
    }

    setCreateLoading(true);
    try {
      const payload: any = {
        name: createForm.name.trim(),
        username: rawUsername,
        password: createForm.password,
        adminType: createForm.adminType,
      };
      if (createForm.adminType === "CLUB_ADMIN") {
        payload.club = createForm.club;
      }

      await api.admin.credentials.create(payload);
      alert(`Admin account '${rawUsername}' created successfully.`);
      setCreateModalOpen(false);
      setCreateForm({
        name: "",
        username: "",
        password: "",
        adminType: "CLUB_ADMIN",
        club: "TSC",
      });
      fetchAdmins();
    } catch (err: any) {
      alert(`Failed to create admin: ${err?.message || "Unknown error"}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (admin: AdminRecord) => {
    setEditingAdmin(admin);
    setEditForm({
      name: admin.name || "",
      username: admin.rollNumber || admin.email || "",
      password: "",
      adminType: admin.role === "ADMIN" ? "CLUB_ADMIN" : "SUPER_ADMIN",
      club: (admin.club as any) || "TSC",
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setEditLoading(true);
    try {
      const payload: any = {};
      if (editForm.name.trim() && editForm.name.trim() !== editingAdmin.name) {
        payload.name = editForm.name.trim();
      }
      if (
        editForm.username.trim() &&
        editForm.username.trim() !== (editingAdmin.rollNumber || editingAdmin.email)
      ) {
        payload.username = editForm.username.trim();
      }
      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }
      if (editingAdmin.role !== "BOSS") {
        payload.adminType = editForm.adminType;
        if (editForm.adminType === "CLUB_ADMIN") {
          payload.club = editForm.club;
        } else {
          payload.club = null;
        }
      }

      await api.admin.credentials.update(editingAdmin.id, payload);
      alert("Admin credentials updated successfully.");
      setEditModalOpen(false);
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      alert(`Update failed: ${err?.message || "Unknown error"}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (admin: AdminRecord) => {
    if (admin.role === "BOSS") {
      alert("Cannot delete the Boss Admin account.");
      return;
    }
    if (
      !confirm(
        `Are you sure you want to permanently delete the admin account for ${admin.name} (${admin.email})?`
      )
    ) {
      return;
    }

    try {
      await api.admin.credentials.delete(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      alert("Admin account deleted.");
    } catch (err: any) {
      alert(`Failed to delete admin: ${err?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER STRIP */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Admin Credentials</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Exclusive to Boss Admin: Add, modify, or revoke admin logins and club assignments.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdmins}
            disabled={loading}
            className="text-xs border-zinc-700 hover:bg-zinc-800"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdmins}
            className="text-xs border-red-700"
          >
            Retry
          </Button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-3" />
          <p className="text-xs">Loading administrators...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
          No administrator accounts found.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
          <div className="overflow-x-auto touch-pan-y">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Admin Name</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Assigned Club</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {admins.map((adm) => {
                  const isBoss = adm.role === "BOSS";
                  const isHigher = adm.role === "SUPER_ADMIN";
                  return (
                    <tr key={adm.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-zinc-100 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-zinc-500" />
                        <span>{adm.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-mono">
                        {adm.rollNumber || adm.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isBoss || isHigher
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {isBoss || isHigher ? "Super Admin" : "Club Admin"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {adm.club ? (
                          <span className="font-semibold text-zinc-200">{adm.club}</span>
                        ) : (
                          <span className="text-zinc-500">All Clubs (Central)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(adm)}
                            className="h-7 px-2.5 text-[11px] border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          {!isBoss && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(adm)}
                              className="h-7 px-2.5 text-[11px] border-red-900/50 hover:bg-red-900/30 text-red-400"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-create-modal-title"
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-500" />
                <h3 id="admin-create-modal-title" className="text-base font-bold text-zinc-100">
                  Create New Administrator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                aria-label="Close modal"
                className="text-zinc-400 hover:text-zinc-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label htmlFor="admin-create-name" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Full Name
                </label>
                <input
                  id="admin-create-name"
                  type="text"
                  required
                  aria-required="true"
                  placeholder="e.g. John Doe"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-create-username" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Admin Username *
                </label>
                <input
                  id="admin-create-username"
                  type="text"
                  required
                  aria-required="true"
                  placeholder="e.g. tsc_head, mayank, admin1 (any username)"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-create-password" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Password *
                </label>
                <input
                  id="admin-create-password"
                  type="password"
                  required
                  aria-required="true"
                  placeholder="••••••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-create-type" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Admin Type
                </label>
                <select
                  id="admin-create-type"
                  value={createForm.adminType}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      adminType: e.target.value as "CLUB_ADMIN" | "SUPER_ADMIN" | "HIGHER_ADMIN",
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="CLUB_ADMIN">Club Admin (Manage own club events only)</option>
                  <option value="SUPER_ADMIN">
                    Super Admin (All events, sponsors, ambassadors, stay)
                  </option>
                </select>
              </div>

              {createForm.adminType === "CLUB_ADMIN" && (
                <div>
                  <label htmlFor="admin-create-club" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                    Assign to Club
                  </label>
                  <select
                    id="admin-create-club"
                    value={createForm.club}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        club: e.target.value as any,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="TSC">TSC (Technical Sub-Council)</option>
                    <option value="RC">RC (Robotics Club)</option>
                    <option value="IEEE">IEEE Student Branch</option>
                    <option value="SAE">SAE Collegiate Club</option>
                    <option value="RESO">RESO Club</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={createLoading}
                  className="border-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {createLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Admin"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-edit-modal-title"
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-amber-500" />
                <h3 id="admin-edit-modal-title" className="text-base font-bold text-zinc-100">
                  Edit Admin: {editingAdmin.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                aria-label="Close modal"
                className="text-zinc-400 hover:text-zinc-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label htmlFor="admin-edit-name" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Full Name
                </label>
                <input
                  id="admin-edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-edit-username" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Username
                </label>
                <input
                  id="admin-edit-username"
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-edit-password" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                  Change Password (leave empty to keep current)
                </label>
                <input
                  id="admin-edit-password"
                  type="password"
                  placeholder="New password (optional)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {editingAdmin.role !== "BOSS" ? (
                <>
                  <div>
                    <label htmlFor="admin-edit-type" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                      Role
                    </label>
                    <select
                      id="admin-edit-type"
                      value={editForm.adminType}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          adminType: e.target.value as "CLUB_ADMIN" | "SUPER_ADMIN",
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="CLUB_ADMIN">Club Admin (Manage own club events only)</option>
                      <option value="SUPER_ADMIN">
                        Super Admin (All events, sponsors, ambassadors, stay)
                      </option>
                    </select>
                  </div>

                  {editForm.adminType === "CLUB_ADMIN" && (
                    <div>
                      <label htmlFor="admin-edit-club" className="block text-zinc-300 font-medium mb-1.5 cursor-pointer">
                        Assigned Club
                      </label>
                      <select
                        id="admin-edit-club"
                        value={editForm.club}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            club: e.target.value as any,
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                      >
                        <option value="TSC">TSC</option>
                        <option value="RC">RC</option>
                        <option value="IEEE">IEEE</option>
                        <option value="SAE">SAE</option>
                        <option value="RESO">RESO</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-semibold text-amber-400">Master Root Account:</span> Full festival access and root credentials control.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(false)}
                  disabled={editLoading}
                  className="border-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={editLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {editLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </span>
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

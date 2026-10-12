"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Hotel,
  Users,
  Handshake,
  KeyRound,
  LogOut,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/core/providers/auth-provider";
import { Button } from "@/shared";
import Link from "next/link";
import { AdminEventsView } from "./admin-events-view";
import { AdminStayView } from "./admin-stay-view";
import { AdminAmbassadorsView } from "./admin-ambassadors-view";
import { AdminSponsorsView } from "./admin-sponsors-view";
import { AdminCredentialsView } from "./admin-credentials-view";

export type AdminTab =
  | "events"
  | "sponsors"
  | "ambassadors"
  | "stay"
  | "credentials";

interface AdminPortalProps {
  initialTab?: AdminTab;
}

export function AdminPortal({ initialTab = "events" }: AdminPortalProps) {
  const { user, logout, isLoading: isAuthLoading } = useAuth();

  const isClubAdmin = user?.role === "ADMIN";
  const isHigherAdmin = user?.role === "SUPER_ADMIN";
  const isBossAdmin = user?.role === "BOSS";
  const isAdmin = isClubAdmin || isHigherAdmin || isBossAdmin;

  // Club admins only have access to "events"
  const defaultTab = isClubAdmin ? "events" : initialTab === "credentials" && !isBossAdmin ? "events" : initialTab;
  const [activeTab, setActiveTab] = useState<AdminTab>(defaultTab);

  useEffect(() => {
    if (isClubAdmin && activeTab !== "events") {
      setActiveTab("events");
    }
  }, [isClubAdmin, activeTab]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-xs">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminSignInView />;
  }

  if (!isAdmin) {
    return <NonAdminRestrictedView user={user} onLogout={logout} />;
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* TOP HEADER STRIP */}
      <header className="w-full pb-6 mb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
              TechSrijan &apos;27
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Admin Portal</h1>
        </div>

        {/* LOGGED IN USER BADGE & LOGOUT */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-right">
            <div className="text-xs font-semibold text-zinc-200">{user.name}</div>
            <div className="text-[10px] text-zinc-400 font-medium">
              {isBossAdmin || isHigherAdmin ? (
                <span className="text-amber-400 font-semibold">Super Admin</span>
              ) : (
                <span className="text-blue-400 font-semibold">
                  Club Admin ({user.club || "Club"})
                </span>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs border-zinc-800 hover:bg-zinc-900 text-red-400 hover:text-red-300"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      {/* For Club Admin, only Events tab exists */}
      {!isClubAdmin && (
        <nav className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-800">
          <TabButton
            icon={Trophy}
            label="Events"
            active={activeTab === "events"}
            onClick={() => setActiveTab("events")}
          />
          <TabButton
            icon={Handshake}
            label="Sponsors"
            active={activeTab === "sponsors"}
            onClick={() => setActiveTab("sponsors")}
          />
          <TabButton
            icon={Users}
            label="Campus Ambassadors"
            active={activeTab === "ambassadors"}
            onClick={() => setActiveTab("ambassadors")}
          />
          <TabButton
            icon={Hotel}
            label="Accommodation"
            active={activeTab === "stay"}
            onClick={() => setActiveTab("stay")}
          />
          {isBossAdmin && (
            <TabButton
              icon={KeyRound}
              label="Admin Credentials"
              active={activeTab === "credentials"}
              onClick={() => setActiveTab("credentials")}
            />
          )}
        </nav>
      )}

      {/* ACTIVE VIEW (FULL WIDTH) */}
      <main className="w-full">
        {activeTab === "events" && <AdminEventsView />}
        {activeTab === "sponsors" && !isClubAdmin && <AdminSponsorsView />}
        {activeTab === "ambassadors" && !isClubAdmin && <AdminAmbassadorsView />}
        {activeTab === "stay" && !isClubAdmin && <AdminStayView />}
        {activeTab === "credentials" && isBossAdmin && <AdminCredentialsView />}
      </main>
    </div>
  );
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors cursor-pointer ${
        active
          ? "bg-amber-500 text-black font-bold shadow-sm"
          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

function AdminSignInView() {
  const { loginAdmin } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({
        identifier: identifier.trim(),
        password,
      });
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 font-sans">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Admin Sign In</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your administrator username and password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-800/60 bg-red-950/40 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. admin, tsc_head, or your username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function NonAdminRestrictedView({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 font-sans">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 text-center shadow-xl space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-100">Access Restricted</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            You are signed in as <span className="text-zinc-200">{user.email}</span>, which does not
            have administrator clearance.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link href="/profile" className="block w-full">
            <Button variant="outline" size="sm" className="w-full text-xs border-zinc-700">
              Go to Student Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="w-full text-xs border-red-900/40 text-red-400 hover:bg-red-950/30"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

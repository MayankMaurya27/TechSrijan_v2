"use client";

import { useState } from "react";
import {
  CreditCard,
  Trophy,
  Hotel,
  Users,
  Handshake,
  ShieldAlert,
  Loader2,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/core/providers/auth-provider";
import { Button } from "@/shared";
import Link from "next/link";
import { AdminPaymentsView } from "./admin-payments-view";
import { AdminEventsView } from "./admin-events-view";
import { AdminStayView } from "./admin-stay-view";
import { AdminAmbassadorsView } from "./admin-ambassadors-view";
import { AdminSponsorsView } from "./admin-sponsors-view";

export type AdminTab = "payments" | "events" | "stay" | "ambassadors" | "sponsors";

interface AdminPortalProps {
  initialTab?: AdminTab;
}

export function AdminPortal({ initialTab = "payments" }: AdminPortalProps) {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "BOSS";

  if (isAuthLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center font-mono">
        <Loader2 className="w-10 h-10 text-[var(--accent-primary)] animate-spin mb-4" />
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)]">
          CHECKING HIGH COMMAND CREDENTIALS...
        </p>
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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-12 mx-auto max-w-7xl font-mono pb-24">
      {/* HIGH COMMAND HEADER & ADMIN IDENTITY STRIP */}
      <div className="border-b border-[var(--border)] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-[var(--accent-primary)] uppercase font-semibold">
              APEX DIRECTIVE · CENTRAL COMMAND
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            ADMIN COMMAND PORTAL
          </h1>
        </div>

        {/* LOGGED IN ADMIN IDENTITY BADGE */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-right">
            <div className="text-xs font-bold text-[var(--text-primary)] uppercase">
              {user.name}
            </div>
            <div className="text-[9px] tracking-wider text-[var(--accent-primary)] font-semibold uppercase flex items-center justify-end gap-1.5 mt-0.5">
              <span>{user.role}</span>
              {user.club && <span>• {user.club} CELL</span>}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-400"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            <span>LOGOUT</span>
          </Button>
        </div>
      </div>

      {/* COMMAND SUITE TAB SWITCHER */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-b border-[var(--border)] pb-4 mb-8 select-none">
        <TabButton
          icon={CreditCard}
          label="Ledger & Payments"
          active={activeTab === "payments"}
          onClick={() => setActiveTab("payments")}
        />
        <TabButton
          icon={Trophy}
          label="Events & Podium"
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        />
        <TabButton
          icon={Hotel}
          label="Hostel & Stay"
          active={activeTab === "stay"}
          onClick={() => setActiveTab("stay")}
        />
        <TabButton
          icon={Users}
          label="Ambassadors"
          active={activeTab === "ambassadors"}
          onClick={() => setActiveTab("ambassadors")}
        />
        <TabButton
          icon={Handshake}
          label="Sponsors"
          active={activeTab === "sponsors"}
          onClick={() => setActiveTab("sponsors")}
        />
      </div>

      {/* ACTIVE SUITE VIEW */}
      <div>
        {activeTab === "payments" && <AdminPaymentsView />}
        {activeTab === "events" && <AdminEventsView />}
        {activeTab === "stay" && <AdminStayView />}
        {activeTab === "ambassadors" && <AdminAmbassadorsView />}
        {activeTab === "sponsors" && <AdminSponsorsView />}
      </div>
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
      className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
        active
          ? "bg-[var(--accent-primary)] text-black shadow-[0_0_15px_rgba(212,168,67,0.35)]"
          : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-primary)]/40 hover:bg-white/[0.02]"
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
      setError("Please provide both administrator identifier and passphrase.");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({
        identifier: identifier.trim(),
        password,
      });
    } catch (err: any) {
      setError(err?.message || "Authentication failed. High Command administrative clearance required.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-md mx-auto border border-[var(--border)] bg-[var(--surface)] p-8 rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--geass-crimson)] via-[var(--accent-primary)] to-[var(--geass-crimson)]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded bg-[var(--geass-crimson)]/10 border border-[var(--geass-crimson)]/30 text-[var(--geass-crimson)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--accent-primary)] font-semibold block">
              RESTRICTED APEX TERMINAL
            </span>
            <h1 className="text-xl font-black uppercase text-[var(--text-primary)] tracking-tight">
              ADMIN COMMAND PORTAL
            </h1>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
          Authorized personnel only. Authenticate using your university administrator roll number or official directorate email.
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--text-secondary)] mb-2 font-semibold">
              OFFICIAL IDENTIFIER (ROLL NO / EMAIL)
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. 2027DIR001 or admin@techsrijan.org"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--text-secondary)] mb-2 font-semibold">
              PASSPHRASE
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="w-full h-11 mt-2 text-xs font-bold tracking-wider uppercase bg-[var(--geass-crimson)] hover:bg-[var(--geass-crimson)]/90 text-white"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                VERIFYING CLEARANCE...
              </span>
            ) : (
              "AUTHENTICATE DIRECTIVE"
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
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-md mx-auto border border-[var(--geass-crimson)] bg-[var(--surface)] p-8 rounded-lg shadow-2xl text-center mecha-bracket">
        <div className="mx-auto w-12 h-12 rounded-full bg-[var(--geass-crimson)]/10 border border-[var(--geass-crimson)]/30 flex items-center justify-center text-[var(--geass-crimson)] mb-4">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>

        <h2 className="text-lg font-black uppercase text-[var(--text-primary)] tracking-wide mb-2">
          INSUFFICIENT SECURITY CLEARANCE
        </h2>

        <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
          Your authenticated identity (
          <span className="text-[var(--text-primary)]">{user.email}</span>) holds role{" "}
          <strong className="text-[var(--geass-crimson)]">[{user.role}]</strong>. Only designated
          coordinators, club admins, and directorship can enter the Apex Terminal.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <span>RETURN TO STUDENT DOSSIER</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={onLogout}
            className="w-full text-xs"
          >
            <span>DISENGAGE SESSION</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

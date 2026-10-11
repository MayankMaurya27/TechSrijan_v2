"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Loader2,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/shared";
import { generateSafeCsv, downloadCsv } from "@/core";
import { useAuth } from "@/core/providers/auth-provider";
import { api } from "@/lib/api";
import Link from "next/link";

export interface PaymentItem {
  paymentId: string;
  category: "REGISTRATION" | "STAY" | string;
  referenceId: string;
  utrNumber: string;
  amount: number;
  receiptUrl: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
  userName: string;
  userEmail: string;
  userMobile?: string | null;
  collegeName?: string | null;
  rollNumber?: string | null;
}

export function AdminPortal() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rejectionModalItem, setRejectionModalItem] = useState<PaymentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "BOSS";

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.admin.payments.list();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch payments:", err);
      setError(err?.message || "Failed to load audit records from backend ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPayments();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const handleApprove = async (paymentId: string) => {
    setActionLoadingId(paymentId);
    try {
      await api.admin.payments.verify({
        paymentId,
        status: "VERIFIED",
      });
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === paymentId
            ? { ...p, status: "VERIFIED", verifiedAt: new Date().toISOString() }
            : p
        )
      );
    } catch (err: any) {
      alert(`Approval failed: ${err?.message || "Unknown error"}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionModalItem) return;
    setActionLoadingId(rejectionModalItem.paymentId);
    try {
      await api.admin.payments.verify({
        paymentId: rejectionModalItem.paymentId,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim() || "Invalid UTR / receipt mismatch",
      });
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === rejectionModalItem.paymentId
            ? {
                ...p,
                status: "REJECTED",
                rejectionReason: rejectionReason.trim() || "Invalid UTR / receipt mismatch",
              }
            : p
        )
      );
      setRejectionModalItem(null);
      setRejectionReason("");
    } catch (err: any) {
      alert(`Rejection failed: ${err?.message || "Unknown error"}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = useMemo(
    () => payments.filter((p) => p.status === "PENDING_VERIFICATION").length,
    [payments]
  );

  const verifiedCount = useMemo(
    () => payments.filter((p) => p.status === "VERIFIED").length,
    [payments]
  );

  const grossRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === "VERIFIED")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((p) => {
      const matchesFilter = filter === "ALL" || p.status === filter;
      if (!matchesFilter) return false;
      if (!query) return true;

      return (
        p.userName?.toLowerCase().includes(query) ||
        p.userEmail?.toLowerCase().includes(query) ||
        p.utrNumber?.toLowerCase().includes(query) ||
        p.referenceId?.toLowerCase().includes(query) ||
        p.collegeName?.toLowerCase().includes(query)
      );
    });
  }, [payments, filter, search]);

  const exportClientCSV = () => {
    const headers = [
      "Payment ID",
      "Category",
      "UTR Number",
      "Participant Name",
      "Email",
      "Mobile",
      "Institution",
      "Amount (INR)",
      "Status",
      "Created At",
      "Verified At",
      "Receipt URL",
    ];

    const dataRows = payments.map((p) => [
      p.paymentId,
      p.category,
      p.utrNumber,
      p.userName,
      p.userEmail,
      p.userMobile || "N/A",
      p.collegeName || "N/A",
      String(p.amount),
      p.status,
      p.createdAt,
      p.verifiedAt || "N/A",
      p.receiptUrl,
    ]);

    const csvContent = generateSafeCsv(headers, dataRows);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadCsv(`TechSrijan_Ledger_${timestamp}.csv`, csvContent);
  };

  const handleDownloadServerRoster = () => {
    window.open(api.admin.exportGateRosterUrl(), "_blank");
  };

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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center font-mono text-center max-w-lg mx-auto">
        <ShieldAlert className="w-14 h-14 text-[var(--geass-crimson)] mb-4 animate-pulse" />
        <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--geass-crimson)] mb-2">
          SECURITY RESTRICTION · LEVEL 4 CLEARANCE
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
          Access to High Command Ledger and payment reconciliation is restricted to authorized High Command personnel (ADMIN / SUPER_ADMIN / BOSS).
        </p>
        <Link href="/">
          <Button variant="outline" size="default">
            <span>RETURN TO BATTLEFRONT</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-mono">
      {/* HEADER */}
      <div className="border-b border-[var(--border)] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase font-semibold">
            HIGH COMMAND RECONCILIATION · LEDGER AUDIT
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            ADMIN PORTAL
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayments}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>SYNC LEDGER</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportClientCSV}
            className="text-xs"
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            <span>EXPORT CSV</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadServerRoster}
            className="text-xs"
          >
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
            <span>GATE ROSTER STREAM</span>
          </Button>
        </div>
      </div>


      {error && (
        <div className="mb-6 p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchPayments} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            TOTAL SUBMISSIONS
          </div>
          <div className="mt-2 text-3xl font-black text-[var(--text-primary)]">
            {payments.length}
          </div>
          <div className="mt-1 text-[9px] text-[var(--accent-primary)] font-semibold">
            LEDGER TRANSACTIONS
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            VERIFIED REVENUE
          </div>
          <div className="mt-2 text-3xl font-black text-[var(--accent-primary)]">
            ₹{grossRevenue.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            CAPTURED & APPROVED
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--geass-crimson)]/60 bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--geass-crimson)] tracking-widest flex items-center gap-1 uppercase font-bold">
            <AlertTriangle className="h-3 w-3" /> PENDING REVIEWS
          </div>
          <div className="mt-2 text-3xl font-black text-[var(--geass-crimson)]">
            {pendingCount}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-muted)]">
            ACTION REQUIRED
          </div>
        </div>

        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            APPROVED PASSES
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-400">
            {verifiedCount}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            ISSUED & VALIDATED
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-[var(--border)] pb-6">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {(["ALL", "PENDING_VERIFICATION", "VERIFIED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs tracking-widest transition-colors ${
                filter === tab
                  ? tab === "PENDING_VERIFICATION"
                    ? "bg-[var(--geass-crimson)] text-white font-bold"
                    : tab === "VERIFIED"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab === "PENDING_VERIFICATION"
                ? `NEEDS REVIEW (${pendingCount})`
                : tab === "ALL"
                ? `ALL (${payments.length})`
                : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search participant, UTR, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--surface)] rounded mb-16">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)] text-[10px] text-[var(--text-muted)] tracking-widest">
              <th className="p-4">PARTICIPANT</th>
              <th className="p-4">INSTITUTION</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">AMOUNT & UTR</th>
              <th className="p-4">RECEIPT</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-[var(--text-muted)] font-mono text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--accent-primary)]" />
                  LOADING RECONCILIATION DATA...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
                  NO TRANSACTIONS FOUND MATCHING CURRENT AUDIT CRITERIA.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => {
                const isItemActioning = actionLoadingId === p.paymentId;

                return (
                  <tr key={p.paymentId} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[var(--text-primary)]">{p.userName}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{p.userEmail}</div>
                      {p.userMobile && (
                        <div className="text-[10px] text-[var(--text-muted)]">{p.userMobile}</div>
                      )}
                    </td>

                    <td className="p-4 text-[var(--text-secondary)]">
                      <div>{p.collegeName || "MMMUT Gorakhpur"}</div>
                      {p.rollNumber && (
                        <div className="text-[10px] text-[var(--text-muted)]">ROLL: {p.rollNumber}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded border border-[var(--border)] text-[10px] font-bold text-[var(--accent-primary)] bg-[var(--bg-primary)]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-[var(--text-primary)]">
                        ₹{Number(p.amount).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[var(--accent-primary)] mt-0.5 tracking-wider">
                        UTR: {p.utrNumber}
                      </div>
                    </td>

                    <td className="p-4">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[var(--accent-primary)] hover:underline font-mono"
                        >
                          <span>VIEW RECEIPT</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">NONE</span>
                      )}
                    </td>

                    <td className="p-4">
                      {p.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> VERIFIED
                        </span>
                      ) : p.status === "PENDING_VERIFICATION" ? (
                        <span className="inline-flex items-center gap-1 text-[var(--geass-crimson)] text-[11px] font-bold animate-pulse">
                          <AlertTriangle className="h-3.5 w-3.5" /> REVIEW REQUIRED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--text-muted)] text-[11px] font-bold">
                          <XCircle className="h-3.5 w-3.5" /> REJECTED
                        </span>
                      )}
                      {p.rejectionReason && (
                        <div className="text-[9px] text-[var(--geass-crimson)] mt-0.5 max-w-[140px] truncate" title={p.rejectionReason}>
                          {p.rejectionReason}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {p.status === "PENDING_VERIFICATION" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(p.paymentId)}
                            disabled={isItemActioning}
                            className="text-[10px] py-1 px-2.5"
                          >

                            <span>{isItemActioning ? "..." : "APPROVE"}</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setRejectionModalItem(p);
                              setRejectionReason("");
                            }}
                            disabled={isItemActioning}
                            className="text-[10px] py-1 px-2.5"
                          >
                            <span>REJECT</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] tracking-widest font-mono">
                          {p.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--geass-crimson)] rounded-lg p-6 space-y-4 mecha-bracket shadow-2xl">
            <div className="flex items-center gap-2 text-[var(--geass-crimson)]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                REJECT PAYMENT SUBMISSION
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Rejecting payment for <strong>{rejectionModalItem.userName}</strong> (UTR:{" "}
              <span className="font-mono text-[var(--accent-primary)]">
                {rejectionModalItem.utrNumber}
              </span>
              ). Please specify the audit discrepancy reason:
            </p>
            <input
              type="text"
              placeholder="e.g. Invalid UTR, amount mismatch, illegible receipt screenshot"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:border-[var(--geass-crimson)] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectionModalItem(null)}
                disabled={Boolean(actionLoadingId)}
              >
                <span>CANCEL</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                disabled={Boolean(actionLoadingId)}
              >
                <span>{actionLoadingId ? "REJECTING..." : "CONFIRM REJECTION"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return <AdminPortal />;
}


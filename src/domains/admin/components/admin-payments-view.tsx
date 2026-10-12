"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/shared";
import { generateSafeCsv, downloadCsv } from "@/core";
import { api } from "@/lib/api";

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

export function AdminPaymentsView() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rejectionModalItem, setRejectionModalItem] = useState<PaymentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
    fetchPayments();
  }, []);

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

  return (
    <div className="space-y-8 font-mono">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold">
            FINANCIAL RECONCILIATION · LEDGER AUDIT
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            PAYMENTS AUDIT & PASS ISSUANCE
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            className="text-xs bg-[var(--accent-primary)] text-black font-bold"
          >
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
            <span>GATE ROSTER STREAM</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchPayments} className="text-[10px]">
            <span>RETRY</span>
          </Button>
        </div>
      )}

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            TOTAL SUBMISSIONS
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
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
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[var(--accent-primary)]">
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
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[var(--geass-crimson)]">
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
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">
            {verifiedCount}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">
            ISSUED & VALIDATED
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
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
                    : "bg-[var(--accent-primary)] text-black font-bold"
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

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by UTR, Name, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
              <th className="py-3 px-4">Participant</th>
              <th className="py-3 px-4">UTR Number</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Receipt</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/40">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-xs text-[var(--text-muted)]">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--accent-primary)] mb-2" />
                  LOADING LEDGER RECORDS...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[var(--text-muted)]">
                  NO MATCHING TRANSACTION ENTRIES.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => {
                const isItemLoading = actionLoadingId === p.paymentId;
                return (
                  <tr key={p.paymentId} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--text-primary)]">{p.userName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{p.userEmail}</div>
                      {p.collegeName && (
                        <div className="text-[9px] text-[var(--text-secondary)] truncate max-w-xs">
                          {p.collegeName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--accent-primary)]">
                      {p.utrNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[10px] uppercase">{p.category}</td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          p.status === "VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : p.status === "PENDING_VERIFICATION"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[var(--accent-primary)] hover:underline"
                        >
                          <span>VIEW RECEIPT</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === "PENDING_VERIFICATION" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(p.paymentId)}
                            disabled={isItemLoading}
                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                          >
                            APPROVE
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectionModalItem(p)}
                            disabled={isItemLoading}
                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                          >
                            REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">PROCESSED</span>
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
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--geass-crimson)] rounded-lg p-6 space-y-4 shadow-2xl">
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

"use client";

import { useState } from "react";
import { Download, Search, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegistrantRow {
  id: string;
  name: string;
  email: string;
  college: string;
  event: string;
  amount: string;
  orderId: string;
  status: "confirmed" | "pending_manual_review" | "failed";
  timestamp: string;
}

const INITIAL_REGISTRANTS: RegistrantRow[] = [
  {
    id: "REG-0941",
    name: "Aarav Sharma",
    email: "aarav.sharma@mmmut.ac.in",
    college: "MMMUT Gorakhpur",
    event: "HACK IMPERIUM",
    amount: "₹600.00",
    orderId: "order_Qz84bN1a92",
    status: "confirmed",
    timestamp: "2026-09-29 14:22",
  },
  {
    id: "REG-0942",
    name: "Priya Varma",
    email: "priya.v@iitk.ac.in",
    college: "IIT Kanpur",
    event: "ROBO GLADIATORS",
    amount: "₹800.00",
    orderId: "order_Qz85fK93b1",
    status: "pending_manual_review", // Edge-case: webhook captured, client disconnected
    timestamp: "2026-09-29 16:05",
  },
  {
    id: "REG-0943",
    name: "Rohan Gupta",
    email: "rohan.gupta@nitk.edu",
    college: "NIT Kurukshetra",
    event: "ALGO EXILE",
    amount: "₹150.00",
    orderId: "order_Qz87mP41x8",
    status: "confirmed",
    timestamp: "2026-09-29 17:30",
  },
  {
    id: "REG-0944",
    name: "Ananya Dixit",
    email: "ananya.d@hbtu.ac.in",
    college: "HBTU Kanpur",
    event: "GAME CRAFT",
    amount: "₹400.00",
    orderId: "order_Qz89aX55t3",
    status: "pending_manual_review",
    timestamp: "2026-09-29 18:14",
  },
];

export function AdminPortal() {
  const [rows, setRows] = useState<RegistrantRow[]>(INITIAL_REGISTRANTS);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "NEEDS_REVIEW">("ALL");
  const [search, setSearch] = useState("");

  const handleApprove = (id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "confirmed" } : row
      )
    );
  };

  const filteredRows = rows.filter((row) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "CONFIRMED" && row.status === "confirmed") ||
      (filter === "NEEDS_REVIEW" && row.status === "pending_manual_review");

    const matchesSearch =
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.orderId.toLowerCase().includes(search.toLowerCase()) ||
      row.event.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = "ID,Name,Email,College,Event,Amount,OrderID,Status,Timestamp\n";
    const csvContent =
      headers +
      rows
        .map(
          (r) =>
            `${r.id},"${r.name}","${r.email}","${r.college}","${r.event}",${r.amount},${r.orderId},${r.status},${r.timestamp}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TechSrijan_Registrations_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-mono">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase">
            // HIGH COMMAND RECONCILIATION // SECTOR 00
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            ADMIN PORTAL
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs">
            <Download className="mr-2 h-3.5 w-3.5" />
            <span>EXPORT CSV ROSTER</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest">TOTAL REGISTRATIONS</div>
          <div className="mt-2 text-3xl font-black text-[var(--text-primary)]">1,248</div>
          <div className="mt-1 text-[9px] text-[var(--accent-primary)]">+18% OVER LAST CYCLE</div>
        </div>
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest">GROSS REVENUE</div>
          <div className="mt-2 text-3xl font-black text-[var(--accent-primary)]">₹4,82,400</div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">CAPTURED GATEWAY</div>
        </div>
        <div className="mecha-bracket border border-[var(--geass-crimson)]/60 bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--geass-crimson)] tracking-widest flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> PENDING REVIEWS
          </div>
          <div className="mt-2 text-3xl font-black text-[var(--geass-crimson)]">
            {rows.filter((r) => r.status === "pending_manual_review").length}
          </div>
          <div className="mt-1 text-[9px] text-[var(--text-muted)]">ACTION REQUIRED</div>
        </div>
        <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded">
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest">GATE CHECK-INS</div>
          <div className="mt-2 text-3xl font-black text-[var(--text-primary)]">684</div>
          <div className="mt-1 text-[9px] text-[var(--text-secondary)]">ACTIVE ON CAMPUS</div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded text-xs tracking-widest ${
              filter === "ALL"
                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold"
                : "border border-[var(--border)] text-[var(--text-secondary)]"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter("CONFIRMED")}
            className={`px-3 py-1.5 rounded text-xs tracking-widest ${
              filter === "CONFIRMED"
                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold"
                : "border border-[var(--border)] text-[var(--text-secondary)]"
            }`}
          >
            CONFIRMED
          </button>
          <button
            onClick={() => setFilter("NEEDS_REVIEW")}
            className={`px-3 py-1.5 rounded text-xs tracking-widest ${
              filter === "NEEDS_REVIEW"
                ? "bg-[var(--geass-crimson)] text-white font-bold"
                : "border border-[var(--border)] text-[var(--geass-crimson)]"
            }`}
          >
            NEEDS REVIEW ({rows.filter((r) => r.status === "pending_manual_review").length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search operative, order ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--surface)] rounded mb-16">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)] text-[10px] text-[var(--text-muted)] tracking-widest">
              <th className="p-4">OPERATIVE</th>
              <th className="p-4">INSTITUTION</th>
              <th className="p-4">EVENT</th>
              <th className="p-4">TRANSACTION</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredRows.map((row) => (
              <tr key={row.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[var(--text-primary)]">{row.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{row.email}</div>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{row.college}</td>
                <td className="p-4 font-bold text-[var(--accent-primary)]">{row.event}</td>
                <td className="p-4">
                  <div className="font-bold text-[var(--text-primary)]">{row.amount}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{row.orderId}</div>
                </td>
                <td className="p-4">
                  {row.status === "confirmed" ? (
                    <span className="inline-flex items-center gap-1 text-[var(--accent-primary)] text-[11px] font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> CONFIRMED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[var(--geass-crimson)] text-[11px] font-bold animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5" /> PENDING REVIEW
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {row.status === "pending_manual_review" ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleApprove(row.id)}
                      className="text-[10px]"
                    >
                      <span>APPROVE & ISSUE PASS</span>
                    </Button>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)] tracking-widest">
                      ISSUED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminPortal />;
}

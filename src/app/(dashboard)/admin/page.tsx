import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Admin Command Portal | TechSrijan'27",
  description: "High Command reconciliation and registration gate monitoring for TechSrijan'27.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}

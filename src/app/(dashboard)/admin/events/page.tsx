import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Events Management | Admin Portal | TechSrijan'27",
  description: "Festival events, attendance, and winners declaration.",
  robots: { index: false, follow: false },
};

export default function AdminEventsPage() {
  return <AdminPortal initialTab="events" />;
}

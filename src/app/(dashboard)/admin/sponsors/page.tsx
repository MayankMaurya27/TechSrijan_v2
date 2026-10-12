import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Sponsors & Alliances Directorate | Admin Portal | TechSrijan'27",
  description: "Festival sponsor partnerships, tier management, and brand assets.",
  robots: { index: false, follow: false },
};

export default function AdminSponsorsPage() {
  return <AdminPortal initialTab="sponsors" />;
}

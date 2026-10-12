import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Sponsors Management | Admin Portal | TechSrijan'27",
  description: "Festival sponsor partnerships and brand logos.",
  robots: { index: false, follow: false },
};

export default function AdminSponsorsPage() {
  return <AdminPortal initialTab="sponsors" />;
}

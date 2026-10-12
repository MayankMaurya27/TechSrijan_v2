import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Campus Ambassadors Directorate | Admin Portal | TechSrijan'27",
  description: "Regional ambassador recruitment, approvals, and referral tracking.",
  robots: { index: false, follow: false },
};

export default function AdminAmbassadorsPage() {
  return <AdminPortal initialTab="ambassadors" />;
}

import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Campus Ambassadors | Admin Portal | TechSrijan'27",
  description: "Review and manage campus ambassador applications.",
  robots: { index: false, follow: false },
};

export default function AdminAmbassadorsPage() {
  return <AdminPortal initialTab="ambassadors" />;
}

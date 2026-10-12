import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Hostel & Stay Logistics | Admin Portal | TechSrijan'27",
  description: "Campus accommodation inventory, bed allocation, and guest roster.",
  robots: { index: false, follow: false },
};

export default function AdminStayPage() {
  return <AdminPortal initialTab="stay" />;
}

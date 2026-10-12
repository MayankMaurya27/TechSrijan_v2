import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Accommodation & Stay | Admin Portal | TechSrijan'27",
  description: "Campus accommodation inventory and guest bookings.",
  robots: { index: false, follow: false },
};

export default function AdminStayPage() {
  return <AdminPortal initialTab="stay" />;
}

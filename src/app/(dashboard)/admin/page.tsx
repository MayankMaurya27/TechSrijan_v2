import type { Metadata } from "next";
import { AdminPortal } from "@/domains/admin";

export const metadata: Metadata = {
  title: "Admin Portal | TechSrijan'27",
  description: "Festival events and administration portal for TechSrijan'27.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}

import type { Metadata } from "next";
import { StudentDashboard } from "@/domains/student";

export const metadata: Metadata = {
  title: "Student Dashboard | TechSrijan'27",
  description: "Participant dashboard and digital access pass for TechSrijan'27 attendees.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}

import { Metadata } from "next";
import { ProfileView } from "@/domains/profile";

export const metadata: Metadata = {
  title: "Participant Profile",
  robots: { index: false, follow: false },
  description:
    "View and manage your official TechSrijan '27 participant credentials, event registrations, accommodation allotment, and arena points.",
};

export default function ProfilePage() {
  return <ProfileView />;
}

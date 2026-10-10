import type { Metadata } from "next";
import { OnboardingView } from "@/domains/auth";

export const metadata: Metadata = {
  title: "Profile Onboarding · Complete Your Profile | TechSrijan'27",
  description:
    "Complete your TechSrijan'27 event profile. Connect your institution, department, and contact details to access competitions and hackathons.",
};

export default function OnboardingPage() {
  return <OnboardingView />;
}

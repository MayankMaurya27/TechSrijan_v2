import type { Metadata } from "next";
import { AccommodationView } from "@/domains/accommodation";

export const metadata: Metadata = {
  title: "Accommodation & Hostel Passes",
  description: "Secure on-campus residence and hostel passes for outstation participants attending TechSrijan'27 at MMMUT Gorakhpur.",
  alternates: {
    canonical: "/accommodation",
  },
  openGraph: {
    title: "Accommodation | TechSrijan'27",
    description: "On-campus hostel accommodations for TechSrijan'27 participants at MMMUT Gorakhpur.",
    url: "/accommodation",
  },
};

export default function AccommodationPage() {
  return <AccommodationView />;
}

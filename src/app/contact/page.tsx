import type { Metadata } from "next";
import { ContactView } from "@/domains/contact";

export const metadata: Metadata = {
  title: "Contact The Council",
  description:
    "Reach the Technical Sub Council (TSC) for events, sponsorship, accommodation or media queries for TechSrijan'27 at MMMUT Gorakhpur. Response within 24–48 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | TechSrijan'27",
    description:
      "Open a channel with the TechSrijan'27 council — events, sponsorship, media and support desks at MMMUT Gorakhpur.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactView />;
}

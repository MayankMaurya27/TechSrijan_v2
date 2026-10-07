import type { Metadata } from "next";
import { ContactView } from "@/domains/contact";

export const metadata: Metadata = {
  title: "Contact Directives & Council Comms | TechSrijan'27",
  description:
    "Official communication relay, venue coordinates, and secretarial support channels for TechSrijan'27 at MMMUT Gorakhpur. Response within 24–48 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Directives & Support | TechSrijan'27",
    description:
      "Official contact directives, campus coordinates, and secretarial support channels for TechSrijan'27 MMMUT Gorakhpur.",
    url: "/contact",
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Directives & Support | TechSrijan'27",
    description:
      "Official contact directives, venue coordinates, and secretarial support channels for TechSrijan'27 MMMUT Gorakhpur.",
  },
};

export default function ContactPage() {
  return <ContactView />;
}

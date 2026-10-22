import type { Metadata } from "next";
import { ContactView } from "@/domains/contact";

export const metadata: Metadata = {
  title: "Contact & Secretariat — TechSrijan MMMUT Gorakhpur",
  description:
    "Official communication desks, campus transit guide, and direct inquiry support for TechSrijan'27 at MMMUT Gorakhpur. Response within 24–48 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Secretariat | TechSrijan'27",
    description:
      "Official communication desks, campus transit guide, and direct inquiry support for TechSrijan'27 MMMUT Gorakhpur.",
    url: "/contact",
    images: ["/opengraph-image.jpg"],
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Secretariat | TechSrijan'27",
    description:
      "Official communication desks, campus transit guide, and direct inquiry support for TechSrijan'27 MMMUT Gorakhpur.",
  },
};

export default function ContactPage() {
  return <ContactView />;
}

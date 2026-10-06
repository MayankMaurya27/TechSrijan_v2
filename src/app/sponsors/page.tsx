import type { Metadata } from "next";
import { SponsorsPageView } from "@/domains/sponsors";

export const metadata: Metadata = {
  title: "Corporate Sponsors & Patrons",
  description: "Official corporate partners and sponsors supporting TechSrijan'27 IMPERIUM: REQUIEM at MMMUT Gorakhpur.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: "Corporate Sponsors & Patrons | TechSrijan'27",
    description: "Official corporate partners and sponsors supporting TechSrijan'27 IMPERIUM: REQUIEM at MMMUT Gorakhpur.",
    url: "/sponsors",
    siteName: "TechSrijan'27",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Sponsors & Patrons | TechSrijan'27",
    description: "Official corporate partners and sponsors supporting TechSrijan'27 IMPERIUM: REQUIEM at MMMUT Gorakhpur.",
  },
};

export default function SponsorsPage() {
  return <SponsorsPageView />;
}

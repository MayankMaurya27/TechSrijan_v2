import type { Metadata } from "next";

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: "Developers",
  description:
    "Meet the student developers who built the TechSrijan'27 website for MMMUT Gorakhpur's annual techfest.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Developers | TechSrijan'27",
    description:
      "Meet the student developers who built the TechSrijan'27 website for MMMUT Gorakhpur's annual techfest.",
    url: "/developers",
    // A segment-level openGraph replaces the root one, so the default share image is repeated here
    images: ["/opengraph-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

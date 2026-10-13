import type { Metadata } from "next";

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: "Accommodation in Gorakhpur — Stay at MMMUT",
  description:
    "Book on-campus accommodation at MMMUT Gorakhpur for TechSrijan'27 (25–27 December 2026): secured residence, Wi-Fi, meals and on-ground support for outstation participants.",
  alternates: {
    canonical: "/accommodation",
  },
  openGraph: {
    title: "Accommodation in Gorakhpur — Stay at MMMUT | TechSrijan'27",
    description:
      "Book on-campus accommodation at MMMUT Gorakhpur for TechSrijan'27 (25–27 December 2026): secured residence, Wi-Fi, meals and on-ground support for outstation participants.",
    url: "/accommodation",
    // A segment-level openGraph replaces the root one, so the default share image is repeated here
    images: ["/opengraph-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

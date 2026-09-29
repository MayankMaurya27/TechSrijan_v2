import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "TechSrijan — IMPERIUM: REQUIEM",
  description: "The definitive university tech fest platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="arrakis" suppressHydrationWarning>
      <body className="antialiased min-h-screen selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
        <ThemeProvider>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

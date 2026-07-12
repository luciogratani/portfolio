import type { Metadata } from "next";
import "./globals.css";

// Root layout: tiene solo ciò che è davvero globale (Tailwind via globals.css)
// e la shell <html>/<body>. Le import CSS specifiche del portfolio stanno nel
// route group (portfolio) — vedi src/app/(portfolio)/layout.tsx — così NON
// caricano su /projects/gigi, che ha scroll (Lenis) e regole tutte sue.
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio — demo interattive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

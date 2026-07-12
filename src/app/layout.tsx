import type { Metadata } from "next";
import "./globals.css";
import "./underlay-nav.css";
import "./crisp-hero.css";
import "./sections.css";
import "./demo-site.css";

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

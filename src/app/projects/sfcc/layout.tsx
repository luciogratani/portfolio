import type { Metadata } from "next";
import { geistSans, geistMono } from "@/fonts/sfcc-fonts";
import "./sfcc.css";

// Layout della route /projects/sfcc: wrapper `.sfcc-root` con i font Geist e il
// tema (bg/testo). Nessun provider (il template non usa lenis/carrello nella
// versione decoupled). Isolato dal portfolio: i CSS del portfolio sono importati
// solo nel route-group (portfolio), quindi non arrivano qui.
export const metadata: Metadata = {
  title: "SFCC Store — demo",
  description:
    "Vetrina e-commerce (SFCC template) — demo con dati mock, senza carrello.",
};

export default function SfccLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`sfcc-root ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
